import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAuthStore } from './store/authStore';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Skeleton } from './components/ui/Skeleton';

import { useUiStore } from './store/uiStore';
import { useSocketStore } from './store/socketStore';

function App() {
  const { checkAuth, isLoading, isAuthenticated, token } = useAuthStore();
  const { initializeTheme } = useUiStore();
  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    checkAuth();
    initializeTheme();
  }, [checkAuth, initializeTheme]);

  useEffect(() => {
    if (isAuthenticated && token) {
      connect(token);
    } else {
      disconnect();
    }
  }, [isAuthenticated, token, connect, disconnect]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <Skeleton className="w-24 h-24 rounded-full" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
          },
          success: {
            iconTheme: {
              primary: 'var(--accent-emerald)',
              secondary: 'white',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
