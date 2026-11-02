import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import FloatingHUD from '../components/FloatingHUD';
import BoardView from '../components/BoardView';
import GameplayBottomBar from '../components/GameplayBottomBar';
import PauseModal from '../components/PauseModal';
import LevelCompleteModal from '../components/LevelCompleteModal';
import GameOverModal from '../components/GameOverModal';
import LevelSelectModal from '../components/LevelSelectModal';
import { useGameController } from '../../controller/useGameController';
import { usePlayer } from '../../store/PlayerContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GAMEPLAY_BG = require('../../../assets/gameplay_bg.jpg');

export default function GameScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
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
  } = useGameController(currentLevel || 7, recordWin, recordLoss);

  React.useEffect(() => {
    const routeLevel = route.params?.level;
    if (routeLevel !== undefined && routeLevel !== null) {
      const parsed = Number(routeLevel);
      if (!isNaN(parsed) && parsed > 0 && parsed !== levelNumber) {
        setCurrentLevel(parsed);
        goToLevel(parsed);
      }
    }
  }, [route.params?.level, levelNumber, setCurrentLevel, goToLevel]);

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

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <ImageBackground
      source={GAMEPLAY_BG}
      resizeMode="cover"
      style={styles.container}
    >
      <StatusBar style="light" />

      <SafeAreaView edges={['top', 'bottom']} style={styles.contentSafeArea}>
        {/* ============================================================== */}
        {/* 2. REFINED TOP HUD: Level 7 Badge | 3 Stars | Blue Pause Button*/}
        {/* (NO settings/gear icon anywhere on top-left)                   */}
        {/* ============================================================== */}
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

        {/* ============================================================== */}
        {/* 3. BORDERLESS & FLAT PUZZLE GRID: Modular Dark-Blue Tiles      */}
        {/* (No bulky island frames, no grassy borders around puzzle)     */}
        {/* ============================================================== */}
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

        {/* ============================================================== */}
        {/* 4. INTERACTIVE FOOTER: 3D Blue Hint (Center) | Back Button (<) */}
        {/* ============================================================== */}
        <View style={styles.bottomBarContainer}>
          <GameplayBottomBar
            hintsRemaining={stats.hintsRemaining}
            onHint={handleHintPress}
            onBack={handleBackPress}
            disabled={gameStatus !== 'playing' || isPaused}
          />
        </View>

        {/* ============================================================== */}
        {/* MODALS: Pause, Victory, Game Over                              */}
        {/* ============================================================== */}
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

        {gameStatus === 'lost' && (
          <GameOverModal
            timeElapsed="03:15"
            movesCount={28}
            onRetry={retryLevel}
            onLevelSelect={() => navigation.navigate('LevelSelection')}
          />
        )}

        <LevelSelectModal
          visible={isLevelSelectOpen}
          currentLevel={levelNumber}
          onSelectLevel={handleSelectLevel}
          onClose={() => setIsLevelSelectOpen(false)}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#1E88E5',
  },
  contentSafeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
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
    paddingHorizontal: 8,
    zIndex: 20,
    elevation: 5,
    overflow: 'visible',
  },
  bottomBarContainer: {
    width: '100%',
    zIndex: 25,
  },
});
