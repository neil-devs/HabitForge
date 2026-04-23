import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowLeft, Crown, Activity, Target, Swords, Zap, Shield, Star, Award, TrendingUp, Sparkles, BrainCircuit, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';

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
              rgba(245, 158, 11, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  );
};

const FeaturesPage = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent-amber selection:text-black">
      
      {/* Top Nav */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-border-subtle backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <ArrowLeft size={20} />
          <span className="font-bold">Back to Home</span>
        </Link>
        <Link to="/register">
          <Button variant="primary" size="sm" className="shadow-[0_0_15px_rgba(245,158,11,0.3)]">Get Started</Button>
        </Link>
      </nav>

      <main className="container mx-auto px-6 py-24 max-w-6xl relative">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Header */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="text-center mb-24 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-accent-amber/20 blur-[100px] -z-10" />
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter drop-shadow-xl">
            Everything You Need To <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-amber to-accent-rose">Dominate.</span>
          </h1>
          <p className="text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            HabitForge Pro is not just a habit tracker. It is a highly advanced, gamified psychological engine designed to rewire your brain for extreme productivity.
          </p>
        </motion.div>

        {/* Massive Feature Breakdown */}
        <div className="space-y-32">
          
          {/* Feature 1: The Core RPG Engine */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-accent-amber/10 flex items-center justify-center border border-accent-amber/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <Crown size={32} className="text-accent-amber" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">The Core RPG Engine</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <SpotlightCard className="p-10 bg-bg-secondary border border-border-subtle shadow-lg">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3"><Zap className="text-accent-amber" /> Dynamic XP Scaling</h3>
                <p className="text-lg text-text-secondary leading-relaxed mb-6">
                  Every time you complete a habit, you earn Experience Points (XP). However, HabitForge employs a dynamic scaling algorithm. Maintaining a long streak yields multiplier bonuses, meaning the longer you stay consistent, the faster you level up. If you break a streak, your multiplier resets, providing a massive psychological deterrent against skipping days.
                </p>
                <div className="p-4 bg-bg-primary rounded-xl border border-border-subtle">
                  <div className="text-sm text-text-muted font-bold uppercase tracking-widest mb-2">Algorithm Breakdown</div>
                  <div className="font-mono text-sm text-accent-amber">Base XP = 50</div>
                  <div className="font-mono text-sm text-accent-emerald">Streak Bonus = Base XP * (1 + (Streak / 10))</div>
                </div>
              </SpotlightCard>
              
              <SpotlightCard className="p-10 bg-bg-secondary border border-border-subtle shadow-lg">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3"><Award className="text-accent-rose" /> Ranks & Borders</h3>
                <p className="text-lg text-text-secondary leading-relaxed mb-6">
                  Leveling up is not just a number—it changes your visual identity across the entire platform. As you progress from Level 1 to Level 100, your profile avatar unlocks increasingly elaborate animated borders (Bronze, Silver, Gold, Platinum, Diamond, and the legendary Radiant border). 
                </p>
                <div className="flex gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-lg ${i === 1 ? 'border-amber-700 bg-amber-900/50 text-amber-500' : i === 2 ? 'border-gray-400 bg-gray-600/50 text-gray-300' : 'border-yellow-400 bg-yellow-600/50 text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.5)]'}`}>
                      Lvl
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          </motion.section>

          {/* Feature 2: Advanced Analytics */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-accent-sky/10 flex items-center justify-center border border-accent-sky/30 shadow-[0_0_20px_rgba(14,165,233,0.2)]">
                <Activity size={32} className="text-accent-sky" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Deep Actionable Analytics</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <SpotlightCard className="p-10 bg-bg-secondary border border-border-subtle md:col-span-2 shadow-lg">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3"><TrendingUp className="text-accent-sky" /> The GitHub-Style Heatmap</h3>
                <p className="text-lg text-text-secondary leading-relaxed mb-6">
                  Humans are highly visual creatures. We process data faster when it's color-coded. That's why HabitForge Pro features a 365-day contribution heatmap. Every successful day darkens the square. Your goal? Don't break the chain. Watch your year turn into a solid wall of productivity.
                </p>
                {/* Mock Heatmap */}
                <div className="flex flex-wrap gap-1 p-4 bg-bg-primary rounded-xl border border-border-subtle">
                  {Array.from({ length: 156 }).map((_, i) => {
                    const intensity = Math.random();
                    let color = 'bg-bg-tertiary';
                    if (intensity > 0.8) color = 'bg-accent-emerald';
                    else if (intensity > 0.6) color = 'bg-accent-emerald/80';
                    else if (intensity > 0.4) color = 'bg-accent-emerald/60';
                    else if (intensity > 0.2) color = 'bg-accent-emerald/40';
                    return <div key={i} className={`w-3 h-3 rounded-sm ${color} transition-colors`} />;
                  })}
                </div>
              </SpotlightCard>

              <SpotlightCard className="p-10 bg-bg-secondary border border-border-subtle shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Export Your Data</h3>
                <p className="text-lg text-text-secondary leading-relaxed mb-6">
                  Your data belongs to you. HabitForge allows you to instantly export your entire history, XP logs, and habit completion records in standard TXT or CSV formats. Integrate your progress into your own personal spreadsheets or Notion databases.
                </p>
              </SpotlightCard>
            </div>
          </motion.section>

          {/* Feature 3: Multiplayer */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-accent-emerald/10 flex items-center justify-center border border-accent-emerald/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Swords size={32} className="text-accent-emerald" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Guilds & Global Leaderboards</h2>
            </div>
            
            <SpotlightCard className="p-12 bg-gradient-to-r from-bg-secondary to-bg-tertiary border border-border-subtle shadow-xl">
              <div className="max-w-3xl">
                <h3 className="text-3xl font-bold mb-6">Accountability Through Competition</h3>
                <p className="text-xl text-text-secondary leading-relaxed mb-8">
                  Solitary self-improvement is difficult. Peer pressure is powerful. HabitForge harnesses positive peer pressure through the Guild System.
                </p>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <Shield className="text-accent-emerald shrink-0 mt-1" />
                    <div>
                      <h4 className="text-xl font-bold text-text-primary">Create Your Guild</h4>
                      <p className="text-text-secondary">Invite up to 50 friends to join your private alliance. Share a custom emblem and chat.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <Star className="text-accent-amber shrink-0 mt-1" />
                    <div>
                      <h4 className="text-xl font-bold text-text-primary">Weekly Leaderboards</h4>
                      <p className="text-text-secondary">Every Monday, the XP leaderboard resets. Compete against your guildmates to claim the #1 spot and earn exclusive weekly badges.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <Users className="text-accent-sky shrink-0 mt-1" />
                    <div>
                      <h4 className="text-xl font-bold text-text-primary">Public Profiles</h4>
                      <p className="text-text-secondary">Show off your stats. Visit any user's profile to see their rank, their current active streaks, and the badges they've collected.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </SpotlightCard>
          </motion.section>

          {/* Feature 4: AI Coaching */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-accent-violet/10 flex items-center justify-center border border-accent-violet/30 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                <BrainCircuit size={32} className="text-accent-violet" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">AI Habit Analysis</h2>
            </div>
            
            <SpotlightCard className="p-10 bg-bg-secondary border border-accent-violet/20 shadow-[0_0_40px_rgba(139,92,246,0.1)]">
               <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-accent-sky">Your Personal AI Mentor</h3>
               <p className="text-lg text-text-secondary leading-relaxed mb-6">
                  HabitForge integrates with advanced LLM technology (Google Gemini) to read your habit data, analyze your failure points, and provide bespoke, actionable advice. If you keep failing your "Morning Run" habit on Thursdays, the AI Coach will detect the pattern and suggest strategic adjustments to your routine. It's like having an executive coach living in your dashboard.
               </p>
            </SpotlightCard>
          </motion.section>

        </div>

        {/* CTA Footer */}
        <div className="mt-40 text-center pb-24">
          <h2 className="text-4xl font-black mb-8">Convinced?</h2>
          <Link to="/register">
            <Button size="xl" className="rounded-full px-12 py-4 text-xl shadow-[0_0_30px_rgba(245,158,11,0.5)]">
              Begin Your Quest Now
            </Button>
          </Link>
        </div>

      </main>
    </div>
  );
};

export default FeaturesPage;
