import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EMOJI_CATEGORIES, EMOJI_LIST, QUICK_REACTIONS } from '../lib/emojis';

interface ReactionPickerProps {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
  title?: string;
  className?: string;
}

export function ReactionPicker({
  onSelectEmoji,
  onClose,
  title = 'Reactions',
  className = '',
}: ReactionPickerProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto focus search input on desktop
  useEffect(() => {
    if (window.innerWidth > 640) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, []);

  // Filter emojis based on search query and category
  const filteredEmojis = useMemo(() => {
    const q = search.trim().toLowerCase();
    return EMOJI_LIST.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (!q) return true;
      if (item.emoji.includes(q)) return true;
      if (item.name.toLowerCase().includes(q)) return true;
      return item.keywords.some((k) => k.toLowerCase().includes(q));
    });
  }, [search, selectedCategory]);

  function handleEmojiClick(emoji: string) {
    onSelectEmoji(emoji);
  }

  return (
    <div
      ref={containerRef}
      className={`w-[calc(100vw-1.5rem)] max-w-[340px] sm:w-80 bg-[#161b28]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white select-none z-50 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/10 flex-shrink-0">
        <span className="text-xs font-bold tracking-wide text-white/90 flex items-center gap-1.5">
          <span>{title}</span>
        </span>
        <button
          type="button"
          onClick={onClose}
          className="w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Reactions Bar */}
      <div className="px-3 pt-2.5 pb-2 border-b border-white/10 bg-white/[0.02]">
        <div className="text-[10px] uppercase font-bold tracking-wider text-white/40 mb-1.5 px-0.5">
          Quick Reactions
        </div>
        <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-0.5">
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleEmojiClick(emoji)}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-violet-600/30 hover:scale-125 hover:border hover:border-violet-400 text-lg sm:text-xl transition-all active:scale-95 shadow-sm flex-shrink-0"
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-3 pt-2.5 pb-1.5 flex-shrink-0">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all emojis…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 text-white/40 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills (hidden during active search) */}
      {!search && (
        <div className="flex items-center gap-1 px-3 py-1.5 overflow-x-auto scrollbar-none flex-shrink-0 border-b border-white/5 text-[11px]">
          {EMOJI_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Emoji Grid */}
      <div className="flex-1 overflow-y-auto px-2.5 py-2 max-h-[42vh] sm:max-h-56 scrollbar-thin">
        {filteredEmojis.length === 0 ? (
          <div className="py-8 text-center text-xs text-white/40">
            No emojis match &ldquo;{search}&rdquo;
          </div>
        ) : (
          <div className="grid grid-cols-7 sm:grid-cols-8 gap-1 justify-items-center">
            {filteredEmojis.map((item, index) => (
              <button
                key={`${item.emoji}-${index}`}
                type="button"
                onClick={() => handleEmojiClick(item.emoji)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/15 hover:scale-125 text-lg transition-all active:scale-90"
                title={item.name}
              >
                {item.emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Subtle footer hint */}
      <div className="px-3 py-1.5 bg-black/20 border-t border-white/5 text-[10px] text-white/40 text-center truncate">
        Click an emoji to react in real-time
      </div>
    </div>
  );
}

