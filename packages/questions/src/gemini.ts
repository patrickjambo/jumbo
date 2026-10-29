/**
 * Spec §8.2 — Optional AI Question Generator via Google Gemini API
 * Strict JSON schema validation with Zod; rejects malformed output; graceful fallback.
 */

import { QuestionSchema, type Question } from '@jumbo/shared';
import { randomId, shuffle } from './generator.js';

interface GeminiResponseShape {
  questions: Array<{
    text: string;
    correctAnswer: string;
    distractors: [string, string, string];
    difficulty?: 'easy' | 'medium' | 'hard';
    timeLimit?: number;
  }>;
}

export async function generateWithGemini(
  category: string,
  count: number,
  apiKey?: string,
): Promise<Question[]> {
  const key = apiKey || process.env['GEMINI_API_KEY'];
  if (!key) return [];

  const prompt = `Generate ${count} high-quality, engaging multiple-choice trivia questions for the category "${category}".
Return ONLY a valid JSON object matching this schema:
{
  "questions": [
    {
      "text": "The question text here?",
      "correctAnswer": "The exact correct answer",
      "distractors": ["Wrong answer 1", "Wrong answer 2", "Wrong answer 3"],
      "difficulty": "medium",
      "timeLimit": 20
    }
  ]
}
Requirements:
1. Questions must be factual, respectful, and unambiguous.
2. The correct answer and distractors must be completely distinct.
3. Keep question text under 200 characters.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.warn(`[Gemini] API returned status ${res.status}`);
      return [];
    }

    const data = await res.json() as any;
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return [];

    const parsed = JSON.parse(rawText) as GeminiResponseShape;
    if (!parsed || !Array.isArray(parsed.questions)) return [];

    const validated: Question[] = [];
    for (const q of parsed.questions) {
      try {
        const optTexts = shuffle([q.correctAnswer, ...q.distractors.slice(0, 3)]);
        const options = optTexts.map((text) => ({
          id: randomId(),
          text,
          isCorrect: text === q.correctAnswer,
        }));

        const question = QuestionSchema.parse({
          id: randomId(),
          category,
          text: q.text,
          options,
          timeLimit: q.timeLimit ?? 20,
          difficulty: q.difficulty ?? 'medium',
          source: 'gemini-ai',
          points: 1000,
        });

        validated.push(question);
      } catch (err) {
        // Reject individual malformed questions as per Spec §8.2
        console.warn('[Gemini] Rejected malformed question', err);
      }
    }

    return validated;
  } catch (err) {
    console.warn('[Gemini] Generation failed, falling back to seed bank:', err);
    return [];
  }
}
