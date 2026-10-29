/**
 * Phase 4 — Question Generators
 * Fetches from public APIs with local fallback via seed bank.
 */

import { QuestionSchema, type Question, type QuestionCategory } from '@jumbo/shared';
import { SEED_BANK } from './seed-bank.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i]!, a[j]!] = [a[j]!, a[i]!];
  }
  return a;
}

export function randomId(): string {
  return crypto.randomUUID();
}

function makeOptions(correct: string, distractors: string[]): Question['options'] {
  const opts = shuffle([correct, ...distractors.slice(0, 3)]);
  return opts.map((o) => ({ id: randomId(), text: o, isCorrect: o === correct }));
}

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'")
    .replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"');
}

// ── Cache layer ───────────────────────────────────────────────────────────────
const cache = new Map<string, { data: Question[]; fetchedAt: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

function fromCache(key: string): Question[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) { cache.delete(key); return null; }
  return entry.data;
}
function setCache(key: string, data: Question[]): void {
  cache.set(key, { data, fetchedAt: Date.now() });
}

// ── 1. Open Trivia DB ─────────────────────────────────────────────────────────
interface OTDBQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const OTDB_CATEGORY_MAP: Record<string, number> = {
  general_knowledge: 9,
  science: 17,
  history: 23,
  geography: 22,
};

async function fetchFromOTDB(category: string, count: number): Promise<Question[]> {
  const catId = OTDB_CATEGORY_MAP[category];
  if (!catId) return getSeedQuestions(category, count);
  const key = `otdb-${category}-${count}`;
  const cached = fromCache(key);
  if (cached) return cached;

  try {
    const res = await fetch(
      `https://opentdb.com/api.php?amount=${count}&category=${catId}&type=multiple&encode=url3986`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (!res.ok) throw new Error('OTDB error');
    const json = await res.json() as { response_code: number; results: OTDBQuestion[] };
    if (json.response_code !== 0) throw new Error('OTDB no results');

    const questions: Question[] = json.results.map((q) => {
      const text = decodeHtml(decodeURIComponent(q.question));
      const correct = decodeHtml(decodeURIComponent(q.correct_answer));
      const wrong = q.incorrect_answers.map((a) => decodeHtml(decodeURIComponent(a)));
      return QuestionSchema.parse({
        id: randomId(), category,
        text, options: makeOptions(correct, wrong),
        difficulty: q.difficulty, source: 'opentdb', timeLimit: 20, points: 1000,
      });
    });

    setCache(key, questions);
    return questions;
  } catch {
    return getSeedQuestions(category, count);
  }
}

// ── 2. REST Countries — Capitals & Flags ──────────────────────────────────────
interface CountryData {
  name: { common: string };
  capital?: string[];
  flags: { png: string };
}

let countriesCache: CountryData[] | null = null;

async function fetchCountries(): Promise<CountryData[]> {
  if (countriesCache) return countriesCache;
  try {
    const res = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,capital,flags',
      { signal: AbortSignal.timeout(6000) },
    );
    if (!res.ok) throw new Error();
    const data = await res.json() as CountryData[];
    countriesCache = data.filter((c) => c.capital && c.capital.length > 0);
    return countriesCache;
  } catch {
    return [];
  }
}

async function generateCapitalsQuestions(count: number): Promise<Question[]> {
  const key = `capitals-${count}`;
  const cached = fromCache(key);
  if (cached) return cached;

  const countries = await fetchCountries();
  if (countries.length < 4) return getSeedQuestions('countries_capitals', count);

  const pool = shuffle(countries).slice(0, Math.max(count * 3, 30));
  const questions: Question[] = [];

  for (let i = 0; i < Math.min(count, pool.length); i++) {
    const target = pool[i]!;
    if (!target.capital?.[0]) continue;
    const distractors = shuffle(pool.filter((_, j) => j !== i && !!pool[j]?.capital?.[0]))
      .slice(0, 3).map((c) => c.capital![0]!);

    questions.push(QuestionSchema.parse({
      id: randomId(), category: 'countries_capitals',
      text: `What is the capital of ${target.name.common}?`,
      options: makeOptions(target.capital[0], distractors),
      difficulty: 'medium', source: 'restcountries', timeLimit: 20, points: 1000,
    }));
  }

  setCache(key, questions);
  return questions;
}

async function generateFlagQuestions(count: number): Promise<Question[]> {
  const key = `flags-${count}`;
  const cached = fromCache(key);
  if (cached) return cached;

  const countries = await fetchCountries();
  if (countries.length < 4) return getSeedQuestions('flags', count);

  const pool = shuffle(countries).slice(0, Math.max(count * 3, 30));
  const questions: Question[] = [];

  for (let i = 0; i < Math.min(count, pool.length); i++) {
    const target = pool[i]!;
    const distractors = shuffle(pool.filter((_, j) => j !== i))
      .slice(0, 3).map((c) => c.name.common);

    questions.push(QuestionSchema.parse({
      id: randomId(), category: 'flags',
      text: 'Which country does this flag belong to?',
      imageUrl: target.flags.png,
      options: makeOptions(target.name.common, distractors),
      difficulty: 'medium', source: 'flagcdn', timeLimit: 15, points: 1000,
    }));
  }

  setCache(key, questions);
  return questions;
}

