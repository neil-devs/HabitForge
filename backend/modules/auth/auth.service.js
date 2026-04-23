const bcrypt = require('bcryptjs');
const db = require('../../config/database');
const { BCRYPT_ROUNDS } = require('../../config/auth');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../utils/tokenHelpers');

class AuthService {
  async register(email, username, password) {
    const checkUser = await db.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (checkUser.rows.length > 0) {
      const error = new Error('Email or username already in use');
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await db.query(
      'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username, role',
      [email, username, passwordHash]
    );

    const user = result.rows[0];
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { user, accessToken, refreshToken };
  }

  async login(email, password) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Update last login
    await db.query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    delete user.password_hash;
    return { user, accessToken, refreshToken };
  }

  async refreshToken(token) {
    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      const error = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      throw error;
    }

    const result = await db.query('SELECT id, email, username, role FROM users WHERE id = $1', [decoded.id]);
    if (result.rows.length === 0) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const user = result.rows[0];
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    return { accessToken, refreshToken: newRefreshToken };
  }
}

module.exports = new AuthService();
