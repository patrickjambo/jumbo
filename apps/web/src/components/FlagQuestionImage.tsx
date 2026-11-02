import React, { useState, useEffect, memo } from 'react';
import { Flag } from 'lucide-react';
import { isFlagPreloaded, preloadFlagImage } from '../lib/flagPreloader';

interface FlagQuestionImageProps {
  imageUrl: string;
  alt?: string;
  size?: 'compact' | 'normal' | 'large';
  className?: string;
}

export const FlagQuestionImage = memo(function FlagQuestionImage({
  imageUrl,
  alt = 'National Flag',
  size = 'normal',
  className = '',
}: FlagQuestionImageProps) {
  const [currentSrc, setCurrentSrc] = useState(imageUrl);
  const [loaded, setLoaded] = useState(() => isFlagPreloaded(imageUrl));
  const [hasError, setHasError] = useState(false);

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
    // If PNG from flagcdn fails, try SVG fallback
    if (currentSrc.endsWith('.png') && currentSrc.includes('flagcdn.com/w320/')) {
      const svgFallback = currentSrc.replace('flagcdn.com/w320/', 'flagcdn.com/').replace('.png', '.svg');
      setCurrentSrc(svgFallback);
      return;
    }
    // If SVG also fails or non-flagcdn, try backup jsdelivr flag CDN if 2-letter code detected
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

  const containerSizes = {
    compact: 'h-24 sm:h-28 max-w-[180px]',
    normal: 'h-32 sm:h-44 md:h-48 max-w-[280px] sm:max-w-[340px]',
    large: 'h-40 sm:h-52 md:h-60 max-w-[340px] sm:max-w-[420px]',
  };

  return (
    <div className={`relative flex flex-col items-center justify-center my-1 sm:my-2 ${className}`}>
      {/* Matte Container with 3:2 flag aspect ratio and subtle drop shadow */}
      <div
        className={`relative w-full ${containerSizes[size]} aspect-[3/2] flex items-center justify-center rounded-xl overflow-hidden bg-slate-900/90 border border-white/20 shadow-2xl shadow-black/80 ring-1 ring-white/10`}
      >
        {/* Subtle skeleton loader if not yet cached */}
        {!loaded && !hasError && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700/60 to-slate-800 animate-pulse flex items-center justify-center">
            <Flag className="w-8 h-8 text-white/20 animate-bounce" />
          </div>
        )}

        {/* Flag Image — Crisp, immediate, no reload */}
        {!hasError ? (
          <img
            key={currentSrc}
            src={currentSrc}
            alt={alt}
            decoding="async"
            loading="eager"
            onLoad={() => setLoaded(true)}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-150 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 p-3 text-center">
            <Flag className="w-8 h-8 text-amber-400/80" />
            <span className="text-xs font-semibold text-slate-300">National Flag</span>
          </div>
        )}

        {/* Crisp flag edge overlay so white fields (e.g. Japan, Poland, England) never blend into background */}
        <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-black/25" />
      </div>

      {/* Flag category label pill */}
      <div className="mt-1.5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-white/10 text-[10px] font-bold text-slate-300 shadow-sm">
        <Flag className="w-3 h-3 text-cyan-400 flex-shrink-0" />
        <span className="tracking-wide uppercase">Identify This National Flag</span>
      </div>
    </div>
  );
});
