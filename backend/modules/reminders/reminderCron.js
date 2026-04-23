const cron = require('node-cron');
const remindersService = require('./reminders.service');
const logger = require('../../utils/logger');

// Run every minute
const startCron = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      // Format to HH:MM locally or UTC depending on how we store it.
      // For this demo, let's assume UTC time for matching.
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      const dayOfWeek = now.getUTCDay(); // 0 is Sunday

      const reminders = await remindersService.getActiveRemindersForTime(timeString, dayOfWeek);
      
      if (reminders.length > 0) {
        logger.info(`Found ${reminders.length} reminders to send at ${timeString} UTC`);
        for (const reminder of reminders) {
          // In a real app, integrate with APN/FCM or Email service (SendGrid, SES)
          // For now, we just log it.
          logger.info(`[Push Notif Mock] To ${reminder.email}: "Don't forget to ${reminder.habit_name}!" Message: ${reminder.message || ''}`);
        }
      }
    } catch (e) {
      logger.error('Error in reminder cron:', e);
    }
  });
  logger.info('Reminder cron job started.');
};

module.exports = { startCron };
