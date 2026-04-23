const db = require('../../config/database');
const socketManager = require('../../sockets/socketManager');

class GuildsService {
  async createGuild(userId, name, description, emblem) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // Check if user is already in a guild
      const memberCheck = await client.query('SELECT guild_id FROM guild_members WHERE user_id = $1', [userId]);
      if (memberCheck.rows.length > 0) {
        throw new Error('You are already in a guild');
      }

      // Create guild
      const guildResult = await client.query(`
        INSERT INTO guilds (name, description, emblem, created_by)
        VALUES ($1, $2, $3, $4) RETURNING *
      `, [name, description, emblem, userId]);

      const guild = guildResult.rows[0];

      // Add creator as leader
      await client.query(`
        INSERT INTO guild_members (guild_id, user_id, role)
        VALUES ($1, $2, 'leader')
      `, [guild.id, userId]);

      // Spawn an initial Boss Raid
      const bosses = ['Shadow Dragon', 'Procrastination Demon', 'Sloth Behemoth'];
      const randomBoss = bosses[Math.floor(Math.random() * bosses.length)];
      const endTime = new Date();
      endTime.setDate(endTime.getDate() + 7); // 7 days to defeat
      
      await client.query(`
        INSERT INTO boss_raids (guild_id, boss_name, total_hp, current_hp, end_time)
        VALUES ($1, $2, $3, $4, $5)
      `, [guild.id, randomBoss, 1000, 1000, endTime]);

      await client.query('COMMIT');
      return guild;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async getGuilds() {
    const result = await db.query(`
      SELECT g.*, 
        (SELECT COUNT(*) FROM guild_members WHERE guild_id = g.id) as member_count
      FROM guilds g
      ORDER BY g.total_xp DESC
      LIMIT 50
    `);
    return result.rows;
  }

  async getGuildDetails(guildId) {
    const guildResult = await db.query('SELECT * FROM guilds WHERE id = $1', [guildId]);
    if (guildResult.rows.length === 0) throw new Error('Guild not found');
    
    const membersResult = await db.query(`
      SELECT gm.role, gm.joined_at, u.id, u.username, u.display_name, u.avatar_url, u.level
      FROM guild_members gm
      JOIN users u ON u.id = gm.user_id
      WHERE gm.guild_id = $1
      ORDER BY gm.role DESC, gm.joined_at ASC
    `, [guildId]);

    const activeRaidResult = await db.query(`
      SELECT * FROM boss_raids 
      WHERE guild_id = $1 AND status = 'active'
    `, [guildId]);

    return {
      ...guildResult.rows[0],
      members: membersResult.rows,
      active_raid: activeRaidResult.rows[0] || null
    };
  }

  async joinGuild(userId, guildId) {
    // Check if already in a guild
    const check = await db.query('SELECT guild_id FROM guild_members WHERE user_id = $1', [userId]);
    if (check.rows.length > 0) throw new Error('You are already in a guild');

    await db.query(`
      INSERT INTO guild_members (guild_id, user_id, role)
      VALUES ($1, $2, 'member')
    `, [guildId, userId]);

    // Emit event
    socketManager.emitGlobal('guild_joined', { userId, guildId });
    return true;
  }

  async leaveGuild(userId) {
    await db.query('DELETE FROM guild_members WHERE user_id = $1', [userId]);
    return true;
  }

  async damageActiveBoss(clientOrDb, guildId, damageAmount) {
    const client = clientOrDb || db;
    
    const raidResult = await client.query(`
      SELECT * FROM boss_raids WHERE guild_id = $1 AND status = 'active' FOR UPDATE
    `, [guildId]);

    if (raidResult.rows.length === 0) return null;

    let raid = raidResult.rows[0];
    const newHp = Math.max(0, raid.current_hp - damageAmount);
    
    let newStatus = 'active';
    if (newHp === 0) newStatus = 'defeated';

    await client.query(`
      UPDATE boss_raids SET current_hp = $1, status = $2 WHERE id = $3
    `, [newHp, newStatus, raid.id]);

    raid.current_hp = newHp;
    raid.status = newStatus;

    return raid;
  }

  async getUserGuild(userId) {
    const result = await db.query('SELECT guild_id FROM guild_members WHERE user_id = $1', [userId]);
    if (result.rows.length === 0) return null;
    return this.getGuildDetails(result.rows[0].guild_id);
  }
}

module.exports = new GuildsService();
