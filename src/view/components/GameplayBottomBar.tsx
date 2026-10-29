import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme/colors';

export interface GameplayBottomBarProps {
  canUndo?: boolean;
  hintsRemaining?: number;
  onUndo?: () => void;
  onTapToMove?: () => void;
  onHint: () => void;
  disabled?: boolean;
}

export default function GameplayBottomBar({
  hintsRemaining = 3,
  onHint,
  disabled = false,
}: GameplayBottomBarProps): React.JSX.Element {
  return (
    <View style={styles.dockContainer}>
      <View style={styles.actionItem}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onHint}
          disabled={disabled || hintsRemaining <= 0}
          style={[styles.circleButton, hintsRemaining <= 0 && styles.buttonDisabled]}
          accessibilityLabel="Hint"
        >
          {/* Lightbulb Icon */}
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M9 21h6M10 24h4M12 3a6 6 0 00-6 6c0 2.2 1.2 3.8 2.2 5.2.6.8.8 1.8.8 2.8h6c0-1 .2-2 .8-2.8 1-1.4 2.2-3 2.2-5.2a6 6 0 00-6-6z"
              stroke={colors.accent}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>

          {/* Glowing Notification Badge */}
          <View style={styles.hintBadge}>
            <Text style={styles.hintBadgeText}>{hintsRemaining}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.actionLabel}>Hint</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 8,
  },
  actionItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.panel,
    borderWidth: 1.5,
    borderColor: colors.panelBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.45,
    borderColor: 'rgba(78, 104, 143, 0.25)',
  },
  actionLabel: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    letterSpacing: 0.3,
  },
  hintBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primaryB,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  hintBadgeText: {
    fontFamily: 'Sora_700Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
});
