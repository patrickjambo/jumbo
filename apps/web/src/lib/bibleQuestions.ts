import {
  WORLD_BIBLE_QUESTIONS,
  type BibleCategory,
  type BibleQuestionItem,
  type Question,
  BIBLE_CATEGORIES,
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

export function buildBibleQuizQuestions(
  count: number,
  category?: BibleCategory | 'all',
  timeLimit = 15,
): Question[] {
  let pool = WORLD_BIBLE_QUESTIONS;
  if (category && category !== 'all') {
    const filtered = pool.filter((q) => q.category === category);
    if (filtered.length >= 4) pool = filtered;
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
      id: `bible_${item.id}_${Date.now()}_${idx}`,
      type: 'multiple_choice' as const,
      text: item.text,
      imageUrl: item.imageUrl,
      options,
      timeLimit,
      category: 'Holy Bible & Jesus',
      difficulty: item.difficulty,
      points: 1000,
      source: item.verseRef ? `Holy Bible (${item.verseRef})` : 'Holy Bible',
    };
  });

  // Prewarm images for any visual Bible questions ahead of time
  const mediaUrls = questions.map((q) => q.imageUrl).filter((url): url is string => Boolean(url));
  if (mediaUrls.length > 0) {
    void preloadFlagImages(mediaUrls);
  }

  return questions;
}

export { BIBLE_CATEGORIES, type BibleCategory, type BibleQuestionItem };
