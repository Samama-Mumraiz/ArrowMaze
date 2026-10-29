/**
 * Pure Raycast and Collision Logic for Tangled Arrow Maze
 * Pure TypeScript - No React or React Native dependencies
 */

import { Direction, Grid, GridCoord, RaycastResult, TangledStrand } from './types';

/**
 * Computes the sequence of grid coordinates scanned from (r, c) along the given direction to the board edge.
 *
 * Raycast paths:
 * - U: cells (r - i, c) for i from 1 to r
 * - D: cells (r + i, c) for i from 1 to (numRows - 1 - r)
 * - L: cells (r, c - i) for i from 1 to c
 * - R: cells (r, c + i) for i from 1 to (numCols - 1 - c)
 */
export function getRaycastPath(
  r: number,
  c: number,
  direction: Direction,
  numRows: number,
  numCols: number
): GridCoord[] {
  const path: GridCoord[] = [];

  switch (direction) {
    case 'U':
      for (let i = 1; i <= r; i++) {
        path.push({ r: r - i, c });
      }
      break;

    case 'D':
      for (let i = 1; i <= numRows - 1 - r; i++) {
        path.push({ r: r + i, c });
      }
      break;

    case 'L':
      for (let i = 1; i <= c; i++) {
        path.push({ r, c: c - i });
      }
      break;

    case 'R':
      for (let i = 1; i <= numCols - 1 - c; i++) {
        path.push({ r, c: c + i });
      }
      break;
  }

  return path;
}

/**
 * Checks if a tangled strand has an unobstructed exit path from its head to the board edge.
 * If any other active strand's body or head intersects the exit trajectory, returns blocked.
 */
export function checkStrandRaycast(
  targetStrand: TangledStrand,
  allActiveStrands: TangledStrand[],
  numRows: number,
  numCols: number
): RaycastResult {
  const { head, direction } = targetStrand;
  const scannedCells = getRaycastPath(head.r, head.c, direction, numRows, numCols);

  // If already at boundary facing outward, path is clear
  if (scannedCells.length === 0) {
    return { isClear: true, scannedCells: [] };
  }

  for (const cell of scannedCells) {
    for (const other of allActiveStrands) {
      if (other.id === targetStrand.id || other.status === 'moving') {
        continue;
      }

      const isBlocked = other.occupiedCells.some(
        (occ) => occ.r === cell.r && occ.c === cell.c
      );

      if (isBlocked) {
        return {
          isClear: false,
          scannedCells,
          blockerStrandId: other.id,
          blockerCoord: { r: cell.r, c: cell.c },
        };
      }
    }
  }

  return {
    isClear: true,
    scannedCells,
  };
}

/**
 * Backwards-compatible checkRaycast for 2D grid matrix.
 */
export function checkRaycast(grid: Grid, r: number, c: number): RaycastResult {
  const numRows = grid.length;
  if (numRows === 0) {
    return { isClear: false, scannedCells: [] };
  }
  const numCols = grid[0].length;

  const arrow = grid[r]?.[c];
  if (!arrow) {
    return { isClear: false, scannedCells: [] };
  }

  const scannedCells = getRaycastPath(r, c, arrow.direction, numRows, numCols);

  for (const cell of scannedCells) {
    const occupant = grid[cell.r]?.[cell.c];
    if (occupant !== null && occupant !== undefined) {
      return {
        isClear: false,
        scannedCells,
        blockerCoord: { r: cell.r, c: cell.c },
      };
    }
  }

  return {
    isClear: true,
    scannedCells,
  };
}
