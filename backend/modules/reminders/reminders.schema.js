const { z } = require('zod');

const createReminderSchema = z.object({
  habit_id: z.string().uuid(),
  remind_at: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format HH:MM'),
  days_of_week: z.array(z.number().min(0).max(6)).optional(),
  message: z.string().optional().nullable(),
});

const updateReminderSchema = z.object({
  remind_at: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  days_of_week: z.array(z.number().min(0).max(6)).optional(),
  message: z.string().optional().nullable(),
  is_active: z.boolean().optional()
});

module.exports = {
  createReminderSchema,
  updateReminderSchema,
};
