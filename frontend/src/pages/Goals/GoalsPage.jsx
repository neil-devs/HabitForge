import React, { useState } from 'react';
import { useGoals } from '../../hooks/useGoals';
import { useChallenges } from '../../hooks/useChallenges';
import { Target, Plus, CheckCircle2, Clock, Trash2, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { AddGoalModal } from '../../components/goals/AddGoalModal';
import { useUiStore } from '../../store/uiStore';

const GoalsPage = () => {
  const { goals, isLoading: goalsLoading, deleteGoal, updateGoal } = useGoals();
  const { publicChallenges, isLoading: challengesLoading } = useChallenges();
  const { showConfirm } = useUiStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id) => {
    showConfirm({
      title: 'Delete Goal?',
      message: 'Are you sure you want to delete this goal?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => deleteGoal.mutate(id)
    });
  };

  const handleComplete = (goal) => {
    updateGoal.mutate({ id: goal.id, data: { is_completed: !goal.is_completed } });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Target className="text-accent-rose" />
            Goals & Challenges
          </h1>
          <p className="text-text-secondary mt-1">
            Set long-term milestones and participate in community challenges.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus size={18} /> Add Goal
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {goalsLoading ? (
          <>
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </>
        ) : goals.length === 0 ? (
          <div className="col-span-full p-12 text-center border border-dashed border-border-subtle rounded-2xl text-text-muted">
            You haven't set any long-term goals yet. Click "Add Goal" to start planning!
          </div>
        ) : (
          goals.map((goal) => {
            const progress = Math.min(100, Math.max(0, (goal.current_value / goal.target_value) * 100));
            
            return (
              <Card key={goal.id} className={`p-6 transition-all ${goal.is_completed ? 'opacity-70 border-accent-emerald/30' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-xl font-bold ${goal.is_completed ? 'text-accent-emerald line-through' : 'text-text-primary'}`}>
                      {goal.title}
                    </h3>
                    <p className="text-sm text-text-muted mt-1">{goal.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleComplete(goal)}
                      className={`p-2 rounded-lg transition-colors ${goal.is_completed ? 'text-accent-emerald bg-accent-emerald/10' : 'text-text-muted hover:text-text-primary'}`}
                    >
                      <CheckCircle2 size={20} />
                    </button>
                    <button 
                      onClick={() => handleDelete(goal.id)}
                      className="p-2 text-text-muted hover:text-accent-rose rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Progress</span>
                    <span className="font-mono">{goal.current_value} / {goal.target_value} {goal.unit}</span>
                  </div>
                  <ProgressBar progress={progress} color={goal.is_completed ? 'var(--accent-emerald)' : 'var(--accent-rose)'} />
                </div>

                {goal.deadline && (
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Clock size={14} />
                    Target: {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
      
      
      <div className="pt-8 border-t border-border-subtle mt-12">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <Users className="text-accent-blue" />
          Community Challenges
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {challengesLoading ? (
            <>
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </>
          ) : publicChallenges.length === 0 ? (
            <div className="col-span-full p-8 text-center border border-dashed border-border-subtle rounded-2xl text-text-muted">
              No active challenges right now.
            </div>
          ) : (
            publicChallenges.map(challenge => (
              <Card key={challenge.id} className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{challenge.title}</h3>
                  <span className="bg-bg-tertiary px-2 py-1 rounded text-xs font-mono">{challenge.duration_days} Days</span>
                </div>
                <p className="text-text-secondary mb-4">{challenge.description}</p>
                <div className="flex justify-between items-center text-sm text-text-muted">
                  <span className="flex items-center gap-1"><Users size={14} /> {challenge.participant_count || 0} participants</span>
                  <Button size="sm" variant="outline">Join Challenge</Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
      
      <AddGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default GoalsPage;
