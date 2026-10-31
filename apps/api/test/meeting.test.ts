import test, { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { io as Client, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

describe('Meeting WebRTC Signaling & Room Roster (Socket.IO)', () => {
  let socketA: Socket;
  let socketB: Socket;
  const roomCode = 'TEST99';

  before(async () => {
    socketA = Client(SOCKET_URL, { transports: ['websocket'] });
    socketB = Client(SOCKET_URL, { transports: ['websocket'] });

    await Promise.all([
      new Promise<void>((resolve) => socketA.on('connect', () => resolve())),
      new Promise<void>((resolve) => socketB.on('connect', () => resolve())),
    ]);
  });

  after(() => {
    socketA.disconnect();
    socketB.disconnect();
  });

  it('allows User A to join a meeting room and receive self confirmation', async () => {
    const peersPromise = new Promise<any>((resolve) => {
      socketA.once('meeting:peers', (data) => resolve(data));
    });

    socketA.emit('meeting:join', {
      roomCode,
      participantName: 'Alice',
      participantId: 'alice_01',
      isHost: true,
      isMicOn: true,
      isCamOn: true,
    });

    const data = await peersPromise;
    assert.ok(data);
    assert.strictEqual(Array.isArray(data.peers), true);
    assert.strictEqual(data.peers.length, 0); // Alice is first
    assert.strictEqual(data.self.participantName, 'Alice');
  });

  it('notifies User A when User B joins, and gives User B existing peers', async () => {
    const peerJoinedPromise = new Promise<any>((resolve) => {
      socketA.once('meeting:peer-joined', (data) => resolve(data));
    });

    const bPeersPromise = new Promise<any>((resolve) => {
      socketB.once('meeting:peers', (data) => resolve(data));
    });

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
    assert.strictEqual(bPeers.peers.length, 1);
    assert.strictEqual(bPeers.peers[0].participantName, 'Alice');
  });

  it('relays WebRTC signals (offer / answer / ICE candidate) between peers', async () => {
    const signalPromise = new Promise<any>((resolve) => {
      socketA.once('meeting:signal', (data) => resolve(data));
    });

    socketB.emit('meeting:signal', {
      toSocketId: socketA.id,
      signal: { type: 'offer', sdp: 'fake-webrtc-offer-sdp' },
    });

    const received = await signalPromise;
    assert.strictEqual(received.fromSocketId, socketB.id);
    assert.strictEqual(received.signal.type, 'offer');
    assert.strictEqual(received.signal.sdp, 'fake-webrtc-offer-sdp');
  });

  it('synchronizes microphone and camera toggle states in real time', async () => {
    const mediaPromise = new Promise<any>((resolve) => {
      socketB.once('meeting:media-state', (data) => resolve(data));
    });

    // Alice mutes her microphone
    socketA.emit('meeting:media-state', {
      roomCode,
      isMicOn: false,
      isCamOn: true,
    });

    const mediaState = await mediaPromise;
    assert.strictEqual(mediaState.participantId, 'alice_01');
    assert.strictEqual(mediaState.isMicOn, false);
  });

  it('broadcasts raised hands and in-call chat messages', async () => {
    const handPromise = new Promise<any>((resolve) => {
      socketA.once('meeting:raise-hand', (data) => resolve(data));
    });

    const chatPromise = new Promise<any>((resolve) => {
      socketB.once('meeting:chat', (data) => resolve(data));
    });

    // Bob raises hand
    socketB.emit('meeting:raise-hand', {
      roomCode,
      raised: true,
    });

    // Alice sends chat
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
});
