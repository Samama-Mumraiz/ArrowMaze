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
  Easing,
} from 'react-native-reanimated';
import MaskedView from '@react-native-masked-view/masked-view';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { usePlayer } from '../store/PlayerContext';
import NeonIsometricCube from '../view/components/NeonIsometricCube';

const MaskedViewComponent = MaskedView as unknown as React.ComponentType<any>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
      {/* 1. Deep Midnight Navy Background Gradient */}
      <LinearGradient
        colors={['#020617', '#061332', '#030A1C']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* 2. Cybernetic Diagonal Chevron/Maze Pattern & Neon Laser Flares */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            {/* Repeating 45-degree chevron maze corridor pattern */}
            <Pattern id="neonMazePattern" width="56" height="56" patternUnits="userSpaceOnUse">
              <Path
                d="M 0 28 L 28 0 L 56 28 L 28 56 Z"
                stroke="rgba(0, 190, 255, 0.07)"
                strokeWidth="1.2"
                fill="none"
              />
              <Path
                d="M 14 14 L 28 28 L 42 14 M 14 42 L 28 28 L 42 42"
                stroke="rgba(0, 160, 255, 0.04)"
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

            {/* Ambient background glow behind hero */}
            <SvgRadialGradient id="centerHeroAura" cx="50%" cy="40%" r="50%">
              <Stop offset="0%" stopColor="#007BFF" stopOpacity="0.22" />
              <Stop offset="40%" stopColor="#00D2FF" stopOpacity="0.08" />
              <Stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </SvgRadialGradient>
          </Defs>

          {/* Maze Pattern Fill */}
          <Rect width="100%" height="100%" fill="url(#neonMazePattern)" />

          {/* Central Blue Aura Glow */}
          <Rect width="100%" height="100%" fill="url(#centerHeroAura)" />

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
          <Line x1="-20" y1="480" x2="100" y2="410" stroke="url(#streakGlow)" strokeWidth="1.8" />
        </Svg>
      </View>

      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.contentContainer}>
          {/* ============================================================== */}
          {/* TOP HUD: Settings Gear (Left) | Gold Star Coin Pill (Right)   */}
          {/* ============================================================== */}
          <View style={styles.topBar}>
            {/* Circular Settings Gear Button */}
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

            {/* Gold Star Coin Balance Pill */}
            <View style={styles.coinPill}>
              <Svg width={24} height={24} viewBox="0 0 28 28" fill="none">
                <Defs>
                  <SvgLinearGradient id="goldCoinGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#FFE066" />
                    <Stop offset="0.5" stopColor="#FFB800" />
                    <Stop offset="1" stopColor="#E68A00" />
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
              <MaskedViewComponent
                maskElement={
                  <Text style={styles.logoTextMazeMask}>Maze</Text>
                }
              >
                <LinearGradient
                  colors={['#00F0FF', '#007BFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.logoTextMazePlaceholder}>Maze</Text>
                </LinearGradient>
              </MaskedViewComponent>
            </View>
            <Text style={styles.tagline}>
              Your Logic <Text style={styles.taglineDot}>•</Text> Your Path
            </Text>
          </View>

          {/* ============================================================== */}
          {/* CENTER HERO: 3D Isometric Neon Cube on Glowing Platform        */}
          {/* ============================================================== */}
          <Animated.View style={[styles.heroCubeContainer, animatedCubeStyle]}>
            <NeonIsometricCube size={225} showPedestal={true} />
          </Animated.View>

          {/* ============================================================== */}
          {/* GLOSSY GRADIENT BUTTONS: Play, Levels, Settings               */}
          {/* ============================================================== */}
          <View style={styles.buttonsStack}>
            {/* 1. PLAY BUTTON (Vibrant Glossy Cyan-to-Blue Linear Gradient) */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handlePlayPress}
              style={styles.primaryButtonWrapper}
              accessibilityLabel="Play Game"
            >
              <LinearGradient
                colors={['#00D2FF', '#0084FF', '#004FD6']}
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

            {/* 2. LEVELS BUTTON (Glossy Metallic Dark Blue with Cyan Border) */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleLevelsPress}
              style={styles.secondaryButtonWrapper}
              accessibilityLabel="Select Level"
            >
              <LinearGradient
                colors={['#0C2556', '#081A40', '#040D24']}
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

            {/* 3. SETTINGS BUTTON (Glossy Metallic Dark Blue with Cyan Border) */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSettingsPress}
              style={styles.secondaryButtonWrapper}
              accessibilityLabel="Settings"
            >
              <LinearGradient
                colors={['#0C2556', '#081A40', '#040D24']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.secondaryButtonGradient}
              >
                <View style={styles.btnIconLeft}>
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Circle cx="12" cy="12" r="3" stroke="#FFFFFF" strokeWidth={2} />
                    <Path
                      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
                      stroke="#FFFFFF"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
                <Text style={styles.secondaryButtonText}>Settings</Text>
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
    backgroundColor: '#020617',
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
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
    backgroundColor: 'rgba(8, 23, 56, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 23, 56, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.45)',
    gap: 8,
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
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
    fontSize: 38,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 240, 255, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  logoTextMazeMask: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 38,
    color: '#000000',
    letterSpacing: -0.5,
  },
  logoTextMazePlaceholder: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 38,
    color: 'transparent',
    letterSpacing: -0.5,
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
    gap: 13,
    alignItems: 'center',
  },
  primaryButtonWrapper: {
    width: '100%',
    height: 58,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
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
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  secondaryButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 200, 255, 0.55)',
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
