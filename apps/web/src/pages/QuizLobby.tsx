import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Users, Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuizSocket } from '../hooks/useQuizSocket';
import { useQuizStore } from '../store';
import { AppNavbar } from '../components/AppNavbar';

export default function QuizLobby() {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  const { startGame, joinGame } = useQuizSocket();
  const store = useQuizStore();
  const [copied, setCopied] = useState(false);
  const [starting, setStarting] = useState(false);

  // If page was refreshed or accessed directly with valid 6-digit PIN, join room
  useEffect(() => {
    if (!store.gameId && pin && pin !== 'undefined' && pin.length === 6) {
      const displayName = localStorage.getItem('jumbo-display-name') || 'Player';
      joinGame(pin, displayName);
    }
  }, [pin, store.gameId, joinGame]);

  function copyPin() {
    void navigator.clipboard.writeText(pin ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Auto-navigate all players when game starts
  useEffect(() => {
    if (store.status === 'active') {
      navigate(`/quiz/play/${pin ?? ''}`);
    }
  }, [store.status, navigate, pin]);

  function handleStart() {
    if (!store.gameId) return;
    setStarting(true);
    startGame(store.gameId);
    setTimeout(() => { setStarting(false); }, 10000);
  }

  const isInvalidPin = !pin || pin === 'undefined' || pin.length !== 6;

  if (isInvalidPin) {
    return (
      <div className="relative min-h-dvh flex flex-col overflow-x-hidden pb-8">
        <div className="ambient-bg" aria-hidden />
        <AppNavbar showBack backTo="/quiz" backLabel="Quiz" />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md glass-card p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Invalid Game Session</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              No active game was found with this PIN. Please start or join a game from the Quiz Hub.
            </p>
            <button
              type="button"
              onClick={() => navigate('/quiz')}
              className="btn-primary w-full py-3"
            >
              Return to Quiz Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  const joinUrl = `${window.location.origin}/quiz?pin=${pin ?? ''}`;

  return (
    <div className="relative min-h-dvh flex flex-col overflow-x-hidden pb-8">
      <div className="ambient-bg" aria-hidden />
      <AppNavbar showBack backTo="/quiz" backLabel="Quiz" />

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg relative z-10">
          {/* PIN display */}
          <motion.div
            className="glass-card p-8 mb-4 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-[var(--text-secondary)] font-medium uppercase tracking-wider mb-2">
              Game PIN
            </p>
            <div className="flex items-center justify-center gap-3 mb-3">
              <h1 className="text-6xl font-bold tracking-widest text-gradient select-all">
                {pin}
              </h1>
              <button
                id="lobby-copy-pin-btn"
                onClick={copyPin}
                className="btn-icon"
                aria-label="Copy PIN"
                title="Copy Game PIN"
              >
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] break-all font-mono">
              Share link: {joinUrl}
            </p>
          </motion.div>

          {/* Player bubbles */}
          <div className="glass-card p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-[var(--text-secondary)]" />
              <span className="text-sm font-semibold text-[var(--text-secondary)]">
                {store.players.length} player{store.players.length !== 1 ? 's' : ''} in lobby
              </span>
            </div>

            {store.status === 'generating' && (
              <div className="flex items-center gap-3 text-sm text-brand-400 mb-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                Preparing questions…
              </div>
            )}

            <div className="flex flex-wrap gap-3 min-h-[60px]">
              <AnimatePresence>
                {store.players.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div className="w-12 h-12 rounded-full bg-brand-500/25 border-2 border-brand-500/40 flex items-center justify-center text-lg font-bold text-brand-300">
                      {p.displayName[0]?.toUpperCase()}
                    </div>
                    <span className="text-xs text-[var(--text-secondary)] max-w-[72px] truncate text-center">
                      {p.displayName}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {store.players.length === 0 && (
                <p className="text-sm text-[var(--text-tertiary)]">Waiting for players to enter PIN…</p>
              )}
            </div>
          </div>

          {store.isHost ? (
            <button
              id="lobby-start-btn"
              className="btn-primary w-full text-lg py-4"
              onClick={handleStart}
              disabled={starting || store.status === 'generating'}
            >
              {starting || store.status === 'generating' ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Starting…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Gamepad2 className="w-6 h-6" />
                  Start game
                </span>
              )}
            </button>
          ) : (
            <div className="glass-card-sm p-4 text-center space-y-1.5 border border-brand-500/20">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-brand-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                Waiting for host to start the game…
              </div>
              <p className="text-xs text-[var(--text-tertiary)]">
                The game will automatically begin on your screen when started.
              </p>
            </div>
          )}

          <button
            className="mt-3 w-full text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
            onClick={() => navigate('/quiz')}
          >
            ← Back to Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
