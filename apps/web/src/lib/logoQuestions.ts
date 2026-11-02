import {
  WORLD_BRAND_LOGOS,
  type BrandCategory,
  type WorldBrandLogo,
  type Question,
  BRAND_CATEGORIES,
} from '@jumbo/shared';
import { preloadFlagImages } from './flagPreloader';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i]!, a[j]!] = [a[j]!, a[i]!];
  }
  return a;
}

export function buildLogoQuizQuestions(
  count: number,
  category?: BrandCategory | 'all',
  timeLimit = 15,
): Question[] {
  let pool = WORLD_BRAND_LOGOS;
  if (category && category !== 'all') {
    const filtered = pool.filter((l) => l.category === category);
    if (filtered.length >= 4) pool = filtered;
  }

  const shuffledPool = shuffle(pool);
  const selected = shuffledPool.slice(0, Math.min(count, pool.length));

  const questions: Question[] = selected.map((target, idx) => {
    // Pick 3 distractors preferentially from the same category
    const sameCat = pool.filter((l) => l.id !== target.id && l.category === target.category);
    let wrong: string[];
    if (sameCat.length >= 3) {
      wrong = shuffle(sameCat).slice(0, 3).map((l) => l.name);
    } else {
      wrong = target.distractors;
    }

    const optionsText = shuffle([target.name, ...wrong]);

    const options = optionsText.map((text, oIdx) => ({
      id: `opt_${idx}_${oIdx + 1}`,
      text,
      isCorrect: text === target.name,
    }));

    return {
      id: `logo_${target.id}_${Date.now()}_${idx}`,
      type: 'multiple_choice' as const,
      text: 'Which brand or company does this logo represent?',
      imageUrl: target.logoUrl,
      options,
      timeLimit,
      category: 'Logos & Brands',
      difficulty: 'medium' as const,
      points: 1000,
    };
  });

  // Preload all logo images in memory immediately (0ms delay)
  void preloadFlagImages(questions.map((q) => q.imageUrl));

  return questions;
}

export { BRAND_CATEGORIES, type BrandCategory, type WorldBrandLogo };
