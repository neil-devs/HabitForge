import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/cn';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart2, 
  Gamepad2, 
  Target, 
  Users, 
  BookOpen,
  LogOut,
  Shield,
  Flame,
  Menu,
  X,
  Settings,
  User,
  ListTodo,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dropdown, DropdownItem, DropdownSeparator } from '../ui/Dropdown';
import { Avatar } from '../ui/Avatar';

const mainNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/habits', label: 'Manage Habits', icon: ListTodo },
  { path: '/grid', label: 'Grid', icon: CheckSquare },
  { path: '/journal', label: 'Journal', icon: BookOpen },
  { path: '/analytics', label: 'Analytics', icon: BarChart2 },
];

const secondaryNavItems = [
  { path: '/game', label: 'Gamification', icon: Gamepad2 },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/challenges', label: 'Challenges', icon: Flame },
  { path: '/guilds', label: 'Guilds', icon: Shield },
  { path: '/friends', label: 'Friends', icon: Users },
];

const TopNav = () => {
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 glass-panel rounded-full px-6 py-3 flex items-center justify-between shadow-xl">
        {/* Logo Section */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-8 h-8">
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
              <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
              <path d="M20 2 L36 10 L36 30 L20 38 L4 30 L4 10 Z" fill="url(#logo-gradient)" opacity="0.15"/>
              <path d="M20 2 L36 10 L36 30 L20 38 L4 30 L4 10 Z" fill="none" stroke="url(#logo-gradient)" strokeWidth="1.5"/>
              <path d="M20 18 L20 38" stroke="url(#logo-gradient)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M4 10 L20 18 L36 10" stroke="url(#logo-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polygon points="20,10 24,18 20,26 16,18" fill="#ffffff" className="origin-center animate-[spin_4s_linear_infinite]" />
            </svg>
          </div>
          <span className="hidden sm:block font-black text-lg tracking-normal text-text-primary bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary">
            HabitForge
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 mx-4">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                isActive 
                  ? "bg-accent-amber/15 text-accent-amber shadow-[inset_0_0_10px_rgba(245,158,11,0.1)]" 
                  : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
              )}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          ))}
          
          <div className="w-px h-6 bg-border-subtle mx-2" />
          
          {/* Secondary Hub Links */}
          <div className="flex items-center gap-1">
            {secondaryNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "group relative flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all",
                  item.path === '/game' ? "tour-gamification" : "",
                  isActive 
                    ? "bg-bg-tertiary text-text-primary" 
                    : "text-text-muted hover:bg-bg-tertiary hover:text-text-primary"
                )}
              >
                <item.icon size={16} />
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-bg-secondary border border-border-subtle text-text-primary text-xs font-bold rounded-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Dropdown
            trigger={
              <button
                className="group tour-notifications p-2 rounded-full text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-all relative outline-none ring-2 ring-transparent hover:ring-bg-tertiary focus:ring-accent-rose/50"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-rose rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
              </button>
            }
          >
            <div className="px-3 py-2 text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
              Recent Notifications
            </div>
            <DropdownSeparator />
            <DropdownItem>
              <div className="flex flex-col gap-1 w-full max-w-[250px] overflow-hidden">
                <span className="font-bold text-sm text-text-primary truncate">Welcome to HabitForge Pro!</span>
                <span className="text-xs text-text-muted line-clamp-2 leading-relaxed">Start by adding your first habit and earning your first chunk of XP.</span>
              </div>
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem>
              <div className="flex flex-col gap-1 w-full max-w-[250px] overflow-hidden">
                <span className="font-bold text-sm text-text-primary truncate flex items-center gap-2"><Flame size={14} className="text-accent-amber" /> 3-Day Streak!</span>
                <span className="text-xs text-text-muted line-clamp-2 leading-relaxed">You're on fire! Keep it up to earn the Warrior badge.</span>
              </div>
            </DropdownItem>
          </Dropdown>
          <Dropdown
            trigger={
              <button
                className={cn(
                  "rounded-full transition-all flex items-center outline-none ring-2 ring-transparent hover:ring-bg-tertiary",
                  (location.pathname === '/profile' || location.pathname === '/settings')
                    ? "ring-accent-amber/50" 
                    : ""
                )}
              >
                {user?.avatar_url ? (
                  <Avatar src={`http://localhost:5000${user.avatar_url}`} fallback={user?.username} size="sm" />
                ) : (
                  <div className={cn(
                    "p-2 rounded-full",
                    (location.pathname === '/profile' || location.pathname === '/settings')
                      ? "bg-accent-amber/15 text-accent-amber" 
                      : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                  )}>
                    <User size={20} />
                  </div>
                )}
              </button>
            }
          >
            <DropdownItem onSelect={() => navigate('/profile')}>
              <User size={14} className="mr-2" /> Edit Profile
            </DropdownItem>
            <DropdownItem onSelect={() => navigate('/settings')}>
              <Settings size={14} className="mr-2" /> Settings
            </DropdownItem>
            <DropdownSeparator />
            <div className="px-3 py-1.5 text-xs font-bold text-text-muted uppercase tracking-wider">Information</div>
            <DropdownItem onSelect={() => navigate('/features')}>Features</DropdownItem>
            <DropdownItem onSelect={() => navigate('/pricing')}>Pricing</DropdownItem>
            <DropdownItem onSelect={() => navigate('/privacy')}>Privacy Policy</DropdownItem>
            <DropdownItem onSelect={() => navigate('/terms')}>Terms of Service</DropdownItem>
          </Dropdown>
          <button
            onClick={logout}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-accent-rose/10 text-accent-rose hover:bg-accent-rose/20 transition-all font-medium text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-all"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-bg-primary/95 backdrop-blur-md pt-24 px-6 lg:hidden overflow-y-auto"
          >
            <nav className="flex flex-col gap-2">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Main</div>
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all",
                    isActive ? "bg-accent-amber/15 text-accent-amber" : "text-text-primary hover:bg-bg-tertiary"
                  )}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
              
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mt-6 mb-2">Community & Play</div>
              {secondaryNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all",
                    isActive ? "bg-bg-tertiary text-text-primary" : "text-text-secondary hover:bg-bg-tertiary"
                  )}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              ))}

              <div className="mt-6 pt-6 border-t border-border-subtle flex flex-col gap-2">
                <NavLink
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all",
                    isActive ? "bg-accent-amber/15 text-accent-amber" : "text-text-primary hover:bg-bg-tertiary"
                  )}
                >
                  <User size={20} />
                  <span>Profile</span>
                </NavLink>
                <NavLink
                  to="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all",
                    isActive ? "bg-accent-amber/15 text-accent-amber" : "text-text-primary hover:bg-bg-tertiary"
                  )}
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </NavLink>
              </div>

              <div className="mt-4 pt-4 border-t border-border-subtle flex flex-col gap-2">
                <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 px-4">Information</div>
                <NavLink
                  to="/features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all"
                >
                  Features
                </NavLink>
                <NavLink
                  to="/pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all"
                >
                  Pricing
                </NavLink>
                <NavLink
                  to="/privacy"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all"
                >
                  Privacy Policy
                </NavLink>
                <NavLink
                  to="/terms"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all"
                >
                  Terms of Service
                </NavLink>
              </div>

              <div className="mt-4 pt-4 border-t border-border-subtle">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent-rose/10 text-accent-rose hover:bg-accent-rose/20 transition-all font-bold"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopNav;
