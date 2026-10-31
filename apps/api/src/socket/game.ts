import type { Server, Socket } from 'socket.io';
import {
  GAME_EVENTS, SERVER_EVENTS,
  GameCreatePayloadSchema, GameJoinPayloadSchema, AnswerSubmitPayloadSchema,
  calculatePoints,
  type Question, type GameSettings, type Player,
} from '@jumbo/shared';
import { generateQuestions } from '@jumbo/questions';
import type { QuestionCategory } from '@jumbo/questions';

// ─── In-memory game store (Phase 5 migrates to Redis) ────────────────────────

interface PlayerRecord extends Player {
  socketId: string;
  answeredCurrentQuestion: boolean;
  responseMs: number;
  selectedOptionId: string | null;
}

interface GameRecord {
  id: string;
  pin: string;
  hostSocketId: string;
  status: 'waiting' | 'generating' | 'active' | 'paused' | 'finished';
  settings: GameSettings;
  players: Map<string, PlayerRecord>; // key: socket.id
  questions: Question[];
  customQuestions?: Question[] | undefined;
  currentQuestionIndex: number;
  questionStartTime: number; // server epoch ms
  remainingTimeMs?: number | undefined;
  revealTimeout: ReturnType<typeof setTimeout> | null;
  nextTimeout: ReturnType<typeof setTimeout> | null;
}

const games = new Map<string, GameRecord>();       // gameId → game
const pinToGameId = new Map<string, string>();      // pin → gameId
const socketToGameId = new Map<string, string>();   // socketId → gameId

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generatePin(): string {
  let pin: string;
  do { pin = String(Math.floor(100000 + Math.random() * 900000)); }
  while (pinToGameId.has(pin));
  return pin;
}

function generateId(): string {
  return crypto.randomUUID();
}

function buildLeaderboard(game: GameRecord) {
  const sorted = [...game.players.values()]
    .sort((a, b) => b.totalScore - a.totalScore || a.totalResponseMs - b.totalResponseMs);
  return sorted.map((p, i) => ({
    playerId: p.id,
    displayName: p.displayName,
    avatarUrl: p.avatarUrl,
    totalScore: p.totalScore,
    rank: i + 1,
  }));
}

function stripAnswers(question: Question): Omit<Question, 'options' | 'correctOrder'> & { options: Omit<Question['options'][number], 'isCorrect'>[] } {
  const { correctOrder: _, ...rest } = question;
  let options = question.options.map(({ isCorrect: _, ...opt }) => opt);
  if (question.type === 'puzzle') {
    // Scramble puzzle options so clients receive a random order to unscramble
    options = [...options].sort(() => Math.random() - 0.5);
  }
  return {
    ...rest,
    options,
  };
}

function cleanupGame(gameId: string) {
  const game = games.get(gameId);
  if (!game) return;
  if (game.revealTimeout) clearTimeout(game.revealTimeout);
  if (game.nextTimeout) clearTimeout(game.nextTimeout);
  for (const p of game.players.values()) socketToGameId.delete(p.socketId);
  pinToGameId.delete(game.pin);
  games.delete(gameId);
}

// ─── Question lifecycle ───────────────────────────────────────────────────────

function sendQuestion(io: Server, game: GameRecord) {
  const q = game.questions[game.currentQuestionIndex];
  if (!q) { finishGame(io, game); return; }

  // Reset answered state for this question
  for (const p of game.players.values()) {
    p.answeredCurrentQuestion = false;
    p.responseMs = 0;
    p.selectedOptionId = null;
  }
  game.status = 'active';
  game.questionStartTime = Date.now();
  game.remainingTimeMs = undefined;

  io.to(game.pin).emit(SERVER_EVENTS.QUESTION_SHOW, {
    question: stripAnswers(q),
    questionIndex: game.currentQuestionIndex,
    totalQuestions: game.questions.length,
    serverStartTime: game.questionStartTime,
    timeLimit: q.timeLimit,
  });

  // Auto-reveal after timeLimit + 1s grace
  game.revealTimeout = setTimeout(
    () => revealAnswer(io, game),
    (q.timeLimit + 1) * 1000,
  );
}

