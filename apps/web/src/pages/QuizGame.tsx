import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Trophy, CheckCircle2, XCircle, Volume2, VolumeX, Flag,
  BarChart3, Clock, ChevronDown, Check, Loader2,
  Triangle, Diamond, Circle, Square,
  ThumbsUp, Flame, Heart, Sparkles, PartyPopper, UserPlus,
  Video, Mic, Zap, ArrowRight, Timer, Home, LogOut,
  ArrowUp, ArrowDown, ListOrdered, Pause, Play,
} from 'lucide-react';
import { useQuizSocket } from '../hooks/useQuizSocket';
import { useQuizStore, type QuizPlayer, type QuizQuestion } from '../store';
import { useWakeLock } from '../hooks/useWakeLock';
import { quizAudio } from '../utils/audioEffects';

// ─── Kahoot-style shape & color definitions ────────────────────────────────────
const OPTION_META = [
  {
    key: 'a',
    icon: Triangle,
    badgeBg: 'bg-red-500/20 text-red-400 border border-red-500/40',
    fillColor: 'fill-red-400 text-red-400',
    cardBorder: 'border-red-500/60 hover:border-red-400',
    cardBg: 'bg-[#1a1020]',
    activeRing: 'ring-2 ring-red-400 shadow-[0_0_18px_rgba(239,68,68,0.3)]',
  },
  {
    key: 'b',
    icon: Diamond,
    badgeBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
    fillColor: 'fill-emerald-400 text-emerald-400',
    cardBorder: 'border-emerald-500/60 hover:border-emerald-400',
    cardBg: 'bg-[#0f1d1a]',
    activeRing: 'ring-2 ring-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.3)]',
  },
  {
    key: 'c',
    icon: Circle,
    badgeBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
    fillColor: 'fill-amber-400 text-amber-400',
    cardBorder: 'border-amber-500/60 hover:border-amber-400',
    cardBg: 'bg-[#1c1a0e]',
    activeRing: 'ring-2 ring-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.3)]',
  },
  {
    key: 'd',
    icon: Square,
    badgeBg: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
    fillColor: 'fill-blue-400 text-blue-400',
    cardBorder: 'border-blue-500/60 hover:border-blue-400',
    cardBg: 'bg-[#0e1422]',
    activeRing: 'ring-2 ring-blue-400 shadow-[0_0_18px_rgba(96,165,250,0.3)]',
  },
];

// Fallback demo question for /quiz/demo
const DEMO_QUESTION: QuizQuestion = {
  id: 'q_demo_egypt',
  text: 'Which of the following cities serves as the official capital of Egypt?',
  options: [
    { id: 'opt_giza', text: 'Giza' },
    { id: 'opt_cairo', text: 'Cairo' },
    { id: 'opt_luxor', text: 'Luxor' },
    { id: 'opt_alexandria', text: 'Alexandria' },
  ],
  timeLimit: 20,
};

