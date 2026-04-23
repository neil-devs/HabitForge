import React, { useState } from 'react';
import { useChallenges } from '../../hooks/useChallenges';
import { Target, Users, Flame, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { PageTransition } from '../../components/animations/PageTransition';
import toast from 'react-hot-toast';

const ChallengesPage = () => {
  const { publicChallenges, myChallenges, isLoading, joinChallenge } = useChallenges();
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' or 'mine'

  const handleJoin = (challengeId) => {
    joinChallenge.mutate(challengeId, {
      onSuccess: () => {
        toast.success("Successfully joined the challenge!");
        setActiveTab('mine');
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Failed to join challenge");
      }
    });
  };

  return (
    <PageTransition className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Flame className="text-accent-rose" />
            Challenges
          </h1>
          <p className="text-text-secondary mt-1">
            Push your limits by joining global and community challenges.
          </p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-border-subtle pb-px">
        <button
          onClick={() => setActiveTab('explore')}
          className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'explore'
              ? 'border-accent-amber text-accent-amber'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Explore Challenges
        </button>
        <button
          onClick={() => setActiveTab('mine')}
          className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'mine'
              ? 'border-accent-amber text-accent-amber'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          My Active Challenges
          {myChallenges.length > 0 && (
            <span className="bg-bg-tertiary text-text-primary text-xs px-2 py-0.5 rounded-full">
              {myChallenges.length}
            </span>
          )}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </>
        ) : activeTab === 'explore' ? (
          publicChallenges.length === 0 ? (
            <div className="col-span-full p-12 text-center border border-dashed border-border-subtle rounded-2xl text-text-muted glass-panel">
              <Target size={40} className="mx-auto mb-4 opacity-50" />
              <p>No active public challenges right now.</p>
              <p className="text-sm mt-2">Check back later or start your own!</p>
            </div>
          ) : (
            publicChallenges.map((challenge) => {
              const isJoined = myChallenges.some(mc => mc.challenge_id === challenge.id);
              return (
                <Card key={challenge.id} className="p-6 glass-panel flex flex-col hover:border-accent-amber/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl leading-tight text-text-primary">{challenge.title}</h3>
                    <span className="bg-bg-tertiary text-text-secondary px-2 py-1 rounded text-xs font-mono shrink-0 ml-2">
                      {challenge.duration_days} Days
                    </span>
                  </div>
                  <p className="text-text-secondary mb-6 flex-1 text-sm">{challenge.description}</p>
                  <div className="flex justify-between items-center text-sm mt-auto pt-4 border-t border-border-subtle">
                    <span className="flex items-center gap-1.5 text-text-muted">
                      <Users size={16} /> 
                      {challenge.participant_count || 0} joined
                    </span>
                    {isJoined ? (
                      <span className="flex items-center gap-1 text-accent-emerald font-medium">
                        <CheckCircle2 size={16} /> Joined
                      </span>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="primary" 
                        onClick={() => handleJoin(challenge.id)}
                        disabled={joinChallenge.isPending}
                        className="shadow-glow-amber"
                      >
                        Join Challenge
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })
          )
        ) : (
          myChallenges.length === 0 ? (
            <div className="col-span-full p-12 text-center border border-dashed border-border-subtle rounded-2xl text-text-muted glass-panel">
              <Info size={40} className="mx-auto mb-4 opacity-50" />
              <p>You haven't joined any challenges yet.</p>
              <Button onClick={() => setActiveTab('explore')} variant="outline" className="mt-4">
                Explore Challenges
              </Button>
            </div>
          ) : (
            myChallenges.map((challenge) => {
              // Basic progress calculation
              const progressPct = Math.min(100, Math.max(0, ((challenge.progress || 0) / 100) * 100));
              
              return (
                <Card key={challenge.id} className="p-6 glass-panel flex flex-col relative overflow-hidden">
                  {/* Decorative background glow */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-amber/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <h3 className="font-bold text-xl leading-tight text-accent-amber">{challenge.title}</h3>
                    <span className="bg-bg-tertiary px-2 py-1 rounded text-xs font-mono shrink-0">
                      Active
                    </span>
                  </div>
                  <p className="text-text-secondary mb-6 flex-1 text-sm relative z-10">{challenge.description}</p>
                  
                  <div className="space-y-2 relative z-10 mt-auto pt-4 border-t border-border-subtle">
                    <div className="flex justify-between text-xs text-text-secondary">
                      <span>Progress</span>
                      <span>{Math.round(progressPct)}%</span>
                    </div>
                    <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent-amber to-accent-rose transition-all duration-1000"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </Card>
              );
            })
          )
        )}
      </div>
    </PageTransition>
  );
};

export default ChallengesPage;
