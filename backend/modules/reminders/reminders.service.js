const db = require('../../config/database');

class RemindersService {
  async getAll(userId) {
    const result = await db.query(
      'SELECT r.*, h.name as habit_name FROM reminders r JOIN habits h ON h.id = r.habit_id WHERE r.user_id = $1 ORDER BY r.remind_at ASC',
      [userId]
    );
    return result.rows;
  }

  async create(userId, data) {
    const result = await db.query(`
      INSERT INTO reminders (user_id, habit_id, remind_at, days_of_week, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [userId, data.habit_id, data.remind_at, data.days_of_week || [], data.message]);
    return result.rows[0];
  }

  async update(userId, reminderId, data) {
    const fields = [];
    const values = [];
    let count = 1;

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${count}`);
        values.push(data[key]);
        count++;
      }
    });

    if (fields.length === 0) throw new Error('No update data');

    values.push(reminderId);
    values.push(userId);

    const query = `UPDATE reminders SET ${fields.join(', ')} WHERE id = $${count} AND user_id = $${count+1} RETURNING *`;
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) throw new Error('Reminder not found');
    return result.rows[0];
  }

  async delete(userId, reminderId) {
    const result = await db.query('DELETE FROM reminders WHERE id = $1 AND user_id = $2 RETURNING id', [reminderId, userId]);
    if (result.rows.length === 0) throw new Error('Reminder not found');
    return true;
  }
  
  async getActiveRemindersForTime(timeString, dayOfWeek) {
      // timeString format: 'HH:MM'
      const result = await db.query(`
        SELECT r.*, u.email, h.name as habit_name
        FROM reminders r
        JOIN users u ON u.id = r.user_id
        JOIN habits h ON h.id = r.habit_id
        WHERE r.is_active = true 
          AND r.remind_at = $1 
          AND (cardinality(r.days_of_week) = 0 OR $2 = ANY(r.days_of_week))
      `, [timeString, dayOfWeek]);
      return result.rows;
  }
}

module.exports = new RemindersService();
