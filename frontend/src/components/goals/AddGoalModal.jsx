import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useGoals } from '../../hooks/useGoals';

const goalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(150),
  description: z.string().optional(),
  target_value: z.number().min(1, 'Target must be at least 1'),
  unit: z.string().max(50).optional(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional().or(z.literal('')),
});

export const AddGoalModal = ({ isOpen, onClose }) => {
  const { createGoal } = useGoals();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      target_value: 100,
      unit: 'days'
    }
  });

  const onSubmit = async (data) => {
    // Convert empty string to null for deadline
    const payload = {
      ...data,
      deadline: data.deadline || null
    };
    
    await createGoal.mutateAsync(payload);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Set a Long-term Goal"
      description="Define a major milestone to track over time."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Goal Title</label>
          <input
            {...register('title')}
            className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent-rose transition-colors"
            placeholder="e.g., Run a Marathon"
          />
          {errors.title && <p className="text-accent-rose text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Description (Optional)</label>
          <textarea
            {...register('description')}
            className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent-rose transition-colors h-20 resize-none"
            placeholder="Why is this important?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Target Number</label>
            <input
              type="number"
              {...register('target_value', { valueAsNumber: true })}
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent-rose transition-colors"
            />
            {errors.target_value && <p className="text-accent-rose text-xs mt-1">{errors.target_value.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Unit</label>
            <input
              {...register('unit')}
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent-rose transition-colors"
              placeholder="e.g., miles, pages"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Deadline Date (Optional)</label>
          <input
            type="date"
            {...register('deadline')}
            className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent-rose transition-colors"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createGoal.isPending} className="bg-accent-rose text-white hover:bg-accent-rose/90">
            {createGoal.isPending ? 'Saving...' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
