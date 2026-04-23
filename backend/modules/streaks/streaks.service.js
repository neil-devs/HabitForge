const db = require('../../config/database');
const dateHelpers = require('../../utils/dateHelpers');

class StreaksService {
  async getAllStreaks(userId) {
    const result = await db.query(`
      SELECT s.*, h.name, h.emoji, h.color
      FROM streaks s
      JOIN habits h ON h.id = s.habit_id
      WHERE s.user_id = $1 AND h.is_active = true
    `, [userId]);
    return result.rows;
  }

  async getStreakByHabit(userId, habitId) {
    const result = await db.query(
      'SELECT * FROM streaks WHERE user_id = $1 AND habit_id = $2',
      [userId, habitId]
    );
    if (result.rows.length === 0) {
      return { current_streak: 0, longest_streak: 0 };
    }
    return result.rows[0];
  }

  async recalculateStreak(clientOrDb, userId, habitId) {
    // Determine if we are using an existing transaction client or the global pool
    const client = clientOrDb || db;

    // Get all logs for this habit, ordered by date ascending
    const logsResult = await client.query(
      'SELECT logged_date, completed FROM habit_logs WHERE user_id = $1 AND habit_id = $2 AND completed = true ORDER BY logged_date ASC',
      [userId, habitId]
    );

    const logs = logsResult.rows;

    let currentStreak = 0;
    let longestStreak = 0;
    let lastCompletedDate = null;
    let streakStartedAt = null;

    if (logs.length > 0) {
      let tempStreak = 1;
      let tempStreakStart = logs[0].logged_date;
      longestStreak = 1;

      for (let i = 1; i < logs.length; i++) {
        const prevDate = new Date(logs[i - 1].logged_date);
        const currDate = new Date(logs[i].logged_date);
        
        // Check if dates are consecutive (difference of 1 day)
        // Note: For frequency_types like 'weekdays' this logic would need to skip weekends.
        // For simplicity in this demo, we assume daily consecutive.
        const diffTime = Math.abs(currDate - prevDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          // Streak broken
          tempStreak = 1;
          tempStreakStart = currDate;
        }

        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      }

      // Check if current streak is still active (logged today or yesterday)
      const lastLogDate = new Date(logs[logs.length - 1].logged_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastLogDate >= yesterday) {
        currentStreak = tempStreak;
        streakStartedAt = tempStreakStart;
      } else {
        currentStreak = 0;
        streakStartedAt = null;
      }
      
      lastCompletedDate = logs[logs.length - 1].logged_date;
    }

    // Update streak table
    await client.query(`
      INSERT INTO streaks (habit_id, user_id, current_streak, longest_streak, last_completed_date, streak_started_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (habit_id) DO UPDATE SET
        current_streak = EXCLUDED.current_streak,
        longest_streak = GREATEST(streaks.longest_streak, EXCLUDED.longest_streak),
        last_completed_date = EXCLUDED.last_completed_date,
        streak_started_at = EXCLUDED.streak_started_at,
        updated_at = CURRENT_TIMESTAMP
    `, [habitId, userId, currentStreak, longestStreak, lastCompletedDate, streakStartedAt]);

    return { currentStreak, longestStreak };
  }

  async recalculateAll(userId) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const habitsResult = await client.query('SELECT id FROM habits WHERE user_id = $1', [userId]);
      for (const row of habitsResult.rows) {
        await this.recalculateStreak(client, userId, row.id);
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

module.exports = new StreaksService();
