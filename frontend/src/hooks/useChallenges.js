import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export const useChallenges = () => {
  const queryClient = useQueryClient();

  const { data: challengesData, isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const res = await api.get('/challenges');
      return res.data.data;
    },
  });

  const joinChallenge = useMutation({
    mutationFn: async (challengeId) => {
      const res = await api.post(`/challenges/${challengeId}/join`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    }
  });

  return {
    publicChallenges: challengesData?.public || [],
    myChallenges: challengesData?.mine || [],
    isLoading,
    joinChallenge
  };
};
