import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const PrivacyPage = () => {
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
          <div className="mx-auto w-16 h-16 rounded-2xl bg-accent-sky/10 flex items-center justify-center border border-accent-sky/30 mb-8 shadow-[0_0_30px_rgba(14,165,233,0.3)]">
            <ShieldCheck size={32} className="text-accent-sky" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter drop-shadow-xl">Privacy Policy</h1>
          <p className="text-xl text-text-secondary">Last Updated: April 23, 2026</p>
        </motion.div>

        {/* Content */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-bg-secondary border border-border-subtle rounded-[2rem] p-8 md:p-16 shadow-xl text-lg leading-relaxed space-y-8">
          
          <section>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">1. Introduction</h2>
            <p className="text-text-secondary">
              At HabitForge Pro, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our gamified productivity application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">2. Information We Collect</h2>
            <div className="space-y-4 text-text-secondary">
              <p>We collect information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products, or otherwise contact us. The personal information that we collect depends on the context of your interactions with us and the application.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-text-primary">Personal Data:</strong> Name, email address, password, and profile picture.</li>
                <li><strong className="text-text-primary">Habit Data:</strong> The names, descriptions, frequencies, and completion logs of the habits you track.</li>
                <li><strong className="text-text-primary">Gamification Data:</strong> Your Experience Points (XP), level, unlocked badges, and guild affiliations.</li>
                <li><strong className="text-text-primary">Derivative Data:</strong> Information our servers automatically collect when you access the application, such as your IP address, your browser type, your operating system, and your access times.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">3. AI Coaching and Data Usage</h2>
            <p className="text-text-secondary mb-4">
              HabitForge Pro utilizes advanced Large Language Models (LLMs), specifically Google Gemini, to provide the "AI Habit Coach" feature.
            </p>
            <div className="bg-accent-amber/10 border border-accent-amber/30 p-6 rounded-xl">
              <h3 className="font-bold text-accent-amber mb-2 flex items-center gap-2">Important AI Disclosure</h3>
              <p className="text-sm text-text-secondary">
                When you request insights from the AI Coach, your recent habit completion logs (including habit names and timestamps) are transmitted to our LLM provider via a secure API to generate your personalized advice. We do <strong>not</strong> use your personal data to train public AI models. Your data is processed ephemerally for the sole purpose of providing you with the requested coaching response.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">4. Data Security</h2>
            <p className="text-text-secondary">
              We use administrative, technical, and physical security measures to help protect your personal information. Your passwords are cryptographically hashed using industry-standard bcrypt algorithms. All network communication is secured via TLS/SSL encryption. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">5. Your Data Rights</h2>
            <p className="text-text-secondary">
              You have complete ownership over your data. You may at any time review or change the information in your account or terminate your account. We provide built-in tools allowing you to export your complete habit and XP history in plain text formats. Upon account termination, we will deactivate or delete your account and information from our active databases.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">6. Contact Us</h2>
            <p className="text-text-secondary">
              If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@habitforgepro.com" className="text-accent-sky hover:underline">privacy@habitforgepro.com</a>
            </p>
          </section>

        </motion.div>
      </main>
    </div>
  );
};

export default PrivacyPage;
