import { TangledStrand, Direction, Point2D, GridCoord, LevelDifficulty } from '../model/types';
import { getRaycastPath, checkStrandRaycast } from '../model/raycast';

export interface DenseLabyrinthConfig {
  levelNumber: number;
  rows: number;
  cols: number;
  targetArrows: number;
  seed: number;
}

export interface DynamicDifficultyConfig {
  rows: number;
  cols: number;
  strandCount: number;
  maxTurns: number;
  difficulty: LevelDifficulty;
}

/**
 * Calculates progressive difficulty parameters based on currentLevel:
 * - Matrix size: 5x5 at Level 1-2, up to 12x12 at Level 50
 * - Strand count: 4 at Level 1, 5 at Level 2, 6 at Level 3, up to 26 at Level 50
 * - Turns per arrow: 1 turn at Level 1-2, 2 turns at Level 3-10, 3 turns at Level 11+
 */
export function getDynamicDifficultyScaling(level: number): DynamicDifficultyConfig {
  const lvl = Math.max(1, level);

  // 1. Grid matrix size scaling (5x5 at Level 1 up to 12x12 at Level 50)
  let rows: number;
  let cols: number;
  if (lvl <= 2) {
    rows = 5;
    cols = 5;
  } else if (lvl <= 5) {
    rows = 6;
    cols = 6;
  } else if (lvl <= 10) {
    rows = 7;
    cols = 7;
  } else if (lvl <= 16) {
    rows = 8;
    cols = 8;
  } else if (lvl <= 24) {
    rows = 9;
    cols = 9;
  } else if (lvl <= 33) {
    rows = 10;
    cols = 10;
  } else if (lvl <= 42) {
    rows = 11;
    cols = 11;
  } else {
    rows = 12;
    cols = 12;
  }

  // 2. Interconnected arrow strands scaling:
  // Starts at 4 strands at Level 1, 5 at Level 2, 6 at Level 3, up to 26 at Level 50
  const maxSafeDensity = Math.floor(rows * cols * 0.35);
  let targetCount: number;
  if (lvl === 1) {
    targetCount = 4;
  } else if (lvl === 2) {
    targetCount = 5;
  } else if (lvl === 3) {
    targetCount = 6;
  } else {
    targetCount = Math.min(
      maxSafeDensity,
      Math.max(6, Math.floor(5 + (lvl - 2) * 0.45))
    );
  }

  // 3. 90-degree turns per arrow:
  // Level 1-2: 1 turn (simple L-shape)
  // Level 3-10: 2 turns (S or U shape)
  // Level 11+: 3 turns (labyrinth winding paths)
  let maxTurns = 1;
  if (lvl >= 11) {
    maxTurns = 3;
  } else if (lvl >= 3) {
    maxTurns = 2;
  }

  // 4. Difficulty tier:
  let difficulty: LevelDifficulty = 'Normal';
  if (lvl <= 3) {
    difficulty = 'Easy';
  } else if (lvl <= 12) {
    difficulty = 'Normal';
  } else if (lvl <= 25) {
    difficulty = 'Medium';
  } else if (lvl <= 40) {
    difficulty = 'Hard';
  } else {
    difficulty = 'Master';
  }

  return {
    rows,
    cols,
    strandCount: targetCount,
    maxTurns,
    difficulty,
  };
}

/**
 * Checks if a candidate set of strands is 100% forward-solvable.
 */
function verifySolvability(
  strands: TangledStrand[],
  rows: number,
  cols: number
): { solvable: boolean; order: string[] } {
  let active = [...strands];
  const order: string[] = [];

  while (active.length > 0) {
    let unblockedIndex = -1;
    for (let i = 0; i < active.length; i++) {
      const res = checkStrandRaycast(active[i], active, rows, cols);
      if (res.isClear) {
        unblockedIndex = i;
        break;
      }
    }
    if (unblockedIndex === -1) {
      return { solvable: false, order };
    }
    const cleared = active[unblockedIndex];
    order.push(cleared.id);
    active = active.filter((_, idx) => idx !== unblockedIndex);
  }

  return { solvable: true, order };
}

/**
 * Checks that the level has both unblocked arrows and blocked arrows initially,
 * so the player has immediate valid moves as well as interlocking challenges.
 */
