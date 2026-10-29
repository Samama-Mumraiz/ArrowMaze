import test from 'node:test';
import assert from 'node:assert/strict';
import { DIRECTION_ROTATION_DEG } from '../utils/constants';

test('Arrow SVG Geometry - Directional Rotations', () => {
  assert.equal(DIRECTION_ROTATION_DEG['UP'], -90);
  assert.equal(DIRECTION_ROTATION_DEG['DOWN'], 90);
  assert.equal(DIRECTION_ROTATION_DEG['LEFT'], 180);
  assert.equal(DIRECTION_ROTATION_DEG['RIGHT'], 0);

  // Short codes
  assert.equal(DIRECTION_ROTATION_DEG['U'], -90);
  assert.equal(DIRECTION_ROTATION_DEG['D'], 90);
  assert.equal(DIRECTION_ROTATION_DEG['L'], 180);
  assert.equal(DIRECTION_ROTATION_DEG['R'], 0);
});

test('Arrow SVG Geometry - Physical Pixel Calculation with CELL_SIZE / 2 centering', () => {
  const CELL_SIZE = 40;
  const path = [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 2, y: 2 },
  ];

  const pixelCoords = path.map((pt) => ({
    x: pt.x * CELL_SIZE + CELL_SIZE / 2,
    y: pt.y * CELL_SIZE + CELL_SIZE / 2,
  }));

  assert.deepEqual(pixelCoords, [
    { x: 20, y: 20 },
    { x: 100, y: 20 },
    { x: 100, y: 100 },
  ]);

  // Last coordinate for arrowhead positioning
  const lastCoord = pixelCoords[pixelCoords.length - 1];
  assert.deepEqual(lastCoord, { x: 100, y: 100 });

  // SVG Path generation
  let d = `M ${pixelCoords[0].x} ${pixelCoords[0].y}`;
  for (let i = 1; i < pixelCoords.length; i++) {
    d += ` L ${pixelCoords[i].x} ${pixelCoords[i].y}`;
  }

  assert.equal(d, 'M 20 20 L 100 20 L 100 100');
});

test('Arrow SVG Geometry - Straight and Multiple 90-degree Turns Support', () => {
  const CELL_SIZE = 30;
  const zigzagPath = [
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 3, y: 3 },
    { x: 5, y: 3 },
  ];

  const pixelCoords = zigzagPath.map((pt) => ({
    x: pt.x * CELL_SIZE + CELL_SIZE / 2,
    y: pt.y * CELL_SIZE + CELL_SIZE / 2,
  }));

  const lastCoord = pixelCoords[pixelCoords.length - 1];
  assert.deepEqual(lastCoord, { x: 5 * 30 + 15, y: 3 * 30 + 15 });
  assert.equal(lastCoord.x, 165);
  assert.equal(lastCoord.y, 105);
});

test('Arrow SVG Geometry - Exact User Snippet Calculation', () => {
  const CELL_SIZE = 60;
  const pathData = [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 2 }];

  // 1. Generate the continuous rounded line
  const dString = pathData.map((pt, index) => {
    const px = (pt.x * CELL_SIZE) + (CELL_SIZE / 2);
    const py = (pt.y * CELL_SIZE) + (CELL_SIZE / 2);
    return `${index === 0 ? 'M' : 'L'} ${px},${py}`;
  }).join(' ');

  assert.equal(dString, 'M 30,30 L 150,30 L 150,150');

  // 2. Calculate Arrowhead Position (Last point in path)
  const lastPt = pathData[pathData.length - 1];
  const endX = (lastPt.x * CELL_SIZE) + (CELL_SIZE / 2);
  const endY = (lastPt.y * CELL_SIZE) + (CELL_SIZE / 2);

  assert.equal(endX, 150);
  assert.equal(endY, 150);
});

test('Arrow SVG Geometry - Absolute Pixel Arrowhead Points', async () => {
  const { getArrowheadPoints } = await import('../utils/arrowGeometry');

  // RIGHT (x=100, y=100, arrowLength=10, halfWidth=8, baseOffset=3)
  const ptsR = getArrowheadPoints(100, 100, 'R', 10, 8);
  assert.equal(ptsR, '97,92 110,100 97,108');

  // LEFT
  const ptsL = getArrowheadPoints(100, 100, 'L', 10, 8);
  assert.equal(ptsL, '103,92 90,100 103,108');

  // DOWN
  const ptsD = getArrowheadPoints(100, 100, 'D', 10, 8);
  assert.equal(ptsD, '92,97 100,110 108,97');

  // UP
  const ptsU = getArrowheadPoints(100, 100, 'U', 10, 8);
  assert.equal(ptsU, '92,103 100,90 108,103');
});
