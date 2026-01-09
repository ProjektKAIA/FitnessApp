// /workspaces/claude-workspace/fitnessapp/src/components/tiles/StreakGoalTile.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseTile } from './BaseTile';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { TTileSize } from '@/types';

interface Props {
  size?: TTileSize;
  currentStreak: number;
  longestStreak: number;
  weeklyGoalCurrent: number;
  weeklyGoalTarget: number;
  onPress?: () => void;
}

const STREAK_IMAGE = 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&q=80';

export const StreakGoalTile: React.FC<Props> = ({
  size = '1x1',
  currentStreak,
  longestStreak,
  weeklyGoalCurrent,
  weeklyGoalTarget,
  onPress,
}) => {
  const isOnFire = currentStreak >= 7;
  const percentage = Math.min((weeklyGoalCurrent / weeklyGoalTarget) * 100, 100);

  return (
    <BaseTile
      size={size}
      onPress={onPress}
      backgroundImage={STREAK_IMAGE}
      gradientColors={
        isOnFire
          ? ['rgba(255,75,31,0.4)', 'rgba(255,75,31,0.85)']
          : ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.75)']
      }
    >
      <View style={styles.container}>
        <View style={styles.streakSection}>
          <Text style={styles.value}>{currentStreak}</Text>
          <Text style={styles.label}>Tage Streak</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.goalSection}>
          <Text style={styles.goalValue}>
            {weeklyGoalCurrent}/{weeklyGoalTarget}
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${percentage}%` }]}
            />
          </View>
        </View>
      </View>
    </BaseTile>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  streakSection: {
    gap: 2,
  },
  goalSection: {
    gap: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.white,
    opacity: 0.2,
    marginVertical: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.8,
  },
  value: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
    lineHeight: FONT_SIZES.xl * 1.2,
  },
  goalValue: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: COLORS.overlay.light,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 2,
  },
});
