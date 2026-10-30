import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient as SvgRadialGradient,
  Stop,
  Path,
  Rect,
  Circle,
  Polygon,
  G,
  Ellipse,
} from 'react-native-svg';
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
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* ============================================================== */}
      {/* 1. NATURAL OUTDOOR DAYTIME SKY & CASCADE ISLANDS BACKGROUND    */}
      {/* ============================================================== */}
      {/* Bright Sky Blue Gradient */}
      <LinearGradient
        colors={['#1A8CEB', '#38BDF8', '#7DD3FC', '#BAE6FD']}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* SVG Scenery Layer: Floating Islands with Waterfalls, Foliage, & Clouds */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`} fill="none">
          <Defs>
            {/* Waterfall Mist Gradient */}
            <SvgLinearGradient id="waterfallMist" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <Stop offset="40%" stopColor="#E0F7FE" stopOpacity="0.75" />
              <Stop offset="80%" stopColor="#38BDF8" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#E0F2FE" stopOpacity="0" />
            </SvgLinearGradient>

            {/* Cloud Puff Gradient */}
            <SvgRadialGradient id="cloudGrad" cx="50%" cy="40%" r="50%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <Stop offset="70%" stopColor="#F0F9FF" stopOpacity="0.85" />
              <Stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.45" />
            </SvgRadialGradient>
          </Defs>

          {/* Distant Puffy Clouds */}
          <Ellipse cx={50} cy={140} rx={75} ry={40} fill="url(#cloudGrad)" />
          <Ellipse cx={SCREEN_WIDTH - 60} cy={160} rx={80} ry={45} fill="url(#cloudGrad)" />
          <Ellipse cx={SCREEN_WIDTH / 2} cy={SCREEN_HEIGHT - 220} rx={120} ry={55} fill="url(#cloudGrad)" opacity={0.6} />

          {/* Distant Floating Waterfall Islands (Left side) */}
          <G>
            {/* Waterfall */}
            <Path d="M38,280 L38,420 L44,420 L44,280 Z" fill="url(#waterfallMist)" />
            {/* Rock base */}
            <Polygon points="18,275 62,275 52,315 28,315" fill="#5C3A1D" />
            <Polygon points="28,315 52,315 44,335 36,335" fill="#3D2411" />
            {/* Green crown */}
            <Ellipse cx="40" cy="273" rx="26" ry="9" fill="#15803D" />
            <Ellipse cx="40" cy="271" rx="23" ry="7" fill="#22C55E" />
            {/* Trees */}
            <Circle cx="32" cy="262" r="7" fill="#16A34A" />
            <Circle cx="48" cy="263" r="6" fill="#4ADE80" />
          </G>

          {/* Distant Floating Waterfall Islands (Right side) */}
          <G>
            {/* Waterfall */}
            <Path
              d={`M${SCREEN_WIDTH - 42},300 L${SCREEN_WIDTH - 42},450 L${SCREEN_WIDTH - 36},450 L${SCREEN_WIDTH - 36},300 Z`}
              fill="url(#waterfallMist)"
            />
            {/* Rock base */}
            <Polygon
              points={`${SCREEN_WIDTH - 65},295 ${SCREEN_WIDTH - 18},295 ${SCREEN_WIDTH - 28},335 ${SCREEN_WIDTH - 55},335`}
              fill="#5C3A1D"
            />
            <Polygon
              points={`${SCREEN_WIDTH - 55},335 ${SCREEN_WIDTH - 28},335 ${SCREEN_WIDTH - 36},355 ${SCREEN_WIDTH - 45},355`}
              fill="#3D2411"
            />
            {/* Green crown */}
            <Ellipse cx={SCREEN_WIDTH - 42} cy={293} rx="28" ry="9" fill="#15803D" />
            <Ellipse cx={SCREEN_WIDTH - 42} cy={291} rx="25" ry="7" fill="#22C55E" />
            {/* Trees */}
            <Circle cx={SCREEN_WIDTH - 50} cy={282} r="8" fill="#16A34A" />
            <Circle cx={SCREEN_WIDTH - 34} cy={283} r="7" fill="#4ADE80" />
          </G>

          {/* Top-Right Cartoon Tree Trunk & Foliage Overhang (as in image_86.png) */}
          <G>
            {/* Tree Branch Trunk */}
            <Path
              d={`M${SCREEN_WIDTH + 10},120 Q${SCREEN_WIDTH - 40},160 ${SCREEN_WIDTH - 65},195 Q${SCREEN_WIDTH - 45},205 ${SCREEN_WIDTH + 15},160 Z`}
              fill="#78350F"
              stroke="#451A03"
              strokeWidth="2"
            />
            {/* Trunk bark ridges */}
            <Path
              d={`M${SCREEN_WIDTH - 15},145 Q${SCREEN_WIDTH - 45},175 ${SCREEN_WIDTH - 55},192`}
              stroke="#B45309"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Tree Leaves Puffy Clouds */}
            <Circle cx={SCREEN_WIDTH - 40} cy={140} r="32" fill="#15803D" />
            <Circle cx={SCREEN_WIDTH - 65} cy={130} r="26" fill="#16A34A" />
            <Circle cx={SCREEN_WIDTH - 20} cy={110} r="34" fill="#22C55E" />
            <Circle cx={SCREEN_WIDTH - 45} cy={115} r="26" fill="#4ADE80" />
          </G>

          {/* Bottom Foreground Foliage & Rocky Frame */}
          {/* Dark cliff base */}
          <Path
            d={`M0,${SCREEN_HEIGHT - 45} Q${SCREEN_WIDTH / 4},${SCREEN_HEIGHT - 70} ${SCREEN_WIDTH / 2},${SCREEN_HEIGHT - 40} Q${(SCREEN_WIDTH * 3) / 4},${SCREEN_HEIGHT - 75} ${SCREEN_WIDTH},${SCREEN_HEIGHT - 50} L${SCREEN_WIDTH},${SCREEN_HEIGHT} L0,${SCREEN_HEIGHT} Z`}
            fill="#1E293B"
          />
          {/* Left bushes */}
          <Circle cx="15" cy={SCREEN_HEIGHT - 35} r="34" fill="#15803D" />
          <Circle cx="45" cy={SCREEN_HEIGHT - 30} r="28" fill="#16A34A" />
          <Circle cx="75" cy={SCREEN_HEIGHT - 22} r="24" fill="#22C55E" />
          {/* Right bushes */}
          <Circle cx={SCREEN_WIDTH - 15} cy={SCREEN_HEIGHT - 35} r="36" fill="#15803D" />
          <Circle cx={SCREEN_WIDTH - 50} cy={SCREEN_HEIGHT - 30} r="30" fill="#16A34A" />
          <Circle cx={SCREEN_WIDTH - 80} cy={SCREEN_HEIGHT - 22} r="26" fill="#22C55E" />
          {/* Bottom-right rock boulders */}
          <Path
            d={`M${SCREEN_WIDTH - 65},${SCREEN_HEIGHT - 18} Q${SCREEN_WIDTH - 80},${SCREEN_HEIGHT - 45} ${SCREEN_WIDTH - 100},${SCREEN_HEIGHT - 38} Q${SCREEN_WIDTH - 115},${SCREEN_HEIGHT - 22} ${SCREEN_WIDTH - 110},${SCREEN_HEIGHT - 8} Z`}
            fill="#475569"
          />
        </Svg>
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    zIndex: 10,
    overflow: 'visible',
  },
  bottomBarContainer: {
    width: '100%',
    zIndex: 25,
  },
});
