const express = require('express');
const router = express.Router();
const analyticsController = require('./analytics.controller');
const authenticate = require('../../middleware/authenticate');

router.use(authenticate);

router.get('/overview', analyticsController.getOverview);
router.get('/completion-rate', analyticsController.getCompletionRate);
router.get('/weekly-bars', analyticsController.getWeeklyBars);
router.get('/monthly-donut', analyticsController.getMonthlyDonut);
router.get('/habit-ranking', analyticsController.getHabitRanking);
router.get('/heatmap', analyticsController.getHeatmap);
router.get('/streak-timeline', analyticsController.getStreakTimeline);
router.get('/best-day', analyticsController.getBestDay);
router.get('/category-breakdown', analyticsController.getCategoryBreakdown);

module.exports = router;
