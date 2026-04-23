import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const profileSchema = z.object({
  display_name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  bio: z.string().max(160, 'Bio too long').optional().nullable(),
  avatar_url: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
});

export const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, checkAuth } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: '',
      bio: '',
      avatar_url: '',
    }
  });

  useEffect(() => {
    if (user && isOpen) {
      reset({
        display_name: user.display_name || user.username,
        bio: user.bio || '',
        avatar_url: user.avatar_url || '',
      });
    }
  }, [user, isOpen, reset]);

  const updateProfile = useMutation({
    mutationFn: async (data) => {
      const res = await api.patch('/users/profile', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gamification', 'profile'] });
      checkAuth(); // Refresh the user object in Zustand
      toast.success('Profile updated successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  });

  const onSubmit = async (data) => {
    await updateProfile.mutateAsync(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      description="Update your public hero profile."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        
        <Input
          label="Display Name"
          error={errors.display_name?.message}
          {...register('display_name')}
        />

        <Input
          label="Bio"
          placeholder="Tell the world about your quests..."
          error={errors.bio?.message}
          {...register('bio')}
        />

        <Input
          label="Avatar URL"
          placeholder="https://example.com/avatar.jpg"
          error={errors.avatar_url?.message}
          {...register('avatar_url')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};
