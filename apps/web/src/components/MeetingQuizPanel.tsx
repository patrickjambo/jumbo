import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Gamepad2, X, Trophy, Clock, CheckCircle, XCircle,
  Users, Sparkles, Share2, Play, AlertCircle, Loader2
} from 'lucide-react';
import type { Room } from 'livekit-client';
import { useQuizSocket } from '../hooks/useQuizSocket';
import { useQuizStore } from '../store';

const OPTION_META = [
  { shape: '▲', cls: 'quiz-opt-red' },
  { shape: '◆', cls: 'quiz-opt-blue' },
  { shape: '●', cls: 'quiz-opt-yellow' },
  { shape: '■', cls: 'quiz-opt-green' },
];

const QUICK_CATEGORIES = [
  { id: 'general_knowledge', label: 'General', icon: '💡' },
  { id: 'science', label: 'Science', icon: '🔬' },
  { id: 'geography', label: 'Geography', icon: '🗺️' },
  { id: 'flags', label: 'Flags', icon: '🏳️' },
  { id: 'math_formulas', label: 'Math', icon: '➗' },
  { id: 'history', label: 'History', icon: '📜' },
  { id: 'animals', label: 'Animals', icon: '🦁' },
  { id: 'logos_brands', label: 'Logos', icon: '🏷️' },
];

interface MeetingQuizPanelProps {
  room: Room;
  onClose: () => void;
  initialPin?: string;
}

