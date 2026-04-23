const db = require('../../config/database');
const gamificationService = require('../gamification/gamification.service');

class FriendsService {
  async getFriends(userId) {
    const result = await db.query(`
      SELECT 
        fl.id as link_id, 
        u.id as user_id, u.username, u.display_name, u.avatar_url, u.level, u.xp_total
      FROM friend_links fl
      JOIN users u ON (u.id = fl.addressee_id OR u.id = fl.requester_id) AND u.id != $1
      WHERE (fl.requester_id = $1 OR fl.addressee_id = $1) AND fl.status = 'accepted'
    `, [userId]);
    return result.rows;
  }

  async getRequests(userId) {
    const result = await db.query(`
      SELECT 
        fl.id as link_id, 
        u.id as user_id, u.username, u.display_name, u.avatar_url
      FROM friend_links fl
      JOIN users u ON u.id = fl.requester_id
      WHERE fl.addressee_id = $1 AND fl.status = 'pending'
    `, [userId]);
    return result.rows;
  }

  async sendRequest(userId, addresseeId) {
    if (userId === addresseeId) throw new Error('Cannot send friend request to yourself');

    const check = await db.query(
      'SELECT id FROM friend_links WHERE (requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1)',
      [userId, addresseeId]
    );

    if (check.rows.length > 0) throw new Error('Friend link already exists');

    const result = await db.query(
      'INSERT INTO friend_links (requester_id, addressee_id) VALUES ($1, $2) RETURNING id',
      [userId, addresseeId]
    );
    return result.rows[0];
  }

  async acceptRequest(userId, linkId) {
    const result = await db.query(
      'UPDATE friend_links SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND addressee_id = $3 AND status = $4 RETURNING id',
      ['accepted', linkId, userId, 'pending']
    );

    if (result.rows.length === 0) throw new Error('Request not found or already accepted');

    // Might trigger social butterfly badge
    gamificationService.checkBadges(null, userId);

    return true;
  }

  async removeFriend(userId, friendId) {
    await db.query(
      'DELETE FROM friend_links WHERE ((requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1))',
      [userId, friendId]
    );
    return true;
  }
}

module.exports = new FriendsService();
