import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Scale } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const TermsPage = () => {
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

      <main className="container mx-auto px-6 py-24 max-w-4xl relative">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16 relative">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-accent-amber/10 flex items-center justify-center border border-accent-amber/30 mb-8 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
            <Scale size={32} className="text-accent-amber" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter drop-shadow-xl">Terms of Service</h1>
          <p className="text-xl text-text-secondary">Last Updated: April 23, 2026</p>
        </motion.div>

        {/* Content */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-bg-secondary border border-border-subtle rounded-[2rem] p-8 md:p-16 shadow-xl text-lg leading-relaxed space-y-8">
          
          <section>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">1. Agreement to Terms</h2>
            <p className="text-text-secondary">
              By accessing our web application, HabitForge Pro, you agree to be bound by these Terms of Service and to use the Site in accordance with these Terms of Service, our Privacy Policy, and any additional terms and conditions that may apply to specific sections of the Site or to products and services available through the Site. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the Site and you must discontinue use immediately.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">2. Intellectual Property Rights</h2>
            <p className="text-text-secondary">
              Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">3. User Representations</h2>
            <p className="text-text-secondary mb-4">
              By using the Site, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-secondary">
              <li>All registration information you submit will be true, accurate, current, and complete.</li>
              <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
              <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
              <li>You will not use the Site for any illegal or unauthorized purpose.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">4. Subscriptions and "Legendary Hero" Beta</h2>
            <p className="text-text-secondary">
              During our Early Access Beta phase, users may claim a "Legendary Hero" account at no cost. Accounts created during this period are grandfathered into the Pro tier for the lifetime of the service, free of charge. We reserve the right to close the beta window at any time. Subsequent registrations post-beta will be subject to our standard pricing model. We reserve the right to modify or discontinue any feature within the Legendary Hero tier at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">5. Fair Use & Game Integrity</h2>
            <p className="text-text-secondary">
              HabitForge Pro relies on gamification and global leaderboards. Users are expected to maintain the integrity of the game. Automating API requests, writing scripts to artificially inflate Experience Points (XP), exploiting streak logic, or utilizing multiple accounts to manipulate guild leaderboards constitutes a violation of these terms. We reserve the right to reset XP, remove badges, or permanently terminate accounts found to be manipulating the system.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">6. Disclaimer</h2>
            <p className="text-text-secondary">
              The Site is provided on an as-is and as-available basis. You agree that your use of the Site and our services will be at your sole risk. To the fullest extent permitted by law, we disclaim all warranties, express or implied, in connection with the Site and your use thereof.
            </p>
          </section>

        </motion.div>
      </main>
    </div>
  );
};

export default TermsPage;
