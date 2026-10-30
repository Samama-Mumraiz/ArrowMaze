import React, { useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient as SvgRadialGradient,
  Stop,
  Path,
  Rect,
  Circle,
  Polygon,
  G,
  Ellipse,
  Text as SvgText,
  Line,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { typography } from '../theme/typography';
import { usePlayer } from '../store/PlayerContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Virtual canvas dimensions for the vertical winding map
const MAP_CANVAS_WIDTH = 400;
const MAP_CANVAS_HEIGHT = 1180;

// Coordinates for the 12 levels along the serpentine trail (viewBox 0 0 400 1180)
const LEVEL_POSITIONS = [
  { level: 1, x: 278, y: 975 },
  { level: 2, x: 326, y: 880 },
  { level: 3, x: 260, y: 825 },
  { level: 4, x: 178, y: 705 },
  { level: 5, x: 256, y: 670 },
  { level: 6, x: 330, y: 635 },
  { level: 7, x: 108, y: 775 },
  { level: 8, x: 175, y: 810 },
  { level: 9, x: 330, y: 635 }, // Note: right before wooden bridge
  { level: 10, x: 148, y: 395 }, // Left terrace across bridge
  { level: 11, x: 284, y: 295 }, // Snowy mountain ridge
  { level: 12, x: 214, y: 245 }, // Peak near cave entrance
];

// Re-ordered sequential progression nodes along the actual path
const SEQUENTIAL_NODES = [
  { level: 1, x: 278, y: 975 },
  { level: 2, x: 326, y: 880 },
  { level: 3, x: 260, y: 825 },
  { level: 4, x: 175, y: 810 },
  { level: 5, x: 108, y: 775 },
  { level: 6, x: 178, y: 705 },
  { level: 7, x: 256, y: 670 },
  { level: 8, x: 330, y: 635 },
  { level: 9, x: 265, y: 410 },
  { level: 10, x: 148, y: 395 },
  { level: 11, x: 284, y: 295 },
  { level: 12, x: 214, y: 245 },
];

// Interactive Animated Level Node Component
function PathfinderLevelNode({
  level,
  x,
  y,
  isUnlocked,
  stars,
  onPress,
}: {
  level: number;
  x: number;
  y: number;
  isUnlocked: boolean;
  stars: number;
  onPress: () => void;
}): React.JSX.Element {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isUnlocked) return;
    scale.value = withTiming(0.9, { duration: 90, easing: Easing.out(Easing.ease) });
  };

  const handlePressOut = () => {
    if (!isUnlocked) return;
    scale.value = withSpring(1, { damping: 12, stiffness: 240 });
  };

  // Convert canvas coords to responsive positions
  const leftPos = (x / MAP_CANVAS_WIDTH) * SCREEN_WIDTH - 30;
  const topPos = y - 30;

  return (
    <Animated.View
      style={[
        styles.nodeAbsoluteContainer,
        { left: leftPos, top: topPos },
        animatedStyle,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={!isUnlocked}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[styles.nodePressable, !isUnlocked && styles.nodeLocked]}
        accessibilityLabel={`Level ${level}`}
      >
        {/* 3D Circular Node Body */}
        <View style={styles.node3DShadow}>
          <LinearGradient
            colors={
              isUnlocked
                ? ['#38BDF8', '#0284C7', '#0369A1']
                : ['#52463E', '#3D332D', '#2A221D']
            }
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.nodeFrontFace}
          >
            {/* Top Gloss Reflection Arc */}
            <View style={styles.nodeGlossHighlight} />

            {isUnlocked ? (
              /* Bold White Level Number */
              <Text style={styles.nodeNumberText}>{level}</Text>
            ) : (
              /* Golden-Brown Padlock Icon for Locked Levels */
              <Svg width={24} height={26} viewBox="0 0 24 26" fill="none">
                {/* Shackle */}
                <Path
                  d="M6 10V6.5C6 3.46 8.69 1 12 1s6 2.46 6 5.5V10"
                  stroke="#F59E0B"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                {/* Lock Body */}
                <Rect
                  x="3"
                  y="10"
                  width="18"
                  height="14"
                  rx="3.5"
                  fill="#D97706"
                  stroke="#92400E"
                  strokeWidth="1.6"
                />
                {/* Keyhole */}
                <Circle cx="12" cy="16" r="1.8" fill="#451A03" />
                <Path d="M11.2 16.8L10.7 20.5H13.3L12.8 16.8" fill="#451A03" />
              </Svg>
            )}
          </LinearGradient>
        </View>

        {/* 3 Tiny Cartoon Stars Underneath */}
        <View style={styles.nodeStarsRow}>
          {[1, 2, 3].map((starIndex) => {
            const isEarned = isUnlocked && stars >= starIndex;
            return (
              <View
                key={starIndex}
                style={[styles.starWrapper, starIndex === 2 && styles.starCenterOffset]}
              >
                <Svg width={17} height={17} viewBox="0 0 24 24">
                  {/* 5-pointed cartoon star */}
                  <Polygon
                    points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                    fill={isEarned ? '#FBBF24' : '#1E293B'}
                    stroke={isEarned ? '#FDE68A' : '#0F172A'}
                    strokeWidth={isEarned ? '1.5' : '1'}
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            );
          })}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function LevelSelectionScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<any>(null);
  const {
    currentLevel,
    maxUnlockedLevel,
    currentUnlockedLevel: ctxUnlockedLevel,
    getLevelStars,
    stats,
  } = usePlayer();

  // Active progression threshold
  const currentUnlocked = useMemo(() => {
    return ctxUnlockedLevel ?? Math.max(1, maxUnlockedLevel ?? currentLevel ?? 9);
  }, [ctxUnlockedLevel, maxUnlockedLevel, currentLevel]);

  const coinBalance = stats?.coins ?? 195;

  // Auto-scroll near player's active level on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      // Start comfortably scrolled near lower half where levels 1-5 reside
      scrollViewRef.current?.scrollTo({ y: 460, animated: false });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectLevel = (lvlNum: number) => {
    if (lvlNum <= currentUnlocked) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {
        // platform fallback
      }
      navigation.navigate('Gameplay', { level: lvlNum });
    }
  };

  const handleGoBack = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // platform fallback
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  // Back button press animation
  const backScale = useSharedValue(1);
  const animatedBackBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));

  const handleBackPressIn = () => {
    backScale.value = withTiming(0.9, { duration: 80, easing: Easing.out(Easing.ease) });
  };

  const handleBackPressOut = () => {
    backScale.value = withSpring(1, { damping: 12, stiffness: 240 });
  };

  return (
    <View style={styles.container}>
      {/* ============================================================== */}
      {/* 1. SCROLLABLE NATURAL WINDING MAP SCENE                        */}
      {/* ============================================================== */}
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={[styles.scrollContent, { height: MAP_CANVAS_HEIGHT }]}
      >
        {/* Full Vector Map Canvas (viewBox 0 0 400 1180) */}
        <Svg
          width={SCREEN_WIDTH}
          height={MAP_CANVAS_HEIGHT}
          viewBox={`0 0 ${MAP_CANVAS_WIDTH} ${MAP_CANVAS_HEIGHT}`}
          style={StyleSheet.absoluteFill}
        >
          <Defs>
            {/* Sky Background Gradient */}
            <SvgLinearGradient id="mapSkyGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#1E88E5" />
              <Stop offset="30%" stopColor="#38BDF8" />
              <Stop offset="70%" stopColor="#7DD3FC" />
              <Stop offset="100%" stopColor="#BAE6FD" />
            </SvgLinearGradient>

            {/* Snow Mountain Gradient */}
            <SvgLinearGradient id="snowPeakGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="60%" stopColor="#E0F2FE" />
              <Stop offset="100%" stopColor="#BAE6FD" />
            </SvgLinearGradient>

            {/* Island Grass Gradient */}
            <SvgLinearGradient id="islandGrassGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#4ADE80" />
              <Stop offset="40%" stopColor="#22C55E" />
              <Stop offset="100%" stopColor="#15803D" />
            </SvgLinearGradient>

            {/* Craggy Brown Cliff Gradient */}
            <SvgLinearGradient id="islandCliffGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#6E4423" />
              <Stop offset="50%" stopColor="#533116" />
              <Stop offset="100%" stopColor="#351C0A" />
            </SvgLinearGradient>

            {/* River Flow Gradient */}
            <SvgLinearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#7DD3FC" />
              <Stop offset="50%" stopColor="#0284C7" />
              <Stop offset="100%" stopColor="#0369A1" />
            </SvgLinearGradient>

            {/* Serpentine Dirt Trail Gradient */}
            <SvgLinearGradient id="dirtTrailGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#E8C59A" />
              <Stop offset="50%" stopColor="#D4A373" />
              <Stop offset="100%" stopColor="#BA8652" />
            </SvgLinearGradient>

            {/* Cobblestone Stone Trail Gradient */}
            <SvgLinearGradient id="stoneTrailGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#CBD5E1" />
              <Stop offset="100%" stopColor="#94A3B8" />
            </SvgLinearGradient>

            {/* Waterfall Mist */}
            <SvgLinearGradient id="mistWaterfall" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <Stop offset="50%" stopColor="#E0F7FE" stopOpacity="0.6" />
              <Stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </SvgLinearGradient>
          </Defs>

          {/* 1. Base Sky Fill */}
          <Rect width="100%" height="100%" fill="url(#mapSkyGrad)" />

          {/* 2. Distant Floating Waterfall Islands (Left and Right) */}
          {/* Distant Island Left */}
          <G>
            <Path d="M-10,310 L-10,480 L-5,480 L-5,310 Z" fill="url(#mistWaterfall)" />
            <Polygon points="-20,305 25,305 15,340 -10,340" fill="#5C3A1D" />
            <Ellipse cx="5" cy="303" rx="20" ry="7" fill="#16A34A" />
          </G>
          {/* Distant Island Right */}
          <G>
            <Path d="M375,340 L375,520 L380,520 L380,340 Z" fill="url(#mistWaterfall)" />
            <Polygon points="360,335 415,335 405,375 370,375" fill="#5C3A1D" />
            <Ellipse cx="388" cy="333" rx="22" ry="7" fill="#16A34A" />
          </G>

          {/* 3. MAIN VERTICAL FLOATING ISLAND MASS */}
          {/* Deep Craggy Cliff Base Underhang */}
          <Path
            d="M38,710 Q50,920 80,1030 Q140,1110 200,1050 Q260,1110 320,1030 Q360,920 372,710 
               L372,520 L360,450 L340,320 L270,180 L200,70 L130,180 L60,320 L40,450 L38,520 Z"
            fill="url(#islandCliffGrad)"
          />

          {/* Rocky Cliff Fissures and Strata Layers */}
          <Path
            d="M80,1030 L110,960 L140,1020 L170,960 L200,1050 L230,960 L260,1020 L290,960 L320,1030"
            stroke="#271406"
            strokeWidth="3.5"
            fill="none"
          />
          <Path
            d="M90,940 Q140,990 200,970 Q260,990 310,940 M100,880 Q150,920 200,910 Q250,920 300,880"
            stroke="#3E200C"
            strokeWidth="2.5"
            fill="none"
          />

          {/* Lush Green Lower & Middle Island Surface */}
          <Path
            d="M44,700 Q56,870 90,980 Q140,1030 200,1000 Q260,1030 310,980 Q344,870 366,700 
               Q368,600 320,530 Q280,500 240,510 Q180,500 120,530 Q42,600 44,700 Z"
            fill="url(#islandGrassGrad)"
          />

          {/* Middle Plateau Grass Terrace (Behind River) */}
          <Path
            d="M52,530 Q130,490 200,490 Q270,490 348,530 L340,400 Q270,370 200,370 Q130,370 60,400 Z"
            fill="#16A34A"
          />
          <Path
            d="M52,530 Q130,490 200,490 Q270,490 348,530 L340,430 Q270,400 200,400 Q130,400 60,430 Z"
            fill="#22C55E"
          />

          {/* 4. THE WINDING BLUE RIVER & WATERFALL */}
          <Path
            d="M50,540 Q120,500 180,515 Q240,495 320,535 Q345,545 356,585 L356,660 Q345,600 320,555 Q240,515 180,535 Q120,520 50,560 Z"
            fill="url(#riverGrad)"
          />
          {/* White Water Ripples and Foam */}
          <Path
            d="M80,542 Q110,534 140,538 M190,522 Q220,518 250,524 M280,530 Q305,536 330,548"
            stroke="#E0F2FE"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Cascading Waterfall Down the Right Cliff Face */}
          <Path
            d="M346,560 L354,690 L360,690 L352,560 Z"
            fill="url(#mistWaterfall)"
          />

          {/* 5. WOODEN ARCHED BRIDGE (Crossing the River at x ~ 270, y ~ 490) */}
          <G>
            {/* Bridge Shadow */}
            <Path
              d="M246,532 Q276,494 306,522 L310,534 Q276,506 246,544 Z"
              fill="#0F172A"
              opacity={0.4}
            />
            {/* Wooden Planks Deck */}
            <Path
              d="M244,524 Q274,484 304,514 L308,528 Q274,498 244,538 Z"
              fill="#B45309"
              stroke="#78350F"
              strokeWidth="2"
            />
            {/* Bridge Planks Ribs */}
            <Line x1="252" y1="520" x2="256" y2="532" stroke="#542508" strokeWidth="2" />
            <Line x1="264" y1="510" x2="268" y2="522" stroke="#542508" strokeWidth="2" />
            <Line x1="276" y1="504" x2="280" y2="516" stroke="#542508" strokeWidth="2" />
            <Line x1="288" y1="506" x2="292" y2="518" stroke="#542508" strokeWidth="2" />
            <Line x1="298" y1="514" x2="302" y2="526" stroke="#542508" strokeWidth="2" />
            {/* Upper Handrail */}
            <Path
              d="M244,514 Q274,474 304,504"
              stroke="#D97706"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Handrail Posts */}
            <Line x1="248" y1="516" x2="248" y2="528" stroke="#78350F" strokeWidth="2.5" />
            <Line x1="274" y1="494" x2="274" y2="508" stroke="#78350F" strokeWidth="2.5" />
            <Line x1="300" y1="508" x2="300" y2="522" stroke="#78350F" strokeWidth="2.5" />
          </G>

          {/* 6. SNOWY MOUNTAIN PEAK (Top Island Section) */}
          <Path
            d="M60,370 L130,220 L160,250 L200,90 L240,250 L270,220 L340,370 
               Q270,390 200,380 Q130,390 60,370 Z"
            fill="url(#snowPeakGrad)"
            stroke="#BAE6FD"
            strokeWidth="1.5"
          />

          {/* Dark Mountain Cave Entrance */}
          <Path
            d="M188,185 C188,160 212,160 212,185 L214,196 L186,196 Z"
            fill="#0F172A"
          />
          <Path
            d="M186,185 C186,156 214,156 214,185"
            stroke="#64748B"
            strokeWidth="2.5"
            fill="none"
          />

          {/* Snow Ridges and Ice Highlights */}
          <Path
            d="M200,90 L188,160 M200,90 L212,160 M160,250 L180,310 M240,250 L220,310"
            stroke="#E0F2FE"
            strokeWidth="2.5"
            fill="none"
          />

          {/* 7. WINDING SERPENTINE DIRT TRAIL (Starting Bottom-Right to Top Cave) */}
          {/* Main Dirt Trail Outline / Shadow */}
          <Path
            d="M280,1020 C290,950 340,910 330,860 
               C320,810 240,820 210,810 
               C150,800 90,780 110,740 
               C130,700 240,680 270,660 
               C300,640 340,620 330,570 
               C320,530 280,520 270,490 
               C260,450 160,430 150,380 
               C140,330 280,320 280,280 
               C280,240 220,230 214,196"
            stroke="#92400E"
            strokeWidth="38"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Warm Tan/Sand Dirt Trail Surface */}
          <Path
            d="M280,1020 C290,950 340,910 330,860 
               C320,810 240,820 210,810 
               C150,800 90,780 110,740 
               C130,700 240,680 270,660 
               C300,640 340,620 330,570 
               C320,530 280,520 270,490"
            stroke="url(#dirtTrailGrad)"
            strokeWidth="32"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Cobblestone Stone Trail Section (Above Bridge into Mountain) */}
          <Path
            d="M270,490 
               C260,450 160,430 150,380 
               C140,330 280,320 280,280 
               C280,240 220,230 214,196"
            stroke="url(#stoneTrailGrad)"
            strokeWidth="30"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Stepping Stones and Cobblestone Texture Lines */}
          <Path
            d="M274,1000 L286,1000 M320,865 L332,865 M248,820 L260,820 M120,745 L132,745 M260,665 L272,665"
            stroke="#B45309"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <Path
            d="M230,440 L242,438 M180,410 L192,410 M170,350 L182,348 M250,310 L262,308 M230,250 L242,248"
            stroke="#64748B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* 8. NATURAL DECORATION: Ancient Oak Tree, Pines, Signs, and Rocks */}
          {/* Ancient Gnarled Oak Tree (Left Bank near River: x ~ 80, y ~ 420) */}
          <G>
            {/* Tree Trunk & Roots */}
            <Path
              d="M72,480 Q65,445 74,420 Q85,410 92,390 Q98,420 102,480 
                 M74,460 Q52,475 42,485 M95,465 Q115,480 125,488"
              stroke="#78350F"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            {/* Trunk Highlights */}
            <Path
              d="M74,440 Q80,425 86,410 M78,455 Q65,470 52,478"
              stroke="#B45309"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Foliage Puffy Crown */}
            <Circle cx="84" cy="370" r="34" fill="#15803D" />
            <Circle cx="64" cy="355" r="26" fill="#16A34A" />
            <Circle cx="106" cy="360" r="28" fill="#22C55E" />
            <Circle cx="85" cy="342" r="26" fill="#4ADE80" />
          </G>

          {/* Evergreen Pine Trees (Right Bank) */}
          <G>
            {/* Pine 1 */}
            <Polygon points="350,390 325,440 375,440" fill="#14532D" />
            <Polygon points="350,375 330,415 370,415" fill="#166534" />
            <Polygon points="350,360 336,395 364,395" fill="#15803D" />
            <Polygon points="350,345 342,375 358,375" fill="#22C55E" />
          </G>

          {/* Pine Trees (Near Snowy Slope) */}
          <G>
            <Polygon points="190,265 178,295 202,295" fill="#166534" />
            <Polygon points="190,250 182,275 198,275" fill="#22C55E" />
            <Polygon points="255,275 245,305 265,305" fill="#166534" />
            <Polygon points="255,260 248,285 262,285" fill="#22C55E" />
          </G>

          {/* Wooden Directional Signs on the Trail */}
          {/* Sign 1 (Mid-Left) */}
          <G>
            <Line x1="78" y1="740" x2="78" y2="770" stroke="#78350F" strokeWidth="4" />
            <Polygon points="65,745 88,745 95,735 88,725 65,725" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
          </G>
          {/* Sign 2 (Lower-Right) */}
          <G>
            <Line x1="318" y1="790" x2="318" y2="820" stroke="#78350F" strokeWidth="4" />
            <Polygon points="305,795 328,795 335,785 328,775 305,775" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
          </G>

          {/* Patches of Flowers in Meadows */}
          <Circle cx="240" cy="720" r="2.5" fill="#FFFFFF" />
          <Circle cx="246" cy="722" r="2.5" fill="#FFFFFF" />
          <Circle cx="243" cy="716" r="2" fill="#FDE047" />

          <Circle cx="280" cy="855" r="2.5" fill="#FFFFFF" />
          <Circle cx="286" cy="857" r="2.5" fill="#FFFFFF" />
          <Circle cx="283" cy="851" r="2" fill="#FDE047" />
        </Svg>

        {/* 9. INTERACTIVE 12 LEVEL NODES (Positioned along the Trail) */}
        {SEQUENTIAL_NODES.map((node) => {
          const isUnlocked = node.level <= currentUnlocked;
          const stars = getLevelStars ? getLevelStars(node.level) : (isUnlocked ? 2 : 0);

          return (
            <PathfinderLevelNode
              key={node.level}
              level={node.level}
              x={node.x}
              y={node.y}
              isUnlocked={isUnlocked}
              stars={stars}
              onPress={() => handleSelectLevel(node.level)}
            />
          );
        })}
      </ScrollView>

      {/* ============================================================== */}
      {/* 2. FIXED TOP HEADER OVERLAY (Level Badge & Coin Pill)          */}
      {/* ============================================================== */}
      <View style={[styles.fixedHeaderOverlay, { top: insets.top + 6 }]}>
        {/* Top-Right Coin Pill */}
        <View style={styles.topRightCoinPill}>
          <View style={styles.coinIconWrapper}>
            <Svg width={26} height={26} viewBox="0 0 32 32" fill="none">
              <Defs>
                <SvgLinearGradient id="coinGold" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor="#FFF275" />
                  <Stop offset="50%" stopColor="#FBBF24" />
                  <Stop offset="100%" stopColor="#D97706" />
                </SvgLinearGradient>
              </Defs>
              <Circle cx="16" cy="16" r="14.5" fill="url(#coinGold)" stroke="#92400E" strokeWidth="1.2" />
              <Polygon
                points="16,7 18.5,12.2 24.2,13 20.1,17 21.1,22.7 16,20 10.9,22.7 11.9,17 7.8,13 13.5,12.2"
                fill="#FFFFFF"
                opacity={0.9}
              />
            </Svg>
          </View>
          <Text style={styles.coinBalanceText}>{coinBalance}</Text>
        </View>

        {/* Center: "Level" Pill + Dimensional "SELECT LEVEL" Wooden/Parchment Banner */}
        <View style={styles.centerBannerWrapper}>
          {/* Top Small Golden "Level" Pill */}
          <LinearGradient
            colors={['#FFF275', '#FBBF24', '#D97706']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.levelTopPill}
          >
            <Text style={styles.levelTopPillText}>Level</Text>
          </LinearGradient>

          {/* Dimensional Wooden/Parchment Arched Banner */}
          <View style={styles.parchmentBannerBody}>
            <Svg width={270} height={58} viewBox="0 0 270 58" fill="none">
              <Defs>
                <SvgLinearGradient id="parchmentWood" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#FDE68A" />
                  <Stop offset="40%" stopColor="#F59E0B" />
                  <Stop offset="100%" stopColor="#D97706" />
                </SvgLinearGradient>
                <SvgLinearGradient id="bannerRibbon" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#D97706" />
                  <Stop offset="100%" stopColor="#92400E" />
                </SvgLinearGradient>
              </Defs>

              {/* Banner Ribbon End Folds (Left and Right) */}
              <Path d="M8,12 L38,12 L38,46 L8,46 L20,29 Z" fill="url(#bannerRibbon)" stroke="#78350F" strokeWidth="2" />
              <Path d="M262,12 L232,12 L232,46 L262,46 L250,29 Z" fill="url(#bannerRibbon)" stroke="#78350F" strokeWidth="2" />

              {/* Main Arched Banner Surface */}
              <Path
                d="M32,10 Q135,2 238,10 Q248,30 238,48 Q135,40 32,48 Q22,30 32,10 Z"
                fill="url(#parchmentWood)"
                stroke="#78350F"
                strokeWidth="2.5"
              />

              {/* Banner Inner Border Accent */}
              <Path
                d="M36,13 Q135,6 234,13 Q242,29 234,45 Q135,38 36,45 Q28,29 36,13 Z"
                stroke="#FEF3C7"
                strokeWidth="1.2"
                fill="none"
                opacity={0.7}
              />

              {/* 3D Drop Text "SELECT LEVEL" */}
              <SvgText
                x="135"
                y="35"
                textAnchor="middle"
                fill="#78350F"
                fontSize="22"
                fontWeight="900"
                letterSpacing="1"
              >
                SELECT LEVEL
              </SvgText>
              <SvgText
                x="135"
                y="34"
                textAnchor="middle"
                fill="#FFFBEB"
                fontSize="22"
                fontWeight="900"
                letterSpacing="1"
              >
                SELECT LEVEL
              </SvgText>
            </Svg>
          </View>
        </View>
      </View>

      {/* ============================================================== */}
      {/* 3. FIXED BOTTOM-LEFT CIRCULAR CORAL BACK BUTTON ('<')         */}
      {/* ============================================================== */}
      <Animated.View
        style={[
          styles.fixedBackBtnContainer,
          { bottom: Math.max(insets.bottom + 12, 24) },
          animatedBackBtnStyle,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.88}
          onPressIn={handleBackPressIn}
          onPressOut={handleBackPressOut}
          onPress={handleGoBack}
          style={styles.backButton3D}
          accessibilityLabel="Go Back"
        >
          {/* Coral / Pink-Brownish 3D Circular Gradient */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E88E5',
  },
  scrollContent: {
    width: SCREEN_WIDTH,
  },

  /* ---------------------------------------------------------------------- */
  /* FIXED TOP HEADER OVERLAY                                               */
  /* ---------------------------------------------------------------------- */
  fixedHeaderOverlay: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
    pointerEvents: 'box-none',
  },
  topRightCoinPill: {
    position: 'absolute',
    top: 0,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 28, 68, 0.92)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#38BDF8',
    paddingLeft: 4,
    paddingRight: 10,
    paddingVertical: 3,
    gap: 6,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 22,
  },
  coinIconWrapper: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinBalanceText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  centerBannerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  levelTopPill: {
    paddingHorizontal: 16,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#78350F',
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: -6,
    zIndex: 24,
  },
  levelTopPillText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: '#78350F',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  parchmentBannerBody: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },

  /* ---------------------------------------------------------------------- */
  /* PATHFINDER LEVEL NODES                                                 */
  /* ---------------------------------------------------------------------- */
  nodeAbsoluteContainer: {
    position: 'absolute',
    width: 60,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  nodePressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeLocked: {
    opacity: 0.72,
  },
  node3DShadow: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#034E8C',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 7,
  },
  nodeFrontFace: {
    width: 58,
    height: 54,
    borderRadius: 29,
    borderWidth: 2.2,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  nodeGlossHighlight: {
    position: 'absolute',
    top: 2,
    left: 8,
    right: 8,
    height: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  nodeNumberText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 26,
    color: '#FFFFFF',
    textShadowColor: '#034E8C',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  nodeStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    gap: 2,
  },
  starWrapper: {
    width: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starCenterOffset: {
    marginTop: 2,
  },

  /* ---------------------------------------------------------------------- */
  /* FIXED BOTTOM-LEFT CORAL BACK BUTTON                                    */
  /* ---------------------------------------------------------------------- */
  fixedBackBtnContainer: {
    position: 'absolute',
    left: 18,
    zIndex: 30,
  },
  backButton3D: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#4C1D24',
    shadowColor: '#9F1239',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  backButtonFace: {
    width: 58,
    height: 54,
    borderRadius: 29,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.65)',
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
});
