import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2, Zap, SlidersHorizontal, ChevronRight, AlertCircle,
  FileSpreadsheet, Plus, Trash2, CheckCircle2, Sparkles, Loader2,
  Flag, Globe, Tag, PawPrint, BookOpen, MapPin, FlaskConical,
  Calculator, Binary, Landmark, Lightbulb, Check, X,
  User, KeyRound, Play, ArrowLeft, ArrowRight,
  Triangle, Diamond, Circle, Square,
} from 'lucide-react';
import { QUESTION_CATEGORIES, type Question } from '@jumbo/shared';
import { useQuizSocket } from '../hooks/useQuizSocket';
import { useQuizStore } from '../store';
import { AppNavbar } from '../components/AppNavbar';

// Category icon map — 100% Lucide SVG vector icons, NO emojis
const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  flags: Flag,
  countries_capitals: Globe,
  logos_brands: Tag,
  animals: PawPrint,
  history: BookOpen,
  geography: MapPin,
  science: FlaskConical,
  math_formulas: Calculator,
  numbers_logic: Binary,
  religion_culture: Landmark,
  mythology: Zap,
  general_knowledge: Lightbulb,
};

const CATEGORY_LABELS: Record<string, string> = {
  flags: 'Flags & Banners',
  countries_capitals: 'World Capitals',
  logos_brands: 'Logos & Brands',
  animals: 'Fauna & Animals',
  history: 'World History',
  geography: 'Global Geography',
  science: 'Science & Physics',
  math_formulas: 'Math & Formulas',
  numbers_logic: 'Logic & Numbers',
  religion_culture: 'Culture & Heritage',
  mythology: 'Myth & Legends',
  general_knowledge: 'General Trivia',
};

