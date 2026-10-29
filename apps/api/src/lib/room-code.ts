/**
 * Generate a 6-character alphanumeric room code.
 * Avoids ambiguous characters (0, O, I, l) for readability.
 */
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

/**
 * Generate a 6-digit numeric PIN for quiz games.
 */
export function generateGamePin(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
