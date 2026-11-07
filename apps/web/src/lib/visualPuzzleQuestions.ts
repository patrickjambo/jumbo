import {
  WORLD_VISUAL_PUZZLES,
  type VisualPuzzleTheme,
  type VisualPuzzleItem,
  type Question,
  VISUAL_PUZZLE_THEMES,
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

export function buildVisualPuzzleQuestions(
  count: number,
  theme?: VisualPuzzleTheme | VisualPuzzleTheme[] | Set<VisualPuzzleTheme> | 'all',
  timeLimit = 25,
): Question[] {
  let pool = WORLD_VISUAL_PUZZLES;
  if (theme && theme !== 'all') {
    const targetSet = Array.isArray(theme)
      ? new Set(theme)
      : theme instanceof Set
        ? theme
        : new Set([theme]);

    if (targetSet.size > 0) {
      const filtered = pool.filter((q) => targetSet.has(q.theme));
      if (filtered.length >= 2) pool = filtered;
    }
  }

  const shuffledPool = shuffle(pool);
  const selected = shuffledPool.slice(0, Math.min(count, pool.length));

  const questions: Question[] = selected.map((item, idx) => {
    const distractors = item.options.filter((o) => o !== item.correctAnswer);
    const optionsText = shuffle([item.correctAnswer, ...distractors.slice(0, 3)]);

    const options = optionsText.map((text, oIdx) => ({
      id: `opt_vp_${idx}_${oIdx + 1}`,
      text,
      isCorrect: text === item.correctAnswer,
    }));

    return {
      id: item.id || `vp_q_${idx + 1}`,
      type: 'multiple_choice',
      text: item.text,
      imageUrl: item.imageUrl,
      options,
      timeLimit,
      category: 'visual_puzzles',
      difficulty: item.difficulty,
      points: 1000,
    };
  });

  // Preload visual puzzle illustrations into browser memory
  const imageUrls = questions.map((q) => q.imageUrl).filter((url): url is string => Boolean(url));
  void preloadFlagImages(imageUrls);

  return questions;
}
