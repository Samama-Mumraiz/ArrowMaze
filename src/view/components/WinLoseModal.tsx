import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface WinLoseModalProps {
  status: 'won' | 'lost';
  levelNumber: number;
  onNextLevel: () => void;
  onRetry: () => void;
}

export default function WinLoseModal({
  status,
  levelNumber,
  onNextLevel,
  onRetry,
}: WinLoseModalProps): React.JSX.Element {
  const isWin = status === 'won';

  return (
    <View style={styles.overlay}>
      <View style={[styles.card, isWin ? styles.winBorder : styles.loseBorder]}>
        {/* Status Icon */}
        <View
          style={[
            styles.iconContainer,
            isWin ? styles.winIconBg : styles.loseIconBg,
          ]}
        >
          {isWin ? (
            /* Sparkle / Check Icon */
            <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 13l4 4L19 7"
                stroke="#10b981"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ) : (
            /* Broken Heart / Cross Icon */
            <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
              <Path
                d="M6 18L18 6M6 6l12 12"
                stroke="#ef4444"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}
        </View>

        {/* Modal Titles */}
        <Text style={styles.title}>
          {isWin ? 'LEVEL CLEARED!' : 'OUT OF HEARTS'}
        </Text>
        <Text style={styles.subtitle}>
          {isWin
            ? `Fantastic! You conquered Level ${levelNumber} without flaw.`
            : 'Blocked arrows depleted your lives. Plan your exit vectors carefully.'}
        </Text>

        {/* Primary Action Button */}
        <Pressable
          onPress={isWin ? onNextLevel : onRetry}
          style={({ pressed }) => [
            styles.actionButton,
            isWin ? styles.winButton : styles.loseButton,
            pressed && styles.actionButtonPressed,
          ]}
        >
          <Text style={styles.actionButtonText}>
            {isWin ? 'NEXT LEVEL →' : 'TRY AGAIN ↺'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 16,
    zIndex: 60,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 26,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  winBorder: {
    borderColor: '#10b981',
  },
  loseBorder: {
    borderColor: '#ef4444',
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
  },
  winIconBg: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981',
  },
  loseIconBg: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#ef4444',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#f8fafc',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  actionButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  winButton: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
  },
  loseButton: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
  },
  actionButtonPressed: {
    opacity: 0.88,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});
