const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const { BCRYPT_ROUNDS } = require('../../config/auth');

class UsersService {
  async getProfile(userId) {
    const result = await db.query(
      'SELECT id, email, username, display_name, avatar_url, bio, timezone, theme_preference, sound_enabled, xp_total, level, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Also get stats
    const statsResult = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM habits WHERE user_id = $1 AND is_active = true) as active_habits_count,
        (SELECT COUNT(*) FROM user_badges WHERE user_id = $1) as earned_badges_count,
        (SELECT MAX(longest_streak) FROM streaks WHERE user_id = $1) as best_streak
    `, [userId]);

    return {
      ...result.rows[0],
      stats: statsResult.rows[0]
    };
  }

  async searchUsers(currentUserId, query) {
    const result = await db.query(`
      SELECT u.id, u.username, u.display_name, u.avatar_url, u.level,
             (SELECT status FROM friend_links WHERE 
               (requester_id = $1 AND addressee_id = u.id) OR 
               (requester_id = u.id AND addressee_id = $1)
             ) as friend_status
      FROM users u
      WHERE u.id != $1 AND (u.username ILIKE $2 OR u.display_name ILIKE $2)
      LIMIT 20
    `, [currentUserId, `%${query}%`]);
    return result.rows;
  }

  async updateProfile(userId, updateData) {
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

    if (fields.length === 0) return this.getProfile(userId);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${count} RETURNING id, email, username, display_name, avatar_url, bio, timezone, theme_preference, sound_enabled, xp_total, level`;
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async updatePassword(userId, currentPassword, newPassword) {
    const result = await db.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
    if (!isMatch) {
      const error = new Error('Incorrect current password');
      error.statusCode = 401;
      throw error;
    }

    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [passwordHash, userId]);
    return true;
  }

  async deleteAccount(userId) {
    // We do a hard delete for simplicity, or we could do soft delete
    await db.query('DELETE FROM users WHERE id = $1', [userId]);
    return true;
  }
}

module.exports = new UsersService();
