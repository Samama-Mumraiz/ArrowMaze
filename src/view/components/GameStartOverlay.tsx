import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
  Path,
  G,
  Polygon,
} from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GameStartOverlayProps {
  visible: boolean;
  levelNumber?: number;
  difficulty?: string;
  strandCount?: number;
  onStart: () => void;
}

export default function GameStartOverlay({
  visible,
  levelNumber = 1,
  difficulty = 'Hard',
  strandCount,
  onStart,
}: GameStartOverlayProps): React.JSX.Element | null {
  // Reanimated shared values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);
  const floatY = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const shadowScale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.quad) });
      scale.value = withTiming(1, { duration: 320, easing: Easing.out(Easing.back(1.5)) });

      // Floating 3D isometric block animation
      floatY.value = withRepeat(
        withSequence(
          withTiming(-12, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
          withTiming(10, { duration: 1500, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );

      // Expanding/contracting ground shadow under the floating block
      shadowScale.value = withRepeat(
        withSequence(
          withTiming(0.85, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
          withTiming(1.15, { duration: 1500, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );

      // Pulsing CTA button animation
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      opacity.value = 0;
      scale.value = 0.92;
    }
  }, [visible, opacity, scale, floatY, shadowScale, pulseScale]);

  const handleStartPress = () => {
    opacity.value = withTiming(0, { duration: 200, easing: Easing.in(Easing.quad) }, (finished) => {
      if (finished) {
        runOnJS(onStart)();
      }
    });
    scale.value = withTiming(0.95, { duration: 200 });
  };

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const animatedFloatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const animatedShadowStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: shadowScale.value }, { scaleY: shadowScale.value }],
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[styles.container, animatedBackdropStyle]}>
        {/* Full-Screen Dark Gradient Background */}
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="overlayBgGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#030816" />
              <Stop offset="0.3" stopColor="#081329" />
              <Stop offset="0.7" stopColor="#0B1A38" />
              <Stop offset="1" stopColor="#040914" />
            </LinearGradient>
            <RadialGradient id="overlayCenterGlow" cx="50%" cy="48%" r="48%">
              <Stop offset="0" stopColor="#38BDF8" stopOpacity={0.25} />
              <Stop offset="0.6" stopColor="#1E3A8A" stopOpacity={0.12} />
              <Stop offset="1" stopColor="#030816" stopOpacity={0} />
            </RadialGradient>
            <LinearGradient id="blockTopGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#334155" />
              <Stop offset="1" stopColor="#1E293B" />
            </LinearGradient>
            <LinearGradient id="blockLeftGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#1E293B" />
              <Stop offset="1" stopColor="#0F172A" />
            </LinearGradient>
            <LinearGradient id="blockRightGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#0F172A" />
              <Stop offset="1" stopColor="#080F1E" />
            </LinearGradient>
            <LinearGradient id="btnGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#2563EB" />
              <Stop offset="0.5" stopColor="#38BDF8" />
              <Stop offset="1" stopColor="#0284C7" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#overlayBgGrad)" />
          <Circle cx="50%" cy="48%" r={SCREEN_WIDTH * 0.55} fill="url(#overlayCenterGlow)" />

          {/* Subtle Ambient Background Stars / Grid Dots */}
          <Circle cx={SCREEN_WIDTH * 0.15} cy={SCREEN_HEIGHT * 0.18} r={1.5} fill="#38BDF8" opacity={0.6} />
          <Circle cx={SCREEN_WIDTH * 0.85} cy={SCREEN_HEIGHT * 0.22} r={2} fill="#38BDF8" opacity={0.7} />
          <Circle cx={SCREEN_WIDTH * 0.12} cy={SCREEN_HEIGHT * 0.75} r={1.8} fill="#38BDF8" opacity={0.5} />
          <Circle cx={SCREEN_WIDTH * 0.88} cy={SCREEN_HEIGHT * 0.7} r={1.5} fill="#38BDF8" opacity={0.6} />
          <Circle cx={SCREEN_WIDTH * 0.25} cy={SCREEN_HEIGHT * 0.85} r={2} fill="#38BDF8" opacity={0.4} />
        </Svg>

        <Animated.View style={[styles.contentCard, animatedContentStyle]}>
          {/* 1. Large "ArrowMaze" Text Logo at the Top */}
          <View style={styles.topLogoContainer}>
            <View style={styles.logoRow}>
              <Text style={styles.logoTextArrow}>Arrow</Text>
              <Text style={styles.logoTextMaze}>Maze</Text>
              {/* Neon Directional Arrow Symbol */}
              <View style={styles.logoArrowIcon}>
                <Svg width={32} height={24} viewBox="0 0 32 24" fill="none">
                  <Path
                    d="M3 12h22M17 4l8 8-8 8"
                    stroke="#38BDF8"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </View>

            {/* Subtext: THINK • MOVE • REACH */}
            <Text style={styles.subtext}>THINK • MOVE • REACH</Text>

            {/* Level Badge */}
            <View style={styles.levelBadge}>
              <View style={styles.levelBadgeDot} />
              <Text style={styles.levelBadgeText}>LEVEL {levelNumber}</Text>
              <Text style={styles.levelBadgeDiff}>• {difficulty.toUpperCase()}</Text>
            </View>
          </View>

          {/* 2. Central 3D-Style Graphic: Isometric Block with Winding Path & Flag */}
          <View style={styles.graphicSection}>
            {/* Ground Shadow */}
            <Animated.View style={[styles.shadowWrapper, animatedShadowStyle]}>
              <Svg width={200} height={50} viewBox="0 0 200 50">
                <Defs>
                  <RadialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
                    <Stop offset="0" stopColor="#000000" stopOpacity={0.65} />
                    <Stop offset="0.6" stopColor="#000000" stopOpacity={0.3} />
                    <Stop offset="1" stopColor="#000000" stopOpacity={0} />
                  </RadialGradient>
                </Defs>
                <Circle cx="100" cy="25" r="75" fill="url(#groundShadow)" />
              </Svg>
            </Animated.View>

            {/* Floating Levitation Graphic */}
            <Animated.View style={[styles.floatingBlock, animatedFloatStyle]}>
              <Svg width={240} height={220} viewBox="0 0 240 220" fill="none">
                {/* 3D Isometric Block Base */}
                {/* Left face */}
                <Polygon
                  points="20,100 120,155 120,205 20,150"
                  fill="url(#blockLeftGrad)"
                  stroke="#334155"
                  strokeWidth={1.5}
                />
                {/* Right face */}
                <Polygon
                  points="120,155 220,100 220,150 120,205"
                  fill="url(#blockRightGrad)"
                  stroke="#1E293B"
                  strokeWidth={1.5}
                />
                {/* Top isometric diamond surface */}
                <Polygon
                  points="120,45 220,100 120,155 20,100"
                  fill="url(#blockTopGrad)"
                  stroke="#475569"
                  strokeWidth={2}
                />

                {/* Subtle Grid Lines on Top Surface */}
                <Path
                  d="M70,72.5 L170,127.5 M45,86.25 L145,141.25 M170,72.5 L70,127.5 M195,86.25 L95,141.25"
                  stroke="rgba(56, 189, 248, 0.18)"
                  strokeWidth={1}
                />

                {/* Winding 90-Degree Neon Cyan Arrow Path */}
                <Path
                  d="M60,110 L100,88 L100,115 L150,88 L150,112 L185,93"
                  stroke="#38BDF8"
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Arrowhead at the end of the path */}
                <Polygon
                  points="185,93 174,87 178,98"
                  fill="#38BDF8"
                />

                {/* Cheerful Yellow Mascot/Player Dot on the path */}
                <Circle cx="60" cy="110" r="10" fill="#FACC15" stroke="#CA8A04" strokeWidth={1.5} />
                <Circle cx="57" cy="108" r="1.5" fill="#0F172A" />
                <Circle cx="63" cy="108" r="1.5" fill="#0F172A" />
                <Path d="M57,112 Q60,115 63,112" stroke="#0F172A" strokeWidth={1.2} fill="none" />

                {/* Red Destination Flag at Goal Corner */}
                {/* Flag pole */}
                <Path d="M190,92 L190,50" stroke="#F1F5F9" strokeWidth={2.5} strokeLinecap="round" />
                <Circle cx="190" cy="49" r="3" fill="#FACC15" />
                {/* Red Flag pennant */}
                <Polygon
                  points="190,52 214,61 190,70"
                  fill="#EF4444"
                  stroke="#DC2626"
                  strokeWidth={1}
                />
              </Svg>
            </Animated.View>
          </View>

          {/* 3. Subtitle / Objective hint */}
          <Text style={styles.promptText}>
            {strandCount
              ? `Untangle ${strandCount} winding paths without collision.`
              : 'Untie the labyrinth. Guide each arrow safely off the grid!'}
          </Text>

          {/* 4. Wide "TAP TO START" Button at the Bottom */}
          <Animated.View style={[styles.buttonWrapper, animatedButtonStyle]}>
            <Pressable
              onPress={handleStartPress}
              style={({ pressed }) => [
                styles.startButton,
                pressed && styles.buttonPressed,
              ]}
              accessibilityLabel="Tap to Start"
            >
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M5 3l14 9-14 9V3z"
                  fill="#FFFFFF"
                />
              </Svg>
              <Text style={styles.startButtonText}>TAP TO START</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  contentCard: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 48,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topLogoContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  logoTextArrow: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  logoTextMaze: {
    fontSize: 40,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 1.5,
  },
  logoArrowIcon: {
    marginLeft: 6,
    justifyContent: 'center',
  },
  subtext: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 4,
    color: '#7DD3FC',
    marginTop: 6,
    textTransform: 'uppercase',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: 'rgba(56, 189, 248, 0.35)',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 16,
    marginTop: 14,
    gap: 6,
  },
  levelBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#38BDF8',
  },
  levelBadgeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  levelBadgeDiff: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  graphicSection: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 240,
    width: '100%',
  },
  shadowWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 360,
  },
  startButton: {
    width: '100%',
    height: 60,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#60A5FA',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});
