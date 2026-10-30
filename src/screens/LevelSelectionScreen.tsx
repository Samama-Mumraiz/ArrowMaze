import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Path,
  Defs,
  Pattern,
  Line,
  Rect,
  Circle,
  Polygon,
} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { usePlayer } from '../store/PlayerContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 12 levels in a 4x3 grid
const LEVELS_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Reanimated pressable component for level buttons
function AnimatedLevelNode({
  level,
  isUnlocked,
  stars,
  onPress,
}: {
  level: number;
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
    scale.value = withTiming(0.92, {
      duration: 120,
      easing: Easing.out(Easing.ease),
    });
  };

  const handlePressOut = () => {
    if (!isUnlocked) return;
    scale.value = withTiming(1, {
      duration: 180,
      easing: Easing.out(Easing.ease),
    });
  };

  return (
    <Animated.View style={[styles.nodeWrapper, animatedStyle]}>
      <Pressable
        disabled={!isUnlocked}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.nodePressable,
          !isUnlocked && styles.nodeLockedPressable,
        ]}
      >
        {/* Outer Glowing Concentric Ring */}
        <View
          style={[
            styles.outerRing,
            isUnlocked ? styles.outerRingUnlocked : styles.outerRingLocked,
          ]}
        >
          {/* Middle Metallic Ring */}
          <View
            style={[
              styles.middleRing,
              isUnlocked ? styles.middleRingUnlocked : styles.middleRingLocked,
            ]}
          >
            {/* Inner Center Circle with Gradient */}
            <LinearGradient
              colors={
                isUnlocked
                  ? ['#0A426F', '#062B4E', '#02182F']
                  : ['#0B1B30', '#071324', '#040B16']
              }
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.innerCircle}
            >
              {isUnlocked ? (
                <Text style={styles.levelNumberText}>{level}</Text>
              ) : (
                /* Padlock Icon */
                <Svg width={26} height={28} viewBox="0 0 24 26" fill="none">
                  {/* Shackle */}
                  <Path
                    d="M6 10V6.5C6 3.46 8.69 1 12 1s6 2.46 6 5.5V10"
                    stroke="#386A94"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                  {/* Lock Body */}
                  <Rect
                    x="3"
                    y="10"
                    width="18"
                    height="14"
                    rx="3.5"
                    fill="#153655"
                    stroke="#2D5A80"
                    strokeWidth="1.5"
                  />
                  {/* Keyhole */}
                  <Circle cx="12" cy="16" r="1.8" fill="#4B88B8" />
                  <Path
                    d="M11.2 16.8L10.7 20.5H13.3L12.8 16.8"
                    fill="#4B88B8"
                  />
                </Svg>
              )}
            </LinearGradient>
          </View>
        </View>

        {/* 3 Achievement Stars Below Node */}
        <View style={styles.starsContainer}>
          {[1, 2, 3].map((starIndex) => {
            const isEarned = isUnlocked && stars >= starIndex;
            return (
              <View
                key={starIndex}
                style={[
                  styles.starItem,
                  starIndex === 2 && styles.starCenter,
                ]}
              >
                <Svg width={20} height={20} viewBox="0 0 24 24">
                  {/* 5-pointed star path */}
                  <Polygon
                    points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                    fill={isEarned ? '#FFD23F' : '#071C38'}
                    stroke={isEarned ? '#FFF275' : '#0C2A52'}
                    strokeWidth={isEarned ? '1.2' : '1'}
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            );
          })}
        </View>
      </Pressable>
    </Animated.View>
  );
}

