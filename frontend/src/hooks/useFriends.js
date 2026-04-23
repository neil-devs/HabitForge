import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export const useFriends = () => {
  const queryClient = useQueryClient();

  const { data: friendsList, isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const res = await api.get('/friends');
      return res.data.data;
    },
  });

  const sendRequest = useMutation({
    mutationFn: async (friendId) => {
      const res = await api.post('/friends/request', { friend_id: friendId });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries(['friends']),
  });

  const respondRequest = useMutation({
    mutationFn: async ({ requestId, action }) => {
      const res = await api.post(`/friends/respond/${requestId}`, { action });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries(['friends']),
  });

  const removeFriend = useMutation({
    mutationFn: async (friendId) => {
      await api.delete(`/friends/${friendId}`);
    },
    onSuccess: () => queryClient.invalidateQueries(['friends']),
  });

  // Derived state
  const acceptedFriends = friendsList?.filter(f => f.status === 'accepted') || [];
  const pendingIncoming = friendsList?.filter(f => f.status === 'pending' && f.is_incoming) || [];
  const pendingOutgoing = friendsList?.filter(f => f.status === 'pending' && !f.is_incoming) || [];

  return {
    friendsList,
    acceptedFriends,
    pendingIncoming,
    pendingOutgoing,
    isLoading,
    sendRequest,
    respondRequest,
    removeFriend
  };
};
