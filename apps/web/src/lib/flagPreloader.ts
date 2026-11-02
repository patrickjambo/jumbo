/**
 * High-speed Flag Image Preloader
 * Ensures every national flag image is cached in memory ahead of time
 * so flags appear instantly (0ms) in real-time quiz games with no reload or flicker.
 */

const preloadedCache = new Set<string>();
const inflightPromises = new Map<string, Promise<void>>();

export function preloadFlagImage(url: string): Promise<void> {
  if (!url) return Promise.resolve();
  if (preloadedCache.has(url)) return Promise.resolve();
  if (inflightPromises.has(url)) return inflightPromises.get(url)!;

  const promise = new Promise<void>((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      preloadedCache.add(url);
      inflightPromises.delete(url);
      resolve();
    };
    img.onerror = () => {
      // If PNG fails, attempt SVG fallback pre-cache
      if (url.endsWith('.png') && url.includes('flagcdn.com/w320/')) {
        const svgUrl = url.replace('flagcdn.com/w320/', 'flagcdn.com/').replace('.png', '.svg');
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          preloadedCache.add(svgUrl);
          preloadedCache.add(url);
          inflightPromises.delete(url);
          resolve();
        };
        fallbackImg.onerror = () => {
          inflightPromises.delete(url);
          resolve();
        };
        fallbackImg.src = svgUrl;
        return;
      }
      inflightPromises.delete(url);
      resolve();
    };
    img.src = url;
  });

  inflightPromises.set(url, promise);
  return promise;
}

export function preloadFlagImages(urls: (string | undefined | null)[]): Promise<void[]> {
  const valid = urls.filter((u): u is string => Boolean(u && typeof u === 'string'));
  return Promise.all(valid.map(preloadFlagImage));
}

export function isFlagPreloaded(url?: string): boolean {
  if (!url) return false;
  return preloadedCache.has(url);
}

/**
 * Preload country flags in background (e.g., during lobby or mode selection)
 */
export function preloadCountriesBatch(flags: string[], maxBatch = 30): void {
  const batch = flags.slice(0, maxBatch);
  void preloadFlagImages(batch);
}
