import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { GAME_EVENTS, SERVER_EVENTS } from '@jumbo/shared';
import type {
  QuestionShowPayload,
  AnswersProgressPayload,
  QuestionRevealPayload,
  LeaderboardUpdatePayload,
} from '@jumbo/shared';
import { useQuizStore } from '../store';
import { preloadFlagImage, preloadFlagImages } from '../lib/flagPreloader';

const API_URL = (import.meta.env['VITE_API_URL'] as string | undefined) ?? '';

let sharedSocket: Socket | null = null;

function getSocket(): Socket {
  if (!sharedSocket || !sharedSocket.connected) {
    sharedSocket = io(API_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
  }
  return sharedSocket;
}

/**
 * useQuizSocket — manages Socket.IO connection and wires all quiz game events
 * to the Zustand quiz store.
 */
export function useQuizSocket() {
  const socketRef = useRef<Socket | null>(null);
  const store = useQuizStore();
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    // ── Clock sync (ping/pong to compute offset) ─────────────────────────────
    function syncClock() {
      const sent = Date.now();
      socket.emit('clock:ping', { sent }, (serverTime: number) => {
        const received = Date.now();
        const rtt = received - sent;
        const offset = serverTime - (sent + rtt / 2);
        store.setClockOffset(offset);
      });
    }

    // ── Connection events ─────────────────────────────────────────────────────
    socket.on('connect', () => {
      setConnected(true);
      setError(null);
      syncClock();
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('error', (e: { message: string }) => setError(e.message));

    // ── Game events ───────────────────────────────────────────────────────────
    socket.on(SERVER_EVENTS.LOBBY_UPDATE, (payload: { players: Parameters<typeof store.setPlayers>[0] }) => {
      store.setPlayers(payload.players);
    });

    socket.on(SERVER_EVENTS.QUESTION_SHOW, (payload: QuestionShowPayload) => {
      if (payload.question.imageUrl) {
        void preloadFlagImage(payload.question.imageUrl);
      }
      store.showQuestion(
        {
          id: payload.question.id,
          text: payload.question.text,
          imageUrl: payload.question.imageUrl,
          options: payload.question.options,
          timeLimit: payload.timeLimit,
        },
        payload.questionIndex,
        payload.totalQuestions,
        payload.serverStartTime,
      );
    });

    socket.on(SERVER_EVENTS.PREWARM, (payload: { imageUrls: string[] }) => {
      if (Array.isArray(payload?.imageUrls)) {
        void preloadFlagImages(payload.imageUrls);
      }
    });

    socket.on(SERVER_EVENTS.ANSWERS_PROGRESS, (payload: AnswersProgressPayload) => {
      store.setAnsweredCount(payload.answeredCount, payload.totalPlayers);
    });

    socket.on(SERVER_EVENTS.QUESTION_REVEAL, (payload: QuestionRevealPayload) => {
      store.showReveal(
        payload.correctOptionId,
        payload.optionResults,
        payload.playerResult,
      );
    });

    socket.on(SERVER_EVENTS.LEADERBOARD_UPDATE, (payload: LeaderboardUpdatePayload) => {
      store.setLeaderboard(
        payload.entries.map((e) => ({
          id: e.playerId,
          displayName: e.displayName,
          avatarUrl: e.avatarUrl,
          totalScore: e.totalScore,
          rank: e.rank,
          isCurrentPlayer: e.isCurrentPlayer,
        })),
      );
    });

    socket.on(SERVER_EVENTS.GAME_FINISHED, (payload: { leaderboard: Parameters<typeof store.setLeaderboard>[0] }) => {
      store.setLeaderboard(payload.leaderboard);
      store.setStatus('finished');
    });

    socket.on(SERVER_EVENTS.GAME_STATE, (payload: { status: Parameters<typeof store.setStatus>[0]; serverStartTime?: number; remainingMs?: number }) => {
      store.setStatus(payload.status);
      if (payload.serverStartTime !== undefined) {
        store.setServerStartTime(payload.serverStartTime);
      }
      if (payload.remainingMs !== undefined) {
        store.setRemainingMs(payload.remainingMs);
      }
    });

    if (!socket.connected) socket.connect();

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error');
      socket.off(SERVER_EVENTS.LOBBY_UPDATE);
      socket.off(SERVER_EVENTS.QUESTION_SHOW);
      socket.off(SERVER_EVENTS.PREWARM);
      socket.off(SERVER_EVENTS.ANSWERS_PROGRESS);
      socket.off(SERVER_EVENTS.QUESTION_REVEAL);
      socket.off(SERVER_EVENTS.LEADERBOARD_UPDATE);
      socket.off(SERVER_EVENTS.GAME_FINISHED);
      socket.off(SERVER_EVENTS.GAME_STATE);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Actions ───────────────────────────────────────────────────────────────

  function createGame(
    settings: unknown,
    customQuestions?: unknown[],
    onCreated?: (pin: string) => void,
    hostDisplayName?: string,
  ) {
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit(
      GAME_EVENTS.CREATE,
      { settings, customQuestions, hostDisplayName },
      (res: { gameId?: string; pin?: string; error?: string }) => {
        if (!res || !res.pin || !res.gameId || res.error) {
          const err = res?.error || 'Failed to create game. Please check your quiz questions.';
          console.error('Create game error:', err);
          setError(err);
          store.setStatus('idle');
          return;
        }
        store.setGameId(res.gameId);
        store.setPin(res.pin);
        store.setIsHost(true);
        store.setStatus('lobby');
        onCreated?.(res.pin);
      },
    );
  }

  function joinGame(
    pin: string,
    displayName: string,
    cb?: (res: { success: boolean; error?: string; status?: string; gameId?: string }) => void,
  ) {
    const socket = socketRef.current;
    if (!socket) return;
    store.setPin(pin);
    store.setIsHost(false);
    store.setStatus('lobby');
    socket.emit(
      GAME_EVENTS.JOIN,
      { pin, displayName },
      (res?: { success: boolean; error?: string; status?: string; gameId?: string }) => {
        if (res?.gameId) store.setGameId(res.gameId);
        if (res && !res.success) {
          setError(res.error ?? 'Failed to join game');
        }
        cb?.(res ?? { success: true });
      },
    );
  }

  function startGame(gameId: string) {
    if (!store.isHost) return;
    socketRef.current?.emit(GAME_EVENTS.START, { gameId });
    store.setStatus('generating');
  }

  function submitAnswer(gameId: string, questionId: string, optionId: string) {
    store.submitAnswer(optionId);
    socketRef.current?.emit(GAME_EVENTS.ANSWER_SUBMIT, {
      gameId,
      questionId,
      optionId,
      clientTimestamp: Date.now(),
    });
  }

  function pauseGame(gameId: string) {
    if (!store.isHost) return;
    socketRef.current?.emit(GAME_EVENTS.PAUSE, { gameId });
  }

  function resumeGame(gameId: string) {
    if (!store.isHost) return;
    socketRef.current?.emit(GAME_EVENTS.RESUME, { gameId });
  }

  function nextQuestion(gameId: string) {
    if (!store.isHost) return;
    socketRef.current?.emit(GAME_EVENTS.NEXT, { gameId });
  }

  function endGame(gameId: string) {
    if (!store.isHost) return;
    socketRef.current?.emit(GAME_EVENTS.END, { gameId });
  }

  return {
    connected,
    error,
    createGame,
    joinGame,
    startGame,
    submitAnswer,
    pauseGame,
    resumeGame,
    nextQuestion,
    endGame,
  };
}
