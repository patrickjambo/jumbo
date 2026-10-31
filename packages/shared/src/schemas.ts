import { z } from 'zod';

// ─── Question & Answer Types ──────────────────────────────────────────────────

export const QuestionTypeSchema = z.enum([
  'multiple_choice',
  'true_false',
  'puzzle',
  'image_based',
  'numeric',
]);
export type QuestionType = z.infer<typeof QuestionTypeSchema>;

export const AnswerOptionSchema = z.object({
  id: z.string(),
  text: z.string().max(1000),
  imageUrl: z.string().optional(),
  isCorrect: z.boolean().optional(), // server-only, stripped before sending to clients
});
export type AnswerOption = z.infer<typeof AnswerOptionSchema>;

export const QuestionSchema = z.object({
  id: z.string(),
  type: QuestionTypeSchema.default('multiple_choice'),
  text: z.string().max(3000),
  imageUrl: z.string().optional(),
  options: z.array(AnswerOptionSchema).min(2).max(10),
  timeLimit: z.number().int().min(5).max(180).default(20),
  category: z.string().default('General'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  source: z.string().optional(),
  points: z.number().int().default(1000),
  correctOrder: z.array(z.string()).optional(), // For puzzle questions (ordered option IDs)
});
export type Question = z.infer<typeof QuestionSchema>;

// ─── Game Settings ────────────────────────────────────────────────────────────

export const LeaderboardVisibilitySchema = z.enum([
  'live',         // default: always visible
  'after_each',   // shown after each question reveal
  'end_only',     // only shown at the end
]);
export type LeaderboardVisibility = z.infer<typeof LeaderboardVisibilitySchema>;

export const GameSettingsSchema = z.object({
  questionCount: z.number().int().min(1).max(200).default(15),
  categories: z.array(z.string()).min(1),
  leaderboardVisibility: LeaderboardVisibilitySchema.default('live'),
  streakBonus: z.boolean().default(true),
  strictMode: z.boolean().default(false),   // lower volume of non-dominant speakers
  soundEffects: z.boolean().default(false), // off by default during meetings
});
export type GameSettings = z.infer<typeof GameSettingsSchema>;

// ─── Player ───────────────────────────────────────────────────────────────────

export const PlayerSchema = z.object({
  id: z.string(),
  displayName: z.string().min(1).max(50),
  avatarUrl: z.string().url().optional(),
  totalScore: z.number().int().default(0),
  totalResponseMs: z.number().int().default(0),
  streak: z.number().int().default(0),
  rank: z.number().int().optional(),
});
export type Player = z.infer<typeof PlayerSchema>;

// ─── Game State ───────────────────────────────────────────────────────────────

export const GameStatusSchema = z.enum([
  'waiting',    // lobby
  'generating', // questions being generated
  'active',     // game running
  'finished',
]);
export type GameStatus = z.infer<typeof GameStatusSchema>;

export const GameStateSchema = z.object({
  id: z.string(),
  pin: z.string().length(6),
  status: GameStatusSchema,
  settings: GameSettingsSchema,
  players: z.array(PlayerSchema),
  currentQuestionIndex: z.number().int().default(0),
  totalQuestions: z.number().int(),
  answeredCount: z.number().int().default(0), // how many have answered current Q
});
export type GameState = z.infer<typeof GameStateSchema>;

// ─── Client → Server Payloads ─────────────────────────────────────────────────

export const GameCreatePayloadSchema = z.object({
  settings: GameSettingsSchema,
  roomId: z.string().optional(), // if launching from a meeting
  customQuestions: z.array(QuestionSchema).optional(),
  hostDisplayName: z.string().optional(),
});
export type GameCreatePayload = z.infer<typeof GameCreatePayloadSchema>;

export const GameJoinPayloadSchema = z.object({
  pin: z.string().length(6),
  displayName: z.string().min(1).max(50),
  avatarUrl: z.string().url().optional(),
});
export type GameJoinPayload = z.infer<typeof GameJoinPayloadSchema>;

export const AnswerSubmitPayloadSchema = z.object({
  gameId: z.string(),
  questionId: z.string(),
  optionId: z.string(),
  clientTimestamp: z.number(), // used only to compute RTT, never trusted for scoring
});
export type AnswerSubmitPayload = z.infer<typeof AnswerSubmitPayloadSchema>;

// ─── Server → Client Payloads ─────────────────────────────────────────────────

export const QuestionShowPayloadSchema = z.object({
  question: QuestionSchema.omit({ options: true }).extend({
    // Options shown without correctIndex
    options: z.array(AnswerOptionSchema),
  }),
  questionIndex: z.number().int(),
  totalQuestions: z.number().int(),
  serverStartTime: z.number(), // Unix ms — used for clock sync
  timeLimit: z.number().int(),
});
export type QuestionShowPayload = z.infer<typeof QuestionShowPayloadSchema>;

export const AnswersProgressPayloadSchema = z.object({
  answeredCount: z.number().int(),
  totalPlayers: z.number().int(),
});
export type AnswersProgressPayload = z.infer<typeof AnswersProgressPayloadSchema>;

export const QuestionRevealPayloadSchema = z.object({
  correctOptionId: z.string(),
  optionResults: z.array(
    z.object({
      optionId: z.string(),
      count: z.number().int(),
      percentage: z.number(),
    }),
  ),
  playerResult: z
    .object({
      correct: z.boolean(),
      pointsEarned: z.number().int(),
      streakBonus: z.number().int(),
      responseMs: z.number().int(),
    })
    .optional(),
});
export type QuestionRevealPayload = z.infer<typeof QuestionRevealPayloadSchema>;

export const LeaderboardEntrySchema = z.object({
  playerId: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().url().optional(),
  totalScore: z.number().int(),
  rank: z.number().int(),
  previousRank: z.number().int().optional(),
  isCurrentPlayer: z.boolean().optional(),
});
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;

export const LeaderboardUpdatePayloadSchema = z.object({
  entries: z.array(LeaderboardEntrySchema),
  questionIndex: z.number().int(),
});
export type LeaderboardUpdatePayload = z.infer<typeof LeaderboardUpdatePayloadSchema>;

// ─── Room (Meeting) ───────────────────────────────────────────────────────────

export const RoomSettingsSchema = z.object({
  maxParticipants: z.number().int().min(2).max(500).default(50),
  muteOnJoin: z.boolean().default(false),        // auto-mute when > 8 participants
  strictTalkMode: z.boolean().default(false),    // lower non-dominant speakers
  noiseControl: z.boolean().default(true),       // auto noise detection/muting
  allowRecording: z.boolean().default(true),
});
export type RoomSettings = z.infer<typeof RoomSettingsSchema>;

// ─── Question Categories ──────────────────────────────────────────────────────

export const QUESTION_CATEGORIES = [
  'flags',
  'countries_capitals',
  'logos_brands',
  'animals',
  'history',
  'geography',
  'science',
  'math_formulas',
  'numbers_logic',
  'religion_culture',
  'mythology',
  'general_knowledge',
] as const;

export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number];

// ─── Scoring ──────────────────────────────────────────────────────────────────

/**
 * Calculate points for a correct answer.
 * IMPORTANT: This is also computed server-side with authoritative timing.
 * Client-side use is only for optimistic UI.
 */
export function calculatePoints(
  responseMs: number,
  timeLimitMs: number,
  streakCount: number,
): number {
  const base = Math.round(1000 * (1 - responseMs / timeLimitMs / 2));
  const streak = Math.min(streakCount * 100, 500);
  return Math.max(0, base) + streak;
}
