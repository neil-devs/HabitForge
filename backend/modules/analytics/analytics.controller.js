const analyticsService = require('./analytics.service');
const { sendSuccess } = require('../../utils/response');

class AnalyticsController {
  async getOverview(req, res) {
    const data = await analyticsService.getOverview(req.user.id);
    return sendSuccess(res, data, 'Overview retrieved');
  }

  async getCompletionRate(req, res) {
    const days = parseInt(req.query.days) || 30;
    const data = await analyticsService.getCompletionRate(req.user.id, days);
    return sendSuccess(res, data, 'Completion rate retrieved');
  }

  async getWeeklyBars(req, res) {
    const data = await analyticsService.getWeeklyBars(req.user.id);
    return sendSuccess(res, data, 'Weekly bars retrieved');
  }

  async getMonthlyDonut(req, res) {
    const data = await analyticsService.getMonthlyDonut(req.user.id);
    return sendSuccess(res, data, 'Monthly donut retrieved');
  }

  async getHabitRanking(req, res) {
    const data = await analyticsService.getHabitRanking(req.user.id);
    return sendSuccess(res, data, 'Habit ranking retrieved');
  }

  async getHeatmap(req, res) {
    const data = await analyticsService.getHeatmap(req.user.id);
    return sendSuccess(res, data, 'Heatmap data retrieved');
  }

  async getStreakTimeline(req, res) {
    const data = await analyticsService.getStreakTimeline(req.user.id);
    return sendSuccess(res, data, 'Streak timeline retrieved');
  }

  async getBestDay(req, res) {
    const data = await analyticsService.getBestDay(req.user.id);
    return sendSuccess(res, data, 'Best day retrieved');
  }

  async getCategoryBreakdown(req, res) {
    const data = await analyticsService.getCategoryBreakdown(req.user.id);
    return sendSuccess(res, data, 'Category breakdown retrieved');
  }
}

module.exports = new AnalyticsController();
