import React, { useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Path,
  Rect,
  Circle,
  Polygon,
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

const LEVELS_MAP_BG = require('../../assets/levels_map.jpg');

// Exact percentage coordinates (X, Y) along the winding trail in levels_map.jpg
const LEVEL_NODES = [
  { level: 1, leftPct: 69.5, topPct: 90.0 }, // Bottom right start
  { level: 2, leftPct: 82.1, topPct: 80.1 }, // Right bank lower curve
  { level: 3, leftPct: 65.3, topPct: 74.4 }, // Lower center-right
  { level: 4, leftPct: 43.9, topPct: 73.4 }, // Center-left loop
  { level: 5, leftPct: 27.3, topPct: 68.7 }, // Far-left sweep
  { level: 6, leftPct: 44.7, topPct: 62.9 }, // Mid-left plain
  { level: 7, leftPct: 64.5, topPct: 60.1 }, // Mid-center path
  { level: 8, leftPct: 82.8, topPct: 57.0 }, // Right bank before bridge
  { level: 9, leftPct: 37.1, topPct: 35.5 }, // Across bridge left bank
  { level: 10, leftPct: 72.1, topPct: 41.6 }, // Cobblestone path climb
  { level: 11, leftPct: 71.3, topPct: 26.6 }, // Snowy mountain slope
  { level: 12, leftPct: 53.2, topPct: 22.7 }, // Snowy summit peak
];

const NODE_SIZE = 54;

interface MapNodeProps {
  level: number;
  leftPct: number;
  topPct: number;
  isUnlocked: boolean;
  stars: number;
  onPress: (level: number) => void;
}

function PathfinderNode({
  level,
  leftPct,
  topPct,
  isUnlocked,
  stars,
  onPress,
}: MapNodeProps): React.JSX.Element {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isUnlocked) return;
    scale.value = withTiming(0.9, { duration: 80, easing: Easing.out(Easing.ease) });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 240 });
  };

  const handlePress = () => {
    if (!isUnlocked) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // platform fallback
    }
    onPress(level);
  };

  return (
    <View
      style={[
        styles.nodePositioner,
        {
          left: `${leftPct}%`,
          top: `${topPct}%`,
        },
      ]}
    >
      <Animated.View style={[styles.nodeWrapper, animatedStyle]}>
        <TouchableOpacity
          activeOpacity={isUnlocked ? 0.9 : 1}
          disabled={!isUnlocked}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          style={[styles.node3DBase, !isUnlocked && styles.nodeLocked]}
          accessibilityLabel={`Level ${level} ${isUnlocked ? 'Unlocked' : 'Locked'}`}
        >
          {/* 3D Under-Bevel Base */}
          <View
            style={[
              styles.nodeBevelBottom,
              { backgroundColor: isUnlocked ? '#013D75' : '#1E293B' },
            ]}
          />

          {/* Front Face: Glossy Blue (Unlocked) vs Metallic Grey (Locked) */}
          <LinearGradient
            colors={
              isUnlocked
                ? ['#38BDF8', '#0284C7', '#0369A1']
                : ['#64748B', '#475569', '#334155']
            }
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[
              styles.nodeFrontFace,
              { borderColor: isUnlocked ? '#BAE6FD' : '#94A3B8' },
            ]}
          >
            {/* Top Gloss Reflection Arc */}
            <View style={styles.nodeGlossHighlight} />

            {isUnlocked ? (
              // White Bold Level Number
              <Text style={styles.nodeLevelNumber}>{level}</Text>
            ) : (
              // Golden Padlock Icon for Locked Levels
              <View style={styles.lockIconContainer}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M7 11V7a5 5 0 0110 0v4"
                    stroke="#FDE047"
                    strokeWidth={2.6}
                    strokeLinecap="round"
                  />
                  <Rect
                    x="4"
                    y="11"
                    width="16"
                    height="11"
                    rx="3"
                    fill="#FBBF24"
                    stroke="#B45309"
                    strokeWidth={1.5}
                  />
                  <Circle cx="12" cy="16" r="1.5" fill="#78350F" />
                </Svg>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* 3 Dynamic Stars Directly Under Active Node */}
        <View style={styles.starsRow}>
          {[1, 2, 3].map((starIdx) => {
            const isEarned = isUnlocked && starIdx <= stars;
            return (
              <View key={`star-${level}-${starIdx}`} style={styles.starItem}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Polygon
                    points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                    fill={isEarned ? '#FBBF24' : '#334155'}
                    stroke={isEarned ? '#B45309' : '#1E293B'}
                    strokeWidth={1.5}
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
}

export default function LevelSelectionScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<any>(null);
  const { currentLevel, stats } = usePlayer();

  // Active progression threshold
  const unlockedLevelMax = stats?.currentLevel ?? currentLevel ?? 1;
  const coinBalance = stats?.coins ?? 195;

  // Responsive map scroll height matching the rich 1536x2752 image aspect ratio
  const mapHeight = useMemo(() => {
    return Math.max(SCREEN_HEIGHT * 1.35, SCREEN_WIDTH * (2752 / 1536));
  }, []);

  // Initial scroll to bottom (Level 1 start) or current unlocked level
  useEffect(() => {
    const timer = setTimeout(() => {
      // Find Y position of player's current unlocked level
      const targetNode =
        LEVEL_NODES.find((n) => n.level === unlockedLevelMax) || LEVEL_NODES[0];
      const targetY = (targetNode.topPct / 100) * mapHeight - SCREEN_HEIGHT / 2;
      scrollViewRef.current?.scrollTo({
        y: Math.max(0, targetY),
        animated: false,
      });
    }, 120);

    return () => clearTimeout(timer);
  }, [unlockedLevelMax, mapHeight]);

  const handleLevelSelect = (levelNumber: number) => {
    // Navigate cleanly into the game
    navigation.navigate('Game', { level: levelNumber });
  };

  const handleBack = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // fallback
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      {/* ============================================================== */}
      {/* 1. FULL-SCREEN SCROLLABLE WINDING MAP (Image Asset Background) */}
      {/* ============================================================== */}
      <ScrollView
        ref={scrollViewRef}
        bounces={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ width: SCREEN_WIDTH, height: mapHeight }}
      >
        <ImageBackground
          source={LEVELS_MAP_BG}
          resizeMode="stretch"
          style={{ width: SCREEN_WIDTH, height: mapHeight }}
        >
          {/* ============================================================== */}
          {/* 2. DYNAMIC PATHFINDER NODES (Absolute Percentage Positioning)  */}
          {/* Perfectly pinned along the drawn winding serpentine trail     */}
          {/* ============================================================== */}
          {LEVEL_NODES.map((node) => {
            const isUnlocked = node.level <= unlockedLevelMax;
            const stars =
              stats?.levelProgress?.[node.level]?.stars ??
              (isUnlocked ? (node.level < unlockedLevelMax ? 3 : 1) : 0);

            return (
              <PathfinderNode
                key={`level-node-${node.level}`}
                level={node.level}
                leftPct={node.leftPct}
                topPct={node.topPct}
                isUnlocked={isUnlocked}
                stars={stars}
                onPress={handleLevelSelect}
              />
            );
          })}
        </ImageBackground>
      </ScrollView>

      {/* ============================================================== */}
      {/* 3. FIXED OVERLAYS: Top Coin Pill + Bottom-Left Circular Back   */}
      {/* ============================================================== */}
      {/* Top-Right Coin Pill */}
      <View
        style={[
          styles.topRightCoinPill,
          { top: Math.max(16, insets.top + 8) },
        ]}
      >
        <Svg width={22} height={22} viewBox="0 0 32 32" fill="none">
          <Defs>
            <SvgLinearGradient id="mapCoinGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFF275" />
              <Stop offset="50%" stopColor="#FBBF24" />
              <Stop offset="100%" stopColor="#D97706" />
            </SvgLinearGradient>
          </Defs>
          <Circle cx="16" cy="16" r="14.5" fill="url(#mapCoinGrad)" stroke="#92400E" strokeWidth="1.2" />
          <Polygon
            points="16,7 18.5,12.2 24.2,13 20.1,17 21.1,22.7 16,20 10.9,22.7 11.9,17 7.8,13 13.5,12.2"
            fill="#FFFFFF"
            opacity={0.9}
          />
        </Svg>
        <Text style={styles.coinPillText}>{coinBalance}</Text>
      </View>

      {/* Thick Circular '<' Back Button in Bottom-Left Corner */}
      <View
        style={[
          styles.bottomLeftBackAnchor,
          { bottom: Math.max(20, insets.bottom + 12) },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleBack}
          style={styles.backButton3DBase}
          accessibilityLabel="Go Back"
        >
          {/* 3D Dark Under-Bevel Base */}
          <View style={styles.backButtonBevel} />

          {/* Glossy Coral/Red Front Face */}
          <LinearGradient
            colors={['#FB7185', '#E11D48', '#BE123C']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.backButtonFrontFace}
          >
            {/* Top Shine Highlight */}
            <View style={styles.backButtonGloss} />

            {/* Thick '<' Chevron Icon */}
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 19l-7-7 7-7"
                stroke="#FFFFFF"
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#38BDF8',
  },

  /* ---------------------------------------------------------------------- */
  /* PATHFINDER DYNAMIC NODES                                               */
  /* ---------------------------------------------------------------------- */
  nodePositioner: {
    position: 'absolute',
    width: NODE_SIZE,
    height: NODE_SIZE + 20,
    marginLeft: -NODE_SIZE / 2,
    marginTop: -NODE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  nodeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  node3DBase: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    position: 'relative',
  },
  nodeLocked: {
    opacity: 0.88,
  },
  nodeBevelBottom: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    height: NODE_SIZE - 2,
    borderRadius: NODE_SIZE / 2,
  },
  nodeFrontFace: {
    width: NODE_SIZE,
    height: NODE_SIZE - 2,
    borderRadius: NODE_SIZE / 2,
    borderWidth: 2.2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  nodeGlossHighlight: {
    position: 'absolute',
    top: 2,
    left: 8,
    right: 8,
    height: 14,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  nodeLevelNumber: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 24,
    color: '#FFFFFF',
    textShadowColor: 'rgba(1, 61, 117, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  lockIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    marginTop: 4,
  },
  starItem: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ---------------------------------------------------------------------- */
  /* FIXED OVERLAYS                                                         */
  /* ---------------------------------------------------------------------- */
  topRightCoinPill: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 28, 68, 0.92)',
    borderRadius: 20,
    borderWidth: 1.8,
    borderColor: '#38BDF8',
    paddingLeft: 6,
    paddingRight: 10,
    paddingVertical: 4,
    gap: 6,
    zIndex: 50,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 5,
  },
  coinPillText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  bottomLeftBackAnchor: {
    position: 'absolute',
    left: 20,
    zIndex: 50,
  },
  backButton3DBase: {
    width: 52,
    height: 52,
    position: 'relative',
  },
  backButtonBevel: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    height: 48,
    borderRadius: 26,
    backgroundColor: '#881337',
  },
  backButtonFrontFace: {
    width: 52,
    height: 48,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#FECDD3',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#BE123C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  backButtonGloss: {
    position: 'absolute',
    top: 2,
    left: 8,
    right: 8,
    height: 14,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
});
