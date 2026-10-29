export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Coordinate {
  x: number;
  y: number;
}

export interface Arrow {
  id: string;
  x: number;
  y: number;
  direction: Direction;
  isCleared: boolean;
  points?: Coordinate[];
  path?: Coordinate[];
  color?: string;
}

export type LevelDifficulty =
  | 'Easy'
  | 'Easy-Medium'
  | 'Medium'
  | 'Hard'
  | 'Very Hard';

export interface Level {
  id: string;
  levelNumber: number;
  title: string;
  subtitle: string;
  gridSize: number;
  difficulty: LevelDifficulty;
  arrows: Arrow[];
}

export interface ArrowProps {
  arrow?: Arrow;
  pathData?: Coordinate[];
  direction?: Direction | string;
  CELL_SIZE?: number;
  path?: Coordinate[];
  cellSize?: number;
  boardDimension?: number;
  boardWidth?: number;
  boardHeight?: number;
  isHighlighted?: boolean;
  isClearable?: boolean;
  isExiting?: boolean;
  isBlocked?: boolean;
  onPress?: (id: string) => void;
  onExitComplete?: (id: string) => void;
}

export interface BoardProps {
  gridSize?: number;
  arrows: Arrow[];
  cellSize?: number;
  exitingArrowIds?: string[];
  highlightedArrowId?: string | null;
  clearableArrowIds?: string[];
  blockedArrowId?: string | null;
  onArrowPress?: (id: string) => void;
  onArrowExitComplete?: (id: string) => void;
}
