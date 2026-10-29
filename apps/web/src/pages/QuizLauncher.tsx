import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2, Zap, PencilLine, ChevronRight, AlertCircle,
  FileSpreadsheet, Plus, Trash2, CheckCircle2, Sparkles
} from 'lucide-react';
import { QUESTION_CATEGORIES, type Question } from '@jumbo/shared';
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

interface CustomDraftQuestion {
  id: string;
  text: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  timeLimit: number;
}

export default function QuizLauncher() {
  const navigate = useNavigate();
  const { connected, error, createGame, joinGame } = useQuizSocket();
  const store = useQuizStore();

  const [mode, setMode] = useState<'auto' | 'categories' | 'builder' | null>(null);
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set(['general_knowledge', 'science', 'geography']));
  const [questionCount, setQuestionCount] = useState(15);
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('jumbo-display-name') ?? '');
  const [joinPin, setJoinPin] = useState('');
  const [joining, setJoining] = useState(false);
  const [creating, setCreating] = useState(false);

  // Custom question builder state (Spec §8.1)
  const [customQuestions, setCustomQuestions] = useState<CustomDraftQuestion[]>([]);
  const [newText, setNewText] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [correctOptIdx, setCorrectOptIdx] = useState(0);
  const [newTimeLimit, setNewTimeLimit] = useState(20);
  const [csvText, setCsvText] = useState('');
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [builderError, setBuilderError] = useState<string | null>(null);

  function toggleCat(cat: string) {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) { if (next.size > 1) next.delete(cat); }
      else next.add(cat);
      return next;
    });
  }

  const handleCreateAuto = useCallback(() => {
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
    });

    const unsub = useQuizStore.subscribe((s) => {
      if (s.pin) {
        unsub();
        navigate(`/quiz/lobby/${s.pin}`);
      }
    });
    setTimeout(() => { setCreating(false); }, 5000);
  }, [displayName, selectedCats, questionCount, createGame, navigate]);

  const handleCreateCustom = useCallback(() => {
    if (!displayName.trim() || customQuestions.length === 0) return;
    setCreating(true);
    localStorage.setItem('jumbo-display-name', displayName.trim());

    const formattedQuestions: Question[] = customQuestions.map((q) => ({
      id: q.id,
      text: q.text,
      category: 'general_knowledge',
      type: 'multiple_choice',
      difficulty: 'medium',
      timeLimit: q.timeLimit,
      points: 1000,
      options: q.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        isCorrect: opt.isCorrect,
      })),
    }));

    createGame(
      {
        categories: ['general_knowledge'],
        questionCount: formattedQuestions.length,
        leaderboardVisibility: 'live',
        streakBonus: true,
        strictMode: false,
        soundEffects: false,
      },
      formattedQuestions,
    );

    const unsub = useQuizStore.subscribe((s) => {
      if (s.pin) {
        unsub();
        navigate(`/quiz/lobby/${s.pin}`);
      }
    });
    setTimeout(() => { setCreating(false); }, 5000);
  }, [displayName, customQuestions, createGame, navigate]);

  function handleAddQuestion() {
    setBuilderError(null);
    if (!newText.trim()) {
      setBuilderError('Please enter question text');
      return;
    }
    const validOpts = newOptions.map((o) => o.trim()).filter(Boolean);
    if (validOpts.length < 2) {
      setBuilderError('Provide at least 2 options');
      return;
    }

    const draft: CustomDraftQuestion = {
      id: crypto.randomUUID(),
      text: newText.trim(),
      timeLimit: newTimeLimit,
      options: newOptions.map((text, idx) => ({
        id: `opt-${idx + 1}`,
        text: text.trim(),
        isCorrect: idx === correctOptIdx,
      })).filter((o) => o.text.length > 0),
    };

    setCustomQuestions((prev) => [...prev, draft]);
    setNewText('');
    setNewOptions(['', '', '', '']);
    setCorrectOptIdx(0);
  }

  function handleImportCsv() {
    setBuilderError(null);
    if (!csvText.trim()) return;

    const lines = csvText.trim().split('\n');
    const imported: CustomDraftQuestion[] = [];

    for (const line of lines) {
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length >= 3) {
        const text = parts[0]!;
        const rawCorrect = parseInt(parts[parts.length - 1] ?? '1', 10);
        const correctIdx = isNaN(rawCorrect) ? 0 : Math.max(0, Math.min(parts.length - 3, rawCorrect - 1));
        const opts = parts.slice(1, parts.length - 1);

        imported.push({
          id: crypto.randomUUID(),
          text,
          timeLimit: 20,
          options: opts.map((optText, idx) => ({
            id: `opt-${idx + 1}`,
            text: optText,
            isCorrect: idx === correctIdx,
          })),
        });
      }
    }

    if (imported.length > 0) {
      setCustomQuestions((prev) => [...prev, ...imported]);
      setCsvText('');
      setShowCsvModal(false);
    } else {
      setBuilderError('Invalid CSV format. Expected: Question, Option 1, Option 2, Option 3, Option 4, CorrectOption(1-4)');
    }
  }

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
      <motion.div
        className="glass-card w-full max-w-xl p-6 sm:p-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-400/20 flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-accent-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Jumbo Quiz</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {connected ? <span className="text-green-400">● Authoritative Sync Ready</span> : <span className="text-amber-400">○ Connecting…</span>}
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
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Your display name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your name"
            maxLength={50}
            className="w-full bg-[var(--surface-2)] border border-[var(--border-glass)] rounded-[var(--radius-md)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-brand-400 transition-colors"
          />
        </div>

        {/* Mode Selector Screen */}
        {!mode && (
          <div className="space-y-3">
            {/* Auto quiz */}
            <motion.button
              id="quiz-auto-btn"
              className="w-full glass-card-sm p-4 text-left flex items-center gap-4 hover:bg-[var(--surface-3)] transition-colors group"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setQuestionCount(15);
                setMode('auto');
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-brand-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Quick Auto Quiz</p>
                <p className="text-xs text-[var(--text-secondary)]">15 questions generated instantly across top categories</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Category selection */}
            <motion.button
              id="quiz-custom-btn"
              className="w-full glass-card-sm p-4 text-left flex items-center gap-4 hover:bg-[var(--surface-3)] transition-colors group"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('categories')}
            >
              <div className="w-12 h-12 rounded-xl bg-accent-400/20 flex items-center justify-center">
                <PencilLine className="w-6 h-6 text-accent-300" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Choose Categories</p>
                <p className="text-xs text-[var(--text-secondary)]">Select from 12 topics & configure question counts (5-30)</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Custom Question Builder (§8.1) */}
            <motion.button
              id="quiz-builder-btn"
              className="w-full glass-card-sm p-4 text-left flex items-center gap-4 hover:bg-[var(--surface-3)] transition-colors group border border-accent-400/30"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('builder')}
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-purple-300" />
              </div>
              <div className="flex-1">
                <p className="font-semibold flex items-center gap-2">
                  <span>Create My Own Questions</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 font-bold">CSV Import</span>
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Type custom questions or import CSV spreadsheet</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <div className="relative flex items-center my-3">
              <div className="flex-1 border-t border-[var(--border-glass)]" />
              <span className="mx-3 text-xs text-[var(--text-tertiary)]">or join with PIN</span>
              <div className="flex-1 border-t border-[var(--border-glass)]" />
            </div>

            {/* Join with PIN */}
            <form onSubmit={handleJoin} className="flex gap-2">
              <input
                id="quiz-join-pin-input"
                type="text"
                value={joinPin}
                onChange={(e) => setJoinPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit PIN"
                maxLength={6}
                className="flex-1 bg-[var(--surface-2)] border border-[var(--border-glass)] rounded-[var(--radius-md)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-accent-400 transition-colors tracking-widest text-lg font-mono text-center"
              />
              <button
                id="quiz-join-pin-btn"
                type="submit"
                className="btn-primary px-5 font-bold text-sm"
                disabled={joinPin.length !== 6 || !displayName.trim() || joining}
              >
                Join
              </button>
            </form>
          </div>
        )}

        {/* ── Mode: Auto or Categories ── */}
        {(mode === 'auto' || mode === 'categories') && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <button
              className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] mb-4 flex items-center gap-1"
              onClick={() => setMode(null)}
            >
              ← Back
            </button>

            {mode === 'categories' && (
              <>
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-3">
                    Categories ({selectedCats.size} selected)
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto pr-1">
                    {QUESTION_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        id={`category-chip-${cat}`}
                        onClick={() => toggleCat(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          selectedCats.has(cat)
                            ? 'bg-brand-500/20 border-brand-500/40 text-brand-300'
                            : 'bg-transparent border-[var(--border-glass)] text-[var(--text-tertiary)]'
                        }`}
                      >
                        {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                    Question Count: {questionCount}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 15, 20].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setQuestionCount(n)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          questionCount === n
                            ? 'bg-brand-500/25 border-brand-400 text-brand-300'
                            : 'bg-[var(--surface-2)] border-[var(--border-glass)] text-[var(--text-secondary)]'
                        }`}
                      >
                        {n} Questions
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button
              id="quiz-launch-btn"
              onClick={handleCreateAuto}
              disabled={!displayName.trim() || creating}
              className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{creating ? 'Starting Game…' : `Start Quiz (${questionCount} Questions)`}</span>
            </button>
          </motion.div>
        )}

        {/* ── Mode: Custom Builder (§8.1) ── */}
        {mode === 'builder' && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] flex items-center gap-1"
                onClick={() => setMode(null)}
              >
                ← Back
              </button>
              <button
                onClick={() => setShowCsvModal(true)}
                className="text-xs px-2.5 py-1 rounded-lg bg-[var(--surface-2)] border border-[var(--border-glass)] text-brand-300 hover:text-white flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Import CSV</span>
              </button>
            </div>

            {builderError && (
              <div className="p-2.5 bg-red-500/15 border border-red-500/30 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{builderError}</span>
              </div>
            )}

            {/* Question input form */}
            <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-glass)] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                Add Question #{customQuestions.length + 1}
              </h3>
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Question text (e.g. Which country hosted the 2024 Olympics?)"
                className="w-full bg-[var(--surface-1)] border border-[var(--border-glass)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-brand-400"
              />

              <div className="grid grid-cols-2 gap-2">
                {newOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg bg-[var(--surface-1)] border border-[var(--border-glass)]">
                    <input
                      type="radio"
                      name="correct-opt"
                      checked={correctOptIdx === i}
                      onChange={() => setCorrectOptIdx(i)}
                      className="accent-brand-500 cursor-pointer ml-1"
                      title="Mark as correct answer"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const next = [...newOptions];
                        next[i] = e.target.value;
                        setNewOptions(next);
                      }}
                      placeholder={`Option ${i + 1}${i === correctOptIdx ? ' (Correct)' : ''}`}
                      className="flex-1 bg-transparent text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <span>Timer:</span>
                  {[10, 20, 30].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setNewTimeLimit(sec)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        newTimeLimit === sec ? 'bg-brand-500 text-white' : 'bg-[var(--surface-3)] text-[var(--text-tertiary)]'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
              </div>
            </div>

            {/* List of custom questions */}
            {customQuestions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)]">
                  <span>Questions in set ({customQuestions.length})</span>
                  <button
                    onClick={() => setCustomQuestions([])}
                    className="text-red-400 hover:underline text-[11px]"
                  >
                    Clear all
                  </button>
                </div>
                <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                  {customQuestions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-2)] text-xs border border-[var(--border-glass)]"
                    >
                      <span className="truncate flex-1 font-medium mr-2">
                        {idx + 1}. {q.text}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-green-400 font-mono">
                          ✓ {q.options.find((o) => o.isCorrect)?.text}
                        </span>
                        <button
                          onClick={() => setCustomQuestions((prev) => prev.filter((item) => item.id !== q.id))}
                          className="text-[var(--text-tertiary)] hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  id="quiz-launch-custom-btn"
                  onClick={handleCreateCustom}
                  disabled={!displayName.trim() || creating}
                  className="btn-primary w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-3"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{creating ? 'Starting Game…' : `Start My Quiz (${customQuestions.length} Questions)`}</span>
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ── CSV Import Modal ── */}
        <AnimatePresence>
          {showCsvModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <div className="glass-card w-full max-w-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-brand-400" />
                    <span>Import Questions from CSV</span>
                  </h3>
                  <button onClick={() => setShowCsvModal(false)} className="btn-icon w-8 h-8">
                    ✕
                  </button>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Paste rows with format: <br />
                  <code className="text-brand-300 font-mono">
                    Question text, Option 1, Option 2, Option 3, Option 4, CorrectOption(1-4)
                  </code>
                </p>
                <textarea
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder={`What is the capital of France?,Paris,London,Berlin,Rome,1\nWhich gas do plants absorb?,Carbon dioxide,Oxygen,Nitrogen,Hydrogen,1`}
                  rows={6}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-glass)] rounded-xl p-3 text-xs font-mono text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-brand-400"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowCsvModal(false)}
                    className="btn-ghost px-4 py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImportCsv}
                    disabled={!csvText.trim()}
                    className="btn-primary px-4 py-2 text-xs font-bold"
                  >
                    Import Rows
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
