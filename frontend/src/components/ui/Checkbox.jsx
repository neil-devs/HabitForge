import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Checkbox = ({ checked, onChange, color = '#10b981', size = 24, disabled = false, className }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    if (disabled) return;
    if (!checked) setIsAnimating(true);
    onChange(e);
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "relative flex items-center justify-center rounded-md border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary",
        disabled && "opacity-50 cursor-not-allowed",
        isAnimating && "tick-animation",
        className
      )}
      style={{
        width: size,
        height: size,
        borderColor: checked ? color : 'var(--border-subtle)',
        backgroundColor: checked ? color : 'transparent',
      }}
      onAnimationEnd={() => setIsAnimating(false)}
    >
      <motion.div
        initial={false}
        animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Check size={size * 0.7} color="white" strokeWidth={3} />
      </motion.div>
    </button>
  );
};
