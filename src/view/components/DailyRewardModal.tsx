import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Rect,
} from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { usePlayer } from '../../store/PlayerContext';
import { ARROWMAZE_PALETTE } from '../../theme/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DailyRewardModalProps {
  visible: boolean;
  onClose: () => void;
}

const REWARDS_SCHEDULE = [
  { day: 1, amount: 50, label: 'Day 1' },
  { day: 2, amount: 100, label: 'Day 2' },
  { day: 3, amount: 150, label: 'Day 3', isSpecial: false },
  { day: 4, amount: 200, label: 'Day 4' },
  { day: 5, amount: 300, label: 'Day 5' },
  { day: 6, amount: 450, label: 'Day 6' },
  { day: 7, amount: 1000, label: 'Day 7', isMega: true },
];

export default function DailyRewardModal({
  visible,
  onClose,
}: DailyRewardModalProps): React.JSX.Element {
  const { coins, awardCoins } = usePlayer();
  const [claimed, setClaimed] = useState<boolean>(false);
  const [claimedAmount, setClaimedAmount] = useState<number>(0);

  // Active day is Day 3 for demonstration / onboarding
  const activeDay = 3;
  const currentReward = REWARDS_SCHEDULE[activeDay - 1];

  const handleClaim = () => {
    if (claimed) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // platform without haptics
    }
    awardCoins(currentReward.amount);
    setClaimed(true);
    setClaimedAmount(currentReward.amount);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header Gradient Banner */}
          <View style={styles.bannerContainer}>
            <Svg width="100%" height={90} viewBox="0 0 320 90">
              <Defs>
                <LinearGradient id="rewardBanner" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor="#3B82F6" />
                  <Stop offset="0.5" stopColor="#2563EB" />
                  <Stop offset="1" stopColor="#1D4ED8" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="320" height="90" rx="24" fill="url(#rewardBanner)" />
              {/* Subtle decorative circles */}
              <Circle cx="30" cy="20" r="40" fill="#60A5FA" opacity={0.25} />
              <Circle cx="290" cy="70" r="50" fill="#93C5FD" opacity={0.2} />
            </Svg>

            <View style={styles.bannerContent}>
              <View style={styles.giftIconCircle}>
                <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"
                    stroke="#FACC15"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <Text style={styles.bannerTitle}>DAILY REWARDS</Text>
              <Text style={styles.bannerSubtitle}>Log in daily to claim bonus coins!</Text>
            </View>
          </View>

          {/* 7-Day Rewards Grid */}
          <View style={styles.scheduleGrid}>
            {REWARDS_SCHEDULE.map((item) => {
              const isPast = item.day < activeDay;
              const isCurrent = item.day === activeDay;
              const isFuture = item.day > activeDay;

              return (
                <View
                  key={item.day}
                  style={[
                    styles.dayCard,
                    item.isMega && styles.megaDayCard,
                    isCurrent && styles.activeDayCard,
                    isPast && styles.pastDayCard,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isCurrent && styles.activeDayText,
                      item.isMega && styles.megaDayText,
                    ]}
                  >
                    {item.label}
                  </Text>

                  {/* Coin Icon or Gift Icon */}
                  <View style={styles.rewardIconWrapper}>
                    <Svg width={22} height={22} viewBox="0 0 24 24">
                      <Circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill={item.isMega ? '#F59E0B' : '#FACC15'}
                        stroke={item.isMega ? '#B45309' : '#D97706'}
                        strokeWidth={1.5}
                      />
                      <Text style={styles.coinDollar}>$</Text>
                    </Svg>
                  </View>

                  <Text
                    style={[
                      styles.amountText,
                      isCurrent && styles.activeAmountText,
                      item.isMega && styles.megaAmountText,
                    ]}
                  >
                    +{item.amount}
                  </Text>

                  {/* Status Indicator */}
                  {isPast ? (
                    <View style={styles.claimedBadge}>
                      <Text style={styles.claimedCheck}>✓</Text>
                    </View>
                  ) : isCurrent ? (
                    <View style={[styles.statusPill, claimed && styles.statusPillClaimed]}>
                      <Text style={styles.statusPillText}>
                        {claimed ? 'Claimed' : 'Ready'}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.lockedText}>Locked</Text>
                  )}
                </View>
              );
            })}
          </View>

          {/* Claim Action Button */}
          {claimed ? (
            <View style={styles.successBanner}>
              <Text style={styles.successText}>
                🎉 Claimed +{claimedAmount} Coins!
              </Text>
              <Text style={styles.successSubtext}>
                Next reward ready tomorrow. Current Balance: {coins} Coins
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleClaim}
              style={styles.claimButton}
            >
              <Text style={styles.claimButtonText}>
                CLAIM +{currentReward.amount} COINS
              </Text>
            </TouchableOpacity>
          )}

          {/* Close Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={8}
          >
            <Text style={styles.closeButtonText}>
              {claimed ? 'DONE' : 'LATER'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 19, 41, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: Math.min(360, SCREEN_WIDTH - 36),
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  bannerContainer: {
    width: '100%',
    height: 90,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
  },
  bannerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  giftIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  bannerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#BFDBFE',
    marginTop: 1,
  },
  scheduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
    marginBottom: 16,
  },
  dayCard: {
    width: '22.5%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
    alignItems: 'center',
  },
  megaDayCard: {
    width: '47.5%',
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
  },
  activeDayCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    borderWidth: 2,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  pastDayCard: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
    opacity: 0.85,
  },
  dayText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 4,
  },
  activeDayText: {
    color: '#2563EB',
    fontWeight: '900',
  },
  megaDayText: {
    color: '#B45309',
    fontWeight: '900',
  },
  rewardIconWrapper: {
    marginVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinDollar: {
    fontSize: 10,
    fontWeight: '900',
    color: '#78350F',
    textAlign: 'center',
    lineHeight: 22,
  },
  amountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  activeAmountText: {
    color: '#1D4ED8',
    fontWeight: '900',
  },
  megaAmountText: {
    color: '#B45309',
    fontWeight: '900',
  },
  claimedBadge: {
    marginTop: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimedCheck: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 12,
  },
  statusPill: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#2563EB',
  },
  statusPillClaimed: {
    backgroundColor: '#10B981',
  },
  statusPillText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  lockedText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 4,
  },
  claimButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: ARROWMAZE_PALETTE.warmYellow,
    borderWidth: 2,
    borderColor: '#FDE047',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  claimButtonText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 0.5,
  },
  successBanner: {
    width: '100%',
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  successText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#065F46',
  },
  successSubtext: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#047857',
    marginTop: 2,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  closeButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
});
