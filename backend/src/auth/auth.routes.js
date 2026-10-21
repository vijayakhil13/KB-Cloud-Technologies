const express = require('express');
const router = express.Router();
const AuthService = require('./auth.service');
const { authenticateToken, authorizeRole } = require('./auth.middleware');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const logger = require('../utils/logger');
const { rateLimit } = require('../middleware/rateLimit');

const isDev = () => process.env.NODE_ENV === 'development';
const errorDetail = (error) => (isDev() ? { detail: error.message } : {});

// Frontend (localhost:3000) and API (localhost:5000) are same-site, so 'lax' works and
// is sent on credentialed fetches. Path is scoped to the auth routes.
const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/auth'
});

const limitLogin = rateLimit({ name: 'login', points: 10, durationSec: 15 * 60, keyByEmail: true });
const limitRegister = rateLimit({ name: 'register', points: 10, durationSec: 60 * 60 });
const limitForgot = rateLimit({ name: 'forgot', points: 5, durationSec: 15 * 60, keyByEmail: true });
const limitReset = rateLimit({ name: 'reset', points: 10, durationSec: 15 * 60 });
const limitRefresh = rateLimit({ name: 'refresh', points: 60, durationSec: 15 * 60 });

const validateForgot = [body('email').isEmail().normalizeEmail()];
const validateReset = [
  body('token').isString().isLength({ min: 10, max: 256 }),
  body('password')
    .isString().isLength({ min: 8, max: 128 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Za-z]/).withMessage('Password must contain at least one letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
];

const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').isLength({ min: 1, max: 50 }).trim(),
  body('lastName').isLength({ min: 1, max: 50 }).trim()
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 })
];

router.post('/register', limitRegister, validateRegister, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userData = {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    };

    const result = await AuthService.register(userData);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.id,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        role: result.role
      }
    });
  } catch (error) {
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ error: error.message });
    }
    if (error.code === '23505') {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    logger.error('Registration error', error);
    res.status(500).json({ error: 'Registration failed', ...errorDetail(error) });
  }
});

router.post('/login', limitLogin, validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const loginData = {
      email: req.body.email,
      password: req.body.password
    };

    const result = await AuthService.login(loginData);

    res.cookie('refreshToken', result.refreshToken, {
      ...refreshCookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful',
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (error) {
    if (error.message === 'Invalid email or password' ||
        error.message === 'Account is not active') {
      return res.status(401).json({ error: error.message });
    }
    if (error.code === 'ACCOUNT_LOCKED') {
      return res.status(423).json({ error: error.message, code: 'ACCOUNT_LOCKED' });
    }
    logger.error('Login error', error);
    res.status(500).json({ error: 'Login failed', ...errorDetail(error) });
  }
});

router.post('/refresh', limitRefresh, async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Refresh token required',
        code: 'MISSING_REFRESH_TOKEN'
      });
    }

    const result = await AuthService.refreshAccessToken(refreshToken);

    res.cookie('refreshToken', result.refreshToken, {
      ...refreshCookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Token refreshed successfully',
      accessToken: result.accessToken
    });
  } catch (error) {
    if (error.message === 'Invalid refresh token or user no longer active') {
      return res.status(401).json({ error: error.message });
    }
    logger.warn(`Token refresh rejected: ${error.message}`);
    res.clearCookie('refreshToken', refreshCookieOptions());
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

router.post('/logout', authenticateToken, async (req, res) => {
  try {
    res.clearCookie('refreshToken', refreshCookieOptions());

    await AuthService.logout(req.user.userId);

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error', error);
    res.status(500).json({ error: 'Logout failed', ...errorDetail(error) });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, first_name, last_name, role, status, created_at, last_login_at FROM users WHERE id = $1',
      [req.user.userId]
    );
    const row = result.rows[0];

    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        role: row.role,
        status: row.status,
        createdAt: row.created_at,
        lastLoginAt: row.last_login_at
      }
    });
  } catch (error) {
    logger.error('Get user error', error);
    res.status(500).json({ error: 'Failed to fetch user', ...errorDetail(error) });
  }
});

const FORGOT_MESSAGE = 'If an account exists, a reset link has been sent';

router.post('/forgot-password', limitForgot, validateForgot, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Work happens after the response so timing is identical for existing/unknown emails.
  AuthService.forgotPassword(req.body.email).catch((error) =>
    logger.error('Forgot-password error', error)
  );
  res.status(200).json({ message: FORGOT_MESSAGE });
});

router.post('/reset-password', limitReset, validateReset, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const list = errors.array();
    const pw = list.find((e) => e.path === 'password');
    return res.status(400).json({
      error: pw ? pw.msg : 'Invalid request',
      code: pw ? 'WEAK_PASSWORD' : 'VALIDATION_ERROR',
      errors: list
    });
  }
  try {
    await AuthService.resetPassword(req.body.token, req.body.password);
    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    if (error.code === 'INVALID_OR_EXPIRED_TOKEN') {
      return res.status(400).json({
        error: 'This reset link is invalid or has expired',
        code: 'INVALID_OR_EXPIRED_TOKEN'
      });
    }
    logger.error('Reset-password error', error);
    res.status(500).json({ error: 'Password reset failed', ...errorDetail(error) });
  }
});

module.exports = router;