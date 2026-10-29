import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import HeartIcon from './HeartIcon';

interface HUDProps {
  levelNumber: number;
  lives: number;
  maxLives: number;
  onRestart: () => void;
  disabled?: boolean;
}

export default function HUD({
  levelNumber,
  lives,
  maxLives,
  onRestart,
  disabled = false,
}: HUDProps): React.JSX.Element {
  return (
    <View style={styles.hudContainer}>
      {/* Level Number */}
      <View style={styles.levelBadge}>
        <Text style={styles.levelLabel}>LEVEL</Text>
        <Text style={styles.levelValue}>{levelNumber}</Text>
      </View>

      {/* SVG Hearts Indicator */}
      <View style={styles.heartsRow}>
        {Array.from({ length: maxLives }).map((_, index) => (
          <View key={`heart-${index}`} style={styles.heartWrapper}>
            <HeartIcon filled={index < lives} size={22} />
          </View>
        ))}
      </View>

      {/* Reset Button */}
      <Pressable
        onPress={onRestart}
        disabled={disabled}
        style={({ pressed }) => [
          styles.resetButton,
          pressed && styles.resetButtonPressed,
        ]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            stroke="#94a3b8"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  hudContainer: {
    width: '100%',
    maxWidth: 480,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  levelLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  levelValue: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '900',
  },
  heartsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heartWrapper: {
    padding: 2,
  },
  resetButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonPressed: {
    backgroundColor: '#334155',
  },
});
