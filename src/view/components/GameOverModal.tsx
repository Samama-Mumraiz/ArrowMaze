import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';
import { colors } from '../../theme/colors';

interface GameOverModalProps {
  timeElapsed?: string;
  movesCount?: number;
  onRetry: () => void;
  onLevelSelect?: () => void;
}

export default function GameOverModal({
  timeElapsed = '03:15',
  movesCount = 28,
  onRetry,
  onLevelSelect,
}: GameOverModalProps): React.JSX.Element {
  return (
    <View style={styles.backdrop} pointerEvents="auto">
      {/* Glassmorphism Blur Backdrop */}
      <BlurView intensity={26} tint="dark" style={StyleSheet.absoluteFill} />

      <View style={styles.modalCard}>
        {/* 1. TOP: Red Glowing Sad-Face Icon (Screen 7 Reference) */}
        <View style={styles.sadIconContainer}>
          <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
            {/* Outer red glowing aura ring */}
            <Circle cx="32" cy="32" r="28" stroke="#FF3366" strokeWidth={2.5} strokeOpacity={0.9} />
            <Circle cx="32" cy="32" r="28" stroke="#FF3366" strokeWidth={8} strokeOpacity={0.2} />

            {/* Sad Eyes */}
            <Circle cx="24" cy="26" r="3" fill="#FF3366" />
            <Circle cx="40" cy="26" r="3" fill="#FF3366" />

            {/* Downward Sad Mouth Curve */}
            <Path
              d="M22 42c3-4 17-4 20 0"
              stroke="#FF3366"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </Svg>
        </View>

        {/* 2. TITLE & SUBTITLE */}
        <Text style={styles.modalTitle}>Game Over!</Text>
        <Text style={styles.modalSubtitle}>You didn't reach the goal.</Text>

        {/* 3. STATS PANEL: Dark Inner Card with Time and Moves (Screen 7 Reference) */}
        <View style={styles.statsCard}>
          {/* Left Stat: Clock Icon ⏱ Time */}
          <View style={styles.statCol}>
            <View style={styles.statHeaderRow}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="9" stroke="#00F0FF" strokeWidth={2} />
                <Path d="M12 7v5l3 3" stroke="#00F0FF" strokeWidth={2} strokeLinecap="round" />
              </Svg>
              <Text style={styles.statLabel}>Time</Text>
            </View>
            <Text style={styles.statValue}>{timeElapsed}</Text>
          </View>

          {/* Vertical Divider */}
          <View style={styles.statDivider} />

          {/* Right Stat: Lightning Icon ⚡ Moves */}
          <View style={styles.statCol}>
            <View style={styles.statHeaderRow}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="#00F0FF" />
              </Svg>
              <Text style={styles.statLabel}>Moves</Text>
            </View>
            <Text style={styles.statValue}>{movesCount}</Text>
          </View>
        </View>

        {/* 4. BUTTONS STACK: Try Again | Levels (Screen 7 Reference) */}
        <View style={styles.buttonsContainer}>
          {/* Primary Button: TRY AGAIN (Electric Blue Gradient Fill) */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={onRetry}
            style={styles.primaryButtonWrapper}
            accessibilityLabel="Try Again"
          >
            <LinearGradient
              colors={[colors.primaryA, colors.primaryB]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButtonGradient}
            >
              <View style={styles.buttonIconLeft}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M1 4v6h6M23 20v-6h-6"
                    stroke="#FFFFFF"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"
                    stroke="#FFFFFF"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <Text style={styles.primaryButtonText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Secondary Button: LEVELS (Dark Panel) */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onLevelSelect}
            style={styles.secondaryButton}
            accessibilityLabel="Levels"
          >
            <View style={styles.buttonIconLeft}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Rect x="3" y="3" width="7" height="7" rx="1.5" fill="#00F0FF" />
                <Rect x="14" y="3" width="7" height="7" rx="1.5" fill="#00F0FF" />
                <Rect x="3" y="14" width="7" height="7" rx="1.5" fill="#00F0FF" />
                <Rect x="14" y="14" width="7" height="7" rx="1.5" fill="#00F0FF" />
              </Svg>
            </View>
            <Text style={styles.secondaryButtonText}>Levels</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(4, 13, 33, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    paddingHorizontal: 26,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 18,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 109, 0.55)',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 22,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  sadIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontFamily: 'Sora_800ExtraBold',
    fontSize: 24,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  modalSubtitle: {
    fontFamily: 'Sora_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 18,
  },
  statsCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(5, 14, 36, 0.92)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 12,
    color: colors.textSecondary,
  },
  statValue: {
    fontFamily: 'Sora_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(46, 123, 255, 0.25)',
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButtonWrapper: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    shadowColor: colors.primaryA,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    position: 'relative',
  },
  buttonIconLeft: {
    position: 'absolute',
    left: 20,
  },
  primaryButtonText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    width: '100%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.buttonSecondaryBorder,
    position: 'relative',
  },
  secondaryButtonText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
});