const OPTION_META = [
  { label: 'A', icon: Triangle, color: 'text-red-400 bg-red-500/20 border-red-500/40' },
  { label: 'B', icon: Diamond,  color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' },
  { label: 'C', icon: Circle,   color: 'text-amber-400 bg-amber-500/20 border-amber-500/40' },
  { label: 'D', icon: Square,   color: 'text-blue-400 bg-blue-500/20 border-blue-500/40' },
];

interface CustomDraftQuestion {
  id: string;
  text: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  timeLimit: number;
}

export default function QuizLauncher() {
  const navigate = useNavigate();
  const { connected, error, createGame, joinGame } = useQuizSocket();

  const [mode, setMode] = useState<'auto' | 'categories' | 'builder' | null>(null);
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set(['general_knowledge', 'science', 'geography']));
  const [questionCount, setQuestionCount] = useState(15);
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('jumbo-display-name') ?? '');
  const [joinPin, setJoinPin] = useState('');
  const [joining, setJoining] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Custom question builder state
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
    const trimmed = displayName.trim();
    if (!trimmed) {
      setJoinError('Please enter your nickname first');
      nameInputRef.current?.focus();
      return;
    }
    setCreating(true);
    localStorage.setItem('jumbo-display-name', trimmed);
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
    setTimeout(() => { setCreating(false); }, 6000);
  }, [displayName, selectedCats, questionCount, createGame, navigate]);

  const handleCreateCustom = useCallback(() => {
    const trimmed = displayName.trim();
    if (!trimmed || customQuestions.length === 0) return;
    setCreating(true);
    localStorage.setItem('jumbo-display-name', trimmed);

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
    setTimeout(() => { setCreating(false); }, 6000);
  }, [displayName, customQuestions, createGame, navigate]);

  function handleAddQuestion() {
    setBuilderError(null);
    if (!newText.trim()) {
      setBuilderError('Please type question prompt');
      return;
    }
    const validOpts = newOptions.map((o) => o.trim()).filter(Boolean);
    if (validOpts.length < 2) {
      setBuilderError('Please provide at least 2 distinct answer options');
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
      setBuilderError('Invalid CSV. Expected: Question, Option 1, Option 2, Option 3, Option 4, CorrectOption(1-4)');
    }
  }

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setJoinError(null);

    const name = displayName.trim();
    if (!name) {
      setJoinError('Please enter your nickname above to join the game');
      nameInputRef.current?.focus();
      return;
    }

    if (joinPin.length !== 6) {
      setJoinError('Please enter a full 6-digit game PIN');
      return;
    }

    setJoining(true);
    localStorage.setItem('jumbo-display-name', name);

    joinGame(joinPin, name, (res) => {
      setJoining(false);
      if (res?.success) {
        if (res.status === 'active' || res.status === 'reveal') {
          navigate(`/quiz/play/${joinPin}`);
        } else {
          navigate(`/quiz/lobby/${joinPin}`);
        }
      } else {
        setJoinError(res?.error ?? 'Game not found. Please verify the 6-digit PIN.');
      }
    });
  }

  return (
    <div className="relative min-h-dvh flex flex-col bg-[#080b13] text-white selection:bg-violet-500/30 selection:text-white overflow-x-hidden pb-12">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-violet-600/20 via-indigo-600/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute -bottom-32 left-1/4 w-[400px] h-[300px] bg-cyan-600/10 blur-[100px] rounded-full" />
      </div>

      {/* Global Navbar */}
      <AppNavbar showBack backTo="/home" backLabel="Home" />

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 sm:py-8 z-10">
        <motion.div
          className="w-full max-w-xl rounded-3xl bg-[#0f1422]/90 border border-white/10 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-5 sm:p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Top subtle gradient highlight line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400" />

          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30 ring-1 ring-white/20 flex-shrink-0">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>Jumbo Quiz</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">Real-time multiplayer live trivia</p>
              </div>
            </div>

            {/* Connection badge */}
            <div>
              {connected ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Ready</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold shadow-sm">
                  <Loader2 className="w-3 h-3 animate-spin text-violet-400" />
                  <span>Syncing…</span>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/15 border border-red-500/30 rounded-2xl mb-5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Display Name Input */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-violet-400" /> Your Player Nickname
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                {displayName.length}/50
              </span>
            </label>
            <div className="relative">
              <input
                ref={nameInputRef}
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setJoinError(null);
                }}
                placeholder="Enter your name (e.g. Alex, James, Sam)"
                maxLength={50}
                className={`w-full bg-[#161c2e] border rounded-2xl px-4 py-3 text-sm font-semibold text-white placeholder:text-slate-400 focus:outline-none transition-all shadow-inner ${
                  joinError?.includes('name') || joinError?.includes('nickname')
                    ? 'border-amber-400 bg-amber-500/10 focus:ring-4 focus:ring-amber-500/20'
                    : 'border-white/10 hover:border-white/20 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/20'
                }`}
              />
            </div>
          </div>

          {/* ── Mode 1: Main Launcher Screen ── */}
          {!mode && (
            <div className="space-y-3.5">
              {/* Quick Auto Quiz */}
              <motion.button
                id="quiz-auto-btn"
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!displayName.trim()) {
                    setJoinError('Please enter your nickname first');
                    nameInputRef.current?.focus();
                    return;
                  }
                  setQuestionCount(15);
                  setMode('auto');
                }}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/25 hover:border-amber-400/50 text-left flex items-center gap-4 transition-all group shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-600/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner group-hover:scale-105 transition-transform flex-shrink-0">
                  <Zap className="w-6 h-6 text-amber-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-sm text-white group-hover:text-amber-200 transition-colors">Quick Auto Quiz</h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">Instant · 15 Qs</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">Instant verified questions across top trivia categories, ready in 1 click</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </motion.button>

              {/* Choose Categories */}
              <motion.button
                id="quiz-custom-btn"
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!displayName.trim()) {
                    setJoinError('Please enter your nickname first');
                    nameInputRef.current?.focus();
                    return;
                  }
                  setMode('categories');
                }}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/25 hover:border-emerald-400/50 text-left flex items-center gap-4 transition-all group shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner group-hover:scale-105 transition-transform flex-shrink-0">
                  <SlidersHorizontal className="w-6 h-6 text-emerald-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-sm text-white group-hover:text-emerald-200 transition-colors">Choose Categories</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-400/30">12 Topics · Custom Count</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">Select from science to world history and pick between 5 to 30 questions</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </motion.button>

              {/* Create My Own Questions */}
              <motion.button
                id="quiz-builder-btn"
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!displayName.trim()) {
                    setJoinError('Please enter your nickname first');
                    nameInputRef.current?.focus();
                    return;
                  }
                  setMode('builder');
                }}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-violet-500/5 to-transparent border border-violet-500/25 hover:border-violet-400/50 text-left flex items-center gap-4 transition-all group shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-violet-600/20 border border-violet-400/30 flex items-center justify-center text-violet-300 shadow-inner group-hover:scale-105 transition-transform flex-shrink-0">
                  <FileSpreadsheet className="w-6 h-6 text-violet-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-sm text-white group-hover:text-violet-200 transition-colors">Create My Own Questions</h3>
                    <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold uppercase tracking-wider border border-violet-400/30">CSV / Builder</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">Type custom multiple-choice cards or import spreadsheet CSV rows</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-violet-300 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </motion.button>

              {/* Divider */}
              <div className="relative flex items-center my-5">
                <div className="flex-1 border-t border-white/10" />
                <span className="mx-4 text-xs font-semibold uppercase tracking-widest text-slate-400">or join with PIN</span>
                <div className="flex-1 border-t border-white/10" />
              </div>

              {/* Join with PIN */}
              <form onSubmit={handleJoin} className="space-y-3">
                <div className="flex gap-2.5">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      id="quiz-join-pin-input"
                      type="text"
                      value={joinPin}
                      onChange={(e) => {
                        setJoinPin(e.target.value.replace(/\D/g, '').slice(0, 6));
                        setJoinError(null);
                      }}
                      placeholder="6-digit PIN"
                      maxLength={6}
                      className="w-full bg-[#161c2e] border border-white/10 rounded-2xl pl-10 pr-4 py-3.5 text-center font-mono text-xl tracking-[0.25em] font-extrabold text-white placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/15 transition-all shadow-inner"
                    />
                  </div>
                  <button
                    id="quiz-join-pin-btn"
                    type="submit"
                    disabled={joining || joinPin.length !== 6}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-sm shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 flex-shrink-0"
                  >
                    {joining ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Join</span>
                      </>
                    )}
                  </button>
                </div>
                {joinError && (
                  <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
                    <span>{joinError}</span>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* ── Mode 2: Auto or Categories Config ── */}
          {(mode === 'auto' || mode === 'categories') && (
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div className="flex items-center justify-between">
                <button
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  onClick={() => setMode(null)}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Game Modes</span>
                </button>
                <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                  {mode === 'auto' ? 'Quick Auto Quiz' : 'Custom Categories'}
                </span>
              </div>

              {mode === 'categories' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
                    <span>Select Categories</span>
                    <span className="text-violet-400">{selectedCats.size} selected</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {QUESTION_CATEGORIES.map((cat) => {
                      const IconComponent = CATEGORY_ICONS[cat] || Lightbulb;
                      const isSelected = selectedCats.has(cat);
                      return (
                        <button
                          key={cat}
                          id={`category-chip-${cat}`}
                          type="button"
                          onClick={() => toggleCat(cat)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                            isSelected
                              ? 'bg-violet-600/25 border-violet-500/70 text-white shadow-sm ring-1 ring-violet-500/30'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:border-violet-500/30 hover:text-white'
                          }`}
                        >
                          <IconComponent className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-violet-300' : 'text-slate-400'}`} />
                          <span className="truncate flex-1">{CATEGORY_LABELS[cat] || cat}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-violet-300 flex-shrink-0 ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Question count selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Question Count: <span className="text-violet-400">{questionCount} Questions</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {[5, 10, 15, 20, 25, 30].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setQuestionCount(n)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        questionCount === n
                          ? 'bg-violet-600 border-violet-500 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:border-violet-500/30 hover:text-white'
                      }`}
                    >
                      {n} Qs
                    </button>
                  ))}
                </div>
              </div>

              {/* Start game button */}
              <button
                id="quiz-launch-btn"
                onClick={handleCreateAuto}
                disabled={!displayName.trim() || creating}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-violet-600/30 transition-all active:scale-98"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Preparing Lobby…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Launch Quiz Lobby ({questionCount} Questions)</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* ── Mode 3: Custom Builder (§8.1) ── */}
          {mode === 'builder' && (
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  onClick={() => setMode(null)}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Game Modes</span>
                </button>
                <button
                  onClick={() => setShowCsvModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 border border-violet-400/40 text-violet-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Import CSV</span>
                </button>
              </div>

              {builderError && (
                <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-2xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{builderError}</span>
                </div>
              )}

              {/* Question input form */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3.5 shadow-inner">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Add Question #{customQuestions.length + 1}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span>Time Limit:</span>
                    {[10, 20, 30].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setNewTimeLimit(sec)}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                          newTimeLimit === sec ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Type your question prompt here…"
                  className="w-full bg-[#161c2e] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white placeholder:text-slate-400 focus:outline-none focus:border-violet-400 shadow-inner"
                />

                {/* 2×2 Kahoot style option inputs */}
                <div className="grid grid-cols-2 gap-2">
                  {newOptions.map((opt, i) => {
                    const meta = OPTION_META[i % OPTION_META.length]!;
                    const ShapeIcon = meta.icon;
                    const isCorrect = correctOptIdx === i;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                          isCorrect
                            ? 'bg-emerald-500/15 border-emerald-500/50 text-white ring-1 ring-emerald-500/40'
                            : 'bg-white/5 border-white/10 text-white/80'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setCorrectOptIdx(i)}
                          title="Click to mark as correct answer"
                          className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 border ${meta.color}`}
                        >
                          <ShapeIcon className="w-3 h-3" />
                        </button>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const next = [...newOptions];
                            next[i] = e.target.value;
                            setNewOptions(next);
                          }}
                          placeholder={`Option ${meta.label}${isCorrect ? ' (Correct)' : ''}`}
                          className="flex-1 bg-transparent text-xs font-medium text-white placeholder:text-slate-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setCorrectOptIdx(i)}
                          className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                            isCorrect ? 'border-emerald-400 bg-emerald-400' : 'border-white/30'
                          }`}
                        >
                          {isCorrect && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="w-full py-2.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Question to Set</span>
                </button>
              </div>

              {/* List of custom questions */}
              {customQuestions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Questions in deck ({customQuestions.length})</span>
                    <button
                      onClick={() => setCustomQuestions([])}
                      className="text-red-400 hover:text-red-300 text-xs font-semibold"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                    {customQuestions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs"
                      >
                        <span className="truncate flex-1 font-medium mr-2 text-white">
                          {idx + 1}. {q.text}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
                            {q.options.find((o) => o.isCorrect)?.text}
                          </span>
                          <button
                            onClick={() => setCustomQuestions((prev) => prev.filter((item) => item.id !== q.id))}
                            className="text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete question"
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
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-98 mt-3"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating Game…</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Start My Custom Quiz ({customQuestions.length} Questions)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Bottom Back Button */}
          <button
            onClick={() => navigate('/home')}
            className="mt-6 w-full text-center text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home Dashboard</span>
          </button>
        </motion.div>
      </div>

      {/* ── CSV Import Modal ── */}
      <AnimatePresence>
        {showCsvModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg rounded-3xl bg-[#0f1422] border border-white/10 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-violet-400" />
                  <span>Import Questions from CSV</span>
                </h3>
                <button
                  onClick={() => setShowCsvModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Paste rows separated by commas with the exact format: <br />
                <code className="text-violet-300 font-mono text-[11px] bg-black/40 px-2 py-0.5 rounded-md inline-block mt-1">
                  Question text, Option 1, Option 2, Option 3, Option 4, CorrectIndex(1-4)
                </code>
              </p>
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder={`What is the capital of France?,Paris,London,Berlin,Rome,1\nWhich gas do plants absorb?,Carbon dioxide,Oxygen,Nitrogen,Hydrogen,1`}
                rows={6}
                className="w-full bg-[#161c2e] border border-white/10 rounded-xl p-3 text-xs font-mono text-white placeholder:text-slate-400 focus:outline-none focus:border-violet-400 shadow-inner"
              />
              <div className="flex justify-end gap-2.5">
                <button
                  onClick={() => setShowCsvModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportCsv}
                  disabled={!csvText.trim()}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-xs font-bold text-white transition-colors shadow-md"
                >
                  Import Rows
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