// ── 3. Math Questions ─────────────────────────────────────────────────────────
function generateMathQuestions(count: number): Question[] {
  const key = `math-${count}`;
  const cached = fromCache(key);
  if (cached) return cached;

  const gens = [
    () => {
      const a = Math.floor(Math.random() * 12) + 2;
      const b = Math.floor(Math.random() * 12) + 2;
      const ans = a * b;
      return { text: `What is ${a} × ${b}?`, correct: String(ans), wrong: [String(ans + 1), String(ans - 1), String(a * (b + 1))] };
    },
    () => {
      const a = Math.floor(Math.random() * 9) + 2;
      const ans = a * a;
      return { text: `What is ${a}²?`, correct: String(ans), wrong: [String((a - 1) ** 2), String((a + 1) ** 2), String(a * (a + 1))] };
    },
    () => {
      const a = Math.floor(Math.random() * 50) + 20;
      const b = Math.floor(Math.random() * (a - 5)) + 1;
      const ans = a - b;
      return { text: `What is ${a} − ${b}?`, correct: String(ans), wrong: [String(ans + 1), String(ans - 1), String(ans + 2)] };
    },
    () => {
      const a = Math.floor(Math.random() * 15) + 5;
      const b = Math.floor(Math.random() * 15) + 5;
      const ans = a + b;
      return { text: `What is ${a} + ${b}?`, correct: String(ans), wrong: [String(ans + 1), String(ans - 1), String(ans + 2)] };
    },
  ];

  const questions: Question[] = Array.from({ length: count }, (_, i) => {
    const g = gens[i % gens.length]!();
    return QuestionSchema.parse({
      id: randomId(), category: 'math_formulas',
      text: g.text, options: makeOptions(g.correct, g.wrong),
      difficulty: 'medium', source: 'generated', timeLimit: 25, points: 1000,
    });
  });

  setCache(key, questions);
  return questions;
}

// ── 4. Seed bank fallback ─────────────────────────────────────────────────────
function getSeedQuestions(category: string, count: number): Question[] {
  const pool = category === 'general_knowledge'
    ? SEED_BANK
    : SEED_BANK.filter((q) => q.category === category);
  const fallback = pool.length > 0 ? pool : SEED_BANK;
  return shuffle(fallback).slice(0, count);
}

// ── Master generator ──────────────────────────────────────────────────────────
const OTDB_CATEGORIES = new Set(['general_knowledge', 'science', 'history', 'geography']);

export async function generateQuestions(
  categoriesOrOptions: QuestionCategory[] | { categories: QuestionCategory[]; count?: number; totalCount?: number },
  maybeTotalCount?: number,
): Promise<Question[]> {
  let categories: QuestionCategory[];
  let totalCount: number;

  if (Array.isArray(categoriesOrOptions)) {
    categories = categoriesOrOptions;
    totalCount = maybeTotalCount ?? 15;
  } else {
    categories = categoriesOrOptions.categories;
    totalCount = categoriesOrOptions.count ?? categoriesOrOptions.totalCount ?? maybeTotalCount ?? 15;
  }

  const perCat = Math.max(1, Math.ceil(totalCount / Math.max(1, categories.length)));

  const results = await Promise.allSettled(
    categories.map(async (cat): Promise<Question[]> => {
      if (cat === 'countries_capitals') return generateCapitalsQuestions(perCat);
      if (cat === 'flags') return generateFlagQuestions(perCat);
      if (cat === 'math_formulas' || cat === 'numbers_logic') return generateMathQuestions(perCat);
      if (OTDB_CATEGORIES.has(cat)) return fetchFromOTDB(cat, perCat);
      return getSeedQuestions(cat, perCat);
    }),
  );

  const all = results
    .filter((r): r is PromiseFulfilledResult<Question[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value);

  const unique = [...new Map(all.map((q) => [q.text, q])).values()];

  if (unique.length < totalCount) {
    const existingTexts = new Set(unique.map((q) => q.text));
    const backfill = SEED_BANK.filter((q) => !existingTexts.has(q.text));
    for (const q of shuffle(backfill)) {
      if (unique.length >= totalCount) break;
      unique.push(q);
    }
  }

  return shuffle(unique).slice(0, totalCount);
}

// Re-export types for package consumers
export type { Question, QuestionCategory } from '@jumbo/shared';

export interface QuestionGenerator {
  generate(count: number): Promise<Question[]>;
  category: QuestionCategory;
}
