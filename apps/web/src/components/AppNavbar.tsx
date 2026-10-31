import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Video, Gamepad2, ArrowLeft } from 'lucide-react';

interface AppNavbarProps {
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
}

export function AppNavbar({ showBack, backTo = '/home', backLabel = 'Back' }: AppNavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Meet', path: '/join/new', icon: Video },
    { label: 'Quiz', path: '/quiz', icon: Gamepad2 },
  ];

  const isCurrent = (path: string) => {
    if (path === '/join/new') {
      return location.pathname.startsWith('/join') || location.pathname.startsWith('/room');
    }
    if (path === '/quiz') {
      return location.pathname.startsWith('/quiz');
    }
    return location.pathname === '/home';
  };

  return (
    <header className="relative z-30 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
      {/* Brand logo & optional Back button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {showBack && (
          <button
            onClick={() => navigate(backTo)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-semibold transition-all"
            title={backLabel}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{backLabel}</span>
          </button>
        )}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 group transition-transform active:scale-95"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-violet-500/25 transition-all">
            <Gamepad2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-violet-200 transition-colors">
            Jumbo
          </span>
        </button>
      </div>

      {/* Navigation Buttons for every page */}
      <nav className="flex items-center gap-1 sm:gap-2 p-1 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md shadow-lg">
        {navItems.map((item) => {
          const active = isCurrent(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              id={`nav-link-${item.label.toLowerCase()}`}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                active
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
