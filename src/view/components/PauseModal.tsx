import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { colors } from '../../theme/colors';

interface PauseModalProps {
  visible: boolean;
  levelNumber?: number;
  remainingStrands?: number;
  onResume: () => void;
  onRestart: () => void;
  onLevelSelect: () => void;
  onHome: () => void;
}

export default function PauseModal({
  visible,
  onResume,
  onRestart,
  onLevelSelect,
  onHome,
}: PauseModalProps): React.JSX.Element | null {
  const scale = useSharedValue(0.88);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSequence(
        withTiming(1.03, { duration: 200, easing: Easing.out(Easing.back(1.5)) }),
        withTiming(1.0, { duration: 100 })
      );
      opacity.value = withTiming(1, { duration: 180 });
    } else {
      scale.value = 0.88;
      opacity.value = 0;
    }
  }, [visible, scale, opacity]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <View style={styles.backdrop} pointerEvents="auto">
      {/* Glassmorphism Blur Backdrop */}
      <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />

      <Animated.View style={[styles.modalCard, animatedCardStyle]}>
        {/* Close 'X' Button on Top Right (Screen 5 Reference) */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onResume}
          style={styles.closeButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Close"
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 6L6 18M6 6l12 12"
              stroke="#7E99C2"
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          </Svg>
        </TouchableOpacity>

        {/* Top: Pause Icon || */}
        <View style={styles.pauseIconWrapper}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Rect x="6" y="4" width="4" height="16" rx="1.5" fill="#00F0FF" />
            <Rect x="14" y="4" width="4" height="16" rx="1.5" fill="#00F0FF" />
          </Svg>
        </View>

        {/* Title: "Paused" */}
        <Text style={styles.modalTitle}>Paused</Text>

        {/* Vertical Stack of Gradient & Dark Buttons (Screen 5 Reference) */}
        <View style={styles.buttonList}>
          {/* 1. RESUME BUTTON (Electric Blue Gradient Fill) */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={onResume}
            style={styles.primaryButtonWrapper}
            accessibilityLabel="Resume Game"
          >
            <LinearGradient
              colors={[colors.primaryA, colors.primaryB]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButtonGradient}
            >
              <View style={styles.buttonIconLeft}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="#FFFFFF">
                  <Path d="M8 5v14l11-7z" />
                </Svg>
              </View>
              <Text style={styles.primaryButtonText}>Resume</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* 2. RESTART BUTTON (Dark Panel) */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onRestart}
            style={styles.secondaryButton}
            accessibilityLabel="Restart Level"
          >
            <View style={styles.buttonIconLeft}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M1 4v6h6M23 20v-6h-6"
                  stroke="#00F0FF"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"
                  stroke="#00F0FF"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.secondaryButtonText}>Restart</Text>
          </TouchableOpacity>

          {/* 3. LEVELS BUTTON (Dark Panel) */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onLevelSelect}
            style={styles.secondaryButton}
            accessibilityLabel="Levels"
          >
            <View style={styles.buttonIconLeft}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Rect x="3" y="3" width="7" height="7" rx="1.5" fill="#00F0FF" />
                <Rect x="14" y="3" width="7" height="7" rx="1.5" fill="#00F0FF" />
                <Rect x="3" y="14" width="7" height="7" rx="1.5" fill="#00F0FF" />
                <Rect x="14" y="14" width="7" height="7" rx="1.5" fill="#00F0FF" />
              </Svg>
            </View>
            <Text style={styles.secondaryButtonText}>Levels</Text>
          </TouchableOpacity>

          {/* 4. HOME BUTTON (Dark Panel) */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onHome}
            style={styles.secondaryButton}
            accessibilityLabel="Home"
          >
            <View style={styles.buttonIconLeft}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  stroke="#00F0FF"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M9 22V12h6v10"
                  stroke="#00F0FF"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.secondaryButtonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(4, 13, 33, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    paddingHorizontal: 28,
  },
  modalCard: {
    width: '100%',
    maxWidth: 310,
    borderRadius: 18,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 22,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  pauseIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontFamily: 'Sora_800ExtraBold',
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  buttonList: {
    width: '100%',
    gap: 11,
  },
  primaryButtonWrapper: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    shadowColor: colors.primaryA,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    position: 'relative',
  },
  buttonIconLeft: {
    position: 'absolute',
    left: 20,
  },
  primaryButtonText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  secondaryButton: {
    width: '100%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.buttonSecondaryBorder,
    position: 'relative',
  },
  secondaryButtonText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 15.5,
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
});
