import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme, ThemeMode } from '../../theme/ThemeContext';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps): React.JSX.Element | null {
  const { theme, mode, setThemeMode } = useTheme();

  if (!visible) return null;

  return (
    <View style={[styles.backdrop, { backgroundColor: theme.modalBg }]}>
      <View
        style={[
          styles.modalCard,
          {
            backgroundColor: theme.modalCardBg,
            borderColor: theme.modalBorder,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            SETTINGS
          </Text>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M6 18L18 6M6 6l12 12"
                stroke={theme.textPrimary}
                strokeWidth={2}
                strokeLinecap="round"
              />
            </Svg>
          </Pressable>
        </View>

        {/* Visual Theme Selection */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          AESTHETIC THEME
        </Text>

        <View style={styles.themeOptionsRow}>
          {/* Cyberpunk Option */}
          <Pressable
            onPress={() => setThemeMode('cyberpunk')}
            style={[
              styles.themeCard,
              {
                borderColor: mode === 'cyberpunk' ? '#00F0FF' : theme.hudBorder,
                backgroundColor: '#070A12',
              },
            ]}
          >
            <View style={[styles.themePill, { backgroundColor: '#00F0FF' }]} />
            <Text style={[styles.themeCardText, { color: '#F8FAFC' }]}>
              Cyberpunk
            </Text>
            <Text style={[styles.themeCardSub, { color: '#00F0FF' }]}>
              Neon Odyssey
            </Text>
          </Pressable>

          {/* Zen Option */}
          <Pressable
            onPress={() => setThemeMode('zen')}
            style={[
              styles.themeCard,
              {
                borderColor: mode === 'zen' ? '#2563EB' : theme.hudBorder,
                backgroundColor: '#FAF7F2',
              },
            ]}
          >
            <View style={[styles.themePill, { backgroundColor: '#2563EB' }]} />
            <Text style={[styles.themeCardText, { color: '#292524' }]}>
              Zen Minimal
            </Text>
            <Text style={[styles.themeCardSub, { color: '#2563EB' }]}>
              Matte Ink
            </Text>
          </Pressable>
        </View>

        {/* How to Play Guide */}
        <View
          style={[
            styles.guideBox,
            {
              backgroundColor: theme.isDark ? 'rgba(0, 240, 255, 0.06)' : 'rgba(37, 99, 235, 0.06)',
              borderColor: theme.hudBorder,
            },
          ]}
        >
          <Text style={[styles.guideTitle, { color: theme.textPrimary }]}>
            HOW TO UNTANGLE
          </Text>
          <Text style={[styles.guideText, { color: theme.textSecondary }]}>
            • Each strand terminates with a directional arrowhead.
          </Text>
          <Text style={[styles.guideText, { color: theme.textSecondary }]}>
            • Tap an arrow whose forward trajectory to the edge is free of other strands.
          </Text>
          <Text style={[styles.guideText, { color: theme.textSecondary }]}>
            • Untie the strands in reverse sequence to conquer each labyrinth.
          </Text>
        </View>

        {/* Close Done Button */}
        <Pressable
          onPress={onClose}
          style={[
            styles.doneButton,
            {
              backgroundColor: theme.buttonPrimary,
              shadowColor: theme.buttonPrimaryShadow,
            },
          ]}
        >
          <Text style={[styles.doneButtonText, { color: theme.buttonPrimaryText }]}>
            RETURN TO MAZE
          </Text>
        </Pressable>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 70,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    borderWidth: 2,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 28,
    elevation: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  closeButton: {
    padding: 4,
  },
  pressed: {
    opacity: 0.6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  themeOptionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  themeCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
  },
  themePill: {
    width: 20,
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  themeCardText: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  themeCardSub: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  guideBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 22,
  },
  guideTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  guideText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 3,
  },
  doneButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});
