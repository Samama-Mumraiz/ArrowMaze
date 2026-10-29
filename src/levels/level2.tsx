import { Level } from '../types';
import { DIRECTIONS } from '../utils/constants';

export const level2: Level = {
  id: 'level-2',
  levelNumber: 2,
  title: 'Level 2',
  subtitle: 'Intersections (6 Arrows)',
  gridSize: 5,
  difficulty: 'Easy-Medium',
  arrows: [
    {
      id: 'l2-1',
      x: 4,
      y: 0,
      direction: DIRECTIONS.UP,
      isCleared: false,
      points: [
        { x: 3, y: 1 },
        { x: 3, y: 0 },
        { x: 4, y: 0 },
      ],
    },
    {
      id: 'l2-2',
      x: 4,
      y: 1,
      direction: DIRECTIONS.RIGHT,
      isCleared: false,
      points: [
        { x: 1, y: 1 },
        { x: 4, y: 1 },
      ],
    },
    {
      id: 'l2-3',
      x: 2,
      y: 0,
      direction: DIRECTIONS.DOWN,
      isCleared: false,
      points: [
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ],
    },
    {
      id: 'l2-4',
      x: 0,
      y: 3,
      direction: DIRECTIONS.LEFT,
      isCleared: false,
      points: [
        { x: 0, y: 4 },
        { x: 0, y: 3 },
      ],
    },
    {
      id: 'l2-5',
      x: 3,
      y: 3,
      direction: DIRECTIONS.LEFT,
      isCleared: false,
      points: [
        { x: 3, y: 2 },
        { x: 3, y: 3 },
      ],
    },
    {
      id: 'l2-6',
      x: 2,
      y: 4,
      direction: DIRECTIONS.UP,
      isCleared: false,
      points: [
        { x: 4, y: 4 },
        { x: 2, y: 4 },
      ],
    },
  ],
};

export default level2;
