const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/database');

class AuthService {
  static async register(userData) {
    const { email, password, firstName, lastName } = userData;

    const existingUser = await db.oneOrNone(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await db.one(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name, role, status, created_at`,
      [email, passwordHash, firstName, lastName, 'customer', 'active']
    );

    return newUser;
  }

  static async login(loginData) {
    const { email, password } = loginData;

    const user = await db.oneOrNone(
      'SELECT id, email, password_hash, first_name, last_name, role, status FROM users WHERE email = $1',
      [email]
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    if (user.status !== 'active') {
      throw new Error('Account is not active');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await db.none(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    const { password_hash, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    };
  }

  static generateAccessToken(user) {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN } // 30m
    );
  }

  static generateRefreshToken(user) {
    return jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN } // 7d
    );
  }

  static verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  }

  static verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  }

  static async refreshAccessToken(refreshToken) {
    const payload = this.verifyRefreshToken(refreshToken);

    const user = await db.oneOrNone(
      'SELECT id, email, role, status FROM users WHERE id = $1 AND status = $2',
      [payload.userId, 'active']
    );

    if (!user) {
      throw new Error('Invalid refresh token or user no longer active');
    }

    const newAccessToken = this.generateAccessToken(user);
    return { accessToken: newAccessToken };
  }

  static async logout(userId) {
    return;
  }
}

module.exports = AuthService;