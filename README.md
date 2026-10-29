# Jumbo App

> **Video meetings + live multiplayer quiz games** — one platform, real-time for everyone.

Built from the ground up following the **Jumbo App Build Guide (Spec §0–25)**. 100% TypeScript, strict zero-Docker constraint, native Node.js processes, and WCAG 2.2 AA compliant glassmorphic design.

---

## 🌟 Key Features

### 🎥 Video Meetings (`apps/web/src/pages/MeetingRoom.tsx`)
- **LiveKit WebRTC SFU**: Adaptive grid (1–16 tiles), dynacast, and automated bandwidth management.
- **Gallery vs. Speaker View**: Dynamic active-speaker stage toggled via `RoomEvent.ActiveSpeakersChanged`.
- **Host Controls**: Remote mute participants, remote remove/kick, lock meeting room, and **"End Meeting for All"** modal.
- **Raise Hand System**: ✋ Visual indicator, real-time data channel broadcast, host lower-hand control.
- **Connection Quality**: 3-bar signal strength indicators for all participants.
- **Smart Noise Control & VAD**: Web Audio loudness analyser auto-muting background noise with instant Unmute banner.
- **Screen Wake Lock API**: Prevents mobile and tablet screens from dimming during calls.
- **Client-Side Recording**: Native `MediaRecorder` canvas/audio composite exporting `.webm`.
- **Accessible Keyboard Shortcuts**: `M` (mute), `V` (camera), `H` (raise hand), `C` (chat), `P` (participants), `Esc` (close).

### 🎮 Jumbo Quiz Engine (`apps/api/src/socket/game.ts` & `apps/web/src/pages/QuizGame.tsx`)
- **Real-Time Synchronised Leaderboard**: Visible to **everyone simultaneously** during the game.
- **Authoritative Scoring Algorithm (Spec §7.3)**:
  $$\text{Score} = 1000 \times \left(1 - \frac{\text{response\_ms}}{2 \times \text{time\_limit\_ms}}\right) + \text{streak\_bonus}$$
  Tie-breakers prioritize players with lower overall response times.
- **12 Question Categories**: Auto-generator covering Flags, Capitals, Logos, Animals, History, Geography, Science, Math Formulas, Numbers & Logic, Culture, Mythology, and General Knowledge.
- **312-Question Seed Bank (Spec §8.3)**: High-quality curated offline fallback dataset guaranteeing zero downtime.
- **Google Gemini AI Question Generator (Spec §8.2)**: Structured JSON generation via Gemini API with strict Zod validation.
- **Custom Question Builder & CSV Import**: Interactive form for custom question decks and spreadsheet imports.
- **Synthetic Web Audio Effects (Spec §7, §20)**: Procedural audio synthesis for countdown ticks (<5s), lock-in chimes, correct/wrong stingers, and podium fanfare.
- **Keyboard Shortcuts**: `1`-`4` or `A`-`D` to select answer options; `Enter`/`Space` to advance.
- **In-Meeting Integration**: Docked side panel on desktop / overlay on mobile to launch quizzes without leaving video calls.

---

## 🏗️ Monorepo Structure

```
jumbo-app/
├── apps/
│   ├── web/                     # React 18 PWA + Vite + Tailwind CSS + Framer Motion
│   │   ├── public/              # Brand PWA icons (192px, 512px, apple-touch, SVG favicon)
│   │   └── src/
│   │       ├── pages/           # Landing, DesignSystem, Home, PreJoinLobby, MeetingRoom,
│   │       │                    # QuizLauncher, QuizLobby, QuizGame, QuizResults
│   │       ├── components/      # MeetingQuizPanel, VideoTile, ControlsBar, InCallChat
│   │       ├── hooks/           # useQuizSocket, useNoiseControl, useWakeLock
│   │       └── store.ts         # Central Zustand state (meetings, hands, active speaker)
│   └── api/                     # Fastify 5 + Socket.IO 4.8 + LiveKit Server SDK
│       ├── src/
│       │   ├── routes/          # /health, /api/rooms, /api/token/room
│       │   ├── socket/          # Authoritative quiz game engine & live leaderboard
│       │   ├── lib/             # Supabase client helper, room code generator
│       │   └── env.ts           # Zod-validated environment config
│       ├── supabase/            # PostgreSQL schema migration with RLS (Spec §9)
│       ├── test/                # Automated test suite (15/15 tests passing)
│       └── scripts/             # 100-player concurrent load tester
├── packages/
│   ├── shared/                  # Zod schemas, Socket.IO constants, authoritative scoring
│   └── questions/               # 12-category question generator + 312 seed bank + Gemini AI
└── docs/                        # Complete technical guides and manuals
    ├── DEMO_GUIDE.md            # Interactive step-by-step verification manual
    ├── DEPLOYMENT_GUIDE.md      # Zero-Docker production deployment manual
    ├── RECORDING_EGRESS.md      # Non-Docker LiveKit recording egress analysis
    └── SPEC_EXTRACTED.md        # Verbatim 27,877-character specification
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js ≥ 20
- pnpm ≥ 9

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Build All Packages
```bash
pnpm run build
```

### 4. Run Locally
```bash
# Terminal 1 — Start Fastify API (port 3001)
cd apps/api && pnpm run dev

# Terminal 2 — Start Vite Web Client (port 5173)
cd apps/web && pnpm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Living Design Tokens**: [http://localhost:5173/design](http://localhost:5173/design)
- **API Health**: [http://localhost:3001/health](http://localhost:3001/health)

---

## 🧪 Testing & Verification

### Run Automated Unit Test Suite (15/15 Passing)
```bash
cd apps/api && npx tsx --test test/*.test.ts
```
Covers:
- Authoritative scoring formula & tie-breakers
- 312-question seed bank schema compliance
- Question generator duplication & option validation
- API health & LiveKit token issuance

### Run 100-Player WebSocket Stress Test
```bash
cd apps/api && npx tsx scripts/load-test.ts
```
Connects 100 concurrent simulated players, submits answers simultaneously, and verifies sub-300ms broadcast latency.

---

## 🌐 Production Deployment (Zero Docker)

See [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md) for complete instructions:
- **Web**: Cloudflare Pages / Vercel
- **API**: Native Ubuntu VPS (Systemd service) or Render / Railway
- **SFU**: LiveKit Cloud (10,000 free participant minutes/month)
- **Database**: Supabase PostgreSQL with Row-Level Security (`apps/api/supabase/migrations/001_init_schema.sql`)
- **Reverse Proxy**: Caddy with automatic Let's Encrypt SSL
