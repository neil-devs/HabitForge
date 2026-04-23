const habitsService = require('./habits.service');
const { sendSuccess } = require('../../utils/response');

class HabitsController {
  async getAll(req, res) {
    const habits = await habitsService.getAllActive(req.user.id);
    return sendSuccess(res, habits, 'Habits retrieved successfully');
  }

  async getById(req, res) {
    const habit = await habitsService.getById(req.user.id, req.params.id);
    return sendSuccess(res, habit, 'Habit retrieved successfully');
  }

  async create(req, res) {
    const newHabit = await habitsService.create(req.user.id, req.body);
    return sendSuccess(res, newHabit, 'Habit created successfully', 201);
  }

  async update(req, res) {
    const updatedHabit = await habitsService.update(req.user.id, req.params.id, req.body);
    return sendSuccess(res, updatedHabit, 'Habit updated successfully');
  }

  async delete(req, res) {
    await habitsService.softDelete(req.user.id, req.params.id);
    return sendSuccess(res, null, 'Habit deleted successfully');
  }

  async reorder(req, res) {
    await habitsService.reorder(req.user.id, req.body.habits);
    return sendSuccess(res, null, 'Habits reordered successfully');
  }
}

module.exports = new HabitsController();
