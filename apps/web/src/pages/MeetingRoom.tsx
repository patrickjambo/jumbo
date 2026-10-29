import { useEffect, useCallback, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Room, RoomEvent, Track, ParticipantEvent,
  type RemoteParticipant, type LocalParticipant,
  createLocalTracks, VideoPresets, type LocalTrack,
  type TrackPublication,
} from 'livekit-client';
import {
  Mic, MicOff, Video, VideoOff, Monitor, MessageSquare,
  Users, Gamepad2, Circle, PhoneOff, ChevronUp, X,
  Send, AlertTriangle, Headphones,
} from 'lucide-react';
import { useMeetingStore } from '../store';
import { useNoiseControl } from '../hooks/useNoiseControl';
import { MeetingQuizPanel } from '../components/MeetingQuizPanel';

// ─── Participant Tile ─────────────────────────────────────────────────────────
function ParticipantTile({ participant, isLocal }: { participant: LocalParticipant | RemoteParticipant; isLocal: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    function attachTracks() {
      if (isLocal) {
        const lp = participant as LocalParticipant;
        const vPub = lp.getTrackPublication(Track.Source.Camera);
        if (vPub?.track && videoRef.current) {
          vPub.track.attach(videoRef.current);
          setHasVideo(true);
        }
      } else {
        const rp = participant as RemoteParticipant;
        rp.on(ParticipantEvent.TrackSubscribed, (track) => {
          if (track.kind === Track.Kind.Video && videoRef.current) {
            track.attach(videoRef.current);
            setHasVideo(true);
          }
        });
        rp.on(ParticipantEvent.TrackUnsubscribed, (track) => {
          if (track.kind === Track.Kind.Video) setHasVideo(false);
        });
      }
    }

    attachTracks();

    participant.on(ParticipantEvent.IsSpeakingChanged, (speaking: boolean) => setIsSpeaking(speaking));

    return () => {
      participant.off(ParticipantEvent.IsSpeakingChanged, () => {});
    };
  }, [participant, isLocal]);

  return (
    <div className={`relative bg-[var(--surface-2)] rounded-[var(--radius-card)] overflow-hidden flex items-center justify-center transition-all ${isSpeaking ? 'ring-2 ring-brand-400' : ''}`}>
      <video
        ref={videoRef}
        autoPlay
        muted={isLocal}
        playsInline
        className={`w-full h-full object-cover ${!hasVideo ? 'hidden' : ''}`}
      />
      {!hasVideo && (
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-brand-500/30 flex items-center justify-center text-2xl font-bold text-brand-300">
            {participant.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <span className="text-sm text-[var(--text-secondary)]">{participant.name}</span>
        </div>
      )}
      <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/50 rounded-md text-white text-xs">
        {isSpeaking && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
        {participant.name}{isLocal ? ' (You)' : ''}
      </div>
      {isSpeaking && (
        <div className="absolute inset-0 rounded-[var(--radius-card)] ring-2 ring-brand-400 pointer-events-none" />
      )}
    </div>
  );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────
function ChatPanel({ room, onClose }: { room: Room; onClose: () => void }) {
  const [input, setInput] = useState('');
  const messages = useMeetingStore((s) => s.chatMessages);
  const addMessage = useMeetingStore((s) => s.addChatMessage);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = {
      id: crypto.randomUUID(),
      senderName: room.localParticipant.name ?? 'You',
      senderId: room.localParticipant.identity,
      text: input.trim(),
      ts: Date.now(),
    };
    addMessage(msg);
    // Phase 1: send via LiveKit data channel
    const encoder = new TextEncoder();
    void room.localParticipant.publishData(encoder.encode(JSON.stringify({ type: 'chat', ...msg })), { reliable: true });
    setInput('');
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-glass)]">
        <h2 className="font-semibold">Chat</h2>
        <button onClick={onClose} className="btn-icon w-8 h-8"><X className="w-4 h-4" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-[var(--text-tertiary)] mt-8">No messages yet</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.senderId === room.localParticipant.identity ? 'items-end' : 'items-start'}`}>
            <span className="text-xs text-[var(--text-tertiary)] mb-0.5">{m.senderName}</span>
            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${m.senderId === room.localParticipant.identity ? 'bg-brand-500 text-white' : 'bg-[var(--surface-3)] text-[var(--text-primary)]'}`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="p-3 border-t border-[var(--border-glass)] flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 bg-[var(--surface-2)] border border-[var(--border-glass)] rounded-full px-4 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-brand-400"
        />
        <button type="submit" className="btn-icon active" disabled={!input.trim()}><Send className="w-4 h-4" /></button>
      </form>
    </div>
  );
}

// ─── Meeting Room ─────────────────────────────────────────────────────────────
export default function MeetingRoom() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const store = useMeetingStore();
  const roomRef = useRef<Room | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const [controlsVisible, setControlsVisible] = useState(true);
  const [panel, setPanel] = useState<'chat' | 'participants' | 'quiz' | null>(null);
  const [quizInvite, setQuizInvite] = useState<{ pin: string; hostName: string } | null>(null);
  const [noiseAlert, setNoiseAlert] = useState<string | null>(null);
  const [showHeadphonesHint, setShowHeadphonesHint] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Get local mic stream for noise control
  const [micStream, setMicStream] = useState<MediaStream | null>(null);

  // Phase 2: Noise control
  const { onManualUnmute } = useNoiseControl(micStream, {
    enabled: true,
    onAutoMute: (reason) => {
      setNoiseAlert(reason);
      roomRef.current?.localParticipant.setMicrophoneEnabled(false);
      store.setMicOn(false);
    },
    onSuggestHeadphones: () => setShowHeadphonesHint(true),
  });

  // Auto-hide controls
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function reset() {
      setControlsVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => setControlsVisible(false), 4000);
    }
    reset();
    window.addEventListener('mousemove', reset);
    window.addEventListener('touchstart', reset);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', reset);
      window.removeEventListener('touchstart', reset);
    };
  }, []);

  // Connect to LiveKit
  useEffect(() => {
    const token = sessionStorage.getItem(`lk-token-${code}`);
    const livekitUrl = sessionStorage.getItem('lk-url');
    const displayName = sessionStorage.getItem('lk-name') ?? 'Guest';

    async function connect() {
      const url = livekitUrl ?? (import.meta.env['VITE_LIVEKIT_URL'] as string | undefined);
      if (!token || !url) {
        store.setConnectionState('disconnected');
        return;
      }

      store.setConnectionState('connecting');
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: { resolution: VideoPresets.h720.resolution },
      });
      roomRef.current = room;

      room.on(RoomEvent.Connected, () => {
        store.setConnectionState('connected');
        store.setLocalParticipant(room.localParticipant);
        store.setRemoteParticipants([...room.remoteParticipants.values()]);

        // Capture mic stream for noise control
        const micTrack = room.localParticipant.getTrackPublication(Track.Source.Microphone);
        if (micTrack?.track?.mediaStream) {
          setMicStream(micTrack.track.mediaStream);
        }
      });

      room.on(RoomEvent.Disconnected, () => store.setConnectionState('disconnected'));
      room.on(RoomEvent.Reconnecting, () => store.setConnectionState('reconnecting'));
      room.on(RoomEvent.Reconnected, () => store.setConnectionState('connected'));

      room.on(RoomEvent.ParticipantConnected, () =>
        store.setRemoteParticipants([...room.remoteParticipants.values()])
      );
      room.on(RoomEvent.ParticipantDisconnected, () =>
        store.setRemoteParticipants([...room.remoteParticipants.values()])
      );

      // Chat & quiz messages via data channel
      room.on(RoomEvent.DataReceived, (data: Uint8Array, participant) => {
        try {
          const msg = JSON.parse(new TextDecoder().decode(data)) as any;
          if (msg.type === 'chat') {
            store.addChatMessage({ id: msg.id, senderName: msg.senderName, senderId: msg.senderId, text: msg.text, ts: msg.ts });
          } else if (msg.type === 'quiz_invite') {
            setQuizInvite({ pin: msg.pin, hostName: msg.hostName || participant?.name || 'Meeting Host' });
          }
        } catch { /* ignore */ }
      });

      try {
        await room.connect(url, token);
        await room.localParticipant.enableCameraAndMicrophone();
      } catch (e) {
        console.error('LiveKit connect error', e);
        store.setConnectionState('disconnected');
      }
    }

    void connect();

    return () => {
      roomRef.current?.disconnect();
      store.reset();
    };
  }, [code]); // eslint-disable-line react-hooks/exhaustive-deps

  async function toggleMic() {
    const room = roomRef.current;
    if (!room) return;
    const next = !store.isMicOn;
    await room.localParticipant.setMicrophoneEnabled(next);
    store.setMicOn(next);
    if (next) onManualUnmute();
    setNoiseAlert(null);
  }

  async function toggleCam() {
    const room = roomRef.current;
    if (!room) return;
    const next = !store.isCamOn;
    await room.localParticipant.setCameraEnabled(next);
    store.setCamOn(next);
  }

  async function toggleScreenShare() {
    const room = roomRef.current;
    if (!room) return;
    if (!store.isScreenSharing) {
      await room.localParticipant.setScreenShareEnabled(true);
      store.setScreenSharing(true);
    } else {
      await room.localParticipant.setScreenShareEnabled(false);
      store.setScreenSharing(false);
    }
  }

  function startRecording() {
    const stream = roomRef.current?.localParticipant.getTrackPublication(Track.Source.Camera)?.track?.mediaStream;
    if (!stream) return;
    recordedChunksRef.current = [];
    const mr = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    mr.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `jumbo-recording-${Date.now()}.webm`; a.click();
    };
    mr.start(1000);
    setMediaRecorder(mr);
    store.setRecording(true);
  }

  function stopRecording() {
    mediaRecorder?.stop();
    setMediaRecorder(null);
    store.setRecording(false);
  }

  async function leave() {
    if (store.isRecording) stopRecording();
    await roomRef.current?.disconnect();
    navigate('/home');
  }

  const allParticipants = store.localParticipant
    ? [store.localParticipant, ...store.remoteParticipants]
    : store.remoteParticipants;

  const gridCols = allParticipants.length <= 1 ? 1
    : allParticipants.length <= 4 ? 2
    : allParticipants.length <= 9 ? 3 : 4;

  const connLabel = {
    disconnected: 'Disconnected',
    connecting: 'Connecting…',
    connected: `Connected · Room ${code}`,
    reconnecting: 'Reconnecting…',
  }[store.connectionState];

  return (
    <div className="relative min-h-dvh bg-[var(--surface-base)] flex flex-col overflow-hidden">
      {/* Connection pill */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
        <div className={`connection-pill ${store.connectionState === 'connected' ? 'connected' : 'reconnecting'}`}>
          <span className="dot" />
          {connLabel}
        </div>
      </div>

      {/* Noise alert banner */}
      <AnimatePresence>
        {noiseAlert && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm max-w-sm text-center"
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{noiseAlert}</span>
            <button
              onClick={() => { void toggleMic(); setNoiseAlert(null); }}
              className="underline font-semibold ml-1 flex-shrink-0"
            >
              Unmute
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz invite banner */}
      <AnimatePresence>
        {quizInvite && panel !== 'quiz' && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 rounded-full bg-brand-500/25 border border-brand-400/40 text-brand-200 text-xs sm:text-sm shadow-xl backdrop-blur-md max-w-[92vw]"
          >
            <Gamepad2 className="w-4 h-4 text-brand-300 flex-shrink-0 animate-bounce" />
            <span className="truncate">
              <strong>{quizInvite.hostName}</strong> launched a Quiz! PIN: <span className="font-mono font-bold text-white">{quizInvite.pin}</span>
            </span>
            <button
              onClick={() => {
                setPanel('quiz');
              }}
              className="px-3 py-1 bg-brand-500 hover:bg-brand-600 text-white rounded-full text-xs font-bold transition-all shadow-md ml-1 flex-shrink-0"
            >
              Join
            </button>
            <button
              onClick={() => setQuizInvite(null)}
              className="btn-icon w-6 h-6 opacity-70 hover:opacity-100 flex-shrink-0"
              aria-label="Dismiss invite"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Headphones suggestion */}
      <AnimatePresence>
        {showHeadphonesHint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-30 glass-card-sm p-4 flex items-center gap-3 max-w-xs"
          >
            <Headphones className="w-5 h-5 text-brand-400" />
            <div className="text-sm">
              <p className="font-semibold">Try headphones</p>
              <p className="text-[var(--text-secondary)]">Multiple auto-mutes detected. Headphones prevent echo and background pickup.</p>
            </div>
            <button onClick={() => setShowHeadphonesHint(false)} className="btn-icon w-6 h-6 flex-shrink-0"><X className="w-3 h-3" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video grid + side panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video grid */}
        <div
          className="flex-1 p-4 grid gap-3 content-start"
          style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
          onClick={() => setControlsVisible(true)}
        >
          {store.localParticipant && (
            <ParticipantTile participant={store.localParticipant} isLocal />
          )}
          {store.remoteParticipants.map((p) => (
            <ParticipantTile key={p.identity} participant={p} isLocal={false} />
          ))}
          {allParticipants.length === 0 && (
            <div className="col-span-full flex items-center justify-center h-48 text-[var(--text-tertiary)] text-sm">
              {store.connectionState === 'connecting' ? 'Connecting to meeting…' : 'Waiting for others to join…'}
            </div>
          )}
        </div>

        {/* Side panels */}
        <AnimatePresence>
          {panel && (
            <motion.aside
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-80 md:w-96 glass-card rounded-none border-l border-[var(--border-glass)] flex flex-col"
            >
              {panel === 'chat' && roomRef.current && (
                <ChatPanel room={roomRef.current} onClose={() => setPanel(null)} />
              )}
              {panel === 'participants' && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-[var(--border-glass)]">
                    <h2 className="font-semibold">Participants ({allParticipants.length})</h2>
                    <button onClick={() => setPanel(null)} className="btn-icon w-8 h-8"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {allParticipants.map((p) => (
                      <div key={p.identity} className="flex items-center gap-3 p-2 rounded-[var(--radius-md)] hover:bg-[var(--surface-2)]">
                        <div className="w-8 h-8 rounded-full bg-brand-500/30 flex items-center justify-center text-sm font-bold text-brand-300">
                          {p.name?.[0] ?? '?'}
                        </div>
                        <span className="text-sm">{p.name ?? p.identity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {panel === 'quiz' && roomRef.current && (
                <MeetingQuizPanel
                  room={roomRef.current}
                  initialPin={quizInvite?.pin}
                  onClose={() => setPanel(null)}
                />
              )}
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Glass control bar */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
          >
            <div className="glass-card-sm px-4 py-3 flex items-center gap-2">
              <button id="room-mic-btn" className={`btn-icon ${store.isMicOn ? 'active' : ''}`} onClick={toggleMic} aria-label={store.isMicOn ? 'Mute' : 'Unmute'}>
                {store.isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              <button id="room-cam-btn" className={`btn-icon ${store.isCamOn ? 'active' : ''}`} onClick={toggleCam} aria-label={store.isCamOn ? 'Stop video' : 'Start video'}>
                {store.isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              <button id="room-share-btn" className={`btn-icon ${store.isScreenSharing ? 'active' : ''}`} onClick={toggleScreenShare} aria-label="Share screen">
                <Monitor className="w-5 h-5" />
              </button>
              <button
                id="room-quiz-btn"
                className={`btn-icon ${panel === 'quiz' ? 'active' : ''}`}
                onClick={() => setPanel(panel === 'quiz' ? null : 'quiz')}
                aria-label="Launch quiz in meeting"
              >
                <Gamepad2 className="w-5 h-5" />
              </button>
              <button id="room-chat-btn" className={`btn-icon ${panel === 'chat' ? 'active' : ''}`} onClick={() => setPanel(panel === 'chat' ? null : 'chat')} aria-label="Chat">
                <MessageSquare className="w-5 h-5" />
              </button>
              <button id="room-participants-btn" className={`btn-icon ${panel === 'participants' ? 'active' : ''}`} onClick={() => setPanel(panel === 'participants' ? null : 'participants')} aria-label="Participants">
                <Users className="w-5 h-5" />
              </button>
              <button
                id="room-record-btn"
                className={`btn-icon ${store.isRecording ? 'active' : ''}`}
                onClick={store.isRecording ? stopRecording : startRecording}
                aria-label={store.isRecording ? 'Stop recording' : 'Record'}
              >
                <Circle className={`w-5 h-5 ${store.isRecording ? 'fill-red-500 text-red-500 animate-pulse' : ''}`} />
              </button>
              <div className="w-px h-8 bg-[var(--border-glass-strong)] mx-1" />
              <button id="room-leave-btn" className="btn-danger flex items-center gap-2 px-4 text-sm" onClick={leave}>
                <PhoneOff className="w-4 h-4" />Leave
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!controlsVisible && (
        <button className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-xs text-[var(--text-tertiary)] flex items-center gap-1" onClick={() => setControlsVisible(true)}>
          <ChevronUp className="w-3 h-3" />Tap for controls
        </button>
      )}
    </div>
  );
}
