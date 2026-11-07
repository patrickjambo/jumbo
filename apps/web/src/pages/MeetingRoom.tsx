import { useEffect, useCallback, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Room, ParticipantEvent, ConnectionQuality,
  type RemoteParticipant, type LocalParticipant,
  VideoPresets,
} from 'livekit-client';
import {
  Mic, MicOff, Video, VideoOff, Monitor, MessageSquare,
  Users, Gamepad2, Circle, PhoneOff, X,
  Send, AlertTriangle, Headphones, Hand, LayoutGrid, UserSquare2,
  Lock, Unlock, UserMinus, ShieldAlert,
  Copy, Check, Share2, Info, UserPlus, Home, Volume2, VolumeX, Activity, Volume1,
  Smile, Camera, Laptop, ChevronDown,
} from 'lucide-react';
import { useMeetingStore } from '../store';
import { useNoiseControl } from '../hooks/useNoiseControl';
import { useWakeLock } from '../hooks/useWakeLock';
import { MeetingQuizPanel } from '../components/MeetingQuizPanel';
import { useMeetingWebRTC } from '../hooks/useMeetingWebRTC';
import { ReactionPicker } from '../components/ReactionPicker';
import { FloatingReactions, type FloatingReaction } from '../components/FloatingReactions';
import { QUICK_REACTIONS } from '../lib/emojis';

// ─── Shared AudioContext for all remote participants (prevents browser limit) ─
let sharedAudioCtx: AudioContext | null = null;
function getSharedAudioCtx(): AudioContext {
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    sharedAudioCtx = new AudioContext({ latencyHint: 'interactive', sampleRate: 48000 });
  }
  if (sharedAudioCtx.state === 'suspended') {
    void sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
}

// Global speaker boost multiplier (1x = normal, 2.5x = boosted)
// Stored outside components so it persists across re-renders
let globalBoostGain = 1.0;
const boostGainNodes: Set<GainNode> = new Set();
function setGlobalBoost(multiplier: number) {
  globalBoostGain = multiplier;
  boostGainNodes.forEach((g) => {
    g.gain.setTargetAtTime(multiplier, g.context.currentTime, 0.05);
  });
}

