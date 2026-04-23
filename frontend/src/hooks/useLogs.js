import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { playSound } from '../lib/sound';
import { useUiStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';

export const useLogs = () => {
  const queryClient = useQueryClient();
  const { soundEnabled } = useUiStore();
  const { checkAuth } = useAuthStore(); // To trigger XP re-fetch if needed

  const getWeekData = (startDate, endDate) => {
    return useQuery({
      queryKey: ['logs', 'week', startDate, endDate],
      queryFn: async () => {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        const res = await api.get(`/logs/week?${params.toString()}`);
        return res.data.data;
      },
    });
  };

  const getTodayStatus = () => {
    return useQuery({
      queryKey: ['logs', 'today'],
      queryFn: async () => {
        const res = await api.get('/logs/today');
        return res.data.data;
      },
    });
  };

  const toggleLog = useMutation({
    mutationFn: async ({ habit_id, logged_date }) => {
      const res = await api.post('/logs', { habit_id, logged_date });
      return res.data;
    },
    onMutate: async (variables) => {
        // Optimistic UI updates could go here
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['gamification'] });
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['ai', 'coach'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      
      // Force auth store to re-fetch user for XP updates
      useAuthStore.getState().checkAuth();
      
      // Update Auth store to get new XP (if returned or just refetch)
      // Play sound
      if (soundEnabled) {
        if (data.data.isCompleted) {
          playSound('check');
        } else {
          playSound('uncheck');
        }
      }
    },
    onError: (error) => {
      console.error('Toggle log error', error);
    },
  });

  return {
    getWeekData,
    getTodayStatus,
    toggleLog,
  };
};
