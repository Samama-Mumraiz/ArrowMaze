/**
 * Model Types for "Tangled Arrow Maze" Puzzle Game
 * Pure TypeScript - No React or React Native dependencies
 */

export type Direction = 'U' | 'D' | 'L' | 'R';

export type ArrowStatus = 'idle' | 'moving' | 'blocked_shake';

export interface Point2D {
  x: number;
  y: number;
}

export interface GridCoord {
  r: number;
  c: number;
}

export interface TangledStrand {
  id: string;
  head: GridCoord;
  direction: Direction;
  points: GridCoord[]; // Ordered points from tail to head ({ r, c })
  path?: Point2D[];    // Ordered points as grid coordinates ({ x, y })
  occupiedCells: GridCoord[]; // All cells occupied along the line
  colorIndex: number;
  color?: string;
  status: ArrowStatus;
}

// Backwards-compatible Arrow type
export interface Arrow {
  id: string;
  direction: Direction;
  status: ArrowStatus;
  head?: GridCoord;
  points?: GridCoord[];
}

export type Grid = (Arrow | null)[][];

export interface RaycastResult {
  isClear: boolean;
  scannedCells: GridCoord[];
  blockerStrandId?: string;
  blockerCoord?: GridCoord;
}

export type GameStatus = 'start' | 'playing' | 'won' | 'lost';

export type LevelDifficulty = 'Easy' | 'Normal' | 'Medium' | 'Hard' | 'Master';

export interface LevelConfig {
  levelNumber: number;
  title: string;
  subtitle: string;
  difficulty?: LevelDifficulty;
  rows: number;
  cols: number;
  strands: TangledStrand[];
}
