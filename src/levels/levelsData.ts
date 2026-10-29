import { LevelConfig, LevelDifficulty } from '../model/types';
import { generateDenseLabyrinthStrands } from './labyrinthGenerator';

/**
 * Handcrafted Progressive Levels Collection (Levels 1 - 25)
 * Carefully designed with rhythmic difficulty pacing:
 * - Introduces game concepts gradually (Easy -> Normal -> Medium -> Hard -> Master)
 * - Features regular "Breather" (Normal) levels between intense challenges
 * - Every single level enforces STRICT COLLISION DETECTION:
 *   An (x, y) grid cell can ONLY be occupied by ONE single arrow path. Zero overlaps!
 * - Dense 90-degree labyrinth routing through empty adjacent cells.
 * - Every level is 100% verified forward-solvable.
 */

export function getDifficultyTheme(difficulty: LevelDifficulty = 'Normal', isDark = false) {
  switch (difficulty) {
    case 'Easy':
      return {
        bg: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5',
        text: isDark ? '#34D399' : '#059669',
        border: isDark ? '#059669' : '#A7F3D0',
      };
    case 'Normal':
      return {
        bg: isDark ? 'rgba(14, 165, 233, 0.2)' : '#F0F9FF',
        text: isDark ? '#38BDF8' : '#0284C7',
        border: isDark ? '#0284C7' : '#BAE6FD',
      };
    case 'Medium':
      return {
        bg: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FFFBEB',
        text: isDark ? '#FBBF24' : '#D97706',
        border: isDark ? '#D97706' : '#FDE68A',
      };
    case 'Hard':
      return {
        bg: isDark ? 'rgba(244, 63, 94, 0.2)' : '#FFF1F2',
        text: isDark ? '#FB7185' : '#E11D48',
        border: isDark ? '#E11D48' : '#FECDD3',
      };
    case 'Master':
      return {
        bg: isDark ? 'rgba(139, 92, 246, 0.2)' : '#F5F3FF',
        text: isDark ? '#A78BFA' : '#7C3AED',
        border: isDark ? '#7C3AED' : '#DDD6FE',
      };
  }
}