function revealAnswer(io: Server, game: GameRecord) {
  if (game.revealTimeout) { clearTimeout(game.revealTimeout); game.revealTimeout = null; }
  const q = game.questions[game.currentQuestionIndex];
  if (!q) return;

  const correctOption = q.options.find((o) => o.isCorrect);
  const correctSequence = q.type === 'puzzle'
    ? (q.correctOrder?.join(',') ?? q.options.map((o) => o.id).join(','))
    : null;
  const targetCorrectId = correctSequence ?? correctOption?.id;
  if (!targetCorrectId) return;

  // Compute option result counts
  const counts = new Map<string, number>();
  for (const opt of q.options) counts.set(opt.id, 0);
  for (const p of game.players.values()) {
    if (p.selectedOptionId) {
      if (q.type === 'puzzle') {
        // Count fully correct sequence
        if (p.selectedOptionId === targetCorrectId) {
          counts.set('puzzle_correct', (counts.get('puzzle_correct') ?? 0) + 1);
        }
      } else {
        counts.set(p.selectedOptionId, (counts.get(p.selectedOptionId) ?? 0) + 1);
      }
    }
  }
  const total = game.players.size || 1;
  const optionResults = q.options.map((opt) => ({
    optionId: opt.id,
    count: counts.get(opt.id) ?? 0,
    percentage: Math.round(((counts.get(opt.id) ?? 0) / total) * 100),
  }));

  // Emit reveal — per-player with their personal result
  for (const [, player] of game.players) {
    const correct = player.selectedOptionId === targetCorrectId;
    const playerResult = {
      correct,
      pointsEarned: player.answeredCurrentQuestion
        ? (correct ? calculatePoints(player.responseMs, q.timeLimit * 1000, player.streak) : 0)
        : 0,
      streakBonus: correct ? Math.min(player.streak * 100, 500) : 0,
      responseMs: player.responseMs,
    };

    const socket = io.sockets.sockets.get(player.socketId);
    socket?.emit(SERVER_EVENTS.QUESTION_REVEAL, {
      correctOptionId: targetCorrectId,
      optionResults,
      playerResult,
    });
  }

  // Emit leaderboard
  const lb = buildLeaderboard(game);
  io.to(game.pin).emit(SERVER_EVENTS.LEADERBOARD_UPDATE, {
    entries: lb,
    questionIndex: game.currentQuestionIndex,
  });

  // Auto-advance after 8s if no host next command
  game.nextTimeout = setTimeout(() => advanceQuestion(io, game), 8000);
}

function advanceQuestion(io: Server, game: GameRecord) {
  if (game.nextTimeout) { clearTimeout(game.nextTimeout); game.nextTimeout = null; }
  game.currentQuestionIndex++;
  if (game.currentQuestionIndex >= game.questions.length) {
    finishGame(io, game);
  } else {
    sendQuestion(io, game);
  }
}

function finishGame(io: Server, game: GameRecord) {
  game.status = 'finished';
  const lb = buildLeaderboard(game);
  io.to(game.pin).emit(SERVER_EVENTS.GAME_FINISHED, { leaderboard: lb });
  // Clean up after 5 minutes
  setTimeout(() => cleanupGame(game.id), 5 * 60_000);
}

// ─── Socket.IO handler registration ──────────────────────────────────────────

