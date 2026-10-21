process.env.NODE_ENV = 'test';
process.env.BCRYPT_SALT_ROUNDS = '4';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.JWT_ACCESS_SECRET = 'test_access';
process.env.JWT_REFRESH_SECRET = 'test_refresh';

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const request = require('supertest');
const nodemailer = require('nodemailer');

// ---- In-memory fake of the pg Pool (matches by SQL fragment) ----
const state = { users: [], refresh: [], resets: [] };
const sha = (t) => crypto.createHash('sha256').update(t).digest('hex');
let seq = 0;
const uid = () => `00000000-0000-4000-8000-${String(++seq).padStart(12, '0')}`;

function handle(sql, p = []) {
  const has = (s) => sql.includes(s);
  if (has('SELECT id FROM users WHERE email')) return state.users.filter((u) => u.email === p[0]).map((u) => ({ id: u.id }));
  if (has('INSERT INTO users')) {
    const u = { id: uid(), email: p[0], password_hash: p[1], first_name: p[2], last_name: p[3], role: 'customer', status: 'active', failed_login_attempts: 0, locked_until: null };
    state.users.push(u);
    return [u];
  }
  if (has('SELECT * FROM users WHERE email')) return state.users.filter((u) => u.email === p[0]);
  if (has('SELECT id, email, status FROM users')) return state.users.filter((u) => u.email === p[0]);
  if (has('SELECT * FROM users WHERE id')) return state.users.filter((u) => u.id === p[0] && u.status === 'active');
  if (has('failed_login_attempts = COALESCE')) {
    const u = state.users.find((x) => x.id === p[0]);
    u.failed_login_attempts += 1;
    if (u.failed_login_attempts >= p[1]) u.locked_until = new Date(Date.now() + 900000);
    return [];
  }
  if (has('SET last_login_at')) return [];
  if (has('INSERT INTO refresh_tokens')) {
    state.refresh.push({ id: uid(), user_id: p[0], token_hash: p[1], expires_at: p[2], revoked_at: null });
    return [];
  }
  if (has('FROM refresh_tokens') && has('SELECT id')) {
    return state.refresh
      .filter((r) => r.user_id === p[0] && r.token_hash === p[1] && !r.revoked_at && r.expires_at > new Date())
      .map((r) => ({ id: r.id }));
  }
  if (has('UPDATE refresh_tokens SET revoked_at = NOW() WHERE id')) {
    const r = state.refresh.find((x) => x.id === p[0] && !x.revoked_at);
    if (r) { r.revoked_at = new Date(); return [{ id: r.id }]; }
    return [];
  }
  if (has('UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id')) {
    state.refresh.filter((r) => r.user_id === p[0] && !r.revoked_at).forEach((r) => { r.revoked_at = new Date(); });
    return [];
  }
  if (has('UPDATE password_resets SET used_at = NOW() WHERE user_id')) {
    state.resets.filter((r) => r.user_id === p[0] && !r.used_at).forEach((r) => { r.used_at = new Date(); });
    return [];
  }
  if (has('INSERT INTO password_resets')) {
    state.resets.push({ user_id: p[0], token_hash: p[1], expires_at: new Date(Date.now() + Number(p[2]) * 60000), used_at: null });
    return [];
  }
  if (has('UPDATE password_resets SET used_at = NOW()')) {
    const r = state.resets.find((x) => x.token_hash === p[0] && !x.used_at && x.expires_at > new Date());
    if (!r) return [];
    r.used_at = new Date();
    return [{ user_id: r.user_id }];
  }
  if (has('UPDATE users SET password_hash')) {
    const u = state.users.find((x) => x.id === p[1]);
    u.password_hash = p[0];
    return [{ email: u.email }];
  }
  return [];
}

let failFragment = null;
const mockQuery = jest.fn(async (sql, params) => {
  if (failFragment && sql.includes(failFragment)) {
    throw Object.assign(new Error('relation "refresh_tokens" does not exist'), { code: '42P01' });
  }
  return { rows: handle(sql, params) };
});
const mockClient = {
  query: jest.fn(async (sql, params) => (/^(BEGIN|COMMIT|ROLLBACK)/.test(sql) ? { rows: [] } : mockQuery(sql, params))),
  release: jest.fn()
};
jest.mock('../src/config/database', () => ({
  query: (...a) => mockQuery(...a),
  connect: async () => mockClient
}));

const mailer = require('../src/utils/mailer');

const sent = [];
const transport = nodemailer.createTransport({ jsonTransport: true });
const realSend = transport.sendMail.bind(transport);
transport.sendMail = async (m) => { sent.push(m); return realSend(m); };
mailer.setTransporter(transport);

const authRoutes = require('../src/auth/auth.routes');
const { errorHandler } = require('../src/middleware/errorHandler');
const { runMigrations } = require('../src/config/migrate');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

