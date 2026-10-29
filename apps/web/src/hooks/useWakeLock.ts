import { useEffect, useRef } from 'react';

/**
 * useWakeLock — Screen Wake Lock API hook (Spec §11, §21)
 * Keeps the device display active during video calls and live quiz games.
 */
export function useWakeLock(enabled: boolean = true) {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!enabled || typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
      return;
    }

    async function acquireLock() {
      try {
        if (!document.hidden && (!sentinelRef.current || sentinelRef.current.released)) {
          sentinelRef.current = await navigator.wakeLock.request('screen');
        }
      } catch {
        // Wake lock may fail if tab is not focused or system policy restricts it
      }
    }

    void acquireLock();

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        void acquireLock();
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (sentinelRef.current && !sentinelRef.current.released) {
        sentinelRef.current.release().catch(() => {});
        sentinelRef.current = null;
      }
    };
  }, [enabled]);
}
