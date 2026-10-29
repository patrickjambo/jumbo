import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Users, Copy, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useQuizSocket } from '../hooks/useQuizSocket';
import { useQuizStore } from '../store';

export default function QuizLobby() {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  const { startGame } = useQuizSocket();
  const store = useQuizStore();
  const [copied, setCopied] = useState(false);
  const [starting, setStarting] = useState(false);

  function copyPin() {
    void navigator.clipboard.writeText(pin ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleStart() {
    if (!store.gameId) return;
    setStarting(true);
    startGame(store.gameId);
    // Navigate when server emits question:show (via store status change)
    const unsub = useQuizStore.subscribe((s) => {
      if (s.status === 'active') {
        unsub();
        navigate(`/quiz/play/${pin ?? ''}`);
      }
    });
    setTimeout(() => { setStarting(false); }, 10000);
  }

  const joinUrl = `${window.location.origin}/quiz?pin=${pin ?? ''}`;

  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center p-4">
      <div className="ambient-bg" aria-hidden />

      <div className="w-full max-w-lg relative z-10">
        {/* PIN display */}
        <motion.div className="glass-card p-8 mb-4 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-[var(--text-secondary)] font-medium uppercase tracking-wider mb-2">Game PIN</p>
          <div className="flex items-center justify-center gap-3 mb-3">
            <h1 className="text-6xl font-bold tracking-widest text-gradient">{pin}</h1>
            <button id="lobby-copy-pin-btn" onClick={copyPin} className="btn-icon" aria-label="Copy PIN">
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-[var(--text-tertiary)] break-all">{joinUrl}</p>
        </motion.div>

        {/* Player bubbles */}
        <div className="glass-card p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-[var(--text-secondary)]" />
            <span className="text-sm font-semibold text-[var(--text-secondary)]">
              {store.players.length} player{store.players.length !== 1 ? 's' : ''} joined
            </span>
          </div>

          {store.status === 'generating' && (
            <div className="flex items-center gap-3 text-sm text-brand-400 mb-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating questions…
            </div>
          )}

          <div className="flex flex-wrap gap-3 min-h-[60px]">
            <AnimatePresence>
              {store.players.map((p) => (
                <motion.div key={p.id}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex flex-col items-center gap-1.5">
                  <div className="w-12 h-12 rounded-full bg-brand-500/25 border-2 border-brand-500/40 flex items-center justify-center text-lg font-bold text-brand-300">
                    {p.displayName[0]?.toUpperCase()}
                  </div>
                  <span className="text-xs text-[var(--text-secondary)] max-w-[64px] truncate text-center">{p.displayName}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {store.players.length === 0 && (
              <p className="text-sm text-[var(--text-tertiary)]">Waiting for players…</p>
            )}
          </div>
        </div>

        <button id="lobby-start-btn" className="btn-primary w-full text-lg py-4"
          onClick={handleStart}
          disabled={store.players.length === 0 || starting || store.status === 'generating'}>
          {starting || store.status === 'generating' ? (
            <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Starting…</span>
          ) : (
            <><Gamepad2 className="w-6 h-6" />Start game</>
          )}
        </button>

        <button className="mt-3 w-full text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors" onClick={() => navigate('/quiz')}>← Back</button>
      </div>
    </div>
  );
}