// Bottom-left circular back button with scaling animation
function CircularBackButton({ onPress }: { onPress: () => void }): React.JSX.Element {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.9, {
      duration: 100,
      easing: Easing.out(Easing.ease),
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 150,
      easing: Easing.out(Easing.ease),
    });
  };

  return (
    <Animated.View style={[styles.backButtonContainer, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.backButtonPressable}
      >
        <LinearGradient
          colors={['#073356', '#031D38']}
          style={styles.backButtonGradient}
        >
          {/* Left chevron icon */}
          <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 19L8 12L15 5"
              stroke="#00F0FF"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

export default function LevelSelectionScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const {
    currentLevel,
    maxUnlockedLevel,
    currentUnlockedLevel: ctxUnlockedLevel,
    getLevelStars,
    setCurrentLevel,
  } = usePlayer();

  // Strictly compare level against player unlocked progress
  const currentUnlocked = useMemo(() => {
    return ctxUnlockedLevel ?? Math.max(1, maxUnlockedLevel ?? currentLevel ?? 8);
  }, [ctxUnlockedLevel, maxUnlockedLevel, currentLevel]);

  const handleSelectLevel = (levelNumber: number) => {
    if (levelNumber <= currentUnlocked) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {
        // Haptics fallback
      }
      setCurrentLevel(levelNumber);
      // Navigate to Gameplay with level param
      navigation.navigate('Gameplay', { level: levelNumber });
    }
  };

  const handleGoBack = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics fallback
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Deep Navy Sci-Fi Background Gradient */}
      <LinearGradient
        colors={['#020816', '#041029', '#020A1A']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* 2. Abstract Background Cybernetic Grid & Traces Overlay */}
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          {/* Blueprint Grid Pattern */}
          <Pattern
            id="cyberGrid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <Rect width="32" height="32" fill="none" />
            <Line
              x1="0"
              y1="0"
              x2="32"
              y2="0"
              stroke="rgba(0, 195, 255, 0.09)"
              strokeWidth="1"
            />
            <Line
              x1="0"
              y1="0"
              x2="0"
              y2="32"
              stroke="rgba(0, 195, 255, 0.09)"
              strokeWidth="1"
            />
          </Pattern>
        </Defs>

        {/* Base Grid */}
        <Rect width="100%" height="100%" fill="url(#cyberGrid)" />

        {/* Cyber Circuit Lines (Top & Sides) */}
        <Path
          d="M0,120 L80,120 L110,150 L110,190"
          stroke="rgba(0, 220, 255, 0.22)"
          strokeWidth="1.5"
          fill="none"
        />
        <Circle cx="110" cy="190" r="3.5" fill="#00E5FF" opacity={0.6} />

        <Path
          d="M0,140 L60,140 L90,170"
          stroke="rgba(0, 180, 255, 0.15)"
          strokeWidth="1"
          fill="none"
        />
        <Circle cx="90" cy="170" r="2.5" fill="#00A3FF" opacity={0.4} />

        {/* Top-Right Wireframe Mesh Motif */}
        <Path
          d="M260,100 L340,80 L380,130 L310,155 Z"
          stroke="rgba(0, 220, 255, 0.12)"
          strokeWidth="1"
          fill="none"
        />
        <Path
          d="M290,90 L350,140 M340,80 L290,140 M310,155 L320,85"
          stroke="rgba(0, 200, 255, 0.08)"
          strokeWidth="1"
          fill="none"
        />

        {/* Bottom Cybercircuit Bus Traces */}
        <Path
          d={`M100,${SCREEN_HEIGHT - 80} L180,${SCREEN_HEIGHT - 80} L210,${SCREEN_HEIGHT - 110} L320,${SCREEN_HEIGHT - 110}`}
          stroke="rgba(0, 220, 255, 0.25)"
          strokeWidth="1.5"
          fill="none"
        />
        <Path
          d="M120,680 L200,680 L230,650 L340,650 L340,580"
          stroke="rgba(0, 220, 255, 0.18)"
          strokeWidth="1.5"
          fill="none"
        />
        <Circle cx="340" cy="580" r="3.5" fill="#00E5FF" opacity={0.7} />
        <Path
          d="M200,680 L200,710 L280,710 L280,680"
          stroke="rgba(0, 180, 255, 0.2)"
          strokeWidth="1.2"
          fill="none"
        />
        <Circle cx="280" cy="680" r="3" fill="#00E5FF" opacity={0.6} />

        {/* Bottom-Left Wireframe Mesh */}
        <Path
          d="M20,600 L70,570 L110,610 L50,640 Z"
          stroke="rgba(0, 200, 255, 0.1)"
          strokeWidth="1"
          fill="none"
        />
        <Path
          d="M40,585 L90,625 M70,570 L40,630"
          stroke="rgba(0, 200, 255, 0.08)"
          strokeWidth="1"
          fill="none"
        />

        {/* Bottom-Right Wireframe Mesh */}
        <Path
          d="M320,660 L370,640 L400,690 L340,710 Z"
          stroke="rgba(0, 200, 255, 0.1)"
          strokeWidth="1"
          fill="none"
        />
      </Svg>

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* 3. Header: Sci-Fi "SELECT LEVEL" Badged Banner */}
        <View style={styles.headerContainer}>
          {/* Cybernetic Angled Frame Container */}
          <View style={styles.bannerOuterFrame}>
            <LinearGradient
              colors={['rgba(0, 180, 255, 0.18)', 'rgba(4, 30, 60, 0.75)']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.bannerBackground}
            >
              {/* Outer Cyan Cyber Bracket Decoration */}
              <Svg
                style={StyleSheet.absoluteFill}
                width="100%"
                height="100%"
                viewBox="0 0 280 60"
                preserveAspectRatio="none"
              >
                {/* Chamfered Box Outline */}
                <Path
                  d="M16 2 L264 2 L278 16 L278 44 L264 58 L16 58 L2 44 L2 16 Z"
                  stroke="#00E5FF"
                  strokeWidth="2.4"
                  fill="none"
                />
                {/* Upper Left & Right Bracket Accents */}
                <Line x1="16" y1="2" x2="36" y2="2" stroke="#FFFFFF" strokeWidth="2.5" />
                <Line x1="244" y1="2" x2="264" y2="2" stroke="#FFFFFF" strokeWidth="2.5" />
                {/* Side Notch Tabs */}
                <Path d="M-4 30 L6 30" stroke="#00E5FF" strokeWidth="3" />
                <Path d="M274 30 L284 30" stroke="#00E5FF" strokeWidth="3" />
              </Svg>

              <Text style={styles.headerTitleText}>SELECT LEVEL</Text>
            </LinearGradient>
          </View>
        </View>

        {/* 4. Dynamic 4x3 Grid of 12 Level Nodes */}
        <View style={styles.gridContainer}>
          {LEVELS_LIST.map((lvl) => {
            const isUnlocked = lvl <= currentUnlocked;
            const stars = getLevelStars ? getLevelStars(lvl) : (isUnlocked ? (lvl === 1 ? 3 : lvl < currentUnlocked ? 2 : 1) : 0);

            return (
              <AnimatedLevelNode
                key={lvl}
                level={lvl}
                isUnlocked={isUnlocked}
                stars={stars}
                onPress={() => handleSelectLevel(lvl)}
              />
            );
          })}
        </View>

        {/* 5. Bottom Navigation Bar with Circular Back Button */}
        <View style={styles.bottomBar}>
          <CircularBackButton onPress={handleGoBack} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020816',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },

  /* Header Sci-Fi Banner */
  headerContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  bannerOuterFrame: {
    width: Math.min(SCREEN_WIDTH * 0.78, 300),
    height: 56,
    borderRadius: 8,
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 14,
    elevation: 10,
  },
  bannerBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerTitleText: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 3,
    color: '#D4F5FF',
    textShadowColor: '#00D4FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  /* 4x3 Level Grid */
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    rowGap: 16,
  },

  /* Level Node */
  nodeWrapper: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodePressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeLockedPressable: {
    opacity: 0.42,
  },

  /* Concentric Outer Ring */
  outerRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRingUnlocked: {
    borderColor: '#00F0FF',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 12,
    elevation: 9,
  },
  outerRingLocked: {
    borderColor: '#18385C',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },

  /* Middle Metallic Ring */
  middleRing: {
    width: 73,
    height: 73,
    borderRadius: 36.5,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleRingUnlocked: {
    borderColor: '#062B54',
  },
  middleRingLocked: {
    borderColor: '#0C1E34',
  },

  /* Inner Gradient Center Circle */
  innerCircle: {
    width: 61,
    height: 61,
    borderRadius: 30.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNumberText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#E6F8FF',
    textShadowColor: 'rgba(0, 220, 255, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  /* Achievement Stars Container Below Node */
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    height: 22,
    gap: 3,
  },
  starItem: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starCenter: {
    marginTop: 2,
  },

  /* Bottom Bar */
  bottomBar: {
    height: 72,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  /* Circular Back Button */
  backButtonContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#00F0FF',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
  backButtonPressable: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
  },
  backButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
