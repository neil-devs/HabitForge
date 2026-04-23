const bcrypt = require('bcryptjs');
const db = require('../../config/database');
const { BCRYPT_ROUNDS } = require('../../config/auth');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../utils/tokenHelpers');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

  async googleLogin(credential) {
    if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID.includes('your_google_client_id')) {
      const error = new Error('Google Authentication is not fully configured on the server yet.');
      error.statusCode = 500;
      throw error;
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists by email
    let result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    let user;

    if (result.rows.length > 0) {
      user = result.rows[0];
      // Link google_id if not linked
      if (!user.google_id) {
        await db.query('UPDATE users SET google_id = $1, auth_provider = $2 WHERE id = $3', [googleId, 'google', user.id]);
        user.google_id = googleId;
        user.auth_provider = 'google';
      }
    } else {
      // Create new user
      let username = email.split('@')[0];
      const checkUsername = await db.query('SELECT id FROM users WHERE username = $1', [username]);
      if (checkUsername.rows.length > 0) {
        username = `${username}${Math.floor(Math.random() * 10000)}`;
      }

      const insertResult = await db.query(
        'INSERT INTO users (email, username, display_name, avatar_url, google_id, auth_provider) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [email, username, name, picture, googleId, 'google']
      );
      user = insertResult.rows[0];
    }

    await db.query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    delete user.password_hash;
    return { user, accessToken, refreshToken };
  }
}

module.exports = new AuthService();
