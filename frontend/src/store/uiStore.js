import { create } from 'zustand';

export const useUiStore = create((set) => ({
  
  // Confirmation Dialog
  confirmDialog: {
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
  },
  showConfirm: (options) => set((state) => ({
    confirmDialog: { ...state.confirmDialog, ...options, isOpen: true }
  })),
  closeConfirm: () => set((state) => ({
    confirmDialog: { ...state.confirmDialog, isOpen: false }
  })),
  soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
  toggleSound: () => set((state) => {
    const newVal = !state.soundEnabled;
    localStorage.setItem('soundEnabled', newVal);
    return { soundEnabled: newVal };
  }),
  setSoundEnabled: (val) => set({ soundEnabled: val }),

  startOfWeek: localStorage.getItem('startOfWeek') || 'monday',
  setStartOfWeek: (val) => {
    localStorage.setItem('startOfWeek', val);
    set({ startOfWeek: val });
  },

  timezone: localStorage.getItem('timezone') || 'utc',
  setTimezone: (val) => {
    localStorage.setItem('timezone', val);
    set({ timezone: val });
  },

  theme: localStorage.getItem('theme') || 'dark',
  setTheme: (newTheme) => {
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System Default
      localStorage.removeItem('theme');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    set({ theme: newTheme });
  },
  
  initializeTheme: () => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }
}));
