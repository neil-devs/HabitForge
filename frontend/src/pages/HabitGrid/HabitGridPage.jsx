import React, { useState } from 'react';
import { useLogs } from '../../hooks/useLogs';
import { useHabits } from '../../hooks/useHabits';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { ChevronLeft, ChevronRight, Check, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { AddHabitModal } from '../../components/habits/AddHabitModal';
import { format, subDays, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { cn } from '../../utils/cn';
import { playSound } from '../../lib/sound';

const HabitGridPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Calculate week range (Mon-Sun)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const { getWeekData, toggleLog } = useLogs();
  const { data: gridData, isLoading } = getWeekData(
    format(weekStart, 'yyyy-MM-dd'),
    format(weekEnd, 'yyyy-MM-dd')
  );

  const prevWeek = () => setCurrentDate(subDays(currentDate, 7));
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const isCurrentWeek = endOfWeek(new Date(), { weekStartsOn: 1 }).getTime() === weekEnd.getTime();

  const handleToggle = (habitId, dateStr, isCompleted) => {
    // Optimistic UI updates handled by React Query in real app, simple toggle here
    toggleLog.mutate({ habit_id: habitId, logged_date: dateStr });
  };

  if (isLoading) {
    return <Skeleton className="w-full h-96 rounded-2xl" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Habit Grid</h1>
          <p className="text-text-muted">Track your consistency across all habits.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-bg-secondary p-1 rounded-lg border border-border-subtle">
            <button onClick={prevWeek} className="p-2 hover:bg-bg-tertiary rounded-md transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="font-medium text-sm min-w-[140px] text-center tnum">
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </span>
            <button 
              onClick={nextWeek} 
              disabled={isCurrentWeek}
              className="p-2 hover:bg-bg-tertiary rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <Button variant="primary" size="sm" className="gap-2" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> Add Habit
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border border-border-subtle shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-bg-tertiary/50 border-b border-border-subtle">
                <th className="p-4 font-semibold w-1/3">Habit</th>
                <th className="p-4 font-semibold text-center w-24">Streak</th>
                {daysInWeek.map((day) => (
                  <th key={day.toString()} className="p-4 text-center">
                    <div className="text-xs text-text-muted uppercase mb-1">{format(day, 'EEE')}</div>
                    <div className="font-semibold">{format(day, 'd')}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {gridData?.map((habit) => (
                <tr key={habit.id} className="hover:bg-bg-tertiary/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-bg-tertiary flex items-center justify-center text-lg">
                        {habit.emoji}
                      </div>
                      <span className="font-medium">{habit.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center justify-center bg-accent-amber/10 text-accent-amber font-mono font-bold text-sm px-3 py-1 rounded-full min-w-[3rem]">
                      {habit.current_streak}
                    </div>
                  </td>
                  {daysInWeek.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isFuture = day > new Date();
                    const cellData = habit.days[dateStr];
                    const isCompleted = cellData?.completed;

                    return (
                      <td key={dateStr} className="p-4 text-center align-middle">
                        <button
                          disabled={isFuture}
                          onClick={() => handleToggle(habit.id, dateStr, isCompleted)}
                          className={cn(
                            "w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all mx-auto",
                            isFuture && "opacity-20 cursor-not-allowed border-dashed border-border-subtle bg-transparent",
                            !isFuture && !isCompleted && "border-border-subtle bg-bg-secondary hover:border-text-muted hover:bg-bg-tertiary",
                            !isFuture && isCompleted && "bg-accent-emerald border-accent-emerald text-white tick-animation shadow-glow-emerald"
                          )}
                          style={{
                            backgroundColor: isCompleted && habit.color ? habit.color : undefined,
                            borderColor: isCompleted && habit.color ? habit.color : undefined,
                          }}
                        >
                          {isCompleted && <Check strokeWidth={3} size={20} />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
              
              {gridData?.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-text-muted">
                    No habits found. Create some habits to see your grid!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <AddHabitModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};

export default HabitGridPage;
