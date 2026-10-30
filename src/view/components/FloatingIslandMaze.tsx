import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient as SvgRadialGradient,
  Stop,
  Path,
  Polygon,
  Circle,
  G,
  Rect,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface FloatingIslandMazeProps {
  size?: number;
}

export default function FloatingIslandMaze({
  size = 320,
}: FloatingIslandMazeProps): React.JSX.Element {
  const floatY = useSharedValue(0);
  const glowPulse = useSharedValue(0.85);

  useEffect(() => {
    // Gentle weightless levitation
    floatY.value = withRepeat(
      withSequence(
        withTiming(-7, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(4, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Subtle neon pulse on the maze arrows
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.7, { duration: 1600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [floatY, glowPulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  // Render SVG with viewBox 0 0 340 280
  return (
    <Animated.View style={[styles.container, animatedStyle, { width: size, height: size * 0.86 }]}>
      <Svg width="100%" height="100%" viewBox="0 0 340 280" fill="none">
        <Defs>
          {/* Earth/Rock Cliff Gradients */}
          <SvgLinearGradient id="cliffLeft" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#784E29" />
            <Stop offset="40%" stopColor="#5B3A1E" />
            <Stop offset="100%" stopColor="#3A220F" />
          </SvgLinearGradient>
          <SvgLinearGradient id="cliffRight" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#674121" />
            <Stop offset="40%" stopColor="#4A2E16" />
            <Stop offset="100%" stopColor="#2E1A0A" />
          </SvgLinearGradient>

          {/* Grass Rim Gradients */}
          <SvgLinearGradient id="grassTopGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#6EE7B7" />
            <Stop offset="30%" stopColor="#34D399" />
            <Stop offset="70%" stopColor="#10B981" />
            <Stop offset="100%" stopColor="#059669" />
          </SvgLinearGradient>
          <SvgLinearGradient id="grassTrimGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#10B981" />
            <Stop offset="100%" stopColor="#047857" />
          </SvgLinearGradient>

          {/* Dark Blue Maze Board Gradient */}
          <SvgLinearGradient id="boardGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#0A2A5E" />
            <Stop offset="50%" stopColor="#061B40" />
            <Stop offset="100%" stopColor="#030E26" />
          </SvgLinearGradient>

          {/* Tile Bevel Highlight */}
          <SvgLinearGradient id="tileBorder" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#1E4E8C" />
            <Stop offset="100%" stopColor="#0B2044" />
          </SvgLinearGradient>

          {/* Neon Cyan Arrow Glow */}
          <SvgRadialGradient id="cyanArrowGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#00FFFF" stopOpacity="0.9" />
            <Stop offset="60%" stopColor="#00D2FF" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#0080FF" stopOpacity="0" />
          </SvgRadialGradient>
        </Defs>

        {/* ============================================================== */}
        {/* 1. LOWER CRAGGY EARTH CLIFFS (Cascading 3D Earth Chunks)      */}
        {/* ============================================================== */}
        {/* Cliff Base Outline: Center Point ~ (170, 240) */}
        <Path
          d="M36,128 L170,192 L304,128 L304,152 L268,198 L220,230 L170,256 L120,232 L72,196 L36,152 Z"
          fill="url(#cliffLeft)"
        />

        {/* Right Cliff Shadow Face */}
        <Path
          d="M170,192 L304,128 L304,152 L268,198 L220,230 L170,256 Z"
          fill="url(#cliffRight)"
        />

        {/* Rock Strata & Fissures */}
        <Path
          d="M170,192 L170,256 M120,168 L120,232 M220,168 L220,230 M72,148 L72,196 M268,148 L268,198"
          stroke="#261408"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Layered Earth Ridges */}
        <Path
          d="M48,154 Q100,188 170,204 Q240,188 292,154 L292,168 Q240,202 170,218 Q100,202 48,168 Z"
          fill="#4A2E16"
          opacity={0.8}
        />
        <Path
          d="M72,188 Q120,214 170,226 Q220,214 268,188 L268,200 Q220,226 170,238 Q120,226 72,200 Z"
          fill="#331D0C"
          opacity={0.9}
        />

        {/* Hanging Moss/Vines Drops */}
        <Path
          d="M86,182 Q90,208 84,218 Q82,210 86,182 Z M244,180 Q248,206 242,216 Q240,208 244,180 Z"
          fill="#15803D"
        />
        <Path
          d="M142,216 Q146,236 142,244 M196,214 Q200,234 196,242"
          stroke="#10B981"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* ============================================================== */}
        {/* 2. CHUNKY GRASS RIM & OVERHANG (Lush Cartoon Green Layer)      */}
        {/* ============================================================== */}
        {/* Lower Grass Rim Drop Shadow */}
        <Path
          d="M26,116 L170,184 L314,116 L314,136 Q280,150 240,144 Q205,152 170,198 Q135,152 100,144 Q60,150 26,136 Z"
          fill="#047857"
        />

        {/* Overhanging Grass Clumps (Bumpy organic rim) */}
        <Path
          d="M26,116 L170,184 L314,116 L310,132 
             C290,140 275,128 260,136 
             C240,146 225,134 205,142 
             C188,148 178,162 170,172 
             C162,162 152,148 135,142 
             C115,134 100,146 80,136 
             C65,128 50,140 30,132 Z"
          fill="url(#grassTrimGrad)"
        />

        {/* Top Grass Surface (Isometric Diamond) */}
        <Polygon
          points="170,44 314,116 170,184 26,116"
          fill="url(#grassTopGrad)"
          stroke="#6EE7B7"
          strokeWidth="1.5"
        />

        {/* Natural Rocks & Foliage Details on Grass Corners */}
        {/* Top Corner Bush */}
        <Circle cx="170" cy="40" r="12" fill="#059669" />
        <Circle cx="164" cy="38" r="9" fill="#10B981" />
        <Circle cx="176" cy="38" r="9" fill="#34D399" />
        <Circle cx="170" cy="35" r="7" fill="#6EE7B7" />

        {/* Right Corner Shrub */}
        <Circle cx="304" cy="112" r="10" fill="#047857" />
        <Circle cx="298" cy="108" r="8" fill="#10B981" />
        <Circle cx="306" cy="106" r="7" fill="#34D399" />

        {/* Left Corner Shrub */}
        <Circle cx="36" cy="112" r="10" fill="#047857" />
        <Circle cx="42" cy="108" r="8" fill="#10B981" />
        <Circle cx="34" cy="106" r="7" fill="#34D399" />

        {/* Small Grey Rocks on Turf */}
        {/* Front-left rock */}
        <Path d="M125,164 Q132,156 142,162 Q144,170 134,172 Q124,170 125,164 Z" fill="#64748B" />
        <Path d="M127,163 Q132,157 138,162" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
        {/* Front-right rock */}
        <Path d="M198,162 Q208,156 215,164 Q214,172 206,172 Q197,170 198,162 Z" fill="#64748B" />
        <Path d="M200,161 Q206,157 212,163" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
        {/* Rear rock */}
        <Circle cx="210" cy="62" r="5" fill="#475569" />
        <Circle cx="130" cy="62" r="4" fill="#475569" />

        {/* ============================================================== */}
        {/* 3. RECESSED 5x5 DARK-BLUE TILED PUZZLE BOARD                   */}
        {/* ============================================================== */}
        {/* Board Outer Bevel (Dark Inset) */}
        <Polygon
          points="170,62 278,116 170,168 62,116"
          fill="#020917"
          stroke="#0F2B52"
          strokeWidth="3"
        />

        {/* Board Main Surface */}
        <Polygon
          points="170,65 274,116 170,165 66,116"
          fill="url(#boardGrad)"
        />

        {/* 5x5 Isometric Grid Lines */}
        {/* Southwest to Northeast grid lines (4 interior lines) */}
        <Path
          d="M86.8,106.2 L190.8,155.8 M107.6,96.4 L211.6,146 M128.4,86.6 L232.4,136.2 M149.2,76.8 L253.2,126.4"
          stroke="url(#tileBorder)"
          strokeWidth="1.2"
        />
        {/* Northwest to Southeast grid lines (4 interior lines) */}
        <Path
          d="M149.2,155.8 L253.2,106.2 M128.4,146 L232.4,96.4 M107.6,136.2 L211.6,86.6 M86.8,126.4 L190.8,76.8"
          stroke="url(#tileBorder)"
          strokeWidth="1.2"
        />

        {/* Tile Center Sparkles & Glow Nodes */}
        <Circle cx="170" cy="115" r="2" fill="#38BDF8" opacity={0.6} />
        <Circle cx="149" cy="98" r="1.5" fill="#38BDF8" opacity={0.5} />
        <Circle cx="191" cy="98" r="1.5" fill="#38BDF8" opacity={0.5} />
        <Circle cx="149" cy="132" r="1.5" fill="#38BDF8" opacity={0.5} />
        <Circle cx="191" cy="132" r="1.5" fill="#38BDF8" opacity={0.5} />

        {/* ============================================================== */}
        {/* 4. GLOWING NEON CYAN ARROWS (Tightly Packed, Clean Maze)       */}
        {/* ============================================================== */}
        <G strokeLinecap="round" strokeLinejoin="round">
          {/* Arrow 1: Top-Left cell slithers right and points up-right */}
          <Path
            d="M110,108 L130,118 L150,108 L150,94"
            stroke="#00FFFF"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Arrowhead 1 */}
          <Polygon points="150,88 145,96 155,96" fill="#00FFFF" />

          {/* Arrow 2: Top-Right horizontal pointing right */}
          <Path
            d="M170,82 L196,94 L220,82"
            stroke="#00FFFF"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Arrowhead 2 */}
          <Polygon points="226,80 217,81 220,89" fill="#00FFFF" />

          {/* Arrow 3: Center-left L-bend snake (down-right then down-left) */}
          <Path
            d="M92,126 L118,138 L142,126 L142,142"
            stroke="#00FFFF"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Arrowhead 3 */}
          <Polygon points="142,148 137,140 147,140" fill="#00FFFF" />

          {/* Arrow 4: Center-right 90-degree turn pointing up-right */}
          <Path
            d="M174,136 L198,124 L198,110 L222,98"
            stroke="#00FFFF"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Arrowhead 4 */}
          <Polygon points="228,96 220,97 223,105" fill="#00FFFF" />

          {/* Arrow 5: Bottom-left straight arrow pointing up-right */}
          <Path
            d="M124,152 L146,141 L168,152"
            stroke="#00FFFF"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Arrowhead 5 */}
          <Polygon points="174,154 165,152 168,145" fill="#00FFFF" />

          {/* Arrow 6: Bottom-right L-bend pointing right */}
          <Path
            d="M178,152 L202,140 L226,152"
            stroke="#00FFFF"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Arrowhead 6 */}
          <Polygon points="232,154 223,152 226,145" fill="#00FFFF" />
        </G>

        {/* Ambient neon droplet lights on board */}
        <Circle cx="184" cy="74" r="2.5" fill="#00FFFF" opacity={0.8} />
        <Circle cx="120" cy="120" r="2" fill="#00FFFF" opacity={0.7} />
        <Circle cx="216" cy="126" r="2" fill="#00FFFF" opacity={0.7} />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
