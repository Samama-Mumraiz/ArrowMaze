/**
 * Pure Grid Matrix Operations for Arrow Free
 * Pure TypeScript - No React or React Native dependencies
 */

import { Arrow, Grid, GridCoord } from './types';

/**
 * Creates an empty N x M grid where every cell is null.
 */
export function createEmptyGrid(rows: number, cols: number): Grid {
  const grid: Grid = [];
  for (let r = 0; r < rows; r++) {
    const row: (Arrow | null)[] = [];
    for (let c = 0; c < cols; c++) {
      row.push(null);
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Deep clones a grid matrix and its arrow objects.
 */
export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) =>
    row.map((cell) => (cell ? { ...cell } : null))
  );
}

/**
 * Counts total non-null arrows currently on the grid.
 */
export function countArrows(grid: Grid): number {
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] !== null) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Checks if a coordinate is within grid bounds.
 */
export function isValidCoord(r: number, c: number, rows: number, cols: number): boolean {
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

/**
 * Returns orthogonal adjacent coordinates within grid bounds.
 */
export function getAdjacentCoords(
  r: number,
  c: number,
  rows: number,
  cols: number
): GridCoord[] {
  const deltas = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ];

  const adj: GridCoord[] = [];
  for (const { dr, dc } of deltas) {
    const nr = r + dr;
    const nc = c + dc;
    if (isValidCoord(nr, nc, rows, cols)) {
      adj.push({ r: nr, c: nc });
    }
  }
  return adj;
}

/**
 * Returns all outer-edge coordinates of the grid.
 */
export function getOuterEdgeCoords(rows: number, cols: number): GridCoord[] {
  const edgeCoords: GridCoord[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
        edgeCoords.push({ r, c });
      }
    }
  }
  return edgeCoords;
}
