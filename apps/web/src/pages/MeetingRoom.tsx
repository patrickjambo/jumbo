import { useEffect, useCallback, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Room, RoomEvent, Track, ParticipantEvent, ConnectionQuality,
  type RemoteParticipant, type LocalParticipant,
  VideoPresets,
} from 'livekit-client';
import {
  Mic, MicOff, Video, VideoOff, Monitor, MessageSquare,
  Users, Gamepad2, Circle, PhoneOff, ChevronUp, X,
  Send, AlertTriangle, Headphones, Hand, LayoutGrid, UserSquare2,
  Lock, Unlock, UserMinus, ShieldAlert,
} from 'lucide-react';
import { useMeetingStore } from '../store';
import { useNoiseControl } from '../hooks/useNoiseControl';
import { useWakeLock } from '../hooks/useWakeLock';
import { MeetingQuizPanel } from '../components/MeetingQuizPanel';

// ─── Participant Tile ─────────────────────────────────────────────────────────
function ParticipantTile({
  participant,
  isLocal,
  isLarge = false,
}: {
  participant: LocalParticipant | RemoteParticipant;
  isLocal: boolean;
  isLarge?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [quality, setQuality] = useState<ConnectionQuality>(participant.connectionQuality);
  const raisedHands = useMeetingStore((s) => s.raisedHands);
  const isHandRaised = raisedHands.includes(participant.identity);

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

    const handleSpeaking = (speaking: boolean) => setIsSpeaking(speaking);
    const handleQuality = (q: ConnectionQuality) => setQuality(q);

    participant.on(ParticipantEvent.IsSpeakingChanged, handleSpeaking);
    participant.on(ParticipantEvent.ConnectionQualityChanged, handleQuality);

    return () => {
      participant.off(ParticipantEvent.IsSpeakingChanged, handleSpeaking);
      participant.off(ParticipantEvent.ConnectionQualityChanged, handleQuality);
    };
  }, [participant, isLocal]);

  return (
    <div
      className={`relative bg-[var(--surface-2)] rounded-[var(--radius-card)] overflow-hidden flex items-center justify-center transition-all ${
        isSpeaking ? 'ring-2 ring-brand-400' : ''
      } ${isLarge ? 'w-full h-full min-h-[360px]' : 'min-h-[160px]'}`}
    >
      <video
        ref={videoRef}
        autoPlay
        muted={isLocal}
        playsInline
        className={`w-full h-full object-cover ${!hasVideo ? 'hidden' : ''}`}
      />
      {!hasVideo && (
        <div className="flex flex-col items-center gap-2">
          <div className={`${isLarge ? 'w-24 h-24 text-4xl' : 'w-14 h-14 text-xl'} rounded-full bg-brand-500/30 flex items-center justify-center font-bold text-brand-300 shadow-md`}>
            {participant.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <span className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
            {participant.name}
          </span>
        </div>
      )}

      {/* Raised hand indicator (Spec §6.1) */}
      {isHandRaised && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="absolute top-2.5 right-2.5 z-10 px-2 py-1 rounded-full bg-amber-500/95 text-white font-bold text-xs shadow-lg flex items-center gap-1 backdrop-blur-md"
        >
          <span>✋</span>
          <span className="text-[10px] hidden sm:inline">Raised</span>
        </motion.div>
      )}

      {/* Name and audio indicator */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs z-10">
        {isSpeaking && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
        <span className="truncate max-w-[120px] sm:max-w-[160px]">
          {participant.name}{isLocal ? ' (You)' : ''}
        </span>
      </div>

      {/* Connection quality signal bars (Spec §6.2) */}
      <div
        className="absolute bottom-2 right-2 flex items-center gap-0.5 px-1.5 py-1 bg-black/60 backdrop-blur-sm rounded-md z-10"
        title={`Signal: ${quality === ConnectionQuality.Poor ? 'Poor' : quality === ConnectionQuality.Good ? 'Good' : 'Excellent'}`}
      >
        <span className={`w-1 h-1.5 rounded-sm ${quality === ConnectionQuality.Poor ? 'bg-red-400' : 'bg-green-400'}`} />
        <span className={`w-1 h-2.5 rounded-sm ${quality === ConnectionQuality.Poor ? 'bg-white/20' : quality === ConnectionQuality.Good ? 'bg-yellow-400' : 'bg-green-400'}`} />
        <span className={`w-1 h-3.5 rounded-sm ${quality === ConnectionQuality.Excellent ? 'bg-green-400' : 'bg-white/20'}`} />
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
    const encoder = new TextEncoder();
    void room.localParticipant.publishData(encoder.encode(JSON.stringify({ type: 'chat', ...msg })), { reliable: true });
    setInput('');
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-glass)]">
        <h2 className="font-semibold text-sm">In-Call Chat</h2>
        <button onClick={onClose} className="btn-icon w-8 h-8"><X className="w-4 h-4" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-xs text-[var(--text-tertiary)] mt-8">No messages yet. Send a chat to the room!</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.senderId === room.localParticipant.identity ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] text-[var(--text-tertiary)] mb-0.5">{m.senderName}</span>
            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs ${m.senderId === room.localParticipant.identity ? 'bg-brand-500 text-white' : 'bg-[var(--surface-3)] text-[var(--text-primary)]'}`}>
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
          className="flex-1 bg-[var(--surface-2)] border border-[var(--border-glass)] rounded-full px-4 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-brand-400"
        />
        <button type="submit" className="btn-icon active w-8 h-8 rounded-full" disabled={!input.trim()}><Send className="w-3.5 h-3.5" /></button>
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

  // Keep screen awake during meeting (Spec §11, §21)
  useWakeLock(true);

  const [controlsVisible, setControlsVisible] = useState(true);
  const [panel, setPanel] = useState<'chat' | 'participants' | 'quiz' | null>(null);
  const [quizInvite, setQuizInvite] = useState<{ pin: string; hostName: string } | null>(null);
  const [handAlert, setHandAlert] = useState<string | null>(null);
  const [noiseAlert, setNoiseAlert] = useState<string | null>(null);
  const [hostNotice, setHostNotice] = useState<string | null>(null);
  const [showHeadphonesHint, setShowHeadphonesHint] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [isRoomLocked, setIsRoomLocked] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const isHost = typeof window !== 'undefined' && sessionStorage.getItem('lk-is-host') === 'true';

  // Local mic stream for noise control
  const [micStream, setMicStream] = useState<MediaStream | null>(null);

  // Phase 2: Noise control hook
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
      timer = setTimeout(() => setControlsVisible(false), 4500);
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

  // Connect to LiveKit SFU
  useEffect(() => {
    const token = sessionStorage.getItem(`lk-token-${code}`);
    const livekitUrl = sessionStorage.getItem('lk-url');

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

      // Active speaker detection for Speaker View (Spec §6.1, §6.3)
      room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        if (speakers[0]) {
          store.setActiveSpeakerId(speakers[0].identity);
        }
      });

      // Data channel messages (chat, quiz invites, raised hands)
      room.on(RoomEvent.DataReceived, async (data: Uint8Array, participant) => {
        try {
          const msg = JSON.parse(new TextDecoder().decode(data)) as any;
          if (msg.type === 'chat') {
            store.addChatMessage({ id: msg.id, senderName: msg.senderName, senderId: msg.senderId, text: msg.text, ts: msg.ts });
          } else if (msg.type === 'quiz_invite') {
            setQuizInvite({ pin: msg.pin, hostName: msg.hostName || participant?.name || 'Meeting Host' });
          } else if (msg.type === 'raise_hand') {
            if (msg.raised) {
              store.toggleRaiseHand(msg.identity);
              setHandAlert(`${msg.name || 'Participant'} raised hand ✋`);
              setTimeout(() => setHandAlert(null), 3500);
            } else {
              store.lowerHand(msg.identity);
            }
          } else if (msg.type === 'host_mute') {
            if (msg.targetIdentity === room.localParticipant.identity) {
              void room.localParticipant.setMicrophoneEnabled(false);
              store.setMicOn(false);
              setHostNotice('The meeting host muted your microphone.');
              setTimeout(() => setHostNotice(null), 4000);
            }
          } else if (msg.type === 'host_remove') {
            if (msg.targetIdentity === room.localParticipant.identity) {
              await room.disconnect();
              alert('You have been removed from the meeting by the host.');
              navigate('/home');
            }
          } else if (msg.type === 'meeting_ended') {
            await room.disconnect();
            alert('The host has ended the meeting for all participants.');
            navigate('/home');
          } else if (msg.type === 'room_lock_changed') {
            setIsRoomLocked(msg.locked);
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

  function toggleHand() {
    if (!roomRef.current?.localParticipant) return;
    const lp = roomRef.current.localParticipant;
    const isRaised = store.raisedHands.includes(lp.identity);
    const nextRaised = !isRaised;

    store.toggleRaiseHand(lp.identity);
    const data = new TextEncoder().encode(
      JSON.stringify({
        type: 'raise_hand',
        identity: lp.identity,
        name: lp.name || 'Participant',
        raised: nextRaised,
      })
    );
    void lp.publishData(data, { reliable: true });
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

  function hostMuteParticipant(targetIdentity: string) {
    if (!roomRef.current?.localParticipant || !isHost) return;
    const data = new TextEncoder().encode(JSON.stringify({
      type: 'host_mute',
      targetIdentity,
    }));
    void roomRef.current.localParticipant.publishData(data, { reliable: true });
  }

  function hostRemoveParticipant(targetIdentity: string) {
    if (!roomRef.current?.localParticipant || !isHost) return;
    const data = new TextEncoder().encode(JSON.stringify({
      type: 'host_remove',
      targetIdentity,
    }));
    void roomRef.current.localParticipant.publishData(data, { reliable: true });
  }

  function toggleLockRoom() {
    if (!roomRef.current?.localParticipant || !isHost) return;
    const next = !isRoomLocked;
    setIsRoomLocked(next);
    const data = new TextEncoder().encode(JSON.stringify({
      type: 'room_lock_changed',
      locked: next,
    }));
    void roomRef.current.localParticipant.publishData(data, { reliable: true });
  }

  async function endMeetingForAll() {
    if (!roomRef.current?.localParticipant || !isHost) return;
    const data = new TextEncoder().encode(JSON.stringify({
      type: 'meeting_ended',
    }));
    void roomRef.current.localParticipant.publishData(data, { reliable: true });
    await leave();
  }

  const allParticipants = store.localParticipant
    ? [store.localParticipant, ...store.remoteParticipants]
    : store.remoteParticipants;

  // Active speaker resolution
  const speakerParticipant = allParticipants.find((p) => p.identity === store.activeSpeakerId)
    ?? store.remoteParticipants[0]
    ?? store.localParticipant
    ?? null;

  const isMyHandRaised = store.localParticipant ? store.raisedHands.includes(store.localParticipant.identity) : false;

  const gridCols = allParticipants.length <= 1 ? 1
    : allParticipants.length <= 4 ? 2
    : allParticipants.length <= 9 ? 3 : 4;

  const connLabel = {
    disconnected: 'Disconnected',
    connecting: 'Connecting…',
    connected: `Room ${code}`,
    reconnecting: 'Reconnecting…',
  }[store.connectionState];

  return (
    <div className="relative min-h-dvh bg-[var(--surface-base)] flex flex-col overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="absolute top-3 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Connection pill */}
        <div className="pointer-events-auto">
          <div className={`connection-pill ${store.connectionState === 'connected' ? 'connected' : 'reconnecting'}`}>
            <span className="dot" />
            {connLabel}
          </div>
        </div>

        {/* View Mode Switcher: Gallery vs Speaker (Spec §6.1) */}
        <div className="pointer-events-auto">
          <button
            onClick={() => store.setViewMode(store.viewMode === 'gallery' ? 'speaker' : 'gallery')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface-2)]/80 hover:bg-[var(--surface-3)] border border-[var(--border-glass)] text-xs font-semibold text-[var(--text-secondary)] hover:text-white transition-all shadow-md backdrop-blur-md"
            title={`Switch to ${store.viewMode === 'gallery' ? 'Speaker View' : 'Gallery View'}`}
          >
            {store.viewMode === 'gallery' ? <UserSquare2 className="w-3.5 h-3.5 text-brand-300" /> : <LayoutGrid className="w-3.5 h-3.5 text-accent-300" />}
            <span className="hidden sm:inline">{store.viewMode === 'gallery' ? 'Speaker View' : 'Gallery View'}</span>
          </button>
        </div>
      </div>

      {/* Floating Notifications Area */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 max-w-[92vw]">
        {/* Hand Raised notification */}
        <AnimatePresence>
          {handAlert && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="px-4 py-2 rounded-full bg-amber-500/25 border border-amber-400/40 text-amber-200 text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-2"
            >
              <span>{handAlert}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Host action notification */}
        <AnimatePresence>
          {hostNotice && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="px-4 py-2 rounded-full bg-blue-500/25 border border-blue-400/40 text-blue-200 text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-blue-300 flex-shrink-0" />
              <span>{hostNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Noise alert banner */}
        <AnimatePresence>
          {noiseAlert && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs sm:text-sm text-center shadow-lg backdrop-blur-md"
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
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-brand-500/30 border border-brand-400/40 text-brand-200 text-xs sm:text-sm shadow-xl backdrop-blur-md"
            >
              <Gamepad2 className="w-4 h-4 text-brand-300 flex-shrink-0 animate-bounce" />
              <span className="truncate">
                <strong>{quizInvite.hostName}</strong> started a Quiz! PIN: <span className="font-mono font-bold text-white">{quizInvite.pin}</span>
              </span>
              <button
                onClick={() => setPanel('quiz')}
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
      </div>

      {/* Headphones suggestion */}
      <AnimatePresence>
        {showHeadphonesHint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-30 glass-card-sm p-4 flex items-center gap-3 max-w-xs shadow-xl"
          >
            <Headphones className="w-5 h-5 text-brand-400" />
            <div className="text-xs">
              <p className="font-semibold">Try headphones</p>
              <p className="text-[var(--text-secondary)]">Multiple noise mutes detected. Headphones prevent acoustic echo.</p>
            </div>
            <button onClick={() => setShowHeadphonesHint(false)} className="btn-icon w-6 h-6 flex-shrink-0"><X className="w-3 h-3" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Video Area + Side Panel */}
      <div className="flex flex-1 overflow-hidden pt-12 pb-24">
        {/* Dynamic Video Stage: Speaker View vs Gallery View (Spec §6.1) */}
        {store.viewMode === 'speaker' && speakerParticipant ? (
          <div
            className="flex-1 flex flex-col p-4 gap-3 overflow-hidden"
            onClick={() => setControlsVisible(true)}
          >
            {/* Top thumbnail strip for other participants */}
            {allParticipants.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 h-28 flex-shrink-0">
                {allParticipants
                  .filter((p) => p.identity !== speakerParticipant.identity)
                  .map((p) => (
                    <div
                      key={p.identity}
                      className="w-40 h-full flex-shrink-0 cursor-pointer rounded-xl overflow-hidden ring-1 ring-[var(--border-glass)] hover:ring-brand-400 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        store.setActiveSpeakerId(p.identity);
                      }}
                    >
                      <ParticipantTile
                        participant={p}
                        isLocal={p.identity === store.localParticipant?.identity}
                      />
                    </div>
                  ))}
              </div>
            )}
            {/* Central Stage Speaker */}
            <div className="flex-1 h-full min-h-0">
              <ParticipantTile
                participant={speakerParticipant}
                isLocal={speakerParticipant.identity === store.localParticipant?.identity}
                isLarge
              />
            </div>
          </div>
        ) : (
          /* Standard Gallery Grid (Spec §6.2) */
          <div
            className="flex-1 p-4 grid gap-3 content-start overflow-y-auto"
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
        )}

        {/* Side Panels (Chat, Participants, Quiz) */}
        <AnimatePresence>
          {panel && (
            <motion.aside
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-80 md:w-96 glass-card rounded-none border-l border-[var(--border-glass)] flex flex-col z-20"
            >
              {panel === 'chat' && roomRef.current && (
                <ChatPanel room={roomRef.current} onClose={() => setPanel(null)} />
              )}

              {panel === 'participants' && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-[var(--border-glass)]">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-sm">Participants ({allParticipants.length})</h2>
                      {isHost && (
                        <button
                          onClick={toggleLockRoom}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-all ${
                            isRoomLocked
                              ? 'bg-red-500/20 border-red-400 text-red-300'
                              : 'bg-[var(--surface-3)] border-[var(--border-glass)] text-[var(--text-tertiary)] hover:text-white'
                          }`}
                          title={isRoomLocked ? 'Room is locked. Click to unlock.' : 'Room is unlocked. Click to lock.'}
                        >
                          {isRoomLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          <span>{isRoomLocked ? 'Locked' : 'Lock Room'}</span>
                        </button>
                      )}
                    </div>
                    <button onClick={() => setPanel(null)} className="btn-icon w-8 h-8"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {allParticipants.map((p) => {
                      const isRaised = store.raisedHands.includes(p.identity);
                      const isLocal = p.identity === store.localParticipant?.identity;
                      return (
                        <div
                          key={p.identity}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface-3)] transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-300 flex-shrink-0">
                              {p.name?.[0] ?? '?'}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-semibold truncate">{p.name ?? p.identity}</span>
                              {isLocal && (
                                <span className="text-[10px] text-brand-400 font-medium">(You{isHost ? ' · Host' : ''})</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {isRaised && (
                              <button
                                onClick={() => store.lowerHand(p.identity)}
                                className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[11px] font-bold flex items-center gap-1"
                                title="Click to lower hand"
                              >
                                <span>✋</span>
                                <span className="hidden sm:inline">Lower</span>
                              </button>
                            )}
                            {isHost && !isLocal && (
                              <>
                                <button
                                  onClick={() => hostMuteParticipant(p.identity)}
                                  className="btn-icon w-7 h-7 rounded-lg text-[var(--text-tertiary)] hover:text-amber-400"
                                  title="Mute participant"
                                >
                                  <MicOff className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => hostRemoveParticipant(p.identity)}
                                  className="btn-icon w-7 h-7 rounded-lg text-[var(--text-tertiary)] hover:text-red-400"
                                  title="Remove from meeting"
                                >
                                  <UserMinus className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
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

      {/* Floating Glass Control Bar */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 max-w-[95vw]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
          >
            <div className="glass-card-sm px-3 sm:px-4 py-2.5 flex items-center gap-1.5 sm:gap-2 shadow-2xl">
              <button
                id="room-mic-btn"
                className={`btn-icon ${store.isMicOn ? 'active' : ''}`}
                onClick={toggleMic}
                aria-label={store.isMicOn ? 'Mute' : 'Unmute'}
                title={store.isMicOn ? 'Mute' : 'Unmute'}
              >
                {store.isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                id="room-cam-btn"
                className={`btn-icon ${store.isCamOn ? 'active' : ''}`}
                onClick={toggleCam}
                aria-label={store.isCamOn ? 'Stop video' : 'Start video'}
                title={store.isCamOn ? 'Stop video' : 'Start video'}
              >
                {store.isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                id="room-share-btn"
                className={`btn-icon ${store.isScreenSharing ? 'active' : ''}`}
                onClick={toggleScreenShare}
                aria-label="Share screen"
                title="Share screen"
              >
                <Monitor className="w-5 h-5" />
              </button>

              {/* Raise Hand Button (Spec §6.1) */}
              <button
                id="room-hand-btn"
                className={`btn-icon ${isMyHandRaised ? 'active bg-amber-500/25 text-amber-300 border border-amber-400/50' : ''}`}
                onClick={toggleHand}
                aria-label={isMyHandRaised ? 'Lower Hand' : 'Raise Hand'}
                title={isMyHandRaised ? 'Lower Hand' : 'Raise Hand'}
              >
                <Hand className="w-5 h-5" />
              </button>

              {/* Quiz in Meeting Button (Spec §11) */}
              <button
                id="room-quiz-btn"
                className={`btn-icon ${panel === 'quiz' ? 'active' : ''}`}
                onClick={() => setPanel(panel === 'quiz' ? null : 'quiz')}
                aria-label="Meeting Quiz"
                title="Meeting Quiz"
              >
                <Gamepad2 className="w-5 h-5" />
              </button>

              <button
                id="room-chat-btn"
                className={`btn-icon ${panel === 'chat' ? 'active' : ''}`}
                onClick={() => setPanel(panel === 'chat' ? null : 'chat')}
                aria-label="Chat"
                title="Chat"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              <button
                id="room-participants-btn"
                className={`btn-icon ${panel === 'participants' ? 'active' : ''}`}
                onClick={() => setPanel(panel === 'participants' ? null : 'participants')}
                aria-label="Participants"
                title="Participants"
              >
                <Users className="w-5 h-5" />
              </button>

              <button
                id="room-record-btn"
                className={`btn-icon ${store.isRecording ? 'active' : ''}`}
                onClick={store.isRecording ? stopRecording : startRecording}
                aria-label={store.isRecording ? 'Stop recording' : 'Record'}
                title={store.isRecording ? 'Stop recording' : 'Record'}
              >
                <Circle className={`w-5 h-5 ${store.isRecording ? 'fill-red-500 text-red-500 animate-pulse' : ''}`} />
              </button>

              <div className="w-px h-7 bg-[var(--border-glass-strong)] mx-0.5 sm:mx-1" />

              <button
                id="room-leave-btn"
                className="btn-danger flex items-center gap-1.5 px-3 sm:px-4 text-xs sm:text-sm font-bold"
                onClick={() => {
                  if (isHost && allParticipants.length > 1) {
                    setShowEndDialog(true);
                  } else {
                    void leave();
                  }
                }}
              >
                <PhoneOff className="w-4 h-4" />
                <span>Leave</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!controlsVisible && (
        <button
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-xs text-[var(--text-tertiary)] flex items-center gap-1 hover:text-white"
          onClick={() => setControlsVisible(true)}
        >
          <ChevronUp className="w-3 h-3" />Tap for controls
        </button>
      )}

      {/* End Meeting / Leave Dialog for Host (Spec §6.1) */}
      <AnimatePresence>
        {showEndDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="glass-card w-full max-w-sm p-6 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                <PhoneOff className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base">Leave or End Meeting?</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  You are the meeting host. You can leave the call or end it for all participants.
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <button
                  onClick={endMeetingForAll}
                  className="btn-danger w-full py-2.5 rounded-xl text-xs font-bold"
                >
                  End Meeting for All
                </button>
                <button
                  onClick={leave}
                  className="btn-secondary w-full py-2.5 rounded-xl text-xs font-semibold"
                >
                  Leave Meeting Only
                </button>
                <button
                  onClick={() => setShowEndDialog(false)}
                  className="btn-ghost w-full py-2 text-xs text-[var(--text-tertiary)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
