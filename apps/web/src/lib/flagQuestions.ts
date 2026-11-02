import { WORLD_COUNTRIES, type Continent, type Question } from '@jumbo/shared';
import { preloadFlagImages } from './flagPreloader';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i]!, a[j]!] = [a[j]!, a[i]!];
  }
  return a;
}

export function buildFlagQuizQuestions(
  count: number,
  continent?: Continent | 'all',
  timeLimit = 15,
): Question[] {
  let pool = WORLD_COUNTRIES;
  if (continent && continent !== 'all') {
    const filtered = pool.filter((c) => c.continent === continent);
    if (filtered.length >= 4) pool = filtered;
  }

  const shuffledPool = shuffle(pool);
  const selected = shuffledPool.slice(0, Math.min(count, pool.length));

  const questions: Question[] = selected.map((target, idx) => {
    // Pick 3 distractors preferentially from the same continent for educational fidelity
    const sameCont = pool.filter((c) => c.code !== target.code && c.continent === target.continent);
    const candidateDistractors = sameCont.length >= 3 ? sameCont : pool.filter((c) => c.code !== target.code);
    const wrong = shuffle(candidateDistractors).slice(0, 3).map((c) => c.name);
    const optionsText = shuffle([target.name, ...wrong]);

    const options = optionsText.map((text, oIdx) => ({
      id: `opt_${idx}_${oIdx + 1}`,
      text,
      isCorrect: text === target.name,
    }));

    return {
      id: `flag_${target.code}_${Date.now()}_${idx}`,
      type: 'multiple_choice' as const,
      text: 'Which country does this flag belong to?',
      imageUrl: target.flagUrl,
      options,
      timeLimit,
      category: 'National Flags',
      difficulty: 'medium' as const,
      points: 1000,
    };
  });

  // Preload all flag images in memory immediately
  void preloadFlagImages(questions.map((q) => q.imageUrl));

  return questions;
}