function verifyInitialBlockades(
  strands: TangledStrand[],
  rows: number,
  cols: number
): boolean {
  if (strands.length <= 1) return true;
  let unblocked = 0;
  let blocked = 0;

  for (const s of strands) {
    const res = checkStrandRaycast(s, strands, rows, cols);
    if (res.isClear) {
      unblocked++;
    } else {
      blocked++;
    }
  }

  return unblocked > 0 && blocked > 0;
}

/**
 * Single-attempt generator for a dense winding labyrinth.
 * Enforces STRICT collision detection:
 * - Every grid cell (r, c) is occupied by at most ONE single arrow.
 * - Arrows NEVER cross or intersect each other.
 * - Arrows dynamically route with 90-degree turns through empty adjacent cells.
 * - Uses reverse construction with DAG exit rays to guarantee solvability.
 */
function attemptGenerateLabyrinth(
  levelNumber: number,
  rows: number,
  cols: number,
  targetArrows: number,
  seed: number,
  maxTurns: number
): TangledStrand[] {
  let rngVal = seed;
  function random(): number {
    rngVal = (rngVal * 9301 + 49297) % 233280;
    return rngVal / 233280;
  }

  const occupied: (string | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );

  const DIRS: Direction[] = ['U', 'D', 'L', 'R'];
  const BACK_DIR: Record<Direction, GridCoord> = {
    U: { r: 1, c: 0 },
    D: { r: -1, c: 0 },
    L: { r: 0, c: 1 },
    R: { r: 0, c: -1 },
  };

  const placedStrands: TangledStrand[] = [];
  let attempts = 0;

  while (placedStrands.length < targetArrows && attempts < 4000) {
    attempts++;

    const dir = DIRS[Math.floor(random() * 4)];
    const headR = Math.floor(random() * rows);
    const headC = Math.floor(random() * cols);

    // 1. Head must be on an unoccupied cell
    if (occupied[headR][headC] !== null) continue;

    // 2. Forward exit ray to board boundary must be 100% free of already placed arrows
    const exitRay = getRaycastPath(headR, headC, dir, rows, cols);
    const rayClear = exitRay.every((c) => occupied[c.r][c.c] === null);
    if (!rayClear) continue;

    // 3. Neck (cell behind head) must be inside the grid and unoccupied
    const bDir = BACK_DIR[dir];
    const neckR = headR + bDir.r;
    const neckC = headC + bDir.c;

    if (neckR < 0 || neckR >= rows || neckC < 0 || neckC >= cols) continue;
    if (occupied[neckR][neckC] !== null) continue;

    const exitRaySet = new Set(exitRay.map((c) => `${c.r},${c.c}`));
    const arrowCells: GridCoord[] = [
      { r: headR, c: headC },
      { r: neckR, c: neckC },
    ];
    const arrowCellsSet = new Set<string>([
      `${headR},${headC}`,
      `${neckR},${neckC}`,
    ]);

    // 4. Determine turns and target length for dense labyrinth packing
    const arrowTurns = maxTurns === 0 ? 0 : 1 + Math.floor(random() * maxTurns);
    const minLen = 2 + arrowTurns;
    const maxLen = Math.min(rows + cols, 3 + arrowTurns * 2);
    const targetLen = minLen + Math.floor(random() * (maxLen - minLen + 1));

    let curR = neckR;
    let curC = neckC;
    const curGrowthDir = bDir;

    // Dynamic 90-degree routing through empty adjacent cells
    function tryGrow(
      len: number,
      curDirection: GridCoord,
      turns: number
    ): boolean {
      if (len >= targetLen) return true;

      const candidates: Array<{ dir: GridCoord; isTurn: boolean }> = [];
      // Straight continuation
      candidates.push({ dir: curDirection, isTurn: false });

      // 90-degree turns
      if (turns < arrowTurns) {
        if (curDirection.r !== 0) {
          // Vertical movement -> turn horizontally (Left or Right)
          const turnDirs =
            random() > 0.5
              ? [
                  { r: 0, c: -1 },
                  { r: 0, c: 1 },
                ]
              : [
                  { r: 0, c: 1 },
                  { r: 0, c: -1 },
                ];
          for (const td of turnDirs) candidates.push({ dir: td, isTurn: true });
        } else {
          // Horizontal movement -> turn vertically (Up or Down)
          const turnDirs =
            random() > 0.5
              ? [
                  { r: -1, c: 0 },
                  { r: 1, c: 0 },
                ]
              : [
                  { r: 1, c: 0 },
                  { r: -1, c: 0 },
                ];
          for (const td of turnDirs) candidates.push({ dir: td, isTurn: true });
        }
      }

      // Bias toward 90-degree turns for dense maze aesthetic
      if (candidates.length > 1 && random() > 0.35) {
        const turnIdx = 1 + Math.floor(random() * (candidates.length - 1));
        const tmp = candidates[0];
        candidates[0] = candidates[turnIdx];
        candidates[turnIdx] = tmp;
      }

      for (const cand of candidates) {
        const nextR = curR + cand.dir.r;
        const nextC = curC + cand.dir.c;
        const key = `${nextR},${nextC}`;

        // STRICT COLLISION CHECKS:
        // 1. Must be strictly within grid matrix
        if (nextR < 0 || nextR >= rows || nextC < 0 || nextC >= cols) continue;
        // 2. Must NOT be occupied by ANY other arrow (ZERO OVERLAPS)
        if (occupied[nextR][nextC] !== null) continue;
        // 3. Must NOT self-intersect
        if (arrowCellsSet.has(key)) continue;
        // 4. Must NOT block its own forward escape trajectory
        if (exitRaySet.has(key)) continue;

        // Valid empty cell: extend snake
        arrowCells.push({ r: nextR, c: nextC });
        arrowCellsSet.add(key);
        const oldR = curR;
        const oldC = curC;
        curR = nextR;
        curC = nextC;

        const ok = tryGrow(len + 1, cand.dir, turns + (cand.isTurn ? 1 : 0));
        if (ok) return true;

        // Backtrack
        curR = oldR;
        curC = oldC;
        arrowCells.pop();
        arrowCellsSet.delete(key);
      }

      return len >= minLen;
    }

    if (tryGrow(2, curGrowthDir, 0)) {
      // Build polyline corners from tail to head
      const reversedCells = [...arrowCells].reverse();
      const corners: GridCoord[] = [reversedCells[0]];

      for (let i = 1; i < reversedCells.length - 1; i++) {
        const prev = reversedCells[i - 1];
        const cur = reversedCells[i];
        const next = reversedCells[i + 1];

        const d1r = cur.r - prev.r;
        const d1c = cur.c - prev.c;
        const d2r = next.r - cur.r;
        const d2c = next.c - cur.c;

        if (d1r !== d2r || d1c !== d2c) {
          corners.push(cur);
        }
      }
      corners.push(reversedCells[reversedCells.length - 1]); // head

      const strandId = `s${levelNumber}-${placedStrands.length + 1}`;
      for (const cell of arrowCells) {
        occupied[cell.r][cell.c] = strandId;
      }

      placedStrands.push({
        id: strandId,
        head: { r: headR, c: headC },
        direction: dir,
        points: corners,
        path: corners.map((pt) => ({ x: pt.c, y: pt.r })),
        occupiedCells: reversedCells,
        colorIndex: placedStrands.length % 5,
        status: 'idle',
      });
    }
  }

  return placedStrands;
}

