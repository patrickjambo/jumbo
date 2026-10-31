import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Gamepad2, Plus, ArrowRight, Clock, Users } from 'lucide-react';
import { AppNavbar } from '../components/AppNavbar';

interface RecentMeeting {
  code: string;
  name: string;
  participants: number;
  ago: string;
}

interface RecentQuiz {
  pin: string;
  name: string;
  players: number;
  score?: number;
  ago: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');

  const [recentMeetings] = useState<RecentMeeting[]>(() => {
    try {
      const stored = localStorage.getItem('jumbo-recent-meetings');
      if (stored) return JSON.parse(stored) as RecentMeeting[];
    } catch { /* ignore */ }
    return [
      { code: 'JUMBO1', name: 'Team standup', participants: 4, ago: '2h ago' },
      { code: 'JUMBO2', name: 'Product review', participants: 6, ago: 'Yesterday' },
    ];
  });

  const [recentQuizzes] = useState<RecentQuiz[]>(() => {
    try {
      const stored = localStorage.getItem('jumbo-recent-quizzes');
      if (stored) return JSON.parse(stored) as RecentQuiz[];
    } catch { /* ignore */ }
    return [
      { pin: '482910', name: 'World Trivia', players: 8, score: 2450, ago: '1d ago' },
    ];
  });

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    let raw = joinCode.trim();
    // Support pasting full meeting URLs e.g. https://domain/join/CODE or .../room/CODE
    if (raw.includes('/join/')) {
      raw = raw.split('/join/')[1]?.split('?')[0]?.split('#')[0] || raw;
    } else if (raw.includes('/room/')) {
      raw = raw.split('/room/')[1]?.split('?')[0]?.split('#')[0] || raw;
    }
    // Clean up dashes, spaces, slashes
    const code = raw.replace(/[-\s/]/g, '').toUpperCase();
    if (code.length >= 4) navigate(`/join/${code}`);
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <div className="ambient-bg" aria-hidden />

      {/* Header */}
      <AppNavbar />

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-6 pb-16">
        <h1 className="text-display-md mb-8">What would you like to do?</h1>

        {/* Two big action cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Meet card */}
          <motion.div
            className="glass-card p-8 cursor-pointer group"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/join/new')}
            id="home-meet-card"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-500/20 flex items-center justify-center mb-5 group-hover:bg-brand-500/30 transition-colors">
              <Video className="w-7 h-7 text-brand-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Meet</h2>
            <p className="text-[var(--text-secondary)] mb-6 text-sm leading-relaxed">
              Start or join a video meeting. Crystal-clear audio, smart noise control, screen sharing and in-call quiz.
            </p>
            <div className="flex items-center gap-2 text-brand-400 font-semibold text-sm">
              Start or join <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Play card */}
          <motion.div
            className="glass-card p-8 cursor-pointer group"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/quiz')}
            id="home-play-card"
          >
            <div className="w-14 h-14 rounded-2xl bg-accent-400/20 flex items-center justify-center mb-5 group-hover:bg-accent-400/30 transition-colors">
              <Gamepad2 className="w-7 h-7 text-accent-300" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Play</h2>
            <p className="text-[var(--text-secondary)] mb-6 text-sm leading-relaxed">
              Start or join a Jumbo Quiz. Everyone sees the live leaderboard. Auto-generated or custom questions.
            </p>
            <div className="flex items-center gap-2 text-accent-300 font-semibold text-sm">
              Start or join <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>

        {/* Quick join bar */}
        <div className="glass-card-sm p-5 mb-8">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wider">
            Join with a PIN or link
          </h2>
          <form onSubmit={handleJoin} className="flex gap-3">
            <input
              id="home-join-code-input"
              type="text"
              placeholder="Enter meeting PIN (e.g. ABC123) or paste invite link"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="flex-1 bg-[var(--surface-2)] border border-[var(--border-glass)] rounded-[var(--radius-md)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-brand-400 transition-colors"
            />
            <button
              id="home-join-btn"
              type="submit"
              className="btn-primary px-6"
              disabled={joinCode.trim().length < 3}
            >
              Join
            </button>
          </form>
        </div>

        {/* Recent meetings */}
        {recentMeetings.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Recent meetings
            </h2>
            <div className="space-y-2">
              {recentMeetings.map((m) => (
                <button
                  key={m.code}
                  id={`recent-meeting-${m.code}`}
                  className="w-full glass-card-sm p-4 flex items-center gap-4 text-left hover:bg-[var(--surface-3)] transition-colors"
                  onClick={() => navigate(`/join/${m.code}`)}
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5 text-brand-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{m.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {m.code} · <Users className="w-3 h-3 inline" /> {m.participants} · {m.ago}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Recent quizzes */}
        {recentQuizzes.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wider flex items-center gap-2">
              <Gamepad2 className="w-3.5 h-3.5" /> Recent quizzes
            </h2>
            <div className="space-y-2">
              {recentQuizzes.map((q) => (
                <div
                  key={q.pin}
                  className="glass-card-sm p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent-400/15 flex items-center justify-center flex-shrink-0">
                    <Gamepad2 className="w-5 h-5 text-accent-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{q.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      <Users className="w-3 h-3 inline" /> {q.players} players {q.score !== undefined ? `· Score ${q.score.toLocaleString()} ` : ''}· {q.ago}
                    </p>
                  </div>
                  <button
                    className="btn-ghost text-sm px-3 py-1.5"
                    onClick={() => navigate('/quiz')}
                  >
                    <Plus className="w-4 h-4" /> Play again
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
