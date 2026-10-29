import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { Server as SocketIOServer } from 'socket.io';
import { tokenRoutes } from './routes/token.js';
import { roomRoutes } from './routes/room.js';
import { registerGameHandlers } from './socket/game.js';
import { env } from './env.js';

// ─── Fastify App ──────────────────────────────────────────────────────────────
const app = Fastify({
  logger: { level: env.NODE_ENV === 'development' ? 'info' : 'warn' },
});

await app.register(helmet, {
  contentSecurityPolicy: false,
});

await app.register(cors, {
  origin: env.CORS_ORIGINS.split(','),
  credentials: true,
});

await app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

// Health check
app.get('/health', async () => ({ status: 'ok', ts: new Date().toISOString() }));

// REST routes
await app.register(tokenRoutes, { prefix: '/api/token' });
await app.register(roomRoutes, { prefix: '/api/rooms' });

// ─── Start server first, then attach Socket.IO ────────────────────────────────
// We must listen first so app.server is the bound HTTP server
await app.listen({ port: env.PORT, host: '0.0.0.0' });

// ─── Socket.IO attaches to the same HTTP server ───────────────────────────────
const io = new SocketIOServer(app.server, {
  cors: {
    origin: env.CORS_ORIGINS.split(','),
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

registerGameHandlers(io);

console.log(`\n🚀 Jumbo API ready → http://localhost:${env.PORT}\n`);
console.log(`📡 Socket.IO listening on the same port\n`);
