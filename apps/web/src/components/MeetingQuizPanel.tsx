import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Gamepad2, X, Trophy, Clock, CheckCircle2, XCircle,
  Users, Sparkles, Share2, Play, AlertCircle, Loader2,
  Triangle, Diamond, Circle, Square,
  Zap, ArrowRight, Crown, Medal, Award,
  Lightbulb, FlaskConical, MapPin, Calculator,
  BookOpen, PawPrint, Tag, Flag, Check, Timer,
  Pause, Play as ResumeIcon, LogOut, Globe, Cross, History,
} from 'lucide-react';
import type { Room } from 'livekit-client';
import { useQuizSocket } from '../hooks/useQuizSocket';
import { useQuizStore } from '../store';
import { FlagQuestionImage } from './FlagQuestionImage';
import { generateQuestions } from '@jumbo/questions';
import type { QuestionCategory } from '@jumbo/questions';

// ─── Kahoot-style shape + colour meta — Lucide icons only, NO emojis ─────────
const OPTION_META = [
  {
    key: 'a',
    icon: Triangle,
    label: 'A',
    bg: 'bg-red-600 hover:bg-red-500',
    ring: 'ring-red-400',
    selectedBg: 'bg-red-700',
    revealCorrect: 'bg-emerald-600 ring-2 ring-emerald-400',
    revealWrong: 'bg-red-900/60 opacity-60',
    dimmed: 'opacity-40',
  },
  {
    key: 'b',
    icon: Diamond,
    label: 'B',
    bg: 'bg-emerald-600 hover:bg-emerald-500',
    ring: 'ring-emerald-400',
    selectedBg: 'bg-emerald-700',
    revealCorrect: 'bg-emerald-600 ring-2 ring-emerald-400',
    revealWrong: 'bg-red-900/60 opacity-60',
    dimmed: 'opacity-40',
  },
  {
    key: 'c',
    icon: Circle,
    label: 'C',
    bg: 'bg-amber-500 hover:bg-amber-400',
    ring: 'ring-amber-300',
    selectedBg: 'bg-amber-600',
    revealCorrect: 'bg-emerald-600 ring-2 ring-emerald-400',
    revealWrong: 'bg-red-900/60 opacity-60',
    dimmed: 'opacity-40',
  },
  {
    key: 'd',
    icon: Square,
    label: 'D',
    bg: 'bg-blue-600 hover:bg-blue-500',
    ring: 'ring-blue-400',
    selectedBg: 'bg-blue-700',
    revealCorrect: 'bg-emerald-600 ring-2 ring-emerald-400',
    revealWrong: 'bg-red-900/60 opacity-60',
    dimmed: 'opacity-40',
  },
];

// ─── All categories from Jumbo Quiz gaming — synced with QuizLauncher ─────────
const QUICK_CATEGORIES: { id: QuestionCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'general_knowledge', label: 'General',    icon: Lightbulb },
  { id: 'science',           label: 'Science',    icon: FlaskConical },
  { id: 'geography',         label: 'Geography',  icon: Globe },
  { id: 'flags',             label: 'Flags',      icon: Flag },
  { id: 'history',           label: 'History',    icon: History },
  { id: 'animals',           label: 'Animals',    icon: PawPrint },
  { id: 'logos_brands',      label: 'Logos',      icon: Tag },
  { id: 'holy_bible',        label: 'Holy Bible', icon: Cross },
  { id: 'math_formulas',     label: 'Math',       icon: Calculator },
  { id: 'countries_capitals',label: 'Capitals',   icon: MapPin },
];

// Rank medal icons — NO emojis
function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="w-4 h-4 text-amber-400" />;
  if (rank === 2) return <Medal className="w-4 h-4 text-slate-300" />;
  if (rank === 3) return <Award  className="w-4 h-4 text-amber-600" />;
  return <span className="text-xs font-bold text-slate-500 w-4 text-center">{rank}</span>;
}

interface MeetingQuizPanelProps {
  room: Room | any;
  onClose: () => void;
  initialPin?: string;
}

