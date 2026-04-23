const notesService = require('./notes.service');
const { sendSuccess } = require('../../utils/response');

class NotesController {
  async getAll(req, res) {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const notes = await notesService.getAll(req.user.id, limit, offset);
    return sendSuccess(res, notes, 'Notes retrieved');
  }

  async create(req, res) {
    const note = await notesService.create(req.user.id, req.body);
    return sendSuccess(res, note, 'Note created', 201);
  }

  async update(req, res) {
    const note = await notesService.update(req.user.id, req.params.id, req.body);
    return sendSuccess(res, note, 'Note updated');
  }

  async delete(req, res) {
    await notesService.delete(req.user.id, req.params.id);
    return sendSuccess(res, null, 'Note deleted');
  }
}

module.exports = new NotesController();
