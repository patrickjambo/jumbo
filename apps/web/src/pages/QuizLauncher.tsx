import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, Zap, PencilLine, ChevronRight, AlertCircle } from 'lucide-react';
import { QUESTION_CATEGORIES } from '@jumbo/shared';
import { useQuizSocket } from '../hooks/useQuizSocket';
import { useQuizStore } from '../store';

const CATEGORY_ICONS: Record<string, string> = {
  flags: '🏳️', countries_capitals: '🌍', logos_brands: '🏷️',
  animals: '🦁', history: '📜', geography: '🗺️', science: '🔬',
  math_formulas: '➗', numbers_logic: '🔢', religion_culture: '🕌',
  mythology: '⚡', general_knowledge: '💡',
};
const CATEGORY_LABELS: Record<string, string> = {
  flags: 'Flags', countries_capitals: 'Capitals', logos_brands: 'Logos',
  animals: 'Animals', history: 'History', geography: 'Geography', science: 'Science',
  math_formulas: 'Math', numbers_logic: 'Numbers', religion_culture: 'Culture',
  mythology: 'Mythology', general_knowledge: 'General',
};

export default function QuizLauncher() {
  const navigate = useNavigate();
  const { connected, error, createGame, joinGame } = useQuizSocket();
  const store = useQuizStore();
  const [mode, setMode] = useState<'auto' | 'custom' | null>(null);
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set(['general_knowledge', 'science', 'geography']));
  const [questionCount, setQuestionCount] = useState(15);
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('jumbo-display-name') ?? '');
  const [joinPin, setJoinPin] = useState('');
  const [joining, setJoining] = useState(false);
  const [creating, setCreating] = useState(false);

  function toggleCat(cat: string) {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) { if (next.size > 1) next.delete(cat); }
      else next.add(cat);
      return next;
    });
  }

  const handleCreate = useCallback(() => {
    if (!displayName.trim()) return;
    setCreating(true);
    localStorage.setItem('jumbo-display-name', displayName.trim());
    createGame({
      categories: [...selectedCats],
      questionCount,
      leaderboardVisibility: 'live',
      streakBonus: true,
      strictMode: false,
      soundEffects: false,
    } as Parameters<typeof createGame>[0]);

    // Watch for pin to be set
    const unsub = useQuizStore.subscribe((s) => {
      if (s.pin) {
        unsub();
        navigate(`/quiz/lobby/${s.pin}`);
      }
    });
    setTimeout(() => { setCreating(false); }, 5000);
  }, [displayName, selectedCats, questionCount, createGame, navigate]);

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim() || joinPin.length !== 6) return;
    setJoining(true);
    localStorage.setItem('jumbo-display-name', displayName.trim());
    joinGame(joinPin, displayName.trim());
    navigate(`/quiz/play/${joinPin}`);
  }

  return (
    <div className="relative min-h-dvh flex items-center justify-center p-4">
      <div className="ambient-bg" aria-hidden />
      <motion.div className="glass-card w-full max-w-lg p-8 relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-400/20 flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-accent-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Jumbo Quiz</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {connected ? <span className="text-green-400">● Connected</span> : <span className="text-amber-400">○ Connecting…</span>}
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-[var(--radius-md)] mb-4 text-sm text-red-400">
            <AlertCircle className="w-4 h-4" />{error}
          </div>
        )}

        {/* Display name (always shown) */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Your name</label>
          <input
            type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your name" maxLength={50}
            className="w-full bg-[var(--surface-2)] border border-[var(--border-glass)] rounded-[var(--radius-md)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-brand-400 transition-colors"
          />
        </div>

        {!mode && (
          <div className="space-y-3">
            {/* Auto quiz */}
            <motion.button id="quiz-auto-btn" className="w-full glass-card-sm p-5 text-left flex items-center gap-4 hover:bg-[var(--surface-3)] transition-colors group" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => setMode('auto')}>
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center"><Zap className="w-6 h-6 text-brand-400" /></div>
              <div className="flex-1">
                <p className="font-semibold">Auto quiz</p>
                <p className="text-sm text-[var(--text-secondary)]">15 questions generated automatically</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Create my own */}
            <motion.button id="quiz-custom-btn" className="w-full glass-card-sm p-5 text-left flex items-center gap-4 hover:bg-[var(--surface-3)] transition-colors group" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => setMode('custom')}>
              <div className="w-12 h-12 rounded-xl bg-accent-400/20 flex items-center justify-center"><PencilLine className="w-6 h-6 text-accent-300" /></div>
              <div className="flex-1">
                <p className="font-semibold">Create my own</p>
                <p className="text-sm text-[var(--text-secondary)]">Pick categories and question count</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <div className="relative flex items-center my-2">
              <div className="flex-1 border-t border-[var(--border-glass)]" />
              <span className="mx-3 text-xs text-[var(--text-tertiary)]">or join</span>
              <div className="flex-1 border-t border-[var(--border-glass)]" />
            </div>

            {/* Join with PIN */}
            <form onSubmit={handleJoin} className="flex gap-2">
              <input
                id="quiz-join-pin-input"
                type="text" value={joinPin} onChange={(e) => setJoinPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit PIN" maxLength={6}
                className="flex-1 bg-[var(--surface-2)] border border-[var(--border-glass)] rounded-[var(--radius-md)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-accent-400 transition-colors tracking-widest text-lg"
              />
              <button id="quiz-join-pin-btn" type="submit" className="btn-ghost px-4" disabled={joinPin.length !== 6 || !displayName.trim() || joining}>Join</button>
            </form>
          </div>
        )}

        {mode && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <button className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] mb-5 flex items-center gap-1" onClick={() => setMode(null)}>← Back</button>

            {/* Category chips */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-3">Categories</label>
              <div className="flex flex-wrap gap-2">
                {QUESTION_CATEGORIES.map((cat) => (
                  <button key={cat} id={`category-chip-${cat}`} onClick={() => toggleCat(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${selectedCats.has(cat) ? 'bg-brand-500/20 border-brand-500/40 text-brand-300' : 'bg-transparent border-[var(--border-glass)] text-[var(--text-tertiary)]'}`}>
                    {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Question count */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-3">
                Questions: <span className="text-brand-400">{questionCount}</span>
              </label>
              <input id="quiz-question-count" type="range" min={5} max={30} value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))} className="w-full accent-brand-500" />
              <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1"><span>5</span><span>30</span></div>
            </div>

            <button id="quiz-start-btn" className="btn-primary w-full text-base"
              onClick={handleCreate} disabled={!displayName.trim() || !connected || creating}>
              {creating ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating…</span>
              ) : (
                <><Zap className="w-5 h-5" />{mode === 'auto' ? 'Generate & start' : 'Create & start'}</>
              )}
            </button>
          </motion.div>
        )}

        <button className="mt-5 w-full text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors" onClick={() => navigate('/home')}>← Back to home</button>
      </motion.div>
    </div>
  );
}
