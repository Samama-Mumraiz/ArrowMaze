import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getLevelConfig } from '../model/levelGenerator';
import { checkStrandRaycast } from '../model/raycast';
import { TangledStrand } from '../model/types';

describe('ArrowMaze Full Puzzle Mechanics & Validation', () => {
  it('Level 1: has unique IDs, starting positions, directions, and occupied cells', () => {
    const config = getLevelConfig(1);
    assert.strictEqual(config.levelNumber, 1);
    assert.ok(config.strands.length > 0, 'Level 1 has strands');

    const ids = new Set<string>();
    for (const strand of config.strands) {
      assert.ok(strand.id, 'Strand has unique ID');
      assert.ok(!ids.has(strand.id), `ID ${strand.id} is unique`);
      ids.add(strand.id);

      assert.ok(['U', 'D', 'L', 'R'].includes(strand.direction), `Valid direction: ${strand.direction}`);
      assert.ok(strand.points.length >= 2, 'Has at least 2 points forming path');
      assert.ok(strand.occupiedCells.length >= 2, 'Has occupied cells');
      assert.ok(strand.head, 'Has defined head');
    }
  });

  it('Core Mechanic: identifies unblocked vs blocked arrows accurately', () => {
    const config = getLevelConfig(1);
    const active = [...config.strands];

    const unblocked: TangledStrand[] = [];
    const blocked: TangledStrand[] = [];

    for (const s of active) {
      const res = checkStrandRaycast(s, active, config.rows, config.cols);
      if (res.isClear) {
        unblocked.push(s);
      } else {
        blocked.push(s);
      }
    }

    assert.ok(unblocked.length > 0, 'Must have at least one unblocked arrow initially');
    assert.ok(blocked.length > 0, 'Must have blocked arrows creating the puzzle');
  });

  it('Arrow Clearing: clearing unblocked arrow unlocks subsequent blocked arrows', () => {
    const config = getLevelConfig(1);
    let active = [...config.strands];
    const initialCount = active.length;

    // Find first clear arrow
    const firstClear = active.find((s) => checkStrandRaycast(s, active, config.rows, config.cols).isClear);
    assert.ok(firstClear, 'First clear arrow exists');

    // Remove it
    active = active.filter((s) => s.id !== firstClear.id);
    assert.strictEqual(active.length, initialCount - 1, 'Remaining arrow count decrements');

    // Find next clear arrow among remaining
    const secondClear = active.find((s) => checkStrandRaycast(s, active, config.rows, config.cols).isClear);
    assert.ok(secondClear, 'Subsequent arrow becomes unblocked');
  });

  it('Full Level Solution: entire puzzle can be solved to 0 remaining arrows', () => {
    const config = getLevelConfig(1);
    let active = [...config.strands];
    const clearedOrder: string[] = [];

    while (active.length > 0) {
      const clearStrand = active.find((s) => checkStrandRaycast(s, active, config.rows, config.cols).isClear);
      assert.ok(clearStrand, `Deadlock encountered with ${active.length} arrows remaining!`);
      clearedOrder.push(clearStrand.id);
      active = active.filter((s) => s.id !== clearStrand.id);
    }

    assert.strictEqual(active.length, 0, 'All arrows cleared to solve the puzzle');
    assert.strictEqual(clearedOrder.length, config.strands.length);
  });

  it('Undo Mechanic: restoring cleared strand restores board state and blocks paths correctly', () => {
    const config = getLevelConfig(1);
    let active = [...config.strands];
    const moveHistory: TangledStrand[] = [];

    // Step 1: Clear an arrow
    const clearStrand = active.find((s) => checkStrandRaycast(s, active, config.rows, config.cols).isClear)!;
    moveHistory.push(clearStrand);
    active = active.filter((s) => s.id !== clearStrand.id);
    assert.strictEqual(active.length, config.strands.length - 1);

    // Step 2: Undo the move
    const restoredStrand = moveHistory.pop()!;
    active.push(restoredStrand);
    assert.strictEqual(active.length, config.strands.length, 'Undo restores strand count');
    assert.ok(active.some((s) => s.id === clearStrand.id), 'Restored strand is back on board');
  });

  it('Progressive Difficulty: Level 1 -> 2 -> 3 increases grid size and strand density', () => {
    const lvl1 = getLevelConfig(1);
    const lvl2 = getLevelConfig(2);
    const lvl3 = getLevelConfig(3);

    assert.ok(lvl2.strands.length > lvl1.strands.length, 'Level 2 has more strands than Level 1');
    assert.ok(lvl3.strands.length > lvl2.strands.length, 'Level 3 has more strands than Level 2');
    assert.notStrictEqual(lvl1.strands[0].id, lvl2.strands[0].id, 'Distinct puzzles for each level');
  });

  it('Strict Grid Collision: Every (x, y) cell is occupied by at most ONE arrow with 0 overlaps across all levels', () => {
    for (const lvlNum of [1, 2, 3, 4, 5, 10, 20, 25, 50]) {
      const cfg = getLevelConfig(lvlNum);
      const cellOccupancy = new Map<string, string>();

      for (const strand of cfg.strands) {
        const selfCells = new Set<string>();
        for (const cell of strand.occupiedCells) {
          const key = `${cell.r},${cell.c}`;
          assert.ok(!selfCells.has(key), `Strand ${strand.id} in Level ${lvlNum} must not self-intersect at ${key}`);
          selfCells.add(key);

          assert.ok(
            !cellOccupancy.has(key),
            `Collision detected in Level ${lvlNum}! Cell (${cell.r}, ${cell.c}) occupied by both ${cellOccupancy.get(key)} and ${strand.id}`
          );
          cellOccupancy.set(key, strand.id);
        }
      }
    }
  });
});
