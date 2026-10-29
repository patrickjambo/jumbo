/**
 * useLiveKitToken — fetches a short-lived LiveKit room token from the API.
 * The API secret never leaves the server.
 */
export async function fetchLiveKitToken(
  roomName: string,
  participantName: string,
  participantIdentity?: string,
): Promise<{ token: string; livekitUrl: string }> {
  const res = await fetch('/api/token/room', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomName, participantName, participantIdentity }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' })) as { error: string };
    throw new Error(`Token fetch failed: ${err.error}`);
  }
  return res.json() as Promise<{ token: string; livekitUrl: string }>;
}

/**
 * createRoom — creates a new meeting room and returns its join code.
 */
export async function createRoom(): Promise<{ code: string; joinUrl: string }> {
  const res = await fetch('/api/rooms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error('Failed to create room');
  return res.json() as Promise<{ code: string; joinUrl: string }>;
}

/**
 * checkRoom — checks if a room code exists.
 */
export async function checkRoom(code: string): Promise<boolean> {
  const res = await fetch(`/api/rooms/${code}`);
  if (res.status === 404) return false;
  const data = await res.json() as { exists: boolean };
  return data.exists;
}
