import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const ProgressBar = ({ progress = 0, height = 8, color = 'var(--accent-emerald)', className }) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div 
      className={cn("w-full bg-bg-tertiary overflow-hidden rounded-full", className)}
      style={{ height }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${normalizedProgress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
};
