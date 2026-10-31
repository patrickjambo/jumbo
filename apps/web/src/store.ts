import { create } from 'zustand';
import type { LocalParticipant, RemoteParticipant, Room } from 'livekit-client';

// ─── Meeting Store ────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  senderName: string;
  senderId: string;
  text: string;
  ts: number;
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
  setLocalParticipant: (p: LocalParticipant | null) => void;
  setRemoteParticipants: (ps: RemoteParticipant[]) => void;
  setMicOn: (v: boolean) => void;
  setCamOn: (v: boolean) => void;
  setScreenSharing: (v: boolean) => void;
  setRecording: (v: boolean) => void;
  addChatMessage: (msg: ChatMessage) => void;
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
  addChatMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
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
  status: 'idle' | 'lobby' | 'generating' | 'active' | 'reveal' | 'finished';
  currentQuestion: QuizQuestion | null;
  questionIndex: number;
  totalQuestions: number;
  serverStartTime: number;
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
  showQuestion: (currentQuestion, questionIndex, totalQuestions, serverStartTime) =>
    set({ currentQuestion, questionIndex, totalQuestions, serverStartTime, selectedOptionId: null, playerResult: null, correctOptionId: null, optionResults: [], answeredCount: 0, status: 'active' }),
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
    serverStartTime: 0, answeredCount: 0, totalPlayers: 0,
    selectedOptionId: null, playerResult: null, correctOptionId: null,
    optionResults: [], leaderboard: [], clockOffset: 0, isHost: false,
  }),
}));
