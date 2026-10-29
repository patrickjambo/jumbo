import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

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
