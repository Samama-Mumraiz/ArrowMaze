import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface Trophy {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'mastery' | 'skill' | 'streak';
  activeColor: string;
  unlocked: boolean;
  progress: number; // 0 to 1
  progressLabel: string;
}

export interface PlayerStats {
  currentLevel: number;
  maxUnlockedLevel: number;
  coins: number;
  totalWins: number;
  winStreak: number;
  currentStreak: number;
  bestStreak: number;
  perfectPlays: number;
  totalStrandsCleared: number;
  hintsRemaining: number;
  unlockedAwards: string[];
}

export const INITIAL_AWARDS: Trophy[] = [
  {
    id: 'first-untangle',
    title: 'Knot Untangler',
    description: 'Successfully untangled your first arrow maze knot.',
    icon: 'extension-puzzle-outline',
    category: 'skill',
    activeColor: '#38BDF8',
    unlocked: false,
    progress: 0,
    progressLabel: '0 / 1 Knot',
  },
  {
    id: 'level-legend',
    title: 'Level Legend',
    description: 'Solve 5 challenging arrow maze puzzles.',
    icon: 'trophy-outline',
    category: 'mastery',
    activeColor: '#FBBF24',
    unlocked: false,
    progress: 0,
    progressLabel: '0 / 5 Knots',
  },
  {
    id: 'perfect-play',
    title: 'Perfect Play',
    description: 'Complete a level without a single collision impact.',
    icon: 'sparkles-outline',
    category: 'skill',
    activeColor: '#EC4899',
    unlocked: false,
    progress: 0,
    progressLabel: '0 / 1 Perfect',
  },
  {
    id: 'streak-master',
    title: 'Streak Master',
    description: 'Achieve a winning streak of 3 puzzles.',
    icon: 'flame-outline',
    category: 'streak',
    activeColor: '#F97316',
    unlocked: false,
    progress: 0,
    progressLabel: 'Streak: 0 / 3',
  },
  {
    id: 'untie-speedster',
    title: 'Untie Speedster',
    description: 'Clear knots in record time.',
    icon: 'flash-outline',
    category: 'skill',
    activeColor: '#A855F7',
    unlocked: false,
    progress: 0,
    progressLabel: 'Wins: 0/2',
  },
  {
    id: 'dual-explorer',
    title: 'Dual Theme Explorer',
    description: 'Play across both Obsidian Dark and Minimal Light themes.',
    icon: 'color-palette-outline',
    category: 'mastery',
    activeColor: '#10B981',
    unlocked: false,
    progress: 0.5,
    progressLabel: '1 / 2 Themes',
  },
];

export interface GameStateContextType {
  currentLevel: number;
  maxUnlockedLevel: number;
  coins: number;
  setCurrentLevel: (lvl: number) => void;
  advanceLevel: () => void;
  awardCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  totalWins: number;
  winStreak: number;
  currentStreak: number;
  bestStreak: number;
  perfectPlays: number;
  totalStrandsCleared: number;
  hintsRemaining: number;
  unlockedAwards: string[];
  stats: PlayerStats;
  trophies: Trophy[];
  awards: Trophy[];
  recordWin: (wasPerfect: boolean, strandsCleared?: number) => void;
  recordLoss: () => void;
  useHint: () => boolean;
  addHints: (count: number) => void;
  unlockAward: (awardId: string) => void;
  recordThemeSwitch: () => void;
}

