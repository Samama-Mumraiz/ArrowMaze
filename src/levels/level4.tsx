import { Level } from '../types';
import { DIRECTIONS } from '../utils/constants';

export const level4: Level = {
  id: 'level-4',
  levelNumber: 4,
  title: 'Level 4',
  subtitle: 'The Labyrinth (14 Arrows)',
  gridSize: 7,
  difficulty: 'Hard',
  arrows: [
    {
      id: 'l4-1',
      x: 0,
      y: 1,
      direction: DIRECTIONS.LEFT,
      isCleared: false,
      points: [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ],
    },
    {
      id: 'l4-2',
      x: 2,
      y: 1,
      direction: DIRECTIONS.LEFT,
      isCleared: false,
      points: [
        { x: 3, y: 1 },
        { x: 2, y: 1 },
      ],
    },
    {
      id: 'l4-3',
      x: 4,
      y: 1,
      direction: DIRECTIONS.LEFT,
      isCleared: false,
      points: [
        { x: 5, y: 1 },
        { x: 4, y: 1 },
      ],
    },
    {
      id: 'l4-4',
      x: 4,
      y: 3,
      direction: DIRECTIONS.UP,
      isCleared: false,
      points: [
        { x: 3, y: 3 },
        { x: 4, y: 3 },
      ],
    },
    {
      id: 'l4-5',
      x: 6,
      y: 3,
      direction: DIRECTIONS.RIGHT,
      isCleared: false,
      points: [
        { x: 6, y: 2 },
        { x: 6, y: 3 },
      ],
    },
    {
      id: 'l4-6',
      x: 5,
      y: 3,
      direction: DIRECTIONS.RIGHT,
      isCleared: false,
      points: [
        { x: 5, y: 2 },
        { x: 5, y: 3 },
      ],
    },
    {
      id: 'l4-7',
      x: 2,
      y: 3,
      direction: DIRECTIONS.RIGHT,
      isCleared: false,
      points: [
        { x: 1, y: 3 },
        { x: 2, y: 3 },
      ],
    },
    {
      id: 'l4-8',
      x: 2,
      y: 5,
      direction: DIRECTIONS.UP,
      isCleared: false,
      points: [
        { x: 3, y: 5 },
        { x: 2, y: 5 },
      ],
    },
    {
      id: 'l4-9',
      x: 6,
      y: 6,
      direction: DIRECTIONS.DOWN,
      isCleared: false,
      points: [
        { x: 5, y: 6 },
        { x: 6, y: 6 },
      ],
    },
    {
      id: 'l4-10',
      x: 6,
      y: 4,
      direction: DIRECTIONS.DOWN,
      isCleared: false,
      points: [
        { x: 5, y: 4 },
        { x: 6, y: 4 },
      ],
    },
    {
      id: 'l4-11',
      x: 0,
      y: 5,
      direction: DIRECTIONS.LEFT,
      isCleared: false,
      points: [
        { x: 0, y: 6 },
        { x: 0, y: 5 },
      ],
    },
    {
      id: 'l4-12',
      x: 1,
      y: 5,
      direction: DIRECTIONS.LEFT,
      isCleared: false,
      points: [
        { x: 1, y: 6 },
        { x: 1, y: 5 },
      ],
    },
    {
      id: 'l4-13',
      x: 3,
      y: 6,
      direction: DIRECTIONS.DOWN,
      isCleared: false,
      points: [
        { x: 2, y: 6 },
        { x: 3, y: 6 },
      ],
    },
    {
      id: 'l4-14',
      x: 3,
      y: 4,
      direction: DIRECTIONS.DOWN,
      isCleared: false,
      points: [
        { x: 4, y: 4 },
        { x: 3, y: 4 },
      ],
    },
  ],
};

export default level4;
