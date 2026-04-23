const streaksService = require('./streaks.service');
const { sendSuccess } = require('../../utils/response');

class StreaksController {
  async getAllStreaks(req, res) {
    const streaks = await streaksService.getAllStreaks(req.user.id);
    return sendSuccess(res, streaks, 'Streaks retrieved successfully');
  }

  async getStreakByHabit(req, res) {
    const streak = await streaksService.getStreakByHabit(req.user.id, req.params.habitId);
    return sendSuccess(res, streak, 'Streak retrieved successfully');
  }

  async recalculateAll(req, res) {
    await streaksService.recalculateAll(req.user.id);
    return sendSuccess(res, null, 'All streaks recalculated successfully');
  }
}

module.exports = new StreaksController();
