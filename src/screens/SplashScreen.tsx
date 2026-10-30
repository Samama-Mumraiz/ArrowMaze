import React, { useEffect, useRef, useCallback } from 'react';
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
  Polygon,
  Circle,
  G,
  Ellipse,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { typography } from '../theme/typography';
import FloatingIslandMaze from '../view/components/FloatingIslandMaze';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SplashScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const progress = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const hasNavigated = useRef(false);

  const handleNavigation = useCallback(() => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    navigation.navigate('Home');
  }, [navigation]);

  useEffect(() => {
    // Smooth loading progress animation (2.6s) with ease-in-out curve
    progress.value = withTiming(
      1,
      {
        duration: 2600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
      (finished) => {
        if (finished) {
          runOnJS(handleNavigation)();
        }
      }
    );
  }, [progress, handleNavigation]);

  // Loading Bar Width Animation
  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${Math.max(progress.value * 100, 4)}%`,
  }));

  // "TAP TO SKIP" Button Spring Press Feedback
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleSkipPressIn = () => {
    buttonScale.value = withTiming(0.93, {
      duration: 80,
      easing: Easing.out(Easing.ease),
    });
  };

  const handleSkipPressOut = () => {
    buttonScale.value = withSpring(1, { damping: 12, stiffness: 240 });
  };

  const handleSkipPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Platform fallback
    }
    handleNavigation();
  };

  return (
    <View style={styles.container}>
      {/* ============================================================== */}
      {/* 1. DAYTIME SKY & FLOATING WATERFALL ISLANDS BACKGROUND         */}
      {/* ============================================================== */}
      <LinearGradient
        colors={['#1A8CEB', '#38BDF8', '#7DD3FC', '#BAE6FD']}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* SVG Layer: Waterfalls, Floating Islands, Clouds, and Foliage */}
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

            {/* Top Cyan Loop Glow */}
            <SvgRadialGradient id="loopAura" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#00F0FF" stopOpacity="0.5" />
              <Stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
            </SvgRadialGradient>

            <SvgLinearGradient id="loopGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#38BDF8" />
              <Stop offset="50%" stopColor="#00F0FF" />
              <Stop offset="100%" stopColor="#0284C7" />
            </SvgLinearGradient>
          </Defs>

          {/* Title Arcing Halo Aura */}
          <Ellipse cx={SCREEN_WIDTH / 2} cy={160} rx={160} ry={70} fill="url(#titleAura)" />
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
          {/* Top-Left Floating Island with Waterfall */}
          <G>
            <Path d="M30,175 L30,285 L36,285 L36,175 Z" fill="url(#waterfallGrad)" />
            <Polygon points="10,170 52,170 42,205 20,205" fill="#5C3A1D" />
            <Polygon points="20,205 42,205 34,225 28,225" fill="#3D2411" />
            <Ellipse cx="31" cy="168" rx="24" ry="9" fill="#15803D" />
            <Ellipse cx="31" cy="166" rx="22" ry="7" fill="#22C55E" />
            <Circle cx="22" cy="158" r="7" fill="#16A34A" />
            <Circle cx="38" cy="159" r="6" fill="#4ADE80" />
          </G>

          {/* Top-Right Floating Island with Waterfall */}
          <G>
            <Path
              d={`M${SCREEN_WIDTH - 36},185 L${SCREEN_WIDTH - 36},300 L${SCREEN_WIDTH - 30},300 L${SCREEN_WIDTH - 30},185 Z`}
              fill="url(#waterfallGrad)"
            />
            <Polygon
              points={`${SCREEN_WIDTH - 58},180 ${SCREEN_WIDTH - 14},180 ${SCREEN_WIDTH - 24},218 ${SCREEN_WIDTH - 48},218`}
              fill="#5C3A1D"
            />
            <Polygon
              points={`${SCREEN_WIDTH - 48},218 ${SCREEN_WIDTH - 24},218 ${SCREEN_WIDTH - 32},242 ${SCREEN_WIDTH - 40},242`}
              fill="#3D2411"
            />
            <Ellipse cx={SCREEN_WIDTH - 36} cy={178} rx="26" ry="9" fill="#15803D" />
            <Ellipse cx={SCREEN_WIDTH - 36} cy={176} rx="23" ry="7" fill="#22C55E" />
            <Circle cx={SCREEN_WIDTH - 44} cy={168} r="8" fill="#16A34A" />
            <Circle cx={SCREEN_WIDTH - 28} cy={169} r="7" fill="#4ADE80" />
          </G>

          {/* Mid-Right Island with Waterfall */}
          <G>
            <Path
              d={`M${SCREEN_WIDTH - 45},360 L${SCREEN_WIDTH - 45},480 L${SCREEN_WIDTH - 39},480 L${SCREEN_WIDTH - 39},360 Z`}
              fill="url(#waterfallGrad)"
            />
            <Polygon
              points={`${SCREEN_WIDTH - 70},355 ${SCREEN_WIDTH - 20},355 ${SCREEN_WIDTH - 32},395 ${SCREEN_WIDTH - 58},395`}
              fill="#5C3A1D"
            />
            <Polygon
              points={`${SCREEN_WIDTH - 58},395 ${SCREEN_WIDTH - 32},395 ${SCREEN_WIDTH - 42},420 ${SCREEN_WIDTH - 48},420`}
              fill="#3D2411"
            />
            <Ellipse cx={SCREEN_WIDTH - 45} cy={353} rx="28" ry="9" fill="#15803D" />
            <Ellipse cx={SCREEN_WIDTH - 45} cy={351} rx="25" ry="7" fill="#22C55E" />
            <Circle cx={SCREEN_WIDTH - 54} cy={342} r="8" fill="#16A34A" />
            <Circle cx={SCREEN_WIDTH - 36} cy={343} r="7" fill="#4ADE80" />
          </G>

          {/* Mid-Left Island with Waterfall */}
          <G>
            <Path d="M46,420 L46,530 L51,530 L51,420 Z" fill="url(#waterfallGrad)" />
            <Polygon points="24,415 74,415 62,455 36,455" fill="#5C3A1D" />
            <Polygon points="36,455 62,455 52,480 46,480" fill="#3D2411" />
            <Ellipse cx="49" cy="413" rx="27" ry="9" fill="#15803D" />
            <Ellipse cx="49" cy="411" rx="24" ry="7" fill="#22C55E" />
            <Circle cx="40" cy="402" r="7" fill="#16A34A" />
            <Circle cx="56" cy="404" r="6" fill="#4ADE80" />
          </G>

          {/* ------------------------------------------------------------ */}
          {/* LAYERED PUFFY CLOUDS                                        */}
          {/* ------------------------------------------------------------ */}
          <Ellipse cx={SCREEN_WIDTH - 30} cy={120} rx={60} ry={35} fill="url(#cloudPuff)" />
          <Ellipse cx={SCREEN_WIDTH + 10} cy={100} rx={50} ry={30} fill="#FFFFFF" opacity={0.8} />

          <Ellipse cx={30} cy={130} rx={65} ry={35} fill="url(#cloudPuff)" />
          <Ellipse cx={-10} cy={110} rx={50} ry={30} fill="#FFFFFF" opacity={0.8} />

          <Ellipse cx={SCREEN_WIDTH / 2 - 90} cy={260} rx={80} ry={40} fill="url(#cloudPuff)" opacity={0.65} />
          <Ellipse cx={SCREEN_WIDTH / 2 + 100} cy={270} rx={90} ry={45} fill="url(#cloudPuff)" opacity={0.65} />
          <Ellipse cx={SCREEN_WIDTH / 2} cy={470} rx={140} ry={50} fill="url(#cloudPuff)" opacity={0.5} />

          {/* ------------------------------------------------------------ */}
          {/* BOTTOM FOREGROUND FOLIAGE & ROCKY CLIFFS                    */}
          {/* ------------------------------------------------------------ */}
          <Path
            d={`M0,${SCREEN_HEIGHT - 60} Q${SCREEN_WIDTH / 4},${SCREEN_HEIGHT - 85} ${SCREEN_WIDTH / 2},${SCREEN_HEIGHT - 55} Q${(SCREEN_WIDTH * 3) / 4},${SCREEN_HEIGHT - 90} ${SCREEN_WIDTH},${SCREEN_HEIGHT - 65} L${SCREEN_WIDTH},${SCREEN_HEIGHT} L0,${SCREEN_HEIGHT} Z`}
            fill="#1E293B"
          />

          {/* Foliage (Left) */}
          <Circle cx="20" cy={SCREEN_HEIGHT - 45} r="36" fill="#15803D" />
          <Circle cx="50" cy={SCREEN_HEIGHT - 40} r="30" fill="#16A34A" />
          <Circle cx="80" cy={SCREEN_HEIGHT - 30} r="26" fill="#22C55E" />
          <Circle cx="15" cy={SCREEN_HEIGHT - 35} r="24" fill="#4ADE80" />

          {/* Foliage (Right) */}
          <Circle cx={SCREEN_WIDTH - 20} cy={SCREEN_HEIGHT - 45} r="38" fill="#15803D" />
          <Circle cx={SCREEN_WIDTH - 55} cy={SCREEN_HEIGHT - 40} r="32" fill="#16A34A" />
          <Circle cx={SCREEN_WIDTH - 85} cy={SCREEN_HEIGHT - 30} r="28" fill="#22C55E" />
          <Circle cx={SCREEN_WIDTH - 15} cy={SCREEN_HEIGHT - 35} r="25" fill="#4ADE80" />

          {/* Bottom Turf Mound */}
          <Ellipse cx={SCREEN_WIDTH / 2} cy={SCREEN_HEIGHT - 15} rx={110} ry={35} fill="#16A34A" />
          <Ellipse cx={SCREEN_WIDTH / 2} cy={SCREEN_HEIGHT - 10} rx={95} ry={28} fill="#22C55E" />

          {/* Rocky Grey Boulders */}
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
          {/* 2. TOP BRANDING: Cyan Loop Icon + 3D 'ArrowMaze' + Tagline    */}
          {/* ============================================================== */}
          <View style={styles.brandSection}>
            {/* Top Glowing Cyan Loop-Arrow Mark */}
            <View style={styles.topLogoMark}>
              <Svg width={46} height={46} viewBox="0 0 52 52" fill="none">
                <Circle cx="26" cy="26" r="23" fill="url(#loopAura)" />
                {/* Outer Cyan Glow Effect */}
                <Path
                  d="M34,14 L16,14 C13,14 11,16 11,19 L11,37 C11,40 13,42 16,42 L36,42 C39,42 41,40 41,37 L41,27 C41,25 39,24 37,24 L27,24"
                  stroke="#00F0FF"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity="0.3"
                />
                {/* Main Neon Geometric Stroke */}
                <Path
                  d="M34,14 L16,14 C13,14 11,16 11,19 L11,37 C11,40 13,42 16,42 L36,42 C39,42 41,40 41,37 L41,27 C41,25 39,24 37,24 L27,24"
                  stroke="url(#loopGrad)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Inner Crisp White Highlight */}
                <Path
                  d="M34,14 L16,14 C13,14 11,16 11,19 L11,37 C11,40 13,42 16,42 L36,42 C39,42 41,40 41,37 L41,27 C41,25 39,24 37,24 L27,24"
                  stroke="#FFFFFF"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity="0.85"
                />
                {/* Exiting Arrow pointing up-right */}
                <Path
                  d="M27,24 L42,15"
                  stroke="url(#loopGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <Polygon
                  points="35,10 47,12 43,23"
                  fill="#00F0FF"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>

            {/* Title Row with 3D Arrow Accents on Left & Right */}
            <View style={styles.titleRow}>
              {/* Left Blue 3D Arrow Accent */}
              <View style={styles.arrowWingLeft}>
                <Svg width={32} height={32} viewBox="0 0 36 36" fill="none">
                  <Polygon points="4,18 24,4 24,12 34,12 34,24 24,24 24,32" fill="#034E8C" />
                  <Polygon
                    points="4,16 24,2 24,10 34,10 34,22 24,22 24,30"
                    fill="#38BDF8"
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                  />
                </Svg>
              </View>

              {/* Main 3D Title: "Arrow" (White/Blue) + "Maze" (Golden-Yellow) */}
              <View style={styles.titleTextContainer}>
                {/* 3D Extrusion Shadow Layer */}
                <View style={styles.titleExtrusionLayer}>
                  <Text style={[styles.titleWord, styles.arrowWordExtrusion]}>Arrow</Text>
                  <Text style={[styles.titleWord, styles.mazeWordExtrusion]}>Maze</Text>
                </View>
                {/* 3D Outline Layer */}
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
                  <Polygon points="32,18 12,4 12,12 2,12 2,24 12,24 12,32" fill="#034E8C" />
                  <Polygon
                    points="32,16 12,2 12,10 2,10 2,22 12,22 12,30"
                    fill="#38BDF8"
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                  />
                </Svg>
              </View>
            </View>

            {/* Tagline on Dark Brush Banner */}
            <View style={styles.taglineBrushBanner}>
              <Text style={styles.taglineText}>
                Think <Text style={styles.taglineDot}>•</Text> Tap <Text style={styles.taglineDot}>•</Text> Solve
              </Text>
            </View>
          </View>

          {/* ============================================================== */}
          {/* 3. CENTER GRAPHIC: 3D Floating Earth & Grass Island Maze       */}
          {/* ============================================================== */}
          <View style={styles.islandContainer}>
            <FloatingIslandMaze size={Math.min(SCREEN_WIDTH * 0.88, 320)} />
          </View>

          {/* ============================================================== */}
          {/* 4. BOTTOM SECTION: 3D Glossy Loading Bar + "Loading..." + Skip */}
          {/* ============================================================== */}
          <View style={styles.bottomSection}>
            {/* 3D Glossy Rounded Loading Bar Track */}
            <View style={styles.progressBarWrapper}>
              <View style={styles.progressBarTrack}>
                {/* Animated Gold Fill Bar */}
                <Animated.View style={[styles.progressBarFill, animatedProgressStyle]}>
                  <LinearGradient
                    colors={['#FFF9A6', '#FDE047', '#F59E0B', '#D97706']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={StyleSheet.absoluteFill}
                  />
                  {/* Top Gloss Reflection Streak */}
                  <View style={styles.progressGlossHighlight} />
                  {/* Leading Edge Bright Energy Tip */}
                  <View style={styles.progressLeadingGlow} />
                </Animated.View>
              </View>
            </View>

            {/* "Loading..." Cartoon Typography */}
            <Text style={styles.loadingText}>Loading...</Text>

            {/* 3D Blue Glossy "TAP TO SKIP" Pill Button */}
            <Animated.View style={[styles.skipButtonWrapper, animatedButtonStyle]}>
              <TouchableOpacity
                activeOpacity={0.92}
                onPressIn={handleSkipPressIn}
                onPressOut={handleSkipPressOut}
                onPress={handleSkipPress}
                style={styles.skip3DBase}
                accessibilityLabel="Tap to Skip Loading"
              >
                {/* 3D Dark Under-Bevel Base */}
                <View style={styles.skipBevelBottom} />

                {/* Glossy Cyan/Blue Front Face */}
                <LinearGradient
                  colors={['#38BDF8', '#0284C7', '#0369A1']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.skipFrontFace}
                >
                  {/* Top Gloss Reflection Highlight */}
                  <View style={styles.skipGlossHighlight} />

                  {/* Centered Button Text */}
                  <Text style={styles.skipButtonText}>TAP TO SKIP</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
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
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 22,
  },

  /* ---------------------------------------------------------------------- */
  /* TOP BRANDING SECTION                                                   */
  /* ---------------------------------------------------------------------- */
  brandSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    zIndex: 5,
  },
  topLogoMark: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
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
  /* "Arrow" Word Layers */
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
  /* "Maze" Word Layers */
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
    marginTop: 4,
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
  /* CENTER GRAPHIC                                                         */
  /* ---------------------------------------------------------------------- */
  islandContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    zIndex: 4,
  },

  /* ---------------------------------------------------------------------- */
  /* BOTTOM SECTION: LOADING BAR & SKIP BUTTON                              */
  /* ---------------------------------------------------------------------- */
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
  },

  /* 3D Glossy Rounded Loading Bar */
  progressBarWrapper: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarTrack: {
    width: '100%',
    height: 24,
    borderRadius: 12,
    backgroundColor: '#071F48',
    borderWidth: 2.8,
    borderColor: '#0284C7',
    borderTopColor: '#38BDF8',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 9,
    overflow: 'hidden',
    position: 'relative',
  },
  progressGlossHighlight: {
    position: 'absolute',
    top: 2,
    left: 4,
    right: 4,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  progressLeadingGlow: {
    position: 'absolute',
    right: 2,
    top: 3,
    bottom: 3,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },

  /* "Loading..." Typography */
  loadingText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 19,
    color: '#0F356B',
    marginTop: 12,
    marginBottom: 16,
    letterSpacing: 0.6,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  /* 3D Blue Glossy "TAP TO SKIP" Pill Button */
  skipButtonWrapper: {
    width: '100%',
    maxWidth: 246,
    alignItems: 'center',
  },
  skip3DBase: {
    width: '100%',
    height: 52,
    position: 'relative',
  },
  skipBevelBottom: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    height: 48,
    backgroundColor: '#013D75',
    borderRadius: 26,
  },
  skipFrontFace: {
    width: '100%',
    height: 48,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#7DD3FC',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  skipGlossHighlight: {
    position: 'absolute',
    top: 2,
    left: 14,
    right: 14,
    height: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.32)',
  },
  skipButtonText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(1, 61, 117, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
});
