const express = require('express');
const router = express.Router();
const gamificationController = require('./gamification.controller');
const authenticate = require('../../middleware/authenticate');

router.use(authenticate);

router.get('/profile', gamificationController.getProfile);
router.get('/badges', gamificationController.getBadges);
router.get('/leaderboard', gamificationController.getLeaderboard);
router.get('/xp-history', gamificationController.getXPHistory);
router.post('/badges/mark-seen', gamificationController.markBadgesAsSeen);

module.exports = router;
