import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseTile } from './BaseTile';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { TTileSize } from '@/types';

interface Props {
  size?: TTileSize;
  currentStreak: number;
  longestStreak: number;
  onPress?: () => void;
}

export const StreakTile: React.FC<Props> = ({
  size = '1x1',
  currentStreak,
  longestStreak,
  onPress,
}) => {
  const isOnFire = currentStreak >= 7;

  return (
    <BaseTile
      size={size}
      onPress={onPress}
      gradientColors={
        isOnFire
          ? [COLORS.accent, '#FF6B35']
          : [COLORS.gray[700], COLORS.gray[800]]
      }
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{isOnFire ? '🔥' : '⚡'}</Text>
        </View>

        <Text style={styles.label}>STREAK</Text>

        <View style={styles.valueContainer}>
          <Text style={styles.value}>{currentStreak}</Text>
          <Text style={styles.unit}>days</Text>
        </View>

        <Text style={styles.best}>Best: {longestStreak} days</Text>
      </View>
    </BaseTile>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.overlay.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.7,
    letterSpacing: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '700',
    color: COLORS.white,
  },
  unit: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.7,
    marginLeft: SPACING.xs,
  },
  best: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.6,
  },
});
