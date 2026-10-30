import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { typography } from '../../theme/typography';

export interface GameplayBottomBarProps {
  hintsRemaining?: number;
  onHint: () => void;
  onBack?: () => void;
  disabled?: boolean;
}

export default function GameplayBottomBar({
  hintsRemaining = 3,
  onHint,
  onBack,
  disabled = false,
}: GameplayBottomBarProps): React.JSX.Element {
  // Hint button spring scale animation
  const hintScale = useSharedValue(1);
  const animatedHintStyle = useAnimatedStyle(() => ({
    transform: [{ scale: hintScale.value }],
  }));

  const handleHintPressIn = () => {
    hintScale.value = withTiming(0.9, { duration: 80, easing: Easing.out(Easing.ease) });
  };

  const handleHintPressOut = () => {
    hintScale.value = withSpring(1, { damping: 12, stiffness: 240 });
  };

  const handleHintPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // platform fallback
    }
    onHint();
  };

  // Back button spring scale animation
  const backScale = useSharedValue(1);
  const animatedBackStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));

  const handleBackPressIn = () => {
    backScale.value = withTiming(0.9, { duration: 80, easing: Easing.out(Easing.ease) });
  };

  const handleBackPressOut = () => {
    backScale.value = withSpring(1, { damping: 12, stiffness: 240 });
  };

  const handleBackPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // platform fallback
    }
    onBack?.();
  };

  return (
    <View style={styles.container}>
      {/* ============================================================== */}
      {/* 1. BOTTOM-LEFT: Chunky Circular Pink-Brownish '<' Back Button  */}
      {/* ============================================================== */}
      <View style={styles.leftSlot}>
        <Animated.View style={animatedBackStyle}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPressIn={handleBackPressIn}
            onPressOut={handleBackPressOut}
            onPress={handleBackPress}
            style={styles.backButtonBase}
            accessibilityLabel="Go Back"
          >
            {/* Dark 3D Bottom Shadow Bevel */}
            <View style={styles.backButtonBevel} />

            {/* Coral/Pink-Brown Front Face */}
            <LinearGradient
              colors={['#FB7185', '#E11D48', '#9F1239']}
              start={{ x: 0.3, y: 0 }}
              end={{ x: 0.7, y: 1 }}
              style={styles.backButtonFace}
            >
              {/* Top Gloss Arc */}
              <View style={styles.backButtonGloss} />

              {/* Left Chevron Icon (<) */}
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M15 19L8 12L15 5"
                  stroke="#FFFFFF"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* ============================================================== */}
      {/* 2. BOTTOM-CENTER: Large Glossy 3D Blue "Hint" Button           */}
      {/* ============================================================== */}
      <View style={styles.centerSlot}>
        <Animated.View style={animatedHintStyle}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={handleHintPressIn}
            onPressOut={handleHintPressOut}
            onPress={handleHintPress}
            disabled={disabled || hintsRemaining <= 0}
            style={styles.hintButtonBase}
            accessibilityLabel="Hint"
          >
            {/* 3D Dark Blue Under-Bevel */}
            <View style={styles.hintButtonBevel} />

            {/* Glossy Sky-Blue to Deep-Blue Gradient Face */}
            <LinearGradient
              colors={['#38BDF8', '#0284C7', '#0369A1']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.hintButtonFace}
            >
              {/* Top Gloss Reflection Highlight */}
              <View style={styles.hintButtonGloss} />

              {/* White Lightbulb Icon */}
              <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
                {/* Bulb Base */}
                <Path
                  d="M12 25h8M13 28h6"
                  stroke="#FFFFFF"
                  strokeWidth={2.8}
                  strokeLinecap="round"
                />
                {/* Bulb Body */}
                <Path
                  d="M16 4C10.5 4 6 8.5 6 14c0 3.2 1.6 5.8 3.5 8 .8 1 1.5 2 1.5 3h10c0-1 .7-2 1.5-3 1.9-2.2 3.5-4.8 3.5-8 0-5.5-4.5-10-10-10z"
                  fill="#FFFFFF"
                />
                {/* Inner Bulb Core Filament Glow */}
                <Path
                  d="M14 14a2 2 0 014 0"
                  stroke="#BAE6FD"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </Svg>
            </LinearGradient>

            {/* Notification Badge with Active Hint Count (Top-Right of Button) */}
            <View style={styles.hintBadgePill}>
              <Text style={styles.hintBadgeNumber}>{hintsRemaining}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Labeled "Hint" in bold rounded text with blue outline */}
        <Text style={styles.hintButtonLabel}>Hint</Text>
      </View>

      {/* Right Dummy Slot for symmetrical balance */}
      <View style={styles.rightSlot} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  leftSlot: {
    width: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSlot: {
    width: 60,
  },

  /* ---------------------------------------------------------------------- */
  /* PINK-BROWN '<' BACK BUTTON                                             */
  /* ---------------------------------------------------------------------- */
  backButtonBase: {
    width: 58,
    height: 58,
    borderRadius: 29,
    shadowColor: '#9F1239',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 16,
  },
  backButtonBevel: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#4C1D24',
  },
  backButtonFace: {
    width: 58,
    height: 54,
    borderRadius: 29,
    borderWidth: 2.4,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  backButtonGloss: {
    position: 'absolute',
    top: 2,
    left: 8,
    right: 8,
    height: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  /* ---------------------------------------------------------------------- */
  /* LARGE GLOSSY 3D BLUE HINT BUTTON                                       */
  /* ---------------------------------------------------------------------- */
  hintButtonBase: {
    width: 70,
    height: 70,
    borderRadius: 35,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  hintButtonBevel: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#034E8C',
  },
  hintButtonFace: {
    width: 70,
    height: 66,
    borderRadius: 35,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  hintButtonGloss: {
    position: 'absolute',
    top: 3,
    left: 10,
    right: 10,
    height: 18,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  hintBadgePill: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0284C7',
    borderWidth: 1.8,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  hintBadgeNumber: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 12,
    color: '#FFFFFF',
    lineHeight: 14,
  },
  hintButtonLabel: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 4,
    letterSpacing: 0.5,
    textShadowColor: '#0284C7',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
