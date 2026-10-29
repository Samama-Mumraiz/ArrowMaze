import { TangledStrand, Direction, GridCoord } from '../model/types';
import { generateDenseLabyrinthStrands } from './labyrinthGenerator';

/**
 * Level 20: "Grand Labyrinth" (10x10 grid, 14 dense interlocking strands)
 * Generates tightly-packed 90-degree winding paths with 0 overlapping cells
 * and guaranteed 100% forward solvability.
 */
export function getLevel20Strands(): TangledStrand[] {
  return generateDenseLabyrinthStrands(20, 10, 10, 14, 20042, 3);
}

/**
 * Generates dense, complete, 100% solvable labyrinths for any level.
 * Guarantees all arrows have full winding paths, full tails, and correct arrowheads.
 * Never generates overlapping or broken arrows.
 */
export function getDenseLabyrinth(
  levelNumber: number,
  rows = 10,
  cols = 10
): TangledStrand[] {
  const targetArrows = Math.min(
    Math.floor(rows * cols * 0.3),
    Math.max(6, Math.floor(5 + levelNumber * 0.45))
  );
  return generateDenseLabyrinthStrands(
    levelNumber,
    rows,
    cols,
    targetArrows,
    levelNumber * 1000 + 42,
    3
  );
}
