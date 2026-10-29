/**
 * Controller: useGameController
 * Manages game state, pointer interactions, input lockout,
 * hint detection, screen shake ripple, haptics, and win/lose resolution.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { useSharedValue, withSequence, withTiming, withSpring } from 'react-native-reanimated';
import { GameStatus, TangledStrand, LevelConfig } from '../model/types';
import { checkStrandRaycast } from '../model/raycast';
import { getLevelConfig } from '../model/levelGenerator';

export const MAX_LIVES = 3;

export interface GameController {
  levelConfig: LevelConfig;
  levelNumber: number;
  activeStrands: TangledStrand[];
  exitingStrandIds: string[];
  blockedStrandId: string | null;
  hintStrandId: string | null;
  lives: number;
  maxLives: number;
  isAnimating: boolean;
  gameStatus: GameStatus;
  screenShake: { value: number };
  totalStrands: number;
  remainingStrands: number;
  wasPerfectLevel: boolean;
  isPaused: boolean;
  canUndo: boolean;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  undoMove: () => void;
  handleStrandPress: (strandId: string) => void;
  onExitAnimationComplete: (strandId: string) => void;
  triggerHint: () => string | null;
  restartLevel: () => void;
  nextLevel: () => void;
  retryLevel: () => void;
  goToLevel: (lvl: number) => void;
}

export function useGameController(
  initialLevel = 1,
  onWinCallback?: (wasPerfect: boolean, strandsCleared: number) => void,
  onLossCallback?: () => void
): GameController {
  const [levelNumber, setLevelNumber] = useState<number>(initialLevel);
  const [levelConfig, setLevelConfig] = useState<LevelConfig>(() => getLevelConfig(initialLevel));
  const [activeStrands, setActiveStrands] = useState<TangledStrand[]>(() => levelConfig.strands);
  const [exitingStrandIds, setExitingStrandIds] = useState<string[]>([]);
  const [blockedStrandId, setBlockedStrandId] = useState<string | null>(null);
  const [hintStrandId, setHintStrandId] = useState<string | null>(null);
  const [lives, setLives] = useState<number>(MAX_LIVES);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [wasPerfectLevel, setWasPerfectLevel] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [moveHistory, setMoveHistory] = useState<TangledStrand[]>([]);

  const totalStrands = useRef<number>(levelConfig.strands.length);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadedLevelRef = useRef<number>(initialLevel);

  // Screen shake shared value for camera ripple when a blocked strand is tapped
  const screenShake = useSharedValue(0);

  const triggerHaptic = useCallback((type: 'success' | 'warning' | 'light' | 'win') => {
    try {
      if (type === 'success') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (type === 'warning') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else if (type === 'win') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch {
      // Platform without haptics
    }
  }, []);

  const loadLevel = useCallback(
    (lvl: number) => {
      loadedLevelRef.current = lvl;
      setLevelNumber(lvl);
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
      const config = getLevelConfig(lvl);
      setLevelConfig(config);
      setActiveStrands(config.strands);
      totalStrands.current = config.strands.length;
      setExitingStrandIds([]);
      setBlockedStrandId(null);
      setHintStrandId(null);
      setLives(MAX_LIVES);
      setIsAnimating(false);
      setWasPerfectLevel(true);
      setMoveHistory([]);
      setIsPaused(false);
      screenShake.value = 0;
    },
    [screenShake]
  );

  // Explicitly listen to external/global initialLevel changes and load the new level
  useEffect(() => {
    if (initialLevel && initialLevel !== loadedLevelRef.current) {
      if (gameStatus === 'won') {
        // Do not interrupt the victory celebration modal; Next Level button will advance
        return;
      }
      loadedLevelRef.current = initialLevel;
      setLevelNumber(initialLevel);
      loadLevel(initialLevel);
    }
  }, [initialLevel, gameStatus, loadLevel]);

  const startGame = useCallback(() => {
    setGameStatus('playing');
    triggerHaptic('light');
  }, [triggerHaptic]);

  const pauseGame = useCallback(() => {
    if (gameStatus === 'playing') {
      setIsPaused(true);
      triggerHaptic('light');
    }
  }, [gameStatus, triggerHaptic]);

  const resumeGame = useCallback(() => {
    setIsPaused(false);
    triggerHaptic('light');
  }, [triggerHaptic]);

  // Hint finder: finds an unblocked strand and highlights it
  const triggerHint = useCallback((): string | null => {
    if (isAnimating || isPaused || gameStatus !== 'playing') return null;

    const remainingActive = activeStrands.filter(
      (s) => !exitingStrandIds.includes(s.id)
    );

    for (const strand of remainingActive) {
      const res = checkStrandRaycast(
        strand,
        remainingActive,
        levelConfig.rows,
        levelConfig.cols
      );
      if (res.isClear) {
        setHintStrandId(strand.id);
        triggerHaptic('light');

        if (hintTimeoutRef.current) {
          clearTimeout(hintTimeoutRef.current);
        }
        hintTimeoutRef.current = setTimeout(() => {
          setHintStrandId(null);
        }, 3200);

        return strand.id;
      }
    }
    return null;
  }, [isAnimating, isPaused, gameStatus, activeStrands, exitingStrandIds, levelConfig, triggerHaptic]);

  const handleStrandPress = useCallback(
    (strandId: string) => {
      if (isPaused || gameStatus !== 'playing') {
        return;
      }
      if (isAnimating) {
        return;
      }
      if (exitingStrandIds.includes(strandId)) {
        return;
      }
      if (blockedStrandId === strandId) {
        return;
      }

      // If user taps the hinted strand, clear hint
      if (hintStrandId === strandId) {
        setHintStrandId(null);
      }

      const target = activeStrands.find((s) => s.id === strandId);
      if (!target) return;

      const remainingActive = activeStrands.filter(
        (s) => !exitingStrandIds.includes(s.id)
      );

      const raycastResult = checkStrandRaycast(
        target,
        remainingActive,
        levelConfig.rows,
        levelConfig.cols
      );

      if (raycastResult.isClear) {
        // Path is unblocked! Trigger immediate smooth gliding exit
        setIsAnimating(true);
        setExitingStrandIds((prev) => [...prev, strandId]);
        triggerHaptic('success');
      } else {
        // Path is blocked!
        setIsAnimating(true);
        setBlockedStrandId(strandId);
        setWasPerfectLevel(false);

        // 1. Visceral camera shake ripple with spring recoil
        screenShake.value = withSequence(
          withTiming(-8, { duration: 40 }),
          withTiming(8, { duration: 40 }),
          withSpring(0, { damping: 9, stiffness: 220 })
        );

        // 2. Haptic bump
        triggerHaptic('warning');

        // 3. Decrement heart
        const nextLives = Math.max(0, lives - 1);
        setLives(nextLives);
        if (nextLives === 0) {
          setTimeout(() => {
            onLossCallback?.();
            setGameStatus('lost');
          }, 350);
        }

        // Clear blocked state after 280ms
        setTimeout(() => {
          setBlockedStrandId(null);
          setIsAnimating(false);
        }, 280);
      }
    },
    [isPaused, isAnimating, gameStatus, exitingStrandIds, blockedStrandId, hintStrandId, activeStrands, levelConfig, screenShake, triggerHaptic, lives, onLossCallback]
  );

  const onExitAnimationComplete = useCallback(
    (strandId: string) => {
      const cleared = activeStrands.find((s) => s.id === strandId);
      if (cleared) {
        setMoveHistory((prev) => [...prev, cleared]);
      }
      const nextRemaining = activeStrands.filter((s) => s.id !== strandId);
      setActiveStrands(nextRemaining);
      setExitingStrandIds((prev) => prev.filter((id) => id !== strandId));
      setIsAnimating(false);

      if (nextRemaining.length === 0) {
        triggerHaptic('win');
        onWinCallback?.(wasPerfectLevel, totalStrands.current);
        setGameStatus('won');
      }
    },
    [triggerHaptic, onWinCallback, wasPerfectLevel, activeStrands]
  );

  const undoMove = useCallback(() => {
    if (moveHistory.length === 0 || isAnimating || isPaused || gameStatus !== 'playing') {
      return;
    }
    const last = moveHistory[moveHistory.length - 1];
    setMoveHistory((prev) => prev.slice(0, prev.length - 1));
    setActiveStrands((prev) => [...prev, { ...last, status: 'idle' }]);
    triggerHaptic('light');
  }, [moveHistory, isAnimating, isPaused, gameStatus, triggerHaptic]);

  const restartLevel = useCallback(() => {
    loadLevel(levelNumber);
    setGameStatus('playing');
    triggerHaptic('light');
  }, [levelNumber, loadLevel, triggerHaptic]);

  const nextLevel = useCallback(() => {
    const nextLvl = levelNumber + 1;
    loadLevel(nextLvl);
    setGameStatus('playing');
    triggerHaptic('light');
  }, [levelNumber, loadLevel, triggerHaptic]);

  const retryLevel = useCallback(() => {
    restartLevel();
  }, [restartLevel]);

  const goToLevel = useCallback(
    (lvl: number) => {
      const target = Math.max(1, lvl);
      loadLevel(target);
      setGameStatus('playing');
      triggerHaptic('light');
    },
    [loadLevel, triggerHaptic]
  );

  const canUndo = moveHistory.length > 0 && !isAnimating && !isPaused && gameStatus === 'playing';

  return {
    levelConfig,
    levelNumber,
    activeStrands,
    exitingStrandIds,
    blockedStrandId,
    hintStrandId,
    lives,
    maxLives: MAX_LIVES,
    isAnimating,
    gameStatus,
    screenShake,
    totalStrands: totalStrands.current,
    remainingStrands: activeStrands.length,
    wasPerfectLevel,
    isPaused,
    canUndo,
    startGame,
    pauseGame,
    resumeGame,
    undoMove,
    handleStrandPress,
    onExitAnimationComplete,
    triggerHint,
    restartLevel,
    nextLevel,
    retryLevel,
    goToLevel,
  };
}
