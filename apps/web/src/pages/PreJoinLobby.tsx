import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Mic, MicOff, VideoOff, Settings, ChevronDown, AlertCircle } from 'lucide-react';
import { fetchLiveKitToken, createRoom } from '../lib/api';

export default function PreJoinLobby() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [name, setName] = useState(() => localStorage.getItem('jumbo-display-name') ?? '');
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [micLevel, setMicLevel] = useState(0);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [showDevices, setShowDevices] = useState(false);
  const [selectedMicId, setSelectedMicId] = useState('');
  const [selectedCamId, setSelectedCamId] = useState('');
  const audioCtxRef = useRef<AudioContext | null>(null);

  const isNew = code === 'new';

  // ── Get camera/mic stream ─────────────────────────────────────────────────
  const startStream = useCallback(async (micId?: string, camId?: string) => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: camId ? { deviceId: { exact: camId } } : true,
        audio: micId
          ? { deviceId: { exact: micId }, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
          : { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Mic level meter
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      function updateLevel() {
        animFrameRef.current = requestAnimationFrame(updateLevel);
        analyser.getByteFrequencyData(buf);
        let sum = 0;
        for (const b of buf) sum += b;
        setMicLevel(sum / buf.length / 255);
      }
      updateLevel();

      // Enumerate devices after permission granted
      const devList = await navigator.mediaDevices.enumerateDevices();
      setDevices(devList);
    } catch (e) {
      setError('Camera or microphone blocked. Check your browser permissions and try again.');
    }
  }, []);

  useEffect(() => {
    void startStream();
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      void audioCtxRef.current?.close();
    };
  }, [startStream]);

  function toggleMic() {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) track.enabled = !micOn;
    setMicOn((v) => !v);
  }

  function toggleCam() {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track) track.enabled = !camOn;
    setCamOn((v) => !v);
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setJoining(true);
    setError(null);

    try {
      localStorage.setItem('jumbo-display-name', name.trim());
      let roomCode = code;

      if (isNew) {
        const room = await createRoom();
        roomCode = room.code;
      }

      // Pre-fetch token — we'll pass it via sessionStorage so MeetingRoom can use it
      const { token, livekitUrl } = await fetchLiveKitToken(roomCode!, name.trim());
      sessionStorage.setItem(`lk-token-${roomCode}`, token);
      sessionStorage.setItem('lk-url', livekitUrl);
      sessionStorage.setItem('lk-name', name.trim());

      // Stop stream — LiveKit will re-acquire
      streamRef.current?.getTracks().forEach((t) => t.stop());
      navigate(`/room/${roomCode}`);
    } catch (e) {
      setError((e as Error).message);
      setJoining(false);
    }
  }

  const mics = devices.filter((d) => d.kind === 'audioinput');
  const cams = devices.filter((d) => d.kind === 'videoinput');

  return (
    <div className="relative min-h-dvh flex items-center justify-center p-4">
      <div className="ambient-bg" aria-hidden />
      <motion.div
        className="glass-card w-full max-w-md p-8 relative z-10"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold mb-1">
          {isNew ? 'Start a meeting' : `Join meeting ${code}`}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Check your camera and mic before joining.
        </p>

        {/* Camera preview */}
        <div className="relative w-full aspect-video bg-[var(--surface-2)] rounded-[var(--radius-lg)] mb-4 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover ${!camOn ? 'opacity-0' : ''}`}
          />
          {!camOn && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--text-tertiary)]">
              <VideoOff className="w-8 h-8 mb-2" />
              <span className="text-sm">Camera off</span>
            </div>
          )}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            <button id="prejoin-mic-btn" onClick={toggleMic} className={`btn-icon ${micOn ? 'active' : ''}`} aria-label={micOn ? 'Mute' : 'Unmute'}>
              {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
            <button id="prejoin-cam-btn" onClick={toggleCam} className={`btn-icon ${camOn ? 'active' : ''}`} aria-label={camOn ? 'Stop camera' : 'Start camera'}>
              {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
            <button id="prejoin-settings-btn" onClick={() => setShowDevices(!showDevices)} className="btn-icon" aria-label="Device settings">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mic level bar */}
        <div className="flex items-center gap-3 mb-4">
          <Mic className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
          <div className="flex-1 h-2 bg-[var(--surface-2)] rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-75"
              style={{ width: `${Math.min(micLevel * 300, 100)}%` }}
            />
          </div>
        </div>

        {/* Device picker */}
        <AnimatePresence>
          {showDevices && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="space-y-2 p-3 bg-[var(--surface-2)] rounded-[var(--radius-md)]">
                {mics.length > 0 && (
                  <div>
                    <label className="text-xs text-[var(--text-tertiary)] block mb-1">Microphone</label>
                    <select
                      value={selectedMicId}
                      onChange={(e) => { setSelectedMicId(e.target.value); void startStream(e.target.value, selectedCamId); }}
                      className="w-full bg-[var(--surface-3)] text-sm rounded-md px-2 py-1.5 text-[var(--text-primary)] border-none outline-none"
                    >
                      {mics.map((d) => <option key={d.deviceId} value={d.deviceId}>{d.label || 'Microphone'}</option>)}
                    </select>
                  </div>
                )}
                {cams.length > 0 && (
                  <div>
                    <label className="text-xs text-[var(--text-tertiary)] block mb-1">Camera</label>
                    <select
                      value={selectedCamId}
                      onChange={(e) => { setSelectedCamId(e.target.value); void startStream(selectedMicId, e.target.value); }}
                      className="w-full bg-[var(--surface-3)] text-sm rounded-md px-2 py-1.5 text-[var(--text-primary)] border-none outline-none"
                    >
                      {cams.map((d) => <option key={d.deviceId} value={d.deviceId}>{d.label || 'Camera'}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-[var(--radius-md)] mb-4 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label htmlFor="prejoin-name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Your name</label>
            <input
              id="prejoin-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              required
              autoFocus
              className="w-full bg-[var(--surface-2)] border border-[var(--border-glass)] rounded-[var(--radius-md)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-brand-400 transition-colors"
            />
          </div>
          <button id="prejoin-join-btn" type="submit" className="btn-primary w-full text-base" disabled={!name.trim() || joining}>
            {joining ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting…
              </span>
            ) : isNew ? 'Start meeting' : 'Join meeting'}
          </button>
        </form>
        <button id="prejoin-back-btn" className="mt-4 w-full text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors" onClick={() => navigate('/home')}>← Back</button>
      </motion.div>
    </div>
  );
}
