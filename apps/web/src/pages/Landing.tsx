import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Gamepad2, ChevronRight, Zap, Users, Trophy } from 'lucide-react';
import { AppNavbar } from '../components/AppNavbar';

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
      <AppNavbar />

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-2xl mx-auto">

          <motion.h1
            className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gradient mb-5 text-balance"
            style={{ lineHeight: 1.1 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.6 }}
          >
            Meet. Play.<br />Win together.
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg text-[var(--text-secondary)] mb-10 text-balance leading-relaxed max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            The platform that combines video meetings with live quiz games — leaderboards sync for every player in real time.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
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

        {/* Feature cards */}
        <div className="mt-28 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5">{feat.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-sm text-[var(--text-tertiary)]">
        <p>© 2026 Jumbo · Built for teams</p>
      </footer>
    </div>
  );
}
