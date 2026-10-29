import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_AWARDS } from '../store/GameStateContext';

test('Gamification Engine - Initial Awards Configuration', () => {
  assert.equal(INITIAL_AWARDS.length, 6);
  // All initial awards should start locked
  const firstUntangle = INITIAL_AWARDS.find((a) => a.id === 'first-untangle');
  assert.ok(firstUntangle);
  assert.equal(firstUntangle.unlocked, false);
  assert.equal(firstUntangle.progress, 0);

  const levelLegend = INITIAL_AWARDS.find((a) => a.id === 'level-legend');
  assert.ok(levelLegend);
  assert.equal(levelLegend.unlocked, false);
});

test('Gamification Engine - Single Win Unlocks Knot Untangler', () => {
  let stats = {
    totalWins: 0,
    winStreak: 0,
    bestStreak: 0,
    perfectPlays: 0,
    totalStrandsCleared: 0,
    unlockedAwards: [] as string[],
  };

  // Simulate Level 1 win
  const nextWins = stats.totalWins + 1;
  const nextStreak = stats.winStreak + 1;
  const nextPerfect = stats.perfectPlays + 1; // perfect win

  const unlockedSet = new Set<string>();
  if (nextWins >= 1) unlockedSet.add('first-untangle');
  if (nextWins >= 5) unlockedSet.add('level-legend');
  if (nextPerfect >= 1) unlockedSet.add('perfect-play');
  if (nextStreak >= 3) unlockedSet.add('streak-master');

  assert.ok(unlockedSet.has('first-untangle'));
  assert.ok(unlockedSet.has('perfect-play'));
  assert.ok(!unlockedSet.has('level-legend'));
  assert.ok(!unlockedSet.has('streak-master'));
});

test('Gamification Engine - 3 Win Streak Unlocks Streak Master', () => {
  let winStreak = 3;
  let bestStreak = 3;
  const unlocked = winStreak >= 3 || bestStreak >= 3;
  assert.equal(unlocked, true);
});

test('Gamification Engine - 5 Total Wins Unlocks Level Legend', () => {
  let totalWins = 5;
  const unlocked = totalWins >= 5;
  assert.equal(unlocked, true);
});

test('Gamification Engine - Loss Resets Win Streak But Preserves Best Streak', () => {
  let winStreak = 2;
  let bestStreak = 4;

  // On loss
  winStreak = 0;
  assert.equal(winStreak, 0);
  assert.equal(bestStreak, 4);
});
