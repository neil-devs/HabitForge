const express = require('express');
const router = express.Router();
const aiController = require('./ai.controller');
const authenticate = require('../../middleware/authenticate');

router.use(authenticate);

router.get('/coach', aiController.getCoachInsight);

module.exports = router;
