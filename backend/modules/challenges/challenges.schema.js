const { z } = require('zod');

const createChallengeSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().optional().nullable(),
  habit_template: z.record(z.any()).optional().nullable(), // Stores a basic habit layout
  duration_days: z.number().min(1).max(365),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  is_public: z.boolean().optional(),
  max_members: z.number().min(1).max(1000).optional()
});

module.exports = {
  createChallengeSchema,
};
