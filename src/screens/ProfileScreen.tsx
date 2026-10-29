import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { usePlayer, Trophy } from '../store/PlayerContext';

export default function ProfileScreen(): React.JSX.Element {
  const { theme } = useTheme();
  const { stats, trophies } = usePlayer();
  const { width } = useWindowDimensions();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'mastery' | 'skill' | 'streak'>('all');

  const filteredTrophies = trophies.filter((t) =>
    selectedCategory === 'all' ? true : t.category === selectedCategory
  );

  const cardWidth = width > 500 ? (width - 48) / 2 : width - 32;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Hero Section */}
        <View style={styles.heroSection}>
          <View
            style={[
              styles.avatarContainer,
              {
                backgroundColor: theme.surface,
                borderColor: theme.accent,
                shadowColor: theme.accentGlow,
              },
            ]}
          >
            <Ionicons
              name="infinite-outline"
              size={44}
              color={theme.accent}
            />
          </View>
          <Text style={[styles.userName, { color: theme.textPrimary }]}>
            Master Untangler
          </Text>
          <View
            style={[
              styles.rankBadge,
              {
                backgroundColor: theme.badgeBg,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <Ionicons name="sparkles" size={12} color={theme.accent} />
            <Text style={[styles.rankText, { color: theme.badgeText }]}>
              {stats.totalWins >= 10
                ? 'TIER IV GRANDMASTER WEAVER'
                : stats.totalWins >= 5
                ? 'TIER III LABYRINTH WEAVER'
                : stats.totalWins >= 1
                ? 'TIER II APPRENTICE UNTANGLER'
                : 'TIER I NOVICE PATHFINDER'}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          {/* Total Wins */}
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <View style={styles.statIconWrapper}>
              <Ionicons name="trophy" size={20} color={theme.accent} />
            </View>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>
              {stats.totalWins}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Total Wins
            </Text>
          </View>

          {/* Current Streak */}
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <View style={styles.statIconWrapper}>
              <Ionicons name="flame" size={20} color="#818CF8" />
            </View>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>
              {stats.currentStreak}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Win Streak
            </Text>
          </View>

          {/* Perfect Plays */}
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <View style={styles.statIconWrapper}>
              <Ionicons name="heart" size={20} color="#F43F5E" />
            </View>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>
              {stats.perfectPlays}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Perfect Plays
            </Text>
          </View>

          {/* Best Streak */}
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <View style={styles.statIconWrapper}>
              <Ionicons name="flash" size={20} color="#A78BFA" />
            </View>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>
              {stats.bestStreak}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Best Streak
            </Text>
          </View>
        </View>

        {/* Awards / Trophies Section Header */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Awards & Trophies
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
              Unlock badges as you untie tangled cords
            </Text>
          </View>
          <View
            style={[
              styles.completionPill,
              { backgroundColor: theme.badgeBg, borderColor: theme.cardBorder },
            ]}
          >
            <Text style={[styles.completionText, { color: theme.accent }]}>
              {trophies.filter((t) => t.unlocked).length} / {trophies.length}
            </Text>
          </View>
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryFiltersContainer}
        >
          {(['all', 'mastery', 'skill', 'streak'] as const).map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.7}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isActive
                      ? theme.accent
                      : theme.cardBg,
                    borderColor: isActive ? theme.accent : theme.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: isActive
                        ? theme.isDark
                          ? '#070A14'
                          : '#FFFFFF'
                        : theme.textSecondary,
                      fontWeight: isActive ? '800' : '600',
                    },
                  ]}
                >
                  {cat.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Awards / Trophies Cards Grid */}
        <View style={styles.trophyGrid}>
          {filteredTrophies.map((trophy: Trophy) => {
            return (
              <View
                key={trophy.id}
                style={[
                  styles.trophyCard,
                  {
                    width: cardWidth,
                    backgroundColor: theme.cardBg,
                    borderColor: trophy.unlocked
                      ? (trophy.activeColor ? `${trophy.activeColor}55` : theme.cardBorder)
                      : theme.divider,
                    opacity: trophy.unlocked ? 1 : 0.65,
                  },
                ]}
              >
                <View style={styles.trophyHeader}>
                  {/* Dynamic Icon: Active Colored when earned, Locked Gray when unearned */}
                  <View
                    style={[
                      styles.trophyIconContainer,
                      {
                        backgroundColor: trophy.unlocked
                          ? (trophy.activeColor ? `${trophy.activeColor}1E` : theme.badgeBg)
                          : theme.surface,
                        borderColor: trophy.unlocked
                          ? (trophy.activeColor || theme.accent)
                          : theme.divider,
                      },
                    ]}
                  >
                    <Ionicons
                      name={trophy.icon as any}
                      size={24}
                      color={trophy.unlocked ? (trophy.activeColor || theme.accent) : theme.textMuted}
                    />
                  </View>

                  {/* Badge: Active Emerald/Colored pill when earned, Muted Gray when locked */}
                  <View
                    style={[
                      styles.trophyBadge,
                      {
                        backgroundColor: trophy.unlocked
                          ? (trophy.activeColor ? `${trophy.activeColor}22` : 'rgba(16, 185, 129, 0.15)')
                          : 'rgba(148, 163, 184, 0.12)',
                        borderColor: trophy.unlocked
                          ? (trophy.activeColor ? `${trophy.activeColor}60` : 'rgba(16, 185, 129, 0.4)')
                          : 'rgba(148, 163, 184, 0.25)',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.trophyBadgeText,
                        {
                          color: trophy.unlocked
                            ? (trophy.activeColor || '#10B981')
                            : theme.textMuted,
                          fontWeight: trophy.unlocked ? '800' : '600',
                        },
                      ]}
                    >
                      {trophy.unlocked ? 'UNLOCKED' : 'LOCKED'}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.trophyTitle, { color: theme.textPrimary }]}>
                  {trophy.title}
                </Text>

                <Text
                  style={[styles.trophyDescription, { color: theme.textSecondary }]}
                >
                  {trophy.description}
                </Text>

                {/* Progress bar */}
                <View style={styles.progressContainer}>
                  <View
                    style={[
                      styles.progressTrack,
                      { backgroundColor: theme.divider },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.round(trophy.progress * 100)}%`,
                          backgroundColor: trophy.unlocked
                            ? (trophy.activeColor || theme.accent)
                            : '#94A3B8',
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[styles.progressLabel, { color: theme.textMuted }]}
                  >
                    {trophy.progressLabel}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 36,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 6,
  },
  avatarContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  rankText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  statIconWrapper: {
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  completionPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  completionText: {
    fontSize: 12,
    fontWeight: '800',
  },
  categoryFiltersContainer: {
    gap: 8,
    paddingBottom: 14,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  categoryText: {
    fontSize: 11,
    letterSpacing: 0.8,
  },
  trophyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  trophyCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  trophyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trophyIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  trophyBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  trophyTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  trophyDescription: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
    marginBottom: 14,
  },
  progressContainer: {
    gap: 6,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
