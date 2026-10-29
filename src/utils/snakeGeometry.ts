/**
 * Snake Slithering Geometry for Directional Arrow Puzzles
 * Pure TypeScript - No React or React Native dependencies
 *
 * Implements continuous orthogonal path slicing so arrows slither
 * like a snake along their existing tracks, turning corners smoothly
 * as they exit.
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface SnakeGeometryResult {
  dString: string;
  headX: number;
  headY: number;
  rotation: number;
  tailX: number;
  tailY: number;
}

/**
 * Directional rotation mapping based on polygon arrowhead with base along Y and tip along +X:
 * points="-8,-8 8,0 -8,8" (or "-10,-10 10,0 -10,10")
 * At 0deg: tip points RIGHT (+X).
 */
export const DIRECTION_ROTATION_MAP: Record<string, number> = {
  UP: -90,
  DOWN: 90,
  LEFT: 180,
  RIGHT: 0,
  U: -90,
  D: 90,
  L: 180,
  R: 0,
};

function getSegmentAngle(pA: Point2D, pB: Point2D, fallback: number): number {
  const dx = pB.x - pA.x;
  const dy = pB.y - pA.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 0 : 180;
  } else if (Math.abs(dy) > 0) {
    return dy > 0 ? 90 : -90;
  }
  return fallback;
}

/**
 * Computes the exact snake path d-string and arrowhead coordinates.
 *
 * When progress == 0:
 * Returns the exact full static arrow path from tail to head,
 * with arrowhead at the head.
 *
 * When progress > 0 (during exit animation):
 * The snake slithers forward along its track:
 * - The head moves along the exit vector off the board.
 * - The tail follows behind along the exact same path segments and corners.
 * - The arrow preserves its length and turns every corner like a real snake.
 */
export function computeSnakeGeometry(
  pathData: Point2D[],
  cellSize: number,
  direction: string,
  progress: number = 0,
  exitDistance: number = 360
): SnakeGeometryResult {
  if (!pathData || pathData.length === 0) {
    return { dString: '', headX: 0, headY: 0, rotation: 0, tailX: 0, tailY: 0 };
  }

  // 1. Convert grid coordinates to physical pixel track (centered at cellSize / 2)
  const track: Point2D[] = pathData.map((pt) => ({
    x: pt.x * cellSize + cellSize / 2,
    y: pt.y * cellSize + cellSize / 2,
  }));

  const lastPt = track[track.length - 1];
  const firstPt = track[0];

  let exitDx = 0;
  let exitDy = 0;
  const dirUpper = (direction || 'RIGHT').toUpperCase();
  const baseRotation = DIRECTION_ROTATION_MAP[dirUpper] ?? 0;

  if (dirUpper === 'UP' || dirUpper === 'U') {
    exitDy = -exitDistance;
  } else if (dirUpper === 'DOWN' || dirUpper === 'D') {
    exitDy = exitDistance;
  } else if (dirUpper === 'LEFT' || dirUpper === 'L') {
    exitDx = -exitDistance;
  } else {
    exitDx = exitDistance;
  }

  // Extended track includes the forward exit vector
  const fullTrack: Point2D[] = [
    ...track,
    { x: lastPt.x + exitDx, y: lastPt.y + exitDy },
  ];

  // 2. Compute cumulative lengths of fullTrack segments
  const cumLengths: number[] = [0];
  for (let i = 0; i < fullTrack.length - 1; i++) {
    const dx = fullTrack[i + 1].x - fullTrack[i].x;
    const dy = fullTrack[i + 1].y - fullTrack[i].y;
    const segLen = Math.hypot(dx, dy);
    cumLengths.push(cumLengths[i] + segLen);
  }

  const origLength = cumLengths[track.length - 1];
  const totalTrackLength = cumLengths[cumLengths.length - 1];

  // Static idle state: full original path
  if (progress <= 0) {
    const dString = track
      .map((pt, index) => `${index === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`)
      .join(' ');

    return {
      dString,
      headX: lastPt.x,
      headY: lastPt.y,
      rotation: baseRotation,
      tailX: firstPt.x,
      tailY: firstPt.y,
    };
  }

  // Slithering distance calculation
  const slitherDistance = origLength + exitDistance;
  const currentSlither = Math.min(slitherDistance, Math.max(0, progress * slitherDistance));

  const dTail = currentSlither;
  const dHead = Math.min(totalTrackLength, origLength + currentSlither);

  const sampleAt = (d: number): { pt: Point2D; segIndex: number; angle: number } => {
    if (d <= 0) {
      const p0 = fullTrack[0];
      const p1 = fullTrack[1] || p0;
      return { pt: { ...p0 }, segIndex: 0, angle: getSegmentAngle(p0, p1, baseRotation) };
    }
    for (let i = 0; i < cumLengths.length - 1; i++) {
      if (d <= cumLengths[i + 1]) {
        const segLen = cumLengths[i + 1] - cumLengths[i];
        const alpha = segLen > 0 ? (d - cumLengths[i]) / segLen : 0;
        const pA = fullTrack[i];
        const pB = fullTrack[i + 1];
        return {
          pt: {
            x: pA.x + alpha * (pB.x - pA.x),
            y: pA.y + alpha * (pB.y - pA.y),
          },
          segIndex: i,
          angle: getSegmentAngle(pA, pB, baseRotation),
        };
      }
    }
    const last = fullTrack[fullTrack.length - 1];
    return { pt: { ...last }, segIndex: fullTrack.length - 2, angle: baseRotation };
  };

  const tailSample = sampleAt(dTail);
  const headSample = sampleAt(dHead);

  // Build the continuous snake body path
  const snakePoints: Point2D[] = [tailSample.pt];

  // Include intermediate path vertices between moving tail and head
  for (let j = tailSample.segIndex + 1; j <= headSample.segIndex; j++) {
    snakePoints.push(fullTrack[j]);
  }
  snakePoints.push(headSample.pt);

  const dString = snakePoints
    .map((pt, index) => `${index === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`)
    .join(' ');

  return {
    dString,
    headX: headSample.pt.x,
    headY: headSample.pt.y,
    rotation: headSample.angle,
    tailX: tailSample.pt.x,
    tailY: tailSample.pt.y,
  };
}
