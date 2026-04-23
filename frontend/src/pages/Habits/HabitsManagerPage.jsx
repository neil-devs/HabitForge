import React, { useState } from 'react';
import { useHabits } from '../../hooks/useHabits';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { Plus, Edit2 } from 'lucide-react';
import { CATEGORY_COLORS } from '../../constants/theme';
import { AddHabitModal } from '../../components/habits/AddHabitModal';
import { EditHabitModal } from '../../components/habits/EditHabitModal';

const HabitsManagerPage = () => {
  const { habits, isLoading } = useHabits();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Quests</h1>
          <p className="text-text-muted">Create, edit, or delete your active habits.</p>
        </div>
        <Button variant="primary" className="gap-2" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} /> New Habit
        </Button>
      </div>

      <div className="grid gap-4">
        {habits?.length === 0 ? (
          <Card className="p-12 text-center text-text-muted border-dashed">
            You don't have any habits yet. Click the button above to create one!
          </Card>
        ) : (
          habits?.map(habit => (
            <Card key={habit.id} className="p-4 flex items-center justify-between hover:border-text-muted transition-colors group">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                  style={{ backgroundColor: `${habit.color || CATEGORY_COLORS[habit.category]}20` }}
                >
                  {habit.emoji}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{habit.name}</h3>
                  <div className="flex gap-2 text-xs text-text-muted mt-1">
                    <span className="uppercase px-2 py-0.5 bg-bg-tertiary rounded-md">{habit.category}</span>
                    <span className="uppercase px-2 py-0.5 bg-bg-tertiary rounded-md">{habit.frequency}</span>
                    <span className="text-accent-amber font-mono">Streak: {habit.current_streak}</span>
                  </div>
                </div>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-text-secondary hover:text-text-primary"
                  onClick={() => setEditingHabit(habit)}
                >
                  <Edit2 size={16} className="mr-2" /> Edit
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <AddHabitModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      {editingHabit && (
        <EditHabitModal 
          isOpen={!!editingHabit} 
          onClose={() => setEditingHabit(null)} 
          habit={editingHabit} 
        />
      )}
    </div>
  );
};

export default HabitsManagerPage;
