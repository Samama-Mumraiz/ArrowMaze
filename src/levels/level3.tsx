import { Level } from '../types';
import { DIRECTIONS } from '../utils/constants';

export const level3: Level = {
  id: 'level-3',
  levelNumber: 3,
  title: 'Level 3',
  subtitle: 'Grid Expansion (9 Arrows)',
  gridSize: 6,
  difficulty: 'Medium',
  arrows: [
    {
      id: 'l3-1',
      x: 0,
      y: 0,
      direction: DIRECTIONS.LEFT,
      isCleared: false,
      points: [
        { x: 1, y: 1 },
        { x: 1, y: 0 },
        { x: 0, y: 0 },
      ],
    },
    {
      id: 'l3-2',
      x: 3,
      y: 0,
      direction: DIRECTIONS.LEFT,
      isCleared: false,
      points: [
        { x: 4, y: 0 },
        { x: 3, y: 0 },
      ],
    },
    {
      id: 'l3-3',
      x: 2,
      y: 2,
      direction: DIRECTIONS.UP,
      isCleared: false,
      points: [
        { x: 1, y: 3 },
        { x: 2, y: 3 },
        { x: 2, y: 2 },
      ],
    },
    {
      id: 'l3-4',
      x: 5,
      y: 2,
      direction: DIRECTIONS.RIGHT,
      isCleared: false,
      points: [
        { x: 5, y: 1 },
        { x: 5, y: 2 },
      ],
    },
    {
      id: 'l3-5',
      x: 4,
      y: 2,
      direction: DIRECTIONS.RIGHT,
      isCleared: false,
      points: [
        { x: 3, y: 1 },
        { x: 4, y: 1 },
        { x: 4, y: 2 },
      ],
    },
    {
      id: 'l3-6',
      x: 4,
      y: 5,
      direction: DIRECTIONS.DOWN,
      isCleared: false,
      points: [
        { x: 4, y: 4 },
        { x: 4, y: 5 },
      ],
    },
    {
      id: 'l3-7',
      x: 4,
      y: 3,
      direction: DIRECTIONS.DOWN,
      isCleared: false,
      points: [
        { x: 3, y: 3 },
        { x: 4, y: 3 },
      ],
    },
    {
      id: 'l3-8',
      x: 0,
      y: 4,
      direction: DIRECTIONS.LEFT,
      isCleared: false,
      points: [
        { x: 1, y: 5 },
        { x: 1, y: 4 },
        { x: 0, y: 4 },
      ],
    },
    {
      id: 'l3-9',
      x: 3,
      y: 4,
      direction: DIRECTIONS.LEFT,
      isCleared: false,
      points: [
        { x: 3, y: 5 },
        { x: 3, y: 4 },
      ],
    },
  ],
};

export default level3;
