import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { checkStrandRaycast } from '../model/raycast';
import {
  createStrand,
  solveTangledStrands,
  CURATED_LEVELS,
  generateProceduralTangledLevel,
  getLevelConfig,
} from '../model/levelGenerator';
import { TangledStrand } from '../model/types';

describe('Tangled Strand Raycasting & Collisions', () => {
  it('returns isClear: true when strand head points directly off board', () => {
    const strand = createStrand(
      's1',
      [
        { r: 2, c: 0 },
        { r: 0, c: 0 },
      ],
      'U',
      0
    );

    const res = checkStrandRaycast(strand, [strand], 5, 5);
    assert.equal(res.isClear, true);
    assert.equal(res.scannedCells.length, 0); // At top edge (r=0) pointing U
  });

  it('detects when strand is blocked by another strand body', () => {
    // Blocker occupies row 1, col 2
    const blocker = createStrand(
      'blocker',
      [
        { r: 1, c: 0 },
        { r: 1, c: 4 },
      ],
      'R',
      1
    );

    // Target head is at (3, 2) pointing U towards (1, 2)
    const target = createStrand(
      'target',
      [
        { r: 4, c: 2 },
        { r: 3, c: 2 },
      ],
      'U',
      0
    );

    const res = checkStrandRaycast(target, [target, blocker], 5, 5);
    assert.equal(res.isClear, false);
    assert.equal(res.blockerStrandId, 'blocker');
    assert.deepEqual(res.blockerCoord, { r: 1, c: 2 });
  });

  it('detects when strand is blocked by another strand head', () => {
    const blocker = createStrand(
      'blocker',
      [
        { r: 2, c: 4 },
        { r: 2, c: 2 },
      ],
      'L',
      1
    );

    // Target head is at (4, 2) pointing U towards (2, 2)
    const target = createStrand(
      'target',
      [
        { r: 4, c: 2 },
      ],
      'U',
      0
    );

    const res = checkStrandRaycast(target, [target, blocker], 5, 5);
    assert.equal(res.isClear, false);
    assert.equal(res.blockerStrandId, 'blocker');
  });

  it('ignores strands with status: "moving" during raycast', () => {
    const movingBlocker: TangledStrand = {
      ...createStrand('moving-blocker', [{ r: 1, c: 2 }], 'R', 1),
      status: 'moving',
    };

    const target = createStrand('target', [{ r: 3, c: 2 }], 'U', 0);

    const res = checkStrandRaycast(target, [target, movingBlocker], 5, 5);
    assert.equal(res.isClear, true);
  });
});

describe('Curated Labyrinths Solvability (Levels 1 - 5)', () => {
  CURATED_LEVELS.forEach((level) => {
    it(`guarantees Knot ${level.levelNumber} ("${level.title}") is 100% solvable`, () => {
      const result = solveTangledStrands(level.strands, level.rows, level.cols);
      assert.equal(result.solvable, true, `Level ${level.levelNumber} must be solvable`);
      assert.equal(
        result.order.length,
        level.strands.length,
        `All ${level.strands.length} strands must be clearable in sequence`
      );
    });
  });
});

describe('Cyclic Deadlock Detection', () => {
  it('correctly reports unsolvable when strands are entangled in a 4-way deadlock cycle', () => {
    // 4 strands in a circular pinwheel: A blocks B, B blocks C, C blocks D, D blocks A
    const deadlockedStrands = [
      createStrand('sA', [{ r: 1, c: 1 }], 'R', 0), // points R towards col 3, blocked by sB at (1, 3)
      createStrand('sB', [{ r: 1, c: 3 }], 'D', 1), // points D towards row 3, blocked by sC at (3, 3)
      createStrand('sC', [{ r: 3, c: 3 }], 'L', 2), // points L towards col 1, blocked by sD at (3, 1)
      createStrand('sD', [{ r: 3, c: 1 }], 'U', 3), // points U towards row 1, blocked by sA at (1, 1)
    ];

    const result = solveTangledStrands(deadlockedStrands, 5, 5);
    assert.equal(result.solvable, false);
    assert.equal(result.order.length, 0);
  });
});

describe('Procedural Knot Generator & Level Config', () => {
  it('generates a verified solvable procedural tangled knot level', () => {
    const level = generateProceduralTangledLevel(6, 6, 6);
    assert.equal(level.levelNumber, 6);
    assert.ok(level.strands.length >= 3);

    const result = solveTangledStrands(level.strands, level.rows, level.cols);
    assert.equal(result.solvable, true);
  });

  it('getLevelConfig returns curated levels for 1-5 and procedural for 6+', () => {
    const lvl1 = getLevelConfig(1);
    assert.equal(lvl1.title, 'Neon Inception');
    assert.equal(lvl1.levelNumber, 1);
    assert.equal(lvl1.rows, 5);
    assert.equal(lvl1.cols, 5);

    const lvl6 = getLevelConfig(6);
    assert.equal(lvl6.levelNumber, 6);
    assert.ok(lvl6.strands.length > 0);
  });

  it('dynamically scales difficulty from 5x5 at Level 1 up to 12x12 at Level 50 and all are 100% solvable', () => {
    const lvl1 = getLevelConfig(1);
    assert.equal(lvl1.rows, 5);
    assert.equal(lvl1.cols, 5);

    const lvl50 = generateProceduralTangledLevel(50);
    assert.equal(lvl50.rows, 12);
    assert.equal(lvl50.cols, 12);
    assert.ok(lvl50.strands.length >= 20);

    const checkLevels = [1, 2, 5, 10, 25, 50];
    for (const lvlNum of checkLevels) {
      const cfg = getLevelConfig(lvlNum);
      const res = solveTangledStrands(cfg.strands, cfg.rows, cfg.cols);
      assert.equal(res.solvable, true, `Level ${lvlNum} must be 100% forward-solvable`);
      assert.equal(res.order.length, cfg.strands.length);
    }
  });
});

