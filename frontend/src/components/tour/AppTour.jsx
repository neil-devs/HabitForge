import React, { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

const CustomTooltip = ({
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  isLastStep,
}) => (
  <div {...tooltipProps} className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 font-sans relative overflow-hidden">
    {/* Glassmorphism gradient background accent */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-amber via-accent-rose to-accent-violet"></div>
    
    <div className="mb-6 mt-2">
      {step.title && <h3 className="text-lg font-bold text-text-primary mb-2">{step.title}</h3>}
      <div className="text-text-secondary text-sm leading-relaxed">{step.content}</div>
    </div>
    
    <div className="flex justify-between items-center pt-4 border-t border-border-subtle/50">
      <div className="text-xs font-bold text-text-muted tracking-widest uppercase">
        Step {index + 1}
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" {...closeProps} className="text-text-muted hover:text-text-primary text-xs h-8">
          Skip
        </Button>
        {index > 0 && (
          <Button variant="outline" size="sm" {...backProps} className="text-xs h-8">
            Back
          </Button>
        )}
        <Button size="sm" {...primaryProps} className="bg-accent-amber text-white hover:bg-accent-amber/90 text-xs h-8 border-none">
          {isLastStep ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  </div>
);

const AppTour = () => {
  const [run, setRun] = useState(false);
  const { user } = useAuthStore();
  
  // Create a unique storage key for this specific user (supporting both id and _id)
  const userId = user?._id || user?.id || 'unknown';
  const storageKey = `hasSeenTour_${userId}`;

  const steps = [
    {
      target: 'body',
      title: 'Welcome to HabitForge Pro! 🚀',
      content: 'Let\'s take a quick tour to get you started on your journey to becoming your best self.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.tour-add-habit',
      title: 'Create Your Quests',
      content: 'Click here to create your first habit. You can set it to repeat daily or on specific days of the week!',
      placement: 'bottom',
    },
    {
      target: '.tour-gamification',
      title: 'Level Up Your Life',
      content: 'Here is your Gamification Hub. Complete habits to earn XP, level up, and unlock awesome badges!',
      placement: 'bottom',
    },
    {
      target: '.tour-notifications',
      title: 'Stay Notified',
      content: 'Keep an eye on this bell! It will notify you when you earn a new badge or receive friend requests.',
      placement: 'bottom',
    },
  ];

  useEffect(() => {
    if (!user) return; // Wait until user is loaded
    
    const hasSeenTour = localStorage.getItem(storageKey);
    console.log('[AppTour] hasSeenTour:', hasSeenTour);
    if (!hasSeenTour) {
      console.log('[AppTour] Starting timer...');
      const timer = setTimeout(() => {
        console.log('[AppTour] Setting run to true!');
        setRun(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, storageKey]);

  const handleJoyrideCallback = (data) => {
    const { status, type } = data;
    
    // Check for finished/skipped status OR tour:end event
    const isFinished = 
      [STATUS.FINISHED, STATUS.SKIPPED].includes(status) || 
      type === 'tour:end';
      
    if (isFinished) {
      setRun(false);
      const currentUser = useAuthStore.getState().user;
      const currentUserId = currentUser?._id || currentUser?.id || 'unknown';
      localStorage.setItem(`hasSeenTour_${currentUserId}`, 'true');
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      tooltipComponent={CustomTooltip}
      styles={{
        options: {
          zIndex: 10000,
        },
        overlay: {
          backgroundColor: 'rgba(15, 17, 26, 0.7)',
          backdropFilter: 'blur(8px)',
        }
      }}
    />
  );
};

export default AppTour;
