import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import FloatingHUD from '../components/FloatingHUD';
import BoardView from '../components/BoardView';
import GameplayBottomBar from '../components/GameplayBottomBar';
import PauseModal from '../components/PauseModal';
import LevelCompleteModal from '../components/LevelCompleteModal';
import GameOverModal from '../components/GameOverModal';
import LevelSelectModal from '../components/LevelSelectModal';
import { useGameController } from '../../controller/useGameController';
import { usePlayer } from '../../store/PlayerContext';
import { colors } from '../../theme/colors';

export default function GameScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const { currentLevel, setCurrentLevel, stats, recordWin, recordLoss, useHint } = usePlayer();
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState<boolean>(false);

  const {
    levelConfig,
    levelNumber,
    activeStrands,
    exitingStrandIds,
    blockedStrandId,
    hintStrandId,
    lives,
    maxLives,
    isAnimating,
    gameStatus,
    screenShake,
    remainingStrands,
    isPaused,
    canUndo,
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
  } = useGameController(currentLevel || 1, recordWin, recordLoss);

  const handleNextLevel = () => {
    const nextLvl = levelNumber + 1;
    setCurrentLevel(nextLvl);
    nextLevel();
  };

  const handleReplay = () => {
    setCurrentLevel(levelNumber);
    restartLevel();
  };

  const handleSelectLevel = (lvl: number) => {
    setCurrentLevel(lvl);
    goToLevel(lvl);
    setIsLevelSelectOpen(false);
  };

  const handleHintPress = () => {
    if (stats.hintsRemaining <= 0 || gameStatus !== 'playing' || isPaused) return;
    const hintSuccess = triggerHint();
    if (hintSuccess) {
      useHint();
    }
  };

  // Tap to Move trigger: automatically prompts or moves an available unblocked arrow
  const handleTapToMove = () => {
    if (isAnimating || isPaused || gameStatus !== 'playing') return;
    triggerHint();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* 1. Deep Midnight Blue Background Gradient */}
      <LinearGradient
        colors={[colors.bgTop, '#07132F', colors.bgBottom]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <SafeAreaView edges={['top', 'bottom']} style={styles.contentSafeArea}>
        {/* 2. TOP HUD: Level Number | 3 Stars | Pause Button || (Screen 4 Reference) */}
        <View style={styles.hudContainer}>
          <FloatingHUD
            levelNumber={levelNumber}
            lives={lives}
            maxLives={maxLives}
            stars={Math.max(1, Math.min(3, lives))}
            onPause={pauseGame}
            disabled={gameStatus !== 'playing'}
          />
        </View>

        {/* 3. MAIN PUZZLE BOARD: Blueprint Grid & Thick Neon Arrows (Screen 4 Reference) */}
        <View style={styles.boardOuterWrapper}>
          <BoardView
            strands={activeStrands}
            rows={levelConfig.rows}
            cols={levelConfig.cols}
            exitingStrandIds={exitingStrandIds}
            blockedStrandId={blockedStrandId}
            hintStrandId={hintStrandId}
            isAnimating={isAnimating}
            screenShake={screenShake}
            onStrandPress={handleStrandPress}
            onExitComplete={onExitAnimationComplete}
          />
        </View>

        {/* 4. BOTTOM FLOATING DOCK BAR: Only Hint (Screen Reference Match) */}
        <View style={styles.bottomBarContainer}>
          <GameplayBottomBar
            hintsRemaining={stats.hintsRemaining}
            onHint={handleHintPress}
            disabled={gameStatus !== 'playing' || isPaused}
          />
        </View>

        {/* MODAL 1: In-Game Pause Modal (Screen 5 Reference) */}
        <PauseModal
          visible={isPaused}
          levelNumber={levelNumber}
          remainingStrands={remainingStrands}
          onResume={resumeGame}
          onRestart={() => {
            resumeGame();
            restartLevel();
          }}
          onLevelSelect={() => {
            resumeGame();
            navigation.navigate('LevelSelection');
          }}
          onHome={() => {
            resumeGame();
            navigation.navigate('Home');
          }}
        />

        {/* MODAL 2: Level Complete Celebration Modal (Screen 6 Reference) */}
        {gameStatus === 'won' && (
          <LevelCompleteModal
            levelNumber={levelNumber}
            lives={lives}
            strandsCleared={levelConfig.strands.length}
            movesCount={levelConfig.strands.length}
            timeElapsed="02:38"
            onNextLevel={handleNextLevel}
            onHome={() => navigation.navigate('Home')}
            onReplay={handleReplay}
            onLevelSelect={() => navigation.navigate('LevelSelection')}
          />
        )}

        {/* MODAL 3: Game Over Modal (Screen 7 Reference) */}
        {gameStatus === 'lost' && (
          <GameOverModal
            timeElapsed="03:15"
            movesCount={28}
            onRetry={retryLevel}
            onLevelSelect={() => navigation.navigate('LevelSelection')}
          />
        )}

        {/* Level Select Modal (Quick switcher if needed) */}
        <LevelSelectModal
          visible={isLevelSelectOpen}
          currentLevel={levelNumber}
          onSelectLevel={handleSelectLevel}
          onClose={() => setIsLevelSelectOpen(false)}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgTop,
  },
  contentSafeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  hudContainer: {
    width: '100%',
    zIndex: 30,
  },
  boardOuterWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    zIndex: 10,
    overflow: 'visible',
  },
  bottomBarContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    zIndex: 25,
  },
});
