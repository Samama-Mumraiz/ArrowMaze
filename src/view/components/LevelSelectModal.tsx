import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { PROGRESSIVE_LEVELS, getDifficultyTheme } from '../../levels/levelsData';
import { LevelDifficulty } from '../../model/types';

interface LevelSelectModalProps {
  visible: boolean;
  currentLevel: number;
  onSelectLevel: (levelNumber: number) => void;
  onClose: () => void;
}

export default function LevelSelectModal({
  visible,
  currentLevel,
  onSelectLevel,
  onClose,
}: LevelSelectModalProps): React.JSX.Element {
  const { theme } = useTheme();
  const { height: screenHeight } = useWindowDimensions();
  const [filter, setFilter] = useState<'All' | LevelDifficulty>('All');

  const filteredLevels = React.useMemo(() => {
    if (filter === 'All') return PROGRESSIVE_LEVELS;
    return PROGRESSIVE_LEVELS.filter((l) => l.difficulty === filter);
  }, [filter]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.backdrop, { backgroundColor: theme.modalBg }]}>
        <View
          style={[
            styles.containerCard,
            {
              backgroundColor: theme.modalCardBg,
              borderColor: theme.modalBorder,
              maxHeight: Math.min(620, screenHeight * 0.85),
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: theme.textPrimary }]}>
                Select Level
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Choose any maze to untangle
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                { backgroundColor: theme.isDark ? '#1E293B' : '#F1F5F9' },
                pressed && styles.buttonPressed,
              ]}
              hitSlop={12}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 6L6 18M6 6l12 12"
                  stroke={theme.isDark ? '#94A3B8' : '#64748B'}
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
          </View>

          {/* Difficulty Filter Chips */}
          <View style={styles.filterRow}>
            {(['All', 'Easy', 'Normal', 'Medium', 'Hard', 'Master'] as const).map(
              (category) => {
                const isActive = filter === category;
                return (
                  <Pressable
                    key={category}
                    onPress={() => setFilter(category)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: isActive
                          ? theme.isDark
                            ? '#2563EB'
                            : '#2563EB'
                          : theme.isDark
                          ? '#1E293B'
                          : '#F1F5F9',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        {
                          color: isActive
                            ? '#FFFFFF'
                            : theme.isDark
                            ? '#94A3B8'
                            : '#64748B',
                          fontWeight: isActive ? '700' : '500',
                        },
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              }
            )}
          </View>

          {/* Grid of Level Tiles */}
          <ScrollView
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.grid}>
              {filteredLevels.map((lvl) => {
                const isSelected = lvl.levelNumber === currentLevel;
                const diffTheme = getDifficultyTheme(lvl.difficulty, theme.isDark);
                const isBreather =
                  lvl.subtitle.toLowerCase().includes('calm') ||
                  lvl.subtitle.toLowerCase().includes('breath') ||
                  lvl.subtitle.toLowerCase().includes('relax');

                return (
                  <Pressable
                    key={`lvl-chip-${lvl.levelNumber}`}
                    onPress={() => {
                      onSelectLevel(lvl.levelNumber);
                      onClose();
                    }}
                    style={({ pressed }) => [
                      styles.levelTile,
                      {
                        backgroundColor: isSelected
                          ? theme.isDark
                            ? 'rgba(37, 99, 235, 0.25)'
                            : '#EFF6FF'
                          : theme.isDark
                          ? '#1E293B'
                          : '#FFFFFF',
                        borderColor: isSelected
                          ? '#2563EB'
                          : theme.isDark
                          ? '#334155'
                          : '#E2E8F0',
                        borderWidth: isSelected ? 2 : 1,
                      },
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <View style={styles.tileHeader}>
                      <Text
                        style={[
                          styles.levelNumberText,
                          {
                            color: isSelected
                              ? '#2563EB'
                              : theme.isDark
                              ? '#F8FAFC'
                              : '#0F172A',
                          },
                        ]}
                      >
                        {lvl.levelNumber}
                      </Text>
                      {isBreather && (
                        <View style={styles.breatherBadge}>
                          <Text style={styles.breatherIcon}>🍃</Text>
                        </View>
                      )}
                    </View>

                    <Text
                      numberOfLines={1}
                      style={[styles.tileTitle, { color: theme.textSecondary }]}
                    >
                      {lvl.title}
                    </Text>

                    <View
                      style={[
                        styles.difficultyPill,
                        {
                          backgroundColor: diffTheme.bg,
                          borderColor: diffTheme.border,
                        },
                      ]}
                    >
                      <Text style={[styles.difficultyText, { color: diffTheme.text }]}>
                        {lvl.difficulty || 'Normal'}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  containerCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    borderWidth: 1.5,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  filterChipText: {
    fontSize: 12,
  },
  gridContent: {
    paddingBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  levelTile: {
    width: '31%',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    minHeight: 82,
    justifyContent: 'space-between',
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: '100%',
  },
  levelNumberText: {
    fontSize: 17,
    fontWeight: '800',
  },
  breatherBadge: {
    marginLeft: 2,
  },
  breatherIcon: {
    fontSize: 11,
  },
  tileTitle: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 4,
    textAlign: 'center',
  },
  difficultyPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 9,
    fontWeight: '700',
  },
});
