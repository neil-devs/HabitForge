const { z } = require('zod');

const updateProfileSchema = z.object({
  display_name: z.string().max(100).optional().nullable(),
  bio: z.string().optional().nullable(),
  timezone: z.string().max(50).optional(),
  avatar_url: z.string().url('Invalid URL').max(255).optional().nullable(),
  theme_preference: z.enum(['dark', 'light']).optional(),
  sound_enabled: z.boolean().optional(),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

module.exports = {
  updateProfileSchema,
  updatePasswordSchema,
};
