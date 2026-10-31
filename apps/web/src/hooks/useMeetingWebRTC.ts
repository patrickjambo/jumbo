import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ConnectionQuality } from 'livekit-client';
import { useMeetingStore } from '../store';

const API_URL = (import.meta.env['VITE_API_URL'] as string | undefined) ?? '';

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

/**
 * Optimizes the SDP for Opus to ensure high-fidelity voice transmission without
 * jitter-buffer time-stretching ("slow motion") or speech packet clipping ("lost words").
 * - useinbandfec=1: in-band Forward Error Correction recovers dropped packets without delay
 * - usedtx=0: continuous packet transmission avoids silence suppression syllable clipping
 * - stereo=0;sprop-stereo=0: pure mono encoding prevents phase cancellation & comb filtering
 * - maxaveragebitrate=64000: 64kbps crystal clear voice
 * - cbr=1: constant bitrate prevents packet bursts and jitter buffer expansion
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
    useinbandfec: '1',
    usedtx: '0',
    stereo: '0',
    'sprop-stereo': '0',
    cbr: '1',
    maxaveragebitrate: '64000',
  };

  if (fmtpMatch && fmtpMatch[1]) {
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

export interface WebRTCParticipant {
  identity: string;
  name: string;
  socketId: string;
  isHost: boolean;
  isLocal: boolean;
  isMicOn: boolean;
  isCamOn: boolean;
  stream: MediaStream | null;
  connectionQuality: ConnectionQuality;
  getTrackPublication?: (source: any) => any;
  on?: (event: string, cb: any) => void;
  off?: (event: string, cb: any) => void;
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
}

export interface UseMeetingWebRTCReturn {
  localStream: MediaStream | null;
  myIdentity: string;
  toggleMic: () => boolean;
  toggleCam: () => boolean;
  toggleScreenShare: () => Promise<boolean>;
  toggleHand: () => void;
  sendChatMessage: (text: string) => void;
  hostMute: (targetParticipantId: string) => void;
  hostRemove: (targetParticipantId: string) => void;
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
}: UseMeetingWebRTCOptions): UseMeetingWebRTCReturn {
  const socketRef = useRef<Socket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const pendingCandidatesRef = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());
  const peerStreamsRef = useRef<Map<string, MediaStream>>(new Map());
  const peersInfoRef = useRef<Map<string, {
    participantId: string;
    participantName: string;
    isHost: boolean;
    isMicOn: boolean;
    isCamOn: boolean;
  }>>(new Map());

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const myIdentityRef = useRef<string>(
    sessionStorage.getItem('lk-identity') ||
    `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
  );

  sessionStorage.setItem('lk-identity', myIdentityRef.current);

  // Store volatile callbacks in a ref to avoid invalidating the main lifecycle effect
  const callbacksRef = useRef({
    onQuizInvite,
    onHandAlert,
    onHostNotice,
    onRoomLockedChanged,
    onMeetingEnded,
    onRemovedByHost,
  });

  useEffect(() => {
    callbacksRef.current = {
      onQuizInvite,
      onHandAlert,
      onHostNotice,
      onRoomLockedChanged,
      onMeetingEnded,
      onRemovedByHost,
    };
  });

  // Helper: sync remote participants to Zustand store without causing re-render loops
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
        stream,
        connectionQuality: ConnectionQuality.Excellent,
      });
    });
    useMeetingStore.getState().setRemoteParticipants(list as any);
  }, []);

  // Create an RTCPeerConnection for a remote socket
  const createPeerConnection = useCallback((remoteSocketId: string): RTCPeerConnection => {
    if (peerConnectionsRef.current.has(remoteSocketId)) {
      return peerConnectionsRef.current.get(remoteSocketId)!;
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionsRef.current.set(remoteSocketId, pc);

    // Add local tracks to the connection
    const currentStream = screenStreamRef.current || localStreamRef.current;
    if (currentStream) {
      currentStream.getTracks().forEach((track) => {
        try {
          pc.addTrack(track, currentStream);
        } catch { /* already added */ }
      });
    }

    // Send local ICE candidates to remote peer via socket
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

    // Handle incoming remote media tracks cleanly
    pc.ontrack = (event) => {
      let stream = peerStreamsRef.current.get(remoteSocketId);
      if (!stream) {
        stream = new MediaStream();
        peerStreamsRef.current.set(remoteSocketId, stream);
      }
      if (event.track) {
        // Remove previous track of same kind if replacing to prevent ghost tracks or comb-filtering
        const existing = stream.getTracks().filter((t) => t.kind === event.track.kind);
        existing.forEach((t) => {
          if (t.id !== event.track.id) stream.removeTrack(t);
        });
        if (!stream.getTracks().some((t) => t.id === event.track.id)) {
          stream.addTrack(event.track);
        }
      }

      // Ensure peer info exists
      if (!peersInfoRef.current.has(remoteSocketId)) {
        peersInfoRef.current.set(remoteSocketId, {
          participantId: remoteSocketId,
          participantName: 'Participant',
          isHost: false,
          isMicOn: true,
          isCamOn: true,
        });
      }

      syncRemoteParticipantsToStore();
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        console.warn(`Peer connection with ${remoteSocketId} state:`, pc.connectionState);
      }
    };

    return pc;
  }, [syncRemoteParticipantsToStore]);

  // Main lifecycle — ONLY runs once per room/user session
  useEffect(() => {
    if (!roomCode || !participantName) return;

    let mounted = true;

    async function init() {
      // 1. Acquire Local Media with optimized mono 48kHz audio constraints for Opus
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            channelCount: 1,
            sampleRate: 48000,
          },
        });
      } catch (err) {
        console.warn('Could not acquire both video and audio, falling back to audio-only', err);
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              channelCount: 1,
              sampleRate: 48000,
            },
          });
        } catch (e2) {
          console.warn('Could not acquire audio either, creating blank fallback stream', e2);
          stream = new MediaStream();
        }
      }

      if (!mounted) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      const storeState = useMeetingStore.getState();

      // Ensure initial track enabled states match store
      if (!storeState.isCamOn) {
        stream.getVideoTracks().forEach((t) => (t.enabled = false));
      }
      if (!storeState.isMicOn) {
        stream.getAudioTracks().forEach((t) => (t.enabled = false));
      }

      localStreamRef.current = stream;
      setLocalStream(stream);

      // Add local tracks to any already-created peer connections
      peerConnectionsRef.current.forEach((pc) => {
        stream.getTracks().forEach((track) => {
          try {
            pc.addTrack(track, stream);
          } catch { /* already added */ }
        });
      });

      // Create Local Participant representation
      const localP: WebRTCParticipant = {
        identity: myIdentityRef.current,
        name: participantName,
        socketId: 'local',
        isHost,
        isLocal: true,
        isMicOn: storeState.isMicOn,
        isCamOn: storeState.isCamOn,
        stream,
        connectionQuality: ConnectionQuality.Excellent,
      };

      storeState.setLocalParticipant(localP as any);
      storeState.setConnectionState('connected');

      // 2. Connect to Socket.IO signaling server
      const socket = io(API_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        const curStore = useMeetingStore.getState();
        socket.emit('meeting:join', {
          roomCode,
          participantName,
          participantId: myIdentityRef.current,
          isHost,
          isMicOn: curStore.isMicOn,
          isCamOn: curStore.isCamOn,
        });
      });

      // Existing peers in the room when we join
      socket.on('meeting:peers', async (data: {
        peers: Array<{
          socketId: string;
          participantId: string;
          participantName: string;
          isHost: boolean;
          isMicOn: boolean;
          isCamOn: boolean;
        }>;
      }) => {
        if (!mounted) return;
        for (const peer of data.peers) {
          peersInfoRef.current.set(peer.socketId, peer);

          // Initiate WebRTC offer to existing peers with optimized Opus audio SDP
          const pc = createPeerConnection(peer.socketId);
          try {
            const offer = await pc.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
            });
            const tunedOffer = new RTCSessionDescription({
              type: offer.type,
              sdp: optimizeAudioSdp(offer.sdp || ''),
            });
            await pc.setLocalDescription(tunedOffer);

            socket.emit('meeting:signal', {
              toSocketId: peer.socketId,
              signal: { type: 'offer', sdp: tunedOffer },
            });
          } catch (e) {
            console.error('Failed to create offer for peer', peer.socketId, e);
          }
        }
        syncRemoteParticipantsToStore();
      });

      // New peer joined after us
      socket.on('meeting:peer-joined', (peer: {
        socketId: string;
        participantId: string;
        participantName: string;
        isHost: boolean;
        isMicOn: boolean;
        isCamOn: boolean;
      }) => {
        if (!mounted) return;
        peersInfoRef.current.set(peer.socketId, peer);
        syncRemoteParticipantsToStore();
      });

      // WebRTC Signal received (offer, answer, or candidate)
      socket.on('meeting:signal', async (data: {
        fromSocketId: string;
        signal: any;
      }) => {
        if (!mounted) return;
        const { fromSocketId, signal } = data;
        if (!fromSocketId || !signal) return;

        const pc = createPeerConnection(fromSocketId);

        if (signal.type === 'offer') {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));

            // Drain queued ICE candidates
            const pending = pendingCandidatesRef.current.get(fromSocketId) || [];
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
            console.error('Error handling offer from', fromSocketId, e);
          }
        } else if (signal.type === 'answer') {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));

            // Drain queued ICE candidates
            const pending = pendingCandidatesRef.current.get(fromSocketId) || [];
            for (const cand of pending) {
              await pc.addIceCandidate(new RTCIceCandidate(cand)).catch(() => {});
            }
            pendingCandidatesRef.current.delete(fromSocketId);
          } catch (e) {
            console.error('Error handling answer from', fromSocketId, e);
          }
        } else if (signal.type === 'candidate' && signal.candidate) {
          try {
            if (pc.remoteDescription && pc.remoteDescription.type) {
              await pc.addIceCandidate(new RTCIceCandidate(signal.candidate)).catch(() => {});
            } else {
              const queue = pendingCandidatesRef.current.get(fromSocketId) || [];
              queue.push(signal.candidate);
              pendingCandidatesRef.current.set(fromSocketId, queue);
            }
          } catch (e) {
            console.error('Error adding ICE candidate', e);
          }
        }
      });

      // Peer mute / cam state updates
      socket.on('meeting:media-state', (payload: {
        socketId: string;
        participantId: string;
        isMicOn?: boolean;
        isCamOn?: boolean;
      }) => {
        const info = peersInfoRef.current.get(payload.socketId);
        if (info) {
          if (typeof payload.isMicOn === 'boolean') info.isMicOn = payload.isMicOn;
          if (typeof payload.isCamOn === 'boolean') info.isCamOn = payload.isCamOn;
          syncRemoteParticipantsToStore();
        }
      });

      // Hand raise / lower updates
      socket.on('meeting:raise-hand', (payload: {
        participantId: string;
        participantName: string;
        raised: boolean;
      }) => {
        if (payload.raised) {
          useMeetingStore.getState().toggleRaiseHand(payload.participantId);
          callbacksRef.current.onHandAlert?.(`${payload.participantName || 'Participant'} raised hand`);
        } else {
          useMeetingStore.getState().lowerHand(payload.participantId);
        }
      });

      // Chat messages
      socket.on('meeting:chat', (message: any) => {
        useMeetingStore.getState().addChatMessage(message);
      });

      // Host controls
      socket.on('meeting:host-action', (payload: {
        action: 'host_mute' | 'host_remove' | 'room_lock_changed' | 'meeting_ended';
        targetSocketId?: string;
        targetParticipantId?: string;
        locked?: boolean;
      }) => {
        if (payload.action === 'meeting_ended') {
          callbacksRef.current.onMeetingEnded?.();
        } else if (payload.action === 'host_remove') {
          if (payload.targetParticipantId === myIdentityRef.current || payload.targetSocketId === socket.id) {
            callbacksRef.current.onRemovedByHost?.();
          }
        } else if (payload.action === 'host_mute') {
          if (payload.targetParticipantId === myIdentityRef.current || payload.targetSocketId === socket.id) {
            if (localStreamRef.current) {
              localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = false));
            }
            useMeetingStore.getState().setMicOn(false);
            callbacksRef.current.onHostNotice?.('The meeting host muted your microphone.');
          }
        } else if (payload.action === 'room_lock_changed') {
          if (typeof payload.locked === 'boolean') {
            callbacksRef.current.onRoomLockedChanged?.(payload.locked);
          }
        }
      });

      // Quiz invite broadcast via data
      socket.on('meeting:data', (payload: { roomCode: string; data: number[] }) => {
        try {
          const bytes = new Uint8Array(payload.data);
          const msg = JSON.parse(new TextDecoder().decode(bytes));
          if (msg.type === 'quiz_invite') {
            callbacksRef.current.onQuizInvite?.({ pin: msg.pin, hostName: msg.hostName || 'Meeting Host' });
          }
        } catch { /* ignore */ }
      });

      // Peer left
      socket.on('meeting:peer-left', (payload: { socketId: string; participantId: string }) => {
        const pc = peerConnectionsRef.current.get(payload.socketId);
        if (pc) {
          pc.close();
          peerConnectionsRef.current.delete(payload.socketId);
        }
        peerStreamsRef.current.delete(payload.socketId);
        peersInfoRef.current.delete(payload.socketId);
        pendingCandidatesRef.current.delete(payload.socketId);
        syncRemoteParticipantsToStore();
      });
    }

    void init();

    return () => {
      mounted = false;
      // Cleanup all local tracks
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      // Close all peer connections
      peerConnectionsRef.current.forEach((pc) => pc.close());
      peerConnectionsRef.current.clear();
      peerStreamsRef.current.clear();
      peersInfoRef.current.clear();
      pendingCandidatesRef.current.clear();
      // Disconnect socket
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [roomCode, participantName, isHost, createPeerConnection, syncRemoteParticipantsToStore]);

  // Toggle Microphone
  const toggleMic = useCallback((): boolean => {
    const isMicOn = useMeetingStore.getState().isMicOn;
    const next = !isMicOn;
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = next;
      });
    }
    useMeetingStore.getState().setMicOn(next);
    socketRef.current?.emit('meeting:media-state', {
      roomCode,
      isMicOn: next,
      isCamOn: useMeetingStore.getState().isCamOn,
    });
    return next;
  }, [roomCode]);

  // Toggle Camera
  const toggleCam = useCallback((): boolean => {
    const isCamOn = useMeetingStore.getState().isCamOn;
    const next = !isCamOn;
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = next;
      });
    }
    useMeetingStore.getState().setCamOn(next);
    socketRef.current?.emit('meeting:media-state', {
      roomCode,
      isMicOn: useMeetingStore.getState().isMicOn,
      isCamOn: next,
    });
    return next;
  }, [roomCode]);

  // Toggle Screen Share
  const toggleScreenShare = useCallback(async (): Promise<boolean> => {
    const isScreenSharing = useMeetingStore.getState().isScreenSharing;
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0] ?? null;
        screenStreamRef.current = screenStream;

        if (screenTrack) {
          screenTrack.onended = () => {
            void toggleScreenShare();
          };
        }

        // Replace video track in all active peer connections
        peerConnectionsRef.current.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
          if (sender) {
            void sender.replaceTrack(screenTrack);
          }
        });

        useMeetingStore.getState().setScreenSharing(true);
        return true;
      } catch (err) {
        console.warn('Screen share canceled or failed', err);
        return false;
      }
    } else {
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;

      const camTrack = localStreamRef.current?.getVideoTracks()[0] ?? null;
      peerConnectionsRef.current.forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
        if (sender && camTrack) {
          void sender.replaceTrack(camTrack);
        }
      });

      useMeetingStore.getState().setScreenSharing(false);
      return false;
    }
  }, []);

  // Raise / Lower Hand
  const toggleHand = useCallback(() => {
    const myId = myIdentityRef.current;
    const isRaised = useMeetingStore.getState().raisedHands.includes(myId);
    const nextRaised = !isRaised;

    useMeetingStore.getState().toggleRaiseHand(myId);
    socketRef.current?.emit('meeting:raise-hand', {
      roomCode,
      raised: nextRaised,
    });
  }, [roomCode]);

  // Send In-call Chat Message
  const sendChatMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const msg = {
      id: crypto.randomUUID(),
      senderName: participantName || 'You',
      senderId: myIdentityRef.current,
      text: text.trim(),
      ts: Date.now(),
    };
    socketRef.current?.emit('meeting:chat', {
      roomCode,
      message: msg,
    });
  }, [participantName, roomCode]);

  // Host Action: Mute participant
  const hostMute = useCallback((targetParticipantId: string) => {
    socketRef.current?.emit('meeting:host-action', {
      roomCode,
      action: 'host_mute',
      targetParticipantId,
    });
  }, [roomCode]);

  // Host Action: Remove participant
  const hostRemove = useCallback((targetParticipantId: string) => {
    socketRef.current?.emit('meeting:host-action', {
      roomCode,
      action: 'host_remove',
      targetParticipantId,
    });
  }, [roomCode]);

  // Host Action: Toggle room lock
  const hostToggleLock = useCallback((locked: boolean) => {
    socketRef.current?.emit('meeting:host-action', {
      roomCode,
      action: 'room_lock_changed',
      locked,
    });
  }, [roomCode]);

  // Host Action: End meeting for all
  const hostEndMeeting = useCallback(() => {
    socketRef.current?.emit('meeting:host-action', {
      roomCode,
      action: 'meeting_ended',
    });
  }, [roomCode]);

  // Broadcast binary data (e.g. for quiz invites)
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
    hostMute,
    hostRemove,
    hostToggleLock,
    hostEndMeeting,
    broadcastData,
  };
}
