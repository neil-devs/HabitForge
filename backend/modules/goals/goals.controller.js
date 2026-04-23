const goalsService = require('./goals.service');
const { sendSuccess } = require('../../utils/response');

class GoalsController {
  async getAll(req, res) {
    const goals = await goalsService.getAll(req.user.id);
    return sendSuccess(res, goals, 'Goals retrieved');
  }

  async create(req, res) {
    const goal = await goalsService.create(req.user.id, req.body);
    return sendSuccess(res, goal, 'Goal created', 201);
  }

  async update(req, res) {
    const goal = await goalsService.update(req.user.id, req.params.id, req.body);
    return sendSuccess(res, goal, 'Goal updated');
  }

  async delete(req, res) {
    await goalsService.delete(req.user.id, req.params.id);
    return sendSuccess(res, null, 'Goal deleted');
  }

  async complete(req, res) {
    const goal = await goalsService.complete(req.user.id, req.params.id);
    return sendSuccess(res, goal, 'Goal completed');
  }
}

module.exports = new GoalsController();
