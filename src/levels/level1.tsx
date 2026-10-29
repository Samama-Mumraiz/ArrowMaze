import { Level } from '../types';
import { DIRECTIONS } from '../utils/constants';

export const level1: Level = {
  id: 'level-1',
  levelNumber: 1,
  title: 'Level 1',
  subtitle: 'The Awakening (4 Arrows)',
  gridSize: 5,
  difficulty: 'Easy',
  arrows: [
    {
      id: 'l1-1',
      x: 2,
      y: 0,
      direction: DIRECTIONS.UP,
      isCleared: false,
      points: [
        { x: 0, y: 1 },
        { x: 0, y: 0 },
        { x: 2, y: 0 },
      ],
    },
    {
      id: 'l1-2',
      x: 4,
      y: 2,
      direction: DIRECTIONS.RIGHT,
      isCleared: false,
      points: [
        { x: 3, y: 1 },
        { x: 3, y: 2 },
        { x: 4, y: 2 },
      ],
    },
    {
      id: 'l1-3',
      x: 1,
      y: 2,
      direction: DIRECTIONS.RIGHT,
      isCleared: false,
      points: [
        { x: 1, y: 4 },
        { x: 1, y: 2 },
      ],
    },
    {
      id: 'l1-4',
      x: 2,
      y: 3,
      direction: DIRECTIONS.UP,
      isCleared: false,
      points: [
        { x: 4, y: 4 },
        { x: 2, y: 4 },
        { x: 2, y: 3 },
      ],
    },
  ],
};

export default level1;
