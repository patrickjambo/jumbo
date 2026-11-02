import {
  WORLD_HISTORY_QUESTIONS,
  type HistoryEra,
  type HistoryQuestionItem,
  type Question,
  HISTORY_ERAS,
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

export function buildHistoryQuizQuestions(
  count: number,
  era?: HistoryEra | HistoryEra[] | Set<HistoryEra> | 'all',
  timeLimit = 15,
): Question[] {
  let pool = WORLD_HISTORY_QUESTIONS;
  if (era && era !== 'all') {
    const targetSet = Array.isArray(era)
      ? new Set(era)
      : era instanceof Set
        ? era
        : new Set([era]);

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
      id: `hist_${item.id}_${Date.now()}_${idx}`,
      type: 'multiple_choice' as const,
      text: item.text,
      imageUrl: item.imageUrl,
      options,
      timeLimit,
      category: 'World History',
      difficulty: item.difficulty,
      points: 1000,
    };
  });

  // Preload historical artwork/photos into browser cache for instant rendering
  const imageUrls = questions.map((q) => q.imageUrl).filter((url): url is string => Boolean(url));
  preloadFlagImages(imageUrls);

  return questions;
}
