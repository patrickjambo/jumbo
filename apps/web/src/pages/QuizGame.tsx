import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Trophy, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useQuizSocket } from '../hooks/useQuizSocket';
import { useQuizStore } from '../store';
import { useWakeLock } from '../hooks/useWakeLock';

const OPTION_META = [
  { cls: 'option-a', shape: '◆', label: 'A' },
  { cls: 'option-b', shape: '▲', label: 'B' },
  { cls: 'option-c', shape: '●', label: 'C' },
  { cls: 'option-d', shape: '■', label: 'D' },
];

// Animated countdown ring
function CountdownRing({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) {
  const r = 45;
  const circumference = 2 * Math.PI * r;
  const progress = Math.max(0, timeLeft / totalTime);
  const danger = timeLeft <= 5;

  return (
    <div className="relative w-14 h-14">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="hsl(240 16% 12%)" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none"
          stroke={danger ? 'hsl(338 80% 56%)' : 'hsl(252 65% 50%)'}
          strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${danger ? 'text-red-400' : ''}`}>
        {Math.max(0, timeLeft)}
      </span>
    </div>
  );
}

export default function QuizGame() {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  const { submitAnswer, nextQuestion } = useQuizSocket();
  const store = useQuizStore();

  // Client-side countdown (server provides start time + we sync clock)
  const [timeLeft, setTimeLeft] = useState(store.currentQuestion?.timeLimit ?? 20);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  // Keep screen awake during game (Spec §11, §21)
  useWakeLock(true);

  // Wire countdown to server time
  useEffect(() => {
    if (!store.currentQuestion || store.status !== 'active') return;
    clearInterval(intervalRef.current);

    function tick() {
      const elapsed = (Date.now() + store.clockOffset - store.serverStartTime) / 1000;
      const remaining = Math.max(0, (store.currentQuestion?.timeLimit ?? 20) - elapsed);
      setTimeLeft(Math.ceil(remaining));
      if (remaining <= 0) clearInterval(intervalRef.current);
    }

    tick();
    intervalRef.current = setInterval(tick, 250);
    return () => clearInterval(intervalRef.current);
  }, [store.currentQuestion?.id, store.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = useCallback((optId: string) => {
    if (store.selectedOptionId || store.status !== 'active' || !store.gameId || !store.currentQuestion) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(40);
    }
    submitAnswer(store.gameId, store.currentQuestion.id, optId);
  }, [store.selectedOptionId, store.status, store.gameId, store.currentQuestion, submitAnswer]);

  const handleNext = useCallback(() => {
    const isFinished = store.questionIndex + 1 >= store.totalQuestions || useQuizStore.getState().status === 'finished';
    if (isFinished) {
      navigate(`/quiz/results/${pin ?? ''}`);
      return;
    }
    if (store.gameId) nextQuestion(store.gameId);
  }, [store.questionIndex, store.totalQuestions, store.gameId, nextQuestion, navigate, pin]);

  // Waiting state
  if (!store.currentQuestion) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-[var(--text-secondary)]">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>Waiting for the next question…</p>
        </div>
      </div>
    );
  }

  const q = store.currentQuestion;

  return (
    <div className="relative min-h-dvh flex flex-col p-4 max-w-lg mx-auto">
      <div className="ambient-bg" aria-hidden />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-sm text-[var(--text-secondary)] font-medium">
          Q {store.questionIndex + 1}/{store.totalQuestions}
        </span>
        <CountdownRing timeLeft={timeLeft} totalTime={q.timeLimit} />
        <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
          <Users className="w-4 h-4" />
          {store.answeredCount}/{store.totalPlayers}
        </div>
      </div>

      {/* Question */}
      <motion.div className="glass-card p-6 mb-4 relative z-10" key={q.id} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        {q.imageUrl && (
          <img src={q.imageUrl} alt="" className="w-full max-h-40 object-contain rounded-lg mb-4" />
        )}
        <p className="text-lg font-semibold text-center text-balance leading-snug">{q.text}</p>
      </motion.div>

      {/* Answer buttons */}
      <div className="grid grid-cols-1 gap-3 relative z-10 mb-4">
        {q.options.map((opt, i) => {
          const meta = OPTION_META[i]!;
          const isSelected = store.selectedOptionId === opt.id;
          const isCorrect = store.status === 'reveal' && opt.id === store.correctOptionId;
          const isWrong = store.status === 'reveal' && isSelected && !isCorrect;
          const notChosen = store.status === 'reveal' && !isCorrect && !isSelected;

          return (
            <motion.button
              key={opt.id}
              id={`answer-btn-${opt.id}`}
              className={`quiz-answer-btn ${meta.cls} ${store.selectedOptionId ? 'answered' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''} ${notChosen ? 'opacity-50' : ''}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => handleAnswer(opt.id)}
              disabled={!!store.selectedOptionId || store.status !== 'active'}
            >
              <span className="text-xl font-bold opacity-70 flex-shrink-0">{meta.shape}</span>
              <span className="flex-1 text-base">{opt.text}</span>
              {/* Option result bar */}
              {store.status === 'reveal' && store.optionResults.length > 0 && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-black/20 rounded-b-xl overflow-hidden">
                  <div
                    className={`h-full ${isCorrect ? 'bg-green-400' : 'bg-white/30'} transition-all duration-700`}
                    style={{ width: `${(store.optionResults.find((r) => r.optionId === opt.id)?.percentage ?? 0)}%` }}
                  />
                </div>
              )}
              {isCorrect && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />}
              {isWrong && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
            </motion.button>
          );
        })}
      </div>

      {/* Post-reveal: score + leaderboard */}
      <AnimatePresence>
        {store.status === 'reveal' && (
          <motion.div className="glass-card-sm p-4 relative z-10" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            {store.playerResult && (
              <div className={`flex items-center gap-3 mb-3 p-3 rounded-[var(--radius-md)] ${store.playerResult.correct ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
                {store.playerResult.correct
                  ? <CheckCircle className="w-5 h-5 text-green-400" />
                  : <XCircle className="w-5 h-5 text-red-400" />}
                <div>
                  <p className="font-semibold text-sm">{store.playerResult.correct ? '🎉 Correct!' : '❌ Wrong'}</p>
                  {store.playerResult.correct && (
                    <p className="text-xs text-[var(--text-secondary)]">
                      +{store.playerResult.pointsEarned.toLocaleString()} pts · {store.playerResult.responseMs}ms
                    </p>
                  )}
                </div>
                <button id="quiz-next-btn" className="btn-primary text-sm px-4 py-2 ml-auto" onClick={handleNext}>
                  {store.questionIndex + 1 >= store.totalQuestions ? 'Results →' : 'Next →'}
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold">Leaderboard</span>
            </div>
            <div className="space-y-1.5">
              {store.leaderboard.slice(0, 5).map((entry) => (
                <motion.div key={entry.id} layout className={`leaderboard-row ${entry.isCurrentPlayer ? 'is-me' : ''}`}>
                  <span className="text-sm font-bold text-[var(--text-tertiary)] w-5 text-center">{entry.rank}</span>
                  <div className="w-7 h-7 rounded-full bg-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-300">{entry.displayName[0]}</div>
                  <span className="flex-1 text-sm">{entry.displayName}{entry.isCurrentPlayer ? ' (You)' : ''}</span>
                  <span className="text-sm font-bold text-brand-300">{entry.totalScore.toLocaleString()}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Waiting for answer */}
      {store.selectedOptionId && store.status === 'active' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-[var(--text-secondary)] mt-2 relative z-10">
          Answer locked in! Waiting for others… ({store.answeredCount}/{store.totalPlayers})
        </motion.div>
      )}
    </div>
  );
}
