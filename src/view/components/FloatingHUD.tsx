import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { colors } from '../../theme/colors';

export interface FloatingHUDProps {
  levelNumber?: number;
  lives?: number;
  maxLives?: number;
  stars?: number;
  onPause?: () => void;
  disabled?: boolean;
}

export default function FloatingHUD({
  levelNumber = 1,
  lives = 3,
  stars = 3,
  onPause,
  disabled = false,
}: FloatingHUDProps): React.JSX.Element {
  // Resolve active stars based on remaining lives or stars count
  const earnedStars = Math.max(1, Math.min(3, lives));

  return (
    <View style={styles.container}>
      {/* 1. Left: Level Number (Screen 4 Reference: "Level 1") */}
      <View style={styles.levelWrapper}>
        <Text style={styles.levelPrefix}>Level </Text>
        <Text style={styles.levelNumber}>{levelNumber}</Text>
      </View>

      {/* 2. Center/Right: 3 Golden Stars (Screen 4 Reference) */}
      <View style={styles.starsRow}>
        {[1, 2, 3].map((starIdx) => {
          const isActive = starIdx <= earnedStars;
          return (
            <Text
              key={`hud-star-${starIdx}`}
              style={[styles.starIcon, !isActive && styles.starInactive]}
            >
              ★
            </Text>
          );
        })}
      </View>

      {/* 3. Far Right: Pause Button || (Screen 4 Reference) */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPause}
        disabled={disabled}
        style={styles.pauseButton}
        accessibilityLabel="Pause Game"
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="5" width="4" height="14" rx="1" fill={colors.accent} />
          <Rect x="14" y="5" width="4" height="14" rx="1" fill={colors.accent} />
        </Svg>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  levelWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  levelPrefix: {
    fontFamily: 'Sora_700Bold',
    fontSize: 20,
    color: colors.accent,
    letterSpacing: 0.5,
  },
  levelNumber: {
    fontFamily: 'Sora_800ExtraBold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 18,
    color: colors.star,
    textShadowColor: 'rgba(255, 200, 61, 0.65)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  starInactive: {
    color: 'rgba(143, 166, 204, 0.35)',
    textShadowColor: 'transparent',
  },
  pauseButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.panel,
    borderWidth: 1.2,
    borderColor: colors.panelBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
});
