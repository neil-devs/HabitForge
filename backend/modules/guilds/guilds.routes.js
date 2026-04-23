const express = require('express');
const router = express.Router();
const guildsController = require('./guilds.controller');
const authenticate = require('../../middleware/authenticate');

router.use(authenticate);

router.get('/', guildsController.getGuilds);
router.post('/', guildsController.createGuild);
router.get('/my', guildsController.getMyGuild);
router.get('/:id', guildsController.getGuildDetails);
router.post('/:id/join', guildsController.joinGuild);
router.post('/leave', guildsController.leaveGuild);

module.exports = router;
