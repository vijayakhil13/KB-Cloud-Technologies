/**
 * Auth service — real implementation.
 * Handles user registration, login, token issuing/rotation and logout
 * against the PostgreSQL `users` and `refresh_tokens` tables.
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

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
  jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

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

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    throw new Error('Invalid email or password');
  }

  if (user.status !== 'active') {
    throw new Error('Account is not active');
  }

  await db.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

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

  // Rotate: revoke the used token, issue a new pair.
  await db.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1', [
    stored.rows[0].id
  ]);

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

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  verifyAccessToken
};
