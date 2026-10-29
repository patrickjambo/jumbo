import test, { describe, it, before } from 'node:test';
import assert from 'node:assert';

const API_BASE = 'http://localhost:3001';

describe('API Server & LiveKit Token Endpoints (Spec §1, §6.1, §10)', () => {
  before(async () => {
    for (let i = 0; i < 15; i++) {
      try {
        const res = await fetch(`${API_BASE}/health`);
        if (res.ok) return;
      } catch {
        // wait for server
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  });
  it('GET /health returns 200 and ok status', async () => {
    const res = await fetch(`${API_BASE}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json() as { status: string };
    assert.strictEqual(data.status, 'ok');
  });

  it('POST /api/rooms creates a new meeting room code', async () => {
    const res = await fetch(`${API_BASE}/api/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json() as { code: string; joinUrl: string };
    assert.ok(data.code && data.code.length === 6, 'Room code should be 6 characters');
  });

  it('GET /api/rooms/:code validates room existence', async () => {
    const code = 'ABC123';
    const res = await fetch(`${API_BASE}/api/rooms/${code}`);
    assert.strictEqual(res.status, 200);
    const data = await res.json() as { code: string; exists: boolean };
    assert.strictEqual(data.code, code);
    assert.strictEqual(data.exists, true);
  });

  it('POST /api/token/room issues a valid LiveKit JWT with room permissions', async () => {
    const res = await fetch(`${API_BASE}/api/token/room`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomName: 'test-room',
        participantName: 'TestHost',
        canPublish: true,
        canSubscribe: true,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json() as { token: string; livekitUrl: string };
    assert.ok(data.token, 'Token should be returned');
    assert.ok(data.token.split('.').length === 3, 'Token must be a valid 3-part JWT');
    assert.ok(data.livekitUrl, 'LiveKit URL should be provided');
  });

  it('rejects invalid token request with 400', async () => {
    const res = await fetch(`${API_BASE}/api/token/room`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // missing roomName and participantName
      }),
    });
    assert.strictEqual(res.status, 400);
  });
});
