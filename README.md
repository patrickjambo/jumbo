# Jumbo App

> **Video meetings + live multiplayer quiz games** — one platform, real-time for everyone.

Built from the ground up following the Jumbo App Build Guide (October 2026).

---

## What is Jumbo?

| Feature | Detail |
|---|---|
| 🎥 Video meetings | Multi-user calls, HD video, screen sharing, recording |
| 🎮 Jumbo Quiz | Live quiz games — everyone sees the real-time leaderboard |
| 🔔 Smart noise | Auto-mute background noise, VAD, echo control |
| 📱 PWA | Install on any device, works offline (shell) |

---

## Tech Stack

- **Frontend** — React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, shadcn/ui
- **Video** — LiveKit (open-source WebRTC SFU)
- **Backend** — Node.js, Fastify, Socket.IO
- **Database** — Supabase (Postgres + Auth + Storage)
- **Monorepo** — pnpm workspaces

---

## Setup

### 1. Prerequisites

- Node.js ≥ 22
- pnpm ≥ 12

### 2. Clone and install

```bash
git clone <your-repo-url>
cd jumbo-app
pnpm install
```

### 3. Configure environment

```bash
cp .env.example apps/api/.env
# Fill in your LiveKit and Supabase credentials
```

Required variables (see `.env.example` for all options):
- `LIVEKIT_URL` — your LiveKit Cloud URL or self-hosted URL
- `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` — from LiveKit dashboard
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY` — from Supabase dashboard

### 4. Run locally

```bash
pnpm dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001
- Health check: http://localhost:3001/health

---

## Project Structure

```
jumbo-app/
  apps/
    web/          ← React PWA (Vite + Tailwind)
    api/          ← Fastify REST + Socket.IO quiz engine
  packages/
    shared/       ← TypeScript types, Zod schemas, event names
    questions/    ← question generators + seed bank
  docs/
  .env.example
```

---

## Build Phases

| Phase | Status | Description |
|---|---|---|
| 0 | ✅ Done | Repo scaffold, design system, env config |
| 1 | 🔜 Next | LiveKit video: tokens, join, grid, controls, chat |
| 2 | ⏳ | Noise control, VAD, auto-mute, echo handling |
| 3 | ⏳ | Quiz engine: lobby, timing, scoring, live leaderboard |
| 4 | ⏳ | Question generator: all categories, API caching, fallback |
| 5 | ⏳ | Quiz inside the meeting UI |
| 6 | ⏳ | Recording (client → server-side) |
| 7 | ⏳ | Hardening, load tests, PWA polish |

---

## Hosting (no Docker)

| Service | Where |
|---|---|
| Frontend | Cloudflare Pages / Vercel / Netlify |
| API | Render / Railway (native Node) or VPS + PM2 |
| LiveKit | LiveKit Cloud free tier or self-hosted binary |
| Database | Supabase free tier |
| Recordings | Cloudflare R2 (Phase 6) |

> **Note:** If any free tier cost changes, it will be documented here.

---

## Design

- **Glass morphism** — translucent panels with backdrop blur
- **Dark mode first** — follows device setting
- **Brand** — violet (`hsl(252 65% 50%)`) + cyan accent (`hsl(188 80% 48%)`)
- **Motion** — Framer Motion, 200–350 ms transitions, spring easing
- **Font** — Plus Jakarta Sans (2 weights only)

See the design system at http://localhost:5173/design

---

## Environment Variables

See [`.env.example`](.env.example) for the complete list with documentation.

API secrets **never** leave the server. Clients only receive short-lived LiveKit tokens.
