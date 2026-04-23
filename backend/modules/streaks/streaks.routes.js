const express = require('express');
const router = express.Router();
const streaksController = require('./streaks.controller');
const authenticate = require('../../middleware/authenticate');

router.use(authenticate);

router.get('/', streaksController.getAllStreaks);
router.get('/:habitId', streaksController.getStreakByHabit);
router.post('/recalculate', streaksController.recalculateAll);

module.exports = router;
