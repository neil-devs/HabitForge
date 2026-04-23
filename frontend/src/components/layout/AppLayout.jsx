import React from 'react';
import { Outlet, useLocation, useOutlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopNav from './TopNav';
import AppTour from '../tour/AppTour';
import { ConfirmModal } from '../ui/ConfirmModal';
import { cn } from '../../utils/cn';

const AppLayout = () => {
  const location = useLocation();
  const currentOutlet = useOutlet();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex relative overflow-hidden">
      {/* Ambient ASMR Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-amber/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-accent-violet/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-accent-sky/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob-slow"></div>
      </div>

      {/* The background orbs stay, we remove Sidebar entirely */}
      <div className="flex flex-col flex-1 min-h-screen transition-all duration-300">
        <TopNav />
        {/* Added pt-24 to account for the fixed top nav island */}
        <main className="flex-1 px-6 lg:px-8 py-8 pt-28 max-w-7xl mx-auto w-full z-10 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              {currentOutlet}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <AppTour />
      <ConfirmModal />
    </div>
  );
};

export default AppLayout;
