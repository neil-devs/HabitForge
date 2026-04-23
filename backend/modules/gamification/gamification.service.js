const db = require('../../config/database');
const engine = require('./gamification.engine');
const socketManager = require('../../sockets/socketManager');

class GamificationService {
  async awardXP(clientOrDb, userId, amount, reason, referenceId = null, referenceType = null) {
    const client = clientOrDb || db;
    
    // 1. Insert into xp_ledger
    await client.query(`
      INSERT INTO xp_ledger (user_id, amount, reason, reference_id, reference_type)
      VALUES ($1, $2, $3, $4, $5)
    `, [userId, amount, reason, referenceId, referenceType]);

    // 2. Get current XP total
    const xpResult = await client.query('SELECT username, display_name, xp_total, level FROM users WHERE id = $1', [userId]);
    const user = xpResult.rows[0];
    const currentXp = user.xp_total;
    const currentLevel = user.level;
    const newXpTotal = currentXp + amount;

    // 3. Calculate new level
    const { currentLevel: levelData } = engine.calculateLevel(newXpTotal);

    // 4. Update user
    await client.query(`
      UPDATE users SET xp_total = $1, level = $2 WHERE id = $3
    `, [newXpTotal, levelData.level, userId]);

    // 5. Emit socket event
    socketManager.emitGlobal('user_xp_gained', {
      userId,
      username: user.username,
      displayName: user.display_name,
      amount,
      reason,
      newTotal: newXpTotal,
      level: levelData.level,
      leveledUp: levelData.level > currentLevel
    });

    return { 
      newXpTotal, 
      newLevel: levelData.level, 
      leveledUp: levelData.level > currentLevel 
    };
  }

  async checkBadges(clientOrDb, userId) {
    const client = clientOrDb || db;

    // 1. Get all unearned badges
    const unearnedBadgesResult = await client.query(`
      SELECT b.* 
      FROM badges b
      LEFT JOIN user_badges ub ON ub.badge_id = b.id AND ub.user_id = $1
      WHERE ub.id IS NULL
    `, [userId]);

    if (unearnedBadgesResult.rows.length === 0) return [];

    // 2. Gather user stats needed for evaluation
    const statsResult = await client.query(`
      SELECT 
        u.level,
        (SELECT COUNT(*) FROM habit_logs WHERE user_id = $1 AND completed = true) as total_completions,
        (SELECT MAX(longest_streak) FROM streaks WHERE user_id = $1) as max_streak,
        (SELECT COUNT(*) FROM habits WHERE user_id = $1 AND is_active = true) as active_habits,
        (SELECT COUNT(*) FROM friend_links WHERE (requester_id = $1 OR addressee_id = $1) AND status = 'accepted') as friend_count,
        (SELECT COUNT(*) FROM challenge_members WHERE user_id = $1 AND is_completed = true) as challenges_completed
      FROM users u WHERE u.id = $1
    `, [userId]);

    // For specific badges, we might need more granular stats, but we'll approximate for now
    // to avoid massive queries. In production, these might be pre-calculated or checked specifically.
    const stats = {
      level: statsResult.rows[0].level,
      totalCompletions: parseInt(statsResult.rows[0].total_completions),
      maxStreak: parseInt(statsResult.rows[0].max_streak || 0),
      activeHabits: parseInt(statsResult.rows[0].active_habits),
      friendCount: parseInt(statsResult.rows[0].friend_count),
      challengesCompleted: parseInt(statsResult.rows[0].challenges_completed),
      // Dummy values for now, could be fetched via complex queries
      mindfulnessCompletions: parseInt(statsResult.rows[0].total_completions), 
      fitnessCompletions: parseInt(statsResult.rows[0].total_completions),
      learningCompletions: parseInt(statsResult.rows[0].total_completions),
      waterCompletions: parseInt(statsResult.rows[0].total_completions),
      perfectWeeks: 0,
      earlyBirdDays: 0,
      nightOwlDays: 0
    };

    // 3. Evaluate
    const earnedSlugs = engine.evaluateBadges(stats, unearnedBadgesResult.rows);
    const newlyEarned = [];

    // 4. Award badges
    for (const slug of earnedSlugs) {
      const badge = unearnedBadgesResult.rows.find(b => b.slug === slug);
      await client.query(`
        INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2)
      `, [userId, badge.id]);
      
      // Award XP for badge
      if (badge.xp_reward > 0) {
        await this.awardXP(client, userId, badge.xp_reward, `Badge Earned: ${badge.name}`, badge.id, 'badge');
      }
      
      newlyEarned.push(badge);
      
      // Emit socket event for badge
      const userResult = await client.query('SELECT username, display_name FROM users WHERE id = $1', [userId]);
      const u = userResult.rows[0];
      
      socketManager.emitGlobal('badge_earned', {
        userId,
        username: u.username,
        displayName: u.display_name,
        badgeName: badge.name,
        badgeIcon: badge.icon
      });
    }

    return newlyEarned;
  }

  async getProfile(userId) {
    const habitCountResult = await db.query('SELECT COUNT(*) FROM habits WHERE user_id = $1 AND is_active = true', [userId]);
    if (parseInt(habitCountResult.rows[0].count) === 0) {
      return {
        xp_total: 0,
        level: 1,
        level_info: engine.calculateLevel(0),
        earned_badges: []
      };
    }

    const result = await db.query(`
      SELECT xp_total, level FROM users WHERE id = $1
    `, [userId]);
    
    const user = result.rows[0];
    const levelInfo = engine.calculateLevel(user.xp_total);

    const badgesResult = await db.query(`
      SELECT b.*, ub.earned_at, ub.is_new
      FROM user_badges ub
      JOIN badges b ON b.id = ub.badge_id
      WHERE ub.user_id = $1
      ORDER BY ub.earned_at DESC
    `, [userId]);

    return {
      xp_total: user.xp_total,
      level: user.level,
      level_info: levelInfo,
      earned_badges: badgesResult.rows
    };
  }

  async getBadges(userId) {
    const result = await db.query(`
      SELECT 
        b.*,
        CASE WHEN ub.id IS NOT NULL THEN true ELSE false END as is_earned,
        ub.earned_at
      FROM badges b
      LEFT JOIN user_badges ub ON ub.badge_id = b.id AND ub.user_id = $1
      ORDER BY b.xp_reward ASC
    `, [userId]);
    return result.rows;
  }

  async getLeaderboard(userId) {
    // Current user and friends
    const result = await db.query(`
      WITH friends AS (
        SELECT addressee_id as friend_id FROM friend_links WHERE requester_id = $1 AND status = 'accepted'
        UNION
        SELECT requester_id as friend_id FROM friend_links WHERE addressee_id = $1 AND status = 'accepted'
      )
      SELECT u.id, u.username, u.display_name, u.avatar_url, u.xp_total, u.level
      FROM users u
      WHERE u.id = $1 OR u.id IN (SELECT friend_id FROM friends)
      ORDER BY u.xp_total DESC
      LIMIT 50
    `, [userId]);
    return result.rows;
  }

  async getXPHistory(userId) {
    const result = await db.query(`
      SELECT * FROM xp_ledger
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 100
    `, [userId]);
    return result.rows;
  }
  
  async markBadgesAsSeen(userId) {
      await db.query(`UPDATE user_badges SET is_new = false WHERE user_id = $1`, [userId]);
      return true;
  }
}

module.exports = new GamificationService();
