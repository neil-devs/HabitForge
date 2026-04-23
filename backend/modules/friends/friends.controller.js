const friendsService = require('./friends.service');
const { sendSuccess } = require('../../utils/response');

class FriendsController {
  async getFriends(req, res) {
    const friends = await friendsService.getFriends(req.user.id);
    return sendSuccess(res, friends, 'Friends retrieved');
  }

  async getRequests(req, res) {
    const requests = await friendsService.getRequests(req.user.id);
    return sendSuccess(res, requests, 'Requests retrieved');
  }

  async sendRequest(req, res) {
    await friendsService.sendRequest(req.user.id, req.params.userId);
    return sendSuccess(res, null, 'Friend request sent', 201);
  }

  async acceptRequest(req, res) {
    await friendsService.acceptRequest(req.user.id, req.params.linkId);
    return sendSuccess(res, null, 'Friend request accepted');
  }

  async removeFriend(req, res) {
    await friendsService.removeFriend(req.user.id, req.params.userId);
    return sendSuccess(res, null, 'Friend removed');
  }
}

module.exports = new FriendsController();