export default function QuizGame() {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();

  const { joinGame, submitAnswer, nextQuestion, pauseGame, resumeGame } = useQuizSocket();
  const store = useQuizStore();

  useWakeLock(true);

  const [soundOn, setSoundOn] = useState(() => quizAudio.isEnabled());
  const [showReport, setShowReport] = useState(false);
  const [reported, setReported] = useState(false);
  const [floatingPoints, setFloatingPoints] = useState<{ id: number; pts: number } | null>(null);
  const [reactions, setReactions] = useState<Array<{ id: number; icon: any; color: string; x: number }>>([]);

  // Auto-reconnect if accessed directly with a PIN
  useEffect(() => {
    if (!store.gameId && pin && pin.toLowerCase() !== 'demo') {
      const displayName = localStorage.getItem('jumbo-display-name') || 'Player';
      joinGame(pin, displayName);
    }
  }, [pin, store.gameId, joinGame]);

  // Navigate to results when game finishes
  useEffect(() => {
    if (store.status === 'finished') {
      navigate(`/quiz/results/${pin ?? ''}`);
    }
  }, [store.status, navigate, pin]);

  const isDemo = pin?.toLowerCase() === 'demo' && !store.currentQuestion;
  const activeQuestion: QuizQuestion | null = store.currentQuestion || (isDemo ? DEMO_QUESTION : null);

  // ── Synchronized countdown timer ─────────────────────────────────────────────
  // The countdown ALWAYS runs to 0, even after a player locks in their answer.
  // This is the Kahoot behaviour: answer locked, timer loops on for all players,
  // then at t=0 (or when all answered) the reveal fires from the server.
  const [timeLeft, setTimeLeft] = useState(activeQuestion?.timeLimit || 20);
  const lastTickRef = useRef<number>(-1);

  useEffect(() => {
    if (!activeQuestion) return;
    if (store.status !== 'paused') {
      setTimeLeft(activeQuestion.timeLimit);
    }
    lastTickRef.current = -1;

    if (store.status === 'active' && store.serverStartTime) {
      function syncTick() {
        const elapsed = (Date.now() + store.clockOffset - store.serverStartTime) / 1000;
        const remaining = Math.max(0, (activeQuestion?.timeLimit || 20) - elapsed);
        const rounded = Math.ceil(remaining);
        setTimeLeft(rounded);
        if (rounded <= 5 && rounded > 0 && rounded !== lastTickRef.current) {
          lastTickRef.current = rounded;
          quizAudio.playTick();
        }
      }
      syncTick();
      const interval = setInterval(syncTick, 200);
      return () => clearInterval(interval);
    } else if (store.status === 'paused') {
      if (store.remainingMs !== null && store.remainingMs !== undefined) {
        setTimeLeft(Math.ceil(store.remainingMs / 1000));
      }
    } else if (isDemo) {
      // Demo mode: local countdown, independent of answer state
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev <= 1 ? 0 : prev - 1;
          if (next <= 5 && next > 0) quizAudio.playTick();
          if (next === 0) clearInterval(interval);
          return next;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [store.status, store.serverStartTime, store.remainingMs, store.clockOffset, activeQuestion?.id, activeQuestion?.timeLimit, isDemo]);

  // Puzzle / Order Sequence state
  const [puzzleItems, setPuzzleItems] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    if (activeQuestion && activeQuestion.options) {
      setPuzzleItems([...activeQuestion.options]);
    }
  }, [activeQuestion?.id]);

  const movePuzzleItem = useCallback((idx: number, direction: 'up' | 'down') => {
    if (store.selectedOptionId || store.status === 'paused' || (store.status !== 'active' && !isDemo)) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= puzzleItems.length) return;
    setPuzzleItems((prev) => {
      const next = [...prev];
      const temp = next[idx]!;
      next[idx] = next[targetIdx]!;
      next[targetIdx] = temp;
      return next;
    });
  }, [store.selectedOptionId, store.status, isDemo, puzzleItems.length]);

  // Audio stingers on reveal
  useEffect(() => {
    if (store.status === 'reveal') {
      if (store.selectedOptionId && store.selectedOptionId === store.correctOptionId) {
        quizAudio.playCorrect();
      } else if (store.selectedOptionId) {
        quizAudio.playWrong();
      }
    }
  }, [store.status, store.selectedOptionId, store.correctOptionId]);

  // Handle answering — locks in answer but does NOT stop the timer
  const handleAnswer = useCallback((optId: string) => {
    if (store.selectedOptionId || store.status === 'paused' || (store.status !== 'active' && !isDemo) || !activeQuestion) return;
    quizAudio.playLockIn();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate([40, 20, 40]);

    if (store.gameId) {
      submitAnswer(store.gameId, activeQuestion.id, optId);
    } else {
      store.submitAnswer(optId);
      const isCorrect = optId === 'opt_cairo';
      const responseMs = (activeQuestion.timeLimit - timeLeft) * 1000;
      const pts = isCorrect ? Math.max(500, Math.round(1000 * (1 - responseMs / (activeQuestion.timeLimit * 1000) / 2))) : 0;
      if (isCorrect) {
        setFloatingPoints({ id: Date.now(), pts });
        setTimeout(() => setFloatingPoints(null), 3000);
        quizAudio.playCorrect();
      } else {
        quizAudio.playWrong();
      }
    }
  }, [store.selectedOptionId, store.status, isDemo, activeQuestion, store.gameId, submitAnswer, store, timeLeft]);

  // Host pause / resume actions
  const handlePause = useCallback(() => {
    if (isDemo) {
      store.setStatus('paused');
      store.setRemainingMs(timeLeft * 1000);
      return;
    }
    if (store.gameId) {
      pauseGame(store.gameId);
    }
  }, [isDemo, store, timeLeft, pauseGame]);

  const handleResume = useCallback(() => {
    if (isDemo) {
      store.setStatus('active');
      return;
    }
    if (store.gameId) {
      resumeGame(store.gameId);
    }
  }, [isDemo, store, resumeGame]);

  // Floating score celebration when server sends playerResult
  useEffect(() => {
    if (store.playerResult && store.playerResult.correct) {
      setFloatingPoints({ id: Date.now(), pts: store.playerResult.pointsEarned });
      setTimeout(() => setFloatingPoints(null), 3000);
    }
  }, [store.playerResult]);

  const handleNext = useCallback(() => {
    if (store.questionIndex + 1 >= store.totalQuestions || store.status === 'finished') {
      navigate(`/quiz/results/${pin ?? ''}`);
      return;
    }
    if (store.gameId) nextQuestion(store.gameId);
  }, [store.questionIndex, store.totalQuestions, store.status, store.gameId, nextQuestion, navigate, pin]);

  // Keyboard shortcuts: 1/2/3/4 or A/B/C/D, plus Space/P for Host Pause/Resume
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Host Pause / Resume with Spacebar or 'P' key
      if (store.isHost || isDemo) {
        if (e.key === 'p' || e.key === 'P' || (e.key === ' ' && store.status === 'paused')) {
          e.preventDefault();
          if (store.status === 'active') {
            handlePause();
            return;
          } else if (store.status === 'paused') {
            handleResume();
            return;
          }
        }
      }

      if (activeQuestion && !store.selectedOptionId && store.status !== 'paused' && (store.status === 'active' || isDemo)) {
        const key = e.key.toLowerCase();
        let idx = -1;
        if (key === '1' || key === 'a') idx = 0;
        else if (key === '2' || key === 'b') idx = 1;
        else if (key === '3' || key === 'c') idx = 2;
        else if (key === '4' || key === 'd') idx = 3;
        if (idx >= 0 && activeQuestion.options[idx]) { e.preventDefault(); handleAnswer(activeQuestion.options[idx]!.id); }
      } else if (store.status === 'reveal' && (store.isHost || isDemo)) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNext(); }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeQuestion, store.selectedOptionId, store.status, isDemo, store.isHost, handleAnswer, handleNext, handlePause, handleResume]);

  const realLeaderboard: QuizPlayer[] = useMemo(() => {
    if (store.leaderboard && store.leaderboard.length > 0) return store.leaderboard;
    if (store.players && store.players.length > 0) {
      return store.players.map((p, idx) => ({ ...p, totalScore: p.totalScore || 0, rank: idx + 1 }));
    }
    return [
      { id: 'p1', displayName: 'Kagur', totalScore: 4237, rank: 1, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
      { id: 'p2', displayName: 'Sarah_M', totalScore: 3950, rank: 2, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
      { id: 'p3', displayName: 'You', totalScore: 3820, rank: 3, isCurrentPlayer: true, avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' },
      { id: 'p4', displayName: 'David_K', totalScore: 3100, rank: 4, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
      { id: 'p5', displayName: 'Elena_R', totalScore: 2850, rank: 5, avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80' },
    ];
  }, [store.leaderboard, store.players]);

  const currentPlayer = useMemo(() =>
    realLeaderboard.find((p) => p.isCurrentPlayer) || realLeaderboard[0] || { rank: 1, totalScore: 0, displayName: 'You' },
  [realLeaderboard]);

  const liveCount = store.totalPlayers || realLeaderboard.length || 1;
  const questionIndex = store.questionIndex ?? 0;
  const totalQuestions = store.totalQuestions || 10;
  const progressPercent = Math.min(100, ((questionIndex + 1) / totalQuestions) * 100);
  const timeRatio = timeLeft / (activeQuestion?.timeLimit || 20);
  const timerColor = store.status === 'paused'
    ? 'text-amber-400 border-amber-500/50 bg-amber-950/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
    : timeLeft > 10 ? 'text-emerald-400 border-emerald-500/50 bg-emerald-950/30'
    : timeLeft > 5 ? 'text-amber-400 border-amber-500/50 bg-amber-950/30'
    : 'text-red-400 border-red-500/60 bg-red-950/40 animate-pulse';
  const timerBarColor = store.status === 'paused'
    ? 'bg-amber-400'
    : timeLeft > 10 ? 'bg-emerald-400' : timeLeft > 5 ? 'bg-amber-400' : 'bg-red-400';

  const handleSendReaction = (icon: any, color: string) => {
    const id = Date.now();
    const x = Math.floor(Math.random() * 60) + 20;
    setReactions((prev) => [...prev, { id, icon, color, x }]);
    setTimeout(() => setReactions((prev) => prev.filter((r) => r.id !== id)), 2200);
  };

  const toggleSound = () => { const next = !soundOn; setSoundOn(next); quizAudio.setEnabled(next); };

  // ── Waiting state ─────────────────────────────────────────────────────────────
  if (!activeQuestion) {
    return (
      <div className="min-h-dvh bg-[#090d16] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#0b0f1a] border border-[#1e263d] rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
          <h2 className="text-lg font-bold">Waiting for the next question…</h2>
          <p className="text-xs text-slate-400">
            {store.totalPlayers > 0
              ? `${store.totalPlayers} player${store.totalPlayers !== 1 ? 's' : ''} connected`
              : `Connecting to game session ${pin || ''}…`}
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-semibold">Live</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh bg-[#090d16] text-white flex flex-col items-center justify-start select-none overflow-x-hidden p-2 sm:p-3 lg:p-4">

      {/* Background radial gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#141d33] via-[#090d16] to-[#06080e] opacity-90 z-0" />

      {/* Floating Reaction Particles */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {reactions.map((r) => {
          const IconComponent = r.icon;
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 1, y: '85vh', x: `${r.x}vw`, scale: 0.8 }}
              animate={{ opacity: 0, y: '20vh', scale: 1.5 }}
              transition={{ duration: 2.0, ease: 'easeOut' }}
              className={`absolute p-2.5 rounded-full ${r.color} shadow-2xl backdrop-blur-sm`}
            >
              <IconComponent className="w-6 h-6 text-white" />
            </motion.div>
          );
        })}
      </div>

      {/* ── Top controls bar ───────────────────────────────────────────────────── */}
      <div className="w-full max-w-7xl flex items-center justify-between mb-2 z-20 px-1 gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm('Exit quiz and return to Home?')) {
                store.reset();
                navigate('/home');
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all"
            title="Home"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0c1e1c] border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <Users className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{liveCount} Live</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Host Pause / Resume Button */}
          {(store.isHost || isDemo) && (store.status === 'active' || store.status === 'paused') && (
            <button
              onClick={store.status === 'paused' ? handleResume : handlePause}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                store.status === 'paused'
                  ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/50 text-emerald-300 shadow-emerald-500/20 animate-pulse'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300 hover:text-amber-200'
              }`}
              title={store.status === 'paused' ? 'Resume Game (Space / P)' : 'Pause Game (P)'}
            >
              {store.status === 'paused' ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-emerald-300" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#141b2c] border border-[#222e47] text-xs font-semibold text-slate-300">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400 font-bold">#{currentPlayer.rank ?? 1}</span>
            <span className="hidden sm:inline text-slate-400">·</span>
            <span className="hidden sm:inline text-violet-300 font-bold">{(currentPlayer.totalScore ?? 0).toLocaleString()} pts</span>
          </div>
          <button onClick={toggleSound} className="p-1.5 rounded-full bg-[#121828] border border-[#232f48] text-slate-300 hover:text-white transition-colors" title={soundOn ? 'Mute' : 'Unmute'}>
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>
          <button
            onClick={() => {
              if (window.confirm('Leave this game?')) {
                store.reset();
                navigate('/quiz');
              }
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-slate-300 hover:text-red-300 text-xs font-semibold transition-all"
            title="Leave Game"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </div>

      {/* ── Main adaptive shell ───────────────────────────────────────────────────
          Layout driven PURELY by CSS media queries — no JS mode switching:
          Mobile  (<640px)   : 4-col grid  — left 1 col, center 3 cols, right hidden
          Tablet  (sm 640px) : 10-col grid — left 3 cols, center 7 cols, right hidden
          Laptop  (lg 1024px): 12-col grid — left 3 cols, center 6 cols, right 3 cols
      */}
      <div className="relative z-10 w-full max-w-7xl">
        <div className="bg-[#0b0f1a] border border-[#1e263d] rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-3 sm:gap-4 overflow-hidden relative">

          {/* ── Question progress + live countdown timer ────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 rounded bg-[#0d221c] border border-emerald-500/40 text-emerald-400 font-bold text-xs">
                  Q{questionIndex + 1} / {totalQuestions}
                </div>
                {store.selectedOptionId && store.status === 'active' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-semibold"
                  >
                    <Check className="w-3 h-3" />
                    <span>Locked in!</span>
                  </motion.div>
                )}
              </div>

              {/* ── Kahoot-style countdown: runs for ALL participants until 0 ── */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-bold text-sm transition-all duration-300 ${timerColor}`}>
                {store.status === 'paused' ? (
                  <>
                    <Pause className="w-4 h-4 flex-shrink-0 animate-pulse" />
                    <span className="tabular-nums font-mono">{timeLeft}s PAUSED</span>
                  </>
                ) : (
                  <>
                    <Timer className="w-4 h-4 flex-shrink-0" />
                    <span className="tabular-nums w-6 text-center">{timeLeft}</span>
                  </>
                )}
              </div>
            </div>

            {/* Dual progress: question index bar (top) + time remaining bar (bottom) */}
            <div className="flex flex-col gap-1">
              <div className="w-full h-1 bg-[#151c2e] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="w-full h-1.5 bg-[#151c2e] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-200 ${timerBarColor}`}
                  style={{ width: `${Math.max(0, timeRatio * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── Responsive 3-zone grid ──────────────────────────────────────────── */}
          <div className="grid gap-3 sm:gap-4 items-start grid-cols-4 sm:grid-cols-10 lg:grid-cols-12">

            {/* ── LEFT: Leaderboard rail ──────────────────────────────────────── */}
            <div className="col-span-1 sm:col-span-3 flex flex-col gap-2">
              <div className="flex items-center gap-1 px-1 py-0.5">
                <BarChart3 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="hidden sm:block text-[10px] font-bold text-slate-300 uppercase tracking-wider truncate">
                  RANKS ({Math.min(realLeaderboard.length, 5)})
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                {realLeaderboard.slice(0, 5).map((p) => {
                  const isUser = !!p.isCurrentPlayer;
                  const medal = p.rank === 1 ? 'text-amber-400' : p.rank === 2 ? 'text-slate-200' : p.rank === 3 ? 'text-amber-600' : 'text-slate-500';
                  return (
                    <motion.div
                      key={p.id}
                      layout
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className={`relative flex items-center rounded-xl p-1.5 sm:p-2 transition-all ${
                        isUser
                          ? 'border-2 border-indigo-500 bg-[#16172d] shadow-[0_0_15px_rgba(99,102,241,0.2)] ring-1 ring-indigo-400/40'
                          : 'border border-[#1e273e] bg-[#111726] hover:border-slate-600'
                      }`}
                    >
                      <span className={`text-xs sm:text-sm font-bold w-4 text-center flex-shrink-0 ${medal}`}>{p.rank ?? 1}</span>
                      <div className="ml-1.5 flex-shrink-0">
                        {p.avatarUrl ? (
                          <img src={p.avatarUrl} alt={p.displayName} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover ring-1 ring-white/10 bg-slate-800" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                        ) : (
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-indigo-500/30 flex items-center justify-center font-bold text-[10px] text-indigo-300 ring-1 ring-white/10">
                            {p.displayName?.[0]?.toUpperCase() ?? '?'}
                          </div>
                        )}
                      </div>
                      {/* Name hidden on mobile (<sm), visible tablet+ */}
                      <span className="hidden sm:block ml-1.5 text-xs font-bold truncate text-slate-200 flex-1 max-w-[80px] lg:max-w-[110px]">
                        {p.displayName}{isUser ? ' (You)' : ''}
                      </span>
                      {/* Score hidden on mobile, shown tablet+ */}
                      <div className="hidden sm:block ml-auto px-1.5 py-0.5 rounded bg-[#0b101c] border border-emerald-500/20 text-emerald-400 font-bold text-[10px] flex-shrink-0">
                        {(p.totalScore ?? 0).toLocaleString()}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex justify-center pt-0.5">
                <button type="button" className="w-7 h-7 rounded-full bg-[#141b2c] border border-[#222e47] hover:bg-[#1a233a] flex items-center justify-center text-slate-400 hover:text-white transition-all" title="View all ranks">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── CENTER: Question + Kahoot 2x2 answer grid ──────────────────── */}
            <div className="col-span-3 sm:col-span-7 lg:col-span-6 flex flex-col gap-2.5 sm:gap-3">

              {/* Question card */}
              <div className="relative bg-[#121828] border border-[#222e47] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                    {store.status === 'reveal' ? 'RESULTS' : store.selectedOptionId ? 'ANSWER LOCKED · TIMER RUNNING' : 'SELECT YOUR ANSWER'}
                  </div>
                  <button onClick={() => setShowReport(!showReport)} className="text-[10px] text-slate-500 hover:text-amber-400 flex items-center gap-1 transition-colors" title="Report question">
                    <Flag className="w-3 h-3" />
                    <span>{reported ? 'Reported' : 'Report'}</span>
                  </button>
                </div>

                {activeQuestion.imageUrl && (
                  <div className="w-full max-h-36 mb-3 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center">
                    <img src={activeQuestion.imageUrl} alt="" className="max-h-36 object-contain" />
                  </div>
                )}

                <h1 className="text-white text-sm sm:text-base md:text-lg font-bold leading-snug">{activeQuestion.text}</h1>

                <AnimatePresence>
                  {floatingPoints && (
                    <motion.div
                      key={floatingPoints.id}
                      initial={{ opacity: 0, scale: 0.5, y: 10 }}
                      animate={{ opacity: 1, scale: 1.15, y: -28 }}
                      exit={{ opacity: 0, scale: 0.8, y: -48 }}
                      className="absolute right-4 top-4 px-3 py-1.5 rounded-full bg-emerald-500 text-white font-extrabold text-sm shadow-xl flex items-center gap-1.5 border border-white/20 z-20"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>+{floatingPoints.pts} pts</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── 2×2 Kahoot shape-coded answer grid ───────────────────────────
                  After selecting:
                  - Selected option highlights with its colour ring
                  - Other options dim to 50% opacity
                  - Timer keeps counting for all players
                  On reveal:
                  - Correct option glows green with percentage bar
                  - Wrong selections turn red
              */}
              {/* ── Question Options: Multiple Choice, True/False, or Puzzle Sequence ── */}
              {activeQuestion.type === 'puzzle' ? (
                /* ── PUZZLE (ORDERING SEQUENCE) ── */
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-violet-950/40 border border-violet-500/30 text-violet-300 text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <ListOrdered className="w-4 h-4 text-violet-400" />
                      <span>Arrange items in correct order from 1 to 4:</span>
                    </div>
                    {store.selectedOptionId && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Locked In
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {puzzleItems.map((item, idx) => {
                      const meta = OPTION_META[idx % OPTION_META.length]!;
                      const isLocked = !!store.selectedOptionId;
                      const isReveal = store.status === 'reveal';
                      const isCorrectSeq = isReveal && store.playerResult?.correct;

                      let rowBorder = 'border-[#222e47] bg-[#121929]';
                      if (isReveal) {
                        rowBorder = isCorrectSeq
                          ? 'border-emerald-400 bg-emerald-950/40 ring-1 ring-emerald-400'
                          : 'border-red-400 bg-red-950/40 ring-1 ring-red-400';
                      }

                      return (
                        <motion.div
                          key={item.id}
                          layout
                          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                          className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all ${rowBorder}`}
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                              #{idx + 1}
                            </div>
                            <span className="text-white text-xs sm:text-sm font-semibold truncate">{item.text}</span>
                          </div>

                          {!isLocked && store.status === 'active' && (
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => movePuzzleItem(idx, 'up')}
                                className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-slate-200 transition-colors"
                                title="Move up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === puzzleItems.length - 1}
                                onClick={() => movePuzzleItem(idx, 'down')}
                                className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-slate-200 transition-colors"
                                title="Move down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  {!store.selectedOptionId && (store.status === 'active' || isDemo) && (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const seq = puzzleItems.map((p) => p.id).join(',');
                        handleAnswer(seq);
                      }}
                      className="w-full mt-1 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Lock In My Sequence</span>
                    </motion.button>
                  )}
                </div>
              ) : activeQuestion.type === 'true_false' ? (
                /* ── TRUE / FALSE (2 LARGE CARDS) ── */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {activeQuestion.options.slice(0, 2).map((opt, idx) => {
                    const isTrue = opt.text.toLowerCase().includes('true');
                    const isSelected = store.selectedOptionId === opt.id;
                    const isCorrect = store.status === 'reveal' && opt.id === store.correctOptionId;
                    const isWrong = store.status === 'reveal' && isSelected && !isCorrect;
                    const optionStat = store.optionResults.find((r) => r.optionId === opt.id);
                    const percentage = optionStat?.percentage ?? 0;

                    const bgGradient = isTrue
                      ? 'from-blue-600/30 via-cyan-600/20 to-[#0b162c]'
                      : 'from-rose-600/30 via-red-600/20 to-[#1e1018]';
                    const borderColor = isCorrect
                      ? 'border-emerald-400 ring-2 ring-emerald-400 bg-emerald-950/50'
                      : isWrong
                      ? 'border-red-400 ring-2 ring-red-400 bg-red-950/50'
                      : isSelected
                      ? isTrue ? 'border-cyan-400 ring-2 ring-cyan-400' : 'border-red-400 ring-2 ring-red-400'
                      : isTrue ? 'border-blue-500/40 hover:border-cyan-400' : 'border-red-500/40 hover:border-rose-400';

                    const dimClass = (store.selectedOptionId && !isSelected && store.status === 'active')
                      ? 'opacity-50'
                      : (!isSelected && !isCorrect && store.status === 'reveal')
                      ? 'opacity-50'
                      : 'opacity-100';

                    return (
                      <motion.button
                        key={opt.id}
                        layout
                        whileHover={!store.selectedOptionId && store.status === 'active' ? { scale: 1.02 } : {}}
                        whileTap={!store.selectedOptionId && store.status === 'active' ? { scale: 0.98 } : {}}
                        onClick={() => handleAnswer(opt.id)}
                        disabled={!!store.selectedOptionId || (store.status !== 'active' && !isDemo)}
                        className={`relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border bg-gradient-to-br transition-all overflow-hidden ${bgGradient} ${borderColor} ${dimClass}`}
                      >
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 bg-white/10 ring-1 ring-white/20">
                          {isTrue ? (
                            <Diamond className="w-8 h-8 text-cyan-400 fill-cyan-400" />
                          ) : (
                            <Triangle className="w-8 h-8 text-red-400 fill-red-400" />
                          )}
                        </div>
                        <span className="text-xl sm:text-2xl font-black text-white tracking-wide">{opt.text}</span>

                        {store.status === 'reveal' && store.optionResults.length > 0 && (
                          <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between text-xs font-bold text-slate-300">
                            <span>{percentage}% selected</span>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                /* ── MULTIPLE CHOICE (4 KAHOOT COLORED CARDS) ── */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  {activeQuestion.options.map((opt, idx) => {
                    const meta = OPTION_META[idx % OPTION_META.length]!;
                    const Icon = meta.icon;
                    const isSelected = store.selectedOptionId === opt.id;
                    const isCorrect = store.status === 'reveal' && opt.id === store.correctOptionId;
                    const isWrong = store.status === 'reveal' && isSelected && !isCorrect;
                    const optionStat = store.optionResults.find((r) => r.optionId === opt.id);
                    const percentage = optionStat?.percentage ?? 0;

                    let borderClass = `${meta.cardBorder} hover:brightness-110`;
                    if (isCorrect) borderClass = 'border-emerald-400 bg-emerald-950/40 ring-2 ring-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.35)]';
                    else if (isWrong) borderClass = 'border-red-400 bg-red-950/40 ring-2 ring-red-400/80';
                    else if (isSelected) borderClass = `${meta.cardBorder} ${meta.activeRing}`;

                    const dimClass = (store.selectedOptionId && !isSelected && store.status === 'active')
                      ? 'opacity-50'
                      : (!isSelected && !isCorrect && store.status === 'reveal')
                      ? 'opacity-50'
                      : 'opacity-100';

                    return (
                      <motion.button
                        key={opt.id}
                        layout
                        whileHover={!store.selectedOptionId && store.status === 'active' ? { scale: 1.015, y: -1 } : {}}
                        whileTap={!store.selectedOptionId && store.status === 'active' ? { scale: 0.975 } : {}}
                        onClick={() => handleAnswer(opt.id)}
                        disabled={!!store.selectedOptionId || (store.status !== 'active' && !isDemo)}
                        className={`relative flex items-center justify-between p-2.5 sm:p-3.5 rounded-xl border text-left transition-all duration-200 overflow-hidden ${meta.cardBg} ${borderClass} ${dimClass}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2 z-10">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.badgeBg}`}>
                            <Icon className={`w-4 h-4 ${meta.fillColor}`} />
                          </div>
                          <span className="text-white text-xs sm:text-sm font-semibold leading-tight">{opt.text}</span>
                        </div>
                        <div className="flex-shrink-0 z-10">
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                          ) : isWrong ? (
                            <XCircle className="w-5 h-5 text-red-400 fill-red-400/20" />
                          ) : isSelected ? (
                            <div className="w-5 h-5 rounded-full border-2 border-emerald-400 flex items-center justify-center bg-emerald-500/20">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                          )}
                        </div>
                        {store.status === 'reveal' && store.optionResults.length > 0 && (
                          <div className="absolute inset-0 pointer-events-none">
                            <div className={`h-full ${isCorrect ? 'bg-emerald-500/20' : 'bg-white/5'} transition-all duration-700`} style={{ width: `${percentage}%` }} />
                            <span className="absolute right-10 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">{percentage}%</span>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* ── Answer-locked waiting banner ──────────────────────────────────
                  Shows ONLY when: user answered AND timer is still running (status=active).
                  Displays real-time answered count — same as Kahoot "X/Y answered".
              */}
              <AnimatePresence>
                {store.selectedOptionId && store.status === 'active' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-indigo-300 text-xs font-semibold"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <span>Answer locked! Waiting for others…</span>
                    </div>
                    <span className="text-indigo-400 font-bold tabular-nums">{store.answeredCount}/{liveCount}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Reveal: correct/incorrect result + speed score + host next ── */}
              <AnimatePresence>
                {store.status === 'reveal' && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#141d30] border border-emerald-500/30 text-xs text-slate-300 shadow-lg"
                  >
                    <div className="flex items-center gap-2.5 flex-1">
                      {store.playerResult?.correct ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-bold text-emerald-400 text-sm">Correct! +{store.playerResult.pointsEarned.toLocaleString()} pts</span>
                            <span className="text-slate-500 text-[10px]">
                              Response: {store.playerResult.responseMs}ms{store.playerResult.responseMs < 3000 ? ' · Speed bonus applied!' : ''}
                            </span>
                          </div>
                        </>
                      ) : store.selectedOptionId ? (
                        <>
                          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-bold text-red-400 text-sm">Incorrect — 0 pts</span>
                            <span className="text-slate-500 text-[10px]">Correct answer highlighted in green</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
                          <span className="text-slate-400">Time's up! No answer submitted.</span>
                        </>
                      )}
                    </div>
                    {store.isHost && (
                      <button
                        onClick={handleNext}
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap"
                      >
                        <span>{questionIndex + 1 >= totalQuestions ? 'View Results' : 'Next Question'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── RIGHT: Studio feeds — laptop+ ONLY (hidden on mobile & tablet) ── */}
            <div className="hidden lg:flex lg:col-span-3 flex-col gap-2.5">

              {/* Host video card */}
              <div className="relative bg-[#121828] border border-[#222e47] rounded-xl overflow-hidden p-2.5 shadow-md">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1b2338]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                    <Video className="w-3.5 h-3.5 text-violet-400" />
                    <span>Host Stream</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-semibold">Live</span>
                  </div>
                </div>
                <div className="relative aspect-video w-full rounded-lg bg-[#0b0f1a] overflow-hidden border border-[#1e273e]">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=360&q=80" alt="Host" className="w-full h-full object-cover" />
                  <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-white">
                    <Mic className="w-2.5 h-2.5 text-emerald-400" />
                    <span>Meeting Host</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[#1b2338]">
                  <span className="text-[10px] text-slate-400 font-semibold">Speakers:</span>
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {realLeaderboard.slice(0, 4).map((p) => (
                      <div key={p.id} className="inline-block h-5 w-5 rounded-full ring-1 ring-emerald-400 bg-slate-800 text-[9px] font-bold text-center leading-5 text-emerald-300 overflow-hidden" title={p.displayName}>
                        {p.avatarUrl ? <img src={p.avatarUrl} alt="" className="w-full h-full object-cover" /> : p.displayName[0]?.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live reactions */}
              <div className="bg-[#121828] border border-[#222e47] rounded-xl p-2.5 shadow-md">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Live Reactions</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { icon: ThumbsUp, color: 'bg-blue-500', cls: 'text-blue-400 border-blue-500/30 hover:bg-blue-600/30', label: 'Thumbs Up' },
                    { icon: Flame, color: 'bg-orange-500', cls: 'text-orange-400 border-orange-500/30 hover:bg-orange-600/30', label: 'Fire' },
                    { icon: Heart, color: 'bg-pink-500', cls: 'text-pink-400 border-pink-500/30 hover:bg-pink-600/30', label: 'Heart' },
                    { icon: Sparkles, color: 'bg-purple-500', cls: 'text-purple-400 border-purple-500/30 hover:bg-purple-600/30', label: 'Sparkles' },
                    { icon: PartyPopper, color: 'bg-emerald-500', cls: 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-600/30', label: 'Party' },
                  ].map(({ icon: Icon, color, cls, label }) => (
                    <button key={label} onClick={() => handleSendReaction(Icon, color)} className={`p-2 rounded-lg bg-[#182033] ${cls} border flex items-center justify-center transition-all`} title={label}>
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Session activity feed */}
              <div className="bg-[#121828] border border-[#222e47] rounded-xl p-2.5 shadow-md flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Session Activity</span>
                <div className="space-y-2">
                  <div className="text-[11px] flex items-start gap-1.5 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{store.answeredCount}/{liveCount} players answered</p>
                      <span className="text-[9px] text-slate-500">Live progress</span>
                    </div>
                  </div>
                  {store.playerResult && (
                    <div className="text-[11px] flex items-start gap-1.5 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{store.playerResult.correct ? `Scored +${store.playerResult.pointsEarned} pts` : 'Attempted answer'}</p>
                        <span className="text-[9px] text-slate-500">{store.playerResult.responseMs}ms response</span>
                      </div>
                    </div>
                  )}
                  <div className="text-[11px] flex items-start gap-1.5 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Round {questionIndex + 1} of {totalQuestions}</p>
                      <span className="text-[9px] text-slate-500">In session</span>
                    </div>
                  </div>
                  <AnimatePresence>
                    {store.players.slice(-1).map((p) => (
                      <motion.div key={p.id + '-join'} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-[11px] flex items-start gap-1.5 text-slate-300">
                        <UserPlus className="w-3 h-3 text-violet-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{p.displayName} joined</p>
                          <span className="text-[9px] text-slate-500">Just now</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

          </div>

          {/* ── Pause Overlay ─────────────────────────────────────────────────── */}
          <AnimatePresence>
            {store.status === 'paused' && (
              <motion.div
                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
                exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#070b16]/90 p-6 text-center select-none"
              >
                <motion.div
                  initial={{ scale: 0.8, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.8, y: 10 }}
                  className="flex flex-col items-center max-w-md w-full"
                >
                  <div className="relative mb-5">
                    <div className="absolute -inset-2 rounded-2xl bg-amber-500/25 blur-xl animate-pulse" />
                    <div className="relative w-20 h-20 rounded-2xl bg-[#121828] border-2 border-amber-500/50 flex items-center justify-center text-amber-400 shadow-2xl">
                      <Pause className="w-10 h-10" />
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide uppercase mb-3 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Game Paused
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
                    Game Paused by Host
                  </h3>

                  <p className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">
                    The timer is frozen at{' '}
                    <span className="text-amber-400 font-bold tabular-nums text-base sm:text-lg px-2.5 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/30">
                      {timeLeft}s
                    </span>{' '}
                    remaining. Answering is temporarily locked.
                  </p>

                  {store.isHost || isDemo ? (
                    <div className="flex flex-col items-center gap-2 w-full">
                      <button
                        onClick={handleResume}
                        className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-base shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-105 active:scale-95"
                      >
                        <Play className="w-5 h-5 fill-white" />
                        <span>Resume Game</span>
                        <kbd className="text-[11px] bg-black/30 px-2 py-0.5 rounded text-emerald-100 font-mono border border-white/10">
                          Space / P
                        </kbd>
                      </button>
                      <span className="text-[11px] text-slate-400 mt-1">Press Spacebar or click button above to resume</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-sm font-semibold shadow-inner">
                      <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                      <span>Stand by — the host will resume shortly</span>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
