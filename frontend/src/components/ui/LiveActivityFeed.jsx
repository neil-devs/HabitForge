import React from 'react';
import { Card } from './Card';
import { useSocketStore } from '../../store/socketStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Star, Trophy } from 'lucide-react';

export const LiveActivityFeed = () => {
  const { liveEvents, isConnected } = useSocketStore();

  return (
    <Card className="p-0 overflow-hidden flex flex-col h-[300px]">
      <div className="p-4 border-b border-border-subtle bg-bg-tertiary flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-accent-amber" />
          <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider">Live Global Feed</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-accent-emerald' : 'bg-text-muted'}`}></span>
          </span>
          <span className="text-xs font-mono text-text-muted">{isConnected ? 'ONLINE' : 'CONNECTING'}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        <AnimatePresence initial={false}>
          {liveEvents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="h-full flex flex-col items-center justify-center text-text-muted p-4 text-center"
            >
              <Activity size={32} className="mb-2 opacity-20" />
              <p className="text-sm">Listening for global activity...</p>
            </motion.div>
          ) : (
            liveEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                layout
                className="p-3 bg-bg-primary border border-border-subtle rounded-lg flex items-start gap-3 shadow-sm"
              >
                <div className={`mt-0.5 p-1.5 rounded-full ${event.type === 'badge' ? 'bg-accent-violet/10 text-accent-violet' : 'bg-accent-amber/10 text-accent-amber'}`}>
                  {event.type === 'badge' ? <Trophy size={14} /> : <Star size={14} />}
                </div>
                <div>
                  <p className="text-sm text-text-primary leading-tight">
                    <span className="font-bold">{event.data.displayName}</span> {event.type === 'xp' ? `earned ${event.data.amount} XP` : `unlocked a badge!`}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {event.type === 'xp' ? event.data.reason : event.data.badgeName}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};
