import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageTransition } from '../../components/animations/PageTransition';
import { Skeleton } from '../../components/ui/Skeleton';
import { Avatar } from '../../components/ui/Avatar';
import { useSocketStore } from '../../store/socketStore';
import { Shield, Swords, Plus, Users, Crown, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const GuildsPage = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocketStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newGuildData, setNewGuildData] = useState({ name: '', description: '', emblem: '🛡️' });

  // 1. Fetch My Guild
  const { data: myGuild, isLoading: myGuildLoading } = useQuery({
    queryKey: ['guilds', 'my'],
    queryFn: async () => {
      try {
        return (await api.get('/guilds/my')).data.data;
      } catch (err) {
        return null;
      }
    }
  });

  // 2. Fetch All Guilds (if not in one)
  const { data: allGuilds, isLoading: allGuildsLoading } = useQuery({
    queryKey: ['guilds', 'all'],
    queryFn: async () => (await api.get('/guilds')).data.data,
    enabled: !myGuild
  });

  // 3. Socket Listener for Boss Damage
  useEffect(() => {
    if (!socket || !myGuild?.active_raid) return;

    const handleBossDamaged = (data) => {
      if (data.guildId === myGuild.id) {
        // Optimistically update the boss HP
        queryClient.setQueryData(['guilds', 'my'], (old) => {
          if (!old) return old;
          return {
            ...old,
            active_raid: {
              ...old.active_raid,
              current_hp: data.currentHp,
              status: data.status
            }
          };
        });
        toast.success(`${data.userDisplayName} dealt ${data.damageDealt} DMG to ${data.bossName}!`, { icon: '⚔️' });
      }
    };

    socket.on('boss_damaged', handleBossDamaged);
    return () => socket.off('boss_damaged', handleBossDamaged);
  }, [socket, myGuild, queryClient]);

  // Mutations
  const createGuildMut = useMutation({
    mutationFn: async (data) => await api.post('/guilds', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['guilds']);
      toast.success('Guild created successfully!');
      setIsCreating(false);
    }
  });

  const joinGuildMut = useMutation({
    mutationFn: async (guildId) => await api.post(`/guilds/${guildId}/join`),
    onSuccess: () => {
      queryClient.invalidateQueries(['guilds']);
      toast.success('Joined guild successfully!');
    }
  });

  const handleCreate = (e) => {
    e.preventDefault();
    createGuildMut.mutate(newGuildData);
  };

  if (myGuildLoading) return <Skeleton className="w-full h-screen rounded-xl" />;

  // ====== VIEW: My Guild Headquarters ======
  if (myGuild) {
    const raid = myGuild.active_raid;
    const hpPercent = raid ? Math.max(0, (raid.current_hp / raid.total_hp) * 100) : 0;

    return (
      <PageTransition className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-gradient-to-r from-bg-secondary to-bg-tertiary p-8 rounded-3xl border border-border-subtle relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-amber/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-bg-primary flex items-center justify-center text-5xl border border-border-subtle shadow-lg">
              {myGuild.emblem}
            </div>
            <div>
              <h1 className="text-4xl font-black mb-1">{myGuild.name}</h1>
              <p className="text-text-secondary">{myGuild.description}</p>
            </div>
          </div>
          
          <div className="relative z-10 text-right">
            <div className="text-xs text-text-muted uppercase tracking-widest mb-1">Guild Level</div>
            <div className="text-3xl font-mono font-bold text-accent-amber">{myGuild.total_xp} <span className="text-lg">XP</span></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Active Boss Raid */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Swords className="text-accent-rose" /> Active Boss Raid
            </h2>
            
            {raid ? (
              <Card className="p-8 border-accent-rose/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-rose/5 to-transparent opacity-50" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <motion.div 
                    key={raid.current_hp}
                    initial={{ x: 10 }}
                    animate={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    className="w-32 h-32 rounded-full bg-black/50 border-4 border-accent-rose flex items-center justify-center text-6xl shadow-glow-amber drop-shadow-2xl"
                  >
                    👾
                  </motion.div>
                  
                  <div className="flex-1 w-full text-center md:text-left">
                    <h3 className="text-2xl font-black text-text-primary mb-2">{raid.boss_name}</h3>
                    <div className="flex justify-between text-sm mb-2 font-mono">
                      <span className="text-accent-rose">HP</span>
                      <span>{raid.current_hp} / {raid.total_hp}</span>
                    </div>
                    
                    {/* HP Bar */}
                    <div className="w-full h-6 bg-black/40 rounded-full overflow-hidden border border-border-subtle relative p-0.5">
                      <motion.div 
                        initial={{ width: `${hpPercent}%` }}
                        animate={{ width: `${hpPercent}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-accent-rose to-red-600 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
                      </motion.div>
                    </div>

                    <p className="text-xs text-text-muted mt-4 text-center md:text-left">
                      Complete daily habits to deal damage to the boss!
                    </p>
                  </div>
                </div>
                
                {raid.status === 'defeated' && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
                    <span className="text-6xl mb-4">🎉</span>
                    <h2 className="text-3xl font-black text-accent-emerald">BOSS DEFEATED!</h2>
                    <p className="text-text-secondary mt-2">Waiting for next raid...</p>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-8 text-center border-dashed border-border-subtle">
                <span className="text-4xl mb-4 block">☮️</span>
                <h3 className="text-xl font-bold mb-2">Peace Restored</h3>
                <p className="text-text-muted">No active boss raids at the moment. Enjoy the peace while it lasts.</p>
              </Card>
            )}
          </div>

          {/* Member List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="text-accent-sky" /> Roster
            </h2>
            <Card className="p-0 overflow-hidden glass-panel">
              <div className="divide-y divide-border-subtle">
                {myGuild.members?.map(member => (
                  <div key={member.id} className="flex items-center gap-4 p-4">
                    <Avatar src={member.avatar_url} fallback={member.username} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{member.display_name || member.username}</h4>
                      <div className="text-xs text-text-muted capitalize flex items-center gap-1">
                        {member.role === 'leader' && <Crown size={12} className="text-accent-amber" />}
                        {member.role} • Lvl {member.level}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

        </div>
      </PageTransition>
    );
  }

  // ====== VIEW: Join or Create Guild ======
  return (
    <PageTransition className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black mb-4">Enterprise Guilds</h1>
        <p className="text-text-secondary max-w-2xl mx-auto text-lg">
          Join a team or create your own Guild. Complete daily habits together to defeat epic bosses and climb the global ranks!
        </p>
      </div>

      {!isCreating ? (
        <div className="space-y-8">
          <div className="flex justify-end">
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus size={18} /> Create New Guild
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allGuilds?.length === 0 ? (
              <div className="col-span-full p-12 text-center text-text-muted border border-dashed border-border-subtle rounded-3xl">
                No guilds exist yet. Be the first to create one!
              </div>
            ) : (
              allGuilds?.map(guild => (
                <Card key={guild.id} hover className="flex flex-col p-6 glass-panel border-border-subtle">
                  <div className="text-4xl mb-4">{guild.emblem}</div>
                  <h3 className="text-xl font-bold mb-2">{guild.name}</h3>
                  <p className="text-text-secondary text-sm flex-1 mb-6 line-clamp-3">{guild.description}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1 text-sm text-text-muted">
                      <Users size={16} /> {guild.member_count} Members
                    </div>
                    <div className="flex items-center gap-1 text-sm font-mono text-accent-amber font-bold">
                      <Zap size={16} /> {guild.total_xp}
                    </div>
                  </div>

                  <Button 
                    onClick={() => joinGuildMut.mutate(guild.id)}
                    disabled={joinGuildMut.isPending}
                    variant="secondary"
                    className="w-full border-border-subtle bg-bg-tertiary hover:bg-bg-primary hover:border-accent-emerald transition-colors"
                  >
                    Join Guild
                  </Button>
                </Card>
              ))
            )}
          </div>
        </div>
      ) : (
        <Card className="max-w-md mx-auto p-8 glass-panel animate-in zoom-in-95 duration-300">
          <h2 className="text-2xl font-bold mb-6 text-center">Found a New Guild</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Guild Name</label>
              <input 
                required
                type="text" 
                value={newGuildData.name}
                onChange={e => setNewGuildData({...newGuildData, name: e.target.value})}
                className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent-amber focus:outline-none"
                placeholder="e.g. The Night Owls"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
              <textarea 
                required
                rows={3}
                value={newGuildData.description}
                onChange={e => setNewGuildData({...newGuildData, description: e.target.value})}
                className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent-amber focus:outline-none resize-none"
                placeholder="What is your guild about?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Emblem Emoji</label>
              <input 
                required
                type="text" 
                maxLength={2}
                value={newGuildData.emblem}
                onChange={e => setNewGuildData({...newGuildData, emblem: e.target.value})}
                className="w-full bg-bg-tertiary border border-border-subtle rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent-amber focus:outline-none text-2xl text-center"
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button type="submit" className="flex-1" disabled={createGuildMut.isPending}>
                Create Guild
              </Button>
            </div>
          </form>
        </Card>
      )}
    </PageTransition>
  );
};

export default GuildsPage;