const waitFor = async (fn) => {
  for (let i = 0; i < 50 && !fn(); i += 1) await new Promise((r) => setTimeout(r, 10));
};
const tokenFrom = (msg) => /token=([a-f0-9]{64})/.exec(msg.text)[1];
const reg = (email, password = 'Passw0rdX') =>
  request(app).post('/api/auth/register').send({ email, password, firstName: 'A', lastName: 'B' });

beforeEach(() => { sent.length = 0; failFragment = null; });

describe('register + login', () => {
  test('register creates a customer; duplicate gives 409', async () => {
    const r = await reg('reg@example.com');
    expect(r.status).toBe(201);
    expect(r.body.user.role).toBe('customer');
    expect((await reg('reg@example.com')).status).toBe(409);
  });

  test('login returns token, httpOnly cookie, and stores hashed refresh token', async () => {
    await reg('login@example.com');
    const r = await request(app).post('/api/auth/login').send({ email: 'login@example.com', password: 'Passw0rdX' });
    expect(r.status).toBe(200);
    expect(r.body.accessToken).toBeTruthy();
    const cookie = r.headers['set-cookie'][0];
    expect(cookie).toMatch(/refreshToken=/);
    expect(cookie).toMatch(/HttpOnly/);
    expect(cookie).toMatch(/SameSite=Lax/);
    const raw = /refreshToken=([^;]+)/.exec(cookie)[1];
    expect(state.refresh.some((x) => x.token_hash === sha(raw))).toBe(true);
  });

  test('wrong password gives 401; refresh rotates and old token is rejected', async () => {
    await reg('rot@example.com');
    expect((await request(app).post('/api/auth/login').send({ email: 'rot@example.com', password: 'nope' })).status).toBe(401);
    const l = await request(app).post('/api/auth/login').send({ email: 'rot@example.com', password: 'Passw0rdX' });
    const c1 = l.headers['set-cookie'][0].split(';')[0];
    const r1 = await request(app).post('/api/auth/refresh').set('Cookie', c1);
    expect(r1.status).toBe(200);
    expect((await request(app).post('/api/auth/refresh').set('Cookie', c1)).status).toBe(401);
  });

  test('DB failure on login is 500 "Login failed" without detail outside development', async () => {
    await reg('dbfail@example.com');
    failFragment = 'INSERT INTO refresh_tokens';
    const r = await request(app).post('/api/auth/login').send({ email: 'dbfail@example.com', password: 'Passw0rdX' });
    expect(r.status).toBe(500);
    expect(r.body.error).toBe('Login failed');
    expect(r.body.detail).toBeUndefined();
  });
});

describe('forgot-password', () => {
  const MSG = 'If an account exists, a reset link has been sent';

  test('existing and unknown emails get the identical response; only existing is emailed', async () => {
    await reg('exists@example.com');
    const a = await request(app).post('/api/auth/forgot-password').send({ email: 'exists@example.com' });
    const b = await request(app).post('/api/auth/forgot-password').send({ email: 'ghost@example.com' });
    expect(a.status).toBe(200);
    expect(b.status).toBe(200);
    expect(a.body).toEqual({ message: MSG });
    expect(b.body).toEqual(a.body);
    await waitFor(() => sent.length > 0);
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe('exists@example.com');
    expect(sent[0].subject).toMatch(/KB Cloud Technologies/);
    expect(sent[0].text).toMatch(/30 minutes/);
    expect(sent[0].html).toMatch(/auth\/reset-password\?token=/);
    const token = tokenFrom(sent[0]);
    expect(state.resets.some((r) => r.token_hash === sha(token))).toBe(true);
    expect(JSON.stringify(state.resets)).not.toContain(token);
  });

  test('new request invalidates the older unused token', async () => {
    await reg('twice@example.com');
    await request(app).post('/api/auth/forgot-password').send({ email: 'twice@example.com' });
    await waitFor(() => sent.length === 1);
    await request(app).post('/api/auth/forgot-password').send({ email: 'twice@example.com' });
    await waitFor(() => sent.length === 2);
    const old = await request(app).post('/api/auth/reset-password').send({ token: tokenFrom(sent[0]), password: 'Brandnew123' });
    expect(old.status).toBe(400);
    const fresh = await request(app).post('/api/auth/reset-password').send({ token: tokenFrom(sent[1]), password: 'Brandnew123' });
    expect(fresh.status).toBe(200);
  });

  test('rate limited after 5 requests per IP+email', async () => {
    let last;
    for (let i = 0; i < 6; i += 1) {
      last = await request(app).post('/api/auth/forgot-password').send({ email: 'spam@example.com' });
    }
    expect(last.status).toBe(429);
    expect(last.body.code).toBe('RATE_LIMITED');
  });
});

