import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';

// Lazy loading pages (for now, just importing them normally as placeholders)
// In a real app we'd use React.lazy
import LandingPage from '../pages/Landing/LandingPage';
import FeaturesPage from '../pages/PublicInfo/FeaturesPage';
import PricingPage from '../pages/PublicInfo/PricingPage';
import PrivacyPage from '../pages/PublicInfo/PrivacyPage';
import TermsPage from '../pages/PublicInfo/TermsPage';

import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import HabitGridPage from '../pages/HabitGrid/HabitGridPage';
import AnalyticsPage from '../pages/Analytics/AnalyticsPage';
import GamificationPage from '../pages/Gamification/GamePage';
import ProfilePage from '../pages/Profile/ProfilePage';
import HabitsManagerPage from '../pages/Habits/HabitsManagerPage';
import GoalsPage from '../pages/Goals/GoalsPage';
import FriendsPage from '../pages/Friends/FriendsPage';
import JournalPage from '../pages/Journal/JournalPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import GuildsPage from '../pages/Guilds/GuildsPage';
import ChallengesPage from '../pages/Challenges/ChallengesPage';

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/features', element: <FeaturesPage /> },
      { path: '/pricing', element: <PricingPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/grid', element: <HabitGridPage /> },
          { path: '/analytics', element: <AnalyticsPage /> },
          { path: '/game', element: <GamificationPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/habits', element: <HabitsManagerPage /> },
          { path: '/goals', element: <GoalsPage /> },
          { path: '/challenges', element: <ChallengesPage /> },
          { path: '/friends', element: <FriendsPage /> },
          { path: '/guilds', element: <GuildsPage /> },
          { path: '/journal', element: <JournalPage /> },
          { path: '/settings', element: <SettingsPage /> },
          // Placeholders for export
          { path: '*', element: <div className="p-8 text-center"><h2 className="text-2xl font-bold">Coming Soon</h2><p className="text-text-muted mt-2">This feature is under construction.</p></div> }
        ],
      },
    ],
  },
]);
