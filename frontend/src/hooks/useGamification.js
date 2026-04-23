import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export const useGamification = () => {
  const queryClient = useQueryClient();

  const getProfile = useQuery({
    queryKey: ['gamification', 'profile'],
    queryFn: async () => (await api.get('/gamification/profile')).data.data,
  });

  const getBadges = useQuery({
    queryKey: ['gamification', 'badges'],
    queryFn: async () => (await api.get('/gamification/badges')).data.data,
  });

  const getLeaderboard = useQuery({
    queryKey: ['gamification', 'leaderboard'],
    queryFn: async () => (await api.get('/gamification/leaderboard')).data.data,
  });

  const markBadgesSeen = useMutation({
    mutationFn: async () => await api.post('/gamification/badges/mark-seen'),
    onSuccess: () => queryClient.invalidateQueries(['gamification', 'profile']),
  });

  return {
    getProfile,
    getBadges,
    getLeaderboard,
    markBadgesSeen
  };
};
