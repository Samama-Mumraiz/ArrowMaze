import { Direction } from '../types';

export const CELL_SIZE = 64;
export const GRID_SIZE = 5;

export const DIRECTIONS: Record<Direction, Direction> = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
} as const;

export const DIRECTION_ROTATION: Record<Direction, string> = {
  UP: '0deg',
  RIGHT: '90deg',
  DOWN: '180deg',
  LEFT: '270deg',
};

export const DIRECTION_ROTATION_DEG: Record<string, number> = {
  UP: -90,
  DOWN: 90,
  LEFT: 180,
  RIGHT: 0,
  U: -90,
  D: 90,
  L: 180,
  R: 0,
};

export const THEME = {
  background: '#0B0F19',
  cardBg: '#131B2E',
  gridBackground: '#0F172A',
  cellBackground: '#162036',
  cellBorder: '#1E293B',
  boardBorder: '#334155',
  primary: '#6366F1',
  accent: '#38BDF8',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  arrow: {
    UP: '#38BDF8',     // Cyan / Sky
    DOWN: '#A855F7',   // Purple
    LEFT: '#F43F5E',   // Rose
    RIGHT: '#10B981',  // Emerald
    glow: 'rgba(56, 189, 248, 0.35)',
  },
};

export const MAZE_THEME = {
  // Tangled navy lines for regular maze paths
  navyLine: '#1E2D44',
  navyLineBorder: '#334E6F',
  navyArrowhead: '#253B56',
  navyArrowheadStroke: '#4B688B',

  // Highlighted bright blue line (for clearable/active arrow)
  highlightLine: '#00E5FF',
  highlightLineGlow: 'rgba(0, 229, 255, 0.55)',
  highlightArrowhead: '#00E5FF',
  highlightArrowheadStroke: '#E0F7FA',

  // Board aesthetics
  gridDot: 'rgba(255, 255, 255, 0.12)',
  lineCornerRadius: 14,
  exitAnimationDuration: 500,
};
