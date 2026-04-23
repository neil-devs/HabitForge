const db = require('../../config/database');
const gamificationService = require('../gamification/gamification.service');

class GoalsService {
  async getAll(userId) {
    const result = await db.query(
      'SELECT g.*, h.name as habit_name, h.emoji as habit_emoji FROM goals g LEFT JOIN habits h ON h.id = g.habit_id WHERE g.user_id = $1 ORDER BY g.created_at DESC',
      [userId]
    );
    return result.rows;
  }

  async create(userId, goalData) {
    const result = await db.query(`
      INSERT INTO goals (user_id, title, description, target_value, unit, deadline, habit_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      userId,
      goalData.title,
      goalData.description || null,
      goalData.target_value,
      goalData.unit || 'days',
      goalData.deadline || null,
      goalData.habit_id || null
    ]);
    return result.rows[0];
  }

  async update(userId, goalId, updateData) {
    const fields = [];
    const values = [];
    let count = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${count}`);
        values.push(updateData[key]);
        count++;
      }
    });

    if (fields.length === 0) {
      const res = await db.query('SELECT * FROM goals WHERE id = $1 AND user_id = $2', [goalId, userId]);
      return res.rows[0];
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(goalId);
    values.push(userId);

    const query = `UPDATE goals SET ${fields.join(', ')} WHERE id = $${count} AND user_id = $${count+1} RETURNING *`;
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) throw new Error('Goal not found');
    return result.rows[0];
  }

  async delete(userId, goalId) {
    const result = await db.query('DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING id', [goalId, userId]);
    if (result.rows.length === 0) throw new Error('Goal not found');
    return true;
  }

  async complete(userId, goalId) {
    const result = await db.query(`
      UPDATE goals SET is_completed = true, completed_at = CURRENT_TIMESTAMP, current_value = target_value 
      WHERE id = $1 AND user_id = $2 AND is_completed = false
      RETURNING *
    `, [goalId, userId]);
    
    if (result.rows.length === 0) throw new Error('Goal not found or already completed');
    
    // Award XP
    await gamificationService.awardXP(null, userId, 100, 'Goal Completed', goalId, 'goal');
    
    return result.rows[0];
  }
}

module.exports = new GoalsService();
