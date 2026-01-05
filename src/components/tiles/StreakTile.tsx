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

const STREAK_IMAGE = 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&q=80';

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
      backgroundImage={STREAK_IMAGE}
      gradientColors={
        isOnFire
          ? ['rgba(255,75,31,0.4)', 'rgba(255,75,31,0.85)']
          : ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.75)']
      }
    >
      <View style={styles.container}>
        <Text style={styles.icon}>{isOnFire ? '🔥' : '⚡'}</Text>

        <View style={styles.bottom}>
          <Text style={styles.label}>STREAK</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{currentStreak}</Text>
            <Text style={styles.unit}>Tage</Text>
          </View>
        </View>
      </View>
    </BaseTile>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 16,
  },
  bottom: {
    gap: 2,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.8,
    letterSpacing: 0.5,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
  unit: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.7,
    marginLeft: 3,
  },
});
