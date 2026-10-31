/**
 * Arrowhead Geometry Utilities
 * Computes exact SVG polygon points in absolute pixel space.
 * Eliminates transform/origin matrix displacement bugs on mobile SVG runtimes.
 */

export function getArrowheadPoints(
  x: number,
  y: number,
  direction: string,
  arrowLength = 9.5,
  halfWidth = 5.5
): string {
  const dirUpper = (direction || 'R').toUpperCase();

  if (dirUpper === 'RIGHT' || dirUpper === 'R') {
    // Tip points right (+X)
    const tipX = +(x + arrowLength).toFixed(1);
    const tipY = +y.toFixed(1);
    const base1X = +(x - 3).toFixed(1);
    const base1Y = +(y - halfWidth).toFixed(1);
    const base2X = +(x - 3).toFixed(1);
    const base2Y = +(y + halfWidth).toFixed(1);
    return `${base1X},${base1Y} ${tipX},${tipY} ${base2X},${base2Y}`;
  }

  if (dirUpper === 'LEFT' || dirUpper === 'L') {
    // Tip points left (-X)
    const tipX = +(x - arrowLength).toFixed(1);
    const tipY = +y.toFixed(1);
    const base1X = +(x + 3).toFixed(1);
    const base1Y = +(y - halfWidth).toFixed(1);
    const base2X = +(x + 3).toFixed(1);
    const base2Y = +(y + halfWidth).toFixed(1);
    return `${base1X},${base1Y} ${tipX},${tipY} ${base2X},${base2Y}`;
  }

  if (dirUpper === 'DOWN' || dirUpper === 'D') {
    // Tip points down (+Y)
    const tipX = +x.toFixed(1);
    const tipY = +(y + arrowLength).toFixed(1);
    const base1X = +(x - halfWidth).toFixed(1);
    const base1Y = +(y - 3).toFixed(1);
    const base2X = +(x + halfWidth).toFixed(1);
    const base2Y = +(y - 3).toFixed(1);
    return `${base1X},${base1Y} ${tipX},${tipY} ${base2X},${base2Y}`;
  }

  // UP or U (default)
  // Tip points up (-Y)
  const tipX = +x.toFixed(1);
  const tipY = +(y - arrowLength).toFixed(1);
  const base1X = +(x - halfWidth).toFixed(1);
  const base1Y = +(y + 3).toFixed(1);
  const base2X = +(x + halfWidth).toFixed(1);
  const base2Y = +(y + 3).toFixed(1);
  return `${base1X},${base1Y} ${tipX},${tipY} ${base2X},${base2Y}`;
}

/**
 * Translates structural node arrays [[x1, y1], [x2, y2], ...] or Point2D/GridCoord objects
 * dynamically into valid SVG <path d="..." /> coordinate strings using standard SVG absolute tracking (M, H, V).
 */
export function translateOrthogonalNodesToSvgPath(
  nodes: Array<[number, number] | { x: number; y: number } | { r: number; c: number }>,
  stepSize = 40
): string {
  if (!nodes || nodes.length === 0) return '';

  const pts = nodes.map((node) => {
    let gx = 0;
    let gy = 0;
    if (Array.isArray(node)) {
      gx = node[0];
      gy = node[1];
    } else if ('x' in node && 'y' in node) {
      gx = node.x;
      gy = node.y;
    } else if ('r' in node && 'c' in node) {
      gx = node.c;
      gy = node.r;
    }
    return {
      x: +(gx * stepSize + stepSize / 2).toFixed(2),
      y: +(gy * stepSize + stepSize / 2).toFixed(2),
    };
  });

  if (pts.length === 1) {
    return `M ${pts[0].x} ${pts[0].y}`;
  }

  let d = `M ${pts[0].x} ${pts[0].y}`;
  let prev = pts[0];

  for (let i = 1; i < pts.length; i++) {
    const cur = pts[i];
    if (cur.y === prev.y && cur.x !== prev.x) {
      d += ` H ${cur.x}`;
    } else if (cur.x === prev.x && cur.y !== prev.y) {
      d += ` V ${cur.y}`;
    } else {
      d += ` L ${cur.x} ${cur.y}`;
    }
    prev = cur;
  }

  return d;
}

/**
 * Proportional arrowhead polygon points scaled for 4px-5px slim strokes on 40px grid.
 * Bounded by markerWidth/markerHeight 5 to 6.
 */
export function getProportionalArrowheadPoints(
  x: number,
  y: number,
  direction: string,
  arrowLength = 7.5,
  halfWidth = 4.0
): string {
  return getArrowheadPoints(x, y, direction, arrowLength, halfWidth);
}