export const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export function GameStateProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [stats, setStats] = useState<PlayerStats>({
    currentLevel: 1,
    maxUnlockedLevel: 1,
    coins: 120,
    totalWins: 0,
    winStreak: 0,
    currentStreak: 0,
    bestStreak: 0,
    perfectPlays: 0,
    totalStrandsCleared: 0,
    hintsRemaining: 3,
    unlockedAwards: [],
  });

  const setCurrentLevel = useCallback((lvl: number) => {
    setStats((prev) => {
      const target = Math.max(1, lvl);
      if (prev.currentLevel === target && (prev.maxUnlockedLevel ?? 1) >= target) {
        return prev;
      }
      return {
        ...prev,
        currentLevel: target,
        maxUnlockedLevel: Math.max(prev.maxUnlockedLevel ?? 1, target),
      };
    });
  }, []);

  const advanceLevel = useCallback(() => {
    setStats((prev) => {
      const target = (prev.currentLevel ?? 1) + 1;
      if (prev.currentLevel === target && (prev.maxUnlockedLevel ?? 1) >= target) {
        return prev;
      }
      return {
        ...prev,
        currentLevel: target,
        maxUnlockedLevel: Math.max(prev.maxUnlockedLevel ?? 1, target),
      };
    });
  }, []);

  const awardCoins = useCallback((amount: number) => {
    setStats((prev) => ({
      ...prev,
      coins: Math.max(0, (prev.coins ?? 120) + amount),
    }));
  }, []);

  const spendCoins = useCallback((amount: number): boolean => {
    let success = false;
    setStats((prev) => {
      const current = prev.coins ?? 120;
      if (current >= amount) {
        success = true;
        return {
          ...prev,
          coins: current - amount,
        };
      }
      return prev;
    });
    return success;
  }, []);

  const recordWin = useCallback((wasPerfect: boolean, strandsCleared: number = 0) => {
    setStats((prev) => {
      const nextWins = prev.totalWins + 1;
      const nextStreak = prev.winStreak + 1;
      const nextBestStreak = Math.max(prev.bestStreak, nextStreak);
      const nextPerfect = wasPerfect ? prev.perfectPlays + 1 : prev.perfectPlays;
      const nextStrands = prev.totalStrandsCleared + strandsCleared;
      const nextLevel = Math.max(prev.currentLevel + 1, nextWins + 1);
      const nextMaxUnlocked = Math.max(prev.maxUnlockedLevel ?? 1, nextLevel);
      const coinReward = wasPerfect ? 50 : 25;
      const nextCoins = (prev.coins ?? 120) + coinReward;

      const unlockedSet = new Set<string>(prev.unlockedAwards);
      if (nextWins >= 1) unlockedSet.add('first-untangle');
      if (nextWins >= 5) unlockedSet.add('level-legend');
      if (nextPerfect >= 1) unlockedSet.add('perfect-play');
      if (nextStreak >= 3 || nextBestStreak >= 3) unlockedSet.add('streak-master');
      if (nextWins >= 2) unlockedSet.add('untie-speedster');

      return {
        currentLevel: nextLevel,
        maxUnlockedLevel: nextMaxUnlocked,
        coins: nextCoins,
        totalWins: nextWins,
        winStreak: nextStreak,
        currentStreak: nextStreak,
        bestStreak: nextBestStreak,
        perfectPlays: nextPerfect,
        totalStrandsCleared: nextStrands,
        hintsRemaining: prev.hintsRemaining,
        unlockedAwards: Array.from(unlockedSet),
      };
    });
  }, []);

  const recordLoss = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      winStreak: 0,
      currentStreak: 0,
    }));
  }, []);

  const useHint = useCallback((): boolean => {
    let success = false;
    setStats((prev) => {
      if (prev.hintsRemaining > 0) {
        success = true;
        return { ...prev, hintsRemaining: prev.hintsRemaining - 1 };
      }
      return prev;
    });
    return success;
  }, []);

  const addHints = useCallback((count: number) => {
    setStats((prev) => ({ ...prev, hintsRemaining: prev.hintsRemaining + count }));
  }, []);

  const unlockAward = useCallback((awardId: string) => {
    setStats((prev) => {
      if (prev.unlockedAwards.includes(awardId)) return prev;
      return {
        ...prev,
        unlockedAwards: [...prev.unlockedAwards, awardId],
      };
    });
  }, []);

  const recordThemeSwitch = useCallback(() => {
    unlockAward('dual-explorer');
  }, [unlockAward]);

  // Derived memoized trophies array (never causes state cascade during render)
  const trophies = useMemo<Trophy[]>(() => {
    return INITIAL_AWARDS.map((trophy) => {
      if (trophy.id === 'first-untangle') {
        const unlocked = stats.totalWins >= 1;
        return {
          ...trophy,
          unlocked,
          progress: unlocked ? 1 : 0,
          progressLabel: unlocked ? '1 / 1 Knot' : '0 / 1 Knot',
        };
      }
      if (trophy.id === 'level-legend') {
        const prog = Math.min(1, stats.totalWins / 5);
        return {
          ...trophy,
          unlocked: stats.totalWins >= 5,
          progress: prog,
          progressLabel: `${Math.min(5, stats.totalWins)} / 5 Knots`,
        };
      }
      if (trophy.id === 'perfect-play') {
        const unlocked = stats.perfectPlays >= 1;
        return {
          ...trophy,
          unlocked,
          progress: unlocked ? 1 : 0,
          progressLabel: unlocked ? `${stats.perfectPlays} Perfect` : '0 / 1 Perfect',
        };
      }
      if (trophy.id === 'streak-master') {
        const streakToEvaluate = Math.max(stats.winStreak, stats.bestStreak);
        const prog = Math.min(1, streakToEvaluate / 3);
        return {
          ...trophy,
          unlocked: streakToEvaluate >= 3,
          progress: prog,
          progressLabel: `Streak: ${streakToEvaluate} / 3`,
        };
      }
      if (trophy.id === 'untie-speedster') {
        const unlocked = stats.totalWins >= 2;
        return {
          ...trophy,
          unlocked,
          progress: unlocked ? 1 : Math.min(1, stats.totalWins / 2),
          progressLabel: unlocked ? 'Speed Untangled' : `Wins: ${stats.totalWins}/2`,
        };
      }
      if (trophy.id === 'dual-explorer') {
        const isUnlocked = stats.unlockedAwards.includes('dual-explorer');
        return {
          ...trophy,
          unlocked: isUnlocked,
          progress: isUnlocked ? 1 : 0.5,
          progressLabel: isUnlocked ? 'Themes Unlocked' : '1 / 2 Themes',
        };
      }
      return trophy;
    });
  }, [stats]);

  const contextValue = useMemo<GameStateContextType>(
    () => ({
      currentLevel: stats.currentLevel,
      maxUnlockedLevel: stats.maxUnlockedLevel,
      coins: stats.coins,
      setCurrentLevel,
      advanceLevel,
      awardCoins,
      spendCoins,
      totalWins: stats.totalWins,
      winStreak: stats.winStreak,
      currentStreak: stats.winStreak,
      bestStreak: stats.bestStreak,
      perfectPlays: stats.perfectPlays,
      totalStrandsCleared: stats.totalStrandsCleared,
      hintsRemaining: stats.hintsRemaining,
      unlockedAwards: stats.unlockedAwards,
      stats,
      trophies,
      awards: trophies,
      recordWin,
      recordLoss,
      useHint,
      addHints,
      unlockAward,
      recordThemeSwitch,
    }),
    [
      stats,
      setCurrentLevel,
      advanceLevel,
      awardCoins,
      spendCoins,
      trophies,
      recordWin,
      recordLoss,
      useHint,
      addHints,
      unlockAward,
      recordThemeSwitch,
    ]
  );

  return (
    <GameStateContext.Provider value={contextValue}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState(): GameStateContextType {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}
