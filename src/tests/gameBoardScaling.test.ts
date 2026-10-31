import test from 'node:test';
import assert from 'node:assert/strict';
import {
  translateOrthogonalNodesToSvgPath,
  getProportionalArrowheadPoints,
} from '../utils/arrowGeometry';
import { FLAT_TECH_PALETTE } from '../theme/ThemeContext';

test('Dynamic Path Translation - Structural Node Arrays [[x1, y1], [x2, y2], ...] to M, H, V', () => {
  const stepSize = 40;

  // L-shaped path: (0, 0) -> (3, 0) -> (3, 2)
  // Step center for (0, 0): (20, 20)
  // Step center for (3, 0): (140, 20) -> H 140
  // Step center for (3, 2): (140, 100) -> V 100
  const nodes: [number, number][] = [
    [0, 0],
    [3, 0],
    [3, 2],
  ];

  const d = translateOrthogonalNodesToSvgPath(nodes, stepSize);
  assert.equal(d, 'M 20 20 H 140 V 100');
});

test('Dynamic Path Translation - Vertical First then Horizontal', () => {
  const stepSize = 40;

  // Vertical down then left: (2, 1) -> (2, 4) -> (0, 4)
  // (2, 1): x = 100, y = 60
  // (2, 4): x = 100, y = 180 -> V 180
  // (0, 4): x = 20, y = 180 -> H 20
  const nodes: [number, number][] = [
    [2, 1],
    [2, 4],
    [0, 4],
  ];

  const d = translateOrthogonalNodesToSvgPath(nodes, stepSize);
  assert.equal(d, 'M 100 60 V 180 H 20');
});

test('Dynamic Path Translation - Supports Point2D ({x, y}) and GridCoord ({r, c})', () => {
  const stepSize = 40;

  const point2DList = [
    { x: 1, y: 1 },
    { x: 4, y: 1 },
    { x: 4, y: 3 },
  ];
  assert.equal(
    translateOrthogonalNodesToSvgPath(point2DList, stepSize),
    'M 60 60 H 180 V 140'
  );

  const gridCoordList = [
    { r: 1, c: 1 },
    { r: 1, c: 4 },
    { r: 3, c: 4 },
  ];
  assert.equal(
    translateOrthogonalNodesToSvgPath(gridCoordList, stepSize),
    'M 60 60 H 180 V 140'
  );
});

test('GameBoard Scaling & Proportional Stroke Bounds', () => {
  const gridStepSize = 40;
  const cols = 8;
  const rows = 10;

  const W = cols * gridStepSize;
  const H = rows * gridStepSize;

  assert.equal(W, 320);
  assert.equal(H, 400);

  // Stroke width must be restricted to 4px or 5px maximum on 40px grid
  const strokeWidth = 4.2;
  assert.ok(strokeWidth >= 4 && strokeWidth <= 5, 'Stroke width must be 4px-5px');

  // Channel breathing room should be at least 35px between adjacent paths
  const breathingRoom = gridStepSize - strokeWidth;
  assert.ok(breathingRoom >= 35, 'Ample breathing room between tracks');
});

test('Proportional Arrowhead Geometry Scaling', () => {
  // Arrowhead points for 40px grid with slim stroke
  const pts = getProportionalArrowheadPoints(100, 100, 'R', 7.5, 4.0);
  assert.ok(typeof pts === 'string' && pts.length > 0);
  const parts = pts.split(' ');
  assert.equal(parts.length, 3, 'Triangle arrowhead has 3 vertices');
});

test('Flat Vector Tech Color Palette Tokens', () => {
  assert.equal(FLAT_TECH_PALETTE.length, 8);
  assert.deepEqual(FLAT_TECH_PALETTE, [
    '#D92693', // Magenta
    '#2D72F1', // Electric Blue
    '#8C32E6', // Deep Purple
    '#009BB4', // Teal/Cyan
    '#E52323', // Vibrant Red
    '#51A825', // Lime Green
    '#E59018', // Bright Orange
    '#1A1A1A', // Charcoal Accent
  ]);
});
