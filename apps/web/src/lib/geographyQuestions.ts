import {
  WORLD_GEOGRAPHY_QUESTIONS,
  type GeographyTheme,
  type GeographyQuestionItem,
  type Question,
  GEOGRAPHY_THEMES,
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

export function buildGeographyQuizQuestions(
  count: number,
  theme?: GeographyTheme | GeographyTheme[] | Set<GeographyTheme> | 'all',
  timeLimit = 15,
): Question[] {
  let pool = WORLD_GEOGRAPHY_QUESTIONS;
  if (theme && theme !== 'all') {
    const targetSet = Array.isArray(theme)
      ? new Set(theme)
      : theme instanceof Set
        ? theme
        : new Set([theme]);

    if (targetSet.size > 0) {
      const filtered = pool.filter((q) => targetSet.has(q.category));
      if (filtered.length >= 2) pool = filtered;
    }
  }

  const shuffledPool = shuffle(pool);
  const selected = shuffledPool.slice(0, Math.min(count, pool.length));

  const questions: Question[] = selected.map((item, idx) => {
    const distractors = item.options.filter((o) => o !== item.correctAnswer);
    const optionsText = shuffle([item.correctAnswer, ...distractors.slice(0, 3)]);

    const options = optionsText.map((text, oIdx) => ({
      id: `opt_${idx}_${oIdx + 1}`,
      text,
      isCorrect: text === item.correctAnswer,
    }));

    return {
      id: `geo_${item.id}_${Date.now()}_${idx}`,
      type: 'multiple_choice' as const,
      text: item.text,
      imageUrl: item.imageUrl,
      options,
      timeLimit,
      category: 'Global Geography',
      difficulty: item.difficulty,
      points: 1000,
    };
  });

  // Preload landmark & landscape photographs into browser cache for instant rendering
  const imageUrls = questions.map((q) => q.imageUrl).filter((url): url is string => Boolean(url));
  preloadFlagImages(imageUrls);

  return questions;
}
