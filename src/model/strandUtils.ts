import { Direction, GridCoord, Point2D, TangledStrand } from './types';

export type PathCoord = GridCoord | Point2D;

export function normalizeCoords(coords: PathCoord[]): GridCoord[] {
  return coords.map((pt) => {
    if ('x' in pt && 'y' in pt) {
      return { r: pt.y, c: pt.x };
    }
    return { r: (pt as GridCoord).r, c: (pt as GridCoord).c };
  });
}

/**
 * Interpolates all integer grid cells along the sequence of polyline points.
 */
export function interpolateStrandCells(points: GridCoord[]): GridCoord[] {
  const cells: GridCoord[] = [];
  const visited = new Set<string>();

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    const dr = Math.sign(p2.r - p1.r);
    const dc = Math.sign(p2.c - p1.c);

    let curR = p1.r;
    let curC = p1.c;

    while (true) {
      const key = `${curR},${curC}`;
      if (!visited.has(key)) {
        visited.add(key);
        cells.push({ r: curR, c: curC });
      }
      if (curR === p2.r && curC === p2.c) break;
      curR += dr;
      curC += dc;
    }
  }

  // Ensure head point is included
  const lastPoint = points[points.length - 1];
  if (lastPoint) {
    const headKey = `${lastPoint.r},${lastPoint.c}`;
    if (!visited.has(headKey)) {
      cells.push({ r: lastPoint.r, c: lastPoint.c });
    }
  }

  return cells;
}

/**
 * Creates a TangledStrand record with computed occupied cells.
 * Supports both multi-segment grid paths [{x, y}, ...] and points [{r, c}, ...].
 */
export function createStrand(
  id: string,
  pointsOrPath: PathCoord[],
  direction: Direction,
  colorIndex = 0
): TangledStrand {
  const points = normalizeCoords(pointsOrPath);
  const head = points[points.length - 1];
  const occupiedCells = interpolateStrandCells(points);
  const path: Point2D[] = points.map((p) => ({ x: p.c, y: p.r }));

  return {
    id,
    head,
    direction,
    points,
    path,
    occupiedCells,
    colorIndex,
    status: 'idle',
  };
}
