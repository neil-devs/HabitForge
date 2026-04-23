import { create } from 'zustand';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,
  liveEvents: [], // Store recent events for the ticker

  connect: (token) => {
    const currentSocket = get().socket;
    if (currentSocket?.connected) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      withCredentials: true
    });

    socket.on('connect', () => {
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    // Global Listeners
    socket.on('user_xp_gained', (data) => {
      get().addLiveEvent({
        id: Date.now() + Math.random(),
        type: 'xp',
        message: `${data.displayName} earned ${data.amount} XP!`,
        data
      });
    });

    socket.on('badge_earned', (data) => {
      get().addLiveEvent({
        id: Date.now() + Math.random(),
        type: 'badge',
        message: `${data.displayName} unlocked the ${data.badgeName} badge!`,
        data
      });
    });

    set({ socket });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  addLiveEvent: (event) => {
    set((state) => {
      const newEvents = [event, ...state.liveEvents].slice(0, 50); // keep last 50
      return { liveEvents: newEvents };
    });
  }
}));
