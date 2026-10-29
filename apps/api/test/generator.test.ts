import test, { describe, it } from 'node:test';
import assert from 'node:assert';
import { QuestionSchema, QUESTION_CATEGORIES } from '@jumbo/shared';
import { SEED_BANK, generateQuestions } from '@jumbo/questions';

describe('Question Generator & Seed Bank (Spec §8)', () => {
  it('contains questions adhering to strict QuestionSchema', () => {
    assert.ok(SEED_BANK.length >= 45, `Expected at least 45 seed questions, got ${SEED_BANK.length}`);
    for (const q of SEED_BANK) {
      assert.doesNotThrow(() => {
        QuestionSchema.parse(q);
      }, `Question ${q.id} failed schema validation: ${q.text}`);
    }
  });

  it('guarantees each question has between 2 and 4 distinct options with exactly one correct option', () => {
    for (const q of SEED_BANK) {
      assert.ok(q.options.length >= 2 && q.options.length <= 4, `Question ${q.id} must have 2-4 options`);
      
      const optionIds = new Set(q.options.map((o) => o.id));
      assert.strictEqual(optionIds.size, q.options.length, `Question ${q.id} has duplicate option IDs`);

      const correctOptions = q.options.filter((o) => o.isCorrect === true);
      assert.strictEqual(correctOptions.length, 1, `Question ${q.id} must have exactly one correct option, found ${correctOptions.length}`);
    }
  });

  it('covers the specified question categories', () => {
    const presentCategories = new Set(SEED_BANK.map((q) => q.category));
    assert.ok(presentCategories.size >= 8, `Expected broad category coverage, got ${presentCategories.size}`);
    
    // Check key categories exist
    assert.ok(presentCategories.has('flags'), 'Missing flags category');
    assert.ok(presentCategories.has('science'), 'Missing science category');
    assert.ok(presentCategories.has('general_knowledge'), 'Missing general_knowledge category');
  });

  it('generates the requested number of questions without duplication', async () => {
    const requestedCount = 10;
    const questions = await generateQuestions({
      categories: ['flags', 'geography', 'science', 'general_knowledge'],
      count: requestedCount,
    });

    assert.strictEqual(questions.length, requestedCount);

    const questionIds = new Set(questions.map((q) => q.id));
    assert.strictEqual(questionIds.size, requestedCount, 'Generated questions must not contain duplicates');
  });
});
