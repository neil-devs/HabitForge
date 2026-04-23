import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

export const Confetti = ({ trigger, duration = 3000, particleCount = 100 }) => {
  useEffect(() => {
    if (trigger) {
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#f59e0b', '#10b981', '#8b5cf6', '#0ea5e9', '#f43f5e']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#f59e0b', '#10b981', '#8b5cf6', '#0ea5e9', '#f43f5e']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      frame();
    }
  }, [trigger, duration]);

  return null;
};
