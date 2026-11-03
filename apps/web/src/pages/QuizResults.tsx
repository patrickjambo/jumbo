import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Download, RotateCcw, Video } from 'lucide-react';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useQuizStore } from '../store';
import { useQuizSocket } from '../hooks/useQuizSocket';
import { quizAudio } from '../utils/audioEffects';
import { AppNavbar } from '../components/AppNavbar';

const PODIUM_ICONS = [Trophy, Medal, Star];
const PODIUM_COLORS = ['text-yellow-400', 'text-zinc-400', 'text-amber-600'];

export default function QuizResults() {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  const store = useQuizStore();
  const { endGame } = useQuizSocket();

  const results = store.leaderboard;
  const top3 = results.slice(0, 3);
  const rest = results.slice(3);

  useEffect(() => {
    quizAudio.playFanfare();
    void confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 }, colors: ['#7c3aed', '#06b6d4', '#f59e0b'] });
    setTimeout(() => confetti({ particleCount: 60, spread: 60, origin: { y: 0.3, x: 0.1 } }), 400);
    setTimeout(() => confetti({ particleCount: 60, spread: 60, origin: { y: 0.3, x: 0.9 } }), 700);

    // Save to recent quizzes (Spec §22)
    if (pin) {
      try {
        const stored = localStorage.getItem('jumbo-recent-quizzes');
        const list = stored ? JSON.parse(stored) : [];
        const myScore = store.leaderboard.find((p) => p.isCurrentPlayer)?.totalScore ?? (store.leaderboard[0]?.totalScore ?? 0);
        const updated = [
          { pin, name: 'Trivia Quiz', players: store.totalPlayers || store.leaderboard.length || 1, score: myScore, ago: 'Just now' },
          ...list.filter((q: any) => q.pin !== pin),
        ].slice(0, 5);
        localStorage.setItem('jumbo-recent-quizzes', JSON.stringify(updated));
      } catch { /* ignore */ }
    }

    // Notify server that this player has seen results
    if (store.gameId) endGame(store.gameId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function downloadCsv() {
    const rows = ['Rank,Name,Score', ...results.map((r) => `${r.rank},${r.displayName},${r.totalScore}`)];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `jumbo-quiz-${pin ?? 'results'}.csv`; a.click();
  }

  // Podium order: 2nd | 1st | 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumVisualIdx = [1, 0, 2]; // maps visual position to actual rank index

  return (
    <div className="relative min-h-dvh flex flex-col overflow-x-hidden pb-8">
      <div className="ambient-bg" aria-hidden />
      <AppNavbar showBack backTo="/quiz" backLabel="Quiz" />

      <div className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full">
        <motion.h1
          className="text-center text-2xl font-bold text-[var(--text-primary)] mt-2 mb-8 relative z-10 flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        >
          <Trophy className="w-6 h-6 text-amber-400 inline-block" />
          <span>Final Results</span>
        </motion.h1>

        {/* Podium */}
        {top3.length > 0 && (
          <div className="relative z-10 flex items-end justify-center gap-3 mb-8">
            {podiumOrder.map((entry, visualIdx) => {
              if (!entry) return <div key={`empty-${visualIdx}`} className="w-20" />;
              const rankIdx = podiumVisualIdx[visualIdx]!;
              const Icon = PODIUM_ICONS[rankIdx]!;
              const heights = ['h-24', 'h-32', 'h-20'];
              const bgs = ['bg-zinc-500/20', 'bg-yellow-500/20', 'bg-amber-600/20'];

              return (
                <motion.div key={entry.id}
                  className={`flex flex-col items-center gap-2 ${entry.isCurrentPlayer ? 'ring-2 ring-brand-400 rounded-2xl p-1' : ''}`}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: [0.2, 0, 0.35][visualIdx]!, duration: 0.5, type: 'spring' }}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold border-2 ${bgs[rankIdx]} border-opacity-40`}>
                    {entry.displayName[0]}
                  </div>
                  <p className="text-xs font-medium text-center max-w-[72px] truncate">{entry.displayName}</p>
                  <p className="text-sm font-bold text-brand-300">{entry.totalScore.toLocaleString()}</p>
                  <div className={`${heights[rankIdx]} w-20 ${bgs[rankIdx]} rounded-t-xl flex flex-col items-center justify-start pt-2`}>
                    <Icon className={`w-5 h-5 ${PODIUM_COLORS[rankIdx]}`} />
                    <span className="text-lg font-bold mt-1">{entry.rank}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Full ranking */}
        <div className="glass-card p-5 relative z-10 mb-6">
          <h2 className="text-xs font-semibold text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">Full ranking</h2>
          <div className="space-y-2">
            {results.map((entry, i) => (
              <motion.div key={entry.id}
                className={`leaderboard-row ${entry.isCurrentPlayer ? 'is-me' : ''}`}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <span className="text-sm font-bold text-[var(--text-tertiary)] w-5 text-center">{entry.rank}</span>
                <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-300">
                  {entry.displayName[0]}
                </div>
                <span className="flex-1 text-sm font-medium text-[var(--text-primary)]">{entry.displayName}{entry.isCurrentPlayer ? ' (You)' : ''}</span>
                <span className="text-sm font-bold text-brand-300">{entry.totalScore.toLocaleString()}</span>
              </motion.div>
            ))}
            {results.length === 0 && (
              <p className="text-center text-sm text-[var(--text-tertiary)] py-4">No results yet</p>
            )}
          </div>
        </div>

        {/* Rest of leaderboard (beyond top 3 already shown) */}
        {rest.length === 0 && results.length === 0 && null}

        {/* Actions */}
        <div className="relative z-10 grid grid-cols-2 gap-3 mb-3">
          <button id="results-download-btn" className="btn-ghost gap-2 text-sm" onClick={downloadCsv}>
            <Download className="w-4 h-4" />Export CSV
          </button>
          <button id="results-play-again-btn" className="btn-primary gap-2" onClick={() => { store.reset(); navigate('/quiz'); }}>
            <RotateCcw className="w-4 h-4" />Play again
          </button>
        </div>

        <div className="relative z-10 flex gap-3 mb-4">
          <button
            id="results-start-meeting-btn"
            className="btn-ghost flex-1 gap-2 text-sm border-brand-500/30 text-brand-300 hover:text-white hover:bg-brand-500/20"
            onClick={() => { store.reset(); navigate('/join/new'); }}
          >
            <Video className="w-4 h-4 text-brand-400" />Start a meeting
          </button>
          <button
            className="btn-ghost flex-1 text-sm text-[var(--text-secondary)] hover:text-white"
            onClick={() => { store.reset(); navigate('/home'); }}
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
