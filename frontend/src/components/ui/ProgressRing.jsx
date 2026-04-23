import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const ProgressRing = ({ 
  progress = 0, 
  size = 40, 
  strokeWidth = 4, 
  color = 'var(--accent-emerald)', 
  trackColor = 'var(--bg-tertiary)',
  className 
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex items-center justify-center text-xs font-medium text-text-primary">
        {Math.round(normalizedProgress)}%
      </div>
    </div>
  );
};