// ─── Participant Tile ─────────────────────────────────────────────────────────
function ParticipantTile({
  participant,
  isLocal,
  isLarge = false,
  isActiveSpeaker = false,
  fallbackStream = null,
  activeReaction = null,
}: {
  participant: LocalParticipant | RemoteParticipant | any;
  isLocal: boolean;
  isLarge?: boolean;
  isActiveSpeaker?: boolean;
  fallbackStream?: MediaStream | null;
  activeReaction?: { emoji: string; ts: number } | null;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [quality, setQuality] = useState<ConnectionQuality>(participant?.connectionQuality ?? ConnectionQuality.Excellent);
  const raisedHands = useMeetingStore((s) => s.raisedHands);
  const isCamOn = useMeetingStore((s) => s.isCamOn);
  const isMicOn = useMeetingStore((s) => s.isMicOn);
  const isScreenSharing = useMeetingStore((s) => s.isScreenSharing);
  const isHandRaised = raisedHands.includes(participant?.identity);
  const isSharing = isLocal ? isScreenSharing : Boolean((participant as any)?.isScreenSharing);
  // Refs for Web Audio processing pipeline (remote participants only)
  const audioNodeCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let unmounted = false;
    let vadRaf = 0;

    function attach() {
      if (unmounted) return;

      if (isLocal) {
        const stream = fallbackStream || (participant as any)?.stream;
        if (stream && (isCamOn || isSharing) && videoRef.current) {
          if (videoRef.current.srcObject !== stream) videoRef.current.srcObject = stream;
          void videoRef.current.play().catch(() => {});
          const vTracks = stream.getVideoTracks?.() || [];
          setHasVideo(vTracks.length > 0 && vTracks.some((t: MediaStreamTrack) => t.enabled));
        } else {
          setHasVideo(false);
        }
      } else {
        const rp = participant as any;
        const stream: MediaStream | null = fallbackStream || rp?.stream || null;
        if (stream && videoRef.current) {
          if (videoRef.current.srcObject !== stream) videoRef.current.srcObject = stream;
          void videoRef.current.play().catch(() => {});
          const vTracks = (stream as MediaStream).getVideoTracks?.() || [];
          setHasVideo(vTracks.length > 0 && vTracks.some((t: MediaStreamTrack) => t.enabled) && (rp.isCamOn !== false || isSharing));
        } else {
          setHasVideo(false);
        }

        // ── Web Audio pipeline for remote audio ──
        if (stream) {
          const audioTracks = stream.getAudioTracks();
          if (audioTracks.length > 0) {
            audioNodeCleanupRef.current?.();
            audioNodeCleanupRef.current = null;

            try {
              const ctx = getSharedAudioCtx();
              const audioOnlyStream = new MediaStream(audioTracks);
              const source = ctx.createMediaStreamSource(audioOnlyStream);

              // Soft limiter
              const compressor = ctx.createDynamicsCompressor();
              compressor.threshold.value = -18;
              compressor.knee.value = 8;
              compressor.ratio.value = 6;
              compressor.attack.value = 0.003;
              compressor.release.value = 0.2;

              // Volume normalizer
              const gain = ctx.createGain();
              gain.gain.value = 0.9;

              // Boost node — controlled globally by the speaker boost toggle
              const boostNode = ctx.createGain();
              boostNode.gain.value = globalBoostGain;
              boostGainNodes.add(boostNode);

              // Chain: source → compressor → gain → boost → destination
              source.connect(compressor);
              compressor.connect(gain);
              gain.connect(boostNode);
              boostNode.connect(ctx.destination);

              // VAD: measure mic level for the animated bar
              const analyser = ctx.createAnalyser();
              analyser.fftSize = 256;
              source.connect(analyser);
              const buf = new Uint8Array(analyser.frequencyBinCount);
              function vadLoop() {
                vadRaf = requestAnimationFrame(vadLoop);
                analyser.getByteFrequencyData(buf);
                let sum = 0;
                for (const b of buf) sum += b;
                const level = sum / buf.length / 255;
                setMicLevel(level);
                setIsSpeaking(level > 0.04);
              }
              vadLoop();

              audioNodeCleanupRef.current = () => {
                cancelAnimationFrame(vadRaf);
                boostGainNodes.delete(boostNode);
                try { source.disconnect(); compressor.disconnect(); gain.disconnect(); boostNode.disconnect(); analyser.disconnect(); } catch {}
              };
            } catch (e) {
              console.warn('[Audio] Failed to create Web Audio pipeline, falling back', e);
            }
          }
        }
      }
    }

    attach();

    const handleSpeaking = (speaking: boolean) => setIsSpeaking(speaking);
    const handleQuality = (q: ConnectionQuality) => setQuality(q);

    participant?.on?.(ParticipantEvent.IsSpeakingChanged, handleSpeaking);
    participant?.on?.(ParticipantEvent.ConnectionQualityChanged, handleQuality);

    return () => {
      unmounted = true;
      cancelAnimationFrame(vadRaf);
      audioNodeCleanupRef.current?.();
      audioNodeCleanupRef.current = null;
      participant?.off?.(ParticipantEvent.IsSpeakingChanged, handleSpeaking);
      participant?.off?.(ParticipantEvent.ConnectionQualityChanged, handleQuality);
    };
  }, [participant, isLocal, isCamOn, isScreenSharing, (participant as any)?.isCamOn, (participant as any)?.isScreenSharing, fallbackStream]);

  const displayName = participant?.name || participant?.displayName || 'Guest';
  const initial = displayName[0]?.toUpperCase() ?? '?';
  const speaking = isSpeaking || isActiveSpeaker;

  // Noise warning: show badge if remote audio level is very high
  const isNoisy = !isLocal && micLevel > 0.35;

  return (
    <div
      className={`relative bg-[#1a1f2e] rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-200 ${
        speaking
          ? 'ring-[3px] ring-green-400 shadow-[0_0_20px_rgba(74,222,128,0.35)]'
          : isNoisy
          ? 'ring-[2px] ring-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
          : 'ring-1 ring-white/10'
      } ${isLarge ? 'w-full h-full' : 'w-full h-full'}`}
    >
      {/* Video — muted always (audio goes through Web Audio pipeline) */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`w-full h-full ${isSharing ? 'object-contain bg-black' : 'object-cover'} transition-opacity duration-200 ${
          isLocal && !isSharing ? 'scale-x-[-1]' : ''
        } ${!hasVideo ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}
      />

      {/* NOTE: Remote audio is now routed through Web Audio pipeline above, NOT via <audio> element */}

      {/* Avatar when camera off */}
      {!hasVideo && (
        <div className="flex flex-col items-center gap-2">
          <div
            className={`${isLarge ? 'w-24 h-24 text-3xl' : 'w-14 h-14 text-xl'} rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center font-bold text-white shadow-xl`}
          >
            {initial}
          </div>
          {/* Animated mic level bar under avatar */}
          {!isLocal && speaking && (
            <div className="flex items-end gap-0.5 h-3">
              {[0.4, 0.7, 1.0, 0.7, 0.4].map((scale, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-green-400"
                  style={{
                    height: `${Math.max(20, Math.min(100, micLevel * scale * 400))}%`,
                    transition: 'height 80ms ease',
                  }}
                />
              ))}
            </div>
          )}
          {!isLarge && (
            <span className="text-xs text-white/70 font-medium max-w-[100px] truncate">
              {displayName}
            </span>
          )}
        </div>
      )}

      {/* Raised hand indicator */}
      {isHandRaised && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="absolute top-2 right-2 z-10 px-2 py-1 rounded-full bg-amber-500 text-white font-bold text-xs shadow-lg flex items-center gap-1"
        >
          <Hand className="w-3 h-3" />
          <span className="hidden sm:inline text-[10px]">Raised</span>
        </motion.div>
      )}

      {/* Active emoji reaction badge (pops up on user's video tile) */}
      <AnimatePresence>
        {activeReaction && (
          <motion.div
            key={activeReaction.ts}
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: [0, 1.35, 1], y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
            className={`absolute top-2 ${isNoisy ? 'left-16' : 'left-2'} z-20 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-2xl shadow-2xl flex items-center justify-center pointer-events-none select-none`}
          >
            <span>{activeReaction.emoji}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Noisy participant warning badge */}
      {isNoisy && (
        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-amber-500/80 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1 shadow">
          <Activity className="w-2.5 h-2.5" />
          Noisy
        </div>
      )}

      {/* Bottom info bar: name + mic level waveform + quality */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2.5 py-1.5 bg-gradient-to-t from-black/70 to-transparent z-10">
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Live animated waveform bars when speaking */}
          {speaking && (
            <div className="flex items-end gap-px h-3.5 flex-shrink-0">
              {[0.5, 1.0, 0.7, 0.9, 0.6].map((scale, i) => (
                <div
                  key={i}
                  className="w-0.5 rounded-full bg-green-400"
                  style={{
                    height: `${Math.max(15, Math.min(100, micLevel * scale * 500))}%`,
                    transition: 'height 80ms ease',
                  }}
                />
              ))}
            </div>
          )}
          <span className="text-white text-xs font-semibold truncate max-w-[120px] sm:max-w-[160px]">
            {displayName}{isLocal ? ' (You)' : ''}
          </span>
          {isSharing && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-600/90 text-white font-semibold flex items-center gap-1 flex-shrink-0">
              <Monitor className="w-2.5 h-2.5" />
              <span>Screen</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Mic state */}
          {isLocal ? (
            isMicOn
              ? <Mic className="w-3 h-3 text-white/70" />
              : <MicOff className="w-3 h-3 text-red-400" />
          ) : (
            (participant as any)?.isMicOn === false
              ? <MicOff className="w-3 h-3 text-red-400" />
              : null
          )}
          {/* Signal bars */}
          <div className="flex items-end gap-px">
            <span className={`w-1 h-1.5 rounded-sm ${quality === ConnectionQuality.Poor ? 'bg-red-400' : 'bg-green-400'}`} />
            <span className={`w-1 h-2.5 rounded-sm ${quality === ConnectionQuality.Poor ? 'bg-white/20' : quality === ConnectionQuality.Good ? 'bg-yellow-400' : 'bg-green-400'}`} />
            <span className={`w-1 h-3.5 rounded-sm ${quality === ConnectionQuality.Excellent ? 'bg-green-400' : 'bg-white/20'}`} />
          </div>
        </div>
      </div>

      {/* Active speaker glow border */}
      {speaking && (
        <div className="absolute inset-0 rounded-2xl ring-[3px] ring-green-400 pointer-events-none" />
      )}
    </div>
  );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────
function ChatPanel({
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onReactMessage,
  localIdentity,
  onClose,
}: {
  onSendMessage: (text: string) => void;
  onEditMessage: (messageId: string, newText: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReactMessage?: (messageId: string, emoji: string) => void;
  localIdentity: string;
  onClose: () => void;
}) {
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);
  const [showInputEmojiPicker, setShowInputEmojiPicker] = useState(false);
  const messages = useMeetingStore((s) => s.chatMessages);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [isNearBottom, setIsNearBottom] = useState(true);
  const [hasNewBelow, setHasNewBelow] = useState(false);
  const isNearBottomRef = useRef(true);
  const prevMessagesLengthRef = useRef(messages.length);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = messagesContainerRef.current;
    if (!el) return;
    if (smooth) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } else {
      el.scrollTop = el.scrollHeight;
    }
    setIsNearBottom(true);
    isNearBottomRef.current = true;
    setHasNewBelow(false);
  }, []);

  const handleScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    // Consider near bottom if within 80px from bottom
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const near = distanceFromBottom < 80;
    setIsNearBottom(near);
    isNearBottomRef.current = near;
    if (near) setHasNewBelow(false);
  }, []);

  // Initial scroll to bottom on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom(false);
    }, 50);
    return () => clearTimeout(timer);
  }, [scrollToBottom]);

  // Keep scroll position when messages arrive:
  useEffect(() => {
    const count = messages.length;
    const isNew = count > prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = count;

    if (isNew) {
      const lastMsg = messages[messages.length - 1];
      const isMe = lastMsg?.senderId === localIdentity;

      // Always scroll to bottom if I sent it OR if user is already near bottom
      if (isMe || isNearBottomRef.current) {
        scrollToBottom(true);
      } else {
        // User has scrolled up reading earlier messages; keep their scroll position!
        setHasNewBelow(true);
      }
    }
  }, [messages, localIdentity, scrollToBottom]);

  // Auto-focus on open
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingId) setTimeout(() => editInputRef.current?.focus(), 30);
  }, [editingId]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    // sendChatMessage handles the optimistic add — don't add here too!
    onSendMessage(text);
    setInput('');
    setShowInputEmojiPicker(false);
    setTimeout(() => scrollToBottom(true), 50);
  }

  function startEdit(msg: { id: string; text: string }) {
    setEditingId(msg.id);
    setEditText(msg.text);
  }

  function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId || !editText.trim()) return;
    onEditMessage(editingId, editText.trim());
    setEditingId(null);
    setEditText('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText('');
  }

  function handleDelete(messageId: string) {
    onDeleteMessage(messageId);
  }

  function handleInsertEmoji(emoji: string) {
    setInput((prev) => prev + emoji);
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#111827] relative overflow-hidden">
      {/* Mobile grab handle */}
      <div className="sm:hidden flex justify-center pt-2 pb-0.5 flex-shrink-0">
        <div className="w-9 h-1 bg-white/20 rounded-full" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 sm:py-3 border-b border-white/10 flex-shrink-0">
        <h2 className="font-bold text-sm text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-violet-400" />
          <span>Chat</span>
          {messages.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-violet-600/40 text-violet-300 text-[10px] font-bold">
              {messages.filter((m) => !m.deletedAt).length}
            </span>
          )}
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          title="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-3 overscroll-contain relative scroll-smooth"
      >
        {messages.filter((m) => !m.deletedAt).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2.5 text-white/30 py-8">
            <MessageSquare className="w-10 h-10" />
            <span className="text-sm font-medium">No messages yet</span>
            <span className="text-xs text-white/25">Send a message to start the conversation</span>
          </div>
        ) : (
          <div className="text-center py-1 text-[10px] text-white/30 flex items-center justify-center gap-2 select-none">
            <div className="h-[1px] bg-white/10 flex-1 max-w-[60px]" />
            <span>Beginning of chat</span>
            <div className="h-[1px] bg-white/10 flex-1 max-w-[60px]" />
          </div>
        )}
        {messages.map((m) => {
          const isMe = m.senderId === localIdentity;
          const isDeleted = !!m.deletedAt;

          if (isDeleted) {
            return (
              <div key={m.id} className={`flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[11px] text-white/40 px-1">{isMe ? 'You' : m.senderName}</span>
                <div className="max-w-[88%] px-3.5 py-2 rounded-2xl text-xs italic text-white/30 bg-white/5 border border-white/10">
                  This message was deleted
                </div>
              </div>
            );
          }

          return (
            <div key={m.id} className={`flex flex-col gap-0.5 group ${isMe ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-1.5 px-1">
                <span className="text-[11px] text-white/40">{isMe ? 'You' : m.senderName}</span>
                {m.editedAt && <span className="text-[10px] text-white/25 italic">(edited)</span>}
              </div>

              {/* Inline edit mode */}
              {isMe && editingId === m.id ? (
                <form onSubmit={submitEdit} className="flex items-center gap-1.5 max-w-[88%] w-full">
                  <input
                    ref={editInputRef}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') cancelEdit();
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitEdit(e as any); }
                    }}
                    className="flex-1 min-w-0 bg-violet-600/20 border border-violet-500/60 rounded-2xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-violet-400"
                    style={{ fontSize: '16px' }}
                  />
                  <button type="submit" title="Save" className="p-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={cancelEdit} title="Cancel" className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="flex flex-col max-w-[88%]">
                  <div className={`flex items-end gap-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Message Bubble */}
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                        isMe
                          ? 'bg-violet-600 text-white rounded-br-md'
                          : 'bg-white/10 text-white rounded-bl-md'
                      }`}
                    >
                      {m.text}
                    </div>

                    {/* Action buttons — reaction + edit/delete */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mb-0.5 relative">
                      {/* React Button */}
                      <button
                        type="button"
                        onClick={() => setActiveReactionMsgId(activeReactionMsgId === m.id ? null : m.id)}
                        title="React"
                        className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                      >
                        <Smile className="w-3 h-3 text-amber-300" />
                      </button>

                      {/* Floating Quick Reaction Picker for this message */}
                      {activeReactionMsgId === m.id && (
                        <div className={`absolute bottom-full mb-1 z-30 flex items-center gap-1 p-1.5 bg-[#1f283d] border border-white/20 rounded-2xl shadow-2xl backdrop-blur-xl ${isMe ? 'right-0' : 'left-0'}`}>
                          {QUICK_REACTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                onReactMessage?.(m.id, emoji);
                                setActiveReactionMsgId(null);
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20 hover:scale-125 text-base transition-all active:scale-90"
                              title={emoji}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Edit / Delete (own messages only) */}
                      {isMe && (
                        <>
                          <button
                            onClick={() => startEdit(m)}
                            title="Edit message"
                            className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            title="Delete message"
                            className="w-6 h-6 rounded-lg bg-white/10 hover:bg-red-500/30 flex items-center justify-center text-white/50 hover:text-red-400 transition-colors"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                              <path d="M10 11v6"/><path d="M14 11v6"/>
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Message Reactions Pills */}
                  {m.reactions && Object.keys(m.reactions).length > 0 && (
                    <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {Object.entries(m.reactions).map(([emoji, userIds]) => {
                        const hasReacted = userIds.includes(localIdentity);
                        return (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => onReactMessage?.(m.id, emoji)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all active:scale-95 ${
                              hasReacted
                                ? 'bg-violet-600/50 border border-violet-400 text-white font-bold shadow-sm'
                                : 'bg-white/10 hover:bg-white/15 border border-white/10 text-white/80'
                            }`}
                            title={`${userIds.length} reaction${userIds.length > 1 ? 's' : ''}`}
                          >
                            <span>{emoji}</span>
                            <span className="text-[10px] opacity-80">{userIds.length}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div ref={endRef} className="h-1" />
      </div>

      {/* Floating Jump to Latest button */}
      <AnimatePresence>
        {!isNearBottom && messages.length > 2 && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={() => scrollToBottom(true)}
            className="absolute bottom-16 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-xl shadow-black/60 border border-white/20 active:scale-95 transition-all"
            title="Scroll to latest messages"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            <span>Latest</span>
            {hasNewBelow && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Emoji Picker Popover above Chat Input */}
      <AnimatePresence>
        {showInputEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute bottom-16 left-3 right-3 z-40 flex justify-center"
          >
            <ReactionPicker
              title="Insert Emoji"
              className="w-full max-w-sm"
              initialExpanded={true}
              autoCloseOnSelect={false}
              onSelectEmoji={(emoji) => {
                handleInsertEmoji(emoji);
              }}
              onClose={() => setShowInputEmojiPicker(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar — sticky at bottom, touch-friendly */}
      <form
        onSubmit={send}
        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-3 border-t border-white/10 bg-[#0e1420]"
      >
        <button
          type="button"
          onClick={() => setShowInputEmojiPicker((prev) => !prev)}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${
            showInputEmojiPicker
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
          }`}
          title="Pick emoji"
        >
          <Smile className="w-5 h-5 text-amber-300" />
        </button>

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send(e as any);
            }
          }}
          placeholder="Message everyone…"
          autoComplete="off"
          className="flex-1 min-w-0 bg-white/8 border border-white/15 rounded-2xl px-3.5 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-violet-500 focus:bg-white/12 transition-all"
          style={{ fontSize: '16px' /* prevents iOS zoom */ }}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-11 h-11 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-all active:scale-95 shadow-lg shadow-violet-600/30"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
    </div>
  );
}


// ─── Control Button ───────────────────────────────────────────────────────────
function CtrlBtn({
  id,
  icon,
  label,
  onClick,
  active = false,
  danger = false,
  warning = false,
  badge,
}: {
  id?: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  warning?: boolean;
  badge?: number;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      title={label}
      className={`relative flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-xl transition-all min-w-[52px] sm:min-w-[60px] group ${
        danger
          ? 'bg-red-600 hover:bg-red-500 text-white'
          : active
          ? 'bg-white/20 text-white hover:bg-white/25'
          : warning
          ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
          : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
      }`}
    >
      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">{icon}</span>
      <span className="text-[10px] font-medium truncate leading-none">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );
}

// ─── Meeting Room ─────────────────────────────────────────────────────────────
export default function MeetingRoom() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const store = useMeetingStore();
  const roomRef = useRef<Room | null>(null);

  useWakeLock(true);

  const [panel, setPanel] = useState<'chat' | 'participants' | 'quiz' | 'info' | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [showReadyBanner, setShowReadyBanner] = useState(true);
  const [quizInvite, setQuizInvite] = useState<{ pin: string; hostName: string } | null>(null);
  const [handAlert, setHandAlert] = useState<string | null>(null);
  const [noiseAlert, setNoiseAlert] = useState<string | null>(null);
  const [speakerBoosted, setSpeakerBoosted] = useState(false);
  const [screenShareAlert, setScreenShareAlert] = useState<string | null>(null);
  const [clockTime, setClockTime] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  // In-app removal/end dialog (replaces browser alert())
  const [removedNotice, setRemovedNotice] = useState<string | null>(null);
  const navigateRef = useRef(navigate);

  function toggleSpeakerBoost() {
    setSpeakerBoosted((prev) => {
      const next = !prev;
      setGlobalBoost(next ? 2.5 : 1.0);
      return next;
    });
  }
  const [hostNotice, setHostNotice] = useState<string | null>(null);
  const [showHeadphonesHint, setShowHeadphonesHint] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [isRoomLocked, setIsRoomLocked] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [unreadChat, setUnreadChat] = useState(0);
  const [unmuteRequest, setUnmuteRequest] = useState(false);

  // Emoji Reactions (Meeting floating & tile badges)
  const [showReactions, setShowReactions] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const [tileReactions, setTileReactions] = useState<Record<string, { emoji: string; ts: number }>>({});

  const handleReaction = useCallback(
    (reaction: { id: string; emoji: string; senderId: string; senderName: string; ts: number }) => {
      // 1. Add to floating reactions array
      const newFloating: FloatingReaction = {
        id: `${reaction.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        emoji: reaction.emoji,
        senderName: reaction.senderName,
        x: 18 + Math.random() * 64,
        drift: (Math.random() - 0.5) * 80,
      };
      setFloatingReactions((prev) => [...prev.slice(-30), newFloating]);

      // 2. Add to participant tile badge
      setTileReactions((prev) => ({
        ...prev,
        [reaction.senderId]: { emoji: reaction.emoji, ts: reaction.ts },
      }));

      // Cleanup floating item
      setTimeout(() => {
        setFloatingReactions((prev) => prev.filter((r) => r.id !== newFloating.id));
      }, 3400);

      // Cleanup tile badge after 3.5s
      setTimeout(() => {
        setTileReactions((prev) => {
          if (prev[reaction.senderId]?.ts === reaction.ts) {
            const next = { ...prev };
            delete next[reaction.senderId];
            return next;
          }
          return prev;
        });
      }, 3500);
    },
    []
  );

  // Keep navigate in a ref so callbacks don't capture stale closures
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);

  // Live clock — updates every minute
  useEffect(() => {
    const tick = () => setClockTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const isHost = (typeof window !== 'undefined' && sessionStorage.getItem('lk-is-host') === 'true') || !!store.localParticipant?.isHost;
  const participantName = (typeof window !== 'undefined' && (sessionStorage.getItem('lk-name') || localStorage.getItem('jumbo-display-name'))) || 'Guest';

  const {
    localStream,
    myIdentity,
    toggleMic: webrtcToggleMic,
    toggleCam: webrtcToggleCam,
    toggleScreenShare: webrtcToggleScreenShare,
    toggleHand: webrtcToggleHand,
    sendChatMessage: webrtcSendChatMessage,
    editChatMessage: webrtcEditChatMessage,
    deleteChatMessage: webrtcDeleteChatMessage,
    sendReaction: webrtcSendReaction,
    sendChatReaction: webrtcSendChatReaction,
    hostMute: webrtcHostMute,
    hostAskUnmute: webrtcHostAskUnmute,
    hostMuteAll: webrtcHostMuteAll,
    hostRemove: webrtcHostRemove,
    hostRemoveAll: webrtcHostRemoveAll,
    hostToggleLock: webrtcHostToggleLock,
    hostEndMeeting: webrtcHostEndMeeting,
    broadcastData: webrtcBroadcastData,
  } = useMeetingWebRTC({
    roomCode: code || '',
    participantName,
    isHost,
    onQuizInvite: (inv) => setQuizInvite(inv),
    onHandAlert: (alert) => { setHandAlert(alert); setTimeout(() => setHandAlert(null), 3500); },
    onHostNotice: (notice) => { setHostNotice(notice); setTimeout(() => setHostNotice(null), 4000); },
    onRoomLockedChanged: (locked) => setIsRoomLocked(locked),
    onMeetingEnded: () => { setRemovedNotice('The host has ended the meeting.'); },
    onRemovedByHost: () => {
      roomRef.current?.disconnect();
      setRemovedNotice('You were removed from this meeting by the host.');
    },
    onScreenShareStarted: (name) => {
      setScreenShareAlert(`${name} is now sharing their screen`);
      setTimeout(() => setScreenShareAlert(null), 4000);
    },
    onReaction: handleReaction,
    onUnmuteRequested: () => setUnmuteRequest(true),
  });

  // Track unread chat messages when panel is closed — only count incoming messages (not self)
  const prevMessageCountRef = useRef(0);
  useEffect(() => {
    const count = store.chatMessages.length;
    if (count > prevMessageCountRef.current && panel !== 'chat') {
      // Only count messages not from ourselves
      const newMessages = store.chatMessages.slice(prevMessageCountRef.current);
      const incomingCount = newMessages.filter((m) => m.senderId !== myIdentity).length;
      if (incomingCount > 0) setUnreadChat((n) => n + incomingCount);
    }
    prevMessageCountRef.current = count;
  }, [store.chatMessages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (panel === 'chat') setUnreadChat(0);
  }, [panel]);

  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  useEffect(() => { if (localStream) setMicStream(localStream); }, [localStream]);

  const { onManualUnmute } = useNoiseControl(micStream, {
    enabled: store.isMicOn,
    onAutoMute: (reason) => { setNoiseAlert(reason); webrtcToggleMic(); },
    onSuggestHeadphones: () => setShowHeadphonesHint(true),
  });

  // Optional: LiveKit SFU in parallel
  useEffect(() => {
    const token = sessionStorage.getItem(`lk-token-${code}`);
    const livekitUrl = sessionStorage.getItem('lk-url') ?? (import.meta.env['VITE_LIVEKIT_URL'] as string | undefined);
    if (!token || !livekitUrl || livekitUrl.includes('placeholder.livekit.cloud')) return;
    async function connectLiveKit() {
      try {
        const room = new Room({ adaptiveStream: true, dynacast: true, videoCaptureDefaults: { resolution: VideoPresets.h720.resolution } });
        roomRef.current = room;
        await room.connect(livekitUrl!, token!);
        await room.localParticipant.enableCameraAndMicrophone();
      } catch (e) { console.warn('LiveKit cloud skipped, using native WebRTC', e); }
    }
    void connectLiveKit();
    return () => { roomRef.current?.disconnect(); };
  }, [code]);

  const [showMobileShareModal, setShowMobileShareModal] = useState(false);

  function toggleMic() { const next = webrtcToggleMic(); if (next) onManualUnmute(); setNoiseAlert(null); }
  function toggleCam() { webrtcToggleCam(); }
  async function toggleScreenShare() { await handleShareClick(); }

  async function handleShareClick() {
    if (store.isScreenSharing) {
      await webrtcToggleScreenShare();
      return;
    }
    const hasDisplayMedia =
      typeof navigator !== 'undefined' &&
      typeof navigator.mediaDevices?.getDisplayMedia === 'function';

    if (!hasDisplayMedia) {
      setShowMobileShareModal(true);
    } else {
      await webrtcToggleScreenShare();
    }
  }

  function toggleHand() { webrtcToggleHand(); }

  function startRecording() {
    if (!localStream) return;
    recordedChunksRef.current = [];
    const mr = new MediaRecorder(localStream, { mimeType: 'video/webm;codecs=vp9' });
    mr.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `jumbo-recording-${Date.now()}.webm`; a.click();
    };
    mr.start(1000);
    setMediaRecorder(mr);
    store.setRecording(true);
  }

  function stopRecording() { mediaRecorder?.stop(); setMediaRecorder(null); store.setRecording(false); }

  async function leave() {
    if (store.isRecording) stopRecording();
    store.reset();
    navigate('/home');
  }

  function hostMuteParticipant(id: string) { if (isHost) webrtcHostMute(id); }
  function hostToggleParticipantMic(participant: any) {
    if (!isHost) return;
    const isMicOn = participant.isMicOn !== false;
    if (isMicOn) {
      webrtcHostMute(participant.identity);
    } else {
      webrtcHostAskUnmute(participant.identity);
      setHostNotice(`Asked ${participant.name || 'participant'} to unmute`);
      setTimeout(() => setHostNotice(null), 3000);
    }
  }
  function hostMuteAllParticipants() {
    if (!isHost) return;
    webrtcHostMuteAll();
    setHostNotice('Muted all participants');
    setTimeout(() => setHostNotice(null), 3000);
  }
  function hostRemoveParticipant(id: string, name?: string) {
    if (!isHost) return;
    webrtcHostRemove(id);
    setHostNotice(`Removed ${name || 'participant'} from the meeting`);
    setTimeout(() => setHostNotice(null), 3000);
  }
  function hostRemoveAllParticipants() {
    if (!isHost) return;
    webrtcHostRemoveAll();
    setHostNotice('Removed all participants from the meeting');
    setTimeout(() => setHostNotice(null), 3000);
  }
  function toggleLockRoom() { if (!isHost) return; const next = !isRoomLocked; setIsRoomLocked(next); webrtcHostToggleLock(next); }
  async function endMeetingForAll() { if (!isHost) return; webrtcHostEndMeeting(); await leave(); }

  const allParticipants = store.localParticipant
    ? [store.localParticipant, ...store.remoteParticipants]
    : store.remoteParticipants;

  const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/join/${code}` : '';

  const copyInviteLink = async () => {
    try { await navigator.clipboard.writeText(inviteUrl); }
    catch { const el = document.createElement('textarea'); el.value = inviteUrl; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); }
    setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2200);
  };

  const copyPin = async () => {
    if (!code) return;
    try { await navigator.clipboard.writeText(code); }
    catch { const el = document.createElement('textarea'); el.value = code; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); }
    setCopiedPin(true); setTimeout(() => setCopiedPin(false), 2200);
  };

  const shareMeeting = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try { await navigator.share({ title: 'Join my Jumbo meeting', text: `Join with PIN: ${code}\n${inviteUrl}`, url: inviteUrl }); }
      catch { /* cancelled */ }
    } else { await copyInviteLink(); }
  };

  // Keyboard shortcuts: M=Mic, V=Cam, H=Hand, C=Chat, P=Participants, I=Info, Esc=Close panel
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      if (key === 'm') { e.preventDefault(); toggleMic(); }
      else if (key === 'v') { e.preventDefault(); toggleCam(); }
      else if (key === 'h') { e.preventDefault(); toggleHand(); }
      else if (key === 'c') { e.preventDefault(); setPanel((p) => p === 'chat' ? null : 'chat'); }
      else if (key === 'p') { e.preventDefault(); setPanel((p) => p === 'participants' ? null : 'participants'); }
      else if (key === 'i') { e.preventDefault(); setPanel((p) => p === 'info' ? null : 'info'); }
      else if (key === 'r') { e.preventDefault(); setShowReactions((prev) => !prev); }
      else if (e.key === 'Escape') { setPanel(null); setShowEndDialog(false); setShowReactions(false); }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [store.isMicOn, store.isCamOn]); // eslint-disable-line react-hooks/exhaustive-deps

  // Active speaker resolution
  const activeSpeakerId = store.activeSpeakerId;
  const isMyHandRaised = store.localParticipant ? store.raisedHands.includes(store.localParticipant.identity) : false;

  // Gallery grid cols based on participant count.
  // Fewer columns = bigger tiles = no overlap. Rows fill available height evenly.
  const count = allParticipants.length;
  const gridCols = count <= 1 ? 1
    : count <= 2 ? 2
    : count <= 4 ? 2
    : count <= 6 ? 3
    : count <= 9 ? 3
    : 4;
  // Number of rows needed — used to give each row equal height inside the container
  const gridRows = Math.ceil(count / gridCols);

  const connLabel = {
    disconnected: 'Disconnected',
    connecting: 'Connecting…',
    connected: `Room ${code}`,
    reconnecting: 'Reconnecting…',
  }[store.connectionState];

  const isConnected = store.connectionState === 'connected';

  // Speaker view: find the active speaker or first remote participant
  const speakerParticipant = allParticipants.find((p) => p.identity === activeSpeakerId)
    ?? store.remoteParticipants[0]
    ?? store.localParticipant
    ?? null;

  return (
    // Full viewport, no scrolling on the outer wrapper — layout is fixed.
    <div className="fixed inset-0 bg-[#0f1117] text-white flex flex-col select-none overflow-hidden">

      {/* ── TOP HEADER BAR ──────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-[#1a1f2e]/90 backdrop-blur-md border-b border-white/10 z-30">
        {/* Left: Home button + connection + room code */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => {
              if (window.confirm('Leave meeting and return to Home?')) {
                leave();
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/70 hover:text-white transition-all flex-shrink-0"
            title="Leave and return to Home"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${
            isConnected
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'}`} />
            <span>{connLabel}</span>
          </div>

          {/* Room PIN — click to copy */}
          {code && (
            <button
              onClick={copyInviteLink}
              id="room-header-pin-btn"
              title="Copy invite link"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/70 hover:text-white transition-all group"
            >
              <span className="text-[10px] font-bold tracking-wider text-violet-400">PIN:</span>
              <span className="font-mono text-white font-bold tracking-wider">{code}</span>
              {copiedLink
                ? <Check className="w-3.5 h-3.5 text-emerald-400" />
                : <Copy className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
              }
            </button>
          )}
        </div>

        {/* Center: live clock */}
        <div className="hidden sm:block text-xs text-white/50 font-mono tabular-nums">
          {clockTime}
        </div>

        {/* Right: view switcher + invite */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => store.setViewMode(store.viewMode === 'gallery' ? 'speaker' : 'gallery')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/70 hover:text-white transition-all"
            title={`Switch to ${store.viewMode === 'gallery' ? 'Speaker View' : 'Gallery View'}`}
          >
            {store.viewMode === 'gallery'
              ? <UserSquare2 className="w-3.5 h-3.5 text-violet-300" />
              : <LayoutGrid className="w-3.5 h-3.5 text-indigo-300" />
            }
            <span className="hidden sm:inline">{store.viewMode === 'gallery' ? 'Speaker' : 'Gallery'}</span>
          </button>

          <button
            id="room-header-invite-btn"
            onClick={() => setPanel(panel === 'info' ? null : 'info')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold transition-all ${
              panel === 'info'
                ? 'bg-violet-600 text-white border-violet-500'
                : 'bg-violet-500/15 hover:bg-violet-500/25 border-violet-400/30 text-violet-300 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Invite</span>
          </button>
        </div>
      </div>

      {/* ── FLOATING ZOOM-STYLE EMOJI REACTIONS ──────────────────────────────── */}
      <FloatingReactions reactions={floatingReactions} />

      {/* ── FLOATING TOASTS / NOTIFICATIONS ──────────────────────────────────── */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 max-w-[92vw] pointer-events-none">
        <AnimatePresence>
          {unmuteRequest && (
            <motion.div
              key="unmute-req"
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-violet-600/95 border border-violet-400/50 text-white text-xs font-semibold shadow-2xl backdrop-blur-xl"
            >
              <Mic className="w-4 h-4 text-emerald-300 animate-pulse flex-shrink-0" />
              <span>The host is asking you to unmute your microphone</span>
              <div className="flex items-center gap-1.5 ml-1">
                <button
                  onClick={() => {
                    toggleMic();
                    setUnmuteRequest(false);
                  }}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-md active:scale-95"
                >
                  Unmute
                </button>
                <button
                  onClick={() => setUnmuteRequest(false)}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-xl transition-all"
                >
                  Stay Muted
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {handAlert && (
            <motion.div key="hand" initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}
              className="pointer-events-auto px-4 py-2 rounded-full bg-amber-500/25 border border-amber-400/40 text-amber-200 text-xs font-semibold shadow-lg backdrop-blur-md">
              {handAlert}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {(copiedLink || copiedPin) && (
            <motion.div key="copy" initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}
              className="pointer-events-auto px-4 py-2 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-300" />
              {copiedPin ? `PIN ${code} copied!` : 'Invite link copied!'}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {hostNotice && (
            <motion.div key="host" initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}
              className="pointer-events-auto px-4 py-2 rounded-full bg-blue-500/25 border border-blue-400/40 text-blue-200 text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-300" /> {hostNotice}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {noiseAlert && (
            <motion.div key="noise" initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-lg backdrop-blur-md">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{noiseAlert}</span>
              <button onClick={() => { toggleMic(); setNoiseAlert(null); }} className="underline font-bold ml-1">Unmute</button>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {screenShareAlert && (
            <motion.div key="screenshare" initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}
              className="pointer-events-auto px-4 py-2 rounded-full bg-indigo-500/25 border border-indigo-400/40 text-indigo-200 text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-2">
              <Monitor className="w-4 h-4 text-indigo-300 flex-shrink-0" />
              {screenShareAlert}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {quizInvite && panel !== 'quiz' && (
            <motion.div key="quiz" initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-full bg-violet-500/30 border border-violet-400/40 text-violet-200 text-xs font-semibold shadow-xl backdrop-blur-md">
              <Gamepad2 className="w-4 h-4 text-violet-300 animate-bounce flex-shrink-0" />
              <span className="truncate"><strong>{quizInvite.hostName}</strong> started a Quiz! PIN: <span className="font-mono font-bold text-white">{quizInvite.pin}</span></span>
              <button onClick={() => setPanel('quiz')} className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-full text-xs font-bold transition-all ml-1">Join</button>
              <button onClick={() => setQuizInvite(null)} className="w-5 h-5 flex items-center justify-center text-white/50 hover:text-white"><X className="w-3.5 h-3.5" /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── HEADPHONES HINT ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showHeadphonesHint && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-16 left-4 z-40 bg-[#1e2740] border border-white/15 rounded-2xl p-4 flex items-center gap-3 max-w-xs shadow-2xl backdrop-blur-md">
            <Headphones className="w-5 h-5 text-violet-400 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-white">Try headphones</p>
              <p className="text-white/60 mt-0.5">Prevents echo and acoustic interference for all participants.</p>
            </div>
            <button onClick={() => setShowHeadphonesHint(false)} className="w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center flex-shrink-0">
              <X className="w-3 h-3 text-white/50" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT: VIDEO AREA + SIDE PANEL ─────────────────────────────
          flex-1 takes remaining height between top bar and bottom controls.
          overflow-hidden on parent; the video grid inside is scrollable.
      */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── VIDEO STAGE ─────────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {store.viewMode === 'speaker' && speakerParticipant ? (
            /* ── SPEAKER VIEW ── */
            <div className="flex-1 flex flex-col min-h-0 p-3 gap-3">
              {/* Thumbnail strip (other participants) — horizontally scrollable */}
              {allParticipants.length > 1 && (
                <div className="flex gap-2 overflow-x-auto flex-shrink-0 h-28 pb-1 scrollbar-thin">
                  {allParticipants
                    .filter((p) => p.identity !== speakerParticipant.identity)
                    .map((p) => (
                      <div
                        key={p.identity}
                        onClick={() => store.setActiveSpeakerId(p.identity)}
                        className="w-40 h-full flex-shrink-0 cursor-pointer rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-violet-400 transition-all"
                      >
                        <ParticipantTile
                          participant={p}
                          isLocal={p.identity === store.localParticipant?.identity}
                          isActiveSpeaker={p.identity === activeSpeakerId}
                          fallbackStream={p.identity === store.localParticipant?.identity ? localStream : (p as any).stream}
                          activeReaction={tileReactions[p.identity] || null}
                        />
                      </div>
                    ))}
                </div>
              )}
              {/* Main speaker tile */}
              <div className="flex-1 min-h-0 rounded-2xl overflow-hidden">
                <ParticipantTile
                  participant={speakerParticipant}
                  isLocal={speakerParticipant.identity === store.localParticipant?.identity}
                  isLarge
                  isActiveSpeaker={speakerParticipant.identity === activeSpeakerId}
                  fallbackStream={speakerParticipant.identity === store.localParticipant?.identity ? localStream : (speakerParticipant as any).stream}
                  activeReaction={tileReactions[speakerParticipant.identity] || null}
                />
              </div>
            </div>
          ) : (
            /* ── GALLERY VIEW — height-distributed grid, NO overlap ── */
            <div
              className="flex-1 min-h-0 p-3"
              style={{
                display: 'grid',
                // Each column takes equal width
                gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                // Each row takes equal share of the container height — prevents overlap
                gridTemplateRows: count > 0 ? `repeat(${gridRows}, minmax(0, 1fr))` : '1fr',
                gap: '10px',
              }}
            >
              {store.localParticipant && (
                // min-h-0 is critical — prevents grid items from expanding beyond their cell
                <div className="min-h-0 rounded-2xl overflow-hidden">
                  <ParticipantTile
                    participant={store.localParticipant}
                    isLocal
                    isActiveSpeaker={store.localParticipant.identity === activeSpeakerId}
                    fallbackStream={localStream}
                    activeReaction={tileReactions[store.localParticipant.identity] || null}
                  />
                </div>
              )}
              {store.remoteParticipants.map((p) => (
                <div key={p.identity} className="min-h-0 rounded-2xl overflow-hidden">
                  <ParticipantTile
                    participant={p}
                    isLocal={false}
                    isActiveSpeaker={p.identity === activeSpeakerId}
                    fallbackStream={(p as any).stream}
                    activeReaction={tileReactions[p.identity] || null}
                  />
                </div>
              ))}
              {allParticipants.length === 0 && (
                <div
                  className="flex flex-col items-center justify-center text-white/40 text-sm gap-2"
                  style={{ gridColumn: `1 / -1` }}
                >
                  <Users className="w-8 h-8" />
                  <span>{store.connectionState === 'connecting' ? 'Connecting to meeting…' : 'Waiting for others to join…'}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── SIDE PANEL ───────────────────────────────────────────────────────
             MOBILE: Chat opens as a fixed bottom-sheet above the 2-row control bar.
                     Height is capped at 65 vh so the input bar is always visible.
                     Other panels (People, Quiz, Info) overlay full-height.
             DESKTOP (sm+): Inline sibling panel sliding in from the right.
        */}

        {/* ── MOBILE CHAT DRAWER (< sm) ── */}
        <AnimatePresence>
          {panel === 'chat' && (
            <>
              {/* Click-away backdrop to close chat */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPanel(null)}
                className="sm:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]"
              />
              <motion.div
                key="mobile-chat"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 340, damping: 36 }}
                className="sm:hidden fixed left-0 right-0 z-40 flex flex-col bg-[#111827] border-t border-white/15 rounded-t-3xl shadow-2xl overflow-hidden"
                style={{
                  bottom: '104px',
                  height: '68vh',
                  maxHeight: 'calc(100dvh - 120px)',
                }}
              >
                <ChatPanel
                  onSendMessage={webrtcSendChatMessage}
                  onEditMessage={webrtcEditChatMessage}
                  onDeleteMessage={webrtcDeleteChatMessage}
                  onReactMessage={webrtcSendChatReaction}
                  localIdentity={myIdentity}
                  onClose={() => setPanel(null)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── MOBILE NON-CHAT FULL-OVERLAY (People / Quiz / Info, < sm) ── */}
        <AnimatePresence>
          {panel && panel !== 'chat' && (
            <motion.div
              key={`mobile-${panel}`}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 36 }}
              className="sm:hidden fixed inset-x-0 top-0 z-40 flex flex-col bg-[#111827] overflow-hidden shadow-2xl"
              style={{ bottom: '104px' }}
            >
              {/* Participants panel (mirrors desktop) */}
              {panel === 'participants' && (
                <div className="flex flex-col h-full">
                  <div className="flex flex-col px-4 pt-3 pb-2 border-b border-white/10 gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-violet-400" />
                        <h2 className="font-bold text-sm text-white">Participants ({allParticipants.length})</h2>
                        {isHost && (
                          <button
                            onClick={toggleLockRoom}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-all ${
                              isRoomLocked
                                ? 'bg-red-500/20 border-red-400 text-red-300'
                                : 'bg-white/10 border-white/10 text-white/50 hover:text-white'
                            }`}
                          >
                            {isRoomLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            <span>{isRoomLocked ? 'Locked' : 'Lock'}</span>
                          </button>
                        )}
                      </div>
                      <button onClick={() => setPanel(null)} className="w-9 h-9 rounded-xl hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                    {isHost && store.remoteParticipants.length > 0 && (
                      <div className="flex items-center gap-2">
                        <button onClick={hostMuteAllParticipants} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-bold transition-all" title="Mute all participants">
                          <VolumeX className="w-3.5 h-3.5" /><span>Mute All</span>
                        </button>
                        <button onClick={hostRemoveAllParticipants} className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 text-[11px] font-bold transition-all" title="Remove all participants">
                          <UserMinus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                    {allParticipants.map((p) => {
                      const isRaised = store.raisedHands.includes(p.identity);
                      const isLocalP = p.identity === store.localParticipant?.identity;
                      const pMicOn = isLocalP ? store.isMicOn : (p as any).isMicOn !== false;
                      return (
                        <div key={p.identity} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${isLocalP ? 'bg-gradient-to-br from-violet-600 to-indigo-700' : 'bg-gradient-to-br from-indigo-600 to-violet-700'}`}>
                              {p.name?.[0] ?? '?'}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold truncate text-white">{p.name ?? p.identity}</span>
                                {pMicOn ? <Mic className="w-3 h-3 text-green-400 flex-shrink-0" /> : <MicOff className="w-3 h-3 text-red-400 flex-shrink-0" />}
                                {isRaised && <Hand className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                              </div>
                              <span className="text-[10px] text-white/40">{isLocalP ? (isHost ? 'You · Host' : 'You') : 'Participant'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {isHost && !isLocalP && (
                              <>
                                <button
                                  onClick={() => hostToggleParticipantMic(p)}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                    pMicOn
                                      ? 'bg-white/5 hover:bg-amber-500/20 text-green-400 hover:text-amber-300'
                                      : 'bg-red-500/15 hover:bg-emerald-500/20 text-red-400 hover:text-emerald-300'
                                  }`}
                                  title={pMicOn ? 'Mute this participant' : 'Ask participant to unmute'}
                                >
                                  {pMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                                </button>
                                <button onClick={() => hostRemoveParticipant(p.identity, p.name)} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 flex items-center justify-center transition-all" title="Remove">
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
              {/* Quiz panel */}
              {panel === 'quiz' && (
                <MeetingQuizPanel
                  room={roomRef.current || { localParticipant: { name: participantName, identity: myIdentity, publishData: (data: Uint8Array) => webrtcBroadcastData(data) } }}
                  initialPin={quizInvite?.pin}
                  onClose={() => setPanel(null)}
                />
              )}
              {/* Info panel */}
              {panel === 'info' && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <div className="flex items-center gap-2"><Info className="w-4 h-4 text-violet-400" /><h2 className="font-bold text-sm text-white">Meeting Details</h2></div>
                    <button onClick={() => setPanel(null)} className="w-9 h-9 rounded-xl hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">Meeting PIN</span>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-2xl font-black text-white tracking-widest select-all">{code}</span>
                        <button onClick={copyPin} className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold flex items-center gap-1.5 transition-colors">
                          {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}<span>{copiedPin ? 'Copied!' : 'Copy PIN'}</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-white/5 rounded-xl border border-white/10">
                      <input type="text" readOnly value={inviteUrl} className="bg-transparent text-xs text-white/60 font-mono flex-1 outline-none truncate select-all" />
                      <button onClick={copyInviteLink} className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-xs font-bold rounded-lg flex items-center gap-1 flex-shrink-0 transition-colors">
                        {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}<span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                      </button>
                    </div>
                    <button onClick={shareMeeting} className="w-full py-2.5 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 border border-violet-400/30 text-violet-300 text-xs font-bold flex items-center justify-center gap-2 transition-all">
                      <Share2 className="w-4 h-4" /> Share joining info
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── DESKTOP PANEL (sm+): all panels inline ── */}
        <AnimatePresence>
          {panel && (
            <motion.aside
              key="desktop-panel"
              initial={{ x: 340, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 340, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="hidden sm:flex flex-col w-80 lg:w-96 flex-shrink-0 bg-[#111827] border-l border-white/10 z-20 overflow-hidden"
            >
              {panel === 'chat' && (
                <ChatPanel onSendMessage={webrtcSendChatMessage} onEditMessage={webrtcEditChatMessage} onDeleteMessage={webrtcDeleteChatMessage} onReactMessage={webrtcSendChatReaction} localIdentity={myIdentity} onClose={() => setPanel(null)} />
              )}

              {panel === 'participants' && (
                <div className="flex flex-col h-full">
                  <div className="flex flex-col px-4 pt-3 pb-2 border-b border-white/10 gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-violet-400" />
                        <h2 className="font-bold text-sm text-white">Participants ({allParticipants.length})</h2>
                        {isHost && (
                          <button
                            onClick={toggleLockRoom}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-all ${
                              isRoomLocked
                                ? 'bg-red-500/20 border-red-400 text-red-300'
                                : 'bg-white/10 border-white/10 text-white/50 hover:text-white'
                            }`}
                          >
                            {isRoomLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            <span>{isRoomLocked ? 'Locked' : 'Lock'}</span>
                          </button>
                        )}
                      </div>
                      <button onClick={() => setPanel(null)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Host bulk controls */}
                    {isHost && store.remoteParticipants.length > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={hostMuteAllParticipants}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-bold transition-all"
                          title="Mute all participants"
                        >
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Mute All</span>
                        </button>
                        <button
                          onClick={hostRemoveAllParticipants}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 text-[11px] font-bold transition-all"
                          title="Remove all participants"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                    {allParticipants.map((p) => {
                      const isRaised = store.raisedHands.includes(p.identity);
                      const isLocalP = p.identity === store.localParticipant?.identity;
                      const pMicOn = isLocalP ? store.isMicOn : (p as any).isMicOn !== false;
                      return (
                        <div key={p.identity} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                              isLocalP ? 'bg-gradient-to-br from-violet-600 to-indigo-700' : 'bg-gradient-to-br from-indigo-600 to-violet-700'
                            }`}>
                              {p.name?.[0] ?? '?'}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold truncate text-white">{p.name ?? p.identity}</span>
                                {/* Mic indicator */}
                                {pMicOn
                                  ? <Mic className="w-3 h-3 text-green-400 flex-shrink-0" />
                                  : <MicOff className="w-3 h-3 text-red-400 flex-shrink-0" />}
                                {isRaised && <Hand className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                              </div>
                              <span className="text-[10px] text-white/40">
                                {isLocalP ? (isHost ? 'You · Host' : 'You') : 'Participant'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {isHost && !isLocalP && (
                              <>
                                {/* Mute / Unmute */}
                                <button
                                  onClick={() => hostToggleParticipantMic(p)}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                    pMicOn
                                      ? 'bg-white/5 hover:bg-amber-500/20 text-green-400 hover:text-amber-300'
                                      : 'bg-red-500/15 hover:bg-emerald-500/20 text-red-400 hover:text-emerald-300'
                                  }`}
                                  title={pMicOn ? 'Mute this participant' : 'Ask participant to unmute'}
                                >
                                  {pMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                                </button>
                                {/* Remove */}
                                <button
                                  onClick={() => hostRemoveParticipant(p.identity, p.name)}
                                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 flex items-center justify-center transition-all"
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

              {panel === 'quiz' && (
                <MeetingQuizPanel
                  room={roomRef.current || {
                    localParticipant: {
                      name: participantName,
                      identity: myIdentity,
                      publishData: (data: Uint8Array) => webrtcBroadcastData(data),
                    },
                  }}
                  initialPin={quizInvite?.pin}
                  onClose={() => setPanel(null)}
                />
              )}

              {panel === 'info' && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-violet-400" />
                      <h2 className="font-bold text-sm text-white">Meeting Details</h2>
                    </div>
                    <button onClick={() => setPanel(null)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* PIN Card */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">Meeting PIN</span>
                        <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-[10px] font-bold text-violet-300 border border-violet-400/20">Active</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-2xl font-black text-white tracking-widest select-all">{code}</span>
                        <button onClick={copyPin} className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold flex items-center gap-1.5 transition-colors">
                          {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedPin ? 'Copied!' : 'Copy PIN'}</span>
                        </button>
                      </div>
                    </div>
                    {/* Link */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">Invite Link</label>
                      <div className="flex items-center gap-2 p-2.5 bg-white/5 rounded-xl border border-white/10">
                        <input type="text" readOnly value={inviteUrl} className="bg-transparent text-xs text-white/60 font-mono flex-1 outline-none truncate select-all" />
                        <button onClick={copyInviteLink} className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-xs font-bold rounded-lg flex items-center gap-1 flex-shrink-0 transition-colors">
                          {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                    <button onClick={shareMeeting} className="w-full py-2.5 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 border border-violet-400/30 text-violet-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all">
                      <Share2 className="w-4 h-4" /> Share joining info
                    </button>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-violet-400" /> How others join:
                      </h3>
                      <ol className="text-xs text-white/50 space-y-2 list-decimal list-inside leading-relaxed">
                        <li><strong className="text-white">Link:</strong> Send the link — they click and join instantly.</li>
                        <li><strong className="text-white">PIN:</strong> Open Jumbo → "Join with a code" → type <span className="font-mono font-bold text-violet-300">{code}</span>.</li>
                        <li><strong className="text-white">Zero install:</strong> Works in any modern browser.</li>
                      </ol>
                    </div>

                    {/* Quick navigation actions */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <button
                        onClick={() => setPanel('quiz')}
                        className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                      >
                        <Gamepad2 className="w-4 h-4" />
                        <span>Play In-Meeting Quiz</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Leave meeting and return to Home?')) {
                            leave();
                          }
                        }}
                        className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-white/70 hover:text-red-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <Home className="w-4 h-4" />
                        <span>Leave to Home</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ── BOTTOM CONTROL BAR ────────────────────────────────────────────────
          Two rows on mobile, single row on sm+.
          Row 1 (mobile): primary media controls + Leave
          Row 2 (mobile): secondary panel controls
          On sm+ all buttons fit in one scrollable row.
      */}
      <div className="flex-shrink-0 bg-[#1a1f2e]/95 backdrop-blur-xl border-t border-white/10 z-30">
        {/* Recording indicator stripe */}
        {store.isRecording && (
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
        )}

        {/* ── MOBILE: Two-row layout ── */}
        <div className="flex flex-col sm:hidden px-2 py-2 gap-1.5">
          {/* Row 1: core media + leave */}
          <div className="flex items-center justify-between gap-1">
            <CtrlBtn
              id="room-mic-btn-m"
              icon={store.isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 text-red-400" />}
              label={store.isMicOn ? 'Mute' : 'Unmute'}
              onClick={toggleMic}
              active={store.isMicOn}
            />
            <CtrlBtn
              id="room-cam-btn-m"
              icon={store.isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5 text-red-400" />}
              label={store.isCamOn ? 'Camera' : 'Camera Off'}
              onClick={toggleCam}
              active={store.isCamOn}
            />
            <CtrlBtn
              id="room-share-btn-m"
              icon={<Monitor className={`w-5 h-5 ${store.isScreenSharing ? 'text-violet-300' : ''}`} />}
              label={store.isScreenSharing ? 'Stop' : 'Share'}
              onClick={() => void toggleScreenShare()}
              active={store.isScreenSharing}
            />
            <CtrlBtn
              id="room-hand-btn-m"
              icon={<Hand className="w-5 h-5" />}
              label={isMyHandRaised ? 'Lower' : 'Hand'}
              onClick={toggleHand}
              warning={isMyHandRaised}
            />
            {/* Leave — always visible */}
            <button
              id="room-leave-btn-m"
              onClick={() => {
                if (isHost && allParticipants.length > 1) setShowEndDialog(true);
                else void leave();
              }}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all flex-shrink-0"
            >
              <PhoneOff className="w-5 h-5" />
              <span className="text-[10px] font-bold">Leave</span>
            </button>
          </div>
          {/* Row 2: panel toggles */}
          <div className="flex items-center justify-around gap-1">
            <CtrlBtn
              id="room-chat-btn-m"
              icon={<MessageSquare className="w-5 h-5" />}
              label="Chat"
              onClick={() => setPanel(panel === 'chat' ? null : 'chat')}
              active={panel === 'chat'}
              badge={panel !== 'chat' ? unreadChat : undefined}
            />
            <CtrlBtn
              id="room-participants-btn-m"
              icon={<Users className="w-5 h-5" />}
              label={`People`}
              onClick={() => setPanel(panel === 'participants' ? null : 'participants')}
              active={panel === 'participants'}
            />
            <CtrlBtn
              id="room-quiz-btn-m"
              icon={<Gamepad2 className="w-5 h-5" />}
              label="Quiz"
              onClick={() => setPanel(panel === 'quiz' ? null : 'quiz')}
              active={panel === 'quiz'}
            />
            {/* Mobile Reactions Button */}
            <CtrlBtn
              id="room-reactions-btn-m"
              icon={<Smile className="w-5 h-5 text-amber-300" />}
              label="React"
              onClick={() => setShowReactions((prev) => !prev)}
              active={showReactions}
            />
            <CtrlBtn
              id="room-info-btn-m"
              icon={<Info className="w-5 h-5" />}
              label="Info"
              onClick={() => setPanel(panel === 'info' ? null : 'info')}
              active={panel === 'info'}
            />
            {store.remoteParticipants.length > 0 && (
              <CtrlBtn
                id="room-boost-btn-m"
                icon={speakerBoosted ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <Volume1 className="w-5 h-5" />}
                label={speakerBoosted ? 'Boost ✓' : 'Boost'}
                onClick={toggleSpeakerBoost}
                active={speakerBoosted}
              />
            )}
            <CtrlBtn
              id="room-record-btn-m"
              icon={<Circle className={`w-5 h-5 ${store.isRecording ? 'fill-red-500 text-red-500 animate-pulse' : ''}`} />}
              label={store.isRecording ? 'Stop' : 'Record'}
              onClick={store.isRecording ? stopRecording : startRecording}
              active={store.isRecording}
            />
          </div>
        </div>

        {/* ── DESKTOP: Single row (sm and above) ── */}
        <div className="hidden sm:flex items-center justify-center gap-1.5 px-3 py-3">
          {/* Core media controls */}
          <CtrlBtn
            id="room-mic-btn"
            icon={store.isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 text-red-400" />}
            label={store.isMicOn ? 'Mute' : 'Unmute'}
            onClick={toggleMic}
            active={store.isMicOn}
          />
          <CtrlBtn
            id="room-cam-btn"
            icon={store.isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5 text-red-400" />}
            label={store.isCamOn ? 'Stop Video' : 'Start Video'}
            onClick={toggleCam}
            active={store.isCamOn}
          />
          <CtrlBtn
            id="room-share-btn"
            icon={<Monitor className={`w-5 h-5 ${store.isScreenSharing ? 'text-violet-300' : ''}`} />}
            label={store.isScreenSharing ? 'Stop Share' : 'Share Screen'}
            onClick={() => void toggleScreenShare()}
            active={store.isScreenSharing}
          />
          <CtrlBtn
            id="room-hand-btn"
            icon={<Hand className="w-5 h-5" />}
            label={isMyHandRaised ? 'Lower Hand' : 'Raise Hand'}
            onClick={toggleHand}
            warning={isMyHandRaised}
          />
          {/* Desktop Reactions Button */}
          <CtrlBtn
            id="room-reactions-btn"
            icon={<Smile className="w-5 h-5 text-amber-300" />}
            label="Reactions"
            onClick={() => setShowReactions((prev) => !prev)}
            active={showReactions}
          />
          {/* Speaker boost — only useful when remote audio is playing */}
          {store.remoteParticipants.length > 0 && (
            <CtrlBtn
              id="room-boost-btn"
              icon={speakerBoosted ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <Volume1 className="w-5 h-5" />}
              label={speakerBoosted ? 'Boost On' : 'Boost'}
              onClick={toggleSpeakerBoost}
              active={speakerBoosted}
            />
          )}
          <div className="w-px h-8 bg-white/10 mx-1 flex-shrink-0" />
          <CtrlBtn
            id="room-chat-btn"
            icon={<MessageSquare className="w-5 h-5" />}
            label="Chat"
            onClick={() => setPanel(panel === 'chat' ? null : 'chat')}
            active={panel === 'chat'}
            badge={panel !== 'chat' ? unreadChat : undefined}
          />
          <CtrlBtn
            id="room-participants-btn"
            icon={<Users className="w-5 h-5" />}
            label={`People (${allParticipants.length})`}
            onClick={() => setPanel(panel === 'participants' ? null : 'participants')}
            active={panel === 'participants'}
          />
          <CtrlBtn
            id="room-quiz-btn"
            icon={<Gamepad2 className="w-5 h-5" />}
            label="Quiz"
            onClick={() => setPanel(panel === 'quiz' ? null : 'quiz')}
            active={panel === 'quiz'}
          />
          <CtrlBtn
            id="room-info-btn"
            icon={<Info className="w-5 h-5" />}
            label="Info / PIN"
            onClick={() => setPanel(panel === 'info' ? null : 'info')}
            active={panel === 'info'}
          />
          <CtrlBtn
            id="room-record-btn"
            icon={<Circle className={`w-5 h-5 ${store.isRecording ? 'fill-red-500 text-red-500 animate-pulse' : ''}`} />}
            label={store.isRecording ? 'Stop Rec' : 'Record'}
            onClick={store.isRecording ? stopRecording : startRecording}
            active={store.isRecording}
          />
          <div className="w-px h-8 bg-white/10 mx-1 flex-shrink-0" />
          <button
            id="room-leave-btn"
            onClick={() => {
              if (isHost && allParticipants.length > 1) setShowEndDialog(true);
              else void leave();
            }}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all min-w-[64px]"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="text-[10px] font-bold">Leave</span>
          </button>
        </div>
      </div>

      {/* ── "MEETING IS READY" INVITE BANNER (appears when alone) ─────────── */}
      <AnimatePresence>
        {showReadyBanner && allParticipants.length <= 1 && code && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-24 left-4 z-40 w-80 sm:w-96 bg-[#1e2740] border border-white/15 rounded-2xl p-5 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm text-white">Your meeting is ready</h3>
                <p className="text-xs text-white/50 mt-0.5">Share this info with people you want to join.</p>
              </div>
              <button onClick={() => setShowReadyBanner(false)} className="text-white/40 hover:text-white p-1 rounded transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Meeting PIN</span>
                <span className="font-mono text-base font-bold text-violet-300 tracking-wider">{code}</span>
              </div>
              <div className="text-xs text-white/40 truncate font-mono">{inviteUrl}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={copyInviteLink} className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy invite link'}</span>
              </button>
              <button onClick={copyPin} className="px-3 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors">
                {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>PIN</span>
              </button>
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button onClick={shareMeeting} className="px-2.5 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold transition-colors">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── END MEETING DIALOG (host) ─────────────────────────────────────── */}
      <AnimatePresence>
        {showEndDialog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-[#1e2740] border border-white/15 rounded-2xl w-full max-w-sm p-6 space-y-4 text-center shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                <PhoneOff className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Leave or End Meeting?</h3>
                <p className="text-xs text-white/50 mt-1">You are the host. Leave just for yourself or end for all.</p>
              </div>
              <div className="space-y-2 pt-1">
                <button onClick={endMeetingForAll} className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors">End Meeting for All</button>
                <button onClick={() => void leave()} className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors">Leave Meeting Only</button>
                <button onClick={() => setShowEndDialog(false)} className="w-full py-2 text-xs text-white/40 hover:text-white transition-colors">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── REMOVED / ENDED NOTICE (replaces browser alert()) ─────────────── */}
      <AnimatePresence>
        {removedNotice && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-[#1e2740] border border-white/15 rounded-2xl w-full max-w-sm p-6 space-y-4 text-center shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Meeting Notice</h3>
                <p className="text-sm text-white/60 mt-1">{removedNotice}</p>
              </div>
              <button
                onClick={() => { setRemovedNotice(null); void leave(); }}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-colors"
              >
                Return to Home
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE PRESENTATION MODAL ─────────────────────────────────────── */}
      <AnimatePresence>
        {showMobileShareModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="w-full max-w-md bg-[#121829] border border-white/15 rounded-2xl shadow-2xl p-5 sm:p-6 text-white space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Presenting on Mobile</h3>
                    <p className="text-xs text-slate-400">Smartphone presentation options</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMobileShareModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
                <strong>Why can't mobile Chrome share the screen?</strong><br />
                Android &amp; iOS security restrictions block mobile web browsers (Chrome &amp; Safari) from capturing other phone apps — the same restriction as in Google Meet &amp; Zoom mobile web.
              </div>

              <div className="space-y-2.5">
                {/* Option 1: Present with Back Camera */}
                <button
                  type="button"
                  onClick={async () => {
                    setShowMobileShareModal(false);
                    await webrtcToggleScreenShare({ useBackCamera: true });
                  }}
                  className="w-full text-left p-3.5 rounded-xl bg-gradient-to-r from-violet-600/30 to-indigo-600/20 border border-violet-500/40 hover:border-violet-400 hover:from-violet-600/40 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
                      Present Back Camera (Doc Cam)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-semibold border border-violet-500/30">
                      Live Stream
                    </span>
                  </div>
                  <p className="text-xs text-slate-300/80">
                    Use your phone's high-res back camera to present physical notes, documents, drawings, or your surroundings in real time.
                  </p>
                </button>

                {/* Option 2: Desktop Screen Share */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <Laptop className="w-4 h-4 text-cyan-400" />
                    <span>To share phone apps or computer screens:</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Open this meeting link on a laptop or desktop computer (Chrome, Edge, Safari, Firefox) for full screen, window, and tab sharing.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard.writeText(window.location.href);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white font-medium transition-colors"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Meeting Link for Computer'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowMobileShareModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── REACTIONS POPUP (Centered, viewport-safe on mobile and desktop) ── */}
      <AnimatePresence>
        {showReactions && (
          <>
            {/* Click-away backdrop */}
            <div
              className="fixed inset-0 z-50 bg-black/25 sm:bg-transparent"
              onClick={() => setShowReactions(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed bottom-[calc(116px+env(safe-area-inset-bottom,0px))] sm:bottom-20 left-0 right-0 mx-auto px-3 flex justify-center z-50 pointer-events-none"
            >
              <div className="pointer-events-auto">
                <ReactionPicker
                  onSelectEmoji={(emoji) => {
                    webrtcSendReaction(emoji);
                  }}
                  onClose={() => setShowReactions(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
