import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Defs,
  Pattern,
  Path,
  Rect,
  Circle,
  Polygon,
  LinearGradient as SvgLinearGradient,
  RadialGradient as SvgRadialGradient,
  Stop,
  Line,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { typography } from '../theme/typography';
import { usePlayer } from '../store/PlayerContext';
import NeonIsometricCube from '../view/components/NeonIsometricCube';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const { stats, totalWins } = usePlayer();

  // Floating cube subtle levitation animation
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-7, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [translateY]);

  const animatedCubeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Reanimated button micro-interactions (press-in to 0.95, spring back to 1.0)
  const playScale = useSharedValue(1);
  const levelsScale = useSharedValue(1);

  const animatedPlayBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playScale.value }],
  }));

  const animatedLevelsBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: levelsScale.value }],
  }));

  const handlePlayPressIn = () => {
    playScale.value = withTiming(0.95, { duration: 100, easing: Easing.out(Easing.ease) });
  };

  const handlePlayPressOut = () => {
    playScale.value = withSpring(1, { damping: 14, stiffness: 220 });
  };

  const handleLevelsPressIn = () => {
    levelsScale.value = withTiming(0.95, { duration: 100, easing: Easing.out(Easing.ease) });
  };

  const handleLevelsPressOut = () => {
    levelsScale.value = withSpring(1, { damping: 14, stiffness: 220 });
  };

  const handlePlayPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // platform without haptics
    }
    navigation.navigate('Play');
  };

  const handleLevelsPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // platform without haptics
    }
    navigation.navigate('LevelSelection');
  };

  const handleSettingsPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // platform without haptics
    }
    navigation.navigate('Settings');
  };

  // Coin balance defaults to 12 matching the reference mockup
  const coinBalance = stats?.coins ?? (totalWins ? Math.max(12, totalWins) : 12);

  return (
    <View style={styles.container}>
      {/* 1. Strictly Deep Navy / Midnight Blue Gradient Background (#040D21) */}
      <LinearGradient
        colors={['#020718', '#040D21', '#02091A']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* 2. Cybernetic Grid & Abstract Cyber-Lines Pattern (No Cartoon/Nature Elements) */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            {/* Blueprint Grid Pattern matching Level Screen */}
            <Pattern id="cyberGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <Rect width="32" height="32" fill="none" />
              <Line
                x1="0"
                y1="0"
                x2="32"
                y2="0"
                stroke="rgba(0, 195, 255, 0.07)"
                strokeWidth="1"
              />
              <Line
                x1="0"
                y1="0"
                x2="0"
                y2="32"
                stroke="rgba(0, 195, 255, 0.07)"
                strokeWidth="1"
              />
            </Pattern>

            {/* Repeating 45-degree chevron maze corridor pattern */}
            <Pattern id="neonMazePattern" width="56" height="56" patternUnits="userSpaceOnUse">
              <Path
                d="M 0 28 L 28 0 L 56 28 L 28 56 Z"
                stroke="rgba(0, 190, 255, 0.06)"
                strokeWidth="1.2"
                fill="none"
              />
              <Path
                d="M 14 14 L 28 28 L 42 14 M 14 42 L 28 28 L 42 42"
                stroke="rgba(0, 160, 255, 0.03)"
                strokeWidth="1"
                fill="none"
              />
            </Pattern>

            {/* Glowing 45-degree laser streak flare */}
            <SvgLinearGradient id="streakGlow" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#00F0FF" stopOpacity="0" />
              <Stop offset="50%" stopColor="#00F0FF" stopOpacity="0.32" />
              <Stop offset="100%" stopColor="#007BFF" stopOpacity="0" />
            </SvgLinearGradient>

            {/* Ambient background glow behind hero cube */}
            <SvgRadialGradient id="centerHeroAura" cx="50%" cy="40%" r="50%">
              <Stop offset="0%" stopColor="#007BFF" stopOpacity="0.24" />
              <Stop offset="40%" stopColor="#00D2FF" stopOpacity="0.09" />
              <Stop offset="100%" stopColor="#040D21" stopOpacity="0" />
            </SvgRadialGradient>
          </Defs>

          {/* Blueprint Grid */}
          <Rect width="100%" height="100%" fill="url(#cyberGrid)" />

          {/* Maze Pattern Fill */}
          <Rect width="100%" height="100%" fill="url(#neonMazePattern)" />

          {/* Central Blue Aura Glow */}
          <Rect width="100%" height="100%" fill="url(#centerHeroAura)" />

          {/* Cybernetic Circuit Traces & Terminal Nodes */}
          <Path
            d="M0,150 L65,150 L95,180"
            stroke="rgba(0, 220, 255, 0.22)"
            strokeWidth="1.5"
            fill="none"
          />
          <Circle cx="95" cy="180" r="3" fill="#00E5FF" opacity={0.65} />

          <Path
            d={`M${SCREEN_WIDTH},110 L${SCREEN_WIDTH - 60},110 L${SCREEN_WIDTH - 90},140`}
            stroke="rgba(0, 220, 255, 0.2)"
            strokeWidth="1.5"
            fill="none"
          />
          <Circle cx={SCREEN_WIDTH - 90} cy={140} r="3" fill="#00E5FF" opacity={0.6} />

          <Path
            d={`M0,${SCREEN_HEIGHT - 170} L70,${SCREEN_HEIGHT - 170} L100,${SCREEN_HEIGHT - 200}`}
            stroke="rgba(0, 200, 255, 0.16)"
            strokeWidth="1.2"
            fill="none"
          />
          <Circle cx="100" cy={SCREEN_HEIGHT - 200} r="2.5" fill="#00D2FF" opacity={0.5} />

          {/* Top-Left Glowing Laser Flare at 45° */}
          <Line x1="10" y1="120" x2="140" y2="40" stroke="url(#streakGlow)" strokeWidth="2.5" />

          {/* Mid-Right Glowing Laser Flare at 45° */}
          <Line
            x1={SCREEN_WIDTH - 140}
            y1={240}
            x2={SCREEN_WIDTH + 10}
            y2={150}
            stroke="url(#streakGlow)"
            strokeWidth="2.5"
          />

          {/* Lower-Left Faint Flare */}
          <Line x1="-20" y1="520" x2="100" y2="450" stroke="url(#streakGlow)" strokeWidth="1.8" />
        </Svg>
      </View>

      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.contentContainer}>
          {/* ============================================================== */}
          {/* TOP HUD: Settings Gear (Left) | Gold Star Coin Pill (Right)   */}
          {/* ============================================================== */}
          <View style={styles.topBar}>
            {/* Circular Settings Gear Button with glowing cyan border */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSettingsPress}
              style={styles.iconCircleButton}
              accessibilityLabel="Settings"
            >
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="3" stroke="#FFFFFF" strokeWidth={2} />
                <Path
                  d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
                  stroke="#FFFFFF"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>

            {/* Gold Star Coin Balance Pill with glowing cyan border */}
            <View style={styles.coinPill}>
              <Svg width={24} height={24} viewBox="0 0 28 28" fill="none">
                <Defs>
                  <SvgLinearGradient id="goldCoinGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#FFE066" />
                    <Stop offset="0.5%" stopColor="#FFB800" />
                    <Stop offset="1%" stopColor="#E68A00" />
                  </SvgLinearGradient>
                  <SvgRadialGradient id="goldCoinGlow" cx="50%" cy="50%" r="50%">
                    <Stop offset="0%" stopColor="#FFF2A3" />
                    <Stop offset="100%" stopColor="#FFA000" />
                  </SvgRadialGradient>
                </Defs>
                {/* Outer coin rim with bevel */}
                <Circle cx="14" cy="14" r="13" fill="url(#goldCoinGrad)" stroke="#FFA000" strokeWidth="1" />
                <Circle cx="14" cy="14" r="10.5" fill="url(#goldCoinGlow)" stroke="#FFEAA0" strokeWidth="0.8" />
                {/* Centered crisp star */}
                <Polygon
                  points="14,6 16.3,10.7 21.5,11.5 17.7,15.2 18.6,20.4 14,17.9 9.4,20.4 10.3,15.2 6.5,11.5 11.7,10.7"
                  fill="#FFFFFF"
                />
              </Svg>
              <Text style={styles.coinText}>{coinBalance}</Text>
            </View>
          </View>

          {/* ============================================================== */}
          {/* BRAND HEADER: "ArrowMaze" & "Your Logic • Your Path"           */}
          {/* ============================================================== */}
          <View style={styles.brandContainer}>
            <View style={styles.logoRow}>
              <Text style={styles.logoTextWhite}>Arrow</Text>
              <Text style={styles.logoTextMaze}>Maze</Text>
            </View>
            <Text style={styles.tagline}>
              Your Logic <Text style={styles.taglineDot}>•</Text> Your Path
            </Text>
          </View>

          {/* ============================================================== */}
          {/* CENTER HERO: 3D Isometric Cyber-Cube on Glowing Platform        */}
          {/* ============================================================== */}
          <Animated.View style={[styles.heroCubeContainer, animatedCubeStyle]}>
            <NeonIsometricCube size={225} showPedestal={true} />
          </Animated.View>

          {/* ============================================================== */}
          {/* GLOSSY GRADIENT BUTTONS: Play, Levels (Animated Scaling)       */}
          {/* ============================================================== */}
          <View style={styles.buttonsStack}>
            {/* 1. PLAY BUTTON (Glossy Electric Cyan-to-Blue Linear Gradient) */}
            <Animated.View style={[styles.buttonAnimatedContainer, animatedPlayBtnStyle]}>
              <TouchableOpacity
                activeOpacity={0.92}
                onPressIn={handlePlayPressIn}
                onPressOut={handlePlayPressOut}
                onPress={handlePlayPress}
                style={styles.primaryButtonWrapper}
                accessibilityLabel="Play Game"
              >
                <LinearGradient
                  colors={['#00D8FF', '#0084FF', '#004FD6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.primaryButtonGradient}
                >
                  <View style={styles.btnIconLeft}>
                    <Svg width={22} height={22} viewBox="0 0 24 24" fill="#FFFFFF">
                      <Polygon points="7,4 20,12 7,20" />
                    </Svg>
                  </View>
                  <Text style={styles.primaryButtonText}>Play</Text>
                  <View style={styles.btnIconRight}>
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M9 18l6-6-6-6"
                        stroke="#FFFFFF"
                        strokeWidth={2.6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* 2. LEVELS BUTTON (Glossy Deep Metallic Blue with Cyan Border) */}
            <Animated.View style={[styles.buttonAnimatedContainer, animatedLevelsBtnStyle]}>
              <TouchableOpacity
                activeOpacity={0.92}
                onPressIn={handleLevelsPressIn}
                onPressOut={handleLevelsPressOut}
                onPress={handleLevelsPress}
                style={styles.secondaryButtonWrapper}
                accessibilityLabel="Select Level"
              >
                <LinearGradient
                  colors={['#0C2758', '#071A3F', '#040F26']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.secondaryButtonGradient}
                >
                  <View style={styles.btnIconLeft}>
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                      <Rect x="3" y="3" width="7" height="7" rx="1.8" fill="#FFFFFF" />
                      <Rect x="14" y="3" width="7" height="7" rx="1.8" fill="#FFFFFF" />
                      <Rect x="3" y="14" width="7" height="7" rx="1.8" fill="#FFFFFF" />
                      <Rect x="14" y="14" width="7" height="7" rx="1.8" fill="#FFFFFF" />
                    </Svg>
                  </View>
                  <Text style={styles.secondaryButtonText}>Levels</Text>
                  <View style={styles.btnIconRight}>
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M9 18l6-6-6-6"
                        stroke="#8FA6CC"
                        strokeWidth={2.4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* ============================================================== */}
          {/* FOOTER: "Small moves create big paths" with cyan dash accents  */}
          {/* ============================================================== */}
          <View style={styles.footerContainer}>
            <View style={styles.footerDash} />
            <View style={styles.footerTextContainer}>
              <Text style={styles.footerTextLine}>Small moves</Text>
              <Text style={styles.footerTextLine}>create big paths</Text>
            </View>
            <View style={styles.footerDash} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040D21',
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(4, 18, 44, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(4, 18, 44, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.55)',
    gap: 8,
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 5,
  },
  coinText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 2,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoTextWhite: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 40,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 240, 255, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  logoTextMaze: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 40,
    color: '#00F0FF',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 240, 255, 0.95)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 16,
  },
  tagline: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: '#8FA6CC',
    marginTop: 3,
    letterSpacing: 0.6,
  },
  taglineDot: {
    color: '#00F0FF',
    fontWeight: 'bold',
  },
  heroCubeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  buttonsStack: {
    width: '100%',
    gap: 16,
    alignItems: 'center',
  },
  buttonAnimatedContainer: {
    width: '100%',
  },
  primaryButtonWrapper: {
    width: '100%',
    height: 58,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.85,
    shadowRadius: 18,
    elevation: 10,
  },
  primaryButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 26,
  },
  primaryButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  secondaryButtonWrapper: {
    width: '100%',
    height: 56,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  secondaryButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 220, 255, 0.65)',
    borderRadius: 26,
  },
  secondaryButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  btnIconLeft: {
    width: 28,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  btnIconRight: {
    width: 28,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  footerDash: {
    width: 32,
    height: 2,
    backgroundColor: '#00F0FF',
    borderRadius: 1,
    opacity: 0.65,
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  footerTextContainer: {
    alignItems: 'center',
  },
  footerTextLine: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12.5,
    color: '#7A98C2',
    letterSpacing: 0.4,
    lineHeight: 16,
  },
});
