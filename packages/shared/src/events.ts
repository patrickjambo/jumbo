/**
 * @jumbo/shared — Socket.IO event names
 * Defined once here and imported by both client and server.
 * Never use raw strings for event names — always use these constants.
 */

// ─── Client → Server ─────────────────────────────────────────────────────────
export const GAME_EVENTS = {
  // Game lifecycle
  CREATE: 'game:create',
  JOIN: 'game:join',
  START: 'game:start',
  PAUSE: 'game:pause',
  RESUME: 'game:resume',
  NEXT: 'game:next',
  END: 'game:end',
  KICK: 'game:kick',

  // Player actions
  ANSWER_SUBMIT: 'answer:submit',
} as const;

// ─── Server → Client ─────────────────────────────────────────────────────────
export const SERVER_EVENTS = {
  // Lobby
  LOBBY_UPDATE: 'lobby:update',

  // Question lifecycle
  QUESTION_SHOW: 'question:show',
  ANSWERS_PROGRESS: 'answers:progress',
  QUESTION_REVEAL: 'question:reveal',

  // Leaderboard
  LEADERBOARD_UPDATE: 'leaderboard:update',

  // Game state
  GAME_FINISHED: 'game:finished',
  GAME_STATE: 'game:state',
} as const;

export type GameEventName = (typeof GAME_EVENTS)[keyof typeof GAME_EVENTS];
export type ServerEventName = (typeof SERVER_EVENTS)[keyof typeof SERVER_EVENTS];
