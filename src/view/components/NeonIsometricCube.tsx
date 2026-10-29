import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Path,
  Polygon,
  Ellipse,
  G,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface NeonIsometricCubeProps {
  size?: number;
  showPedestal?: boolean;
}

export default function NeonIsometricCube({
  size = 220,
  showPedestal = true,
}: NeonIsometricCubeProps): React.JSX.Element {
  const floatY = useSharedValue(0);
  const glowPulse = useSharedValue(0.8);

  useEffect(() => {
    // 1. Weightless gentle levitation of the 3D cube
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(4, { duration: 1800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // 2. Rhythmic neon aura pulsation
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.65, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [floatY, glowPulse]);

  const animatedCubeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const animatedFloorAura = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - floatY.value * 0.02 }],
    opacity: 0.85 + floatY.value * 0.02,
  }));

  return (
    <View style={[styles.container, { width: size, height: size * 1.1 }]}>
      {/* 1. Anchored Glowing Platform & Floor Light Pool */}
      {showPedestal && (
        <Animated.View style={[StyleSheet.absoluteFill, animatedFloorAura]}>
          <Svg width="100%" height="100%" viewBox="0 0 340 340" fill="none">
            <Defs>
              {/* Radial Floor Ambient Glow */}
              <RadialGradient id="platformFloorAura" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#00F0FF" stopOpacity="0.55" />
                <Stop offset="45%" stopColor="#007BFF" stopOpacity="0.25" />
                <Stop offset="80%" stopColor="#040D21" stopOpacity="0.08" />
                <Stop offset="100%" stopColor="#040D21" stopOpacity="0" />
              </RadialGradient>

              {/* Stepped Platform Top Surface Gradient */}
              <LinearGradient id="platformSurfaceGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#0B2A63" />
                <Stop offset="0.5" stopColor="#07193F" />
                <Stop offset="1" stopColor="#030C20" />
              </LinearGradient>

              {/* Platform Glowing Rim Gradient */}
              <LinearGradient id="platformRimGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#00D2FF" />
                <Stop offset="0.5" stopColor="#00F0FF" />
                <Stop offset="1" stopColor="#007BFF" />
              </LinearGradient>
            </Defs>

            <G>
              {/* Ambient radial floor flare pool */}
              <Ellipse cx="170" cy="265" rx="145" ry="48" fill="url(#platformFloorAura)" />

              {/* Stepped Base Layer 1: Dark Bevel Drop */}
              <Path
                d="M 55 260 L 170 218 L 285 260 L 285 275 L 170 316 L 55 275 Z"
                fill="#040F26"
                stroke="rgba(0, 240, 255, 0.35)"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />

              {/* Stepped Base Layer 2: Main Glossy Platform Top */}
              <Path
                d="M 65 255 L 170 216 L 275 255 L 170 294 Z"
                fill="url(#platformSurfaceGrad)"
                stroke="url(#platformRimGrad)"
                strokeWidth="3.2"
                strokeLinejoin="round"
              />

              {/* Inner Glowing Isometric Track on Platform */}
              <Path
                d="M 85 255 L 170 224 L 255 255 L 170 286 Z"
                stroke="#00F0FF"
                strokeWidth="1.5"
                strokeOpacity="0.75"
                fill="none"
              />

              {/* Central Intense Upward Light Core */}
              <Ellipse cx="170" cy="255" rx="48" ry="16" fill="#00F0FF" fillOpacity="0.32" />
              <Ellipse cx="170" cy="255" rx="24" ry="8" fill="#FFFFFF" fillOpacity="0.45" />
            </G>
          </Svg>
        </Animated.View>
      )}

      {/* 2. Floating 3D Isometric Neon Cube */}
      <Animated.View style={[StyleSheet.absoluteFill, animatedCubeStyle]}>
        <Svg width="100%" height="100%" viewBox="0 0 340 340" fill="none">
          <Defs>
            {/* Top Face Gradient */}
            <LinearGradient id="cubeTop" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#124090" />
              <Stop offset="0.5" stopColor="#0B2B68" />
              <Stop offset="1" stopColor="#06183D" />
            </LinearGradient>

            {/* Left Face Gradient (Deep Shadow) */}
            <LinearGradient id="cubeLeft" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#092557" />
              <Stop offset="0.6" stopColor="#041433" />
              <Stop offset="1" stopColor="#020919" />
            </LinearGradient>

            {/* Right Face Gradient (Mid Tone) */}
            <LinearGradient id="cubeRight" x1="1" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#1448A3" />
              <Stop offset="0.5" stopColor="#0C2F70" />
              <Stop offset="1" stopColor="#051636" />
            </LinearGradient>

            {/* Neon Arrowhead Gradient */}
            <LinearGradient id="arrowGrad" x1="0" y1="1" x2="1" y2="0">
              <Stop offset="0" stopColor="#007BFF" />
              <Stop offset="0.5" stopColor="#00F0FF" />
              <Stop offset="1" stopColor="#FFFFFF" />
            </LinearGradient>
          </Defs>

          {/* CUBE GEOMETRY */}
          <G>
            {/* Outer Soft Cyan Glow Silhouette */}
            <Path
              d="M 170 54 L 261 104 L 261 204 L 170 254 L 79 204 L 79 104 Z"
              fill="none"
              stroke="#00F0FF"
              strokeWidth="9"
              strokeOpacity="0.22"
              strokeLinejoin="round"
            />

            {/* TOP ISOMETRIC FACE */}
            <Polygon
              points="170,58 255,105 170,152 85,105"
              fill="url(#cubeTop)"
              stroke="#00F0FF"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />

            {/* LEFT ISOMETRIC FACE */}
            <Polygon
              points="85,105 170,152 170,246 85,199"
              fill="url(#cubeLeft)"
              stroke="#00F0FF"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />

            {/* RIGHT ISOMETRIC FACE */}
            <Polygon
              points="170,152 255,105 255,199 170,246"
              fill="url(#cubeRight)"
              stroke="#00F0FF"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />

            {/* ============================================================== */}
            {/* TOP FACE: NEON LABYRINTH & BREAKOUT ASCENDING ARROW           */}
            {/* ============================================================== */}
            {/* Labyrinth grooves on top face */}
            <Path
              d="M 115 110 L 138 97 L 138 120 L 168 103 L 168 126"
              stroke="#007BFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Ascending Arrow Path breaking out towards top-right */}
            <Path
              d="M 130 115 L 155 101 L 180 115 L 212 97 L 225 90"
              stroke="#00F0FF"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M 130 115 L 155 101 L 180 115 L 212 97 L 225 90"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Signature Neon Arrowhead Pointing Up-Right (↗) breaking out */}
            <Polygon
              points="212,80 246,72 232,104"
              fill="url(#arrowGrad)"
              stroke="#FFFFFF"
              strokeWidth="1.2"
            />

            {/* ============================================================== */}
            {/* LEFT FACE: 3D RECESSED NEON LABYRINTH GROOVES                 */}
            {/* ============================================================== */}
            {/* Outer L-shaped winding track */}
            <Path
              d="M 102 122 L 102 176 L 138 196"
              stroke="#00F0FF"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M 102 122 L 102 176 L 138 196"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Inner winding circuit track */}
            <Path
              d="M 122 135 L 122 165 L 148 179 L 148 158"
              stroke="#007BFF"
              strokeWidth="4.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M 122 135 L 122 165 L 148 179 L 148 158"
              stroke="#00F0FF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Small accent corner notch */}
            <Path
              d="M 140 148 L 158 138"
              stroke="#00F0FF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* ============================================================== */}
            {/* RIGHT FACE: VERTICAL & 90-DEGREE CIRCUIT RUNNERS               */}
            {/* ============================================================== */}
            {/* Main right runner */}
            <Path
              d="M 188 232 L 188 178 L 222 159 L 222 126"
              stroke="#00F0FF"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M 188 232 L 188 178 L 222 159 L 222 126"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Secondary right track */}
            <Path
              d="M 205 214 L 205 188 L 238 169 L 238 140"
              stroke="#007BFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Middle connecting notch */}
            <Path
              d="M 174 168 L 174 194"
              stroke="#00F0FF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* ============================================================== */}
            {/* CENTRAL VERTICAL SEAM & CORNER BEVEL HIGHLIGHTS                */}
            {/* ============================================================== */}
            <Path
              d="M 170 152 L 170 246"
              stroke="#00F0FF"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <Path
              d="M 170 152 L 170 246"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
