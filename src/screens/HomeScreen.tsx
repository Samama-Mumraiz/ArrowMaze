import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Path,
  Rect,
  Circle,
  Polygon,
  Line,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { typography } from '../theme/typography';
import { usePlayer } from '../store/PlayerContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HOME_BG = require('../../assets/home_bg.jpg');

export default function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { stats, totalWins } = usePlayer();

  // Dynamic values connected to React Native global state
  const activeLevel = stats?.currentLevel ?? 12;
  const winsProgress = stats?.totalWins ?? totalWins ?? 8;
  const coinBalance = stats?.coins ?? 195;

  // Reanimated 3D button press micro-interactions
  const playScale = useSharedValue(1);
  const levelsScale = useSharedValue(1);

  const animatedPlayStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playScale.value }],
  }));

  const animatedLevelsStyle = useAnimatedStyle(() => ({
    transform: [{ scale: levelsScale.value }],
  }));

  const handlePlayPressIn = () => {
    playScale.value = withTiming(0.93, { duration: 80, easing: Easing.out(Easing.ease) });
  };

  const handlePlayPressOut = () => {
    playScale.value = withSpring(1, { damping: 12, stiffness: 240 });
  };

  const handleLevelsPressIn = () => {
    levelsScale.value = withTiming(0.93, { duration: 80, easing: Easing.out(Easing.ease) });
  };

  const handleLevelsPressOut = () => {
    levelsScale.value = withSpring(1, { damping: 12, stiffness: 240 });
  };

  const handlePlayPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // platform fallback
    }
    navigation.navigate('Play');
  };

  const handleLevelsPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // platform fallback
    }
    navigation.navigate('LevelSelection');
  };

  const handleSettingsPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // platform fallback
    }
    navigation.navigate('Settings');
  };

  return (
    <ImageBackground
      source={HOME_BG}
      resizeMode="cover"
      style={styles.container}
    >
      {/* ============================================================== */}
      {/* 1. HUD OVERLAY: Top-Left Level Badge + Top-Right Coin Pill     */}
      {/* Absolute positioning cleanly on top of the image asset         */}
      {/* ============================================================== */}
      <View
        style={[
          styles.topHudContainer,
          { top: Math.max(16, insets.top + 8) },
        ]}
      >
        {/* Top-Left: Settings Icon + Level Progress Badge */}
        <View style={styles.leftHeaderGroup}>
          {/* Settings Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSettingsPress}
            style={styles.settingsButton}
            accessibilityLabel="Settings"
          >
            <LinearGradient
              colors={['#38BDF8', '#0284C7', '#0369A1']}
              style={styles.settingsGradient}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="3.5" stroke="#FFFFFF" strokeWidth={2.2} />
                <Path
                  d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </LinearGradient>
          </TouchableOpacity>

          {/* Stylized 'Level X' Progress Badge with Golden Crown */}
          <View style={styles.levelBadge}>
            <View style={styles.crownContainer}>
              <Svg width={24} height={24} viewBox="0 0 32 32" fill="none">
                <Defs>
                  <SvgLinearGradient id="crownGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#FFF275" />
                    <Stop offset="40%" stopColor="#FBBF24" />
                    <Stop offset="100%" stopColor="#D97706" />
                  </SvgLinearGradient>
                </Defs>
                <Path
                  d="M4,24 L28,24 L26,12 L20,18 L16,7 L12,18 L6,12 Z"
                  fill="url(#crownGrad)"
                  stroke="#B45309"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <Rect x="4" y="22" width="24" height="4" rx="2" fill="#F59E0B" stroke="#92400E" strokeWidth="1" />
                <Circle cx="16" cy="18" r="2" fill="#EF4444" stroke="#991B1B" strokeWidth="0.8" />
              </Svg>
            </View>

            <View style={styles.levelInfoCol}>
              <Text style={styles.levelBadgeTitle}>Level {activeLevel}</Text>
              <View style={styles.levelProgressTrack}>
                <View style={styles.levelProgressFill}>
                  <Text style={styles.levelProgressText}>{winsProgress}/20</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Top-Right: Gold Coin Pill */}
        <View style={styles.coinPillContainer}>
          <View style={styles.coinIconWrapper}>
            <Svg width={24} height={24} viewBox="0 0 32 32" fill="none">
              <Defs>
                <SvgLinearGradient id="goldCoinMain" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor="#FFF275" />
                  <Stop offset="50%" stopColor="#FBBF24" />
                  <Stop offset="100%" stopColor="#D97706" />
                </SvgLinearGradient>
              </Defs>
              <Circle cx="16" cy="16" r="14.5" fill="url(#goldCoinMain)" stroke="#92400E" strokeWidth="1.2" />
              <Polygon
                points="16,7 18.5,12.2 24.2,13 20.1,17 21.1,22.7 16,20 10.9,22.7 11.9,17 7.8,13 13.5,12.2"
                fill="#FFFFFF"
                opacity={0.9}
              />
            </Svg>
          </View>

          <Text style={styles.coinBalanceText}>{coinBalance}</Text>

          <TouchableOpacity activeOpacity={0.8} style={styles.coinAddButton}>
            <LinearGradient colors={['#38BDF8', '#0284C7']} style={styles.coinAddGradient}>
              <Text style={styles.coinAddText}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* ============================================================== */}
      {/* 2. INTERACTIVE BUTTONS: Symmetrical 3D "Play" and "Levels"     */}
      {/* Positioned in the lower center with Reanimated spring effects  */}
      {/* ============================================================== */}
      <View
        style={[
          styles.buttonStack,
          { bottom: Math.max(32, insets.bottom + 22) },
        ]}
      >
        {/* 1. PLAY BUTTON (with Yellow Glow-Sparkle Accents on sides) */}
        <Animated.View style={[styles.buttonWrapper, animatedPlayStyle]}>
          {/* Left Glow-Sparkles */}
          <View style={styles.sparkleSideLeft}>
            <Svg width={22} height={34} viewBox="0 0 24 36" fill="none">
              <Line x1="18" y1="8" x2="6" y2="4" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
              <Line x1="20" y1="18" x2="4" y2="18" stroke="#FDE047" strokeWidth="3.5" strokeLinecap="round" />
              <Line x1="18" y1="28" x2="6" y2="32" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
            </Svg>
          </View>

          {/* 3D Button Body */}
          <TouchableOpacity
            activeOpacity={0.92}
            onPressIn={handlePlayPressIn}
            onPressOut={handlePlayPressOut}
            onPress={handlePlayPress}
            style={styles.button3DBase}
            accessibilityLabel="Play Game"
          >
            {/* 3D Dark Under-Bevel Base */}
            <View style={styles.buttonBevelBottom} />

            {/* Glossy Front Gradient Face */}
            <LinearGradient
              colors={['#38BDF8', '#0284C7', '#0369A1']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.buttonFrontFace}
            >
              {/* Top Gloss Reflection Highlight */}
              <View style={styles.glossHighlightTop} />

              {/* Centered Content: ▶ Play */}
              <View style={styles.buttonContentRow}>
                <View style={styles.playIconBadge}>
                  <Svg width={22} height={22} viewBox="0 0 28 28" fill="#FFFFFF">
                    <Polygon points="7,4 23,14 7,24" />
                  </Svg>
                </View>
                <Text style={styles.buttonText}>Play</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Right Glow-Sparkles */}
          <View style={styles.sparkleSideRight}>
            <Svg width={22} height={34} viewBox="0 0 24 36" fill="none">
              <Line x1="6" y1="8" x2="18" y2="4" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
              <Line x1="4" y1="18" x2="20" y2="18" stroke="#FDE047" strokeWidth="3.5" strokeLinecap="round" />
              <Line x1="6" y1="28" x2="18" y2="32" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
            </Svg>
          </View>
        </Animated.View>

        {/* 2. LEVELS BUTTON (Exact Same Dimensions & Symmetrical Styling) */}
        <Animated.View style={[styles.buttonWrapper, animatedLevelsStyle]}>
          <TouchableOpacity
            activeOpacity={0.92}
            onPressIn={handleLevelsPressIn}
            onPressOut={handleLevelsPressOut}
            onPress={handleLevelsPress}
            style={styles.button3DBase}
            accessibilityLabel="Select Level"
          >
            {/* 3D Dark Under-Bevel Base */}
            <View style={styles.buttonBevelBottom} />

            {/* Glossy Front Gradient Face */}
            <LinearGradient
              colors={['#38BDF8', '#0284C7', '#0369A1']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.buttonFrontFace}
            >
              {/* Top Gloss Reflection Highlight */}
              <View style={styles.glossHighlightTop} />

              {/* Centered Content: ⚃ Levels */}
              <View style={styles.buttonContentRow}>
                <View style={styles.levelsIconBadge}>
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Rect x="2.5" y="2.5" width="8" height="8" rx="2" fill="#FFFFFF" />
                    <Rect x="13.5" y="2.5" width="8" height="8" rx="2" fill="#FFFFFF" />
                    <Rect x="2.5" y="13.5" width="8" height="8" rx="2" fill="#FFFFFF" />
                    <Rect x="13.5" y="13.5" width="8" height="8" rx="2" fill="#FFFFFF" />
                  </Svg>
                </View>
                <Text style={styles.buttonText}>Levels</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  /* ---------------------------------------------------------------------- */
  /* TOP HUD OVERLAY                                                        */
  /* ---------------------------------------------------------------------- */
  topHudContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  leftHeaderGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#7DD3FC',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 4,
  },
  settingsGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Level Progress Badge */
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 28, 68, 0.88)',
    borderRadius: 20,
    borderWidth: 1.8,
    borderColor: '#38BDF8',
    paddingLeft: 6,
    paddingRight: 12,
    paddingVertical: 3.5,
    gap: 6,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 4,
  },
  crownContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelInfoCol: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  levelBadgeTitle: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  levelProgressTrack: {
    width: 52,
    height: 12,
    backgroundColor: '#0F274E',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1E40AF',
    overflow: 'hidden',
    marginTop: 1.5,
  },
  levelProgressFill: {
    width: '55%',
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelProgressText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 8,
    color: '#FFFFFF',
    lineHeight: 11,
  },

  /* Coin Pill */
  coinPillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 28, 68, 0.88)',
    borderRadius: 20,
    borderWidth: 1.8,
    borderColor: '#38BDF8',
    paddingLeft: 5,
    paddingRight: 6,
    paddingVertical: 3.5,
    gap: 7,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 4,
  },
  coinIconWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinBalanceText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  coinAddButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  coinAddGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinAddText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: -2,
  },

  /* ---------------------------------------------------------------------- */
  /* INTERACTIVE LOWER-CENTER BUTTON STACK                                  */
  /* ---------------------------------------------------------------------- */
  buttonStack: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    zIndex: 20,
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 260,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sparkleSideLeft: {
    position: 'absolute',
    left: -28,
    top: 10,
    zIndex: 2,
  },
  sparkleSideRight: {
    position: 'absolute',
    right: -28,
    top: 10,
    zIndex: 2,
  },
  button3DBase: {
    width: '100%',
    height: 56,
    position: 'relative',
  },
  buttonBevelBottom: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    height: 51,
    backgroundColor: '#013D75',
    borderRadius: 28,
  },
  buttonFrontFace: {
    width: '100%',
    height: 51,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#7DD3FC',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 7,
    elevation: 5,
  },
  glossHighlightTop: {
    position: 'absolute',
    top: 2,
    left: 18,
    right: 18,
    height: 18,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  playIconBadge: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  levelsIconBadge: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(1, 61, 117, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
});
