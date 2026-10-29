import test from 'node:test';
import assert from 'node:assert/strict';
import { computeSnakeGeometry, DIRECTION_ROTATION_MAP } from '../utils/snakeGeometry';

test('Snake Geometry - Directional Rotations', () => {
  assert.equal(DIRECTION_ROTATION_MAP['UP'], -90);
  assert.equal(DIRECTION_ROTATION_MAP['DOWN'], 90);
  assert.equal(DIRECTION_ROTATION_MAP['LEFT'], 180);
  assert.equal(DIRECTION_ROTATION_MAP['RIGHT'], 0);
  assert.equal(DIRECTION_ROTATION_MAP['U'], -90);
  assert.equal(DIRECTION_ROTATION_MAP['D'], 90);
  assert.equal(DIRECTION_ROTATION_MAP['L'], 180);
  assert.equal(DIRECTION_ROTATION_MAP['R'], 0);
});

test('Snake Geometry - Static Idle State (progress = 0)', () => {
  const pathData = [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 2, y: 2 },
  ];
  const cellSize = 60;
  const result = computeSnakeGeometry(pathData, cellSize, 'DOWN', 0, 360);

  // Exact centering: 0 * 60 + 30 = 30; 2 * 60 + 30 = 150
  assert.equal(result.dString, 'M 30,30 L 150,30 L 150,150');
  assert.equal(result.headX, 150);
  assert.equal(result.headY, 150);
  assert.equal(result.rotation, 90);
});

test('Snake Geometry - Slithering along L-Shape Path at Progress 0.5', () => {
  const pathData = [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 2, y: 2 },
  ];
  const cellSize = 60;
  const exitDistance = 240;
  // Total track: (30,30) -> (150,30) [120px] -> (150,150) [120px] -> (150,390) [240px]
  // Total original length = 240px
  // Total slither distance = 240 + 240 = 480px
  // At progress 0.25: slithered 120px
  const res25 = computeSnakeGeometry(pathData, cellSize, 'DOWN', 0.25, exitDistance);

  // At 120px slithered: tail has traveled exactly to the corner (150, 30)!
  assert.equal(Math.round(res25.tailX), 150);
  assert.equal(Math.round(res25.tailY), 30);
  // Head has traveled 120px past the original head (150, 150) -> (150, 270)!
  assert.equal(Math.round(res25.headX), 150);
  assert.equal(Math.round(res25.headY), 270);
  assert.equal(res25.rotation, 90);
});

test('Snake Geometry - Straight Arrow Slithers Right', () => {
  const pathData = [
    { x: 1, y: 1 },
    { x: 3, y: 1 },
  ];
  const cellSize = 40;
  // (60, 60) -> (140, 60), length = 80px
  const res = computeSnakeGeometry(pathData, cellSize, 'RIGHT', 0, 200);
  assert.equal(res.dString, 'M 60,60 L 140,60');
  assert.equal(res.headX, 140);
  assert.equal(res.headY, 60);
  assert.equal(res.rotation, 0);

  // When progress = 0.5
  const resMid = computeSnakeGeometry(pathData, cellSize, 'RIGHT', 0.5, 200);
  // Slither distance = 80 + 200 = 280; 0.5 * 280 = 140px forward
  assert.equal(resMid.tailX > 60, true);
  assert.equal(resMid.headX > 140, true);
  assert.equal(resMid.rotation, 0);
});