export function MeetingQuizPanel({ room, onClose, initialPin }: MeetingQuizPanelProps) {
  const { connected, error, createGame, joinGame, startGame, submitAnswer, nextQuestion, endGame } = useQuizSocket();
  const store = useQuizStore();

  const [activeTab, setActiveTab] = useState<'host' | 'join'>('host');
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set(['general_knowledge', 'science', 'geography']));
  const [questionCount, setQuestionCount] = useState(5);
  const [pinInput, setPinInput] = useState(initialPin ?? '');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  const localName = room.localParticipant.name || 'Participant';

  // If initialPin changes or was provided, switch to join tab
  useEffect(() => {
    if (initialPin) {
      setPinInput(initialPin);
      setActiveTab('join');
    }
  }, [initialPin]);

  // Sync countdown timer when active
  useEffect(() => {
    if (store.status !== 'active' || !store.currentQuestion) return;

    const limit = store.currentQuestion.timeLimit;
    const interval = setInterval(() => {
      const now = Date.now() + store.clockOffset;
      const elapsed = (now - store.serverStartTime) / 1000;
      const remaining = Math.max(0, limit - elapsed);
      setTimeLeft(Math.ceil(remaining));
      if (remaining <= 0) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, [store.status, store.currentQuestion, store.serverStartTime, store.clockOffset]);

  // Confetti on game finished
  useEffect(() => {
    if (store.status === 'finished') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [store.status]);

  function toggleCat(id: string) {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleCreateGame() {
    createGame({
      categories: Array.from(selectedCats),
      questionCount,
      leaderboardVisibility: 'live',
      streakBonus: true,
      strictMode: false,
      soundEffects: false,
    });

    // Auto-join as host once PIN is generated
    const unsub = useQuizStore.subscribe((s) => {
      if (s.pin && s.status === 'lobby') {
        unsub();
        broadcastQuizPin(s.pin);
      }
    });
  }

  function broadcastQuizPin(pin: string) {
    try {
      const payload = {
        type: 'quiz_invite',
        pin,
        hostName: localName,
      };
      const data = new TextEncoder().encode(JSON.stringify(payload));
      void room.localParticipant.publishData(data, { reliable: true });
      setBroadcastSent(true);
      setTimeout(() => setBroadcastSent(false), 3000);
    } catch {
      // Data channel fallback
    }
  }

  function handleJoinGame() {
    const cleanPin = pinInput.trim().toUpperCase();
    if (cleanPin.length === 6) {
      joinGame(cleanPin, localName);
    }
  }

  function handleAnswer(optId: string) {
    if (!store.gameId || !store.currentQuestion || store.selectedOptionId || store.status !== 'active') return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(40);
    }
    submitAnswer(store.gameId, store.currentQuestion.id, optId);
  }

  function handleNext() {
    if (!store.gameId) return;
    nextQuestion(store.gameId);
  }

  return (
    <div className="flex flex-col h-full bg-[var(--surface-1)] text-[var(--text-primary)] select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-glass)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-300">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Meeting Quiz</h2>
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-tertiary)]">
              <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400' : 'bg-amber-400'}`} />
              <span>{connected ? 'Live Sync' : 'Connecting…'}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="btn-icon w-8 h-8 rounded-lg hover:bg-[var(--surface-2)]"
          aria-label="Close quiz panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="mx-3 mt-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ─── State: IDLE (Launcher inside Meeting) ─── */}
        {store.status === 'idle' && (
          <div className="space-y-4">
            {/* Tab switch */}
            <div className="flex rounded-xl p-1 bg-[var(--surface-2)] border border-[var(--border-glass)] text-xs font-semibold">
              <button
                onClick={() => setActiveTab('host')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activeTab === 'host' ? 'bg-brand-500 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                Host in Meeting
              </button>
              <button
                onClick={() => setActiveTab('join')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activeTab === 'join' ? 'bg-brand-500 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                Join with PIN
              </button>
            </div>

            {activeTab === 'host' ? (
              <div className="space-y-3">
                <p className="text-xs text-[var(--text-secondary)]">
                  Launch a quick quiz for everyone in this call. Results and leaderboards sync in real time.
                </p>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider block mb-1.5">
                    Questions ({questionCount})
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 15, 20].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setQuestionCount(n)}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          questionCount === n
                            ? 'bg-brand-500/20 border-brand-400 text-brand-300'
                            : 'bg-[var(--surface-2)] border-[var(--border-glass)] text-[var(--text-secondary)]'
                        }`}
                      >
                        {n} Qs
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider block mb-1.5">
                    Pick Categories
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {QUICK_CATEGORIES.map((cat) => {
                      const isSel = selectedCats.has(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCat(cat.id)}
                          className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-all border ${
                            isSel
                              ? 'bg-brand-500/20 border-brand-400 text-white font-medium'
                              : 'bg-[var(--surface-2)] border-transparent text-[var(--text-secondary)] opacity-80'
                          }`}
                        >
                          <span>{cat.icon}</span>
                          <span className="truncate">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreateGame}
                  className="btn-primary w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Quiz & Invite Room</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-[var(--text-secondary)]">
                  Enter the 6-digit game PIN announced by the meeting host to join:
                </p>
                <div>
                  <input
                    type="text"
                    value={pinInput}
                    maxLength={6}
                    onChange={(e) => setPinInput(e.target.value.toUpperCase())}
                    placeholder="e.g. 849201"
                    className="w-full text-center tracking-widest text-xl font-mono uppercase py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border-glass)] text-white focus:outline-none focus:border-brand-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleJoinGame}
                  disabled={pinInput.trim().length !== 6}
                  className="btn-primary w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <Play className="w-4 h-4" />
                  <span>Join Game</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── State: LOBBY ─── */}
        {store.status === 'lobby' && (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border-glass)] space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-tertiary)]">
                Game PIN
              </span>
              <div className="text-3xl font-extrabold tracking-wider text-brand-300 font-mono">
                {store.pin}
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    if (store.pin) {
                      navigator.clipboard.writeText(store.pin);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }
                  }}
                  className="px-2.5 py-1 text-xs rounded-md bg-[var(--surface-3)] text-[var(--text-secondary)] hover:text-white"
                >
                  {isCopied ? 'Copied!' : 'Copy PIN'}
                </button>
                <button
                  onClick={() => store.pin && broadcastQuizPin(store.pin)}
                  className="px-2.5 py-1 text-xs rounded-md bg-brand-500/30 text-brand-300 hover:bg-brand-500/40 flex items-center gap-1"
                >
                  <Share2 className="w-3 h-3" />
                  <span>{broadcastSent ? 'Invited!' : 'Invite Callers'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Players ({store.players.length})</span>
                </span>
                <span>Waiting to start…</span>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border-glass)]">
                {store.players.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-[var(--surface-1)] text-xs">
                    <div className="w-6 h-6 rounded-full bg-brand-500/30 flex items-center justify-center font-bold text-[10px] text-brand-300">
                      {p.displayName[0]}
                    </div>
                    <span className="font-medium truncate">{p.displayName}</span>
                    {p.isCurrentPlayer && <span className="text-[10px] text-brand-400 font-semibold">(You)</span>}
                  </div>
                ))}
              </div>
            </div>

            {store.gameId && (
              <button
                type="button"
                onClick={() => store.gameId && startGame(store.gameId)}
                className="btn-primary w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>Start Quiz Now</span>
              </button>
            )}
          </div>
        )}

        {/* ─── State: GENERATING ─── */}
        {store.status === 'generating' && (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
            <p className="text-sm font-semibold">Generating questions…</p>
            <p className="text-xs text-[var(--text-tertiary)]">Fetching verified questions from knowledge bank</p>
          </div>
        )}

        {/* ─── State: ACTIVE (Question in Progress) ─── */}
        {store.status === 'active' && store.currentQuestion && (
          <div className="space-y-3">
            {/* Progress & Countdown */}
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span className="font-semibold text-brand-300">
                Q{store.questionIndex + 1} of {store.totalQuestions}
              </span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[var(--text-tertiary)]">
                  <Users className="w-3 h-3" />
                  {store.answeredCount}/{store.totalPlayers}
                </span>
                <span className={`font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                  timeLeft <= 5 ? 'bg-red-500/20 text-red-400' : 'bg-brand-500/20 text-brand-300'
                }`}>
                  <Clock className="w-3 h-3" />
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-glass)]">
              {store.currentQuestion.imageUrl && (
                <div className="w-full h-28 mb-2 rounded-lg overflow-hidden bg-black/30 flex items-center justify-center">
                  <img
                    src={store.currentQuestion.imageUrl}
                    alt="Question"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              <h3 className="text-sm font-semibold leading-snug">
                {store.currentQuestion.text}
              </h3>
            </div>

            {/* 4 Answer Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {store.currentQuestion.options.map((opt, i) => {
                const meta = OPTION_META[i % OPTION_META.length] ?? { shape: '▲', cls: 'quiz-opt-red' };
                const isSelected = store.selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswer(opt.id)}
                    disabled={!!store.selectedOptionId}
                    className={`quiz-answer-btn ${meta.cls} p-3 rounded-xl flex items-center gap-2 text-left transition-all ${
                      isSelected ? 'ring-2 ring-white scale-98' : ''
                    } ${store.selectedOptionId && !isSelected ? 'opacity-40' : ''}`}
                  >
                    <span className="text-lg font-bold opacity-80">{meta.shape}</span>
                    <span className="text-xs font-semibold leading-tight line-clamp-2">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {store.selectedOptionId && (
              <div className="text-center p-2 rounded-lg bg-brand-500/10 text-brand-300 text-xs font-medium animate-pulse">
                Answer locked in! Waiting for time or reveal…
              </div>
            )}
          </div>
        )}

        {/* ─── State: REVEAL (Answer revealed + Live Leaderboard) ─── */}
        {store.status === 'reveal' && (
          <div className="space-y-3">
            {/* Player result banner */}
            {store.playerResult && (
              <div className={`p-3 rounded-xl flex items-center gap-2.5 ${
                store.playerResult.correct ? 'bg-green-500/15 border border-green-500/30' : 'bg-red-500/15 border border-red-500/30'
              }`}>
                {store.playerResult.correct ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}
                <div className="flex-1 text-xs">
                  <div className="font-bold text-sm">
                    {store.playerResult.correct ? '🎉 Correct!' : '❌ Incorrect'}
                  </div>
                  {store.playerResult.correct && (
                    <div className="text-[var(--text-secondary)]">
                      +{store.playerResult.pointsEarned.toLocaleString()} pts · {store.playerResult.responseMs}ms
                    </div>
                  )}
                </div>
                <button
                  onClick={handleNext}
                  className="btn-primary text-xs px-3 py-1.5 rounded-lg font-bold"
                >
                  {store.questionIndex + 1 >= store.totalQuestions ? 'Final Results →' : 'Next Q →'}
                </button>
              </div>
            )}

            {/* Live Leaderboard */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                <span>Live Leaderboard</span>
              </div>
              <div className="space-y-1 max-h-56 overflow-y-auto">
                {store.leaderboard.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                      p.isCurrentPlayer ? 'bg-brand-500/20 border border-brand-400/40 font-semibold' : 'bg-[var(--surface-2)]'
                    }`}
                  >
                    <span className="w-4 text-center font-bold text-[var(--text-tertiary)]">{p.rank}</span>
                    <div className="w-6 h-6 rounded-full bg-brand-500/30 flex items-center justify-center font-bold text-[10px] text-brand-300">
                      {p.displayName[0]}
                    </div>
                    <span className="flex-1 truncate">{p.displayName}{p.isCurrentPlayer ? ' (You)' : ''}</span>
                    <span className="font-mono font-bold text-brand-300">{p.totalScore.toLocaleString()}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── State: FINISHED (Podium + Results) ─── */}
        {store.status === 'finished' && (
          <div className="space-y-4 text-center py-2">
            <div className="space-y-1">
              <div className="inline-block p-2 rounded-full bg-yellow-400/20 text-yellow-400 mb-1">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold">Quiz Completed!</h3>
              <p className="text-xs text-[var(--text-secondary)]">Great game everyone!</p>
            </div>

            {/* Podium */}
            <div className="flex items-end justify-center gap-2 pt-2">
              {/* 2nd place */}
              {store.leaderboard[1] && (
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-slate-400/30 flex items-center justify-center text-xs font-bold mb-1">
                    🥈
                  </div>
                  <span className="text-[11px] font-semibold truncate max-w-[80px]">
                    {store.leaderboard[1].displayName}
                  </span>
                  <div className="w-full h-14 bg-slate-500/20 rounded-t-lg flex items-center justify-center text-xs font-bold font-mono">
                    {store.leaderboard[1].totalScore}
                  </div>
                </div>
              )}
              {/* 1st place */}
              {store.leaderboard[0] && (
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-yellow-400/30 flex items-center justify-center text-sm font-bold mb-1 ring-2 ring-yellow-400">
                    👑
                  </div>
                  <span className="text-xs font-bold text-yellow-300 truncate max-w-[90px]">
                    {store.leaderboard[0].displayName}
                  </span>
                  <div className="w-full h-20 bg-yellow-500/25 border-t-2 border-yellow-400 rounded-t-lg flex items-center justify-center text-xs font-bold font-mono">
                    {store.leaderboard[0].totalScore}
                  </div>
                </div>
              )}
              {/* 3rd place */}
              {store.leaderboard[2] && (
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-amber-600/30 flex items-center justify-center text-xs font-bold mb-1">
                    🥉
                  </div>
                  <span className="text-[11px] font-semibold truncate max-w-[80px]">
                    {store.leaderboard[2].displayName}
                  </span>
                  <div className="w-full h-10 bg-amber-700/20 rounded-t-lg flex items-center justify-center text-xs font-bold font-mono">
                    {store.leaderboard[2].totalScore}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (store.gameId) endGame(store.gameId);
                  store.reset();
                }}
                className="btn-secondary w-full py-2 rounded-xl text-xs font-semibold"
              >
                Back to Meeting
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