export function registerGameHandlers(io: Server) {

  io.on('connection', (socket: Socket) => {

    // ── Clock sync ────────────────────────────────────────────────────────────
    socket.on('clock:ping', (_payload: unknown, ack: (t: number) => void) => {
      if (typeof ack === 'function') ack(Date.now());
    });

    // ── Create game ───────────────────────────────────────────────────────────
    socket.on(GAME_EVENTS.CREATE, async (rawPayload: unknown, ack: (res: { gameId: string; pin: string } | { error: string }) => void) => {
      const parse = GameCreatePayloadSchema.safeParse(rawPayload);
      if (!parse.success) {
        console.error('Game create failed validation:', parse.error.issues);
        const errMsg = parse.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
        ack?.({ error: errMsg });
        return;
      }
      const { settings, hostDisplayName } = parse.data;

      const gameId = generateId();
      const pin = generatePin();

      const game: GameRecord = {
        id: gameId, pin,
        hostSocketId: socket.id,
        status: 'waiting',
        settings,
        customQuestions: parse.data.customQuestions,
        players: new Map(),
        questions: [],
        currentQuestionIndex: 0,
        questionStartTime: 0,
        revealTimeout: null, nextTimeout: null,
      };

      if (hostDisplayName && hostDisplayName.trim()) {
        const player: PlayerRecord = {
          id: socket.id,
          socketId: socket.id,
          displayName: hostDisplayName.trim(),
          avatarUrl: undefined,
          totalScore: 0,
          totalResponseMs: 0,
          streak: 0,
          answeredCurrentQuestion: false,
          responseMs: 0,
          selectedOptionId: null,
        };
        game.players.set(socket.id, player);
      }

      games.set(gameId, game);
      pinToGameId.set(pin, gameId);
      socketToGameId.set(socket.id, gameId);

      await socket.join(pin);
      ack?.({ gameId, pin });

      if (game.players.size > 0) {
        const players = [...game.players.values()].map((p) => ({
          id: p.id,
          displayName: p.displayName,
          avatarUrl: p.avatarUrl,
          totalScore: p.totalScore,
        }));
        io.to(pin).emit(SERVER_EVENTS.LOBBY_UPDATE, { players });
      }
    });

    // ── Join game ─────────────────────────────────────────────────────────────
    socket.on(GAME_EVENTS.JOIN, async (rawPayload: unknown, ack?: (res: { success: boolean; error?: string; status?: string; gameId?: string }) => void) => {
      const parse = GameJoinPayloadSchema.safeParse(rawPayload);
      if (!parse.success) {
        ack?.({ success: false, error: 'Invalid join parameters' });
        return;
      }
      const { pin, displayName, avatarUrl } = parse.data;

      const gameId = pinToGameId.get(pin);
      if (!gameId) {
        socket.emit('error', { message: 'Game not found. Please verify the 6-digit PIN.' });
        ack?.({ success: false, error: 'Game not found. Please verify the 6-digit PIN.' });
        return;
      }
      const game = games.get(gameId);
      if (!game || game.status === 'finished') {
        socket.emit('error', { message: 'This game has already finished.' });
        ack?.({ success: false, error: 'This game has already finished.' });
        return;
      }

      const player: PlayerRecord = {
        id: socket.id,
        socketId: socket.id,
        displayName,
        avatarUrl,
        totalScore: 0,
        totalResponseMs: 0,
        streak: 0,
        answeredCurrentQuestion: false,
        responseMs: 0,
        selectedOptionId: null,
      };
      game.players.set(socket.id, player);
      socketToGameId.set(socket.id, gameId);
      await socket.join(pin);

      // Broadcast lobby update to everyone
      const players = [...game.players.values()].map((p) => ({
        id: p.id,
        displayName: p.displayName,
        avatarUrl: p.avatarUrl,
        totalScore: p.totalScore,
      }));
      io.to(pin).emit(SERVER_EVENTS.LOBBY_UPDATE, { players });

      ack?.({ success: true, status: game.status, gameId });
    });

    // ── Start game ────────────────────────────────────────────────────────────
    socket.on(GAME_EVENTS.START, async (payload: { gameId: string }) => {
      const game = games.get(payload?.gameId);
      if (!game || socket.id !== game.hostSocketId) return;
      if (game.players.size === 0) {
        const player: PlayerRecord = {
          id: socket.id,
          socketId: socket.id,
          displayName: 'Host',
          avatarUrl: undefined,
          totalScore: 0,
          totalResponseMs: 0,
          streak: 0,
          answeredCurrentQuestion: false,
          responseMs: 0,
          selectedOptionId: null,
        };
        game.players.set(socket.id, player);
      }

      game.status = 'generating';
      io.to(game.pin).emit(SERVER_EVENTS.GAME_STATE, { status: 'generating' });

      try {
        if (game.customQuestions && game.customQuestions.length > 0) {
          game.questions = [...game.customQuestions];
        } else {
          game.questions = await generateQuestions(
            game.settings.categories as QuestionCategory[],
            game.settings.questionCount,
          );
        }
      } catch (e) {
        console.error('Question generation failed:', e);
        socket.emit('error', { message: 'Failed to generate questions' });
        game.status = 'waiting';
        io.to(game.pin).emit(SERVER_EVENTS.GAME_STATE, { status: 'waiting' });
        return;
      }

      game.currentQuestionIndex = 0;
      sendQuestion(io, game);
    });

    // ── Submit answer ─────────────────────────────────────────────────────────
    socket.on(GAME_EVENTS.ANSWER_SUBMIT, (rawPayload: unknown) => {
      const parse = AnswerSubmitPayloadSchema.safeParse(rawPayload);
      if (!parse.success) return;
      const { gameId, questionId, optionId } = parse.data;

      const game = games.get(gameId);
      if (!game || game.status !== 'active') return;

      const player = game.players.get(socket.id);
      if (!player || player.answeredCurrentQuestion) return;

      const q = game.questions[game.currentQuestionIndex];
      if (!q || q.id !== questionId) return;

      const responseMs = Date.now() - game.questionStartTime;
      let isCorrect = false;
      if (q.type === 'puzzle') {
        const correctSeq = q.correctOrder?.join(',') ?? q.options.map((o) => o.id).join(',');
        isCorrect = optionId === correctSeq;
      } else {
        isCorrect = q.options.find((o) => o.id === optionId)?.isCorrect === true;
      }

      player.answeredCurrentQuestion = true;
      player.responseMs = responseMs;
      player.selectedOptionId = optionId;

      if (isCorrect) {
        const pts = calculatePoints(responseMs, q.timeLimit * 1000, player.streak);
        player.totalScore += pts;
        player.streak++;
      } else {
        player.streak = 0;
      }
      player.totalResponseMs += responseMs;

      // Broadcast progress
      const answered = [...game.players.values()].filter((p) => p.answeredCurrentQuestion).length;
      io.to(game.pin).emit(SERVER_EVENTS.ANSWERS_PROGRESS, {
        answeredCount: answered,
        totalPlayers: game.players.size,
      });

      // Auto-reveal when everyone has answered
      if (answered >= game.players.size) {
        if (game.revealTimeout) clearTimeout(game.revealTimeout);
        revealAnswer(io, game);
      }
    });

    // ── Pause game (host only) ────────────────────────────────────────────────
    socket.on(GAME_EVENTS.PAUSE, (payload: { gameId: string }) => {
      const game = games.get(payload?.gameId);
      if (!game || socket.id !== game.hostSocketId) return;
      if (game.status !== 'active') return;

      if (game.revealTimeout) {
        clearTimeout(game.revealTimeout);
        game.revealTimeout = null;
      }

      const q = game.questions[game.currentQuestionIndex];
      const totalMs = (q ? q.timeLimit : 20) * 1000;
      const elapsedMs = Date.now() - game.questionStartTime;
      const remainingMs = Math.max(1000, totalMs - elapsedMs);

      game.remainingTimeMs = remainingMs;
      game.status = 'paused';

      io.to(game.pin).emit(SERVER_EVENTS.GAME_STATE, {
        status: 'paused',
        remainingMs,
      });
    });

    // ── Resume game (host only) ───────────────────────────────────────────────
    socket.on(GAME_EVENTS.RESUME, (payload: { gameId: string }) => {
      const game = games.get(payload?.gameId);
      if (!game || socket.id !== game.hostSocketId) return;
      if (game.status !== 'paused') return;

      const q = game.questions[game.currentQuestionIndex];
      const totalMs = (q ? q.timeLimit : 20) * 1000;
      const remainingMs = Math.max(1000, game.remainingTimeMs ?? totalMs);

      game.questionStartTime = Date.now() - (totalMs - remainingMs);
      game.status = 'active';

      game.revealTimeout = setTimeout(
        () => revealAnswer(io, game),
        remainingMs + 500,
      );

      io.to(game.pin).emit(SERVER_EVENTS.GAME_STATE, {
        status: 'active',
        serverStartTime: game.questionStartTime,
        remainingMs,
      });
    });

    // ── Next question (host only) ──────────────────────────────────────────────
    socket.on(GAME_EVENTS.NEXT, (payload: { gameId: string }) => {
      const game = games.get(payload?.gameId);
      if (!game || socket.id !== game.hostSocketId) return;
      advanceQuestion(io, game);
    });

    // ── End game (host only) ──────────────────────────────────────────────────
    socket.on(GAME_EVENTS.END, (payload: { gameId: string }) => {
      const game = games.get(payload?.gameId);
      if (!game || socket.id !== game.hostSocketId) return;
      finishGame(io, game);
    });

    // ── Disconnect ────────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      const gameId = socketToGameId.get(socket.id);
      if (!gameId) return;
      socketToGameId.delete(socket.id);
      const game = games.get(gameId);
      if (!game) return;

      game.players.delete(socket.id);

      if (socket.id === game.hostSocketId) {
        // Host left — end game
        finishGame(io, game);
      } else if (game.status !== 'finished') {
        // Re-broadcast lobby
        const players = [...game.players.values()].map((p) => ({
          id: p.id, displayName: p.displayName, avatarUrl: p.avatarUrl, totalScore: p.totalScore,
        }));
        io.to(game.pin).emit(SERVER_EVENTS.LOBBY_UPDATE, { players });
      }
    });
  });
}
