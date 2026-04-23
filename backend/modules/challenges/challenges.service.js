const db = require('../../config/database');
const gamificationService = require('../gamification/gamification.service');

class ChallengesService {
  async getAll() {
    const result = await db.query(`
      SELECT c.*, u.username as creator_name, 
             (SELECT COUNT(*) FROM challenge_members WHERE challenge_id = c.id) as member_count
      FROM challenges c
      JOIN users u ON u.id = c.creator_id
      WHERE c.is_public = true AND c.end_date >= CURRENT_DATE
      ORDER BY c.created_at DESC
    `);
    return result.rows;
  }

  async getMyChallenges(userId) {
    const result = await db.query(`
      SELECT c.*, cm.progress, cm.is_completed,
             (SELECT COUNT(*) FROM challenge_members WHERE challenge_id = c.id) as member_count
      FROM challenges c
      JOIN challenge_members cm ON cm.challenge_id = c.id
      WHERE cm.user_id = $1
      ORDER BY c.start_date DESC
    `, [userId]);
    return result.rows;
  }

  async getById(challengeId) {
    const result = await db.query('SELECT * FROM challenges WHERE id = $1', [challengeId]);
    if (result.rows.length === 0) throw new Error('Challenge not found');
    
    const members = await db.query(`
      SELECT cm.progress, cm.is_completed, u.username, u.avatar_url
      FROM challenge_members cm
      JOIN users u ON u.id = cm.user_id
      WHERE cm.challenge_id = $1
      ORDER BY cm.progress DESC
    `, [challengeId]);

    return { ...result.rows[0], members: members.rows };
  }

  async create(userId, data) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const result = await client.query(`
        INSERT INTO challenges (creator_id, title, description, habit_template, duration_days, start_date, end_date, is_public, max_members)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [userId, data.title, data.description, data.habit_template, data.duration_days, data.start_date, data.end_date, data.is_public ?? true, data.max_members || 100]);
      
      const challenge = result.rows[0];

      // Auto-join creator
      await client.query(
        'INSERT INTO challenge_members (challenge_id, user_id) VALUES ($1, $2)',
        [challenge.id, userId]
      );

      await client.query('COMMIT');
      return challenge;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async join(userId, challengeId) {
    const result = await db.query(
      'INSERT INTO challenge_members (challenge_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id',
      [challengeId, userId]
    );
    if (result.rows.length === 0) return { message: 'Already joined' };
    return { message: 'Joined challenge successfully' };
  }

  async updateProgress(userId, challengeId, progress) {
    const challengeResult = await db.query('SELECT duration_days FROM challenges WHERE id = $1', [challengeId]);
    if (challengeResult.rows.length === 0) throw new Error('Challenge not found');
    
    const duration = challengeResult.rows[0].duration_days;
    const isCompleted = progress >= duration;

    const result = await db.query(`
      UPDATE challenge_members SET progress = $1, is_completed = $2
      WHERE challenge_id = $3 AND user_id = $4
      RETURNING *
    `, [progress, isCompleted, challengeId, userId]);

    if (result.rows.length === 0) throw new Error('Not a member of this challenge');

    if (isCompleted) {
        await gamificationService.awardXP(null, userId, 300, 'Challenge Completed', challengeId, 'challenge');
        await gamificationService.checkBadges(null, userId);
    }

    return result.rows[0];
  }

  async delete(userId, challengeId) {
    const result = await db.query('DELETE FROM challenges WHERE id = $1 AND creator_id = $2 RETURNING id', [challengeId, userId]);
    if (result.rows.length === 0) throw new Error('Challenge not found or not creator');
    return true;
  }
}

module.exports = new ChallengesService();
