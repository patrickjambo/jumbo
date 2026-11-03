import { create } from 'zustand';
import type { LocalParticipant, RemoteParticipant, Room } from 'livekit-client';

// ─── Meeting Store ────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  senderName: string;
  senderId: string;
  text: string;
  ts: number;
  editedAt?: number;   // set when the sender edits the message
  deletedAt?: number;  // set when the sender deletes the message (soft-delete)
  reactions?: Record<string, string[]>; // emoji -> array of senderIds who reacted
}

export interface MeetingState {
  room: Room | any | null;
  localParticipant: LocalParticipant | any | null;
  remoteParticipants: (RemoteParticipant | any)[];
  isMicOn: boolean;
  isCamOn: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  chatMessages: ChatMessage[];
  noiseAlert: string | null;
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
  raisedHands: string[];
  viewMode: 'gallery' | 'speaker';
  activeSpeakerId: string | null;

  setRoom: (room: Room | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setLocalParticipant: (p: LocalParticipant | any | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setRemoteParticipants: (ps: (RemoteParticipant | any)[]) => void;
  setMicOn: (v: boolean) => void;
  setCamOn: (v: boolean) => void;
  setScreenSharing: (v: boolean) => void;
  setRecording: (v: boolean) => void;
  addChatMessage: (msg: ChatMessage) => void;
  editChatMessage: (id: string, newText: string) => void;
  deleteChatMessage: (id: string) => void;
  toggleChatReaction: (messageId: string, emoji: string, senderId: string) => void;
  setNoiseAlert: (msg: string | null) => void;
  setConnectionState: (s: MeetingState['connectionState']) => void;
  setRaisedHands: (ids: string[]) => void;
  toggleRaiseHand: (id: string) => void;
  lowerHand: (id: string) => void;
  setViewMode: (m: 'gallery' | 'speaker') => void;
  setActiveSpeakerId: (id: string | null) => void;
  reset: () => void;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  room: null,
  localParticipant: null,
  remoteParticipants: [],
  isMicOn: true,
  isCamOn: true,
  isScreenSharing: false,
  isRecording: false,
  chatMessages: [],
  noiseAlert: null,
  connectionState: 'disconnected',
  raisedHands: [],
  viewMode: 'gallery',
  activeSpeakerId: null,

  setRoom: (room) => set({ room }),
  setLocalParticipant: (localParticipant) => set({ localParticipant }),
  setRemoteParticipants: (remoteParticipants) => set({ remoteParticipants }),
  setMicOn: (isMicOn) => set({ isMicOn }),
  setCamOn: (isCamOn) => set({ isCamOn }),
  setScreenSharing: (isScreenSharing) => set({ isScreenSharing }),
  setRecording: (isRecording) => set({ isRecording }),
  addChatMessage: (msg) => set((s) => {
    // Deduplicate by ID — prevents double-add when server echoes our optimistic message
    if (s.chatMessages.some((m) => m.id === msg.id)) return s;
    return { chatMessages: [...s.chatMessages, msg] };
  }),
  editChatMessage: (id, newText) => set((s) => ({
    chatMessages: s.chatMessages.map((m) =>
      m.id === id ? { ...m, text: newText, editedAt: Date.now() } : m
    ),
  })),
  deleteChatMessage: (id) => set((s) => ({
    chatMessages: s.chatMessages.map((m) =>
      m.id === id ? { ...m, deletedAt: Date.now() } : m
    ),
  })),
  toggleChatReaction: (messageId, emoji, senderId) => set((s) => ({
    chatMessages: s.chatMessages.map((m) => {
      if (m.id !== messageId) return m;
      const reactions = { ...(m.reactions || {}) };
      const currentUsers = reactions[emoji] || [];
      const hasReacted = currentUsers.includes(senderId);
      if (hasReacted) {
        const filtered = currentUsers.filter((u) => u !== senderId);
        if (filtered.length === 0) {
          delete reactions[emoji];
        } else {
          reactions[emoji] = filtered;
        }
      } else {
        reactions[emoji] = [...currentUsers, senderId];
      }
      return { ...m, reactions };
    }),
  })),
  setNoiseAlert: (noiseAlert) => set({ noiseAlert }),
  setConnectionState: (connectionState) => set({ connectionState }),
  setRaisedHands: (raisedHands) => set({ raisedHands }),
  toggleRaiseHand: (id) =>
    set((s) => ({
      raisedHands: s.raisedHands.includes(id)
        ? s.raisedHands.filter((x) => x !== id)
        : [...s.raisedHands, id],
    })),
  lowerHand: (id) =>
    set((s) => ({
      raisedHands: s.raisedHands.filter((x) => x !== id),
    })),
  setViewMode: (viewMode) => set({ viewMode }),
  setActiveSpeakerId: (activeSpeakerId) => set({ activeSpeakerId }),
  reset: () => set({
    room: null, localParticipant: null, remoteParticipants: [],
    isMicOn: true, isCamOn: true, isScreenSharing: false,
    isRecording: false, chatMessages: [], noiseAlert: null,
    connectionState: 'disconnected',
    raisedHands: [],
    viewMode: 'gallery',
    activeSpeakerId: null,
  }),
}));