describe('reset-password', () => {
  async function issue(email) {
    await reg(email);
    sent.length = 0;
    await request(app).post('/api/auth/forgot-password').send({ email });
    await waitFor(() => sent.length > 0);
    return tokenFrom(sent[0]);
  }

  test('valid token: changes password, revokes all refresh tokens, cannot be reused', async () => {
    const token = await issue('reset@example.com');
    await request(app).post('/api/auth/login').send({ email: 'reset@example.com', password: 'Passw0rdX' });
    const r = await request(app).post('/api/auth/reset-password').send({ token, password: 'Newpass123' });
    expect(r.status).toBe(200);
    const user = state.users.find((u) => u.email === 'reset@example.com');
    expect(state.refresh.filter((x) => x.user_id === user.id).every((x) => x.revoked_at)).toBe(true);
    const oldPw = await request(app).post('/api/auth/login').send({ email: 'reset@example.com', password: 'Passw0rdX' });
    expect(oldPw.status).toBe(401);
    const newPw = await request(app).post('/api/auth/login').send({ email: 'reset@example.com', password: 'Newpass123' });
    expect(newPw.status).toBe(200);
    await waitFor(() => sent.some((m) => /changed/.test(m.subject)));
    expect(sent.some((m) => /changed/.test(m.subject))).toBe(true);
    const again = await request(app).post('/api/auth/reset-password').send({ token, password: 'Another123' });
    expect(again.status).toBe(400);
    expect(again.body.code).toBe('INVALID_OR_EXPIRED_TOKEN');
  });

  test('expired token is rejected', async () => {
    const token = await issue('expired@example.com');
    state.resets.find((x) => x.token_hash === sha(token)).expires_at = new Date(Date.now() - 1000);
    const r = await request(app).post('/api/auth/reset-password').send({ token, password: 'Newpass123' });
    expect(r.status).toBe(400);
    expect(r.body.code).toBe('INVALID_OR_EXPIRED_TOKEN');
  });

  test('unknown token is rejected', async () => {
    const r = await request(app).post('/api/auth/reset-password').send({ token: 'a'.repeat(64), password: 'Newpass123' });
    expect(r.status).toBe(400);
    expect(r.body.code).toBe('INVALID_OR_EXPIRED_TOKEN');
  });

  test.each(['short1', 'onlyletters', '12345678'])('weak password %s is rejected', async (password) => {
    const r = await request(app).post('/api/auth/reset-password').send({ token: 'a'.repeat(64), password });
    expect(r.status).toBe(400);
    expect(r.body.code).toBe('WEAK_PASSWORD');
  });
});

describe('migration runner', () => {
  function fakeDb(alreadyApplied = [], failOn) {
    const client = {
      query: jest.fn(async (sql) => {
        if (failOn && sql.includes(failOn)) throw new Error('boom');
        return { rows: [] };
      }),
      release: jest.fn()
    };
    return {
      client,
      query: jest.fn(async (sql) => (sql.includes('SELECT name') ? { rows: alreadyApplied.map((name) => ({ name })) } : { rows: [] })),
      connect: async () => client
    };
  }
  const mk = (files) => {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'mig-'));
    Object.entries(files).forEach(([f, c]) => fs.writeFileSync(path.join(d, f), c));
    return d;
  };

  test('applies in name order, once, each in a transaction', async () => {
    const dir = mk({ '002_b.sql': '-- x', '001_a.sql': '-- y', 'notes.txt': 'ignored' });
    const d = fakeDb();
    expect(await runMigrations(d, dir)).toEqual(['001_a.sql', '002_b.sql']);
    const calls = d.client.query.mock.calls.map((c) => c[0]);
    expect(calls.filter((c) => c === 'BEGIN')).toHaveLength(2);
    expect(calls.filter((c) => c === 'COMMIT')).toHaveLength(2);
    const inserts = d.client.query.mock.calls.filter((c) => c[0].includes('INSERT INTO schema_migrations')).map((c) => c[1][0]);
    expect(inserts).toEqual(['001_a.sql', '002_b.sql']);

    const d2 = fakeDb(['001_a.sql', '002_b.sql']);
    expect(await runMigrations(d2, dir)).toEqual([]);
    expect(d2.client.query).not.toHaveBeenCalled();
  });

  test('failure rolls back and names the failing migration', async () => {
    const dir = mk({ '001_a.sql': '-- ok', '002_b.sql': '-- FAILME' });
    const d = fakeDb([], 'FAILME');
    await expect(runMigrations(d, dir)).rejects.toThrow(/002_b\.sql/);
    const calls = d.client.query.mock.calls.map((c) => c[0]);
    expect(calls).toContain('ROLLBACK');
    expect(calls.filter((c) => c === 'COMMIT')).toHaveLength(1);
    expect(d.client.release).toHaveBeenCalledTimes(2);
  });

  test('real migration files sort 001, 002, 003, ...', async () => {
    const d = fakeDb();
    const applied = await runMigrations(d);
    expect(applied).toEqual([...applied].sort());
    expect(applied[0]).toBe('001_init.sql');
    expect(applied).toContain('003_password_resets.sql');
  });
});
