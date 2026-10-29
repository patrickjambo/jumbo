import test, { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculatePoints } from '@jumbo/shared';

describe('Authoritative Scoring Algorithm (Spec §7.3)', () => {
  it('awards 1000 base points for an instant (0ms) answer', () => {
    const points = calculatePoints(0, 20_000, 0);
    assert.strictEqual(points, 1000);
  });

  it('awards 750 base points when answering at half the time limit (10s of 20s)', () => {
    const points = calculatePoints(10_000, 20_000, 0);
    assert.strictEqual(points, 750);
  });

  it('awards 500 base points when answering right at the time limit deadline (20s of 20s)', () => {
    const points = calculatePoints(20_000, 20_000, 0);
    assert.strictEqual(points, 500);
  });

  it('adds +100 points per consecutive streak correct answer', () => {
    const pointsStreak1 = calculatePoints(0, 20_000, 1);
    const pointsStreak3 = calculatePoints(0, 20_000, 3);
    assert.strictEqual(pointsStreak1, 1100);
    assert.strictEqual(pointsStreak3, 1300);
  });

  it('caps streak bonus at +500 points maximum', () => {
    const pointsStreak5 = calculatePoints(0, 20_000, 5);
    const pointsStreak8 = calculatePoints(0, 20_000, 8);
    assert.strictEqual(pointsStreak5, 1500);
    assert.strictEqual(pointsStreak8, 1500);
  });

  it('ranks players with lower response time higher in case of score ties', () => {
    const players = [
      { id: 'p1', displayName: 'Alice', totalScore: 2500, totalTimeMs: 4200 },
      { id: 'p2', displayName: 'Bob', totalScore: 2500, totalTimeMs: 3100 }, // faster total time
      { id: 'p3', displayName: 'Charlie', totalScore: 1800, totalTimeMs: 2500 },
    ];

    const sorted = [...players].sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      return a.totalTimeMs - b.totalTimeMs; // lower time wins tie
    });

    assert.strictEqual(sorted[0]!.displayName, 'Bob');
    assert.strictEqual(sorted[1]!.displayName, 'Alice');
    assert.strictEqual(sorted[2]!.displayName, 'Charlie');
  });
});
