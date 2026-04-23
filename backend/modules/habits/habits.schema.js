const { z } = require('zod');

const habitCategories = ['health', 'fitness', 'learning', 'mindfulness', 'nutrition', 'productivity', 'social', 'finance', 'custom'];
const frequencyTypes = ['daily', 'weekdays', 'weekends', 'custom'];

const createHabitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional().nullable(),
  emoji: z.string().max(10).optional(),
  color: z.string().max(20).optional(),
  category: z.enum(habitCategories).optional(),
  frequency_type: z.enum(frequencyTypes).optional(),
  frequency_days: z.array(z.number().min(0).max(6)).optional(),
  goal_days: z.number().min(1).max(365).optional(),
});

const updateHabitSchema = createHabitSchema.partial();

const reorderSchema = z.object({
  habits: z.array(
    z.object({
      id: z.string().uuid(),
      sort_order: z.number()
    })
  )
});

module.exports = {
  createHabitSchema,
  updateHabitSchema,
  reorderSchema,
};
