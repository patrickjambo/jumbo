const API_URL = ((import.meta.env['VITE_API_URL'] as string | undefined) ?? '').replace(/\/+$/, '');

/**
 * wakeUpApi — fires a lightweight ping to warm the Render.com API server.
 * Called once on app load so the first real request (createRoom, fetchToken)
 * never hits a cold-start delay.
 */
export function wakeUpApi(): void {
  if (!API_URL) return;
  fetch(`${API_URL}/health`, { method: 'GET', cache: 'no-store', keepalive: true })
    .catch(() => { /* intentionally silent — we're just warming the dyno */ });
}

/**
 * generateClientRoomCode — fallback 6-char alphanumeric room code
 */
function generateClientRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * fetchLiveKitToken — fetches a short-lived LiveKit room token from the API.
 * The API secret never leaves the server.
 */
export async function fetchLiveKitToken(
  roomName: string,
  participantName: string,
  participantIdentity?: string,
): Promise<{ token: string; livekitUrl: string }> {
  const url = `${API_URL}/api/token/room`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomName, participantName, participantIdentity }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({ error: 'Unknown error' }))) as { error: string };
    throw new Error(`Token fetch failed: ${err.error}`);
  }
  return res.json() as Promise<{ token: string; livekitUrl: string }>;
}

/**
 * createRoom — creates a new meeting room and returns its join code.
 * Falls back to client-generated code if the API server is spinning up or unreachable.
 */
export async function createRoom(): Promise<{ code: string; joinUrl: string }> {
  try {
    const url = `${API_URL}/api/rooms`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (res.ok) {
      const data = (await res.json()) as { code: string; joinUrl: string };
      if (data?.code) return data;
    }
  } catch (err) {
    console.warn('API /api/rooms failed or warming up, using client room code:', err);
  }

  // Resilient fallback: ensure user can always start meeting
  const code = generateClientRoomCode();
  return {
    code,
    joinUrl: `${window.location.origin}/join/${code}`,
  };
}

/**
 * checkRoom — checks if a room code exists.
 */
export async function checkRoom(code: string): Promise<boolean> {
  if (!code || code.length !== 6) return false;
  try {
    const url = `${API_URL}/api/rooms/${code}`;
    const res = await fetch(url);
    if (res.status === 404) return false;
    if (res.ok) {
      const data = (await res.json()) as { exists: boolean };
      return data.exists;
    }
  } catch {
    // If backend is warming up, validate standard 6-character code
    return /^[A-Z0-9]{6}$/i.test(code);
  }
  return /^[A-Z0-9]{6}$/i.test(code);
}
