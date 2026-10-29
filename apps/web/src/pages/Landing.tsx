import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Gamepad2, ChevronRight, Zap, Users, Trophy } from 'lucide-react';

const features = [
  {
    icon: Video,
    title: 'Crystal-clear video',
    desc: 'Simulcast video with automatic quality adjustment for every connection speed.',
  },
  {
    icon: Users,
    title: 'Smart noise control',
    desc: 'Background noise auto-detected and muted. No more asking people to mute.',
  },
  {
    icon: Gamepad2,
    title: 'Live quiz games',
    desc: 'Launch a quiz right inside your meeting. Everyone sees the leaderboard in real time.',
  },
  {
    icon: Trophy,
    title: 'Real-time leaderboard',
    desc: 'Every player sees the full ranking live — not just their own score.',
  },
  {
    icon: Zap,
    title: 'Instant answers',
    desc: 'Sub-200 ms game updates. Tap and see your answer lock instantly.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      {/* Ambient background */}
      <div className="ambient-bg" aria-hidden />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-accent-400 flex items-center justify-center">
            <Gamepad2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Jumbo</span>
        </div>
        <button
          id="nav-login-btn"
          className="btn-ghost text-sm px-4 py-2"
          onClick={() => navigate('/home')}
        >
          Open app
        </button>
      </header>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-32">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/25 text-brand-300 text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              Meetings + Quiz in one app
            </span>
          </motion.div>

          <motion.h1
            className="text-display-xl text-gradient mb-6 text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Meet. Play. Win together.
          </motion.h1>

          <motion.p
            className="text-lg text-[var(--text-secondary)] mb-10 text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            The only platform that combines crystal-clear video meetings with live quiz games
            where every player sees the real-time leaderboard.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <button
              id="hero-start-meeting-btn"
              className="btn-primary text-base px-8"
              onClick={() => navigate('/home')}
            >
              <Video className="w-5 h-5" />
              Start a meeting
            </button>
            <button
              id="hero-play-quiz-btn"
              className="btn-ghost text-base px-8"
              onClick={() => navigate('/quiz')}
            >
              <Gamepad2 className="w-5 h-5" />
              Play a quiz
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Animated demo / feature cards */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              className="glass-card p-6"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center mb-4">
                <feat.icon className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1.5">{feat.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-sm text-[var(--text-tertiary)]">
        <p>© 2026 Jumbo App · Built with open-source tools</p>
      </footer>
    </div>
  );
}
