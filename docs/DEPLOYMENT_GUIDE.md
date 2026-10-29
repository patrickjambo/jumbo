# Jumbo App — Zero-Docker Production Deployment Guide

This guide provides end-to-end instructions for deploying the **Jumbo App** to production using 100% native Linux processes and managed cloud tiers—**strictly without Docker** (as mandated in Spec §1.2 & §15).

---

## 1. Architecture Overview

| Component | Recommended Production Target | Cost / Tier |
|---|---|---|
| **Web Frontend (`apps/web`)** | Cloudflare Pages / Vercel | Free tier (Unlimited requests) |
| **API Server (`apps/api`)** | Render / Railway / Fly.io or Native Ubuntu VPS (Systemd) | Free / Low-cost native process |
| **Video SFU** | LiveKit Cloud | Free tier (10,000 participant mins/month) |
| **Database & Auth (Optional)** | Supabase | Free tier (PostgreSQL + RLS) |
| **Recordings Storage (Optional)** | Cloudflare R2 / Supabase Storage | Free tier (10 GB free) |

---

## 2. Environment Variables Checklist

### A. Web Application (`apps/web/.env.production`)
```ini
# Production API endpoint (replace with your deployed API URL)
VITE_API_URL=https://api.yourdomain.com

# Production LiveKit Cloud WebSocket URL
VITE_LIVEKIT_URL=wss://your-project.livekit.cloud
```

### B. API Server (`apps/api/.env.production`)
```ini
NODE_ENV=production
PORT=3001
CORS_ORIGINS=https://jumbo.yourdomain.com,https://your-pages-subdomain.pages.dev

# LiveKit Cloud Credentials (from cloud.livekit.io)
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxxxxxxxxx
LIVEKIT_API_SECRET=your_secret_key_at_least_32_characters_long

# Supabase (Optional for persistent games and RLS)
SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_KEY=eyJhbGciOi...

# AI Quiz Generation (Optional)
GEMINI_API_KEY=AIzaSy...
```

---

## 3. Frontend Deployment (Cloudflare Pages)

1. Connect your Git repository in the **Cloudflare Dashboard > Workers & Pages**.
2. Set the build configuration:
   - **Framework Preset**: `Vite`
   - **Root directory**: `apps/web`
   - **Build command**: `pnpm run build`
   - **Build output directory**: `dist`
3. Add Environment Variables:
   - `VITE_API_URL`: `https://api.yourdomain.com`
   - `VITE_LIVEKIT_URL`: `wss://your-project.livekit.cloud`
4. Deploy! Cloudflare Pages provides global edge CDN, automatic HTTPS, and PWA service worker caching.

---

## 4. API Deployment on a Native Linux VPS (Zero Docker)

To run the API on a native Ubuntu/Debian server using `systemd` and Node.js:

### Step 1: Install Node.js 20+ & pnpm
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pnpm
```

### Step 2: Clone & Build Repository
```bash
git clone https://github.com/your-org/jumbo-app.git /var/www/jumbo-app
cd /var/www/jumbo-app
pnpm install --frozen-lockfile
pnpm run build
```

### Step 3: Create Systemd Service (`/etc/systemd/system/jumbo-api.service`)
```ini
[Unit]
Description=Jumbo Fastify API & Socket.IO Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/jumbo-app/apps/api
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=5
EnvironmentFile=/var/www/jumbo-app/apps/api/.env.production
StandardOutput=journal
StandardError=journal
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

### Step 4: Enable and Start Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable jumbo-api
sudo systemctl start jumbo-api
sudo systemctl status jumbo-api
```

---

## 5. Reverse Proxy with Caddy (Automatic HTTPS)

Install Caddy (`sudo apt install -y caddy`) and add the following to `/etc/caddy/Caddyfile`:

```caddy
api.yourdomain.com {
    reverse_proxy localhost:3001 {
        # WebSocket support for Socket.IO
        header_up Host {host}
        header_up X-Real-IP {remote_host}
    }
}
```

Reload Caddy:
```bash
sudo systemctl reload caddy
```
Caddy automatically obtains and renews Let's Encrypt TLS certificates.

---

## 6. LiveKit Cloud Setup

1. Create a free account at [cloud.livekit.io](https://cloud.livekit.io).
2. Create a new project named `jumbo-production`.
3. In **Settings > Keys**, generate an API Key and Secret.
4. Copy:
   - WebSocket URL: `wss://jumbo-production-xxxx.livekit.cloud`
   - API Key: `API...`
   - API Secret: `...`
5. Paste these into your `.env.production` files.
6. The free tier gives 10,000 participant minutes/month and 50 GB of egress.

---

## 7. Supabase Database Deployment

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor > New Query**.
3. Paste the contents of [`apps/api/supabase/migrations/001_init_schema.sql`](file:///home/jambo/Jumbo/jumbo-app/apps/api/supabase/migrations/001_init_schema.sql).
4. Run the query. This sets up all 8 tables, indexes, and Row-Level Security (RLS) policies.
5. In **Project Settings > API**, copy the Project URL, Anon Key, and Service Role Key into `apps/api/.env.production`.

---

## 8. Verification & Health Monitoring

- **API Health Check**:
  ```bash
  curl -i https://api.yourdomain.com/health
  # Response: HTTP/2 200 {"status":"ok","timestamp":"2026-..."}
  ```
- **Socket.IO Ping**:
  ```bash
  curl -i "https://api.yourdomain.com/socket.io/?EIO=4&transport=polling"
  ```
- **Load Testing**:
  Run the automated 100-player stress test against the deployed instance:
  ```bash
  API_URL=https://api.yourdomain.com npx tsx apps/api/scripts/load-test.ts
  ```
