import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export const useAnalytics = () => {
  const getOverview = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => (await api.get('/analytics/overview')).data.data,
  });

  const getCompletionRate = (days = 30) => useQuery({
    queryKey: ['analytics', 'completion-rate', days],
    queryFn: async () => (await api.get(`/analytics/completion-rate?days=${days}`)).data.data,
  });

  const getWeeklyBars = useQuery({
    queryKey: ['analytics', 'weekly-bars'],
    queryFn: async () => (await api.get('/analytics/weekly-bars')).data.data,
  });

  const getMonthlyDonut = useQuery({
    queryKey: ['analytics', 'monthly-donut'],
    queryFn: async () => (await api.get('/analytics/monthly-donut')).data.data,
  });

  const getHabitRanking = useQuery({
    queryKey: ['analytics', 'habit-ranking'],
    queryFn: async () => (await api.get('/analytics/habit-ranking')).data.data,
  });
  
  const getHeatmap = useQuery({
    queryKey: ['analytics', 'heatmap'],
    queryFn: async () => (await api.get('/analytics/heatmap')).data.data,
  });

  const getCategoryBreakdown = useQuery({
    queryKey: ['analytics', 'category-breakdown'],
    queryFn: async () => (await api.get('/analytics/category-breakdown')).data.data,
  });

  return {
    getOverview,
    getCompletionRate,
    getWeeklyBars,
    getMonthlyDonut,
    getHabitRanking,
    getHeatmap,
    getCategoryBreakdown
  };
};
