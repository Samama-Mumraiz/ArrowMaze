import { Level } from '../types';
import { DIRECTIONS } from '../utils/constants';

export const level5: Level = {
  id: 'level-5',
  levelNumber: 5,
  title: 'Level 5',
  subtitle: 'Grandmaster Loop (20 Arrows)',
  gridSize: 8,
  difficulty: 'Very Hard',
  arrows: [
    {
      id: 'l5-1',
      x: 7,
      y: 0,
      direction: DIRECTIONS.UP,
      isCleared: false,
      points: [
        { x: 6, y: 0 },
        { x: 7, y: 0 },
      ],
    },
    {
      id: 'l5-2',
      x: 7,
      y: 2,
      direction: DIRECTIONS.UP,
      isCleared: false,
      points: [
        { x: 6, y: 2 },
        { x: 7, y: 2 },
      ],
    },
    {
      id: 'l5-3',
      x: 5,
      y: 2,
      direction: DIRECTIONS.RIGHT,
      isCleared: false,
      points: [
        { x: 5, y: 3 },
        { x: 5, y: 2 },
      ],
    },
    {
      id: 'l5-4',
      x: 5,
      y: 1,
      direction: DIRECTIONS.DOWN,
      isCleared: false,
      points: [
        { x: 4, y: 1 },
        { x: 5, y: 1 },
      ],
    },
    {
      id: 'l5-5',
      x: 3,
      y: 1,
      direction: DIRECTIONS.RIGHT,
      isCleared: false,
      points: [
        { x: 3, y: 2 },
        { x: 3, y: 1 },
      ],
    },
    {
      id: 'l5-6',
      x: 3,
      y: 0,
      direction: DIRECTIONS.DOWN,
      isCleared: false,
      points: [
        { x: 2, y: 0 },
        { x: 3, y: 0 },
      ],
    },
    {
      id: 'l5-7',
      x: 1,
      y: 0,
      direction: DIRECTIONS.RIGHT,
      isCleared: false,
      points: [
        { x: 1, y: 1 },
        { x: 1, y: 0 },
      ],
    },
    {
      id: 'l5-8',
      x: 1,
      y: 3,
      direction: DIRECTIONS.UP,
      isCleared: false,
      points: [
        { x: 2, y: 3 },
        { x: 1, y: 3 },
      ],
    },
    {
      id: 'l5-9',
      x: 0,
      y: 3,
      direction: DIRECTIONS.RIGHT,
      isCleared: false,
      points: [
        { x: 0, y: 4 },
        { x: 0, y: 3 },
      ],
    },
    {
      id: 'l5-10',
      x: 0,
      y: 7,
      direction: DIRECTIONS.LEFT,
      isCleared: false,
      points: [
        { x: 1, y: 7 },
        { x: 0, y: 7 },
      ],
    },
    {
      id: 'l5-11',
      x: 2,
      y: 7,
      direction: DIRECTIONS.LEFT,
      isCleared: false,
      points: [
        { x: 2, y: 6 },
        { x: 2, y: 7 },
      ],
    },
    {
      id: 'l5-12',
      x: 2,
      y: 5,
      direction: DIRECTIONS.DOWN,
      isCleared: false,
      points: [
        { x: 1, y: 5 },
        { x: 2, y: 5 },
      ],
    },
    {
      id: 'l5-13',
      x: 4,
      y: 5,
      direction: DIRECTIONS.LEFT,
      isCleared: false,
      points: [
        { x: 4, y: 4 },
        { x: 4, y: 5 },
      ],
    },
    {
      id: 'l5-14',
      x: 4,
      y: 6,
      direction: DIRECTIONS.UP,
      isCleared: false,
      points: [
        { x: 5, y: 6 },
        { x: 4, y: 6 },
      ],
    },
    {
      id: 'l5-15',
      x: 6,
      y: 6,
      direction: DIRECTIONS.LEFT,
      isCleared: false,
      points: [
        { x: 6, y: 7 },
        { x: 6, y: 6 },
      ],
    },
    {
      id: 'l5-16',
      x: 6,
      y: 4,
      direction: DIRECTIONS.DOWN,
      isCleared: false,
      points: [
        { x: 7, y: 4 },
        { x: 6, y: 4 },
      ],
    },
    {
      id: 'l5-17',
      x: 7,
      y: 7,
      direction: DIRECTIONS.DOWN,
      isCleared: false,
      points: [
        { x: 7, y: 6 },
        { x: 7, y: 7 },
      ],
    },
    {
      id: 'l5-18',
      x: 7,
      y: 5,
      direction: DIRECTIONS.DOWN,
      isCleared: false,
      points: [
        { x: 6, y: 5 },
        { x: 7, y: 5 },
      ],
    },
    {
      id: 'l5-19',
      x: 0,
      y: 0,
      direction: DIRECTIONS.UP,
      isCleared: false,
      points: [
        { x: 0, y: 1 },
        { x: 0, y: 0 },
      ],
    },
    {
      id: 'l5-20',
      x: 0,
      y: 2,
      direction: DIRECTIONS.UP,
      isCleared: false,
      points: [
        { x: 1, y: 2 },
        { x: 0, y: 2 },
      ],
    },
  ],
};

export default level5;
