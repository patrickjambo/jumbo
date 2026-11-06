import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Plus, ArrowLeft } from 'lucide-react';
import { EMOJI_CATEGORIES, EMOJI_LIST, QUICK_REACTIONS } from '../lib/emojis';

interface ReactionPickerProps {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
  title?: string;
  className?: string;
  initialExpanded?: boolean;
  autoCloseOnSelect?: boolean;
}

export function ReactionPicker({
  onSelectEmoji,
  onClose,
  title = 'Reactions',
  className = '',
  initialExpanded = false,
  autoCloseOnSelect = true,
}: ReactionPickerProps) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto focus search input on desktop when expanded
  useEffect(() => {
    if (expanded && window.innerWidth > 640) {
      setTimeout(() => searchInputRef.current?.focus(), 80);
    }
  }, [expanded]);

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
    if (autoCloseOnSelect) {
      onClose();
    }
  }

  // ── 1. WhatsApp-style Quick Reaction Pill (default compact view) ──────────
  if (!expanded) {
    return (
      <div
        ref={containerRef}
        className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 bg-[#141824]/95 backdrop-blur-2xl border border-white/20 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.65)] text-white select-none z-50 ${className}`}
      >
        <div className="flex items-center gap-0.5 sm:gap-1">
          {QUICK_REACTIONS.slice(0, 6).map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleEmojiClick(emoji)}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-white/15 hover:scale-125 active:scale-95 text-xl sm:text-2xl transition-all"
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-white/15 mx-0.5 flex-shrink-0" />

        {/* Plus button to open the short scrollable emoji drawer */}
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-violet-600/40 hover:text-violet-300 text-white/80 transition-all active:scale-95 flex-shrink-0"
          title="More reactions"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors flex-shrink-0"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // ── 2. Expanded Short Scrollable Emoji Drawer (WhatsApp "+" sheet) ───────
  return (
    <div
      ref={containerRef}
      className={`w-[calc(100vw-1.5rem)] max-w-[340px] sm:w-80 bg-[#141824]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden text-white select-none z-50 max-h-[270px] ${className}`}
    >
      {/* Compact Header: Back, Search, and Close */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 flex-shrink-0">
        {!initialExpanded && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors flex-shrink-0"
            title="Back to quick reactions"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Search Bar */}
        <div className="relative flex-1 flex items-center">
          <Search className="w-3 h-3 text-white/40 absolute left-2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search emojis…"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-6 py-1 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-1.5 text-white/40 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors flex-shrink-0"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category Pills (horizontal scroll, compact) */}
      {!search && (
        <div className="flex items-center gap-1 px-2.5 py-1 overflow-x-auto scrollbar-none flex-shrink-0 border-b border-white/5 text-[11px]">
          {EMOJI_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition-all ${
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

      {/* Short & Smooth Scrollable Emoji Grid */}
      <div className="flex-1 overflow-y-auto p-2 max-h-36 scrollbar-thin">
        {filteredEmojis.length === 0 ? (
          <div className="py-4 text-center text-xs text-white/40">
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

      {/* Subtle Hint */}
      <div className="px-2.5 py-1 bg-black/20 border-t border-white/5 text-[9px] text-white/40 text-center truncate flex-shrink-0">
        Tap any emoji to react in real-time
      </div>
    </div>
  );
}
