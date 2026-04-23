const { z } = require('zod');

const createGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(150),
  description: z.string().optional().nullable(),
  target_value: z.number().min(1, 'Target must be at least 1'),
  unit: z.string().max(50).optional(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional().nullable(),
  habit_id: z.string().uuid().optional().nullable(),
});

const updateGoalSchema = z.object({
  title: z.string().max(150).optional(),
  description: z.string().optional().nullable(),
  target_value: z.number().min(1).optional(),
  current_value: z.number().min(0).optional(),
  unit: z.string().max(50).optional(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  is_completed: z.boolean().optional()
});

module.exports = {
  createGoalSchema,
  updateGoalSchema,
};