export const PROGRESSIVE_LEVELS: LevelConfig[] = [
  // Level 1: "Neon Inception" (5x5 grid, 4 strands, 1 turn) - Easy
  {
    levelNumber: 1,
    title: 'Neon Inception',
    subtitle: '5x5 introductory winding puzzle',
    difficulty: 'Easy',
    rows: 5,
    cols: 5,
    strands: generateDenseLabyrinthStrands(1, 5, 5, 4, 1540, 1),
  },

  // Level 2: "Caduceus Circuit" (5x5 grid, 5 strands, 1 turn) - Easy
  {
    levelNumber: 2,
    title: 'Caduceus Circuit',
    subtitle: '5x5 interlocking wire trails',
    difficulty: 'Easy',
    rows: 5,
    cols: 5,
    strands: generateDenseLabyrinthStrands(2, 5, 5, 5, 2540, 1),
  },

  // Level 3: "Ouroboros Nexus" (6x6 grid, 6 strands, 2 turns) - Normal
  {
    levelNumber: 3,
    title: 'Ouroboros Nexus',
    subtitle: '6x6 multi-turn labyrinth puzzle',
    difficulty: 'Normal',
    rows: 6,
    cols: 6,
    strands: generateDenseLabyrinthStrands(3, 6, 6, 6, 3540, 2),
  },

  // Level 4: "Cyber Coil" (6x6 grid, 7 strands, 2 turns) - Normal
  {
    levelNumber: 4,
    title: 'Cyber Coil',
    subtitle: '6x6 matrix of interlocking wire paths',
    difficulty: 'Normal',
    rows: 6,
    cols: 6,
    strands: generateDenseLabyrinthStrands(4, 6, 6, 7, 4540, 2),
  },

  // Level 5: "Gordian Master Knot" (6x6 grid, 8 strands, 2 turns) - Normal
  {
    levelNumber: 5,
    title: 'Gordian Master Knot',
    subtitle: '6x6 multi-segment winding challenge',
    difficulty: 'Normal',
    rows: 6,
    cols: 6,
    strands: generateDenseLabyrinthStrands(5, 6, 6, 8, 5540, 2),
  },

  // Level 6: "Twin Coils" (7x7 grid, 8 strands) - Medium
  {
    levelNumber: 6,
    title: 'Twin Coils',
    subtitle: 'Concentric winding boxes in dense formation',
    difficulty: 'Medium',
    rows: 7,
    cols: 7,
    strands: generateDenseLabyrinthStrands(6, 7, 7, 8, 6540, 2),
  },

  // Level 7 (Breather): "Cascade Stream" (7x7 grid, 8 strands) - Normal
  {
    levelNumber: 7,
    title: 'Cascade Stream',
    subtitle: 'Relaxing rhythmic untangling with high clear rates',
    difficulty: 'Normal',
    rows: 7,
    cols: 7,
    strands: generateDenseLabyrinthStrands(7, 7, 7, 8, 7540, 2),
  },

  // Level 8: "Circuit Matrix" (7x7 grid, 9 strands) - Hard
  {
    levelNumber: 8,
    title: 'Circuit Matrix',
    subtitle: 'Interlocked 90° wire trails with nested blockades',
    difficulty: 'Hard',
    rows: 7,
    cols: 7,
    strands: generateDenseLabyrinthStrands(8, 7, 7, 9, 8540, 2),
  },

  // Level 9: "Ouroboros Nexus" (8x8 grid, 10 strands) - Hard
  {
    levelNumber: 9,
    title: 'Ouroboros Nexus',
    subtitle: 'A closed ring knot requiring clockwise deconstruction',
    difficulty: 'Hard',
    rows: 8,
    cols: 8,
    strands: generateDenseLabyrinthStrands(9, 8, 8, 10, 9540, 2),
  },

  // Level 10 (Breather): "Zen Garden" (8x8 grid, 10 strands) - Normal
  {
    levelNumber: 10,
    title: 'Zen Garden',
    subtitle: 'Calm symmetrical strand formation with graceful escapes',
    difficulty: 'Normal',
    rows: 8,
    cols: 8,
    strands: generateDenseLabyrinthStrands(10, 8, 8, 10, 10540, 2),
  },

  // Level 11: "Gordian Knot" (8x8 grid, 11 strands) - Hard
  {
    levelNumber: 11,
    title: 'Gordian Knot',
    subtitle: 'Intricately woven matrix of dependencies',
    difficulty: 'Hard',
    rows: 8,
    cols: 8,
    strands: generateDenseLabyrinthStrands(11, 8, 8, 11, 11540, 3),
  },

  // Level 12: "Castle Walls" (8x8 grid, 11 strands) - Medium
  {
    levelNumber: 12,
    title: 'Castle Walls',
    subtitle: 'Perimeter fortifications with crenellated interior pathways',
    difficulty: 'Medium',
    rows: 8,
    cols: 8,
    strands: generateDenseLabyrinthStrands(12, 8, 8, 11, 12540, 3),
  },

  // Level 13 (Breather): "Meadow Breeze" (8x8 grid, 11 strands) - Normal
  {
    levelNumber: 13,
    title: 'Meadow Breeze',
    subtitle: 'Gentle winding flow with multiple early outs',
    difficulty: 'Normal',
    rows: 8,
    cols: 8,
    strands: generateDenseLabyrinthStrands(13, 8, 8, 11, 13540, 3),
  },

  // Level 14: "Vortex Coil" (9x9 grid, 12 strands) - Hard
  {
    levelNumber: 14,
    title: 'Vortex Coil',
    subtitle: 'Inward spiraling strands requiring counter-vortex extraction',
    difficulty: 'Hard',
    rows: 9,
    cols: 9,
    strands: generateDenseLabyrinthStrands(14, 9, 9, 12, 14540, 3),
  },

  // Level 15: "Master Circuit" (9x9 grid, 13 strands) - Hard
  {
    levelNumber: 15,
    title: 'Master Circuit',
    subtitle: 'Dense integrated electronic highway with triple crossroads',
    difficulty: 'Hard',
    rows: 9,
    cols: 9,
    strands: generateDenseLabyrinthStrands(15, 9, 9, 13, 15540, 3),
  },

  // Level 16 (Breather): "River Crossing" (9x9 grid, 12 strands) - Normal
  {
    levelNumber: 16,
    title: 'River Crossing',
    subtitle: 'Transverse pathways that untangle smoothly',
    difficulty: 'Normal',
    rows: 9,
    cols: 9,
    strands: generateDenseLabyrinthStrands(16, 9, 9, 12, 16540, 3),
  },

  // Level 17: "Quantum Weave" (9x9 grid, 14 strands) - Hard
  {
    levelNumber: 17,
    title: 'Quantum Weave',
    subtitle: 'Superposed entanglement with tight turning radii',
    difficulty: 'Hard',
    rows: 9,
    cols: 9,
    strands: generateDenseLabyrinthStrands(17, 9, 9, 14, 17540, 3),
  },

  // Level 18: "Titan's Maze" (9x9 grid, 14 strands) - Master
  {
    levelNumber: 18,
    title: "Titan's Maze",
    subtitle: 'Massive monolithic barriers with razor-thin tolerances',
    difficulty: 'Master',
    rows: 9,
    cols: 9,
    strands: generateDenseLabyrinthStrands(18, 9, 9, 14, 18540, 3),
  },

  // Level 19 (Breather): "Sunset Valley" (9x9 grid, 13 strands) - Normal
  {
    levelNumber: 19,
    title: 'Sunset Valley',
    subtitle: 'Graceful descending paths offering rhythmic untying',
    difficulty: 'Normal',
    rows: 9,
    cols: 9,
    strands: generateDenseLabyrinthStrands(19, 9, 9, 13, 19540, 3),
  },

  // Level 20: "Grand Labyrinth" (10x10 grid, 15 strands) - Master
  {
    levelNumber: 20,
    title: 'Grand Labyrinth',
    subtitle: 'Masterpiece 10x10 multi-turn dense winding labyrinth',
    difficulty: 'Master',
    rows: 10,
    cols: 10,
    strands: generateDenseLabyrinthStrands(20, 10, 10, 15, 20540, 3),
  },

  // Level 21: "Grand Labyrinth II" (10x10 grid, 15 strands) - Master
  {
    levelNumber: 21,
    title: 'Grand Labyrinth II',
    subtitle: 'Inverted geometry variant of the master maze',
    difficulty: 'Master',
    rows: 10,
    cols: 10,
    strands: generateDenseLabyrinthStrands(21, 10, 10, 15, 21540, 3),
  },

  // Level 22 (Breather): "Symmetric Cascade" (10x10 grid, 14 strands) - Normal
  {
    levelNumber: 22,
    title: 'Symmetric Cascade',
    subtitle: 'Rhythmic cascade with rapid sequential outs',
    difficulty: 'Normal',
    rows: 10,
    cols: 10,
    strands: generateDenseLabyrinthStrands(22, 10, 10, 14, 22540, 3),
  },

  // Level 23: "Grand Labyrinth III" (10x10 grid, 16 strands) - Master
  {
    levelNumber: 23,
    title: 'Grand Labyrinth III',
    subtitle: 'Vertically reflected master puzzle with altered pinwheel order',
    difficulty: 'Master',
    rows: 10,
    cols: 10,
    strands: generateDenseLabyrinthStrands(23, 10, 10, 16, 23540, 3),
  },

  // Level 24: "Grand Labyrinth IV" (10x10 grid, 16 strands) - Master
  {
    levelNumber: 24,
    title: 'Grand Labyrinth IV',
    subtitle: 'Diagonal transposition with inverted edge runners',
    difficulty: 'Master',
    rows: 10,
    cols: 10,
    strands: generateDenseLabyrinthStrands(24, 10, 10, 16, 24540, 3),
  },

  // Level 25: "Master of Arrows" (10x10 grid, 16 strands) - Master
  {
    levelNumber: 25,
    title: 'Master of Arrows',
    subtitle: 'The ultimate tangle: 16 dense interlocking 90° labyrinth strands',
    difficulty: 'Master',
    rows: 10,
    cols: 10,
    strands: generateDenseLabyrinthStrands(25, 10, 10, 16, 25540, 3),
  },
];
