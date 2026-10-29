import { Arrow, Coordinate } from '../types';
import { DIRECTIONS } from './constants';

/**
 * Generates the coordinates of the trajectory from the arrow to the edge of the board.
 * @param targetArrow - The arrow to check { x, y, direction, id }
 * @param gridSize - The size of the grid (e.g. 5, 6, 7, 8)
 * @returns Array of grid coordinates in the arrow's exit path
 */
export function getPathCoordinates(
  targetArrow: Pick<Arrow, 'x' | 'y' | 'direction'> | null | undefined,
  gridSize: number
): Coordinate[] {
  if (!targetArrow) return [];

  const path: Coordinate[] = [];
  const { x, y, direction } = targetArrow;

  switch (direction) {
    case DIRECTIONS.UP:
    case 'UP':
      for (let row = y - 1; row >= 0; row--) {
        path.push({ x, y: row });
      }
      break;

    case DIRECTIONS.DOWN:
    case 'DOWN':
      for (let row = y + 1; row < gridSize; row++) {
        path.push({ x, y: row });
      }
      break;

    case DIRECTIONS.LEFT:
    case 'LEFT':
      for (let col = x - 1; col >= 0; col--) {
        path.push({ x: col, y });
      }
      break;

    case DIRECTIONS.RIGHT:
    case 'RIGHT':
      for (let col = x + 1; col < gridSize; col++) {
        path.push({ x: col, y });
      }
      break;

    default:
      break;
  }

  return path;
}

/**
 * Returns all grid coordinates occupied by an arrow (interpolating straight segments between points).
 * @param arrow - The arrow to inspect
 * @returns Array of unique grid coordinates occupied by the arrow
 */
export function getArrowOccupiedCells(arrow: Arrow): Coordinate[] {
  if (!arrow.points || arrow.points.length === 0) {
    return [{ x: arrow.x, y: arrow.y }];
  }

  const cells: Coordinate[] = [];
  const visited = new Set<string>();

  for (let i = 0; i < arrow.points.length - 1; i++) {
    const p1 = arrow.points[i];
    const p2 = arrow.points[i + 1];

    const dx = Math.sign(p2.x - p1.x);
    const dy = Math.sign(p2.y - p1.y);

    let curX = p1.x;
    let curY = p1.y;

    while (true) {
      const key = `${curX},${curY}`;
      if (!visited.has(key)) {
        visited.add(key);
        cells.push({ x: curX, y: curY });
      }

      if (curX === p2.x && curY === p2.y) {
        break;
      }

      curX += dx;
      curY += dy;
    }
  }

  // Ensure head coordinate is always included
  const headKey = `${arrow.x},${arrow.y}`;
  if (!visited.has(headKey)) {
    cells.push({ x: arrow.x, y: arrow.y });
  }

  return cells;
}

/**
 * Pure function to check if an arrow has an unblocked path to exit the board.
 * @param targetArrow - The arrow attempting to exit
 * @param allActiveArrows - All currently active arrows on the board
 * @param gridSize - The dimensions of the grid
 * @returns True if the path is clear, false if blocked by another arrow
 */
export function checkIfPathIsClear(
  targetArrow: Arrow | null | undefined,
  allActiveArrows: Arrow[],
  gridSize: number
): boolean {
  if (!targetArrow || !Array.isArray(allActiveArrows)) {
    return false;
  }

  const exitPath = getPathCoordinates(targetArrow, gridSize);

  // If already at the boundary facing outward, path is clear
  if (exitPath.length === 0) {
    return true;
  }

  // Check if any active arrow (excluding the target) is located on the exit path
  for (const arrow of allActiveArrows) {
    if (arrow.id === targetArrow.id || arrow.isCleared) {
      continue;
    }

    const occupiedCells = getArrowOccupiedCells(arrow);

    const isBlocking = exitPath.some((pathCoord) =>
      occupiedCells.some((occ) => occ.x === pathCoord.x && occ.y === pathCoord.y)
    );

    if (isBlocking) {
      return false; // Path is blocked by an arrow
    }
  }

  return true; // Clear path to exit
}
