import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { PageTransition } from '../../components/animations/PageTransition';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { User, Bell, Shield, Palette, Trash2, RefreshCcw, Download, Gamepad2, Mail, Globe, Calendar, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUiStore } from '../../store/uiStore';
import api from '../../lib/api';

const TABS = [
  { id: 'preferences', label: 'Preferences', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'gamification', label: 'Gamification', icon: Gamepad2 },
  { id: 'privacy', label: 'Data & Privacy', icon: Shield },
];

const SettingsPage = () => {
  const { user } = useAuthStore();
  const { theme, setTheme, soundEnabled, toggleSound, startOfWeek, setStartOfWeek, timezone, setTimezone, showConfirm } = useUiStore();
  const [activeTab, setActiveTab] = useState('preferences');

  const handleResetTour = () => {
    if (!user?.id && !user?._id) return;
    const userId = user.id || user._id;
    localStorage.removeItem(`hasSeenTour_${userId}`);
    toast.success('Onboarding tour reset! Redirecting...');
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);
  };

  const handleExportData = async () => {
    const loadingToast = toast.loading('Preparing your data export...', { icon: '📦' });
    try {
      const response = await api.get('/export/txt', {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HabitForge_Export_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Data exported successfully!', { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error('Failed to export data.', { id: loadingToast });
    }
  };

  const handleDeleteAccount = () => {
    showConfirm({
      title: 'Delete Account?',
      message: 'Are you absolutely sure? This will permanently delete your account, quests, and XP. This action cannot be undone.',
      confirmText: 'Delete Account',
      cancelText: 'Cancel',
      onConfirm: () => {
        toast.error('Account deletion is not enabled in this demo.');
      }
    });
  };

  return (
    <PageTransition className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your account preferences and app settings.</p>
      </div>

      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        
        {/* Settings Navigation */}
        <div className="w-full shrink-0">
          <Card className="p-2 glass-panel">
            <nav className="flex flex-row justify-center gap-2 overflow-x-auto custom-scrollbar">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex flex-1 sm:flex-none justify-center items-center gap-3 px-6 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive ? 'text-accent-amber' : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-accent-amber/10 rounded-lg border border-accent-amber/20"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <tab.icon size={18} className="relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Account section removed */}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <Card className="p-6 glass-panel">
                    <h2 className="text-xl font-bold mb-4">Application Preferences</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-bg-primary rounded-lg text-text-secondary"><Palette size={20} /></div>
                          <div>
                            <h3 className="font-medium text-text-primary">Theme</h3>
                            <p className="text-sm text-text-muted">Customize your interface style.</p>
                          </div>
                        </div>
                        <CustomSelect 
                          value={theme}
                          onChange={(val) => setTheme(val)}
                          options={[
                            { value: 'dark', label: 'Dark Mode' },
                            { value: 'light', label: 'Light Mode' },
                            { value: 'system', label: 'System Default' }
                          ]}
                        />
                      </div>

                      <hr className="border-border-subtle" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-bg-primary rounded-lg text-text-secondary"><Bell size={20} /></div>
                          <div>
                            <h3 className="font-medium text-text-primary">Sound Effects</h3>
                            <p className="text-sm text-text-muted">Play a sound when you complete a quest or level up.</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={soundEnabled} onChange={toggleSound} />
                          <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-amber"></div>
                        </label>
                      </div>

                      <hr className="border-border-subtle" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-bg-primary rounded-lg text-text-secondary"><Calendar size={20} /></div>
                          <div>
                            <h3 className="font-medium text-text-primary">Start of Week</h3>
                            <p className="text-sm text-text-muted">Choose which day your week begins on.</p>
                          </div>
                        </div>
                        <CustomSelect 
                          value={startOfWeek}
                          onChange={(val) => setStartOfWeek(val)}
                          options={[
                            { value: 'monday', label: 'Monday' },
                            { value: 'sunday', label: 'Sunday' }
                          ]}
                        />
                      </div>

                      <hr className="border-border-subtle" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-bg-primary rounded-lg text-text-secondary"><Globe size={20} /></div>
                          <div>
                            <h3 className="font-medium text-text-primary">Timezone</h3>
                            <p className="text-sm text-text-muted">Your daily quests will reset at midnight in this timezone.</p>
                          </div>
                        </div>
                        <CustomSelect 
                          value={timezone}
                          onChange={(val) => setTimezone(val)}
                          options={[
                            { value: 'utc', label: 'UTC (Default)' },
                            { value: 'est', label: 'America/New_York' },
                            { value: 'gmt', label: 'Europe/London' },
                            { value: 'jst', label: 'Asia/Tokyo' }
                          ]}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <Card className="p-6 glass-panel">
                    <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-bg-primary rounded-lg text-text-secondary"><Bell size={20} /></div>
                          <div>
                            <h3 className="font-medium text-text-primary">Daily Reminders</h3>
                            <p className="text-sm text-text-muted">Get a push notification if you haven't completed your daily quests.</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-amber"></div>
                        </label>
                      </div>

                      <hr className="border-border-subtle" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-bg-primary rounded-lg text-text-secondary"><Mail size={20} /></div>
                          <div>
                            <h3 className="font-medium text-text-primary">Weekly Report Emails</h3>
                            <p className="text-sm text-text-muted">Receive a beautifully formatted summary of your week in your inbox.</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-amber"></div>
                        </label>
                      </div>

                      <hr className="border-border-subtle" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-bg-primary rounded-lg text-text-secondary"><User size={20} /></div>
                          <div>
                            <h3 className="font-medium text-text-primary">Friend Activity</h3>
                            <p className="text-sm text-text-muted">Notify me when a friend levels up or earns a rare badge.</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-amber"></div>
                        </label>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'gamification' && (
                <div className="space-y-6">
                  <Card className="p-6 glass-panel">
                    <h2 className="text-xl font-bold mb-4">Gamification Controls</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-bg-primary rounded-lg text-text-secondary"><Gamepad2 size={20} /></div>
                          <div>
                            <h3 className="font-medium text-text-primary">Enable RPG Mechanics</h3>
                            <p className="text-sm text-text-muted">Turn off to hide XP, Levels, and Badges for a minimalist tracker experience.</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-amber"></div>
                        </label>
                      </div>

                      <hr className="border-border-subtle" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-bg-primary rounded-lg text-text-secondary"><Eye size={20} /></div>
                          <div>
                            <h3 className="font-medium text-text-primary">Public Leaderboard Profile</h3>
                            <p className="text-sm text-text-muted">Allow your friends to see your level and stats on the leaderboard.</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-amber"></div>
                        </label>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  
                  <Card className="p-6 glass-panel">
                    <h2 className="text-xl font-bold mb-4">App Features</h2>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-text-primary">Interactive Onboarding</h3>
                        <p className="text-sm text-text-muted mt-1 max-w-md">
                          Want to see the platform walkthrough again? Clicking this will reset your tour history and redirect you to the dashboard.
                        </p>
                      </div>
                      <Button onClick={handleResetTour} variant="secondary" className="shrink-0">
                        <RefreshCcw size={16} className="mr-2" />
                        Reset Tour
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6 glass-panel">
                    <h2 className="text-xl font-bold mb-4">Data Management</h2>
                    <div className="flex items-start justify-between pb-6 border-b border-border-subtle">
                      <div>
                        <h3 className="font-medium text-text-primary">Export My Data</h3>
                        <p className="text-sm text-text-muted mt-1 max-w-md">
                          Download a copy of your quests, logs, and journal entries in .txt format.
                        </p>
                      </div>
                      <Button onClick={handleExportData} variant="secondary" className="shrink-0">
                        <Download size={16} className="mr-2" />
                        Export Data
                      </Button>
                    </div>

                    <div className="flex items-start justify-between pt-6">
                      <div>
                        <h3 className="font-medium text-accent-rose">Delete Account</h3>
                        <p className="text-sm text-text-muted mt-1 max-w-md">
                          Permanently delete your account and all associated data. This action is irreversible.
                        </p>
                      </div>
                      <Button onClick={handleDeleteAccount} variant="danger" className="shrink-0">
                        <Trash2 size={16} className="mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </PageTransition>
  );
};

export default SettingsPage;
