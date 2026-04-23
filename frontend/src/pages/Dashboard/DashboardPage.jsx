import React, { useState } from 'react';
import { useHabits } from '../../hooks/useHabits';
import { useLogs } from '../../hooks/useLogs';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Checkbox } from '../../components/ui/Checkbox';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';
import { CATEGORY_COLORS } from '../../constants/theme';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { AddHabitModal } from '../../components/habits/AddHabitModal';
import { CountUpNumber } from '../../components/animations/CountUpNumber';
import { format } from 'date-fns';
import { LiveActivityFeed } from '../../components/ui/LiveActivityFeed';
import { AICoachWidget } from '../../components/ui/AICoachWidget';
import { useUiStore } from '../../store/uiStore';

const DashboardPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { habits, isLoading: habitsLoading, deleteHabit } = useHabits();
  const { getTodayStatus, toggleLog } = useLogs();
  const { data: todayStatus, isLoading: statusLoading } = getTodayStatus();
  
  const { getOverview } = useAnalytics();
  const { data: overview } = getOverview;
  const { soundEnabled, showConfirm } = useUiStore();

  const handleToggle = (habit) => {
    // Optimistic sound play based on checking it off (not unchecking)
    if (!habit.completed && soundEnabled) {
      new Audio('/sounds/success.wav').play().catch(e => console.log('Audio play failed', e));
    }
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    toggleLog.mutate({ habit_id: habit.habit_id, logged_date: today });
  };

  const handleAddHabitClick = () => {
    if (soundEnabled) {
      new Audio('/sounds/click.wav').play().catch(e => console.log('Audio play failed', e));
    }
    setIsAddModalOpen(true);
  };

  const handleDelete = async (habitId) => {
    showConfirm({
      title: 'Delete Quest?',
      message: 'Are you sure you want to delete this quest forever? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        await deleteHabit.mutateAsync(habitId);
      }
    });
  };

  if (habitsLoading || statusLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Calculate today's progress
  const totalActive = todayStatus?.length || 0;
  const completed = todayStatus?.filter(h => h.completed)?.length || 0;
  const progressPercent = totalActive > 0 ? (completed / totalActive) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Daily Summary Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-bg-secondary to-bg-tertiary border border-border-subtle p-8">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Good morning, Hero!</h1>
            <p className="text-text-secondary">
              You've completed {completed} out of {totalActive} habits today. Keep it up!
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold font-mono">{Math.round(progressPercent)}%</div>
              <div className="text-xs text-text-muted uppercase tracking-wider">Daily Goal</div>
            </div>
            {/* Simple circular progress */}
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-bg-primary shadow-inner">
               <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-border-subtle" />
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" 
                        strokeDasharray={175.9} strokeDashoffset={175.9 - (175.9 * progressPercent) / 100}
                        className="text-accent-emerald transition-all duration-1000 ease-out" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* AI Coach Integration */}
      <AICoachWidget />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Today's Habits List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Today</h1>
              <p className="text-text-secondary mt-1">
                {format(new Date(), 'EEEE, MMMM do, yyyy')}
              </p>
            </div>
            <Button onClick={handleAddHabitClick} className="tour-add-habit gap-2 shadow-lg shadow-accent-emerald/20 hover:shadow-accent-emerald/40 hover:-translate-y-0.5 transition-all">
              <Plus size={18} />
              Add Habit
            </Button>
          </div>

          <div className="grid gap-3">
            {todayStatus?.map((habit) => (
              <Card 
                key={habit.habit_id} 
                hover 
                className={`flex items-center p-4 transition-all duration-300 ${habit.completed ? 'opacity-70 bg-bg-tertiary' : ''}`}
              >
                <div className="flex-1 flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                    style={{ backgroundColor: `${habit.color || CATEGORY_COLORS[habit.category]}20` }}
                  >
                    {habit.emoji}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg transition-colors ${habit.completed ? 'text-text-secondary line-through decoration-2 decoration-accent-emerald/50' : 'text-text-primary'}`}>
                      {habit.name}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="default" className="text-[10px] uppercase">
                        {habit.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="pl-4 flex items-center gap-2">
                  <button 
                    onClick={() => handleDelete(habit.habit_id)}
                    className="p-2 text-text-muted hover:text-accent-rose hover:bg-bg-primary rounded-lg transition-colors"
                    title="Delete Quest"
                  >
                    <Trash2 size={18} />
                  </button>
                  <Checkbox 
                    size={32}
                    checked={!!habit.completed}
                    onChange={() => handleToggle(habit)}
                    color="var(--accent-emerald)"
                  />
                </div>
              </Card>
            ))}
            
            {todayStatus?.length === 0 && (
              <div className="p-12 text-center border border-dashed border-border-subtle rounded-2xl text-text-muted">
                No active habits found. Create one to begin your journey!
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-sm text-text-secondary uppercase tracking-wider mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border-subtle">
                <span className="text-text-secondary">Best Streak</span>
                <CountUpNumber value={overview?.best_streak || 0} suffix=" Days" className="font-mono font-bold text-accent-amber" />
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border-subtle">
                <span className="text-text-secondary">Monthly XP</span>
                <CountUpNumber value={overview?.xp_this_month || 0} prefix="+" suffix=" XP" className="font-mono font-bold text-accent-emerald" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Total Completions</span>
                <CountUpNumber value={overview?.total_completions || 0} className="font-mono font-bold text-text-primary" />
              </div>
            </div>
          </Card>
          
          <LiveActivityFeed />
          
          <Card className="p-6 bg-gradient-to-br from-accent-violet/10 to-transparent border-accent-violet/20">
            <h3 className="font-bold text-accent-violet mb-2">Pro Tip</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Consistently logging your habits every morning increases your chance of maintaining a streak by 40%.
            </p>
          </Card>
        </div>
      </div>

      <AddHabitModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};

export default DashboardPage;
