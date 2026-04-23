import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowLeft, Check, X, Flame, Shield, HelpCircle } from 'lucide-react';
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

const PricingPage = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const features = [
    { name: "Active Habits", basic: "Up to 3", pro: "Unlimited" },
    { name: "Global Leaderboards", basic: true, pro: true },
    { name: "Basic Streaks & Levels", basic: true, pro: true },
    { name: "AI Habit Coach Insights", basic: false, pro: true },
    { name: "Create Multiplayer Guilds", basic: false, pro: true },
    { name: "Premium Avatar Borders", basic: false, pro: true },
    { name: "Export Data to CSV", basic: false, pro: true },
    { name: "Priority Support", basic: false, pro: true },
  ];

  const faqs = [
    { q: "Is the Early Access really free forever?", a: "Yes. If you create a Legendary Hero account during the beta period, you will be grandfathered into the Pro tier forever. When we launch publicly, new users will pay $15/month, but you will never be charged." },
    { q: "Can I upgrade from Basic to Legendary later?", a: "Yes, you can upgrade at any time. However, the 100% Free Lifetime offer is only available during the current beta window. Once the beta ends, upgrades will be billed at the standard rate." },
    { q: "How many habits should I track?", a: "Basic users are limited to 3 habits to encourage starting small. Legendary users have unlimited slots, but we recommend tracking no more than 7 major daily habits to maintain focus." },
    { q: "Do you offer refunds?", a: "Since the Legendary tier is currently free, there's nothing to refund! In the future, we will offer a 14-day money-back guarantee for all paid subscriptions." }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent-amber selection:text-black">
      
      {/* Top Nav */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-border-subtle backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <ArrowLeft size={20} />
          <span className="font-bold">Back to Home</span>
        </Link>
        <Link to="/register">
          <Button variant="primary" size="sm" className="shadow-[0_0_15px_rgba(245,158,11,0.3)]">Claim Beta Access</Button>
        </Link>
      </nav>

      <main className="container mx-auto px-6 py-24 max-w-6xl relative">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent-amber/10 blur-[100px] -z-10 rounded-full" />
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter drop-shadow-xl">
            Pricing That Makes <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-amber to-accent-emerald">Absolute Sense.</span>
          </h1>
          <p className="text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Stop paying for boring spreadsheets. Invest in a system that guarantees your success. Claim your free Early Access slot today.
          </p>
        </motion.div>

        {/* Pricing Cards (Detailed) */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-32">
          {/* Free Tier */}
          <SpotlightCard className="p-12 bg-bg-secondary border border-border-subtle flex flex-col shadow-xl">
            <h3 className="text-4xl font-bold text-text-primary mb-2">Basic Hero</h3>
            <div className="text-6xl font-black mb-8">$0<span className="text-2xl text-text-muted font-bold">/mo</span></div>
            <p className="text-text-secondary text-xl mb-10 border-b border-border-subtle pb-8">Everything you need to dip your toes into gamified productivity.</p>
            
            <ul className="space-y-6 mb-12 flex-1">
              <li className="flex items-center gap-4 text-text-primary text-xl font-medium"><Check className="text-text-muted" size={28} /> Track up to 3 daily habits</li>
              <li className="flex items-center gap-4 text-text-primary text-xl font-medium"><Check className="text-text-muted" size={28} /> Basic XP & Leveling</li>
              <li className="flex items-center gap-4 text-text-primary text-xl font-medium"><Check className="text-text-muted" size={28} /> Join existing Guilds</li>
              <li className="flex items-center gap-4 text-text-muted text-xl"><X size={28} /> No AI Coaching</li>
              <li className="flex items-center gap-4 text-text-muted text-xl"><X size={28} /> No Custom Borders</li>
            </ul>
            
            <Link to="/register">
              <Button variant="secondary" size="xl" className="w-full rounded-2xl py-6 text-xl font-bold">Start Free</Button>
            </Link>
          </SpotlightCard>

          {/* Pro Tier */}
          <SpotlightCard className="p-12 bg-bg-tertiary border-2 border-transparent relative flex flex-col transform md:-translate-y-8 shadow-[0_0_80px_rgba(245,158,11,0.2)] hover:shadow-[0_0_100px_rgba(245,158,11,0.3)] transition-all duration-500">
            <div className="absolute -inset-[2px] rounded-[2rem] bg-gradient-to-r from-accent-amber via-accent-rose to-accent-amber animate-[spin_4s_linear_infinite] -z-10" />
            <div className="absolute inset-px bg-bg-tertiary rounded-[2rem] z-0" />
            
            <div className="relative z-20 flex flex-col h-full">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent-amber to-accent-rose text-white px-8 py-3 rounded-full text-base font-black tracking-widest uppercase shadow-glow-amber">
                Legendary Status
              </div>
              
              <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-amber to-accent-rose mb-2">Legendary Hero</h3>
              <div className="flex items-end gap-4 mb-4">
                <div className="text-6xl font-black line-through text-text-muted opacity-50">$15</div>
                <div className="text-6xl font-black text-white">$0<span className="text-2xl text-text-muted font-bold">/mo</span></div>
              </div>
              <p className="text-accent-emerald font-bold text-2xl mb-8 animate-pulse flex items-center gap-2">
                <Flame /> 100% FREE Lifetime Beta Access
              </p>
              <p className="text-text-secondary text-xl mb-10 border-b border-border-subtle pb-8">The complete suite. Unlimited power. Unstoppable momentum.</p>
              
              <ul className="space-y-6 mb-12 flex-1">
                <li className="flex items-center gap-4 text-text-primary text-xl font-medium"><Check className="text-accent-amber drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" size={28} /> Unlimited daily habits</li>
                <li className="flex items-center gap-4 text-text-primary text-xl font-medium"><Check className="text-accent-amber drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" size={28} /> Advanced AI Habit Coach</li>
                <li className="flex items-center gap-4 text-text-primary text-xl font-medium"><Check className="text-accent-amber drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" size={28} /> Create & Manage Guilds</li>
                <li className="flex items-center gap-4 text-text-primary text-xl font-medium"><Check className="text-accent-amber drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" size={28} /> Exclusive Avatar Borders</li>
                <li className="flex items-center gap-4 text-text-primary text-xl font-medium"><Check className="text-accent-amber drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" size={28} /> Priority Beta Support</li>
              </ul>
              
              <Link to="/register">
                <Button variant="primary" size="xl" className="w-full rounded-2xl py-6 text-xl font-bold shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:shadow-[0_0_50px_rgba(245,158,11,0.8)]">
                  Claim Free Lifetime Access
                </Button>
              </Link>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-32">
          <h2 className="text-4xl font-black mb-12 text-center">Comprehensive Comparison</h2>
          <div className="overflow-x-auto rounded-[2rem] border border-border-subtle bg-bg-secondary">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-subtle bg-bg-tertiary">
                  <th className="p-8 text-xl font-bold text-text-muted">Feature</th>
                  <th className="p-8 text-xl font-bold text-center border-l border-border-subtle">Basic</th>
                  <th className="p-8 text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-amber to-accent-rose text-center border-l border-border-subtle">Legendary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {features.map((feat, i) => (
                  <tr key={i} className="hover:bg-bg-tertiary/50 transition-colors">
                    <td className="p-6 text-lg font-medium text-text-secondary">{feat.name}</td>
                    <td className="p-6 text-center border-l border-border-subtle">
                      {typeof feat.basic === 'boolean' ? (feat.basic ? <Check className="mx-auto text-text-muted" /> : <X className="mx-auto text-text-muted/50" />) : <span className="font-bold">{feat.basic}</span>}
                    </td>
                    <td className="p-6 text-center border-l border-border-subtle bg-accent-amber/5">
                      {typeof feat.pro === 'boolean' ? (feat.pro ? <Check className="mx-auto text-accent-amber" /> : <X className="mx-auto text-text-muted" />) : <span className="font-bold text-accent-amber">{feat.pro}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-32">
          <div className="flex items-center justify-center gap-4 mb-12">
            <HelpCircle size={32} className="text-text-muted" />
            <h2 className="text-4xl font-black">Frequently Asked Questions</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map((faq, i) => (
              <SpotlightCard key={i} className="p-8 bg-bg-secondary border border-border-subtle">
                <h4 className="text-xl font-bold mb-4">{faq.q}</h4>
                <p className="text-text-secondary leading-relaxed">{faq.a}</p>
              </SpotlightCard>
            ))}
          </div>
        </motion.section>

      </main>
    </div>
  );
};

export default PricingPage;
