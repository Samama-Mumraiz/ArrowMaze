import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
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
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { typography } from '../theme/typography';
import { usePlayer } from '../store/PlayerContext';

const HOME_BG = require('../../assets/home_bg.jpg');

// Original background image dimensions (1696x2528)
const BG_ORIGINAL_WIDTH = 1696;
const BG_ORIGINAL_HEIGHT = 2528;

export default function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { stats, totalWins } = usePlayer();

  // Dynamic values connected to React Native global state
  const activeLevel = stats?.currentLevel ?? 12;
  const winsProgress = stats?.totalWins ?? totalWins ?? 8;
  const coinBalance = stats?.coins ?? 195;

  // Mathematically map bounding boxes from the 1696x2528 background to current screen
  const layout = useMemo(() => {
    const imageAspect = BG_ORIGINAL_WIDTH / BG_ORIGINAL_HEIGHT;
    const screenAspect = windowWidth / windowHeight;

    let renderedW: number;
    let renderedH: number;
    let offsetX: number;
    let offsetY: number;

    if (screenAspect < imageAspect) {
      // Taller screen (portrait phones): height fits, width is cropped symmetrically
      renderedH = windowHeight;
      renderedW = windowHeight * imageAspect;
      offsetX = (windowWidth - renderedW) / 2;
      offsetY = 0;
    } else {
      // Wider screen: width fits, height is cropped symmetrically
      renderedW = windowWidth;
      renderedH = windowWidth / imageAspect;
      offsetX = 0;
      offsetY = (windowHeight - renderedH) / 2;
    }

    const mapRect = (x: number, y: number, w: number, h: number) => ({
      left: offsetX + (x / BG_ORIGINAL_WIDTH) * renderedW,
      top: offsetY + (y / BG_ORIGINAL_HEIGHT) * renderedH,
      width: (w / BG_ORIGINAL_WIDTH) * renderedW,
      height: (h / BG_ORIGINAL_HEIGHT) * renderedH,
    });

    return {
      // Play button on image: X=[455, 1245], Y=[1630, 1920]
      playRect: mapRect(455, 1630, 790, 290),
      // Levels button on image: X=[365, 1335], Y=[1980, 2240]
      levelsRect: mapRect(365, 1980, 970, 260),
    };
  }, [windowWidth, windowHeight]);

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
    <ImageBackground
      source={HOME_BG}
      resizeMode="cover"
      style={styles.container}
    >
      {/* ============================================================== */}
      {/* 1. DYNAMIC TOP HUD (Settings, Level Badge, Coins)              */}
      {/* Positioned at the very top of safe area, above pre-drawn logo   */}
      {/* ============================================================== */}
      <View
        style={[
          styles.topHudContainer,
          { top: Math.max(10, insets.top + 4) },
        ]}
      >
        {/* Top-Left: Settings Icon + Level Progress Badge */}
        <View style={styles.leftHeaderGroup}>
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
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
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

          {/* Stylized 'Level X' Progress Badge with Golden Crown */}
          <View style={styles.levelBadge}>
            <View style={styles.crownContainer}>
              <Svg width={22} height={22} viewBox="0 0 32 32" fill="none">
                <Defs>
                  <SvgLinearGradient id="crownGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#FFF275" />
                    <Stop offset="40%" stopColor="#FBBF24" />
                    <Stop offset="100%" stopColor="#D97706" />
                  </SvgLinearGradient>
                </Defs>
                <Path
                  d="M4,24 L28,24 L26,12 L20,18 L16,7 L12,18 L6,12 Z"
                  fill="url(#crownGrad)"
                  stroke="#B45309"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <Rect x="4" y="22" width="24" height="4" rx="2" fill="#F59E0B" stroke="#92400E" strokeWidth="1" />
                <Circle cx="16" cy="18" r="2" fill="#EF4444" stroke="#991B1B" strokeWidth="0.8" />
              </Svg>
            </View>

            <View style={styles.levelInfoCol}>
              <Text style={styles.levelBadgeTitle}>Level {activeLevel}</Text>
              <View style={styles.levelProgressTrack}>
                <View style={styles.levelProgressFill}>
                  <Text style={styles.levelProgressText}>{winsProgress}/20</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Top-Right: Gold Coin Pill */}
        <View style={styles.coinPillContainer}>
          <View style={styles.coinIconWrapper}>
            <Svg width={22} height={22} viewBox="0 0 32 32" fill="none">
              <Defs>
                <SvgLinearGradient id="goldCoinMain" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor="#FFF275" />
                  <Stop offset="50%" stopColor="#FBBF24" />
                  <Stop offset="100%" stopColor="#D97706" />
                </SvgLinearGradient>
              </Defs>
              <Circle cx="16" cy="16" r="14.5" fill="url(#goldCoinMain)" stroke="#92400E" strokeWidth="1.2" />
              <Polygon
                points="16,7 18.5,12.2 24.2,13 20.1,17 21.1,22.7 16,20 10.9,22.7 11.9,17 7.8,13 13.5,12.2"
                fill="#FFFFFF"
                opacity={0.9}
              />
            </Svg>
          </View>

          <Text style={styles.coinBalanceText}>{coinBalance}</Text>

          <TouchableOpacity activeOpacity={0.8} style={styles.coinAddButton}>
            <LinearGradient colors={['#38BDF8', '#0284C7']} style={styles.coinAddGradient}>
              <Text style={styles.coinAddText}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* ============================================================== */}
      {/* 2. TRANSPARENT INTERACTIVE HIT-ZONES FOR PRE-DRAWN BUTTONS     */}
      {/* Exactly mapped over "Play" and "Levels" on the background image */}
      {/* Zero duplicate text, zero duplicate backgrounds/gradients       */}
      {/* ============================================================== */}
      <TouchableOpacity
        activeOpacity={0.65}
        onPress={handlePlayPress}
        style={[styles.transparentButtonHitZone, layout.playRect]}
        accessibilityLabel="Play Game"
      />

      <TouchableOpacity
        activeOpacity={0.65}
        onPress={handleLevelsPress}
        style={[styles.transparentButtonHitZone, layout.levelsRect]}
        accessibilityLabel="Select Level"
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  /* ---------------------------------------------------------------------- */
  /* TOP HUD OVERLAY                                                        */
  /* ---------------------------------------------------------------------- */
  topHudContainer: {
    position: 'absolute',
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50,
  },
  leftHeaderGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#7DD3FC',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 4,
  },
  settingsGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Level Progress Badge */
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 28, 68, 0.90)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    paddingLeft: 6,
    paddingRight: 10,
    paddingVertical: 3,
    gap: 5,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 4,
  },
  crownContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelInfoCol: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  levelBadgeTitle: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 11.5,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  levelProgressTrack: {
    width: 48,
    height: 10,
    backgroundColor: '#0F274E',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#1E40AF',
    overflow: 'hidden',
    marginTop: 1,
  },
  levelProgressFill: {
    width: '55%',
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelProgressText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 7.5,
    color: '#FFFFFF',
    lineHeight: 10,
  },

  /* Coin Pill */
  coinPillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 28, 68, 0.90)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    paddingLeft: 5,
    paddingRight: 6,
    paddingVertical: 3,
    gap: 6,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 4,
  },
  coinIconWrapper: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinBalanceText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  coinAddButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    overflow: 'hidden',
  },
  coinAddGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinAddText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: -2,
  },

  /* ---------------------------------------------------------------------- */
  /* TRANSPARENT HIT-ZONES OVER BAKED-IN BUTTONS                            */
  /* ---------------------------------------------------------------------- */
  transparentButtonHitZone: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 28,
    zIndex: 40,
  },
});
