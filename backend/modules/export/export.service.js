const db = require('../../config/database');
const fastcsv = require('fast-csv');
const PDFDocument = require('pdfkit');

class ExportService {
  async getCsvData(userId, startDate, endDate) {
    let query = `
      SELECT hl.logged_date, h.name as habit_name, h.category, hl.completed, hl.note
      FROM habit_logs hl
      JOIN habits h ON h.id = hl.habit_id
      WHERE hl.user_id = $1
    `;
    const params = [userId];

    if (startDate) {
      params.push(startDate);
      query += ` AND hl.logged_date >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      query += ` AND hl.logged_date <= $${params.length}`;
    }

    query += ' ORDER BY hl.logged_date DESC, h.name ASC';

    const result = await db.query(query, params);
    return result.rows;
  }

  async generatePdf(res, userId, startDate, endDate) {
    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(20).text('HabitForge Pro - Activity Report', { align: 'center' });
    doc.moveDown();
    
    if (startDate && endDate) {
        doc.fontSize(12).text(`Period: ${startDate} to ${endDate}`, { align: 'center' });
    } else {
        doc.fontSize(12).text(`All Time Report`, { align: 'center' });
    }
    
    doc.moveDown(2);

    const logs = await this.getCsvData(userId, startDate, endDate);
    
    if (logs.length === 0) {
        doc.fontSize(14).text('No activity found in this period.', { align: 'center' });
    } else {
        // Simple grouped output
        let currentDate = null;
        logs.forEach(log => {
            const dateStr = log.logged_date.toISOString().split('T')[0];
            if (dateStr !== currentDate) {
                currentDate = dateStr;
                doc.moveDown();
                doc.fontSize(14).font('Helvetica-Bold').text(currentDate);
            }
            const status = log.completed ? '[X]' : '[ ]';
            doc.fontSize(12).font('Helvetica').text(`  ${status} ${log.habit_name} (${log.category})`);
            if (log.note) {
                doc.fontSize(10).fillColor('gray').text(`      Note: ${log.note}`);
                doc.fillColor('black');
            }
        });
    }

    doc.end();
  }

  async generateTextReport(userId) {
    const userQuery = await db.query('SELECT username, email, display_name, xp_total, level FROM users WHERE id = $1', [userId]);
    const user = userQuery.rows[0];

    const habitsQuery = await db.query('SELECT name, description, category, frequency_type FROM habits WHERE user_id = $1 ORDER BY created_at ASC', [userId]);
    const habits = habitsQuery.rows;

    const goalsQuery = await db.query('SELECT title, description, target_value, current_value, unit, is_completed, deadline FROM goals WHERE user_id = $1 ORDER BY created_at ASC', [userId]);
    const goals = goalsQuery.rows;

    const journalQuery = await db.query('SELECT content, logged_date, mood, created_at FROM notes WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    const journals = journalQuery.rows;

    let text = `=================================================\n`;
    text += `         HABITFORGE PRO - DATA EXPORT\n`;
    text += `=================================================\n\n`;
    
    text += `--- ACCOUNT INFORMATION ---\n`;
    text += `Display Name: ${user.display_name || user.username}\n`;
    text += `Username:     ${user.username}\n`;
    text += `Email:        ${user.email}\n`;
    text += `Level:        ${user.level}\n`;
    text += `XP:           ${user.xp_total}\n\n`;

    text += `--- MY QUESTS (HABITS) ---\n`;
    if (habits.length === 0) text += `No habits found.\n`;
    habits.forEach(h => {
        text += `- ${h.name} (${h.category}) | ${h.frequency_type}\n`;
        if (h.description) text += `  Description: ${h.description}\n`;
    });
    text += `\n`;

    text += `--- MY GOALS ---\n`;
    if (goals.length === 0) text += `No goals found.\n`;
    goals.forEach(g => {
        const statusStr = g.is_completed ? 'COMPLETED' : 'IN PROGRESS';
        text += `- ${g.title} (${statusStr})\n`;
        text += `  Progress: ${g.current_value} / ${g.target_value} ${g.unit}\n`;
        if (g.deadline) text += `  Deadline: ${new Date(g.deadline).toLocaleDateString()}\n`;
    });
    text += `\n`;

    text += `--- JOURNAL ENTRIES ---\n`;
    if (journals.length === 0) text += `No journal entries found.\n`;
    journals.forEach(j => {
        const d = j.logged_date ? new Date(j.logged_date).toLocaleDateString() : new Date(j.created_at).toLocaleDateString();
        const mood = j.mood ? ` [Mood: ${j.mood}]` : '';
        text += `> Entry on ${d}${mood}\n`;
        text += `  ${j.content.replace(/\n/g, '\n  ')}\n\n`;
    });

    return text;
  }
}

module.exports = new ExportService();
