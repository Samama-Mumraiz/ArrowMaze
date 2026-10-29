import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, Pattern, Line, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { usePlayer } from '../store/PlayerContext';
import { colors } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type LevelRange = '1-25' | '26-50' | '51-75';

export default function LevelSelectionScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const { currentLevel, maxUnlockedLevel, setCurrentLevel } = usePlayer();
  const [selectedRange, setSelectedRange] = useState<LevelRange>('1-25');

  const unlockedThreshold = Math.max(1, maxUnlockedLevel || currentLevel || 1);

  // Range metadata
  const rangeConfig = useMemo(() => {
    switch (selectedRange) {
      case '26-50':
        return { start: 26, end: 50, isLocked: unlockedThreshold < 26 };
      case '51-75':
        return { start: 51, end: 75, isLocked: unlockedThreshold < 51 };
      case '1-25':
      default:
        return { start: 1, end: 25, isLocked: false };
    }
  }, [selectedRange, unlockedThreshold]);

  const levelsInRange = useMemo(() => {
    const list = [];
    for (let i = rangeConfig.start; i <= rangeConfig.end; i++) {
      list.push(i);
    }
    return list;
  }, [rangeConfig]);

  const handleSelectLevel = (lvlNum: number) => {
    if (lvlNum <= unlockedThreshold) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // platform without haptics
      }
      setCurrentLevel(lvlNum);
      navigation.navigate('Play');
    }
  };

  const cardWidth = Math.floor((SCREEN_WIDTH - 48 - (4 * 10)) / 5);

  return (
    <View style={styles.container}>
      {/* 1. Deep Navy Background Gradient */}
      <LinearGradient
        colors={[colors.bgTop, '#07132F', colors.bgBottom]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* 2. Blueprint Grid Pattern */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern id="levelsGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <Line x1="0" y1="0" x2="32" y2="0" stroke="rgba(0, 240, 255, 0.04)" strokeWidth="1" />
              <Line x1="0" y1="0" x2="0" y2="32" stroke="rgba(0, 240, 255, 0.04)" strokeWidth="1" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#levelsGrid)" />
        </Svg>
      </View>

      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        {/* 1. TOP HEADER: Back Arrow ← | Title "Levels" (Screen 3 Reference) */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Home')}
            style={styles.backButton}
            accessibilityLabel="Back to Home"
          >
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="#FFFFFF"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Levels</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* 2. RANGE TABS: 1-25 | 26-50 🔒 | 51-75 🔒 (Screen 3 Reference) */}
        <View style={styles.rangeTabsRow}>
          {/* Tab 1: 1 - 25 */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setSelectedRange('1-25')}
            style={styles.rangeTabWrapper}
          >
            {selectedRange === '1-25' ? (
              <LinearGradient
                colors={['#00E5FF', '#007BFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.rangeTabActiveGradient}
              >
                <Text style={styles.rangeTabTextActive}>1 - 25</Text>
              </LinearGradient>
            ) : (
              <View style={styles.rangeTabInactive}>
                <Text style={styles.rangeTabTextInactive}>1 - 25</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Tab 2: 26 - 50 */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setSelectedRange('26-50')}
            style={styles.rangeTabWrapper}
          >
            {selectedRange === '26-50' ? (
              <LinearGradient
                colors={['#00E5FF', '#007BFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.rangeTabActiveGradient}
              >
                <Text style={styles.rangeTabTextActive}>26 - 50</Text>
                {unlockedThreshold < 26 && <Text style={styles.lockIconText}> 🔒</Text>}
              </LinearGradient>
            ) : (
              <View style={styles.rangeTabInactive}>
                <Text style={styles.rangeTabTextInactive}>26 - 50</Text>
                {unlockedThreshold < 26 && <Text style={styles.lockIconText}> 🔒</Text>}
              </View>
            )}
          </TouchableOpacity>

          {/* Tab 3: 51 - 75 */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setSelectedRange('51-75')}
            style={styles.rangeTabWrapper}
          >
            {selectedRange === '51-75' ? (
              <LinearGradient
                colors={['#00E5FF', '#007BFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.rangeTabActiveGradient}
              >
                <Text style={styles.rangeTabTextActive}>51 - 75</Text>
                {unlockedThreshold < 51 && <Text style={styles.lockIconText}> 🔒</Text>}
              </LinearGradient>
            ) : (
              <View style={styles.rangeTabInactive}>
                <Text style={styles.rangeTabTextInactive}>51 - 75</Text>
                {unlockedThreshold < 51 && <Text style={styles.lockIconText}> 🔒</Text>}
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* 3. DENSE 5x5 LEVEL GRID (Screen 3 Reference) */}
        <ScrollView
          contentContainerStyle={styles.scrollGridContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gridContainer}>
            {levelsInRange.map((lvl) => {
              const isUnlocked = lvl <= unlockedThreshold;
              const isCurrent = lvl === currentLevel;
              const isFirstOrSelected = lvl === currentLevel || (lvl === 1 && unlockedThreshold >= 1);

              return (
                <TouchableOpacity
                  key={`lvl-${lvl}`}
                  activeOpacity={isUnlocked ? 0.8 : 1}
                  onPress={() => handleSelectLevel(lvl)}
                  style={[styles.levelCardWrapper, { width: cardWidth, height: cardWidth * 1.08 }]}
                >
                  {isUnlocked && isFirstOrSelected ? (
                    /* Active Level Card: Electric Blue Gradient with Stars */
                    <LinearGradient
                      colors={['#00E5FF', '#007BFF']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.activeCardGradient}
                    >
                      <Text style={styles.activeCardNumber}>{lvl}</Text>
                      {/* 3 Golden Stars */}
                      <View style={styles.starsRow}>
                        <Text style={styles.starIcon}>★</Text>
                        <Text style={styles.starIcon}>★</Text>
                        <Text style={styles.starIcon}>★</Text>
                      </View>
                    </LinearGradient>
                  ) : isUnlocked ? (
                    /* Unlocked Completed / Available Level Card */
                    <View style={styles.unlockedCard}>
                      <Text style={styles.unlockedCardNumber}>{lvl}</Text>
                      <View style={styles.starsRow}>
                        <Text style={styles.starIcon}>★</Text>
                        <Text style={styles.starIcon}>★</Text>
                        <Text style={styles.starIcon}>★</Text>
                      </View>
                    </View>
                  ) : (
                    /* Locked Level Card with Padlock Icon (Screen 3 Reference) */
                    <View style={styles.lockedCard}>
                      <Text style={styles.lockedCardNumber}>{lvl}</Text>
                      {/* Padlock Icon */}
                      <Svg width={13} height={13} viewBox="0 0 24 24" fill="none" style={styles.lockSvg}>
                        <Rect x="5" y="11" width="14" height="10" rx="2" fill="#4E688F" />
                        <Path
                          d="M8 11V7a4 4 0 018 0v4"
                          stroke="#4E688F"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                        />
                      </Svg>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* 4. BOTTOM BANNER: Trophy Card (Screen 3 Reference) */}
        <View style={styles.bottomBanner}>
          <View style={styles.trophyIconWrapper}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M6 9V2h12v7c0 3.3-2.7 6-6 6s-6-2.7-6-6z"
                fill="#FFD700"
                stroke="#FFA000"
                strokeWidth={1.2}
              />
              <Path
                d="M6 4H3c0 2.8 1.8 5.1 4.3 5.8M18 4h3c0 2.8-1.8 5.1-4.3 5.8M12 15v4M8 22h8"
                stroke="#FFD700"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Text style={styles.bannerText}>
            Complete levels to unlock more challenges!
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgTop,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 25, 56, 0.8)',
    borderWidth: 1.2,
    borderColor: 'rgba(0, 240, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Sora_700Bold',
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  rangeTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 10,
  },
  rangeTabWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  rangeTabActiveGradient: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.primaryA,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 3,
  },
  rangeTabTextActive: {
    fontFamily: 'Sora_700Bold',
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  rangeTabInactive: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangeTabTextInactive: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 13,
    color: colors.textSecondary,
  },
  lockIconText: {
    fontSize: 10,
  },
  scrollGridContent: {
    paddingVertical: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  levelCardWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  activeCardGradient: {
    flex: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
    paddingVertical: 4,
  },
  activeCardNumber: {
    fontFamily: 'Sora_800ExtraBold',
    fontSize: 17,
    color: '#FFFFFF',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 1.5,
    marginTop: 2,
  },
  starIcon: {
    fontSize: 8.5,
    color: colors.star,
  },
  unlockedCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  unlockedCardNumber: {
    fontFamily: 'Sora_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  lockedCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: 'rgba(7, 18, 42, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(46, 123, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  lockedCardNumber: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 14,
    color: colors.textSecondary,
  },
  lockSvg: {
    marginTop: 3,
    opacity: 0.7,
  },
  bottomBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 8,
    marginTop: 6,
  },
  trophyIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 200, 61, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    fontFamily: 'Sora_400Regular',
    fontSize: 12.5,
    color: colors.textSecondary,
    flex: 1,
  },
});
