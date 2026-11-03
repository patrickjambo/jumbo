import { motion, AnimatePresence } from 'framer-motion';

export interface FloatingReaction {
  id: string;
  emoji: string;
  senderName: string;
  x: number; // percentage from left (15 to 85)
  drift: number; // horizontal sway distance in px
}

interface FloatingReactionsProps {
  reactions: FloatingReaction[];
}

export function FloatingReactions({ reactions }: FloatingReactionsProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden select-none">
      <AnimatePresence>
        {reactions.map((r) => (
          <motion.div
            key={r.id}
            initial={{
              opacity: 0,
              scale: 0.4,
              y: 0,
              x: 0,
            }}
            animate={{
              opacity: [0, 1, 1, 0.9, 0],
              scale: [0.4, 1.4, 1.2, 1, 0.8],
              y: -500,
              x: [0, r.drift, -r.drift, r.drift * 0.5],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 3.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              position: 'absolute',
              bottom: 96,
              left: `${r.x}%`,
            }}
            className="flex flex-col items-center gap-1 -translate-x-1/2"
          >
            {/* Animated Emoji */}
            <span className="text-4xl sm:text-5xl filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
              {r.emoji}
            </span>

            {/* Sender Name Badge */}
            <span className="text-[10px] sm:text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15 shadow-xl max-w-[120px] truncate">
              {r.senderName}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

