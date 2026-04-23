const usersService = require('./users.service');
const { sendSuccess } = require('../../utils/response');

class UsersController {
  async getProfile(req, res) {
    const profile = await usersService.getProfile(req.user.id);
    return sendSuccess(res, profile, 'Profile retrieved successfully');
  }

  async searchUsers(req, res) {
    const { q } = req.query;
    if (!q || q.length < 3) return sendSuccess(res, [], 'Query too short');
    const users = await usersService.searchUsers(req.user.id, q);
    return sendSuccess(res, users, 'Users retrieved');
  }

  async updateProfile(req, res) {
    const updatedProfile = await usersService.updateProfile(req.user.id, req.body);
    return sendSuccess(res, updatedProfile, 'Profile updated successfully');
  }

  async uploadAvatar(req, res) {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }
    
    // Construct the public URL for the uploaded file
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    // Update the database
    const updatedProfile = await usersService.updateProfile(req.user.id, { avatar_url: avatarUrl });
    
    return sendSuccess(res, updatedProfile, 'Profile picture uploaded successfully');
  }

  async updatePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    await usersService.updatePassword(req.user.id, currentPassword, newPassword);
    return sendSuccess(res, null, 'Password updated successfully');
  }

  async deleteAccount(req, res) {
    await usersService.deleteAccount(req.user.id);
    res.clearCookie('refreshToken');
    return sendSuccess(res, null, 'Account deleted successfully');
  }
}

module.exports = new UsersController();
