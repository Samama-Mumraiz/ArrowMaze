/**
 * Tangled Arrow Maze - Level Generator & Curated Labyrinths
 * Pure TypeScript - No React or React Native dependencies
 */

import { Direction, Grid, GridCoord, TangledStrand, LevelConfig } from './types';
import { checkRaycast, checkStrandRaycast, getRaycastPath } from './raycast';
import { createEmptyGrid, cloneGrid, countArrows, getOuterEdgeCoords } from './grid';
import { createStrand, interpolateStrandCells } from './strandUtils';
import { getLevel20Strands, getDenseLabyrinth } from '../levels/level20';
import { PROGRESSIVE_LEVELS } from '../levels/levelsData';
import {
  getDynamicDifficultyScaling,
  generateDenseLabyrinthStrands,
} from '../levels/labyrinthGenerator';

// Re-export for backwards compatibility
export {
  createStrand,
  interpolateStrandCells,
  PROGRESSIVE_LEVELS,
  getDynamicDifficultyScaling,
  generateDenseLabyrinthStrands,
};

/**
 * Forward solver simulation to verify that a set of tangled strands is 100% solvable.
 */
export function solveTangledStrands(
  strands: TangledStrand[],
  rows: number,
  cols: number
): { solvable: boolean; order: string[] } {
  let active = strands.map((s) => ({ ...s, status: 'idle' as const }));
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

/* =========================================================================
   Curated Handcrafted Tangled Labyrinths (Levels 1 - 5)
   Each level forms an intertwined knot designed for maximum aesthetic flow
   and guaranteed solvability.
   ========================================================================= */

export const CURATED_LEVELS: LevelConfig[] = PROGRESSIVE_LEVELS;

/**
 * Procedural generator for endless levels scaling from 5x5 at Level 1 up to 12x12 at Level 50.
 * Always produces dense, complete, 100% solvable labyrinths with full multi-point arrow paths.
 */
export function generateProceduralTangledLevel(
  levelNumber: number,
  customRows?: number,
  customCols?: number
): LevelConfig {
  const scaling = getDynamicDifficultyScaling(levelNumber);
  const rows = customRows || scaling.rows;
  const cols = customCols || scaling.cols;
  const strands = generateDenseLabyrinthStrands(
    levelNumber,
    rows,
    cols,
    scaling.strandCount,
    levelNumber * 1000 + 42,
    scaling.maxTurns
  );

  return {
    levelNumber,
    title: `Level ${levelNumber}`,
    subtitle: `${rows}x${cols} dynamic knot with ${strands.length} winding paths`,
    difficulty: scaling.difficulty,
    rows,
    cols,
    strands,
  };
}

/**
 * Gets level config by level number (curated or procedurally generated).
 * Every level is 100% verified solvable with full, complete, winding arrows.
 */
export function getLevelConfig(levelNumber: number): LevelConfig {
  const progressive = PROGRESSIVE_LEVELS.find((l) => l.levelNumber === levelNumber);
  if (progressive) {
    return progressive;
  }
  return generateProceduralTangledLevel(levelNumber);
}

/* =========================================================================
   Backwards-Compatible API (for existing unit tests)
   ========================================================================= */

export function solveGrid(initialGrid: Grid): {
  solvable: boolean;
  solutionOrder: Array<{ r: number; c: number; id: string }>;
} {
  const grid = cloneGrid(initialGrid);
  const solutionOrder: Array<{ r: number; c: number; id: string }> = [];
  const totalArrows = countArrows(grid);

  for (let step = 0; step < totalArrows; step++) {
    let clearedThisStep = false;

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const arrow = grid[r][c];
        if (arrow) {
          const result = checkRaycast(grid, r, c);
          if (result.isClear) {
            solutionOrder.push({ r, c, id: arrow.id });
            grid[r][c] = null;
            clearedThisStep = true;
            break;
          }
        }
      }
      if (clearedThisStep) break;
    }

    if (!clearedThisStep) {
      return { solvable: false, solutionOrder: [] };
    }
  }

  return {
    solvable: countArrows(grid) === 0,
    solutionOrder,
  };
}

export function generateLevel(
  rows = 5,
  cols = 5,
  targetCount = 10,
  maxAttempts = 50
): { grid: Grid; solutionOrder: Array<{ r: number; c: number; id: string }> } {
  const maxPossible = rows * cols - 1;
  const clampedTarget = Math.max(3, Math.min(targetCount, maxPossible));
  const allDirs: Direction[] = ['U', 'D', 'L', 'R'];

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const grid = createEmptyGrid(rows, cols);
    const placed: Array<{ r: number; c: number; direction: Direction; id: string }> = [];

    const edgeCoords = getOuterEdgeCoords(rows, cols);
    const startCoord = edgeCoords[Math.floor(Math.random() * edgeCoords.length)];
    const startDirs: Direction[] = [];
    if (startCoord.r === 0) startDirs.push('U');
    if (startCoord.r === rows - 1) startDirs.push('D');
    if (startCoord.c === 0) startDirs.push('L');
    if (startCoord.c === cols - 1) startDirs.push('R');
    const startDir = startDirs[Math.floor(Math.random() * startDirs.length)] || 'U';

    const firstId = `arr_1`;
    grid[startCoord.r][startCoord.c] = {
      id: firstId,
      direction: startDir,
      status: 'idle',
    };
    placed.push({ r: startCoord.r, c: startCoord.c, direction: startDir, id: firstId });

    let stuck = false;
    while (placed.length < clampedTarget && !stuck) {
      const candidates: Array<{ r: number; c: number; dir: Direction }> = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c] !== null) continue;

          const hasAdj = [
            { dr: -1, dc: 0 },
            { dr: 1, dc: 0 },
            { dr: 0, dc: -1 },
            { dr: 0, dc: 1 },
          ].some(({ dr, dc }) => {
            const nr = r + dr;
            const nc = c + dc;
            return nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== null;
          });

          if (!hasAdj) continue;

          for (const d of allDirs) {
            const path = getRaycastPath(r, c, d, rows, cols);
            const isClear = path.every((cell) => grid[cell.r][cell.c] === null);
            if (isClear) {
              candidates.push({ r, c, dir: d });
            }
          }
        }
      }

      if (candidates.length === 0) {
        stuck = true;
        break;
      }

      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      const nextId = `arr_${placed.length + 1}`;
      grid[pick.r][pick.c] = {
        id: nextId,
        direction: pick.dir,
        status: 'idle',
      };
      placed.push({ r: pick.r, c: pick.c, direction: pick.dir, id: nextId });
    }

    if (placed.length === clampedTarget) {
      const solveResult = solveGrid(grid);
      if (solveResult.solvable) {
        return { grid, solutionOrder: solveResult.solutionOrder };
      }
    }
  }

  // Fallback
  const fallbackGrid = createEmptyGrid(rows, cols);
  const edgeCoords = getOuterEdgeCoords(rows, cols);
  for (let i = 0; i < clampedTarget && i < edgeCoords.length; i++) {
    const { r, c } = edgeCoords[i];
    const dir: Direction = r === 0 ? 'U' : r === rows - 1 ? 'D' : c === 0 ? 'L' : 'R';
    fallbackGrid[r][c] = { id: `arr_${i + 1}`, direction: dir, status: 'idle' };
  }
  const solveResult = solveGrid(fallbackGrid);
  return { grid: fallbackGrid, solutionOrder: solveResult.solutionOrder };
}
