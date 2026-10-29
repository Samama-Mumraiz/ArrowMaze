import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, G } from 'react-native-svg';

interface AntigravityHandGuideProps {
  x?: number;
  y?: number;
  direction?: 'U' | 'D' | 'L' | 'R';
  visible?: boolean;
}

export default function AntigravityHandGuide({
  x = 180,
  y = 380,
  direction = 'L',
  visible = true,
}: AntigravityHandGuideProps): React.JSX.Element | null {
  const floatY = useSharedValue(0);
  const swipeX = useSharedValue(0);
  const pulseOpacity = useSharedValue(0.85);

  useEffect(() => {
    // Gentle weightless floating oscillation (antigravity hover)
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1100, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // Subtle horizontal guiding swipe
    swipeX.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) })
      ),
      -1,
      false
    );

    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [floatY, swipeX, pulseOpacity]);

  const animatedHandStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatY.value },
      { translateX: swipeX.value },
    ],
  }));

  const animatedBeamStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  if (!visible) return null;

  return (
    <View style={[styles.container, { left: x - 90, top: y - 36 }]} pointerEvents="none">
      {/* 1. Glowing Translucent Blue Swipe Highlight Crossing the Path */}
      <Animated.View style={[styles.swipeBeamWrapper, animatedBeamStyle]}>
        <Svg width={200} height={32} viewBox="0 0 200 32" fill="none">
          <Defs>
            <LinearGradient id="beamGradient" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#3B82F6" stopOpacity="0.95" />
              <Stop offset="0.5" stopColor="#60A5FA" stopOpacity="0.8" />
              <Stop offset="1" stopColor="#93C5FD" stopOpacity="0.1" />
            </LinearGradient>
          </Defs>
          {/* Cyan/Blue Translucent Horizontal Beam */}
          <Path
            d="M8 16h184"
            stroke="url(#beamGradient)"
            strokeWidth={10}
            strokeLinecap="round"
          />
          {/* Arrow Tip on the left */}
          <Path
            d="M16 8L4 16l12 8"
            stroke="#2563EB"
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Radial Touch Bloom */}
          <Circle cx="88" cy="16" r="14" fill="#60A5FA" fillOpacity={0.35} />
        </Svg>
      </Animated.View>

      {/* 2. 3D Cartoon Hand Icon (Light Skin Tone, Royal Blue Cuff, White Sleeve) */}
      <Animated.View style={[styles.handWrapper, animatedHandStyle]}>
        <Svg width={80} height={80} viewBox="0 0 100 100">
          <G transform="rotate(-18 50 50)">
            {/* White Sleeve Underlayer */}
            <Path
              d="M62 76c2 1 12 7 14 14l-14 10-16-12c4-6 10-10 16-12z"
              fill="#F8FAFC"
              stroke="#E2E8F0"
              strokeWidth={1.5}
            />

            {/* Royal Blue Cuff */}
            <Path
              d="M52 64c3 1 14 8 16 14l-10 7-16-11c3-5 7-9 10-10z"
              fill="#2563EB"
            />
            <Path
              d="M53 65c1 1 12 7 13 12l-6 5-14-10c2-3 5-6 7-7z"
              fill="#3B82F6"
            />

            {/* Hand Palm & Knuckles (Warm Light Skin Tone with 3D Shading) */}
            <Path
              d="M40 42c6-3 16 4 20 10 4 6 2 15-4 18-5 3-14-1-18-6-4-5-3-18 2-22z"
              fill="#F6C39E"
            />
            {/* Palm Shadow */}
            <Path
              d="M45 56c5 3 11 6 15 2 2-2 3-6 1-9-4-5-12-8-16-4 0 3-1 8 0 11z"
              fill="#EDAD80"
            />

            {/* Curled Fingers */}
            <Path
              d="M48 48c4 0 7 3 7 7s-3 6-7 6"
              stroke="#EDAD80"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <Path
              d="M54 53c3 1 5 4 4 7s-3 5-6 5"
              stroke="#EDAD80"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <Path
              d="M58 59c2 1 4 3 3 6s-2 5-5 5"
              stroke="#EDAD80"
              strokeWidth={2.8}
              strokeLinecap="round"
            />

            {/* Extended Index Pointing Finger (Leading touch onto the arrow) */}
            <Path
              d="M32 20c3-5 8-3 10 1l7 18c1 3-1 6-4 7s-6-1-7-4l-7-18c-1-2-1-3 1-4z"
              fill="#FED3B4"
            />
            {/* Fingertip Highlight */}
            <Circle cx="35" cy="22" r="3" fill="#FFF2E8" />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 220,
    height: 100,
    zIndex: 90,
  },
  swipeBeamWrapper: {
    position: 'absolute',
    top: 8,
    left: 0,
  },
  handWrapper: {
    position: 'absolute',
    top: 4,
    left: 48,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
  },
});
