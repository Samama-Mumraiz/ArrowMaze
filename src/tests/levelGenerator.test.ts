/**
 * Unit Tests for Reverse-Construction Level Generator & Solvability
 * Uses Node.js built-in test runner
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { countArrows } from '../model/grid';
import { generateLevel, solveGrid } from '../model/levelGenerator';

describe('Reverse-Construction Level Generator', () => {
  it('generates a grid with the requested arrow count on 5x5', () => {
    const targetCount = 8;
    const { grid } = generateLevel(5, 5, targetCount);
    const count = countArrows(grid);
    assert.equal(count, targetCount);
  });

  it('guarantees solvability using the forward solver check', () => {
    // Generate multiple random levels and verify all are 100% solvable
    for (let testLevel = 1; testLevel <= 5; testLevel++) {
      const targetCount = 6 + testLevel;
      const { grid } = generateLevel(5, 5, targetCount);
      const solveResult = solveGrid(grid);

      assert.equal(
        solveResult.solvable,
        true,
        `Level with ${targetCount} arrows must be solvable`
      );
      assert.equal(
        solveResult.solutionOrder.length,
        targetCount,
        `Solution order must clear all ${targetCount} arrows`
      );
    }
  });

  it('detects an intentionally unsolvable grid correctly', () => {
    // Four arrows pointing at each other in a loop: impossible to clear
    const { grid } = generateLevel(5, 5, 4);
    // Overwrite to create a cyclic deadlock
    grid[1][1] = { id: 'deadlock_1', direction: 'R', status: 'idle' }; // points to (1, 2)
    grid[1][2] = { id: 'deadlock_2', direction: 'D', status: 'idle' }; // points to (2, 2)
    grid[2][2] = { id: 'deadlock_3', direction: 'L', status: 'idle' }; // points to (2, 1)
    grid[2][1] = { id: 'deadlock_4', direction: 'U', status: 'idle' }; // points to (1, 1)

    // Clear all other cells
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (!((r === 1 || r === 2) && (c === 1 || c === 2))) {
          grid[r][c] = null;
        }
      }
    }

    const solveResult = solveGrid(grid);
    assert.equal(solveResult.solvable, false);
  });
});
