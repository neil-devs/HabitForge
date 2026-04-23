import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { Card } from './Card';
import { Bot, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export const AICoachWidget = () => {
  const { data: insight, isLoading, error } = useQuery({
    queryKey: ['ai', 'coach'],
    queryFn: async () => (await api.get('/ai/coach')).data.data,
    retry: 1,
    staleTime: 1000 * 60 * 60 * 24 // Cache for 24 hours
  });

  const [displayedText, setDisplayedText] = useState('');

  // Typing effect
  useEffect(() => {
    if (insight?.insight_text) {
      setDisplayedText('');
      let i = 0;
      const text = insight.insight_text;
      
      const intervalId = setInterval(() => {
        setDisplayedText(text.substring(0, i));
        i++;
        if (i > text.length) {
          clearInterval(intervalId);
        }
      }, 30); // 30ms per character

      return () => clearInterval(intervalId);
    }
  }, [insight]);

  if (isLoading) {
    return (
      <Card className="p-6 relative overflow-hidden bg-bg-tertiary/50 border-border-subtle animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-border-subtle" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-border-subtle rounded w-3/4" />
            <div className="h-4 bg-border-subtle rounded w-1/2" />
          </div>
        </div>
      </Card>
    );
  }

  if (error || !insight) return null;

  // Determine styling based on insight type
  let colorClass = 'text-accent-sky';
  let bgClass = 'from-accent-sky/20 to-transparent border-accent-sky/30';
  let glowClass = 'shadow-glow-amber'; // just reusing classes, can adjust
  let Icon = Sparkles;

  if (insight.type === 'warning') {
    colorClass = 'text-accent-rose';
    bgClass = 'from-accent-rose/20 to-transparent border-accent-rose/30';
    Icon = AlertCircle;
  } else if (insight.type === 'strategy') {
    colorClass = 'text-accent-emerald';
    bgClass = 'from-accent-emerald/20 to-transparent border-accent-emerald/30';
    Icon = ShieldAlert;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`p-6 relative overflow-hidden bg-gradient-to-br ${bgClass} border`}>
        {/* Holographic background effect */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 flex gap-4 items-start">
          <div className={`mt-1 p-3 rounded-full bg-bg-primary shadow-lg border border-border-subtle ${colorClass}`}>
            <Bot size={24} className="animate-pulse" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`font-bold text-sm uppercase tracking-widest ${colorClass}`}>
                AI Habit Coach
              </h3>
              <Icon size={14} className={colorClass} />
            </div>
            
            <p className="text-text-primary text-lg leading-relaxed font-medium min-h-[3rem]">
              {displayedText}
              {displayedText.length < (insight.insight_text?.length || 0) && (
                <span className="inline-block w-1 h-5 ml-1 bg-text-primary animate-pulse align-middle" />
              )}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
