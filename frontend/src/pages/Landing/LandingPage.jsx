import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Trophy, BarChart3, Target, Zap, Shield, Star, Users, Flame, Skull, Check, XCircle, Crown, Swords, Activity, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';

// --- Ultra Interactive Spotlight Card Component ---
const SpotlightCard = ({ children, className = "" }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative rounded-[2rem] overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(245, 158, 11, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  );
};

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const mockupY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  
  // Parallax elements
  const floatY1 = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);
  const floatY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-150%"]);
  const floatY3 = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent-amber selection:text-black overflow-hidden">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-border-subtle backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10">
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
              <defs>
                <linearGradient id="landing-logo-header" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
              <path d="M20 2 L36 10 L36 30 L20 38 L4 30 L4 10 Z" fill="url(#landing-logo-header)" opacity="0.15"/>
              <path d="M20 2 L36 10 L36 30 L20 38 L4 30 L4 10 Z" fill="none" stroke="url(#landing-logo-header)" strokeWidth="1.5"/>
              <path d="M20 18 L20 38" stroke="url(#landing-logo-header)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M4 10 L20 18 L36 10" stroke="url(#landing-logo-header)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polygon points="20,10 24,18 20,26 16,18" fill="#ffffff" className="origin-center animate-[spin_4s_linear_infinite]" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight">HabitForge Pro</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-accent-amber transition-colors">Sign In</Link>
          <Link to="/register">
            <Button variant="primary" size="sm" className="shadow-[0_0_15px_rgba(245,158,11,0.3)]">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Massive Immersive Hero Section */}
      <main className="container mx-auto px-6 py-32 text-center max-w-5xl relative">
        {/* Cyberpunk Grid Background */}
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Sweeping Light Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-accent-amber/20 blur-[120px] rounded-full -z-10 animate-[pulse_6s_ease-in-out_infinite]" />
        
        <motion.div
          style={{ y: heroY }}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Link to="/register">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-sm font-bold mb-10 hover:bg-accent-rose/20 hover:scale-105 transition-all shadow-[0_0_25px_rgba(244,63,94,0.3)] cursor-pointer backdrop-blur-md">
              <Flame size={18} className="animate-pulse" />
              HabitForge Pro 2.0 is Live! Claim your Free "Founder" status today →
            </div>
          </Link>
          
          <h1 className="text-6xl md:text-[6rem] leading-[1.1] font-black tracking-tighter mb-8 drop-shadow-2xl">
            Turn Your Life Into A <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-amber via-accent-rose to-accent-violet animate-[pulse_4s_ease-in-out_infinite]">
              Masterpiece.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
            The ultimate productivity tool that gamifies your reality. Build streaks, earn XP, level up, and unlock your true potential with an experience designed to be deeply addictive.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-30">
            <Link to="/register">
              <Button size="xl" className="w-full sm:w-auto gap-3 rounded-full px-10 text-lg shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:shadow-[0_0_50px_rgba(245,158,11,0.8)] transition-all transform hover:-translate-y-1">
                Start Your Adventure <ArrowRight size={24} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="xl" className="w-full sm:w-auto rounded-full px-10 text-lg border-2 border-border-subtle hover:bg-bg-tertiary hover:border-accent-amber/50 transition-all backdrop-blur-md">
                View Demo
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Floating Parallax Hero Mockup Image */}
        <motion.div 
          style={{ y: mockupY }}
          initial={{ opacity: 0, y: 150 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 50 }}
          className="mt-24 relative z-20"
        >
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
            
            {/* Parallax Floating Elements */}
            <motion.div style={{ y: floatY1 }} className="absolute -top-10 -left-10 md:-left-20 z-30 bg-bg-secondary/80 backdrop-blur-xl border border-border-subtle p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-4 animate-[pulse_5s_ease-in-out_infinite]">
              <div className="w-12 h-12 bg-accent-amber/20 rounded-xl flex items-center justify-center">
                <Trophy className="text-accent-amber" size={24} />
              </div>
              <div className="text-left">
                <div className="text-sm text-text-muted font-bold">Achievement</div>
                <div className="text-lg font-black text-text-primary">7 Day Streak!</div>
              </div>
            </motion.div>

            <motion.div style={{ y: floatY2 }} className="absolute top-40 -right-10 md:-right-16 z-30 bg-bg-secondary/80 backdrop-blur-xl border border-border-subtle p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-4 animate-[pulse_4s_ease-in-out_infinite] delay-1000">
              <div className="w-12 h-12 bg-accent-emerald/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-accent-emerald" size={24} />
              </div>
              <div className="text-left">
                <div className="text-sm text-text-muted font-bold">XP Gained</div>
                <div className="text-lg font-black text-accent-emerald">+150 XP</div>
              </div>
            </motion.div>

            <motion.div style={{ y: floatY3 }} className="absolute -bottom-10 left-20 z-30 bg-bg-secondary/80 backdrop-blur-xl border border-border-subtle px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-3 animate-[pulse_6s_ease-in-out_infinite] delay-500">
              <Flame className="text-accent-rose" size={20} />
              <span className="font-bold text-text-primary">Level Up: Level 12!</span>
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent z-10 rounded-b-2xl" />
            <img 
              src="/mockup.png" 
              alt="HabitForge Pro Dashboard Interface" 
              className="w-full rounded-2xl border border-border-subtle shadow-[0_20px_70px_rgba(0,0,0,0.5),0_0_50px_rgba(245,158,11,0.2)] object-cover object-top h-[600px] relative z-0"
              style={{ transform: 'perspective(1500px) rotateX(8deg)' }}
            />
          </motion.div>
        </motion.div>
      </main>

      {/* Trusted By Marquee */}
      <section className="py-12 border-y border-border-subtle bg-bg-secondary/50 backdrop-blur-md overflow-hidden relative z-20">
        <p className="text-center text-sm font-bold text-text-muted uppercase tracking-widest mb-8">
          Trusted by top performers building their empires at
        </p>
        <div className="flex w-[200%] animate-marquee opacity-50 hover:opacity-100 transition-opacity duration-500">
          <div className="flex justify-around w-1/2">
            {['Google', 'Meta', 'Netflix', 'Spotify', 'Amazon', 'Apple', 'Microsoft'].map((company, i) => (
              <span key={`a-${i}`} className="text-2xl font-black tracking-tighter flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
                <div className="w-8 h-8 rounded-lg bg-text-primary/10 flex items-center justify-center text-sm">{company.charAt(0)}</div> {company}
              </span>
            ))}
          </div>
          <div className="flex justify-around w-1/2">
            {['Google', 'Meta', 'Netflix', 'Spotify', 'Amazon', 'Apple', 'Microsoft'].map((company, i) => (
              <span key={`b-${i}`} className="text-2xl font-black tracking-tighter flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
                <div className="w-8 h-8 rounded-lg bg-text-primary/10 flex items-center justify-center text-sm">{company.charAt(0)}</div> {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Old Way vs New Way Section */}
      <section className="py-32 bg-bg-primary relative overflow-hidden">
        <motion.div 
          className="container mx-auto px-6 max-w-6xl relative z-10"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">Why traditional trackers fail.</h2>
            <p className="text-xl text-text-secondary">It's not you. The system is broken.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* The Old Way */}
            <SpotlightCard className="p-10 bg-bg-secondary/50 border border-border-subtle opacity-70">
              <div className="absolute top-6 right-6 text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2 z-20">
                <XCircle size={14} className="text-text-muted" /> The Old Way
              </div>
              <div className="mt-12 space-y-4 relative z-20">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-xl border border-text-muted/20 bg-bg-primary">
                    <div className="w-6 h-6 rounded border-2 border-text-muted/30" />
                    <div className="h-3 bg-text-muted/20 rounded-full w-2/3" />
                  </div>
                ))}
              </div>
              <div className="mt-12 text-center text-text-muted font-medium text-lg relative z-20">
                Boring. Tedious. Easy to quit.
              </div>
            </SpotlightCard>

            {/* The HabitForge Way */}
            <SpotlightCard className="p-10 bg-bg-tertiary border border-border-subtle shadow-[0_0_50px_rgba(245,158,11,0.15)] transform md:scale-105">
              {/* Moving Shiny Border Effect */}
              <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-accent-amber via-accent-rose to-accent-amber opacity-30 animate-[spin_4s_linear_infinite] blur-sm -z-10" />
              
              <div className="absolute inset-px bg-bg-tertiary rounded-[2rem] z-0" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-amber/20 via-transparent to-transparent opacity-50 z-0" />
              
              <div className="absolute top-6 right-6 text-xs font-bold text-accent-amber uppercase tracking-widest flex items-center gap-2 bg-accent-amber/10 px-3 py-1 rounded-full z-20">
                <Sparkles size={14} /> The HabitForge Way
              </div>
              <div className="mt-12 space-y-4 relative z-20">
                <div className="flex items-center justify-between p-5 rounded-xl border border-accent-emerald/30 bg-accent-emerald/10 shadow-[0_0_30px_rgba(16,185,129,0.2)] transform hover:scale-105 transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent-emerald text-black flex items-center justify-center"><Check size={24} className="font-bold" /></div>
                    <span className="font-bold text-lg text-text-primary">Read 10 Pages</span>
                  </div>
                  <div className="text-accent-emerald font-black text-2xl animate-pulse">+50 XP</div>
                </div>
                <div className="flex items-center justify-between p-5 rounded-xl border border-accent-amber/30 bg-accent-amber/10 shadow-[0_0_30px_rgba(245,158,11,0.2)] transform hover:scale-105 transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent-amber text-black flex items-center justify-center"><Flame size={24} className="font-bold" /></div>
                    <span className="font-bold text-lg text-text-primary">Workout</span>
                  </div>
                  <div className="text-accent-amber font-black text-2xl animate-pulse animation-delay-200">Level Up!</div>
                </div>
              </div>
              <div className="mt-12 text-center text-accent-amber font-bold text-2xl drop-shadow-[0_0_15px_rgba(245,158,11,0.8)] relative z-20">
                Addictive. Rewarding. Unstoppable.
              </div>
            </SpotlightCard>
          </div>
        </motion.div>
      </section>

      {/* Bento Box Features */}
      <section className="py-32 bg-bg-secondary relative border-y border-border-subtle">
        <motion.div 
          className="container mx-auto px-6 max-w-6xl"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">Built for ultimate progression.</h2>
            <p className="text-xl text-text-secondary">Everything you need to turn your life into a masterpiece.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            {/* Large Card: Gamification */}
            <SpotlightCard className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-bg-tertiary to-bg-primary border border-border-subtle p-12 shadow-xl card-hover">
              <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-accent-amber/20 blur-[120px] rounded-full group-hover:bg-accent-amber/40 transition-colors duration-700 pointer-events-none" />
              <Crown size={56} className="text-accent-amber mb-8 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] relative z-20" />
              <h3 className="text-4xl font-black mb-4 tracking-tight relative z-20">RPG Leveling Engine</h3>
              <p className="text-xl text-text-secondary max-w-md relative z-20 leading-relaxed">
                Earn XP for every positive action. Watch your character grow, unlock exclusive borders, and collect rare badges as you forge the ultimate version of yourself.
              </p>
            </SpotlightCard>

            {/* Square Card: Analytics */}
            <SpotlightCard className="bg-gradient-to-br from-bg-tertiary to-bg-primary border border-border-subtle p-10 shadow-xl card-hover">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent-sky/20 blur-[60px] rounded-full group-hover:bg-accent-sky/40 transition-colors duration-700 pointer-events-none" />
              <Activity size={40} className="text-accent-sky mb-6 relative z-20" />
              <h3 className="text-2xl font-bold mb-3 tracking-tight relative z-20">Deep Analytics</h3>
              <p className="text-text-muted relative z-20 text-lg">GitHub-style heatmaps and streak timelines.</p>
            </SpotlightCard>

            {/* Square Card: Quests */}
            <SpotlightCard className="bg-gradient-to-br from-bg-tertiary to-bg-primary border border-border-subtle p-10 shadow-xl card-hover">
               <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-rose/20 blur-[60px] rounded-full group-hover:bg-accent-rose/40 transition-colors duration-700 pointer-events-none" />
              <Target size={40} className="text-accent-rose mb-6 relative z-20" />
              <h3 className="text-2xl font-bold mb-3 tracking-tight relative z-20">Custom Quests</h3>
              <p className="text-text-muted relative z-20 text-lg">Define your own habits with custom icons and rules.</p>
            </SpotlightCard>

            {/* Wide Card: Guilds */}
            <SpotlightCard className="md:col-span-3 bg-gradient-to-r from-bg-tertiary via-bg-primary to-bg-tertiary border border-border-subtle p-12 flex flex-col md:flex-row items-center gap-12 shadow-xl card-hover">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[200px] bg-accent-emerald/5 blur-[100px] group-hover:bg-accent-emerald/20 transition-colors duration-700 pointer-events-none" />
              
              <div className="w-28 h-28 shrink-0 rounded-[2rem] bg-accent-emerald/10 flex items-center justify-center border border-accent-emerald/30 shadow-[0_0_30px_rgba(16,185,129,0.2)] relative z-20">
                <Swords size={56} className="text-accent-emerald" />
              </div>
              <div className="text-center md:text-left relative z-20">
                <h3 className="text-4xl font-black mb-4 tracking-tight">Multiplayer Guilds</h3>
                <p className="text-xl text-text-secondary max-w-3xl leading-relaxed">
                  You don't have to fight alone. Form guilds with your friends, compete on live leaderboards, and hold each other accountable to greatness.
                </p>
              </div>
            </SpotlightCard>
          </div>
        </motion.div>
      </section>

      {/* Global Stats Banner */}
      <section className="py-20 relative overflow-hidden">
        <motion.div 
          className="container mx-auto px-6"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">1M+</div>
              <div className="text-sm md:text-base text-text-muted font-bold uppercase tracking-widest">Quests Completed</div>
            </div>
            <div>
              <div className="text-4xl md:text-6xl font-black text-accent-amber mb-2 tracking-tighter">50k+</div>
              <div className="text-sm md:text-base text-text-muted font-bold uppercase tracking-widest">Active Heroes</div>
            </div>
            <div>
              <div className="text-4xl md:text-6xl font-black text-accent-emerald mb-2 tracking-tighter">99%</div>
              <div className="text-sm md:text-base text-text-muted font-bold uppercase tracking-widest">Win Rate Increase</div>
            </div>
            <div>
              <div className="text-4xl md:text-6xl font-black text-accent-rose mb-2 tracking-tighter">500+</div>
              <div className="text-sm md:text-base text-text-muted font-bold uppercase tracking-widest">Guilds Formed</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Premium Pricing Anchor */}
      <section className="py-32 relative overflow-hidden bg-bg-secondary border-y border-border-subtle">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-accent-amber/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-accent-rose/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          className="container mx-auto px-6 max-w-5xl relative z-10"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Pricing That Makes Sense</h2>
            <p className="text-xl text-text-secondary">Invest in yourself. The ROI is legendary.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <SpotlightCard className="p-10 bg-bg-primary border border-border-subtle flex flex-col shadow-xl">
              <div className="relative z-20 flex flex-col h-full">
                <h3 className="text-3xl font-bold text-text-primary mb-2">Basic Hero</h3>
                <div className="text-5xl font-black mb-8">$0<span className="text-xl text-text-muted font-bold">/mo</span></div>
                <p className="text-text-secondary text-lg mb-10">Everything you need to start your journey.</p>
                
                <ul className="space-y-5 mb-10 flex-1">
                  {['Track up to 3 daily habits', 'Basic streak tracking', 'Standard level progression', 'Community access'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-4 text-text-primary text-lg font-medium">
                      <Check size={24} className="text-text-muted" /> {feat}
                    </li>
                  ))}
                </ul>
                
                <Link to="/register">
                  <Button variant="secondary" size="xl" className="w-full rounded-2xl py-6 text-xl font-bold">Start Free</Button>
                </Link>
              </div>
            </SpotlightCard>

            {/* Pro Tier */}
            <SpotlightCard className="p-10 bg-bg-tertiary border-2 border-transparent relative flex flex-col transform md:-translate-y-6 shadow-[0_0_60px_rgba(245,158,11,0.2)] hover:shadow-[0_0_80px_rgba(245,158,11,0.3)] transition-all duration-500">
              {/* Moving Shiny Border Effect */}
              <div className="absolute -inset-[2px] rounded-[2rem] bg-gradient-to-r from-accent-amber via-accent-rose to-accent-amber animate-[spin_4s_linear_infinite] -z-10" />
              <div className="absolute inset-px bg-bg-tertiary rounded-[2rem] z-0" />
              
              <div className="relative z-20 flex flex-col h-full">
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent-amber to-accent-rose text-white px-6 py-2 rounded-full text-sm font-black tracking-widest uppercase shadow-glow-amber">
                  Most Popular
                </div>
                
                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-amber to-accent-rose mb-2">Legendary Hero</h3>
                <div className="flex items-end gap-4 mb-8">
                  <div className="text-5xl font-black line-through text-text-muted opacity-50">$15</div>
                  <div className="text-5xl font-black text-white">$0<span className="text-xl text-text-muted font-bold">/mo</span></div>
                </div>
                <p className="text-accent-emerald font-bold text-xl mb-10 animate-pulse">🔥 100% FREE during Early Access Beta!</p>
                
                <ul className="space-y-5 mb-10 flex-1">
                  {['Unlimited daily habits', 'Advanced RPG Analytics', 'AI Habit Coach Insights', 'Exclusive Guild creation', 'Premium Avatar borders'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-4 text-text-primary text-lg font-medium">
                      <Check size={24} className="text-accent-amber drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" /> {feat}
                    </li>
                  ))}
                </ul>
                
                <Link to="/register">
                  <Button variant="primary" size="xl" className="w-full rounded-2xl py-6 text-xl font-bold shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:shadow-[0_0_50px_rgba(245,158,11,0.8)]">
                    Claim Free Lifetime Access
                  </Button>
                </Link>
              </div>
            </SpotlightCard>
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="py-40 relative overflow-hidden text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-rose/15 via-bg-primary to-bg-primary blur-[100px]" />
        <motion.div 
          className="container mx-auto px-6 max-w-4xl"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Flame size={64} className="mx-auto text-accent-rose mb-8 animate-[pulse_2s_ease-in-out_infinite] drop-shadow-[0_0_30px_rgba(244,63,94,0.6)]" />
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">Ready to start your adventure?</h2>
          <p className="text-2xl text-text-secondary mb-12">
            Stop tracking your habits in boring spreadsheets. Turn your life into the ultimate game today.
          </p>
          <Link to="/register">
            <Button size="xl" className="rounded-full px-16 py-6 text-2xl font-bold shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:shadow-[0_0_60px_rgba(245,158,11,0.8)] transition-all transform hover:-translate-y-2">
              Create Your Hero Account
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-16 bg-bg-secondary">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="relative flex items-center justify-center w-10 h-10">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <defs>
                  <linearGradient id="landing-logo-footer" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
                <path d="M20 2 L36 10 L36 30 L20 38 L4 30 L4 10 Z" fill="url(#landing-logo-footer)" opacity="0.15"/>
                <path d="M20 2 L36 10 L36 30 L20 38 L4 30 L4 10 Z" fill="none" stroke="url(#landing-logo-footer)" strokeWidth="1.5"/>
                <path d="M20 18 L20 38" stroke="url(#landing-logo-footer)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M4 10 L20 18 L36 10" stroke="url(#landing-logo-footer)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polygon points="20,10 24,18 20,26 16,18" fill="#ffffff" className="origin-center animate-[spin_4s_linear_infinite]" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">HabitForge Pro</span>
          </div>
          <div className="flex gap-8 text-base font-bold text-text-muted">
            <Link to="/features" className="hover:text-white transition-colors">Features</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
          <div className="text-sm font-medium text-text-muted">
            © {new Date().getFullYear()} HabitForge Pro. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
