const db = require('../../config/database');

class NotesService {
  async getAll(userId, limit = 50, offset = 0) {
    const result = await db.query(
      'SELECT n.*, h.name as habit_name FROM notes n LEFT JOIN habits h ON h.id = n.habit_id WHERE n.user_id = $1 ORDER BY n.logged_date DESC, n.created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );
    return result.rows;
  }

  async create(userId, data) {
    const result = await db.query(`
      INSERT INTO notes (user_id, habit_id, content, logged_date, mood)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [userId, data.habit_id || null, data.content, data.logged_date, data.mood || null]);
    return result.rows[0];
  }

  async update(userId, noteId, data) {
    const result = await db.query(`
      UPDATE notes SET content = $1, mood = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 AND user_id = $4
      RETURNING *
    `, [data.content, data.mood || null, noteId, userId]);
    
    if (result.rows.length === 0) throw new Error('Note not found');
    return result.rows[0];
  }

  async delete(userId, noteId) {
    const result = await db.query('DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id', [noteId, userId]);
    if (result.rows.length === 0) throw new Error('Note not found');
    return true;
  }
}

module.exports = new NotesService();
