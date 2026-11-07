import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { wakeUpApi } from './lib/api';
import { prewarmSocket } from './hooks/useQuizSocket';

// Eagerly loaded pages (small, fast)
import Landing from './pages/Landing';
import Home from './pages/Home';

// Lazy-loaded heavy pages (load only when needed)
const PreJoinLobby = lazy(() => import('./pages/PreJoinLobby'));
const MeetingRoom  = lazy(() => import('./pages/MeetingRoom'));
const QuizLauncher = lazy(() => import('./pages/QuizLauncher'));
const QuizLobby    = lazy(() => import('./pages/QuizLobby'));
const QuizGame     = lazy(() => import('./pages/QuizGame'));
const QuizResults  = lazy(() => import('./pages/QuizResults'));
const DesignSystem = lazy(() => import('./pages/DesignSystem'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-dvh">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-bounce"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  // ── Warm up remote API & prefetch heavy JS chunks during idle time ──────
  useEffect(() => {
    // 1. Ping the API server so it's warm before first real request
    wakeUpApi();

    // 2. Pre-warm the Socket.IO connection during idle time
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prewarmSocket, { timeout: 5000 });
    } else {
      setTimeout(prewarmSocket, 2000);
    }

    // 3. Prefetch heavy page chunks so navigation feels instant
    function prefetchChunks() {
      void import('./pages/PreJoinLobby');
      void import('./pages/MeetingRoom');
      void import('./pages/QuizLauncher');
      void import('./pages/QuizLobby');
      void import('./pages/QuizGame');
    }

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prefetchChunks, { timeout: 3000 });
    } else {
      setTimeout(prefetchChunks, 1500);
    }
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/"             element={<Landing />} />
        <Route path="/home"         element={<Home />} />
        <Route path="/join/:code"   element={<PreJoinLobby />} />
        <Route path="/room/:code"   element={<MeetingRoom />} />
        <Route path="/quiz"         element={<QuizLauncher />} />
        <Route path="/quiz/lobby/:pin" element={<QuizLobby />} />
        <Route path="/quiz/play/:pin"  element={<QuizGame />} />
        <Route path="/quiz/results/:pin" element={<QuizResults />} />
        {/* Design system — remove in production */}
        <Route path="/design"       element={<DesignSystem />} />
      </Routes>
    </Suspense>
  );
}
