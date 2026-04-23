const express = require('express');
const router = express.Router();
const friendsController = require('./friends.controller');
const authenticate = require('../../middleware/authenticate');

router.use(authenticate);

router.get('/', friendsController.getFriends);
router.get('/requests', friendsController.getRequests);
router.post('/request/:userId', friendsController.sendRequest);
router.patch('/accept/:linkId', friendsController.acceptRequest);
router.delete('/remove/:userId', friendsController.removeFriend);

module.exports = router;