export function MeetingQuizPanel({ room, onClose, initialPin }: MeetingQuizPanelProps) {
  const { connected, error, createGame, joinGame, startGame, submitAnswer, nextQuestion, endGame, pauseGame, resumeGame } = useQuizSocket();
  const store = useQuizStore();

  const [activeTab, setActiveTab] = useState<'host' | 'join'>('host');
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set(['general_knowledge', 'science', 'geography']));
  const [questionCount, setQuestionCount] = useState(5);
  const [pinInput, setPinInput] = useState(initialPin ?? '');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const localName = room?.localParticipant?.name || sessionStorage.getItem('lk-name') || 'Participant';

  // Switch to join tab when initialPin is provided (quiz invite received)
  useEffect(() => {
    if (initialPin) { setPinInput(initialPin); setActiveTab('join'); }
  }, [initialPin]);

  // Synchronised countdown — continues running even after player answers (Kahoot style)
  useEffect(() => {
    if (store.status !== 'active' || !store.currentQuestion) return;
    const limit = store.currentQuestion.timeLimit;
    setTimeLeft(limit);
    const interval = setInterval(() => {
      const now = Date.now() + store.clockOffset;
      const elapsed = (now - store.serverStartTime) / 1000;
      const remaining = Math.max(0, limit - elapsed);
      setTimeLeft(Math.ceil(remaining));
      if (remaining <= 0) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [store.status, store.currentQuestion?.id, store.serverStartTime, store.clockOffset]);

  // Confetti when game finishes
  useEffect(() => {
    if (store.status === 'finished') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
    }
  }, [store.status]);

  // Reset paused state when a new question arrives
  useEffect(() => {
    if (store.status === 'active') setIsPaused(false);
  }, [store.status]);

  function toggleCat(id: string) {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { if (next.size > 1) next.delete(id); }
      else next.add(id);
      return next;
    });
  }

  async function handleCreateGame() {
    setIsGenerating(true);
    try {
      // Generate rich questions client-side using the full Jumbo question bank
      const cats = Array.from(selectedCats) as QuestionCategory[];
      const customQuestions = await generateQuestions(
        { categories: cats, count: questionCount },
      );

      createGame(
        {
          categories: cats,
          questionCount,
          leaderboardVisibility: 'live',
          streakBonus: true,
          strictMode: false,
          soundEffects: false,
        },
        customQuestions,
        (pin) => broadcastQuizPin(pin),
        localName,
      );
    } catch (e) {
      console.error('Question generation failed:', e);
      // Fallback: create without custom questions (server uses its own pool)
      createGame(
        {
          categories: Array.from(selectedCats),
          questionCount,
          leaderboardVisibility: 'live',
          streakBonus: true,
          strictMode: false,
          soundEffects: false,
        },
        undefined,
        undefined,
        localName,
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function broadcastQuizPin(pin: string) {
    try {
      const payload = { type: 'quiz_invite', pin, hostName: localName };
      const data = new TextEncoder().encode(JSON.stringify(payload));
      void room?.localParticipant?.publishData?.(data, { reliable: true });
      setBroadcastSent(true);
      setTimeout(() => setBroadcastSent(false), 3000);
    } catch { /* data channel not available */ }
  }

  function handleJoinGame() {
    const cleanPin = pinInput.trim().toUpperCase();
    if (cleanPin.length === 6) joinGame(cleanPin, localName);
  }

  function handleAnswer(optId: string) {
    if (!store.gameId || !store.currentQuestion || store.selectedOptionId || store.status !== 'active') return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate([40, 10, 40]);
    submitAnswer(store.gameId, store.currentQuestion.id, optId);
  }

  function handleNext() {
    if (!store.gameId || !store.isHost) return;
    nextQuestion(store.gameId);
  }

  function handlePauseResume() {
    if (!store.gameId || !store.isHost) return;
    if (isPaused) {
      resumeGame(store.gameId);
      setIsPaused(false);
    } else {
      pauseGame(store.gameId);
      setIsPaused(true);
    }
  }

  function handleEndGame() {
    if (!store.gameId) return;
    endGame(store.gameId);
    store.reset();
  }

  const timerUrgent = timeLeft <= 5;
  const timerColor = timerUrgent ? 'bg-red-500/25 text-red-400 border-red-500/50' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';

  return (
    <div className="flex flex-col h-full bg-[#0f1117] text-white select-none">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <Gamepad2 className="w-4 h-4 text-violet-300" />
          </div>
          <div>
            <h2 className="text-sm font-bold">Meeting Quiz</h2>
            <div className="flex items-center gap-1.5 text-[10px] text-white/40">
              <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span>{connected ? 'Live Sync' : 'Connecting…'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Host controls during active/reveal/paused */}
          {store.isHost && (store.status === 'active' || store.status === 'reveal' || store.status === 'paused') && (
            <>
              <button
                onClick={handlePauseResume}
                title={isPaused ? 'Resume quiz' : 'Pause quiz'}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isPaused
                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300'
                }`}
              >
                {isPaused
                  ? <ResumeIcon className="w-3.5 h-3.5" />
                  : <Pause className="w-3.5 h-3.5" />
                }
              </button>
              <button
                onClick={handleEndGame}
                title="End quiz"
                className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-300 hover:text-red-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Paused banner */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-3 mt-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2"
          >
            <Pause className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-semibold">Quiz Paused</span>
            <span className="text-amber-400/60 ml-auto">Host only can resume</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error banner */}
      {error && (
        <div className="mx-3 mt-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
        </div>
      )}

      {/* ── Scrollable content ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* ─── IDLE: Launcher ─── */}
        {store.status === 'idle' && (
          <div className="space-y-4">
            {/* Tab switcher */}
            <div className="flex rounded-xl p-1 bg-white/5 border border-white/10 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('host')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${activeTab === 'host' ? 'bg-violet-600 text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
              >
                Host Quiz
              </button>
              <button
                onClick={() => setActiveTab('join')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${activeTab === 'join' ? 'bg-violet-600 text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
              >
                Join with PIN
              </button>
            </div>

            {activeTab === 'host' ? (
              <div className="space-y-4">
                <p className="text-xs text-white/50">Launch a quiz for everyone in this call — leaderboards sync in real time.</p>

                {/* Question count */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1.5">Questions ({questionCount})</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 15, 20].map((n) => (
                      <button key={n} onClick={() => setQuestionCount(n)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                          questionCount === n
                            ? 'bg-violet-600 border-violet-500 text-white'
                            : 'bg-white/5 border-white/10 text-white/50 hover:border-violet-500/50 hover:text-white'
                        }`}
                      >{n} Qs</button>
                    ))}
                  </div>
                </div>

                {/* Category picker — all Jumbo Quiz categories, Lucide icons, no emojis */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1.5">
                    Categories ({selectedCats.size} selected)
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {QUICK_CATEGORIES.map((cat) => {
                      const isSel = selectedCats.has(cat.id);
                      const CatIcon = cat.icon;
                      return (
                        <button key={cat.id} onClick={() => toggleCat(cat.id)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl text-left text-xs transition-all border ${
                            isSel
                              ? 'bg-violet-600/25 border-violet-500/60 text-white font-semibold'
                              : 'bg-white/5 border-white/10 text-white/50 hover:border-violet-500/40 hover:text-white'
                          }`}
                        >
                          <CatIcon className={`w-3.5 h-3.5 flex-shrink-0 ${isSel ? 'text-violet-300' : 'text-white/30'}`} />
                          <span className="truncate">{cat.label}</span>
                          {isSel && <Check className="w-3 h-3 ml-auto text-violet-300 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button onClick={handleCreateGame} disabled={isGenerating}
                  className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-colors">
                  {isGenerating
                    ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Preparing Questions…</span></>
                    : <><Sparkles className="w-4 h-4" /><span>Start Quiz &amp; Invite Room</span></>
                  }
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                <p className="text-xs text-white/50">Enter the 6-digit PIN announced by the meeting host:</p>
                <input
                  type="text"
                  value={pinInput}
                  maxLength={6}
                  onChange={(e) => setPinInput(e.target.value.toUpperCase())}
                  placeholder="e.g. 849201"
                  className="w-full text-center tracking-[0.4em] text-2xl font-mono uppercase py-3.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/20 focus:outline-none focus:border-violet-400 transition-colors"
                />
                <button onClick={handleJoinGame} disabled={pinInput.trim().length !== 6}
                  className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                  <Play className="w-4 h-4" />
                  <span>Join Game</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── LOBBY ─── */}
        {store.status === 'lobby' && (
          <div className="space-y-4 text-center">
            {/* PIN display */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Game PIN</span>
              <div className="text-4xl font-extrabold tracking-[0.2em] text-violet-300 font-mono">{store.pin}</div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => { if (store.pin) { navigator.clipboard.writeText(store.pin); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); } }}
                  className="px-3 py-1 text-xs rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Check className={`w-3 h-3 ${isCopied ? 'text-emerald-400' : 'text-white/50'}`} />
                  <span>{isCopied ? 'Copied!' : 'Copy PIN'}</span>
                </button>
                <button
                  onClick={() => store.pin && broadcastQuizPin(store.pin)}
                  className="px-3 py-1 text-xs rounded-lg bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 font-semibold flex items-center gap-1.5 transition-colors border border-violet-500/30"
                >
                  <Share2 className="w-3 h-3" />
                  <span>{broadcastSent ? 'Invited!' : 'Invite Callers'}</span>
                </button>
              </div>
            </div>

            {/* Player list */}
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between text-xs text-white/40">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Players ({store.players.length})</span>
                <span>Waiting to start…</span>
              </div>
              <div className="max-h-44 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-white/5 border border-white/10">
                {store.players.length === 0 && (
                  <p className="text-xs text-center text-white/30 py-3">Share the PIN to invite players</p>
                )}
                {store.players.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 text-xs">
                    <div className="w-6 h-6 rounded-full bg-violet-500/30 flex items-center justify-center font-bold text-[10px] text-violet-300">
                      {p.displayName[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium truncate flex-1">{p.displayName}</span>
                    {p.isCurrentPlayer && <span className="text-[10px] text-violet-400 font-semibold">(You)</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Start button for Host OR Waiting banner for Joiners */}
            {store.isHost ? (
              <div className="space-y-2">
                <button
                  onClick={() => store.gameId && startGame(store.gameId)}
                  disabled={store.players.length === 0}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Quiz Now ({store.players.length} player{store.players.length !== 1 ? 's' : ''})</span>
                </button>
                {/* Host exit button in lobby */}
                <button
                  onClick={handleEndGame}
                  className="w-full py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cancel &amp; Exit Quiz</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-violet-300">
                  <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                  <span>Waiting for host to start the game…</span>
                </div>
                <p className="text-[11px] text-white/40">You are in! The quiz will automatically begin on your screen when the host starts.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── GENERATING ─── */}
        {store.status === 'generating' && (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-white">Generating questions…</p>
            <p className="text-xs text-white/40">Fetching verified questions from knowledge bank</p>
          </div>
        )}

        {/* ─── ACTIVE: Question + Countdown + Answers ─── */}
        {store.status === 'active' && store.currentQuestion && (
          <div className="space-y-3">
            {/* Progress + timer row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-violet-500/20 border border-violet-500/40 text-violet-300 font-bold text-[10px]">
                  Q{store.questionIndex + 1}/{store.totalQuestions}
                </span>
                {store.selectedOptionId && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold">
                    <Check className="w-2.5 h-2.5" /> Locked in
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-1 text-white/40 text-[10px]">
                  <Users className="w-3 h-3" /> {store.answeredCount}/{store.totalPlayers}
                </span>
                {/* Live countdown — keeps ticking after answering (Kahoot style) */}
                <span className={`font-mono font-bold text-xs px-2 py-1 rounded-lg border flex items-center gap-1 ${timerColor} ${timerUrgent ? 'animate-pulse' : ''}`}>
                  <Timer className="w-3 h-3" /> {timeLeft}s
                </span>
              </div>
            </div>

            {/* Time bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-200 rounded-full ${timerUrgent ? 'bg-red-400' : 'bg-violet-400'}`}
                style={{ width: `${Math.max(0, (timeLeft / (store.currentQuestion.timeLimit || 20)) * 100)}%` }}
              />
            </div>

            {/* Question card */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              {store.currentQuestion.imageUrl && (
                <FlagQuestionImage
                  imageUrl={store.currentQuestion.imageUrl}
                  alt={store.currentQuestion.text}
                  size="compact"
                />
              )}
              <h3 className="text-sm font-semibold leading-snug text-white">{store.currentQuestion.text}</h3>
            </div>

            {/* 2×2 Kahoot answer grid — Lucide shape icons, solid colour backgrounds */}
            <div className="grid grid-cols-2 gap-2">
              {store.currentQuestion.options.map((opt, i) => {
                const meta = OPTION_META[i % OPTION_META.length]!;
                const Icon = meta.icon;
                const isSelected = store.selectedOptionId === opt.id;
                const dimmed = store.selectedOptionId && !isSelected && store.status === 'active';

                return (
                  <motion.button
                    key={opt.id}
                    whileTap={!store.selectedOptionId ? { scale: 0.96 } : {}}
                    onClick={() => handleAnswer(opt.id)}
                    disabled={!!store.selectedOptionId}
                    className={`relative flex items-center gap-2 p-2.5 rounded-xl text-left transition-all text-white font-semibold text-xs leading-tight
                      ${meta.bg} ${isSelected ? `ring-2 ${meta.ring} brightness-90` : ''} ${dimmed ? 'opacity-40' : ''}`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="flex-1 line-clamp-2">{opt.text}</span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Waiting banner after answering */}
            <AnimatePresence>
              {store.selectedOptionId && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Answer locked! Waiting for timer…</span>
                  </div>
                  <span className="text-indigo-400 tabular-nums">{store.answeredCount}/{store.totalPlayers}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Host controls row during active question */}
            {store.isHost && (
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handlePauseResume}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                    isPaused
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                      : 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25'
                  }`}
                >
                  {isPaused ? <ResumeIcon className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button
                  onClick={handleEndGame}
                  className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border bg-red-500/15 border-red-500/30 text-red-300 hover:bg-red-500/25 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  End Quiz
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── PAUSED ─── */}
        {store.status === 'paused' && (
          <div className="py-8 text-center space-y-4">
            <div className="inline-block p-4 rounded-full bg-amber-400/10 border border-amber-400/20">
              <Pause className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <p className="text-base font-bold text-amber-300">Quiz Paused</p>
              <p className="text-xs text-white/40 mt-1">The host has paused the game</p>
            </div>
            {store.isHost && (
              <div className="space-y-2">
                <button
                  onClick={handlePauseResume}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <ResumeIcon className="w-4 h-4" />
                  <span>Resume Quiz</span>
                </button>
                <button
                  onClick={handleEndGame}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>End Quiz</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── REVEAL ─── */}
        {store.status === 'reveal' && (
          <div className="space-y-3">
            {/* Result banner */}
            <AnimatePresence>
              {store.playerResult && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-xl flex items-center gap-2.5 border ${
                    store.playerResult.correct
                      ? 'bg-emerald-500/15 border-emerald-500/30'
                      : 'bg-red-500/15 border-red-500/30'
                  }`}
                >
                  {store.playerResult.correct
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    : <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm flex items-center gap-1.5">
                      {store.playerResult.correct
                        ? <><Zap className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-300">Correct!</span></>
                        : <><XCircle className="w-3.5 h-3.5 text-red-400" /><span className="text-red-300">Incorrect</span></>
                      }
                    </div>
                    {store.playerResult.correct && (
                      <div className="text-white/50 text-[10px] mt-0.5">
                        +{store.playerResult.pointsEarned.toLocaleString()} pts · {store.playerResult.responseMs}ms
                      </div>
                    )}
                  </div>
                  {/* Only the host advances manually */}
                  {store.isHost && (
                    <button onClick={handleNext}
                      className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-colors">
                      <span>{store.questionIndex + 1 >= store.totalQuestions ? 'Results' : 'Next'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Revealed correct answer highlight */}
            {store.currentQuestion && store.correctOptionId && (
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">Correct Answer</span>
                {store.currentQuestion.options.map((opt, i) => {
                  const meta = OPTION_META[i % OPTION_META.length]!;
                  const Icon = meta.icon;
                  const isCorrect = opt.id === store.correctOptionId;
                  const wasSelected = opt.id === store.selectedOptionId;
                  const optStat = store.optionResults.find((r) => r.optionId === opt.id);
                  const pct = optStat?.percentage ?? 0;
                  return (
                    <div key={opt.id}
                      className={`relative flex items-center gap-2 p-2.5 rounded-xl overflow-hidden text-xs font-semibold transition-all ${
                        isCorrect
                          ? 'bg-emerald-600/30 border border-emerald-500/60 text-white ring-1 ring-emerald-400/60'
                          : wasSelected
                          ? 'bg-red-600/20 border border-red-500/30 text-white/50'
                          : 'bg-white/5 border border-white/5 text-white/40'
                      }`}
                    >
                      {/* Percentage fill bar */}
                      {pct > 0 && (
                        <div className={`absolute inset-0 ${isCorrect ? 'bg-emerald-500/15' : 'bg-white/5'}`}
                          style={{ width: `${pct}%` }} />
                      )}
                      <div className="relative z-10 flex items-center gap-2 flex-1 min-w-0">
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{opt.text}</span>
                      </div>
                      <div className="relative z-10 flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[10px] text-white/50">{pct}%</span>
                        {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {wasSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Host end button in reveal */}
            {store.isHost && (
              <button
                onClick={handleEndGame}
                className="w-full py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>End Quiz Early</span>
              </button>
            )}

            {/* Live leaderboard */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white/50">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Leaderboard</span>
              </div>
              <div className="space-y-1 max-h-52 overflow-y-auto">
                {store.leaderboard.map((p) => (
                  <motion.div key={p.id} layout transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs ${
                      p.isCurrentPlayer
                        ? 'bg-violet-500/20 border border-violet-400/40 text-white font-semibold'
                        : 'bg-white/5 text-white/70'
                    }`}
                  >
                    <span className="w-4 flex items-center justify-center flex-shrink-0">
                      <RankIcon rank={p.rank ?? 99} />
                    </span>
                    <div className="w-6 h-6 rounded-full bg-violet-500/30 flex items-center justify-center font-bold text-[10px] text-violet-300 flex-shrink-0">
                      {p.displayName[0]?.toUpperCase()}
                    </div>
                    <span className="flex-1 truncate">{p.displayName}{p.isCurrentPlayer ? ' (You)' : ''}</span>
                    <span className="font-mono font-bold text-violet-300">{p.totalScore.toLocaleString()}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── FINISHED: Podium ─── */}
        {store.status === 'finished' && (
          <div className="space-y-5 text-center py-2">
            <div className="space-y-1">
              <div className="inline-block p-3 rounded-full bg-amber-400/20 mb-1">
                <Trophy className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-base font-extrabold text-white">Quiz Complete!</h3>
              <p className="text-xs text-white/50">Great game everyone!</p>
            </div>

            {/* Podium: 2nd | 1st | 3rd */}
            <div className="flex items-end justify-center gap-2">
              {store.leaderboard[1] && (
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-slate-400/20 flex items-center justify-center">
                    <Medal className="w-4 h-4 text-slate-300" />
                  </div>
                  <span className="text-[11px] font-semibold truncate max-w-[80px] text-white/80">{store.leaderboard[1].displayName}</span>
                  <div className="w-full h-14 bg-slate-500/20 border-t border-slate-400/30 rounded-t-lg flex items-center justify-center text-xs font-bold font-mono text-slate-300">
                    {store.leaderboard[1].totalScore.toLocaleString()}
                  </div>
                </div>
              )}
              {store.leaderboard[0] && (
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-amber-400/20 ring-2 ring-amber-400 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-xs font-bold text-amber-300 truncate max-w-[90px]">{store.leaderboard[0].displayName}</span>
                  <div className="w-full h-20 bg-amber-500/20 border-t-2 border-amber-400 rounded-t-lg flex items-center justify-center text-xs font-bold font-mono text-amber-300">
                    {store.leaderboard[0].totalScore.toLocaleString()}
                  </div>
                </div>
              )}
              {store.leaderboard[2] && (
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-amber-700/20 flex items-center justify-center">
                    <Award className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-[11px] font-semibold truncate max-w-[80px] text-white/60">{store.leaderboard[2].displayName}</span>
                  <div className="w-full h-10 bg-amber-800/20 border-t border-amber-700/30 rounded-t-lg flex items-center justify-center text-xs font-bold font-mono text-amber-700">
                    {store.leaderboard[2].totalScore.toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            {/* Full leaderboard */}
            {store.leaderboard.length > 3 && (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {store.leaderboard.slice(3).map((p) => (
                  <div key={p.id} className={`flex items-center gap-2 p-2 rounded-xl text-xs ${p.isCurrentPlayer ? 'bg-violet-500/20 border border-violet-400/30' : 'bg-white/5'}`}>
                    <span className="w-4 text-center font-bold text-white/40">{p.rank}</span>
                    <span className="flex-1 truncate text-white/70">{p.displayName}{p.isCurrentPlayer ? ' (You)' : ''}</span>
                    <span className="font-mono font-bold text-white/60">{p.totalScore.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => store.reset()}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors">
              Back to Meeting
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
