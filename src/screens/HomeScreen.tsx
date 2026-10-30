import React from 'react';
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
  LinearGradient as SvgLinearGradient,
  RadialGradient as SvgRadialGradient,
  Stop,
  Path,
  Rect,
  Circle,
  Polygon,
  G,
  Ellipse,
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
import FloatingIslandMaze from '../view/components/FloatingIslandMaze';
import WoodenSignpost from '../view/components/WoodenSignpost';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const { stats, totalWins } = usePlayer();

  // Dynamic values connected to React Native global state
  const activeLevel = stats?.currentLevel ?? 12;
  const winsProgress = stats?.totalWins ?? totalWins ?? 8;
  const coinBalance = stats?.coins ?? 195;

  // Reanimated 3D button press micro-interactions
  const playScale = useSharedValue(1);
  const levelsScale = useSharedValue(1);

  const animatedPlayStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playScale.value }],
  }));

  const animatedLevelsStyle = useAnimatedStyle(() => ({
    transform: [{ scale: levelsScale.value }],
  }));

  const handlePlayPressIn = () => {
    playScale.value = withTiming(0.94, { duration: 80, easing: Easing.out(Easing.ease) });
  };

  const handlePlayPressOut = () => {
    playScale.value = withSpring(1, { damping: 12, stiffness: 240 });
  };

  const handleLevelsPressIn = () => {
    levelsScale.value = withTiming(0.94, { duration: 80, easing: Easing.out(Easing.ease) });
  };

  const handleLevelsPressOut = () => {
    levelsScale.value = withSpring(1, { damping: 12, stiffness: 240 });
  };

  const handlePlayPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // platform fallback
    }
    navigation.navigate('Play');
  };

  const handleLevelsPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // platform fallback
    }
    navigation.navigate('LevelSelection');
  };

  const handleSettingsPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // platform fallback
    }
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      {/* ============================================================== */}
      {/* 1. DAYTIME SKY & FLOATING WATERFALL ISLANDS BACKGROUND         */}
      {/* ============================================================== */}
      {/* Sky Blue Gradient Base */}
      <LinearGradient
        colors={['#1A8CEB', '#38BDF8', '#7DD3FC', '#BAE6FD']}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* SVG Layer: Floating Waterfall Islands, Layered Clouds, and Ground Foliage */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`} fill="none">
          <Defs>
            {/* Waterfall Gradient (Soft White to Cyan Mist) */}
            <SvgLinearGradient id="waterfallGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <Stop offset="30%" stopColor="#E0F7FE" stopOpacity="0.85" />
              <Stop offset="80%" stopColor="#38BDF8" stopOpacity="0.5" />
              <Stop offset="100%" stopColor="#E0F2FE" stopOpacity="0" />
            </SvgLinearGradient>

            {/* Cloud Soft Radial Gradient */}
            <SvgRadialGradient id="cloudPuff" cx="50%" cy="40%" r="50%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <Stop offset="70%" stopColor="#F0F9FF" stopOpacity="0.9" />
              <Stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.5" />
            </SvgRadialGradient>

            {/* Title Halo Glow */}
            <SvgRadialGradient id="titleAura" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.55" />
              <Stop offset="55%" stopColor="#0284C7" stopOpacity="0.2" />
              <Stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </SvgRadialGradient>
          </Defs>

          {/* Title Arcing Halo Aura */}
          <Ellipse cx={SCREEN_WIDTH / 2} cy={165} rx={160} ry={70} fill="url(#titleAura)" />
          {/* Blue Arc Halo Ribbon */}
          <Path
            d={`M${SCREEN_WIDTH / 2 - 120},130 Q${SCREEN_WIDTH / 2},75 ${SCREEN_WIDTH / 2 + 120},130`}
            stroke="rgba(56, 189, 248, 0.45)"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d={`M${SCREEN_WIDTH / 2 - 110},130 Q${SCREEN_WIDTH / 2},85 ${SCREEN_WIDTH / 2 + 110},130`}
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />

          {/* ------------------------------------------------------------ */}
          {/* DISTANT FLOATING ISLANDS WITH WATERFALLS                    */}
          {/* ------------------------------------------------------------ */}
          {/* 1. Top-Left Floating Island with Waterfall */}
          <G>
            {/* Waterfall dropping down */}
            <Path
              d="M32,185 L32,290 L38,290 L38,185 Z"
              fill="url(#waterfallGrad)"
            />
            {/* Rocky base */}
            <Polygon points="12,180 54,180 44,215 22,215" fill="#5C3A1D" />
            <Polygon points="22,215 44,215 36,235 30,235" fill="#3D2411" />
            {/* Green island crown */}
            <Ellipse cx="33" cy="178" rx="24" ry="9" fill="#15803D" />
            <Ellipse cx="33" cy="176" rx="22" ry="7" fill="#22C55E" />
            {/* Trees */}
            <Circle cx="24" cy="168" r="7" fill="#16A34A" />
            <Circle cx="40" cy="169" r="6" fill="#4ADE80" />
          </G>

          {/* 2. Top-Right Floating Island with Waterfall */}
          <G>
            {/* Waterfall */}
            <Path
              d={`M${SCREEN_WIDTH - 36},195 L${SCREEN_WIDTH - 36},310 L${SCREEN_WIDTH - 30},310 L${SCREEN_WIDTH - 30},195 Z`}
              fill="url(#waterfallGrad)"
            />
            {/* Rocky base */}
            <Polygon
              points={`${SCREEN_WIDTH - 58},190 ${SCREEN_WIDTH - 14},190 ${SCREEN_WIDTH - 24},228 ${SCREEN_WIDTH - 48},228`}
              fill="#5C3A1D"
            />
            <Polygon
              points={`${SCREEN_WIDTH - 48},228 ${SCREEN_WIDTH - 24},228 ${SCREEN_WIDTH - 32},252 ${SCREEN_WIDTH - 40},252`}
              fill="#3D2411"
            />
            {/* Green island crown */}
            <Ellipse cx={SCREEN_WIDTH - 36} cy={188} rx="26" ry="9" fill="#15803D" />
            <Ellipse cx={SCREEN_WIDTH - 36} cy={186} rx="23" ry="7" fill="#22C55E" />
            {/* Trees */}
            <Circle cx={SCREEN_WIDTH - 44} cy={178} r="8" fill="#16A34A" />
            <Circle cx={SCREEN_WIDTH - 28} cy={179} r="7" fill="#4ADE80" />
          </G>

          {/* 3. Mid-Right Medium Island with Waterfall */}
          <G>
            {/* Waterfall */}
            <Path
              d={`M${SCREEN_WIDTH - 45},370 L${SCREEN_WIDTH - 45},490 L${SCREEN_WIDTH - 39},490 L${SCREEN_WIDTH - 39},370 Z`}
              fill="url(#waterfallGrad)"
            />
            {/* Rock base */}
            <Polygon
              points={`${SCREEN_WIDTH - 70},365 ${SCREEN_WIDTH - 20},365 ${SCREEN_WIDTH - 32},405 ${SCREEN_WIDTH - 58},405`}
              fill="#5C3A1D"
            />
            <Polygon
              points={`${SCREEN_WIDTH - 58},405 ${SCREEN_WIDTH - 32},405 ${SCREEN_WIDTH - 42},430 ${SCREEN_WIDTH - 48},430`}
              fill="#3D2411"
            />
            {/* Green crown */}
            <Ellipse cx={SCREEN_WIDTH - 45} cy={363} rx="28" ry="9" fill="#15803D" />
            <Ellipse cx={SCREEN_WIDTH - 45} cy={361} rx="25" ry="7" fill="#22C55E" />
            {/* Foliage */}
            <Circle cx={SCREEN_WIDTH - 54} cy={352} r="8" fill="#16A34A" />
            <Circle cx={SCREEN_WIDTH - 36} cy={353} r="7" fill="#4ADE80" />
          </G>

          {/* 4. Mid-Left Island with Waterfall */}
          <G>
            {/* Waterfall */}
            <Path
              d="M48,430 L48,540 L53,540 L53,430 Z"
              fill="url(#waterfallGrad)"
            />
            {/* Rock base */}
            <Polygon points="26,425 76,425 64,465 38,465" fill="#5C3A1D" />
            <Polygon points="38,465 64,465 54,490 48,490" fill="#3D2411" />
            {/* Green crown */}
            <Ellipse cx="51" cy="423" rx="27" ry="9" fill="#15803D" />
            <Ellipse cx="51" cy="421" rx="24" ry="7" fill="#22C55E" />
            {/* Shrub */}
            <Circle cx="42" cy="412" r="7" fill="#16A34A" />
            <Circle cx="58" cy="414" r="6" fill="#4ADE80" />
          </G>

          {/* ------------------------------------------------------------ */}
          {/* LAYERED PUFFY CLOUDS                                        */}
          {/* ------------------------------------------------------------ */}
          {/* Top-Right Clouds */}
          <Ellipse cx={SCREEN_WIDTH - 30} cy={130} rx={60} ry={35} fill="url(#cloudPuff)" />
          <Ellipse cx={SCREEN_WIDTH + 10} cy={110} rx={50} ry={30} fill="#FFFFFF" opacity={0.8} />

          {/* Top-Left Clouds */}
          <Ellipse cx={30} cy={140} rx={65} ry={35} fill="url(#cloudPuff)" />
          <Ellipse cx={-10} cy={120} rx={50} ry={30} fill="#FFFFFF" opacity={0.8} />

          {/* Mid-Back Clouds (Behind Center Island) */}
          <Ellipse cx={SCREEN_WIDTH / 2 - 90} cy={270} rx={80} ry={40} fill="url(#cloudPuff)" opacity={0.65} />
          <Ellipse cx={SCREEN_WIDTH / 2 + 100} cy={280} rx={90} ry={45} fill="url(#cloudPuff)" opacity={0.65} />
          <Ellipse cx={SCREEN_WIDTH / 2} cy={480} rx={140} ry={50} fill="url(#cloudPuff)" opacity={0.5} />

          {/* ------------------------------------------------------------ */}
          {/* BOTTOM FOREGROUND FOLIAGE & ROCKY CLIFFS                    */}
          {/* ------------------------------------------------------------ */}
          {/* Bottom Dark Cliff Base */}
          <Path
            d={`M0,${SCREEN_HEIGHT - 60} Q${SCREEN_WIDTH / 4},${SCREEN_HEIGHT - 85} ${SCREEN_WIDTH / 2},${SCREEN_HEIGHT - 55} Q${(SCREEN_WIDTH * 3) / 4},${SCREEN_HEIGHT - 90} ${SCREEN_WIDTH},${SCREEN_HEIGHT - 65} L${SCREEN_WIDTH},${SCREEN_HEIGHT} L0,${SCREEN_HEIGHT} Z`}
            fill="#1E293B"
          />

          {/* Foreground Green Foliage & Grass Bushes (Left side) */}
          <Circle cx="20" cy={SCREEN_HEIGHT - 45} r="36" fill="#15803D" />
          <Circle cx="50" cy={SCREEN_HEIGHT - 40} r="30" fill="#16A34A" />
          <Circle cx="80" cy={SCREEN_HEIGHT - 30} r="26" fill="#22C55E" />
          <Circle cx="15" cy={SCREEN_HEIGHT - 35} r="24" fill="#4ADE80" />

          {/* Foreground Green Foliage (Right side) */}
          <Circle cx={SCREEN_WIDTH - 20} cy={SCREEN_HEIGHT - 45} r="38" fill="#15803D" />
          <Circle cx={SCREEN_WIDTH - 55} cy={SCREEN_HEIGHT - 40} r="32" fill="#16A34A" />
          <Circle cx={SCREEN_WIDTH - 85} cy={SCREEN_HEIGHT - 30} r="28" fill="#22C55E" />
          <Circle cx={SCREEN_WIDTH - 15} cy={SCREEN_HEIGHT - 35} r="25" fill="#4ADE80" />

          {/* Bottom Center Lush Turf Mound */}
          <Ellipse cx={SCREEN_WIDTH / 2} cy={SCREEN_HEIGHT - 15} rx={110} ry={35} fill="#16A34A" />
          <Ellipse cx={SCREEN_WIDTH / 2} cy={SCREEN_HEIGHT - 10} rx={95} ry={28} fill="#22C55E" />

          {/* Rocky Grey Boulders Framing Bottom Corners */}
          {/* Bottom-Left Rocks */}
          <Path
            d={`M70,${SCREEN_HEIGHT - 25} Q85,${SCREEN_HEIGHT - 55} 105,${SCREEN_HEIGHT - 45} Q120,${SCREEN_HEIGHT - 30} 115,${SCREEN_HEIGHT - 10} Q90,${SCREEN_HEIGHT - 10} 70,${SCREEN_HEIGHT - 25} Z`}
            fill="#475569"
          />
          <Path
            d={`M75,${SCREEN_HEIGHT - 25} Q85,${SCREEN_HEIGHT - 48} 98,${SCREEN_HEIGHT - 42}`}
            stroke="#94A3B8"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Bottom-Right Rocks */}
          <Path
            d={`M${SCREEN_WIDTH - 70},${SCREEN_HEIGHT - 25} Q${SCREEN_WIDTH - 85},${SCREEN_HEIGHT - 55} ${SCREEN_WIDTH - 105},${SCREEN_HEIGHT - 45} Q${SCREEN_WIDTH - 120},${SCREEN_HEIGHT - 30} ${SCREEN_WIDTH - 115},${SCREEN_HEIGHT - 10} Q${SCREEN_WIDTH - 90},${SCREEN_HEIGHT - 10} ${SCREEN_WIDTH - 70},${SCREEN_HEIGHT - 25} Z`}
            fill="#475569"
          />
          <Path
            d={`M${SCREEN_WIDTH - 75},${SCREEN_HEIGHT - 25} Q${SCREEN_WIDTH - 85},${SCREEN_HEIGHT - 48} ${SCREEN_WIDTH - 98},${SCREEN_HEIGHT - 42}`}
            stroke="#94A3B8"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </View>

      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.contentContainer}>
          {/* ============================================================== */}
          {/* 2. TOP HEADER: Level Badge + Settings (Left) | Coin Pill (Right) */}
          {/* ============================================================== */}
          <View style={styles.topBar}>
            {/* Top-Left: Settings Icon + Level 12 Progress Badge */}
            <View style={styles.leftHeaderGroup}>
              {/* Rounded Settings Gear Button with 3D dimensional depth */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSettingsPress}
                style={styles.settingsButton}
                accessibilityLabel="Settings"
              >
                <LinearGradient
                  colors={['#38BDF8', '#0284C7', '#0369A1']}
                  style={styles.settingsGradient}
                >
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Circle cx="12" cy="12" r="3.5" stroke="#FFFFFF" strokeWidth={2.2} />
                    <Path
                      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
                      stroke="#FFFFFF"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </LinearGradient>
              </TouchableOpacity>

              {/* Stylized 'Level 12' Progress Badge with 3D Golden Crown */}
              <View style={styles.levelBadge}>
                {/* 3D Golden Crown Icon */}
                <View style={styles.crownContainer}>
                  <Svg width={28} height={28} viewBox="0 0 32 32" fill="none">
                    <Defs>
                      <SvgLinearGradient id="crownGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor="#FFF275" />
                        <Stop offset="40%" stopColor="#FBBF24" />
                        <Stop offset="100%" stopColor="#D97706" />
                      </SvgLinearGradient>
                    </Defs>
                    {/* Crown Base & Peaks */}
                    <Path
                      d="M4,24 L28,24 L26,12 L20,18 L16,7 L12,18 L6,12 Z"
                      fill="url(#crownGrad)"
                      stroke="#B45309"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    {/* Crown Rim Band */}
                    <Rect x="4" y="22" width="24" height="4" rx="2" fill="#F59E0B" stroke="#92400E" strokeWidth="1" />
                    {/* Center Ruby Jewel */}
                    <Circle cx="16" cy="18" r="2" fill="#EF4444" stroke="#991B1B" strokeWidth="0.8" />
                    {/* Side Sapphires */}
                    <Circle cx="10" cy="20" r="1.5" fill="#3B82F6" />
                    <Circle cx="22" cy="20" r="1.5" fill="#3B82F6" />
                  </Svg>
                </View>

                {/* Level Title & Mini Progress Pill */}
                <View style={styles.levelInfoCol}>
                  <Text style={styles.levelBadgeTitle}>Level {activeLevel}</Text>
                  {/* Green Progress Bar */}
                  <View style={styles.levelProgressTrack}>
                    <View style={styles.levelProgressFill}>
                      <Text style={styles.levelProgressText}>{winsProgress}/20</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Top-Right: Gold 'Coin Pill' (Displaying "195" with "+" Icon) */}
            <View style={styles.coinPillContainer}>
              {/* 3D Gold Coin with Star */}
              <View style={styles.coinIconWrapper}>
                <Svg width={28} height={28} viewBox="0 0 32 32" fill="none">
                  <Defs>
                    <SvgLinearGradient id="goldCoinMain" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0%" stopColor="#FFF275" />
                      <Stop offset="50%" stopColor="#FBBF24" />
                      <Stop offset="100%" stopColor="#D97706" />
                    </SvgLinearGradient>
                    <SvgLinearGradient id="goldCoinRim" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0%" stopColor="#FFE066" />
                      <Stop offset="100%" stopColor="#B45309" />
                    </SvgLinearGradient>
                  </Defs>
                  {/* Coin Rim */}
                  <Circle cx="16" cy="16" r="14.5" fill="url(#goldCoinRim)" stroke="#92400E" strokeWidth="1.2" />
                  {/* Coin Center Face */}
                  <Circle cx="16" cy="16" r="12" fill="url(#goldCoinMain)" stroke="#FDE68A" strokeWidth="0.8" />
                  {/* Star Emblem */}
                  <Polygon
                    points="16,7 18.5,12.2 24.2,13 20.1,17 21.1,22.7 16,20 10.9,22.7 11.9,17 7.8,13 13.5,12.2"
                    fill="#FFFFFF"
                    opacity={0.9}
                  />
                </Svg>
              </View>

              {/* Coin Counter Number */}
              <Text style={styles.coinBalanceText}>{coinBalance}</Text>

              {/* Plus (+) Button */}
              <TouchableOpacity activeOpacity={0.8} style={styles.coinAddButton}>
                <LinearGradient colors={['#38BDF8', '#0284C7']} style={styles.coinAddGradient}>
                  <Text style={styles.coinAddText}>+</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* ============================================================== */}
          {/* 3. BRANDING: Massive 3D 'ArrowMaze' Title + Tagline             */}
          {/* ============================================================== */}
          <View style={styles.brandSection}>
            {/* Title Row with 3D Arrow Accents on Left & Right */}
            <View style={styles.titleRow}>
              {/* Left Blue 3D Arrow Accent */}
              <View style={styles.arrowWingLeft}>
                <Svg width={32} height={32} viewBox="0 0 36 36" fill="none">
                  {/* Drop Shadow */}
                  <Polygon points="4,18 24,4 24,12 34,12 34,24 24,24 24,32" fill="#034E8C" />
                  {/* Front Face */}
                  <Polygon points="4,16 24,2 24,10 34,10 34,22 24,22 24,30" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.8" />
                </Svg>
              </View>

              {/* Main 3D Title: "Arrow" (White/Blue) + "Maze" (Golden-Yellow) */}
              <View style={styles.titleTextContainer}>
                {/* 3D Drop Extrusion Layers */}
                <View style={styles.titleExtrusionLayer}>
                  <Text style={[styles.titleWord, styles.arrowWordExtrusion]}>Arrow</Text>
                  <Text style={[styles.titleWord, styles.mazeWordExtrusion]}>Maze</Text>
                </View>
                {/* 3D Deep Outline Layer */}
                <View style={styles.titleOutlineLayer}>
                  <Text style={[styles.titleWord, styles.arrowWordOutline]}>Arrow</Text>
                  <Text style={[styles.titleWord, styles.mazeWordOutline]}>Maze</Text>
                </View>
                {/* Top Bright Face Layer */}
                <View style={styles.titleFaceLayer}>
                  <Text style={[styles.titleWord, styles.arrowWordFace]}>Arrow</Text>
                  <Text style={[styles.titleWord, styles.mazeWordFace]}>Maze</Text>
                </View>
              </View>

              {/* Right Blue 3D Arrow Accent */}
              <View style={styles.arrowWingRight}>
                <Svg width={32} height={32} viewBox="0 0 36 36" fill="none">
                  {/* Drop Shadow */}
                  <Polygon points="32,18 12,4 12,12 2,12 2,24 12,24 12,32" fill="#034E8C" />
                  {/* Front Face */}
                  <Polygon points="32,16 12,2 12,10 2,10 2,22 12,22 12,30" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.8" />
                </Svg>
              </View>
            </View>

            {/* Tagline on Dark Brush Stroke Banner */}
            <View style={styles.taglineBrushBanner}>
              <Text style={styles.taglineText}>
                Think <Text style={styles.taglineDot}>•</Text> Tap <Text style={styles.taglineDot}>•</Text> Solve
              </Text>
            </View>
          </View>

          {/* ============================================================== */}
          {/* 4. CENTRAL ISOMETRIC 3D PLATFORM (Clean Maze on Floating Island)*/}
          {/* ============================================================== */}
          <View style={styles.islandContainer}>
            <FloatingIslandMaze size={Math.min(SCREEN_WIDTH * 0.88, 330)} />
          </View>

          {/* ============================================================== */}
          {/* 5. SYMMETRICAL 3D BLUE BUTTON STACK (Play & Levels Exact Match)*/}
          {/* ============================================================== */}
          <View style={styles.buttonStack}>
            {/* 1. PLAY BUTTON (with Yellow Glow-Sparkle Accents on sides) */}
            <Animated.View style={[styles.buttonWrapper, animatedPlayStyle]}>
              {/* Left Glow-Sparkles (3 Rays) */}
              <View style={styles.sparkleSideLeft}>
                <Svg width={24} height={36} viewBox="0 0 24 36" fill="none">
                  <Line x1="18" y1="8" x2="6" y2="4" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
                  <Line x1="20" y1="18" x2="4" y2="18" stroke="#FDE047" strokeWidth="3.5" strokeLinecap="round" />
                  <Line x1="18" y1="28" x2="6" y2="32" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
                </Svg>
              </View>

              {/* 3D Button Physical Body */}
              <TouchableOpacity
                activeOpacity={0.92}
                onPressIn={handlePlayPressIn}
                onPressOut={handlePlayPressOut}
                onPress={handlePlayPress}
                style={styles.button3DBase}
                accessibilityLabel="Play Game"
              >
                {/* 3D Dark Under-Bevel */}
                <View style={styles.buttonBevelBottom} />

                {/* Glossy Front Gradient Face */}
                <LinearGradient
                  colors={['#38BDF8', '#0284C7', '#0369A1']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.buttonFrontFace}
                >
                  {/* Top Gloss Reflection Highlight */}
                  <View style={styles.glossHighlightTop} />

                  {/* Centered Content Row: ▶ Play */}
                  <View style={styles.buttonContentRow}>
                    <View style={styles.playIconBadge}>
                      <Svg width={24} height={24} viewBox="0 0 28 28" fill="#FFFFFF">
                        <Polygon points="7,4 23,14 7,24" />
                      </Svg>
                    </View>
                    <Text style={styles.buttonText}>Play</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Right Glow-Sparkles (3 Rays) */}
              <View style={styles.sparkleSideRight}>
                <Svg width={24} height={36} viewBox="0 0 24 36" fill="none">
                  <Line x1="6" y1="8" x2="18" y2="4" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
                  <Line x1="4" y1="18" x2="20" y2="18" stroke="#FDE047" strokeWidth="3.5" strokeLinecap="round" />
                  <Line x1="6" y1="28" x2="18" y2="32" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
                </Svg>
              </View>
            </Animated.View>

            {/* 2. LEVELS BUTTON (Exact Same Dimensions & Styling as Play) */}
            <Animated.View style={[styles.buttonWrapper, animatedLevelsStyle]}>
              <TouchableOpacity
                activeOpacity={0.92}
                onPressIn={handleLevelsPressIn}
                onPressOut={handleLevelsPressOut}
                onPress={handleLevelsPress}
                style={styles.button3DBase}
                accessibilityLabel="Select Level"
              >
                {/* 3D Dark Under-Bevel */}
                <View style={styles.buttonBevelBottom} />

                {/* Glossy Front Gradient Face */}
                <LinearGradient
                  colors={['#38BDF8', '#0284C7', '#0369A1']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.buttonFrontFace}
                >
                  {/* Top Gloss Reflection Highlight */}
                  <View style={styles.glossHighlightTop} />

                  {/* Centered Content Row: ⚃ Levels */}
                  <View style={styles.buttonContentRow}>
                    <View style={styles.levelsIconBadge}>
                      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                        <Rect x="2.5" y="2.5" width="8" height="8" rx="2" fill="#FFFFFF" />
                        <Rect x="13.5" y="2.5" width="8" height="8" rx="2" fill="#FFFFFF" />
                        <Rect x="2.5" y="13.5" width="8" height="8" rx="2" fill="#FFFFFF" />
                        <Rect x="13.5" y="13.5" width="8" height="8" rx="2" fill="#FFFFFF" />
                      </Svg>
                    </View>
                    <Text style={styles.buttonText}>Levels</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* ============================================================== */}
          {/* 6. BOTTOM-LEFT WOODEN SIGNPOST ("Small Moves Big Paths")       */}
          {/* ============================================================== */}
          <View style={styles.bottomSignpostAnchor} pointerEvents="none">
            <WoodenSignpost width={92} height={92} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A8CEB',
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 4,
  },

  /* ---------------------------------------------------------------------- */
  /* TOP HEADER STYLING                                                     */
  /* ---------------------------------------------------------------------- */
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    zIndex: 10,
  },
  leftHeaderGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#7DD3FC',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
    overflow: 'hidden',
  },
  settingsGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 28, 68, 0.88)',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#38BDF8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  crownContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelInfoCol: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  levelBadgeTitle: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  levelProgressTrack: {
    width: 60,
    height: 14,
    backgroundColor: '#0F274E',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#1E40AF',
    overflow: 'hidden',
    marginTop: 2,
  },
  levelProgressFill: {
    width: '55%',
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelProgressText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 9,
    color: '#FFFFFF',
    lineHeight: 12,
  },

  /* Coin Pill */
  coinPillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 28, 68, 0.88)',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#38BDF8',
    paddingLeft: 4,
    paddingRight: 6,
    paddingVertical: 4,
    gap: 8,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  coinIconWrapper: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinBalanceText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  coinAddButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    overflow: 'hidden',
  },
  coinAddGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinAddText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: -2,
  },

  /* ---------------------------------------------------------------------- */
  /* BRANDING SECTION STYLING ("ArrowMaze" 3D)                              */
  /* ---------------------------------------------------------------------- */
  brandSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    zIndex: 5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowWingLeft: {
    marginRight: -6,
    marginTop: 2,
  },
  arrowWingRight: {
    marginLeft: -6,
    marginTop: 2,
  },
  titleTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },
  titleExtrusionLayer: {
    position: 'absolute',
    flexDirection: 'row',
    top: 5,
  },
  titleOutlineLayer: {
    position: 'absolute',
    flexDirection: 'row',
    top: 2,
  },
  titleFaceLayer: {
    position: 'absolute',
    flexDirection: 'row',
    top: 0,
  },
  titleWord: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 38,
    letterSpacing: -0.5,
  },
  /* "Arrow" 3D Layers */
  arrowWordExtrusion: {
    color: '#074880',
  },
  arrowWordOutline: {
    color: '#0369A1',
  },
  arrowWordFace: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(56, 189, 248, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  /* "Maze" 3D Layers */
  mazeWordExtrusion: {
    color: '#78350F',
    marginLeft: 3,
  },
  mazeWordOutline: {
    color: '#B45309',
    marginLeft: 3,
  },
  mazeWordFace: {
    color: '#FBBF24',
    marginLeft: 3,
    textShadowColor: 'rgba(245, 158, 11, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },

  /* Tagline Brush Banner */
  taglineBrushBanner: {
    backgroundColor: 'rgba(10, 26, 60, 0.92)',
    paddingHorizontal: 22,
    paddingVertical: 4.5,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.45)',
    marginTop: 2,
  },
  taglineText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  taglineDot: {
    color: '#38BDF8',
    fontWeight: '900',
  },

  /* ---------------------------------------------------------------------- */
  /* CENTRAL ISOMETRIC 3D PLATFORM                                          */
  /* ---------------------------------------------------------------------- */
  islandContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    zIndex: 4,
  },

  /* ---------------------------------------------------------------------- */
  /* SYMMETRICAL 3D BLUE BUTTON STACK                                       */
  /* ---------------------------------------------------------------------- */
  buttonStack: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 6,
    zIndex: 6,
  },
  buttonWrapper: {
    width: '88%',
    maxWidth: 330,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleSideLeft: {
    position: 'absolute',
    left: -26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleSideRight: {
    position: 'absolute',
    right: -26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button3DBase: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonBevelBottom: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#034E8C',
  },
  buttonFrontFace: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    borderWidth: 2.2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glossHighlightTop: {
    position: 'absolute',
    top: 2,
    left: 14,
    right: 14,
    height: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  playIconBadge: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelsIconBadge: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 27,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: '#034E8C',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  /* ---------------------------------------------------------------------- */
  /* BOTTOM-LEFT BULKY WOODEN SIGNPOST                                      */
  /* ---------------------------------------------------------------------- */
  bottomSignpostAnchor: {
    position: 'absolute',
    left: 8,
    bottom: 2,
    zIndex: 8,
  },
});
