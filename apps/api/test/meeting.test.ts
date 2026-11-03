import test, { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { io as Client, Socket } from 'socket.io-client';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Server as SocketIOServer } from 'socket.io';
import { registerMeetingHandlers } from '../src/socket/meeting.js';

// ─── Inline test server (no network dependency) ───────────────────────────────
let testServer: ReturnType<typeof Fastify>;
let testIo: SocketIOServer;
let testPort: number;

async function startTestServer() {
  testServer = Fastify({ logger: false });
  await testServer.register(cors, { origin: true });
  await testServer.listen({ port: 0, host: '127.0.0.1' }); // port 0 = OS assigns free port

  const addr = testServer.server.address();
  testPort = typeof addr === 'object' && addr ? addr.port : 3099;

  testIo = new SocketIOServer(testServer.server, {
    cors: { origin: true },
    transports: ['websocket', 'polling'],
  });
  registerMeetingHandlers(testIo);
}

// ─── Helper: wait for a socket event with a timeout ──────────────────────────
function waitFor<T>(socket: Socket, event: string, timeoutMs = 3000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout waiting for "${event}"`)), timeoutMs);
    socket.once(event, (data: T) => { clearTimeout(timer); resolve(data); });
  });
}

function connect(): Socket {
  return Client(`http://127.0.0.1:${testPort}`, { transports: ['websocket'] });
}

