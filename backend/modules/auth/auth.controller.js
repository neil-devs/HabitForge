const authService = require('./auth.service');
const { sendSuccess } = require('../../utils/response');

class AuthController {
  async register(req, res) {
    const { email, username, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.register(email, username, password);
    
    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return sendSuccess(res, { user, accessToken }, 'Registration successful', 201);
  }

  async login(req, res) {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(email, password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return sendSuccess(res, { user, accessToken }, 'Login successful');
  }

  async refreshToken(req, res) {
    const { refreshToken: tokenFromBody } = req.body;
    const tokenFromCookie = req.cookies?.refreshToken;
    const token = tokenFromBody || tokenFromCookie;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Refresh token required' });
    }

    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(token);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return sendSuccess(res, { accessToken, refreshToken: newRefreshToken }, 'Token refreshed');
  }

  async logout(req, res) {
    res.clearCookie('refreshToken');
    return sendSuccess(res, null, 'Logged out successfully');
  }

  async getMe(req, res) {
    // Current user is injected by authenticate middleware
    const db = require('../../config/database');
    const result = await db.query('SELECT id, email, username, display_name, avatar_url, bio, timezone, theme_preference, sound_enabled, xp_total, level, role, created_at FROM users WHERE id = $1', [req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    return sendSuccess(res, { user: result.rows[0] }, 'Current user retrieved');
  }
}

module.exports = new AuthController();
