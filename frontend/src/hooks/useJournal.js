import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export const useJournal = () => {
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const res = await api.get('/notes');
      return res.data.data;
    },
  });

  const createNote = useMutation({
    mutationFn: async (noteData) => {
      const res = await api.post('/notes', noteData);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries(['notes']),
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/notes/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries(['notes']),
  });

  const deleteNote = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/notes/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries(['notes']),
  });

  return {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote
  };
};