// ─── Quiz Store ───────────────────────────────────────────────────────────────

export interface QuizPlayer {
  id: string;
  displayName: string;
  avatarUrl?: string;
  totalScore: number;
  rank?: number;
  previousRank?: number;
  isCurrentPlayer?: boolean;
}

export interface QuizQuestion {
  id: string;
  type?: 'multiple_choice' | 'true_false' | 'puzzle' | 'image_based' | 'numeric';
  text: string;
  imageUrl?: string;
  options: { id: string; text: string }[];
  timeLimit: number;
  points?: number;
}

export interface QuizState {
  gameId: string | null;
  pin: string | null;
  players: QuizPlayer[];
  status: 'idle' | 'lobby' | 'generating' | 'active' | 'paused' | 'reveal' | 'finished';
  currentQuestion: QuizQuestion | null;
  questionIndex: number;
  totalQuestions: number;
  serverStartTime: number;
  remainingMs: number | null;
  answeredCount: number;
  totalPlayers: number;
  selectedOptionId: string | null;
  playerResult: { correct: boolean; pointsEarned: number; responseMs: number } | null;
  correctOptionId: string | null;
  optionResults: { optionId: string; count: number; percentage: number }[];
  leaderboard: QuizPlayer[];
  clockOffset: number; // ms difference between server and client clock
  isHost: boolean;

  setGameId: (id: string) => void;
  setPin: (pin: string) => void;
  setPlayers: (ps: QuizPlayer[]) => void;
  setStatus: (s: QuizState['status']) => void;
  setRemainingMs: (ms: number | null) => void;
  setServerStartTime: (serverStartTime: number) => void;
  showQuestion: (q: QuizQuestion, idx: number, total: number, serverStart: number) => void;
  setAnsweredCount: (n: number, total: number) => void;
  submitAnswer: (optionId: string) => void;
  showReveal: (correctId: string, results: QuizState['optionResults'], playerResult?: QuizState['playerResult']) => void;
  setLeaderboard: (lb: QuizPlayer[]) => void;
  setClockOffset: (offset: number) => void;
  setIsHost: (isHost: boolean) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  gameId: null,
  pin: null,
  players: [],
  status: 'idle',
  currentQuestion: null,
  questionIndex: 0,
  totalQuestions: 0,
  serverStartTime: 0,
  remainingMs: null,
  answeredCount: 0,
  totalPlayers: 0,
  selectedOptionId: null,
  playerResult: null,
  correctOptionId: null,
  optionResults: [],
  leaderboard: [],
  clockOffset: 0,
  isHost: false,

  setGameId: (gameId) => set({ gameId }),
  setPin: (pin) => set({ pin }),
  setPlayers: (players) => set({ players, totalPlayers: players.length }),
  setStatus: (status) => set({ status }),
  setRemainingMs: (remainingMs) => set({ remainingMs }),
  setServerStartTime: (serverStartTime) => set({ serverStartTime }),
  showQuestion: (currentQuestion, questionIndex, totalQuestions, serverStartTime) =>
    set({ currentQuestion, questionIndex, totalQuestions, serverStartTime, remainingMs: null, selectedOptionId: null, playerResult: null, correctOptionId: null, optionResults: [], answeredCount: 0, status: 'active' }),
  setAnsweredCount: (answeredCount, totalPlayers) => set({ answeredCount, totalPlayers }),
  submitAnswer: (selectedOptionId) => set({ selectedOptionId }),
  showReveal: (correctOptionId, optionResults, playerResult) =>
    set({ correctOptionId, optionResults, playerResult: playerResult ?? null, status: 'reveal' }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  setClockOffset: (clockOffset) => set({ clockOffset }),
  setIsHost: (isHost) => set({ isHost }),
  reset: () => set({
    gameId: null, pin: null, players: [], status: 'idle',
    currentQuestion: null, questionIndex: 0, totalQuestions: 0,
    serverStartTime: 0, remainingMs: null, answeredCount: 0, totalPlayers: 0,
    selectedOptionId: null, playerResult: null, correctOptionId: null,
    optionResults: [], leaderboard: [], clockOffset: 0, isHost: false,
  }),
}));
