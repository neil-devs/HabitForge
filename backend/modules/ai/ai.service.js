const db = require('../../config/database');
const { GoogleGenAI } = require('@google/genai');
const logger = require('../../utils/logger');

// Initialize Gemini Client
const initAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

class AiService {
  async getDailyInsight(userId) {
    // 1. Fetch user data and habits first
    const userResult = await db.query('SELECT display_name, username, level FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    const habitsResult = await db.query(`
      SELECT h.name, h.category, s.current_streak, s.longest_streak
      FROM habits h
      JOIN streaks s ON s.habit_id = h.id
      WHERE h.user_id = $1 AND h.is_active = true
    `, [userId]);
    
    const habits = habitsResult.rows;

    // 2. If no habits, return a dynamic message without caching it 
    // so it updates immediately when they add one
    if (habits.length === 0) {
      return {
        insight_text: "Hero, a grand adventure awaits! You have no active quests right now. Click 'Add Habit' to forge your first daily quest.",
        type: "strategy"
      };
    }

    // 3. Check if we already generated an insight for today
    const todayResult = await db.query(`
      SELECT * FROM ai_insights 
      WHERE user_id = $1 AND DATE(created_at) = CURRENT_DATE
    `, [userId]);

    if (todayResult.rows.length > 0) {
      return todayResult.rows[0];
    }

    // 4. Format prompt
    const habitsText = habits.map(h => 
      `- ${h.name} (${h.category}): Current Streak: ${h.current_streak}, Best: ${h.longest_streak}`
    ).join('\n');

    const prompt = `
      Act as a highly encouraging, gamified RPG-style AI Habit Coach for a user named ${user.display_name || user.username} (Level ${user.level}).
      
      Here are their current active habits and streaks:
      ${habitsText}
      
      Your task: Analyze this data and provide a single, highly personalized 2-sentence coaching message. 
      - If they have a high streak (e.g. > 5), praise them and tell them to keep it up.
      - If they have a 0 streak on something, encourage them specifically to tackle that habit today.
      - Use a slightly gamified, RPG-like tone (e.g., "quest", "hero", "level up").
      - DO NOT use markdown, just plain text.
    `;

    // 5. Call Gemini API
    const ai = initAi();
    let insightText = "I'm your AI Coach, but my connection to the magic ether (API Key) is missing. Set your GEMINI_API_KEY in the backend .env to awaken me!";
    let type = "warning";

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        
        insightText = response.text.replace(/"/g, '').trim();
        type = "motivation"; // We could potentially make the LLM return JSON to dynamically set the type, but let's keep it simple
      } catch (err) {
        logger.error('Gemini API Error:', err);
        insightText = "The arcane connection is temporarily unstable. Keep pushing on your daily quests!";
      }
    }

    // 6. Save and return
    return this.saveInsight(userId, insightText, type);
  }

  async saveInsight(userId, text, type) {
    const result = await db.query(`
      INSERT INTO ai_insights (user_id, insight_text, type)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [userId, text, type]);
    return result.rows[0];
  }
}

module.exports = new AiService();
