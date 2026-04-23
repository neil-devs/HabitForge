import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import toast from 'react-hot-toast';

export const useHabits = () => {
  const queryClient = useQueryClient();

  const habitsQuery = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const res = await api.get('/habits');
      return res.data.data;
    },
  });

  const createHabit = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/habits', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['ai', 'coach'] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Habit created!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create habit');
    },
  });

  const updateHabit = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await api.patch(`/habits/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['ai', 'coach'] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Habit updated!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update habit');
    },
  });

  const deleteHabit = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/habits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['ai', 'coach'] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Habit deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete habit');
    },
  });

  const reorderHabits = useMutation({
    mutationFn: async (habits) => {
      await api.patch('/habits/reorder', { habits });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });

  return {
    habits: habitsQuery.data || [],
    isLoading: habitsQuery.isLoading,
    createHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
  };
};
