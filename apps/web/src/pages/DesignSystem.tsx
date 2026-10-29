import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Design System page — shown only in development / Phase 0 review.
 * Shows all colours, typography, buttons, cards, and quiz components.
 */
export default function DesignSystem() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh p-8 max-w-4xl mx-auto">
      <div className="ambient-bg" aria-hidden />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-display-md">Design System</h1>
          <button className="btn-ghost text-sm" onClick={() => navigate('/home')}>
            ← Back to app
          </button>
        </div>

        {/* ── Colors ──────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-[var(--text-secondary)]">Colors</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-[var(--text-tertiary)] mb-2 uppercase tracking-wide">Brand (Violet)</p>
              <div className="flex gap-1 rounded-xl overflow-hidden h-8">
                {['50','100','200','300','400','500','600','700','800','900'].map(w => (
                  <div key={w} className={`flex-1 bg-brand-${w}`} title={`brand-${w}`} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-[var(--text-tertiary)] mb-2 uppercase tracking-wide">Accent (Cyan)</p>
              <div className="flex gap-1 rounded-xl overflow-hidden h-8">
                {['50','100','200','300','400','500'].map(w => (
                  <div key={w} className={`flex-1 bg-accent-${w}`} title={`accent-${w}`} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-[var(--text-tertiary)] mb-2 uppercase tracking-wide">Quiz Answer Colors</p>
              <div className="flex gap-2">
                {['A','B','C','D'].map((l, i) => (
                  <div
                    key={l}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: `var(--quiz-${['a','b','c','d'][i]})` }}
                  >
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Typography ───────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-[var(--text-secondary)]">Typography</h2>
          <div className="space-y-3">
            <p className="text-display-xl">Display XL — Meet. Play. Win.</p>
            <p className="text-display-lg">Display LG — Video meetings + Quiz</p>
            <p className="text-display-md">Display MD — What would you like to do?</p>
            <p className="text-xl font-semibold">Heading XL — Room ABC123</p>
            <p className="text-lg">Body LG — Crystal-clear video meetings with smart noise control</p>
            <p className="text-sm text-[var(--text-secondary)]">Body SM Secondary — 5 participants · 2h ago</p>
            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Label — Recent meetings</p>
            <p className="text-gradient text-3xl font-bold">Gradient text — Jumbo App</p>
          </div>
        </section>

        {/* ── Buttons ──────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-[var(--text-secondary)]">Buttons</h2>
          <div className="flex flex-wrap gap-3 items-center">
            <button className="btn-primary">Primary button</button>
            <button className="btn-primary" disabled>Disabled</button>
            <button className="btn-ghost">Ghost button</button>
            <button className="btn-danger">Leave</button>
            <button className="btn-icon"><span>🎮</span></button>
            <button className="btn-icon active"><span>🎤</span></button>
          </div>
          <div className="mt-3">
            <button className="btn-primary w-full max-w-xs">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Loading state
            </button>
          </div>
        </section>

        {/* ── Cards ────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-[var(--text-secondary)]">Cards</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-6">
              <p className="font-semibold mb-1">Glass Card</p>
              <p className="text-sm text-[var(--text-secondary)]">backdrop-filter: blur(20px)</p>
            </div>
            <div className="glass-card-sm p-5">
              <p className="font-semibold mb-1">Glass Card SM</p>
              <p className="text-sm text-[var(--text-secondary)]">backdrop-filter: blur(12px)</p>
            </div>
          </div>
        </section>

        {/* ── Quiz Answer Buttons ──────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-[var(--text-secondary)]">Quiz Answer Buttons</h2>
          <div className="space-y-3 max-w-md">
            {['option-a','option-b','option-c','option-d'].map((cls, i) => (
              <button key={cls} className={`quiz-answer-btn ${cls}`}>
                <span className="text-xl opacity-70">{['◆','▲','●','■'][i]}</span>
                <span>Answer option {String.fromCharCode(65 + i)}</span>
              </button>
            ))}
          </div>
          <div className="space-y-3 max-w-md mt-3">
            <button className="quiz-answer-btn option-a correct">
              <span className="text-xl opacity-70">◆</span>
              <span>Correct answer</span>
            </button>
            <button className="quiz-answer-btn option-b wrong">
              <span className="text-xl opacity-70">▲</span>
              <span>Wrong answer</span>
            </button>
          </div>
        </section>

        {/* ── Leaderboard ──────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-[var(--text-secondary)]">Leaderboard Row</h2>
          <div className="space-y-2 max-w-sm">
            {[
              { rank: 1, name: 'Alex', score: 4200, isMe: false },
              { rank: 2, name: 'You', score: 3800, isMe: true },
              { rank: 3, name: 'Jordan', score: 3100, isMe: false },
            ].map((e) => (
              <div key={e.name} className={`leaderboard-row ${e.isMe ? 'is-me' : ''}`}>
                <span className="text-sm font-bold text-[var(--text-tertiary)] w-5 text-center">{e.rank}</span>
                <div className="w-8 h-8 rounded-full bg-brand-500/25 flex items-center justify-center text-sm font-bold text-brand-300">{e.name[0]}</div>
                <span className="flex-1 text-sm">{e.name}</span>
                <span className="text-sm font-bold text-brand-300">{e.score.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Skeleton ─────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-[var(--text-secondary)]">Skeleton Loader</h2>
          <div className="space-y-3 max-w-sm">
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        </section>

        {/* ── Connection Pills ──────────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-[var(--text-secondary)]">Connection Pill</h2>
          <div className="flex gap-3">
            <div className="connection-pill connected"><span className="dot" />Connected</div>
            <div className="connection-pill reconnecting"><span className="dot" />Reconnecting</div>
          </div>
        </section>
      </div>
    </div>
  );
}
