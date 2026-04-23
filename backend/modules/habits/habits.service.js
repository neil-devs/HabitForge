const db = require('../../config/database');
const engine = require('../gamification/gamification.engine');

class HabitsService {
  async getAllActive(userId) {
    const result = await db.query(
      'SELECT * FROM habits WHERE user_id = $1 AND is_active = true ORDER BY sort_order ASC, created_at DESC',
      [userId]
    );
    return result.rows;
  }

  async getById(userId, habitId) {
    const result = await db.query(
      'SELECT * FROM habits WHERE id = $1 AND user_id = $2',
      [habitId, userId]
    );

    if (result.rows.length === 0) {
      const error = new Error('Habit not found');
      error.statusCode = 404;
      throw error;
    }

    const statsResult = await db.query(`
      SELECT 
        (SELECT current_streak FROM streaks WHERE habit_id = $1) as current_streak,
        (SELECT longest_streak FROM streaks WHERE habit_id = $1) as longest_streak,
        (SELECT COUNT(*) FROM habit_logs WHERE habit_id = $1 AND completed = true) as total_completions
    `, [habitId]);

    return {
      ...result.rows[0],
      stats: statsResult.rows[0]
    };
  }

  async create(userId, habitData) {
    const defaultXpMap = {
      health: 15, fitness: 20, learning: 20, mindfulness: 15, nutrition: 15, productivity: 10, social: 10, finance: 15, custom: 10
    };

    const xpPerCompletion = defaultXpMap[habitData.category || 'custom'] || 10;

    const result = await db.query(`
      INSERT INTO habits (
        user_id, name, description, emoji, color, category, frequency_type, frequency_days, goal_days, xp_per_completion
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      userId,
      habitData.name,
      habitData.description || null,
      habitData.emoji || '📝',
      habitData.color || '#f59e0b',
      habitData.category || 'custom',
      habitData.frequency_type || 'daily',
      habitData.frequency_days || [],
      habitData.goal_days || 30,
      xpPerCompletion
    ]);

    const habit = result.rows[0];

    // Initialize streak for this habit
    await db.query('INSERT INTO streaks (habit_id, user_id) VALUES ($1, $2)', [habit.id, userId]);

    return habit;
  }

  async update(userId, habitId, updateData) {
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

    if (fields.length === 0) return this.getById(userId, habitId);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(habitId);
    values.push(userId);

    const query = `UPDATE habits SET ${fields.join(', ')} WHERE id = $${count} AND user_id = $${count+1} RETURNING *`;
    
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      const error = new Error('Habit not found');
      error.statusCode = 404;
      throw error;
    }
    
    return result.rows[0];
  }

  async softDelete(userId, habitId) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      
      // Remove XP earned from this habit's logs to ensure Analytics and Level reset
      await client.query(`
        DELETE FROM xp_ledger 
        WHERE reference_type = 'habit_log' 
        AND reference_id IN (SELECT id FROM habit_logs WHERE habit_id = $1 AND user_id = $2)
      `, [habitId, userId]);

      // Hard delete the habit (cascades automatically to habit_logs and streaks)
      const result = await client.query(
        'DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING id',
        [habitId, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Habit not found');
      }

      // Recalculate user's XP
      const xpResult = await client.query('SELECT COALESCE(SUM(amount), 0) as total FROM xp_ledger WHERE user_id = $1', [userId]);
      const newTotal = parseInt(xpResult.rows[0].total);
      const levelInfo = engine.calculateLevel(newTotal);

      await client.query('UPDATE users SET xp_total = $1, level = $2 WHERE id = $3', [newTotal, levelInfo.level, userId]);

      await client.query('COMMIT');
      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      e.statusCode = e.message === 'Habit not found' ? 404 : 500;
      throw e;
    } finally {
      client.release();
    }
  }

  async reorder(userId, habitsList) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      for (const item of habitsList) {
        await client.query(
          'UPDATE habits SET sort_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3',
          [item.sort_order, item.id, userId]
        );
      }
      await client.query('COMMIT');
      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}

module.exports = new HabitsService();
