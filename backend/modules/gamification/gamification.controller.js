const gamificationService = require('./gamification.service');
const { sendSuccess } = require('../../utils/response');

class GamificationController {
  async getProfile(req, res) {
    const profile = await gamificationService.getProfile(req.user.id);
    return sendSuccess(res, profile, 'Gamification profile retrieved');
  }

  async getBadges(req, res) {
    const badges = await gamificationService.getBadges(req.user.id);
    return sendSuccess(res, badges, 'Badges retrieved');
  }

  async getLeaderboard(req, res) {
    const leaderboard = await gamificationService.getLeaderboard(req.user.id);
    return sendSuccess(res, leaderboard, 'Leaderboard retrieved');
  }

  async getXPHistory(req, res) {
    const history = await gamificationService.getXPHistory(req.user.id);
    return sendSuccess(res, history, 'XP history retrieved');
  }

  async markBadgesAsSeen(req, res) {
    await gamificationService.markBadgesAsSeen(req.user.id);
    return sendSuccess(res, null, 'Badges marked as seen');
  }
}

module.exports = new GamificationController();
