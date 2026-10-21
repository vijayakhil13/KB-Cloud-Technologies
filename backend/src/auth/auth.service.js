/**
 * Auth service — real implementation.
 * Handles user registration, login, token issuing/rotation and logout
 * against the PostgreSQL `users` and `refresh_tokens` tables.
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const logger = require('../utils/logger');
const mailer = require('../utils/mailer');

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
const RESET_TOKEN_MINUTES = 30;

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me';
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '30m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const mapUser = (row) => ({
  id: row.id,
  email: row.email,
  firstName: row.first_name,
  lastName: row.last_name,
  role: row.role,
  status: row.status
});

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const signAccessToken = (user) =>
  jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );

const signRefreshToken = (user) =>
  jwt.sign({ userId: user.id, jti: crypto.randomUUID() }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

async function storeRefreshToken(userId, refreshToken) {
  const decoded = jwt.decode(refreshToken);
  await db.query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [userId, hashToken(refreshToken), new Date(decoded.exp * 1000)]
  );
}

/**
 * @returns {Promise<{id, email, firstName, lastName, role, status}>}
 */
async function register({ email, password, firstName, lastName }) {
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new Error('User with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await db.query(
    `INSERT INTO users (email, password_hash, first_name, last_name, role)
     VALUES ($1, $2, $3, $4, 'customer')
     RETURNING id, email, first_name, last_name, role, status, created_at`,
    [email, passwordHash, firstName, lastName]
  );
  return mapUser(result.rows[0]);
}

/**
 * @returns {Promise<{user, accessToken, refreshToken}>}
 */
async function login({ email, password }) {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    const err = new Error('Account temporarily locked. Try again later.');
    err.code = 'ACCOUNT_LOCKED';
    throw err;
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    // Lockout bookkeeping must never turn a 401 into a 500.
    try {
      await db.query(
        `UPDATE users SET failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1,
           locked_until = CASE WHEN COALESCE(failed_login_attempts, 0) + 1 >= $2
             THEN NOW() + ($3 || ' minutes')::interval ELSE locked_until END
         WHERE id = $1`,
        [user.id, MAX_FAILED_ATTEMPTS, String(LOCK_MINUTES)]
      );
    } catch (e) {
      logger.warn(`Could not record failed login attempt: ${e.message}`);
    }
    throw new Error('Invalid email or password');
  }

  if (user.status !== 'active') {
    throw new Error('Account is not active');
  }

  await db.query(
    'UPDATE users SET last_login_at = NOW(), failed_login_attempts = 0, locked_until = NULL WHERE id = $1',
    [user.id]
  );

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await storeRefreshToken(user.id, refreshToken);

  return { user: mapUser(user), accessToken, refreshToken };
}

/**
 * Verifies a refresh token, rotates it and returns a fresh token pair.
 * @returns {Promise<{accessToken, refreshToken}>}
 */
async function refreshAccessToken(refreshToken) {
  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_SECRET);
  } catch (err) {
    throw new Error('Invalid refresh token or user no longer active');
  }

  const stored = await db.query(
    `SELECT id FROM refresh_tokens
     WHERE user_id = $1 AND token_hash = $2 AND revoked_at IS NULL AND expires_at > NOW()`,
    [payload.userId, hashToken(refreshToken)]
  );
  if (stored.rows.length === 0) {
    throw new Error('Invalid refresh token or user no longer active');
  }

  const userResult = await db.query(
    "SELECT * FROM users WHERE id = $1 AND status = 'active'",
    [payload.userId]
  );
  const user = userResult.rows[0];
  if (!user) {
    throw new Error('Invalid refresh token or user no longer active');
  }

  // Rotate atomically: only one concurrent request can revoke the token.
  const revoked = await db.query(
    'UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1 AND revoked_at IS NULL RETURNING id',
    [stored.rows[0].id]
  );
  if (revoked.rows.length === 0) {
    throw new Error('Invalid refresh token or user no longer active');
  }

  const accessToken = signAccessToken(user);
  const newRefreshToken = signRefreshToken(user);
  await storeRefreshToken(user.id, newRefreshToken);

  return { accessToken, refreshToken: newRefreshToken };
}

async function logout(userId) {
  await db.query(
    'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL',
    [userId]
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

/**
 * Creates a reset token and emails it. Callers always send the same response
 * regardless of the result. Errors are thrown for the caller to log.
 */
async function forgotPassword(email) {
  const result = await db.query('SELECT id, email, status FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user || user.status !== 'active') return false;

  const token = crypto.randomBytes(32).toString('hex');
  await db.query(
    'UPDATE password_resets SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL',
    [user.id]
  );
  await db.query(
    `INSERT INTO password_resets (user_id, token_hash, expires_at)
     VALUES ($1, $2, NOW() + ($3 || ' minutes')::interval)`,
    [user.id, hashToken(token), String(RESET_TOKEN_MINUTES)]
  );

  const base = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '');
  await mailer.sendPasswordResetEmail(
    user.email,
    `${base}/auth/reset-password?token=${token}`,
    RESET_TOKEN_MINUTES
  );
  return true;
}

/**
 * @throws Error with code INVALID_OR_EXPIRED_TOKEN when the token is unknown/expired/used.
 */
async function resetPassword(token, newPassword) {
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  const client = await db.connect();
  let email;
  try {
    await client.query('BEGIN');
    // Claim the token atomically (prevents double use under concurrency).
    const claimed = await client.query(
      `UPDATE password_resets SET used_at = NOW()
       WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()
       RETURNING user_id`,
      [hashToken(token)]
    );
    if (claimed.rows.length === 0) {
      const err = new Error('Invalid or expired reset token');
      err.code = 'INVALID_OR_EXPIRED_TOKEN';
      throw err;
    }
    const userId = claimed.rows[0].user_id;

    const updated = await client.query(
      `UPDATE users SET password_hash = $1, updated_at = NOW(),
         failed_login_attempts = 0, locked_until = NULL
       WHERE id = $2 RETURNING email`,
      [passwordHash, userId]
    );
    email = updated.rows[0] && updated.rows[0].email;
    await client.query(
      'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL',
      [userId]
    );
    await client.query('COMMIT');
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch (_) { /* ignore */ }
    throw err;
  } finally {
    client.release();
  }

  if (email) {
    mailer.sendPasswordChangedEmail(email).catch((e) =>
      logger.warn(`Password-changed email failed: ${e.message}`)
    );
  }
}

module.exports = {
  forgotPassword,
  resetPassword,
  register,
  login,
  refreshAccessToken,
  logout,
  verifyAccessToken
};
