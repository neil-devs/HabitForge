const db = require('../../config/database');

class AnalyticsService {
  async getOverview(userId) {
    const habitCountResult = await db.query('SELECT COUNT(*) FROM habits WHERE user_id = $1 AND is_active = true', [userId]);
    if (parseInt(habitCountResult.rows[0].count) === 0) {
      return { total_completions: 0, best_streak: 0, xp_this_month: 0 };
    }

    const result = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM habit_logs WHERE user_id = $1 AND completed = true) as total_completions,
        (SELECT MAX(longest_streak) FROM streaks WHERE user_id = $1) as best_streak,
        (SELECT COALESCE(SUM(amount), 0) FROM xp_ledger WHERE user_id = $1 AND created_at >= date_trunc('month', CURRENT_DATE)) as xp_this_month
    `, [userId]);
    return {
      total_completions: parseInt(result.rows[0].total_completions || 0),
      best_streak: parseInt(result.rows[0].best_streak || 0),
      xp_this_month: parseInt(result.rows[0].xp_this_month || 0)
    };
  }

  async getCompletionRate(userId, days = 30) {
    const habitCountResult = await db.query('SELECT COUNT(*) FROM habits WHERE user_id = $1 AND is_active = true', [userId]);
    if (parseInt(habitCountResult.rows[0].count) === 0) {
      return Array.from({ length: days }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return { date: d.toISOString().split('T')[0], expected: 0, completed: 0, rate: 0 };
      }).reverse();
    }

    const result = await db.query(`
      WITH date_series AS (
        SELECT current_date - i AS date
        FROM generate_series(0, $2 - 1) i
      ),
      daily_stats AS (
        SELECT 
          d.date,
          (SELECT COUNT(*) FROM habits h WHERE h.user_id = $1 AND h.is_active = true AND h.created_at <= d.date + interval '1 day') as expected,
          (SELECT COUNT(*) FROM habit_logs hl WHERE hl.user_id = $1 AND hl.logged_date = d.date AND hl.completed = true) as completed
        FROM date_series d
      )
      SELECT 
        date,
        expected,
        completed,
        CASE WHEN expected > 0 THEN ROUND((completed::numeric / expected::numeric) * 100, 2) ELSE 0 END as rate
      FROM daily_stats
      ORDER BY date ASC
    `, [userId, days]);
    return result.rows;
  }

  async getWeeklyBars(userId) {
    const habitCountResult = await db.query('SELECT COUNT(*) FROM habits WHERE user_id = $1 AND is_active = true', [userId]);
    if (parseInt(habitCountResult.rows[0].count) === 0) return [];

    const result = await db.query(`
      SELECT 
        date_trunc('week', logged_date)::date as week_start,
        COUNT(*) as completions
      FROM habit_logs
      WHERE user_id = $1 AND completed = true AND logged_date >= current_date - interval '12 weeks'
      GROUP BY week_start
      ORDER BY week_start ASC
    `, [userId]);
    return result.rows;
  }

  async getMonthlyDonut(userId) {
    const habitCountResult = await db.query('SELECT COUNT(*) FROM habits WHERE user_id = $1 AND is_active = true', [userId]);
    if (parseInt(habitCountResult.rows[0].count) === 0) {
      return { completed: 0, missed: 0 };
    }

    const result = await db.query(`
      WITH stats AS (
        SELECT 
          (SELECT COUNT(*) FROM habits WHERE user_id = $1 AND is_active = true) * EXTRACT(DAY FROM current_date) as expected_so_far,
          (SELECT COUNT(*) FROM habit_logs WHERE user_id = $1 AND completed = true AND logged_date >= date_trunc('month', current_date)) as completed
      )
      SELECT 
        completed,
        GREATEST(0, expected_so_far - completed) as missed
      FROM stats
    `, [userId]);
    return result.rows[0];
  }

  async getHabitRanking(userId) {
    const habitCountResult = await db.query('SELECT COUNT(*) FROM habits WHERE user_id = $1 AND is_active = true', [userId]);
    if (parseInt(habitCountResult.rows[0].count) === 0) return [];

    const result = await db.query(`
      SELECT h.id, h.name, h.emoji, h.color, COUNT(hl.id) as completion_count
      FROM habits h
      LEFT JOIN habit_logs hl ON hl.habit_id = h.id AND hl.completed = true AND hl.logged_date >= date_trunc('month', current_date)
      WHERE h.user_id = $1 AND h.is_active = true
      GROUP BY h.id, h.name, h.emoji, h.color
      ORDER BY completion_count DESC
      LIMIT 10
    `, [userId]);
    return result.rows;
  }

  async getHeatmap(userId) {
    const habitCountResult = await db.query('SELECT COUNT(*) FROM habits WHERE user_id = $1 AND is_active = true', [userId]);
    if (parseInt(habitCountResult.rows[0].count) === 0) return [];

    const result = await db.query(`
      SELECT logged_date as date, COUNT(*) as count
      FROM habit_logs
      WHERE user_id = $1 AND completed = true AND logged_date >= current_date - interval '365 days'
      GROUP BY logged_date
      ORDER BY logged_date ASC
    `, [userId]);
    return result.rows;
  }

  async getStreakTimeline(userId) {
    const habitCountResult = await db.query('SELECT COUNT(*) FROM habits WHERE user_id = $1 AND is_active = true', [userId]);
    if (parseInt(habitCountResult.rows[0].count) === 0) return [];

    // Return milestones from xp_ledger related to streaks
    const result = await db.query(`
      SELECT created_at as date, reason as milestone, amount as xp
      FROM xp_ledger
      WHERE user_id = $1 AND reason ILIKE '%streak%'
      ORDER BY created_at DESC
      LIMIT 20
    `, [userId]);
    return result.rows;
  }

  async getBestDay(userId) {
    const habitCountResult = await db.query('SELECT COUNT(*) FROM habits WHERE user_id = $1 AND is_active = true', [userId]);
    if (parseInt(habitCountResult.rows[0].count) === 0) return { day: 'None', completions: 0 };

    const result = await db.query(`
      SELECT 
        EXTRACT(ISODOW FROM logged_date) as day_of_week,
        COUNT(*) as completions
      FROM habit_logs
      WHERE user_id = $1 AND completed = true
      GROUP BY day_of_week
      ORDER BY completions DESC
      LIMIT 1
    `, [userId]);
    
    const daysMap = {1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday'};
    
    if(result.rows.length === 0) return { day: 'None', completions: 0 };
    return { 
      day: daysMap[result.rows[0].day_of_week], 
      completions: parseInt(result.rows[0].completions) 
    };
  }

  async getCategoryBreakdown(userId) {
    const habitCountResult = await db.query('SELECT COUNT(*) FROM habits WHERE user_id = $1 AND is_active = true', [userId]);
    if (parseInt(habitCountResult.rows[0].count) === 0) {
      return [];
    }

    const result = await db.query(`
      SELECT h.category, COUNT(hl.id) as completions
      FROM habits h
      JOIN habit_logs hl ON hl.habit_id = h.id
      WHERE h.user_id = $1 AND hl.completed = true
      GROUP BY h.category
      ORDER BY completions DESC
    `, [userId]);
    return result.rows;
  }
}

module.exports = new AnalyticsService();
