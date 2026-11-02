/**
 * Phase 4 — Question Generators
 * Fetches from public APIs with local fallback via seed bank.
 */

import { QuestionSchema, type Question, type QuestionCategory, WORLD_COUNTRIES, type Continent } from '@jumbo/shared';
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

// ── 2. World Countries — Capitals & National Flags ────────────────────────────
// Powered by the embedded 209-country database covering all UN states & territories.
// Fast, 0-latency, 100% offline-resilient, with original flags and contextual distractors.

export function generateCapitalsQuestions(count: number, continent?: Continent): Question[] {
  let pool = WORLD_COUNTRIES.filter((c) => !!c.capital);
  if (continent) {
    const filtered = pool.filter((c) => c.continent === continent);
    if (filtered.length >= 4) pool = filtered;
  }
  const shuffledPool = shuffle(pool);
  const selected = shuffledPool.slice(0, Math.min(count, pool.length));
  const questions: Question[] = [];

  for (const target of selected) {
    const sameCont = pool.filter((c) => c.code !== target.code && c.continent === target.continent);
    const candidatePool = sameCont.length >= 3 ? sameCont : pool.filter((c) => c.code !== target.code);
    const distractors = shuffle(candidatePool).slice(0, 3).map((c) => c.capital);

    questions.push(QuestionSchema.parse({
      id: randomId(),
      category: 'countries_capitals',
      text: `What is the capital of ${target.name}?`,
      options: makeOptions(target.capital, distractors),
      difficulty: 'medium',
      source: 'world_capitals',
      timeLimit: 20,
      points: 1000,
    }));
  }

  return questions;
}

export function generateFlagQuestions(count: number, continent?: Continent): Question[] {
  let pool = WORLD_COUNTRIES;
  if (continent) {
    const filtered = pool.filter((c) => c.continent === continent);
    if (filtered.length >= 4) pool = filtered;
  }
  const shuffledPool = shuffle(pool);
  const selected = shuffledPool.slice(0, Math.min(count, pool.length));
  const questions: Question[] = [];

  for (const target of selected) {
    // Distractors: prefer from same continent if possible for smart, educational gameplay
    const sameCont = pool.filter((c) => c.code !== target.code && c.continent === target.continent);
    const candidatePool = sameCont.length >= 3 ? sameCont : pool.filter((c) => c.code !== target.code);
    const distractors = shuffle(candidatePool).slice(0, 3).map((c) => c.name);

    questions.push(QuestionSchema.parse({
      id: randomId(),
      category: 'flags',
      text: 'Which country does this flag belong to?',
      imageUrl: target.flagUrl,
      options: makeOptions(target.name, distractors),
      difficulty: 'medium',
      source: 'national_flags',
      timeLimit: 15,
      points: 1000,
    }));
  }

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

  // Key by text + imageUrl so multiple flag questions ("Which country does this flag belong to?") are NOT collapsed!
  const dedupeKey = (q: Question) => q.imageUrl ? `${q.text}::${q.imageUrl}` : q.text;
  const unique = [...new Map(all.map((q) => [dedupeKey(q), q])).values()];

  if (unique.length < totalCount) {
    const existingKeys = new Set(unique.map((q) => dedupeKey(q)));
    if (categories.includes('flags') && categories.length === 1) {
      // If only flags requested, backfill with more flags from the 209-country bank
      const extraFlags = generateFlagQuestions(totalCount);
      for (const f of extraFlags) {
        if (unique.length >= totalCount) break;
        if (!existingKeys.has(dedupeKey(f))) {
          unique.push(f);
          existingKeys.add(dedupeKey(f));
        }
      }
    } else {
      const backfill = SEED_BANK.filter((q) => !existingKeys.has(dedupeKey(q)));
      for (const q of shuffle(backfill)) {
        if (unique.length >= totalCount) break;
        unique.push(q);
      }
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
