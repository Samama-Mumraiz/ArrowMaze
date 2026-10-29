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
