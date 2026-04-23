import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useHabits } from '../../hooks/useHabits';
import { CATEGORY_COLORS } from '../../constants/theme';

const habitSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  description: z.string().max(200).optional(),
  category: z.enum(['health', 'fitness', 'learning', 'mindfulness', 'nutrition', 'productivity', 'social', 'finance', 'custom']),
  frequency_type: z.enum(['daily', 'weekdays', 'weekends', 'custom']),
  emoji: z.string().min(1, 'Please select an emoji').max(5),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Valid hex color required'),
});

const CATEGORIES = ['health', 'fitness', 'learning', 'mindfulness', 'nutrition', 'productivity', 'social', 'finance', 'custom'];
const FREQUENCIES = ['daily', 'weekdays', 'weekends', 'custom'];

// Default Emojis for quick selection
const EMOJIS = ['🏃', '📚', '🧘', '💧', '💰', '🎨', '💪', '🥗', '💻', '🎸'];

export const AddHabitModal = ({ isOpen, onClose }) => {
  const { createHabit } = useHabits();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'health',
      frequency_type: 'daily',
      emoji: '🏃',
      color: '#10b981', // emerald default
    }
  });

  const selectedEmoji = watch('emoji');
  const selectedCategory = watch('category');

  const onSubmit = async (data) => {
    await createHabit.mutateAsync(data);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Create New Quest"
      description="Define your new habit and get ready to earn XP."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3">
            <Input
              label="Habit Name"
              placeholder="e.g. Read 10 Pages"
              error={errors.name?.message}
              {...register('name')}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-text-secondary mb-1">Color</label>
            <input 
              type="color" 
              className="w-full h-10 rounded-lg cursor-pointer bg-bg-tertiary border-border-subtle p-1"
              {...register('color')}
            />
          </div>
        </div>

        <Input
          label="Description (Optional)"
          placeholder="Why are you building this habit?"
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
            <select
              className="w-full px-4 py-2 bg-bg-tertiary border border-border-subtle rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-amber capitalize"
              {...register('category')}
              onChange={(e) => {
                setValue('category', e.target.value);
                // Auto-update color based on category
                setValue('color', CATEGORY_COLORS[e.target.value] || '#10b981');
              }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Frequency</label>
            <select
              className="w-full px-4 py-2 bg-bg-tertiary border border-border-subtle rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-amber capitalize"
              {...register('frequency_type')}
            >
              {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Choose Icon</label>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => setValue('emoji', emoji)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                  selectedEmoji === emoji 
                    ? 'bg-accent-amber/20 border-2 border-accent-amber' 
                    : 'bg-bg-tertiary border border-transparent hover:border-border-subtle'
                }`}
              >
                {emoji}
              </button>
            ))}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Or type one..."
                className="w-full h-10 px-3 bg-bg-tertiary border border-border-subtle rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-amber"
                {...register('emoji')}
              />
            </div>
          </div>
          {errors.emoji && <p className="text-accent-rose text-xs mt-1">{errors.emoji.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>Create Habit</Button>
        </div>
      </form>
    </Modal>
  );
};
