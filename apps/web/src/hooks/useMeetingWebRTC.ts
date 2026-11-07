import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ConnectionQuality } from 'livekit-client';
import { useMeetingStore } from '../store';

const API_URL = (import.meta.env['VITE_API_URL'] as string | undefined) ?? '';

// ─── ICE Server configuration ─────────────────────────────────────────────────
// TURN server URL can be provided via env for networks that block P2P.
const TURN_URL = (import.meta.env['VITE_TURN_URL'] as string | undefined) ?? '';
const TURN_USER = (import.meta.env['VITE_TURN_USER'] as string | undefined) ?? '';
const TURN_CRED = (import.meta.env['VITE_TURN_CRED'] as string | undefined) ?? '';

function buildIceConfig(): RTCConfiguration {
  const iceServers: RTCIceServer[] = [
    // Multiple STUN servers for better NAT traversal success rate
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    // Free public TURN fallback — covers symmetric NAT and restrictive corporate networks.
    // Replace with your own coturn server for better reliability and privacy.
    {
      urls: ['turn:openrelay.metered.ca:80', 'turn:openrelay.metered.ca:443', 'turns:openrelay.metered.ca:443'],
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ];
  // Custom TURN server (higher priority if provided — placed first so ICE prefers it)
  if (TURN_URL && TURN_USER && TURN_CRED) {
    iceServers.unshift({
      urls: TURN_URL,
      username: TURN_USER,
      credential: TURN_CRED,
    });
  }
  return {
    iceServers,
    iceCandidatePoolSize: 10,
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require',
    iceTransportPolicy: 'all', // try P2P first, fall back to TURN automatically
  };
}

/**
 * Optimizes the SDP for Opus to ensure high-fidelity voice transmission without
 * jitter-buffer time-stretching or speech packet clipping.
 * - useinbandfec=1: in-band FEC recovers dropped packets without delay
 * - usedtx=0: continuous packet transmission avoids silence-suppression clipping
 * - stereo=0;sprop-stereo=0: pure mono prevents phase cancellation / comb filtering
 * - maxaveragebitrate=64000: 64 kbps crystal-clear voice
 * - cbr=1: constant bitrate prevents packet bursts and jitter-buffer expansion
 */
function optimizeAudioSdp(sdp: string): string {
  if (!sdp) return sdp;
  const opusMatch = sdp.match(/a=rtpmap:(\d+)\s+opus\/48000/i);
  if (!opusMatch) return sdp;

  const pt = opusMatch[1];
  const fmtpRegex = new RegExp(`^a=fmtp:${pt}\\s+(.*)$`, 'm');
  const fmtpMatch = sdp.match(fmtpRegex);

  const desiredParams: Record<string, string> = {
    minptime: '10',
    maxptime: '60',
    useinbandfec: '1',
    usedtx: '0',          // never suppress silence — prevents clipping when others speak
    stereo: '0',
    'sprop-stereo': '0',
    cbr: '1',
    maxaveragebitrate: '64000',
    'x-google-min-bitrate': '32000',
    'x-google-max-bitrate': '64000',
  };

  if (fmtpMatch?.[1]) {
    const existingPairs = fmtpMatch[1].split(';').map((s) => s.trim()).filter(Boolean);
    const paramMap: Record<string, string> = {};
    for (const pair of existingPairs) {
      const [k, v] = pair.split('=');
      if (k) paramMap[k.trim()] = v ? v.trim() : '';
    }
    Object.assign(paramMap, desiredParams);
    const newFmtpStr = Object.entries(paramMap)
      .map(([k, v]) => (v ? `${k}=${v}` : k))
      .join(';');
    return sdp.replace(fmtpRegex, `a=fmtp:${pt} ${newFmtpStr}`);
  } else {
    const newFmtpStr = Object.entries(desiredParams)
      .map(([k, v]) => `${k}=${v}`)
      .join(';');
    const rtpmapRegex = new RegExp(`(^a=rtpmap:${pt}\\s+opus\\/48000.*$)`, 'm');
    return sdp.replace(rtpmapRegex, `$1\r\na=fmtp:${pt} ${newFmtpStr}`);
  }
}

/**
 * Apply encoding parameters to video senders for adaptive bitrate.
 * Bitrate scales DOWN as participant count rises so total upload stays manageable.
 *
 * Full mesh bandwidth math (upload per device):
 *   2 people  → 800 kbps ×1  = 800 kbps   ✓
 *   5 people  → 300 kbps ×4  = 1.2 Mbps   ✓
 *   10 people → 150 kbps ×9  = 1.35 Mbps  ✓
 */
async function applyVideoEncodings(
  sender: RTCRtpSender,
  isScreen = false,
  peerCount = 1,
) {
  try {
    const params = sender.getParameters();
    if (!params.encodings || params.encodings.length === 0) {
      params.encodings = [{}];
    }
    const enc = params.encodings[0];
    if (enc) {
      if (isScreen) {
        enc.maxBitrate = 2_500_000;
        enc.maxFramerate = 15;
        enc.networkPriority = 'high';
      } else {
        // Adaptive: drops proportionally with participant count
        // Floor 100 kbps (still a recognisable face), ceiling 800 kbps
        const adaptiveBitrate = Math.max(
          100_000,
          Math.round(800_000 / Math.max(1, peerCount)),
        );
        enc.maxBitrate = adaptiveBitrate;
        // Fewer fps for large groups — saves CPU on encode AND decode
        enc.maxFramerate = peerCount > 6 ? 15 : 30;
        enc.networkPriority = 'medium';
        // Chrome/Edge: degrade resolution before framerate (ScalabilityMode hint)
        try { (enc as any).scalabilityMode = 'L1T2'; } catch { /* ignored */ }
      }
    }
    await sender.setParameters(params);
  } catch {
    // setParameters may not be supported in all browsers — ignore
  }
}

export interface WebRTCParticipant {
  identity: string;
  name: string;
  socketId: string;
  isHost: boolean;
  isLocal: boolean;
  isMicOn: boolean;
  isCamOn: boolean;
  isScreenSharing: boolean;
  stream: MediaStream | null;
  connectionQuality: ConnectionQuality;
  getTrackPublication?: (source: unknown) => unknown;
  on?: (event: string, cb: (arg: unknown) => void) => void;
  off?: (event: string, cb: (arg: unknown) => void) => void;
}

interface PeerInfo {
  participantId: string;
  participantName: string;
  isHost: boolean;
  isMicOn: boolean;
  isCamOn: boolean;
  isScreenSharing: boolean;
  quality: ConnectionQuality;
}

interface UseMeetingWebRTCOptions {
  roomCode: string;
  participantName: string;
  isHost: boolean;
  onQuizInvite?: (invite: { pin: string; hostName: string }) => void;
  onHandAlert?: (alert: string) => void;
  onHostNotice?: (notice: string) => void;
  onRoomLockedChanged?: (locked: boolean) => void;
  onMeetingEnded?: () => void;
  onRemovedByHost?: () => void;
  onScreenShareStarted?: (participantName: string) => void;
  onReaction?: (reaction: { id: string; emoji: string; senderId: string; senderName: string; ts: number }) => void;
  onUnmuteRequested?: () => void;
}

export interface UseMeetingWebRTCReturn {
  localStream: MediaStream | null;
  myIdentity: string;
  toggleMic: () => boolean;
  toggleCam: () => boolean;
  toggleScreenShare: (opts?: { useBackCamera?: boolean }) => Promise<boolean>;
  toggleHand: () => void;
  sendChatMessage: (text: string) => void;
  editChatMessage: (messageId: string, newText: string) => void;
  deleteChatMessage: (messageId: string) => void;
  sendReaction: (emoji: string) => void;
  sendChatReaction: (messageId: string, emoji: string) => void;
  hostMute: (targetParticipantId: string) => void;
  hostAskUnmute: (targetParticipantId: string) => void;
  hostMuteAll: () => void;
  hostRemove: (targetParticipantId: string) => void;
  hostRemoveAll: () => void;
  hostToggleLock: (locked: boolean) => void;
  hostEndMeeting: () => void;
  broadcastData: (data: Uint8Array) => void;
}

export function useMeetingWebRTC({
  roomCode,
  participantName,
  isHost,
  onQuizInvite,
  onHandAlert,
  onHostNotice,
  onRoomLockedChanged,
  onMeetingEnded,
  onRemovedByHost,
  onScreenShareStarted,
  onReaction,
  onUnmuteRequested,
}: UseMeetingWebRTCOptions): UseMeetingWebRTCReturn {
  const socketRef = useRef<Socket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const pendingCandidatesRef = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());
  const peerStreamsRef = useRef<Map<string, MediaStream>>(new Map());
  const peersInfoRef = useRef<Map<string, PeerInfo>>(new Map());
  const iceRestartTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const statsTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartbeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // Stable identity: generate once per session, persist in sessionStorage
  const myIdentityRef = useRef<string>(
    (() => {
      const stored = sessionStorage.getItem('lk-identity');
      // Validate: must be a non-empty string with our expected format
      if (stored && /^user_[a-z0-9]+_[a-z0-9]+$/.test(stored)) return stored;
      const fresh = `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      sessionStorage.setItem('lk-identity', fresh);
      return fresh;
    })()
  );

  // Store volatile callbacks in a ref to avoid invalidating the main lifecycle effect
  const callbacksRef = useRef({
    onQuizInvite,
    onHandAlert,
    onHostNotice,
    onRoomLockedChanged,
    onMeetingEnded,
    onRemovedByHost,
    onScreenShareStarted,
    onReaction,
    onUnmuteRequested,
  });
  useEffect(() => {
    callbacksRef.current = {
      onQuizInvite,
      onHandAlert,
      onHostNotice,
      onRoomLockedChanged,
      onMeetingEnded,
      onRemovedByHost,
      onScreenShareStarted,
      onReaction,
      onUnmuteRequested,
    };
  });

  // ─── Sync remote participants to Zustand ──────────────────────────────────
  const syncRemoteParticipantsToStore = useCallback(() => {
    const list: WebRTCParticipant[] = [];
    peersInfoRef.current.forEach((info, socketId) => {
      const stream = peerStreamsRef.current.get(socketId) ?? null;
      list.push({
        identity: info.participantId,
        name: info.participantName,
        socketId,
        isHost: info.isHost,
        isLocal: false,
        isMicOn: info.isMicOn,
        isCamOn: info.isCamOn,
        isScreenSharing: info.isScreenSharing,
        stream,
        connectionQuality: info.quality,
      });
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useMeetingStore.getState().setRemoteParticipants(list as unknown as import('livekit-client').RemoteParticipant[]);
    // Auto-switch to speaker view if someone starts screen sharing
    const sharer = list.find((p) => p.isScreenSharing);
    if (sharer) {
      const store = useMeetingStore.getState();
      if (store.viewMode !== 'speaker') {
        store.setViewMode('speaker');
        store.setActiveSpeakerId(sharer.identity);
      }
    }
  }, []);

  // ─── Create / Get RTCPeerConnection ──────────────────────────────────────
  const createPeerConnection = useCallback((remoteSocketId: string): RTCPeerConnection => {
    if (peerConnectionsRef.current.has(remoteSocketId)) {
      return peerConnectionsRef.current.get(remoteSocketId)!;
    }

    const pc = new RTCPeerConnection(buildIceConfig());
    peerConnectionsRef.current.set(remoteSocketId, pc);

    // Add local tracks
    const activeStream = screenStreamRef.current || localStreamRef.current;
    if (activeStream) {
      activeStream.getTracks().forEach((track) => {
        try { pc.addTrack(track, activeStream); } catch { /* already added */ }
      });
    }

    // Ensure a video transceiver is negotiated right away (even if camera was initially off or audio-only)
    // so screen sharing or turning camera on later works seamlessly with replaceTrack on mobile & desktop!
    const hasVideoSender = pc.getSenders().some((s) => s.track?.kind === 'video');
    if (!hasVideoSender) {
      try {
        pc.addTransceiver('video', { direction: 'sendrecv' });
      } catch {
        /* ignore */
      }
    }

    // Apply encoding limits to video sender
    const videoSender = pc.getSenders().find((s) => s.track?.kind === 'video');
    if (videoSender) void applyVideoEncodings(videoSender, !!screenStreamRef.current, peerConnectionsRef.current.size);

    // Send ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('meeting:signal', {
          toSocketId: remoteSocketId,
          signal: {
            type: 'candidate',
            candidate: event.candidate.toJSON ? event.candidate.toJSON() : event.candidate,
          },
        });
      }
    };

    // Handle incoming tracks — update stream and immediately sync to store so
    // the UI tile appears / updates as soon as media arrives.
    pc.ontrack = (event) => {
      let stream = peerStreamsRef.current.get(remoteSocketId);
      if (!stream) {
        stream = new MediaStream();
        peerStreamsRef.current.set(remoteSocketId, stream);
      }
      if (event.track) {
        // Replace stale tracks of the same kind to prevent ghost audio/comb-filtering
        const existing = stream.getTracks().filter((t) => t.kind === event.track.kind);
        existing.forEach((t) => { if (t.id !== event.track.id) stream!.removeTrack(t); });
        if (!stream.getTracks().some((t) => t.id === event.track.id)) {
          stream.addTrack(event.track);
        }
        // Re-enable the track if disabled (e.g. after ICE restart)
        event.track.enabled = true;
      }
      // Ensure peersInfoRef has a fallback entry so the participant tile renders
      if (!peersInfoRef.current.has(remoteSocketId)) {
        peersInfoRef.current.set(remoteSocketId, {
          // Use socketId as participantId placeholder until meeting:peer-joined arrives
          participantId: remoteSocketId,
          participantName: 'Participant',
          isHost: false,
          isMicOn: true,
          isCamOn: true,
          isScreenSharing: false,
          quality: ConnectionQuality.Excellent,
        });
      }
      syncRemoteParticipantsToStore();
    };

    // Connection state management + ICE restart
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      console.log(`[WebRTC] Peer ${remoteSocketId} state: ${state}`);

      if (state === 'failed') {
        // Schedule ICE restart after a short delay
        const existing = iceRestartTimersRef.current.get(remoteSocketId);
        if (existing) clearTimeout(existing);

        const timer = setTimeout(async () => {
          iceRestartTimersRef.current.delete(remoteSocketId);
          if (!mountedRef.current) return;
          const currentPc = peerConnectionsRef.current.get(remoteSocketId);
          if (!currentPc || currentPc.connectionState !== 'failed') return;

          console.log(`[WebRTC] Attempting ICE restart for ${remoteSocketId}`);
          try {
            // Notify the remote peer to expect an ice-restart offer
            socketRef.current?.emit('meeting:ice-restart', { toSocketId: remoteSocketId });
            const offer = await currentPc.createOffer({ iceRestart: true });
            const tunedOffer = new RTCSessionDescription({
              type: offer.type,
              sdp: optimizeAudioSdp(offer.sdp || ''),
            });
            await currentPc.setLocalDescription(tunedOffer);
            socketRef.current?.emit('meeting:signal', {
              toSocketId: remoteSocketId,
              signal: { type: 'offer', sdp: tunedOffer },
            });
          } catch (e) {
            console.error('[WebRTC] ICE restart failed', e);
            // Last resort: close and recreate the connection
            currentPc.close();
            peerConnectionsRef.current.delete(remoteSocketId);
            // The peer will re-offer us when they detect our side disappeared
          }
        }, 2000);

        iceRestartTimersRef.current.set(remoteSocketId, timer);
      } else if (state === 'disconnected') {
        // Give it a moment to self-recover before escalating to failed
        console.log(`[WebRTC] Peer ${remoteSocketId} disconnected — waiting for recovery`);
      } else if (state === 'connected') {
        const existing = iceRestartTimersRef.current.get(remoteSocketId);
        if (existing) {
          clearTimeout(existing);
          iceRestartTimersRef.current.delete(remoteSocketId);
        }
      }
    };

    pc.oniceconnectionstatechange = () => {
      const info = peersInfoRef.current.get(remoteSocketId);
      if (!info) return;
      const iceState = pc.iceConnectionState;
      info.quality = iceState === 'connected' || iceState === 'completed'
        ? ConnectionQuality.Excellent
        : iceState === 'checking'
        ? ConnectionQuality.Good
        : ConnectionQuality.Poor;
      syncRemoteParticipantsToStore();
    };

    return pc;
  }, [syncRemoteParticipantsToStore]);

  // ─── Re-apply adaptive encodings to ALL senders when peer count changes ──
  // Called after every join/leave so bitrate budget is always shared correctly.
  const rebalanceEncodings = useCallback(() => {
    const count = peerConnectionsRef.current.size;
    const isScreen = !!screenStreamRef.current;
    peerConnectionsRef.current.forEach((pc) => {
      if (pc.connectionState !== 'connected' && pc.connectionState !== 'connecting') return;
      const videoSender = pc.getSenders().find((s) => s.track?.kind === 'video');
      if (videoSender) void applyVideoEncodings(videoSender, isScreen, count);
    });
  }, []);

  // ─── Collect RTCStats for quality estimation ──────────────────────────────
  const startStatsCollection = useCallback(() => {
    if (statsTimerRef.current) clearInterval(statsTimerRef.current);
    statsTimerRef.current = setInterval(async () => {
      for (const [socketId, pc] of peerConnectionsRef.current) {
        if (pc.connectionState !== 'connected') continue;
        try {
          const stats = await pc.getStats();
          let packetsLost = 0;
          let packetsReceived = 0;
          let jitter = 0;
          stats.forEach((report) => {
            if (report.type === 'inbound-rtp' && report.kind === 'audio') {
              packetsLost += report.packetsLost ?? 0;
              packetsReceived += report.packetsReceived ?? 0;
              jitter = Math.max(jitter, report.jitter ?? 0);
            }
          });
          const total = packetsLost + packetsReceived;
          const lossRate = total > 0 ? packetsLost / total : 0;
          const info = peersInfoRef.current.get(socketId);
          if (info) {
            if (lossRate > 0.1 || jitter > 0.05) {
              info.quality = ConnectionQuality.Poor;
            } else if (lossRate > 0.03 || jitter > 0.02) {
              info.quality = ConnectionQuality.Good;
            } else {
              info.quality = ConnectionQuality.Excellent;
            }
          }
        } catch { /* ignore stats errors */ }
      }
      syncRemoteParticipantsToStore();
    }, 5000);
  }, [syncRemoteParticipantsToStore]);

  // ─── Main lifecycle ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!roomCode || !participantName) return;

    // Use a LOCAL mounted flag so each effect closure has its own independent
    // lifecycle. If we used mountedRef.current (shared), StrictMode's second
    // mount would reset it to true and the first (already-cleaned-up) init()
    // could complete and create a zombie socket — causing the server to evict
    // the real socket and send meeting:replaced → "removed" popup on start.
    let mounted = true;
    mountedRef.current = true;

    async function init() {
      // 1. Acquire local media with maximum browser-level AEC/NS/AGC
      //    These constraints tell the browser's native audio engine to apply
      //    hardware-accelerated echo cancellation, noise suppression, and AGC
      //    BEFORE the audio ever reaches JavaScript — the most effective path.
      //    suppressLocalAudioPlayback and latency are Chrome/Edge extensions cast
      //    via unknown so TypeScript doesn't reject them (they're ignored on other browsers).
      const audioConstraints = {
        echoCancellation: true,          // AEC: removes speaker output from mic signal
        noiseSuppression: true,          // DNS: suppresses background hiss/hum
        autoGainControl: true,           // AGC: normalises speaker loudness
        suppressLocalAudioPlayback: true,// Chrome: prevent local playback echo
        channelCount: 1,                 // mono — no phase cancellation
        sampleRate: 48000,               // Opus native sample rate
        sampleSize: 16,
      } as MediaTrackConstraints;

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user', frameRate: { ideal: 30 } },
          audio: audioConstraints,
        });
      } catch {
        console.warn('[WebRTC] Video unavailable, trying audio-only');
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: audioConstraints,
          });
        } catch (e2) {
          console.warn('[WebRTC] Audio also unavailable, creating silent stream', e2);
          stream = new MediaStream();
        }
      }

      if (!mounted) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      const storeState = useMeetingStore.getState();
      if (!storeState.isCamOn) stream.getVideoTracks().forEach((t) => (t.enabled = false));
      if (!storeState.isMicOn) stream.getAudioTracks().forEach((t) => (t.enabled = false));

      localStreamRef.current = stream;
      setLocalStream(stream);

      // Add local tracks to any already-created peer connections
      peerConnectionsRef.current.forEach((pc) => {
        stream.getTracks().forEach((track) => {
          try { pc.addTrack(track, stream); } catch { /* already added */ }
        });
      });

      // Register local participant in store
      const localP: WebRTCParticipant = {
        identity: myIdentityRef.current,
        name: participantName,
        socketId: 'local',
        isHost,
        isLocal: true,
        isMicOn: storeState.isMicOn,
        isCamOn: storeState.isCamOn,
        isScreenSharing: false,
        stream,
        connectionQuality: ConnectionQuality.Excellent,
      };
      storeState.setLocalParticipant(localP as unknown as import('livekit-client').LocalParticipant);
      storeState.setConnectionState('connecting'); // will flip to 'connected' on socket connect

      // 2. Connect Socket.IO with automatic reconnection
      // API_URL resolution:
      //   Dev:  VITE_API_URL='http://localhost:3001' (or empty → Vite proxy handles /socket.io)
      //   Prod: VITE_API_URL='https://jumbo-api.onrender.com' (set as Vercel env var)
      //   If VITE_API_URL is unset in production the socket will try to connect
      //   to the Vercel domain which only serves static files — signals will fail.
      const socketUrl = API_URL || (import.meta.env.DEV ? '' : window.location.origin);
      if (!API_URL && !import.meta.env.DEV) {
        console.warn(
          '[Meeting] VITE_API_URL is not set! Set it to your API server URL ' +
          '(e.g. https://jumbo-api.onrender.com) in your Vercel environment variables.'
        );
      }
      const socket = io(socketUrl, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 8000,
        randomizationFactor: 0.5,
        // forceNew: each effect closure gets its own socket.
        // Without this, StrictMode's second mount may reuse the socket that was
        // just disconnected by the first mount's cleanup, causing event handler
        // leaks and missed messages.
        forceNew: true,
      });
      socketRef.current = socket;

      function joinRoom() {
        const curStore = useMeetingStore.getState();
        socket.emit('meeting:join', {
          roomCode,
          participantName,
          participantId: myIdentityRef.current,
          isHost,
          isMicOn: curStore.isMicOn,
          isCamOn: curStore.isCamOn,
        });
      }

      socket.on('connect', () => {
        console.log('[Socket] Connected:', socket.id);
        useMeetingStore.getState().setConnectionState('connected');
        joinRoom();
      });

      socket.on('disconnect', (reason) => {
        console.log('[Socket] Disconnected:', reason);
        useMeetingStore.getState().setConnectionState('reconnecting');
      });

      socket.on('reconnect', () => {
        console.log('[Socket] Reconnected');
        // Close stale peer connections — peers will re-offer us after we re-appear.
        peerConnectionsRef.current.forEach((pc) => pc.close());
        peerConnectionsRef.current.clear();
        peerStreamsRef.current.clear();
        pendingCandidatesRef.current.clear();
        iceRestartTimersRef.current.forEach((t) => clearTimeout(t));
        iceRestartTimersRef.current.clear();
        // Keep peersInfoRef so we can re-use names/states when peers re-connect
        useMeetingStore.getState().setConnectionState('connected');
        // DO NOT call joinRoom() here — the 'connect' event fires automatically
        // on reconnect and already calls joinRoom(). Calling it twice causes a
        // second meeting:join which can trigger duplicate-participant eviction.
      });

      socket.on('reconnect_attempt', () => {
        useMeetingStore.getState().setConnectionState('reconnecting');
      });

      // Server told us we were replaced (duplicate session from another tab/device)
      socket.on('meeting:replaced', (payload: { reason: string }) => {
        console.warn('[Socket] Session replaced:', payload.reason);
        // Only act if this socket is still the active one for this component mount.
        // StrictMode can create two sockets briefly; the first is always evicted by
        // the server when the second joins. We only want to show the UI callback for
        // a *real* replacement (user opened a second tab), not the StrictMode one.
        if (!mounted) return; // Ignore events from the zombie first-mount socket
        callbacksRef.current.onRemovedByHost?.();
      });

      // Existing peers when we join — register info then send ALL offers in parallel
      socket.on('meeting:peers', (data: {
        peers: Array<{
          socketId: string;
          participantId: string;
          participantName: string;
          isHost: boolean;
          isMicOn: boolean;
          isCamOn: boolean;
          isScreenSharing: boolean;
        }>;
        self?: { participantId: string; isHost: boolean };
      }) => {
        if (!mounted) return;

        // 1. Register all peers before initiating any negotiation
        for (const peer of data.peers) {
          peersInfoRef.current.set(peer.socketId, {
            participantId: peer.participantId,
            participantName: peer.participantName,
            isHost: peer.isHost,
            isMicOn: peer.isMicOn,
            isCamOn: peer.isCamOn,
            isScreenSharing: peer.isScreenSharing ?? false,
            quality: ConnectionQuality.Excellent,
          });
        }
        if (data.self?.isHost) {
          const cur = useMeetingStore.getState().localParticipant;
          if (cur && !cur.isHost) {
            useMeetingStore.getState().setLocalParticipant({ ...cur, isHost: true } as unknown as import('livekit-client').LocalParticipant);
          }
        }
        // Show participants immediately (even before media streams arrive)
        syncRemoteParticipantsToStore();

        // 2. Send offers to ALL existing peers in parallel (not sequentially)
        //    We are always the "impolite" peer (we joined late), so we offer first.
        const offerPromises = data.peers.map(async (peer) => {
          if (!mounted) return;
          const pc = createPeerConnection(peer.socketId);
          try {
            const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
            if (!mounted) return; // guard after async gap
            const tunedOffer = new RTCSessionDescription({
              type: offer.type,
              sdp: optimizeAudioSdp(offer.sdp || ''),
            });
            await pc.setLocalDescription(tunedOffer);
            if (!mounted) return;
            socket.emit('meeting:signal', {
              toSocketId: peer.socketId,
              signal: { type: 'offer', sdp: tunedOffer },
            });
          } catch (e) {
            console.error('[WebRTC] Failed to create offer for peer', peer.socketId, e);
          }
        });

        // Fire-and-forget — errors already logged above
        void Promise.allSettled(offerPromises);
      });

      // New peer joined after us — pre-create the RTCPeerConnection so it is
      // ready before their offer signal arrives (avoids any timing gap).
      socket.on('meeting:peer-joined', (peer: {
        socketId: string;
        participantId: string;
        participantName: string;
        isHost: boolean;
        isMicOn: boolean;
        isCamOn: boolean;
        isScreenSharing: boolean;
      }) => {
        if (!mounted) return;
        peersInfoRef.current.set(peer.socketId, {
          participantId: peer.participantId,
          participantName: peer.participantName,
          isHost: peer.isHost,
          isMicOn: peer.isMicOn,
          isCamOn: peer.isCamOn,
          isScreenSharing: peer.isScreenSharing ?? false,
          quality: ConnectionQuality.Excellent,
        });
        // Pre-warm the RTCPeerConnection — local tracks are added inside createPeerConnection.
        // When the newcomer's offer arrives via meeting:signal we can process it immediately.
        createPeerConnection(peer.socketId);
        syncRemoteParticipantsToStore();
        // Rebalance bitrate budget — lower quality per-connection as group grows
        rebalanceEncodings();
      });

      // Peer reconnected with new socket — update mapping
      socket.on('meeting:peer-reconnected', (payload: { participantId: string; socketId: string }) => {
        if (!mounted) return;
        // Find old entry by participantId
        for (const [oldSid, info] of peersInfoRef.current) {
          if (info.participantId === payload.participantId && oldSid !== payload.socketId) {
            // Close old PC
            const oldPc = peerConnectionsRef.current.get(oldSid);
            if (oldPc) { oldPc.close(); peerConnectionsRef.current.delete(oldSid); }
            peerStreamsRef.current.delete(oldSid);
            pendingCandidatesRef.current.delete(oldSid);
            // Move info to new socketId
            peersInfoRef.current.set(payload.socketId, info);
            peersInfoRef.current.delete(oldSid);
            break;
          }
        }
        syncRemoteParticipantsToStore();
      });

      // WebRTC Signal received (offer / answer / ICE candidate)
      socket.on('meeting:signal', async (data: {
        fromSocketId: string;
        signal: { type: string; sdp?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit };
      }) => {
        if (!mounted) return;
        const { fromSocketId, signal } = data;
        if (!fromSocketId || !signal) return;

        const pc = createPeerConnection(fromSocketId);

        if (signal.type === 'offer') {
          try {
            // Perfect negotiation: detect glare via signalingState
            const isColliding = pc.signalingState !== 'stable';
            // We are always the "polite" peer for incoming offers
            // If colliding, roll back our local description first
            if (isColliding) {
              await Promise.all([
                pc.setLocalDescription({ type: 'rollback' }),
              ]).catch(() => {
                // Rollback not supported in older browsers — close and recreate
                pc.close();
                peerConnectionsRef.current.delete(fromSocketId);
                return;
              });
            }

            if (!signal.sdp) return;
            await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));

            // Drain queued ICE candidates
            const pending = pendingCandidatesRef.current.get(fromSocketId) ?? [];
            for (const cand of pending) {
              await pc.addIceCandidate(new RTCIceCandidate(cand)).catch(() => {});
            }
            pendingCandidatesRef.current.delete(fromSocketId);

            const answer = await pc.createAnswer();
            const tunedAnswer = new RTCSessionDescription({
              type: answer.type,
              sdp: optimizeAudioSdp(answer.sdp || ''),
            });
            await pc.setLocalDescription(tunedAnswer);

            socket.emit('meeting:signal', {
              toSocketId: fromSocketId,
              signal: { type: 'answer', sdp: tunedAnswer },
            });
          } catch (e) {
            console.error('[WebRTC] Error handling offer from', fromSocketId, e);
          }
        } else if (signal.type === 'answer') {
          try {
            if (pc.signalingState === 'have-local-offer') {
              if (!signal.sdp) return;
              await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));

              // Drain queued ICE candidates
              const pending = pendingCandidatesRef.current.get(fromSocketId) ?? [];
              for (const cand of pending) {
                await pc.addIceCandidate(new RTCIceCandidate(cand)).catch(() => {});
              }
              pendingCandidatesRef.current.delete(fromSocketId);
            }
          } catch (e) {
            console.error('[WebRTC] Error handling answer from', fromSocketId, e);
          }
        } else if (signal.type === 'candidate' && signal.candidate) {
          try {
            if (pc.remoteDescription?.type) {
              await pc.addIceCandidate(new RTCIceCandidate(signal.candidate)).catch(() => {});
            } else {
              const queue = pendingCandidatesRef.current.get(fromSocketId) ?? [];
              queue.push(signal.candidate);
              pendingCandidatesRef.current.set(fromSocketId, queue);
            }
          } catch (e) {
            console.error('[WebRTC] Error adding ICE candidate', e);
          }
        }
      });

      // ICE restart requested by remote peer
      socket.on('meeting:ice-restart', async (payload: { fromSocketId: string }) => {
        if (!mounted) return;
        const pc = peerConnectionsRef.current.get(payload.fromSocketId);
        if (!pc) return;
        console.log('[WebRTC] ICE restart requested by', payload.fromSocketId);
        // Let the remote re-offer us — we respond in the signal handler above
      });

      // Media state updates (mic / cam / screen share)
      socket.on('meeting:media-state', (payload: {
        socketId: string;
        participantId: string;
        isMicOn?: boolean;
        isCamOn?: boolean;
        isScreenSharing?: boolean;
      }) => {
        const info = peersInfoRef.current.get(payload.socketId);
        if (info) {
          const wasSharing = info.isScreenSharing;
          if (typeof payload.isMicOn === 'boolean') info.isMicOn = payload.isMicOn;
          if (typeof payload.isCamOn === 'boolean') info.isCamOn = payload.isCamOn;
          if (typeof payload.isScreenSharing === 'boolean') info.isScreenSharing = payload.isScreenSharing;

          // Notify UI when someone starts sharing their screen
          if (!wasSharing && info.isScreenSharing) {
            callbacksRef.current.onScreenShareStarted?.(info.participantName);
            // Auto switch to speaker view
            const store = useMeetingStore.getState();
            store.setViewMode('speaker');
            store.setActiveSpeakerId(info.participantId);
          }

          syncRemoteParticipantsToStore();
        }
      });

      // Hand raise / lower
      socket.on('meeting:raise-hand', (payload: {
        participantId: string;
        participantName: string;
        raised: boolean;
      }) => {
        if (payload.raised) {
          useMeetingStore.getState().toggleRaiseHand(payload.participantId);
          callbacksRef.current.onHandAlert?.(`${payload.participantName || 'Participant'} raised their hand ✋`);
        } else {
          useMeetingStore.getState().lowerHand(payload.participantId);
        }
      });

      // Chat messages — server relays to OTHER participants only (sender has optimistic copy)
      socket.on('meeting:chat', (message: {
        id: string;
        senderName: string;
        senderId: string;
        text: string;
        ts: number;
      }) => {
        // Deduplicate in case of reconnect replaying missed messages
        const existing = useMeetingStore.getState().chatMessages;
        if (!existing.some((m) => m.id === message.id)) {
          useMeetingStore.getState().addChatMessage(message);
        }
      });

      // Chat edits from other participants
      socket.on('meeting:chat-edit', (payload: {
        messageId: string;
        newText: string;
        senderId: string;
        editedAt: number;
      }) => {
        useMeetingStore.getState().editChatMessage(payload.messageId, payload.newText);
      });

      // Chat deletions from other participants
      socket.on('meeting:chat-delete', (payload: {
        messageId: string;
        senderId: string;
        deletedAt: number;
      }) => {
        useMeetingStore.getState().deleteChatMessage(payload.messageId);
      });

      // Chat reactions from other participants
      socket.on('meeting:chat-reaction', (payload: {
        messageId: string;
        emoji: string;
        senderId: string;
        senderName: string;
        ts: number;
      }) => {
        useMeetingStore.getState().toggleChatReaction(payload.messageId, payload.emoji, payload.senderId);
      });

      // Meeting floating reactions from other participants
      socket.on('meeting:reaction', (reaction: {
        id: string;
        emoji: string;
        senderId: string;
        senderName: string;
        ts: number;
      }) => {
        callbacksRef.current.onReaction?.(reaction);
      });

      // Host controls
      socket.on('meeting:host-action', (payload: {
        action: 'host_mute' | 'host_mute_all' | 'host_ask_unmute' | 'host_remove' | 'host_remove_all' | 'room_lock_changed' | 'meeting_ended';
        targetSocketId?: string;
        targetParticipantId?: string;
        locked?: boolean;
        hostName?: string;
      }) => {
        if (payload.action === 'meeting_ended') {
          callbacksRef.current.onMeetingEnded?.();
        } else if (payload.action === 'host_remove') {
          if (
            payload.targetParticipantId === myIdentityRef.current ||
            payload.targetSocketId === socket.id
          ) {
            // 1. Immediately stop camera & microphone tracks
            localStreamRef.current?.getTracks().forEach((t) => t.stop());
            localStreamRef.current = null;
            screenStreamRef.current?.getTracks().forEach((t) => t.stop());
            screenStreamRef.current = null;

            // 2. Close all peer connections & clear local state
            peerConnectionsRef.current.forEach((pc) => pc.close());
            peerConnectionsRef.current.clear();
            peerStreamsRef.current.clear();
            peersInfoRef.current.clear();
            pendingCandidatesRef.current.clear();

            // 3. Disconnect socket from room & update store
            socket.disconnect();
            useMeetingStore.getState().setConnectionState('disconnected');
            callbacksRef.current.onRemovedByHost?.();
          }
        } else if (payload.action === 'host_remove_all') {
          const isMeHost = isHost || useMeetingStore.getState().localParticipant?.isHost;
          if (!isMeHost) {
            localStreamRef.current?.getTracks().forEach((t) => t.stop());
            localStreamRef.current = null;
            screenStreamRef.current?.getTracks().forEach((t) => t.stop());
            screenStreamRef.current = null;

            peerConnectionsRef.current.forEach((pc) => pc.close());
            peerConnectionsRef.current.clear();
            peerStreamsRef.current.clear();
            peersInfoRef.current.clear();
            pendingCandidatesRef.current.clear();

            socket.disconnect();
            useMeetingStore.getState().setConnectionState('disconnected');
            callbacksRef.current.onRemovedByHost?.();
          }
        } else if (payload.action === 'host_mute') {
          if (
            payload.targetParticipantId === myIdentityRef.current ||
            payload.targetSocketId === socket.id
          ) {
            localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = false));
            useMeetingStore.getState().setMicOn(false);
            socket.emit('meeting:media-state', {
              roomCode,
              isMicOn: false,
              isCamOn: useMeetingStore.getState().isCamOn,
            });
            callbacksRef.current.onHostNotice?.('The host muted your microphone.');
          }
        } else if (payload.action === 'host_mute_all') {
          const isMeHost = isHost || useMeetingStore.getState().localParticipant?.isHost;
          if (!isMeHost) {
            localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = false));
            useMeetingStore.getState().setMicOn(false);
            socket.emit('meeting:media-state', {
              roomCode,
              isMicOn: false,
              isCamOn: useMeetingStore.getState().isCamOn,
            });
            callbacksRef.current.onHostNotice?.('The host muted all participants.');
          }
        } else if (payload.action === 'host_ask_unmute') {
          if (
            payload.targetParticipantId === myIdentityRef.current ||
            payload.targetSocketId === socket.id
          ) {
            callbacksRef.current.onUnmuteRequested?.();
          }
        } else if (payload.action === 'room_lock_changed') {
          if (typeof payload.locked === 'boolean') {
            callbacksRef.current.onRoomLockedChanged?.(payload.locked);
          }
        }
      });

      // Quiz invite via data channel
      socket.on('meeting:data', (payload: { roomCode: string; data: number[] }) => {
        try {
          const bytes = new Uint8Array(payload.data);
          const msg = JSON.parse(new TextDecoder().decode(bytes)) as { type: string; pin: string; hostName: string };
          if (msg.type === 'quiz_invite') {
            callbacksRef.current.onQuizInvite?.({ pin: msg.pin, hostName: msg.hostName || 'Meeting Host' });
          }
        } catch { /* ignore malformed data */ }
      });

      // Peer left
      socket.on('meeting:peer-left', (payload: { socketId: string; participantId: string }) => {
        const pc = peerConnectionsRef.current.get(payload.socketId);
        if (pc) { pc.close(); peerConnectionsRef.current.delete(payload.socketId); }
        peerStreamsRef.current.delete(payload.socketId);
        peersInfoRef.current.delete(payload.socketId);
        pendingCandidatesRef.current.delete(payload.socketId);
        const timer = iceRestartTimersRef.current.get(payload.socketId);
        if (timer) { clearTimeout(timer); iceRestartTimersRef.current.delete(payload.socketId); }
        syncRemoteParticipantsToStore();
        // Someone left → more bandwidth available, upgrade remaining connections
        rebalanceEncodings();
      });

      // Start stats collection and keepalive heartbeat
      startStatsCollection();
      heartbeatTimerRef.current = setInterval(() => {
        if (socket.connected) {
          socket.emit('meeting:ping', { roomCode });
        }
      }, 25_000);
    }

    void init();

    return () => {
      mounted = false;             // close-over local flag for this effect closure
      mountedRef.current = false;  // shared ref for timers / stats callbacks

      if (statsTimerRef.current) { clearInterval(statsTimerRef.current); statsTimerRef.current = null; }
      if (heartbeatTimerRef.current) { clearInterval(heartbeatTimerRef.current); heartbeatTimerRef.current = null; }

      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;

      peerConnectionsRef.current.forEach((pc) => pc.close());
      peerConnectionsRef.current.clear();
      peerStreamsRef.current.clear();
      peersInfoRef.current.clear();
      pendingCandidatesRef.current.clear();
      iceRestartTimersRef.current.forEach((t) => clearTimeout(t));
      iceRestartTimersRef.current.clear();

      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [roomCode, participantName, isHost, createPeerConnection, syncRemoteParticipantsToStore, startStatsCollection, rebalanceEncodings]);

  // ─── Toggle Microphone ────────────────────────────────────────────────────
  const toggleMic = useCallback((): boolean => {
    const next = !useMeetingStore.getState().isMicOn;
    localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = next));
    useMeetingStore.getState().setMicOn(next);
    socketRef.current?.emit('meeting:media-state', {
      roomCode,
      isMicOn: next,
      isCamOn: useMeetingStore.getState().isCamOn,
    });
    return next;
  }, [roomCode]);

  // ─── Toggle Camera ────────────────────────────────────────────────────────
  const toggleCam = useCallback((): boolean => {
    const next = !useMeetingStore.getState().isCamOn;
    localStreamRef.current?.getVideoTracks().forEach((t) => (t.enabled = next));
    useMeetingStore.getState().setCamOn(next);
    socketRef.current?.emit('meeting:media-state', {
      roomCode,
      isMicOn: useMeetingStore.getState().isMicOn,
      isCamOn: next,
    });
    return next;
  }, [roomCode]);

  // ─── Toggle Screen Share ──────────────────────────────────────────────────
  const toggleScreenShare = useCallback(async (opts?: { useBackCamera?: boolean }): Promise<boolean> => {
    const isScreenSharing = useMeetingStore.getState().isScreenSharing;

    if (!isScreenSharing) {
      const useBackCam = Boolean(opts?.useBackCamera);

      if (!useBackCam && (!navigator.mediaDevices || typeof navigator.mediaDevices.getDisplayMedia !== 'function')) {
        callbacksRef.current.onHostNotice?.(
          'Mobile browsers (Chrome & Safari) restrict in-browser screen sharing. Use a laptop/desktop or select "Present Back Camera".'
        );
        return false;
      }

      try {
        let screenStream: MediaStream;

        if (useBackCam) {
          // Use high-definition rear/environment camera for mobile presentations
          try {
            screenStream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: { ideal: 'environment' },
                width: { ideal: 1920, max: 1920 },
                height: { ideal: 1080, max: 1080 },
                frameRate: { ideal: 24, max: 30 },
              },
              audio: false,
            });
          } catch {
            screenStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false,
            });
          }
        } else {
          try {
            // Mobile-friendly constraints: avoid rigid landscape 1920x1080 which fails in mobile portrait orientation
            screenStream = await navigator.mediaDevices.getDisplayMedia({
              video: {
                frameRate: { ideal: 15, max: 30 },
              },
              audio: false,
            });
          } catch (err: unknown) {
            const e = err as { name?: string };
            // If rejected by user cancellation, don't re-prompt
            if (e?.name === 'NotAllowedError' || e?.name === 'AbortError') {
              return false;
            }
            // Fallback to basic constraint for strict mobile drivers / iOS Safari
            screenStream = await navigator.mediaDevices.getDisplayMedia({
              video: true,
            });
          }
        }

        const screenTrack = screenStream.getVideoTracks()[0] ?? null;
        screenStreamRef.current = screenStream;

        if (screenTrack) {
          // When the user clicks "Stop sharing" in the browser's native UI
          screenTrack.onended = () => {
            void toggleScreenShare();
          };

          // Apply screen track to all active peer connections
          peerConnectionsRef.current.forEach((pc) => {
            let sender = pc.getSenders().find((s) => s.track?.kind === 'video');
            if (!sender) {
              const vt = pc.getTransceivers().find(
                (t) => t.receiver?.track?.kind === 'video' || t.sender?.track?.kind === 'video'
              );
              if (vt?.sender) sender = vt.sender;
            }

            if (sender) {
              void sender.replaceTrack(screenTrack).then(() => {
                void applyVideoEncodings(sender, true);
              }).catch((e) => {
                console.warn('[WebRTC] replaceTrack error:', e);
              });
            } else {
              try {
                const newSender = pc.addTrack(screenTrack, screenStream);
                void applyVideoEncodings(newSender, true);
              } catch (e) {
                console.warn('[WebRTC] addTrack error:', e);
              }
            }
          });
        }

        setLocalStream(screenStream);
        useMeetingStore.getState().setScreenSharing(true);

        // Update local participant in store
        const lp = useMeetingStore.getState().localParticipant as WebRTCParticipant | null;
        if (lp) {
          useMeetingStore.getState().setLocalParticipant({
            ...lp,
            isScreenSharing: true,
            stream: screenStream,
          } as unknown as import('livekit-client').LocalParticipant);
        }

        socketRef.current?.emit('meeting:media-state', {
          roomCode,
          isMicOn: useMeetingStore.getState().isMicOn,
          isCamOn: useMeetingStore.getState().isCamOn,
          isScreenSharing: true,
        });
        return true;
      } catch (err: unknown) {
        const e = err as { name?: string };
        console.warn('[WebRTC] Screen share failed:', err);
        if (e?.name !== 'NotAllowedError' && e?.name !== 'AbortError') {
          callbacksRef.current.onHostNotice?.(
            'Unable to start screen sharing. Please check permissions or open in Chrome/Safari.'
          );
        }
        return false;
      }
    } else {
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;

      const camTrack = (useMeetingStore.getState().isCamOn ? localStreamRef.current?.getVideoTracks()[0] : null) ?? null;
      for (const pc of peerConnectionsRef.current.values()) {
        const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
        if (sender) {
          await sender.replaceTrack(camTrack).then(() => {
            void applyVideoEncodings(sender, false);
          }).catch(() => {});
        }
      }

      setLocalStream(localStreamRef.current);
      useMeetingStore.getState().setScreenSharing(false);

      const lp = useMeetingStore.getState().localParticipant as WebRTCParticipant | null;
      if (lp) {
        useMeetingStore.getState().setLocalParticipant({
          ...lp,
          isScreenSharing: false,
          stream: localStreamRef.current ?? undefined,
        } as unknown as import('livekit-client').LocalParticipant);
      }

      socketRef.current?.emit('meeting:media-state', {
        roomCode,
        isMicOn: useMeetingStore.getState().isMicOn,
        isCamOn: useMeetingStore.getState().isCamOn,
        isScreenSharing: false,
      });
      return false;
    }
  }, [roomCode]);

  // ─── Raise / Lower Hand ───────────────────────────────────────────────────
  const toggleHand = useCallback(() => {
    const myId = myIdentityRef.current;
    const isRaised = useMeetingStore.getState().raisedHands.includes(myId);
    const nextRaised = !isRaised;
    useMeetingStore.getState().toggleRaiseHand(myId);
    socketRef.current?.emit('meeting:raise-hand', { roomCode, raised: nextRaised });
  }, [roomCode]);

  // ─── Send Chat Message ────────────────────────────────────────────────────
  const sendChatMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const msg = {
      id: crypto.randomUUID(),
      senderName: participantName || 'You',
      senderId: myIdentityRef.current,
      text: text.trim(),
      ts: Date.now(),
    };
    // Single optimistic local add (server no longer echoes back to sender)
    useMeetingStore.getState().addChatMessage({ ...msg, senderName: 'You' });
    socketRef.current?.emit('meeting:chat', { roomCode, message: msg });
  }, [participantName, roomCode]);

  // ─── Edit a sent message ──────────────────────────────────────────────────
  const editChatMessage = useCallback((messageId: string, newText: string) => {
    if (!newText.trim()) return;
    // Update locally immediately
    useMeetingStore.getState().editChatMessage(messageId, newText.trim());
    // Broadcast edit to other participants in real time
    socketRef.current?.emit('meeting:chat-edit', {
      roomCode,
      messageId,
      newText: newText.trim(),
      senderId: myIdentityRef.current,
    });
  }, [roomCode]);

  // ─── Delete a sent message ────────────────────────────────────────────────
  const deleteChatMessage = useCallback((messageId: string) => {
    // Soft-delete locally immediately
    useMeetingStore.getState().deleteChatMessage(messageId);
    // Broadcast deletion to other participants in real time
    socketRef.current?.emit('meeting:chat-delete', {
      roomCode,
      messageId,
      senderId: myIdentityRef.current,
    });
  }, [roomCode]);

  // ─── Send Floating Meeting Reaction (Zoom style) ──────────────────────────
  const sendReaction = useCallback((emoji: string) => {
    if (!emoji) return;
    const reaction = {
      id: crypto.randomUUID(),
      emoji,
      senderId: myIdentityRef.current,
      senderName: participantName || 'You',
      ts: Date.now(),
    };
    // Trigger local display immediately
    callbacksRef.current.onReaction?.(reaction);
    // Broadcast to everyone else in the room
    socketRef.current?.emit('meeting:reaction', { roomCode, reaction });
  }, [participantName, roomCode]);

  // ─── React to a Chat Message ──────────────────────────────────────────────
  const sendChatReaction = useCallback((messageId: string, emoji: string) => {
    if (!messageId || !emoji) return;
    // Toggle locally immediately
    useMeetingStore.getState().toggleChatReaction(messageId, emoji, myIdentityRef.current);
    // Broadcast to room
    socketRef.current?.emit('meeting:chat-reaction', {
      roomCode,
      messageId,
      emoji,
      senderId: myIdentityRef.current,
      senderName: participantName || 'You',
    });
  }, [participantName, roomCode]);

  // ─── Host Actions ─────────────────────────────────────────────────────────
  const hostMute = useCallback((targetParticipantId: string) => {
    for (const [, info] of peersInfoRef.current) {
      if (info.participantId === targetParticipantId) {
        info.isMicOn = false;
        break;
      }
    }
    syncRemoteParticipantsToStore();
    socketRef.current?.emit('meeting:host-action', {
      roomCode,
      action: 'host_mute',
      targetParticipantId,
    });
  }, [roomCode, syncRemoteParticipantsToStore]);

  const hostAskUnmute = useCallback((targetParticipantId: string) => {
    socketRef.current?.emit('meeting:host-action', {
      roomCode,
      action: 'host_ask_unmute',
      targetParticipantId,
    });
  }, [roomCode]);

  const hostMuteAll = useCallback(() => {
    peersInfoRef.current.forEach((info) => {
      info.isMicOn = false;
    });
    syncRemoteParticipantsToStore();
    socketRef.current?.emit('meeting:host-action', {
      roomCode,
      action: 'host_mute_all',
    });
  }, [roomCode, syncRemoteParticipantsToStore]);

  const hostRemove = useCallback((targetParticipantId: string) => {
    // Optimistically clean up target on host
    let targetSocketId: string | undefined;
    for (const [sid, info] of peersInfoRef.current) {
      if (info.participantId === targetParticipantId) {
        targetSocketId = sid;
        break;
      }
    }
    if (targetSocketId) {
      const pc = peerConnectionsRef.current.get(targetSocketId);
      if (pc) {
        pc.close();
        peerConnectionsRef.current.delete(targetSocketId);
      }
      peerStreamsRef.current.delete(targetSocketId);
      peersInfoRef.current.delete(targetSocketId);
      pendingCandidatesRef.current.delete(targetSocketId);
      const timer = iceRestartTimersRef.current.get(targetSocketId);
      if (timer) {
        clearTimeout(timer);
        iceRestartTimersRef.current.delete(targetSocketId);
      }
      syncRemoteParticipantsToStore();
    }

    socketRef.current?.emit('meeting:host-action', {
      roomCode,
      action: 'host_remove',
      targetParticipantId,
      targetSocketId,
    });
  }, [roomCode, syncRemoteParticipantsToStore]);

  const hostRemoveAll = useCallback(() => {
    peerConnectionsRef.current.forEach((pc) => pc.close());
    peerConnectionsRef.current.clear();
    peerStreamsRef.current.clear();
    peersInfoRef.current.clear();
    pendingCandidatesRef.current.clear();
    iceRestartTimersRef.current.forEach((t) => clearTimeout(t));
    iceRestartTimersRef.current.clear();
    syncRemoteParticipantsToStore();

    socketRef.current?.emit('meeting:host-action', {
      roomCode,
      action: 'host_remove_all',
    });
  }, [roomCode, syncRemoteParticipantsToStore]);

  const hostToggleLock = useCallback((locked: boolean) => {
    socketRef.current?.emit('meeting:host-action', {
      roomCode, action: 'room_lock_changed', locked,
    });
  }, [roomCode]);

  const hostEndMeeting = useCallback(() => {
    socketRef.current?.emit('meeting:host-action', {
      roomCode, action: 'meeting_ended',
    });
  }, [roomCode]);

  // ─── Broadcast binary data (quiz invites, etc.) ───────────────────────────
  const broadcastData = useCallback((data: Uint8Array) => {
    socketRef.current?.emit('meeting:data', {
      roomCode,
      data: Array.from(data),
    });
  }, [roomCode]);

  return {
    localStream,
    myIdentity: myIdentityRef.current,
    toggleMic,
    toggleCam,
    toggleScreenShare,
    toggleHand,
    sendChatMessage,
    editChatMessage,
    deleteChatMessage,
    sendReaction,
    sendChatReaction,
    hostMute,
    hostAskUnmute,
    hostMuteAll,
    hostRemove,
    hostRemoveAll,
    hostToggleLock,
    hostEndMeeting,
    broadcastData,
  };
}