describe('Meeting WebRTC Signaling & Room Roster (Socket.IO)', () => {
  let socketA: Socket;
  let socketB: Socket;
  let socketC: Socket;
  const roomCode = `TEST_${Date.now()}`;

  before(async () => {
    await startTestServer();

    socketA = connect();
    socketB = connect();
    socketC = connect();

    await Promise.all([
      waitFor(socketA, 'connect'),
      waitFor(socketB, 'connect'),
      waitFor(socketC, 'connect'),
    ]);
  });

  after(async () => {
    socketA.disconnect();
    socketB.disconnect();
    socketC.disconnect();
    testIo.close();
    await testServer.close();
  });

  // ── 1. Basic join ─────────────────────────────────────────────────────────
  it('allows User A to join and receive empty peer list + self confirmation', async () => {
    const peersPromise = waitFor<{ peers: unknown[]; self: { participantName: string } }>(socketA, 'meeting:peers');

    socketA.emit('meeting:join', {
      roomCode,
      participantName: 'Alice',
      participantId: 'alice_01',
      isHost: true,
      isMicOn: true,
      isCamOn: true,
    });

    const data = await peersPromise;
    assert.ok(data, 'Expected peers data');
    assert.strictEqual(Array.isArray(data.peers), true, 'peers must be array');
    assert.strictEqual(data.peers.length, 0, 'Alice is first — no existing peers');
    assert.strictEqual(data.self.participantName, 'Alice');
  });

  // ── 2. Peer join notification ─────────────────────────────────────────────
  it('notifies existing participants when a new peer joins', async () => {
    const peerJoinedPromise = waitFor<{ participantName: string; participantId: string }>(socketA, 'meeting:peer-joined');
    const bPeersPromise = waitFor<{ peers: Array<{ participantName: string }> }>(socketB, 'meeting:peers');

    socketB.emit('meeting:join', {
      roomCode,
      participantName: 'Bob',
      participantId: 'bob_02',
      isHost: false,
      isMicOn: true,
      isCamOn: true,
    });

    const [peerJoined, bPeers] = await Promise.all([peerJoinedPromise, bPeersPromise]);

    assert.strictEqual(peerJoined.participantName, 'Bob');
    assert.strictEqual(peerJoined.participantId, 'bob_02');
    assert.strictEqual(bPeers.peers.length, 1, 'Bob should see Alice as existing peer');
    assert.strictEqual(bPeers.peers[0]?.participantName, 'Alice');
  });

  // ── 3. WebRTC signal relay ────────────────────────────────────────────────
  it('relays WebRTC signals (offer / answer / ICE candidate) between peers', async () => {
    const signalPromise = waitFor<{ fromSocketId: string; signal: { type: string; sdp: string } }>(socketA, 'meeting:signal');

    socketB.emit('meeting:signal', {
      toSocketId: socketA.id,
      signal: { type: 'offer', sdp: 'fake-webrtc-offer-sdp' },
    });

    const received = await signalPromise;
    assert.strictEqual(received.fromSocketId, socketB.id);
    assert.strictEqual(received.signal.type, 'offer');
    assert.strictEqual(received.signal.sdp, 'fake-webrtc-offer-sdp');
  });

  // ── 4. Media state sync ───────────────────────────────────────────────────
  it('synchronizes microphone and camera toggle states in real time', async () => {
    const mediaPromise = waitFor<{
      participantId: string;
      isMicOn: boolean;
      isCamOn: boolean;
      isScreenSharing: boolean;
    }>(socketB, 'meeting:media-state');

    socketA.emit('meeting:media-state', {
      roomCode,
      isMicOn: false,
      isCamOn: true,
      isScreenSharing: false,
    });

    const mediaState = await mediaPromise;
    assert.strictEqual(mediaState.participantId, 'alice_01');
    assert.strictEqual(mediaState.isMicOn, false, 'mic should be off');
    assert.strictEqual(mediaState.isCamOn, true, 'cam should be on');
    assert.strictEqual(mediaState.isScreenSharing, false, 'screen sharing off');
  });

  // ── 5. Screen-share state sync ────────────────────────────────────────────
  it('broadcasts screen-sharing state changes to all participants', async () => {
    const sharePromise = waitFor<{
      participantId: string;
      isScreenSharing: boolean;
    }>(socketB, 'meeting:media-state');

    socketA.emit('meeting:media-state', {
      roomCode,
      isMicOn: true,
      isCamOn: true,
      isScreenSharing: true,
    });

    const data = await sharePromise;
    assert.strictEqual(data.participantId, 'alice_01');
    assert.strictEqual(data.isScreenSharing, true, 'screen sharing should be on');
  });

  // ── 6. Raised hands + chat ────────────────────────────────────────────────
  it('broadcasts raised hands and in-call chat messages', async () => {
    const handPromise = waitFor<{
      participantId: string;
      raised: boolean;
    }>(socketA, 'meeting:raise-hand');

    const chatPromise = waitFor<{ text: string; senderName: string }>(socketB, 'meeting:chat');

    socketB.emit('meeting:raise-hand', { roomCode, raised: true });

    socketA.emit('meeting:chat', {
      roomCode,
      message: {
        id: 'msg_1',
        senderName: 'Alice',
        senderId: 'alice_01',
        text: 'Hello Bob! Can you see and hear me?',
        ts: Date.now(),
      },
    });

    const [handData, chatData] = await Promise.all([handPromise, chatPromise]);
    assert.strictEqual(handData.participantId, 'bob_02');
    assert.strictEqual(handData.raised, true);
    assert.strictEqual(chatData.text, 'Hello Bob! Can you see and hear me?');
  });

  // ── 7. Duplicate participant deduplication ────────────────────────────────
  it('prevents duplicate participants when the same participantId re-joins', async () => {
    const newRoomCode = `DEDUP_${Date.now()}`;

    // D joins fresh room
    const socketD = connect();
    await waitFor(socketD, 'connect');

    const dPeers1 = waitFor<{ peers: unknown[]; self: { participantId: string } }>(socketD, 'meeting:peers');
    socketD.emit('meeting:join', {
      roomCode: newRoomCode,
      participantName: 'Dave',
      participantId: 'dave_dup',
      isHost: true,
    });
    await dPeers1;

    // E joins the same room
    const socketE = connect();
    await waitFor(socketE, 'connect');

    const ePeers = waitFor<{ peers: Array<{ participantId: string }> }>(socketE, 'meeting:peers');
    socketE.emit('meeting:join', {
      roomCode: newRoomCode,
      participantName: 'Eve',
      participantId: 'eve_01',
      isHost: false,
    });
    const ePeersData = await ePeers;
    assert.strictEqual(ePeersData.peers.length, 1, 'Eve sees only Dave');

    // F connects and tries to join as Dave (same participantId from a "new tab")
    const socketF = connect();
    await waitFor(socketF, 'connect');

    // D's old socket should receive 'meeting:replaced' (optional - depends on timing)
    // F joins room as the same Dave
    const fPeers = waitFor<{ peers: unknown[] }>(socketF, 'meeting:peers');
    socketF.emit('meeting:join', {
      roomCode: newRoomCode,
      participantName: 'Dave',
      participantId: 'dave_dup', // same ID — should evict old Dave socket
      isHost: true,
    });

    const fPeersData = await fPeers;
    // F should see Eve (1 peer), not both Dave copies
    assert.strictEqual(fPeersData.peers.length, 1, 'New Dave session should see 1 peer (Eve), not 2');

    socketD.disconnect();
    socketE.disconnect();
    socketF.disconnect();
  });

  // ── 8. Data relay (quiz invites) ──────────────────────────────────────────
  it('relays binary data payloads to all other room participants', async () => {
    const newRoomCode = `DATA_${Date.now()}`;

    const socketG = connect();
    const socketH = connect();
    await Promise.all([waitFor(socketG, 'connect'), waitFor(socketH, 'connect')]);

    const gPeers = waitFor(socketG, 'meeting:peers');
    socketG.emit('meeting:join', { roomCode: newRoomCode, participantName: 'Grace', participantId: 'grace_01', isHost: true });
    await gPeers;

    const hPeers = waitFor(socketH, 'meeting:peers');
    socketH.emit('meeting:join', { roomCode: newRoomCode, participantName: 'Henry', participantId: 'henry_01', isHost: false });
    await hPeers;

    const hDataPromise = waitFor<{ data: number[] }>(socketH, 'meeting:data');
    const payload = Array.from(new TextEncoder().encode(JSON.stringify({ type: 'quiz_invite', pin: '1234', hostName: 'Grace' })));
    socketG.emit('meeting:data', { roomCode: newRoomCode, data: payload });

    const receivedData = await hDataPromise;
    const decoded = JSON.parse(new TextDecoder().decode(new Uint8Array(receivedData.data))) as { type: string; pin: string };
    assert.strictEqual(decoded.type, 'quiz_invite');
    assert.strictEqual(decoded.pin, '1234');

    socketG.disconnect();
    socketH.disconnect();
  });

  // ── 9. Peer-left cleanup ──────────────────────────────────────────────────
  it('notifies remaining participants when a peer disconnects', async () => {
    const newRoomCode = `LEAVE_${Date.now()}`;

    const socketI = connect();
    const socketJ = connect();
    await Promise.all([waitFor(socketI, 'connect'), waitFor(socketJ, 'connect')]);

    const iPeers = waitFor(socketI, 'meeting:peers');
    socketI.emit('meeting:join', { roomCode: newRoomCode, participantName: 'Iris', participantId: 'iris_01', isHost: true });
    await iPeers;

    const jPeers = waitFor(socketJ, 'meeting:peers');
    socketJ.emit('meeting:join', { roomCode: newRoomCode, participantName: 'Jake', participantId: 'jake_01', isHost: false });
    await jPeers;

    const peerLeftPromise = waitFor<{ participantId: string }>(socketI, 'meeting:peer-left');
    socketJ.disconnect();

    const leftData = await peerLeftPromise;
    assert.strictEqual(leftData.participantId, 'jake_01', 'I should be notified Jake left');

    socketI.disconnect();
  });

  // ── 10. Ping / pong keepalive ─────────────────────────────────────────────
  it('responds to meeting:ping with meeting:pong', async () => {
    const pongPromise = waitFor(socketA, 'meeting:pong');
    socketA.emit('meeting:ping', { roomCode });
    await pongPromise;
    assert.ok(true, 'Received pong');
  });

  // ── 11. Host action: mute ─────────────────────────────────────────────────
  it('host-action mute is broadcast to the room', async () => {
    const hostActionPromise = waitFor<{
      action: string;
      targetParticipantId: string;
    }>(socketB, 'meeting:host-action');

    socketA.emit('meeting:host-action', {
      roomCode,
      action: 'host_mute',
      targetParticipantId: 'bob_02',
    });

    const action = await hostActionPromise;
    assert.strictEqual(action.action, 'host_mute');
    assert.strictEqual(action.targetParticipantId, 'bob_02');
  });

  // ── 12. Signal relay rejects cross-room signals ───────────────────────────
  it('does NOT relay signals between sockets in different rooms', async () => {
    const diffRoomCode = `DIFF_${Date.now()}`;
    const socketK = connect();
    await waitFor(socketK, 'connect');

    const kPeers = waitFor(socketK, 'meeting:peers');
    socketK.emit('meeting:join', { roomCode: diffRoomCode, participantName: 'Karl', participantId: 'karl_01', isHost: true });
    await kPeers;

    let crossRoomSignalReceived = false;
    socketA.once('meeting:signal', () => { crossRoomSignalReceived = true; });

    // K tries to signal A (different room)
    socketK.emit('meeting:signal', {
      toSocketId: socketA.id,
      signal: { type: 'offer', sdp: 'cross-room-attack' },
    });

    // Give it 500ms to arrive (it shouldn't)
    await new Promise<void>((r) => setTimeout(r, 500));
    assert.strictEqual(crossRoomSignalReceived, false, 'Cross-room signal should be blocked');

    socketK.disconnect();
  });

  // ── 13. Emoji Reaction Relay ─────────────────────────────────────────────
  it('relays meeting emoji reactions in real-time to other participants', async () => {
    const reactionPromise = waitFor<{ emoji: string; senderName: string }>(socketB, 'meeting:reaction');

    socketA.emit('meeting:reaction', {
      roomCode,
      reaction: {
        id: 'rx_01',
        emoji: '🔥',
        senderId: 'alice_01',
        senderName: 'Alice',
        ts: Date.now(),
      },
    });

    const received = await reactionPromise;
    assert.strictEqual(received.emoji, '🔥');
    assert.strictEqual(received.senderName, 'Alice');
  });

  // ── 14. Chat Message Reaction Relay ──────────────────────────────────────
  it('relays chat message emoji reactions in real-time to other participants', async () => {
    const chatReactionPromise = waitFor<{ messageId: string; emoji: string; senderId: string }>(socketB, 'meeting:chat-reaction');

    socketA.emit('meeting:chat-reaction', {
      roomCode,
      messageId: 'msg_123',
      emoji: '❤️',
      senderId: 'alice_01',
      senderName: 'Alice',
    });

    const received = await chatReactionPromise;
    assert.strictEqual(received.messageId, 'msg_123');
    assert.strictEqual(received.emoji, '❤️');
    assert.strictEqual(received.senderId, 'alice_01');
  });

  // ── 15. Host action: mute all ─────────────────────────────────────────────
  it('host-action mute all broadcasts to room participants', async () => {
    const hostActionPromise = waitFor<{ action: string; hostName: string }>(socketB, 'meeting:host-action');

    socketA.emit('meeting:host-action', {
      roomCode,
      action: 'host_mute_all',
    });

    const action = await hostActionPromise;
    assert.strictEqual(action.action, 'host_mute_all');
    assert.strictEqual(action.hostName, 'Alice');
  });

  // ── 16. Host action: ask to unmute ────────────────────────────────────────
  it('host-action ask unmute is targeted to the participant', async () => {
    const hostActionPromise = waitFor<{ action: string; targetParticipantId: string; hostName: string }>(socketB, 'meeting:host-action');

    socketA.emit('meeting:host-action', {
      roomCode,
      action: 'host_ask_unmute',
      targetParticipantId: 'bob_02',
    });

    const action = await hostActionPromise;
    assert.strictEqual(action.action, 'host_ask_unmute');
    assert.strictEqual(action.targetParticipantId, 'bob_02');
    assert.strictEqual(action.hostName, 'Alice');
  });

  // ── 17. Host action: remove participant ───────────────────────────────────
  it('host-action remove participant removes them and broadcasts peer-left', async () => {
    const bRemovedPromise = waitFor<{ action: string; targetParticipantId: string }>(socketB, 'meeting:host-action');
    const peerLeftPromise = waitFor<{ participantId: string }>(socketA, 'meeting:peer-left');

    socketA.emit('meeting:host-action', {
      roomCode,
      action: 'host_remove',
      targetParticipantId: 'bob_02',
    });

    const [bAction, peerLeft] = await Promise.all([bRemovedPromise, peerLeftPromise]);
    assert.strictEqual(bAction.action, 'host_remove');
    assert.strictEqual(bAction.targetParticipantId, 'bob_02');
    assert.strictEqual(peerLeft.participantId, 'bob_02');
  });

  // ── 18. Removed participant cannot rejoin ─────────────────────────────────
  it('prevents removed participant from rejoining the meeting', async () => {
    const freshSocket = connect();
    await waitFor(freshSocket, 'connect');

    const blockedPromise = waitFor<{ action: string; reason?: string }>(freshSocket, 'meeting:host-action');

    freshSocket.emit('meeting:join', {
      roomCode,
      participantName: 'Bob',
      participantId: 'bob_02',
      isHost: false,
    });

    const action = await blockedPromise;
    assert.strictEqual(action.action, 'host_remove');
    assert.ok(action.reason?.includes('removed'));

    freshSocket.disconnect();
  });

  // ── 19. Host action: remove all non-host participants ──────────────────────
  it('host-action remove all removes all non-host participants', async () => {
    const bulkRoom = `BULK_${Date.now()}`;
    const hostSocket = connect();
    const guest1 = connect();
    const guest2 = connect();

    await Promise.all([waitFor(hostSocket, 'connect'), waitFor(guest1, 'connect'), waitFor(guest2, 'connect')]);

    // Host joins
    const hostPeers = waitFor(hostSocket, 'meeting:peers');
    hostSocket.emit('meeting:join', { roomCode: bulkRoom, participantName: 'HostUser', participantId: 'host_10', isHost: true });
    await hostPeers;

    // Guests join
    const g1Peers = waitFor(guest1, 'meeting:peers');
    guest1.emit('meeting:join', { roomCode: bulkRoom, participantName: 'Guest1', participantId: 'g1_10' });
    await g1Peers;

    const g2Peers = waitFor(guest2, 'meeting:peers');
    guest2.emit('meeting:join', { roomCode: bulkRoom, participantName: 'Guest2', participantId: 'g2_10' });
    await g2Peers;

    // Both guests should receive host_remove when host triggers remove_all
    const g1Removed = waitFor<{ action: string }>(guest1, 'meeting:host-action');
    const g2Removed = waitFor<{ action: string }>(guest2, 'meeting:host-action');

    hostSocket.emit('meeting:host-action', {
      roomCode: bulkRoom,
      action: 'host_remove_all',
    });

    const [r1, r2] = await Promise.all([g1Removed, g2Removed]);
    assert.strictEqual(r1.action, 'host_remove');
    assert.strictEqual(r2.action, 'host_remove');

    hostSocket.disconnect();
    guest1.disconnect();
    guest2.disconnect();
  });
});
