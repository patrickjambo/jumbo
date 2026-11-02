import React, { useState, useEffect, memo } from 'react';
import { Flag, Sparkles, Building2 } from 'lucide-react';
import { isFlagPreloaded, preloadFlagImage } from '../lib/flagPreloader';

interface FlagQuestionImageProps {
  imageUrl: string;
  alt?: string;
  size?: 'compact' | 'normal' | 'large';
  className?: string;
}

export const FlagQuestionImage = memo(function FlagQuestionImage({
  imageUrl,
  alt = 'Question Image',
  size = 'normal',
  className = '',
}: FlagQuestionImageProps) {
  const [currentSrc, setCurrentSrc] = useState(imageUrl);
  const [loaded, setLoaded] = useState(() => isFlagPreloaded(imageUrl));
  const [hasError, setHasError] = useState(false);

  const isLogo =
    imageUrl.includes('simpleicons') ||
    imageUrl.includes('simple-icons') ||
    /logo|brand/i.test(alt);

  useEffect(() => {
    setCurrentSrc(imageUrl);
    const pre = isFlagPreloaded(imageUrl);
    setLoaded(pre);
    setHasError(false);

    if (!pre) {
      preloadFlagImage(imageUrl).then(() => {
        setLoaded(true);
      });
    }
  }, [imageUrl]);

  function handleError() {
    // If simpleicons CDN fails, try jsdelivr SVG
    if (currentSrc.includes('cdn.simpleicons.org/')) {
      const slug = currentSrc.split('cdn.simpleicons.org/')[1]?.split('?')[0]?.split('/')[0];
      if (slug) {
        const backup = `https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${slug}.svg`;
        if (currentSrc !== backup) {
          setCurrentSrc(backup);
          return;
        }
      }
    }
    // If jsdelivr fails, try simpleicons CDN
    if (currentSrc.includes('simple-icons@v13/icons/')) {
      const slug = currentSrc.split('simple-icons@v13/icons/')[1]?.replace('.svg', '');
      if (slug) {
        const backup = `https://cdn.simpleicons.org/${slug}`;
        if (currentSrc !== backup) {
          setCurrentSrc(backup);
          return;
        }
      }
    }

    // Flag fallbacks
    if (currentSrc.endsWith('.png') && currentSrc.includes('flagcdn.com/w320/')) {
      const svgFallback = currentSrc.replace('flagcdn.com/w320/', 'flagcdn.com/').replace('.png', '.svg');
      setCurrentSrc(svgFallback);
      return;
    }
    const match = currentSrc.match(/\/([a-z]{2})\.(png|svg)$/i);
    if (match && match[1]) {
      const code = match[1].toLowerCase();
      const backup = `https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/png250px/${code}.png`;
      if (currentSrc !== backup) {
        setCurrentSrc(backup);
        return;
      }
    }
    setHasError(true);
  }

  const flagSizes = {
    compact: 'h-24 sm:h-28 max-w-[180px] aspect-[3/2]',
    normal: 'h-32 sm:h-44 md:h-48 max-w-[280px] sm:max-w-[340px] aspect-[3/2]',
    large: 'h-40 sm:h-52 md:h-60 max-w-[340px] sm:max-w-[420px] aspect-[3/2]',
  };

  const logoSizes = {
    compact: 'h-24 sm:h-28 w-24 sm:w-28 aspect-square',
    normal: 'h-32 sm:h-40 md:h-44 w-32 sm:w-40 md:w-44 aspect-square',
    large: 'h-36 sm:h-48 md:h-52 w-36 sm:w-48 md:w-52 aspect-square',
  };

  const containerClass = isLogo
    ? `${logoSizes[size]} bg-gradient-to-b from-white via-white to-slate-50 p-4 sm:p-5 border border-white/60 shadow-2xl shadow-violet-950/40 ring-1 ring-white/30 rounded-2xl`
    : `${flagSizes[size]} bg-slate-900/90 border border-white/20 shadow-2xl shadow-black/80 ring-1 ring-white/10 rounded-xl`;

  return (
    <div className={`relative flex flex-col items-center justify-center my-1 sm:my-2 ${className}`}>
      {/* Media Canvas Container */}
      <div className={`relative flex items-center justify-center overflow-hidden transition-all duration-200 ${containerClass}`}>
        {/* Subtle skeleton loader if not yet cached */}
        {!loaded && !hasError && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700/60 dark:to-slate-800 animate-pulse flex items-center justify-center">
            {isLogo ? (
              <Sparkles className="w-8 h-8 text-violet-400/50 animate-bounce" />
            ) : (
              <Flag className="w-8 h-8 text-white/20 animate-bounce" />
            )}
          </div>
        )}

        {/* Media Image — Crisp, immediate, no reload */}
        {!hasError ? (
          <img
            key={currentSrc}
            src={currentSrc}
            alt={alt}
            decoding="async"
            loading="eager"
            onLoad={() => setLoaded(true)}
            onError={handleError}
            className={`transition-opacity duration-150 ${
              isLogo
                ? 'w-full h-full object-contain filter drop-shadow-sm select-none'
                : 'w-full h-full object-cover'
            } ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 p-3 text-center">
            {isLogo ? (
              <>
                <Building2 className="w-8 h-8 text-violet-400" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Brand Logo</span>
              </>
            ) : (
              <>
                <Flag className="w-8 h-8 text-amber-400/80" />
                <span className="text-xs font-semibold text-slate-300">National Flag</span>
              </>
            )}
          </div>
        )}

        {/* Outer overlay for flags so white fields don't blend */}
        {!isLogo && (
          <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-black/25" />
        )}
      </div>

      {/* Category identification pill */}
      {isLogo ? (
        <div className="mt-2 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-violet-950/80 border border-violet-500/30 text-[10px] font-bold text-violet-200 shadow-md">
          <Sparkles className="w-3 h-3 text-violet-400 flex-shrink-0 animate-pulse" />
          <span className="tracking-wide uppercase">Identify This Brand Logo</span>
        </div>
      ) : (
        <div className="mt-1.5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-white/10 text-[10px] font-bold text-slate-300 shadow-sm">
          <Flag className="w-3 h-3 text-cyan-400 flex-shrink-0" />
          <span className="tracking-wide uppercase">Identify This National Flag</span>
        </div>
      )}
    </div>
  );
});
