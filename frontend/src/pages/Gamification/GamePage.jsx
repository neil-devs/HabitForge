import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { useSocketStore } from '../../store/socketStore';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { Avatar } from '../../components/ui/Avatar';
import { Trophy, Star, Shield, Zap } from 'lucide-react';
import { ProgressBar } from '../../components/ui/ProgressBar';

const GamePage = () => {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['gamification', 'profile'],
    queryFn: async () => (await api.get('/gamification/profile')).data.data
  });

  const { data: badges, isLoading: badgesLoading } = useQuery({
    queryKey: ['gamification', 'badges'],
    queryFn: async () => (await api.get('/gamification/badges')).data.data
  });

  const { data: leaderboard, isLoading: lbLoading } = useQuery({
    queryKey: ['gamification', 'leaderboard'],
    queryFn: async () => (await api.get('/gamification/leaderboard')).data.data
  });

  const queryClient = useQueryClient();
  const { socket } = useSocketStore();

  React.useEffect(() => {
    if (!socket) return;
    
    const handleXpGained = (data) => {
      // Update Leaderboard Cache
      queryClient.setQueryData(['gamification', 'leaderboard'], (old) => {
        if (!old) return old;
        // Check if user is in leaderboard
        const exists = old.some(u => u.id === data.userId);
        if (!exists) return old;
        
        const newLb = old.map(u => u.id === data.userId ? { ...u, xp_total: data.newTotal, level: data.level } : u);
        return newLb.sort((a, b) => b.xp_total - a.xp_total);
      });
      
      // We could also update profile cache here if we check if data.userId === currentUser.id
    };

    socket.on('user_xp_gained', handleXpGained);
    return () => socket.off('user_xp_gained', handleXpGained);
  }, [socket, queryClient]);

  if (profileLoading || badgesLoading) return <Skeleton className="w-full h-screen rounded-xl" />;

  const xpProgress = Math.min(100, Math.max(0, (profile?.level_info?.currentLevelXp / profile?.level_info?.xpRequiredForNext) * 100));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Hero Stats */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-bg-secondary to-bg-tertiary border-border-subtle p-8">
        <div className="absolute right-0 top-0 w-64 h-64 bg-accent-amber/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-accent-amber p-1 flex items-center justify-center bg-bg-primary shadow-glow-amber">
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-accent-amber to-accent-rose">
                Lvl {profile?.level}
              </span>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-accent-amber text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              Hero
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">Player Stats</h1>
            <p className="text-text-muted mb-6">Total Experience: <span className="font-mono font-bold text-accent-amber">{profile?.xp_total} XP</span></p>
            
            <div className="space-y-2 max-w-md mx-auto md:mx-0">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Progress to Lvl {profile?.level + 1}</span>
                <span className="font-mono">{profile?.level_info?.currentLevelXp} / {profile?.level_info?.xpRequiredForNext}</span>
              </div>
              <ProgressBar progress={xpProgress} height={12} color="var(--accent-amber)" className="bg-black/20" />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Badges */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="text-accent-amber" /> Badge Cabinet
          </h2>
          <Card className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {badges?.map(badge => (
                <div key={badge.id} className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all ${badge.is_earned ? 'border-accent-amber/30 bg-accent-amber/5 hover:border-accent-amber' : 'border-border-subtle opacity-50 grayscale hover:grayscale-0'}`}>
                  <div className="w-16 h-16 rounded-full bg-bg-primary border-2 border-current mb-3 flex items-center justify-center shadow-sm" style={{ color: badge.is_earned ? badge.color || 'var(--accent-amber)' : 'var(--text-muted)' }}>
                    {/* Placeholder icon, in real app use badge.icon mapped to lucide */}
                    <Star size={32} />
                  </div>
                  <h3 className="font-bold text-sm leading-tight mb-1">{badge.name}</h3>
                  <p className="text-xs text-text-muted line-clamp-2">{badge.description}</p>
                  <div className="mt-2 text-[10px] font-mono bg-bg-primary px-2 py-1 rounded-md text-accent-amber">+{badge.xp_reward} XP</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Leaderboard */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="text-accent-emerald" /> Leaderboard
          </h2>
          <Card className="overflow-hidden">
            <div className="divide-y divide-border-subtle">
              {leaderboard?.map((user, idx) => (
                <div key={user.id} className={`flex items-center gap-4 p-4 transition-colors ${idx === 0 ? 'bg-accent-amber/5' : ''}`}>
                  <div className={`w-8 h-8 flex items-center justify-center font-bold font-mono ${idx === 0 ? 'text-accent-amber text-lg' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-text-muted'}`}>
                    #{idx + 1}
                  </div>
                  <Avatar src={user.avatar_url} fallback={user.username} size="sm" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{user.display_name || user.username}</h4>
                    <div className="text-xs text-text-muted">Lvl {user.level}</div>
                  </div>
                  <div className="font-mono font-bold text-sm text-accent-emerald text-right">
                    {user.xp_total} <span className="text-[10px]">XP</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default GamePage;
