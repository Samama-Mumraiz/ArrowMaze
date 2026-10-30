import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient as SvgRadialGradient,
  Stop,
  Polygon,
  Path,
  Rect,
  Circle,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { typography } from '../../theme/typography';

export interface FloatingHUDProps {
  levelNumber?: number;
  lives?: number;
  maxLives?: number;
  stars?: number;
  onPause?: () => void;
  disabled?: boolean;
}

export default function FloatingHUD({
  levelNumber = 7,
  lives = 3,
  stars = 3,
  onPause,
  disabled = false,
}: FloatingHUDProps): React.JSX.Element {
  // Number of active gold stars (1 to 3)
  const earnedStars = Math.max(1, Math.min(3, stars || lives));

  // Pause button scale micro-interaction
  const pauseScale = useSharedValue(1);

  const animatedPauseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pauseScale.value }],
  }));

  const handlePausePressIn = () => {
    pauseScale.value = withTiming(0.9, { duration: 80, easing: Easing.out(Easing.ease) });
  };

  const handlePausePressOut = () => {
    pauseScale.value = withSpring(1, { damping: 12, stiffness: 240 });
  };

  const handlePausePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // platform fallback
    }
    onPause?.();
  };

  return (
    <View style={styles.container}>
      {/* ============================================================== */}
      {/* 1. TOP-LEFT: Bubbly Glossy Golden-Yellow "Level X" Badge       */}
      {/* (NO settings/gear icon anywhere on this side)                  */}
      {/* ============================================================== */}
      <View style={styles.levelBadgeWrapper}>
        {/* 3D Dark Orange Bottom Shadow Base */}
        <View style={styles.levelBadgeBevel} />

        {/* Bubbly Golden-Yellow Gradient Front Face */}
        <LinearGradient
          colors={['#FFF176', '#FFB300', '#F57C00']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.levelBadgeFace}
        >
          {/* Top Gloss Reflection Arc */}
          <View style={styles.levelBadgeGloss} />

          {/* Level Text */}
          <Text style={styles.levelBadgeText}>Level {levelNumber}</Text>
        </LinearGradient>
      </View>

      {/* ============================================================== */}
      {/* 2. TOP-CENTER: Three Playful Cartoon 3D Gold Stars             */}
      {/* ============================================================== */}
      <View style={styles.starsCenterRow}>
        {[1, 2, 3].map((starIdx) => {
          const isActive = starIdx <= earnedStars;
          return (
            <View
              key={`hud-star-${starIdx}`}
              style={[styles.starItem, starIdx === 2 && styles.starCenterBump]}
            >
              <Svg width={30} height={30} viewBox="0 0 32 32" fill="none">
                <Defs>
                  <SvgLinearGradient id={`starGold-${starIdx}`} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#FFF59D" />
                    <Stop offset="40%" stopColor="#FFCA28" />
                    <Stop offset="100%" stopColor="#FFA000" />
                  </SvgLinearGradient>
                  <SvgLinearGradient id={`starDark-${starIdx}`} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#64748B" />
                    <Stop offset="100%" stopColor="#334155" />
                  </SvgLinearGradient>
                </Defs>

                {/* 3D Shadow Star Base */}
                <Polygon
                  points="16,3 19.8,11.2 28.5,12.5 22.2,18.8 23.7,27.5 16,23.3 8.3,27.5 9.8,18.8 3.5,12.5 12.2,11.2"
                  fill={isActive ? '#B45309' : '#1E293B'}
                  transform="translate(0, 2)"
                />

                {/* Front Face Star */}
                <Polygon
                  points="16,3 19.8,11.2 28.5,12.5 22.2,18.8 23.7,27.5 16,23.3 8.3,27.5 9.8,18.8 3.5,12.5 12.2,11.2"
                  fill={isActive ? `url(#starGold-${starIdx})` : `url(#starDark-${starIdx})`}
                  stroke={isActive ? '#FEF08A' : '#475569'}
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />

                {/* Specular White Glint on Top Peak */}
                {isActive && (
                  <Circle cx="16" cy="7" r="1.8" fill="#FFFFFF" opacity={0.85} />
                )}
              </Svg>
            </View>
          );
        })}
      </View>

      {/* ============================================================== */}
      {/* 3. TOP-RIGHT: Rounded Glossy 3D Blue Pause Button ("||")       */}
      {/* ============================================================== */}
      <Animated.View style={animatedPauseStyle}>
        <TouchableOpacity
          activeOpacity={0.88}
          onPressIn={handlePausePressIn}
          onPressOut={handlePausePressOut}
          onPress={handlePausePress}
          disabled={disabled}
          style={styles.pauseButtonBase}
          accessibilityLabel="Pause Game"
        >
          {/* Dark 3D Bottom Bevel */}
          <View style={styles.pauseButtonBevel} />

          {/* Glossy Blue Front Face */}
          <LinearGradient
            colors={['#38BDF8', '#0284C7', '#0369A1']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.pauseButtonFace}
          >
            {/* Top Gloss Arc */}
            <View style={styles.pauseButtonGloss} />

            {/* Two White Vertical Pause Bars (||) */}
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Rect x="6" y="4" width="4" height="16" rx="2" fill="#FFFFFF" />
              <Rect x="14" y="4" width="4" height="16" rx="2" fill="#FFFFFF" />
            </Svg>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
    zIndex: 30,
  },

  /* ---------------------------------------------------------------------- */
  /* LEVEL BADGE (TOP-LEFT)                                                 */
  /* ---------------------------------------------------------------------- */
  levelBadgeWrapper: {
    minWidth: 124,
    height: 48,
    borderRadius: 24,
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  levelBadgeBevel: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#B45309',
  },
  levelBadgeFace: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FEF08A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  levelBadgeGloss: {
    position: 'absolute',
    top: 2,
    left: 10,
    right: 10,
    height: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  levelBadgeText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 21,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: '#B45309',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },

  /* ---------------------------------------------------------------------- */
  /* CARTOON 3D STARS (TOP-CENTER)                                          */
  /* ---------------------------------------------------------------------- */
  starsCenterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  starItem: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starCenterBump: {
    marginTop: -4,
  },

  /* ---------------------------------------------------------------------- */
  /* PAUSE BUTTON (TOP-RIGHT)                                               */
  /* ---------------------------------------------------------------------- */
  pauseButtonBase: {
    width: 48,
    height: 48,
    borderRadius: 24,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 6,
    elevation: 6,
  },
  pauseButtonBevel: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#034E8C',
  },
  pauseButtonFace: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pauseButtonGloss: {
    position: 'absolute',
    top: 2,
    left: 6,
    right: 6,
    height: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
});