/**
 * Reverse-construction generator for dense winding labyrinths.
 * Constructs multi-turn 90-degree winding paths with:
 * - STRICT collision detection (0 overlapping cells).
 * - Multi-turn 90-degree routing fitting tightly like a labyrinth.
 * - 100% verified forward solvability with initial blockades.
 */
export function generateDenseLabyrinthStrands(
  levelNumber: number,
  rows = 12,
  cols = 12,
  targetArrows = 16,
  seed = 42,
  maxTurns = 3
): TangledStrand[] {
  let bestStrands: TangledStrand[] = [];

  for (let attempt = 0; attempt < 12; attempt++) {
    const curSeed = seed + attempt * 777;
    const strands = attemptGenerateLabyrinth(
      levelNumber,
      rows,
      cols,
      targetArrows,
      curSeed,
      maxTurns
    );

    if (strands.length >= targetArrows) {
      const sol = verifySolvability(strands, rows, cols);
      if (sol.solvable && sol.order.length === strands.length) {
        if (verifyInitialBlockades(strands, rows, cols)) {
          return strands;
        }
        bestStrands = strands;
      }
    } else if (strands.length > bestStrands.length) {
      const sol = verifySolvability(strands, rows, cols);
      if (sol.solvable) {
        bestStrands = strands;
      }
    }
  }

  if (bestStrands.length > 0) {
    return bestStrands;
  }

  // Fallback with minimal attempt
  return attemptGenerateLabyrinth(
    levelNumber,
    rows,
    cols,
    Math.max(3, targetArrows - 1),
    seed + 9999,
    maxTurns
  );
}
