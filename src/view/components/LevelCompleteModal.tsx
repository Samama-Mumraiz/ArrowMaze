import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Polygon, Circle, Rect } from 'react-native-svg';
import { colors } from '../../theme/colors';

interface LevelCompleteModalProps {
  levelNumber: number;
  lives?: number;
  difficulty?: string;
  strandsCleared?: number;
  movesCount?: number;
  timeElapsed?: string;
  onNextLevel: () => void;
  onHome?: () => void;
  onReplay?: () => void;
  onLevelSelect?: () => void;
}

export default function LevelCompleteModal({
  levelNumber,
  lives = 3,
  strandsCleared = 12,
  movesCount = 12,
  timeElapsed = '02:38',
  onNextLevel,
  onHome,
}: LevelCompleteModalProps): React.JSX.Element {
  const cardScale = useSharedValue(0.8);
  const cardOpacity = useSharedValue(0);
  const star1Scale = useSharedValue(0);
  const star2Scale = useSharedValue(0);
  const star3Scale = useSharedValue(0);

  useEffect(() => {
    // 1. Modal pop-in
    cardScale.value = withSequence(
      withTiming(1.04, { duration: 220, easing: Easing.out(Easing.back(1.8)) }),
      withTiming(1.0, { duration: 120 })
    );
    cardOpacity.value = withTiming(1, { duration: 200 });

    // 2. Staggered 3-star pop-in
    star1Scale.value = withDelay(
      150,
      withSequence(
        withTiming(1.25, { duration: 220, easing: Easing.out(Easing.back(2)) }),
        withTiming(1.0, { duration: 100 })
      )
    );
    star2Scale.value = withDelay(
      280,
      withSequence(
        withTiming(1.35, { duration: 240, easing: Easing.out(Easing.back(2.2)) }),
        withTiming(1.0, { duration: 100 })
      )
    );
    star3Scale.value = withDelay(
      420,
      withSequence(
        withTiming(1.25, { duration: 220, easing: Easing.out(Easing.back(2)) }),
        withTiming(1.0, { duration: 100 })
      )
    );
  }, [cardScale, cardOpacity, star1Scale, star2Scale, star3Scale]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const animatedStar1Style = useAnimatedStyle(() => ({
    transform: [{ scale: star1Scale.value }],
  }));

  const animatedStar2Style = useAnimatedStyle(() => ({
    transform: [{ scale: star2Scale.value }],
  }));

  const animatedStar3Style = useAnimatedStyle(() => ({
    transform: [{ scale: star3Scale.value }],
  }));

  return (
    <View style={styles.backdrop} pointerEvents="auto">
      {/* Glassmorphism Blur Backdrop */}
      <BlurView intensity={26} tint="dark" style={StyleSheet.absoluteFill} />

      <Animated.View style={[styles.modalCard, animatedCardStyle]}>
        {/* 1. TOP 3-STAR GLOWING ANIMATION & CONFETTI (Screen 6 Reference) */}
        <View style={styles.starsWrapper}>
          {/* Confetti Sparks Background */}
          <View style={styles.confettiContainer} pointerEvents="none">
            <Svg width={200} height={90} viewBox="0 0 200 90" fill="none">
              {/* Cyan, Pink, Gold celebratory sparks */}
              <Rect x="20" y="25" width="4" height="8" rx="2" fill="#00F0FF" transform="rotate(25 20 25)" />
              <Rect x="175" y="30" width="4" height="8" rx="2" fill="#FF2A85" transform="rotate(-30 175 30)" />
              <Circle cx="35" cy="55" r="2.5" fill="#FFD700" />
              <Circle cx="165" cy="65" r="3" fill="#00F0FF" />
              <Rect x="45" y="15" width="3" height="7" rx="1.5" fill="#FFD700" transform="rotate(45 45 15)" />
              <Rect x="150" y="18" width="3" height="7" rx="1.5" fill="#00E5FF" transform="rotate(-20 150 18)" />
            </Svg>
          </View>

          {/* Star 1 (Left) */}
          <Animated.View style={[styles.starSide, animatedStar1Style]}>
            <Text style={styles.starTextSide}>★</Text>
          </Animated.View>

          {/* Star 2 (Center - Prominent Large) */}
          <Animated.View style={[styles.starCenter, animatedStar2Style]}>
            <Text style={styles.starTextCenter}>★</Text>
          </Animated.View>

          {/* Star 3 (Right) */}
          <Animated.View style={[styles.starSide, animatedStar3Style]}>
            <Text style={styles.starTextSide}>★</Text>
          </Animated.View>
        </View>

        {/* 2. TITLE & SUBTITLE */}
        <Text style={styles.modalTitle}>Level Complete!</Text>
        <Text style={styles.modalSubtitle}>Great job! You solved the maze.</Text>

        {/* 3. STATS PANEL: Dark Inner Card with Time and Moves (Screen 6 Reference) */}
        <View style={styles.statsCard}>
          {/* Left Stat: Clock Icon ⏱ Time */}
          <View style={styles.statCol}>
            <View style={styles.statHeaderRow}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="9" stroke="#00F0FF" strokeWidth={2} />
                <Path d="M12 7v5l3 3" stroke="#00F0FF" strokeWidth={2} strokeLinecap="round" />
              </Svg>
              <Text style={styles.statLabel}>Time</Text>
            </View>
            <Text style={styles.statValue}>{timeElapsed}</Text>
          </View>

          {/* Vertical Divider */}
          <View style={styles.statDivider} />

          {/* Right Stat: Lightning Icon ⚡ Moves */}
          <View style={styles.statCol}>
            <View style={styles.statHeaderRow}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="#00F0FF" />
              </Svg>
              <Text style={styles.statLabel}>Moves</Text>
            </View>
            <Text style={styles.statValue}>{movesCount || strandsCleared}</Text>
          </View>
        </View>

        {/* 4. BUTTONS STACK: Next Level -> | Home (Screen 6 Reference) */}
        <View style={styles.buttonsContainer}>
          {/* Primary Button: Next Level -> (Electric Blue Gradient Fill) */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={onNextLevel}
            style={styles.primaryButtonWrapper}
            accessibilityLabel="Next Level"
          >
            <LinearGradient
              colors={[colors.primaryA, colors.primaryB]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButtonGradient}
            >
              <View style={styles.primaryButtonContent}>
                <Text style={styles.primaryButtonText}>Next Level</Text>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="#FFFFFF"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Secondary Button: HOME (Dark Panel) */}
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
    paddingHorizontal: 26,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 18,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 22,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  starsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    position: 'relative',
    height: 70,
    width: '100%',
  },
  confettiContainer: {
    position: 'absolute',
    top: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starSide: {
    marginHorizontal: 4,
    marginTop: 10,
  },
  starTextSide: {
    fontSize: 38,
    color: colors.star,
    textShadowColor: 'rgba(255, 200, 61, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  starCenter: {
    marginHorizontal: 4,
    marginBottom: 6,
  },
  starTextCenter: {
    fontSize: 52,
    color: colors.star,
    textShadowColor: 'rgba(255, 200, 61, 0.85)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 14,
  },
  modalTitle: {
    fontFamily: 'Sora_800ExtraBold',
    fontSize: 24,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  modalSubtitle: {
    fontFamily: 'Sora_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 18,
  },
  statsCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(5, 14, 36, 0.92)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 12,
    color: colors.textSecondary,
  },
  statValue: {
    fontFamily: 'Sora_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(46, 123, 255, 0.25)',
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButtonWrapper: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    shadowColor: colors.primaryA,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: 0.5,
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
  buttonIconLeft: {
    position: 'absolute',
    left: 20,
  },
  secondaryButtonText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
});
