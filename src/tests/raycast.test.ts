/**
 * Unit Tests for Raycast and Collision Logic
 * Uses Node.js built-in test runner (node:test, node:assert)
 * Runs against pure TypeScript model with no React Native imports
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createEmptyGrid } from '../model/grid';
import { checkRaycast, getRaycastPath } from '../model/raycast';
import { Direction, Grid } from '../model/types';

describe('Raycast Path Generation', () => {
  const rows = 5;
  const cols = 5;

  it('generates correct path upward (U)', () => {
    // From (3, 2), UP goes to (2, 2), (1, 2), (0, 2)
    const path = getRaycastPath(3, 2, 'U', rows, cols);
    assert.deepEqual(path, [
      { r: 2, c: 2 },
      { r: 1, c: 2 },
      { r: 0, c: 2 },
    ]);
  });

  it('generates correct path downward (D)', () => {
    // From (1, 2), DOWN goes to (2, 2), (3, 2), (4, 2)
    const path = getRaycastPath(1, 2, 'D', rows, cols);
    assert.deepEqual(path, [
      { r: 2, c: 2 },
      { r: 3, c: 2 },
      { r: 4, c: 2 },
    ]);
  });

  it('generates correct path leftward (L)', () => {
    // From (2, 3), LEFT goes to (2, 2), (2, 1), (2, 0)
    const path = getRaycastPath(2, 3, 'L', rows, cols);
    assert.deepEqual(path, [
      { r: 2, c: 2 },
      { r: 2, c: 1 },
      { r: 2, c: 0 },
    ]);
  });

  it('generates correct path rightward (R)', () => {
    // From (2, 1), RIGHT goes to (2, 2), (2, 3), (2, 4)
    const path = getRaycastPath(2, 1, 'R', rows, cols);
    assert.deepEqual(path, [
      { r: 2, c: 2 },
      { r: 2, c: 3 },
      { r: 2, c: 4 },
    ]);
  });

  it('generates empty path for boundary cells facing outward', () => {
    assert.deepEqual(getRaycastPath(0, 2, 'U', rows, cols), []);
    assert.deepEqual(getRaycastPath(4, 2, 'D', rows, cols), []);
    assert.deepEqual(getRaycastPath(2, 0, 'L', rows, cols), []);
    assert.deepEqual(getRaycastPath(2, 4, 'R', rows, cols), []);
  });
});

describe('Raycast Validation & Collision Detection', () => {
  it('returns isClear: true when path to edge has no arrows', () => {
    const grid: Grid = createEmptyGrid(5, 5);
    grid[2][2] = { id: 'a1', direction: 'U', status: 'idle' };

    const result = checkRaycast(grid, 2, 2);
    assert.equal(result.isClear, true);
    assert.equal(result.blockerCoord, undefined);
  });

  it('returns isClear: false when blocked in direction U', () => {
    const grid: Grid = createEmptyGrid(5, 5);
    grid[3][2] = { id: 'a1', direction: 'U', status: 'idle' };
    grid[1][2] = { id: 'blocker', direction: 'L', status: 'idle' };

    const result = checkRaycast(grid, 3, 2);
    assert.equal(result.isClear, false);
    assert.deepEqual(result.blockerCoord, { r: 1, c: 2 });
  });

  it('returns isClear: false when blocked in direction D', () => {
    const grid: Grid = createEmptyGrid(5, 5);
    grid[1][2] = { id: 'a1', direction: 'D', status: 'idle' };
    grid[3][2] = { id: 'blocker', direction: 'R', status: 'idle' };

    const result = checkRaycast(grid, 1, 2);
    assert.equal(result.isClear, false);
    assert.deepEqual(result.blockerCoord, { r: 3, c: 2 });
  });

  it('returns isClear: false when blocked in direction L', () => {
    const grid: Grid = createEmptyGrid(5, 5);
    grid[2][3] = { id: 'a1', direction: 'L', status: 'idle' };
    grid[2][0] = { id: 'blocker', direction: 'U', status: 'idle' };

    const result = checkRaycast(grid, 2, 3);
    assert.equal(result.isClear, false);
    assert.deepEqual(result.blockerCoord, { r: 2, c: 0 });
  });

  it('returns isClear: false when blocked in direction R', () => {
    const grid: Grid = createEmptyGrid(5, 5);
    grid[2][1] = { id: 'a1', direction: 'R', status: 'idle' };
    grid[2][4] = { id: 'blocker', direction: 'D', status: 'idle' };

    const result = checkRaycast(grid, 2, 1);
    assert.equal(result.isClear, false);
    assert.deepEqual(result.blockerCoord, { r: 2, c: 4 });
  });
});

describe('Boundary Cell Edge Cases', () => {
  it('outer boundary cells facing outward are always clear', () => {
    const grid: Grid = createEmptyGrid(5, 5);
    grid[0][1] = { id: 'top', direction: 'U', status: 'idle' };
    grid[4][1] = { id: 'bottom', direction: 'D', status: 'idle' };
    grid[1][0] = { id: 'left', direction: 'L', status: 'idle' };
    grid[1][4] = { id: 'right', direction: 'R', status: 'idle' };

    assert.equal(checkRaycast(grid, 0, 1).isClear, true);
    assert.equal(checkRaycast(grid, 4, 1).isClear, true);
    assert.equal(checkRaycast(grid, 1, 0).isClear, true);
    assert.equal(checkRaycast(grid, 1, 4).isClear, true);
  });

  it('outer boundary cell facing inwards can be blocked by inner arrow', () => {
    const grid: Grid = createEmptyGrid(5, 5);
    grid[0][2] = { id: 'top_inward', direction: 'D', status: 'idle' };
    grid[2][2] = { id: 'obstacle', direction: 'R', status: 'idle' };

    const result = checkRaycast(grid, 0, 2);
    assert.equal(result.isClear, false);
    assert.deepEqual(result.blockerCoord, { r: 2, c: 2 });
  });

  it('empty cell returns isClear: false with empty scanned path', () => {
    const grid: Grid = createEmptyGrid(5, 5);
    const result = checkRaycast(grid, 2, 2);
    assert.equal(result.isClear, false);
    assert.deepEqual(result.scannedCells, []);
  });
});
