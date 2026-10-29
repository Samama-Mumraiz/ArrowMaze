import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Defs, Pattern, Line, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useTheme, ThemeMode } from '../theme/ThemeContext';
import { colors } from '../theme/colors';
import { usePlayer } from '../store/PlayerContext';

export default function SettingsScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const {
    mode,
    setThemeMode,
    settings,
    setSoundEnabled,
    setMusicEnabled,
    setVibrationEnabled,
  } = useTheme();

  const { setCurrentLevel } = usePlayer();

  const handleResetProgress = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
      // platform without haptics
    }
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset your puzzle progress back to Level 1?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setCurrentLevel(1);
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch {
              // platform without haptics
            }
          },
        },
      ]
    );
  };

  const handleThemeSelect = (selected: ThemeMode) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // platform without haptics
    }
    setThemeMode(selected);
  };

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
            <Pattern id="settingsGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <Line x1="0" y1="0" x2="32" y2="0" stroke="rgba(0, 240, 255, 0.04)" strokeWidth="1" />
              <Line x1="0" y1="0" x2="0" y2="32" stroke="rgba(0, 240, 255, 0.04)" strokeWidth="1" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#settingsGrid)" />
        </Svg>
      </View>

      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        {/* TOP HEADER: Back Arrow ← | Title "Settings" (Screen 8 Reference) */}
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

          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. TOGGLE CONTROLS: Sound, Music, Vibration (Screen 8 Reference) */}
          <View style={styles.togglesCard}>
            {/* Sound Row */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLabelRow}>
                <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"
                    stroke="#00F0FF"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text style={styles.toggleLabelText}>Sound</Text>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#162C54', true: '#007BFF' }}
                thumbColor={settings.soundEnabled ? '#00F0FF' : '#7E99C2'}
              />
            </View>

            <View style={styles.cardDivider} />

            {/* Music Row */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLabelRow}>
                <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M9 18V5l12-2v13"
                    stroke="#00F0FF"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Circle cx="6" cy="18" r="3" fill="#00F0FF" />
                  <Circle cx="18" cy="16" r="3" fill="#00F0FF" />
                </Svg>
                <Text style={styles.toggleLabelText}>Music</Text>
              </View>
              <Switch
                value={settings.musicEnabled}
                onValueChange={setMusicEnabled}
                trackColor={{ false: '#162C54', true: '#007BFF' }}
                thumbColor={settings.musicEnabled ? '#00F0FF' : '#7E99C2'}
              />
            </View>

            <View style={styles.cardDivider} />

            {/* Vibration Row */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLabelRow}>
                <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                  <Rect x="7" y="2" width="10" height="20" rx="3" stroke="#00F0FF" strokeWidth={2} />
                  <Line x1="1" y1="8" x2="3" y2="8" stroke="#00F0FF" strokeWidth={2} strokeLinecap="round" />
                  <Line x1="1" y1="12" x2="3" y2="12" stroke="#00F0FF" strokeWidth={2} strokeLinecap="round" />
                  <Line x1="1" y1="16" x2="3" y2="16" stroke="#00F0FF" strokeWidth={2} strokeLinecap="round" />
                  <Line x1="21" y1="8" x2="23" y2="8" stroke="#00F0FF" strokeWidth={2} strokeLinecap="round" />
                  <Line x1="21" y1="12" x2="23" y2="12" stroke="#00F0FF" strokeWidth={2} strokeLinecap="round" />
                  <Line x1="21" y1="16" x2="23" y2="16" stroke="#00F0FF" strokeWidth={2} strokeLinecap="round" />
                </Svg>
                <Text style={styles.toggleLabelText}>Vibration</Text>
              </View>
              <Switch
                value={settings.vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ false: '#162C54', true: '#007BFF' }}
                thumbColor={settings.vibrationEnabled ? '#00F0FF' : '#7E99C2'}
              />
            </View>
          </View>

          {/* 2. THEME SECTION (Screen 8 Reference) */}
          <Text style={styles.sectionHeaderTitle}>Theme</Text>

          <View style={styles.themeRadioCard}>
            {/* Option 1: Dark (Selected by Default) */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleThemeSelect('dark')}
              style={[
                styles.radioRow,
                (mode === 'dark' || mode === 'cyberpunk') && styles.radioRowSelected,
              ]}
            >
              <View style={styles.radioIndicatorLeft}>
                <View
                  style={[
                    styles.radioOuterCircle,
                    (mode === 'dark' || mode === 'cyberpunk') && styles.radioOuterSelected,
                  ]}
                >
                  {(mode === 'dark' || mode === 'cyberpunk') && (
                    <View style={styles.radioInnerDot} />
                  )}
                </View>
                <Text style={styles.radioLabelText}>Dark</Text>
              </View>

              {/* Moon Icon 🌙 */}
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                  fill="#00F0FF"
                  stroke="#00F0FF"
                  strokeWidth={1.5}
                />
              </Svg>
            </TouchableOpacity>

            <View style={styles.cardDivider} />

            {/* Option 2: Light */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleThemeSelect('light')}
              style={[styles.radioRow, mode === 'light' && styles.radioRowSelected]}
            >
              <View style={styles.radioIndicatorLeft}>
                <View
                  style={[
                    styles.radioOuterCircle,
                    mode === 'light' && styles.radioOuterSelected,
                  ]}
                >
                  {mode === 'light' && <View style={styles.radioInnerDot} />}
                </View>
                <Text style={styles.radioLabelText}>Light</Text>
              </View>

              {/* Sun Icon ☀️ */}
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="5" stroke="#7E99C2" strokeWidth={2} />
                <Line x1="12" y1="1" x2="12" y2="3" stroke="#7E99C2" strokeWidth={2} strokeLinecap="round" />
                <Line x1="12" y1="21" x2="12" y2="23" stroke="#7E99C2" strokeWidth={2} strokeLinecap="round" />
                <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#7E99C2" strokeWidth={2} strokeLinecap="round" />
                <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#7E99C2" strokeWidth={2} strokeLinecap="round" />
                <Line x1="1" y1="12" x2="3" y2="12" stroke="#7E99C2" strokeWidth={2} strokeLinecap="round" />
                <Line x1="21" y1="12" x2="23" y2="12" stroke="#7E99C2" strokeWidth={2} strokeLinecap="round" />
              </Svg>
            </TouchableOpacity>

            <View style={styles.cardDivider} />

            {/* Option 3: Classic */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleThemeSelect('classic')}
              style={[styles.radioRow, mode === 'classic' && styles.radioRowSelected]}
            >
              <View style={styles.radioIndicatorLeft}>
                <View
                  style={[
                    styles.radioOuterCircle,
                    mode === 'classic' && styles.radioOuterSelected,
                  ]}
                >
                  {mode === 'classic' && <View style={styles.radioInnerDot} />}
                </View>
                <Text style={styles.radioLabelText}>Classic</Text>
              </View>

              {/* Palette Icon 🎨 */}
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2C6.48 2 2 6.48 2 12c0 4.41 3.59 8 8 8 1.1 0 2-.9 2-2 0-.55-.22-1.05-.59-1.41-.36-.36-.59-.86-.59-1.41 0-1.1.9-2 2-2h2.18c3.77 0 6.82-3.05 6.82-6.82C21.82 5.04 17.39 2 12 2z"
                  stroke="#7E99C2"
                  strokeWidth={2}
                />
                <Circle cx="6.5" cy="11.5" r="1.5" fill="#7E99C2" />
                <Circle cx="9.5" cy="7.5" r="1.5" fill="#7E99C2" />
                <Circle cx="14.5" cy="7.5" r="1.5" fill="#7E99C2" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* 3. RESET PROGRESS BUTTON (Screen 8 Reference) */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleResetProgress}
            style={styles.resetButton}
            accessibilityLabel="Reset Progress"
          >
            <View style={styles.resetButtonContent}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M1 4v6h6M23 20v-6h-6"
                  stroke="#7E99C2"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"
                  stroke="#7E99C2"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.resetButtonText}>Reset Progress</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
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
  scrollContent: {
    paddingVertical: 10,
    gap: 16,
  },
  togglesCard: {
    backgroundColor: colors.panel,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingHorizontal: 18,
    paddingVertical: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  toggleLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  toggleLabelText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(46, 123, 255, 0.25)',
  },
  sectionHeaderTitle: {
    fontFamily: 'Sora_700Bold',
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginTop: 4,
    marginBottom: -4,
  },
  themeRadioCard: {
    backgroundColor: colors.panel,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingHorizontal: 18,
    paddingVertical: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  radioRowSelected: {
    backgroundColor: 'rgba(34, 211, 255, 0.08)',
    borderRadius: 12,
    marginHorizontal: -6,
    paddingHorizontal: 6,
  },
  radioIndicatorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  radioOuterCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4E688F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.accent,
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  radioLabelText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: colors.buttonSecondaryBorder,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  resetButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  resetButtonText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 15.5,
    color: colors.textSecondary,
  },
});
