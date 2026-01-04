import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseTile } from './BaseTile';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { TDirection, TTileSize } from '@/types';

interface Props {
  size?: TTileSize;
  direction: TDirection;
  isSelected?: boolean;
  workoutsCount?: number;
  onPress?: () => void;
}

const DIRECTION_CONFIG: Record<TDirection, { icon: string; label: string; color: string }> = {
  gym: { icon: '🏋️', label: 'Gym', color: COLORS.primary },
  calisthenics: { icon: '🤸', label: 'Calisthenics', color: COLORS.success },
  cardio: { icon: '🏃', label: 'Cardio', color: COLORS.accent },
  yoga: { icon: '🧘', label: 'Yoga', color: COLORS.purple },
  mobility: { icon: '🔄', label: 'Mobility', color: '#00BCD4' },
  custom: { icon: '⚡', label: 'Custom', color: COLORS.gray[600] },
};

export const DirectionTile: React.FC<Props> = ({
  size = '1x1',
  direction,
  isSelected = false,
  workoutsCount,
  onPress,
}) => {
  const config = DIRECTION_CONFIG[direction];

  return (
    <BaseTile
      size={size}
      onPress={onPress}
      gradientColors={
        isSelected
          ? [config.color, config.color]
          : [COLORS.gray[700], COLORS.gray[800]]
      }
    >
      <View style={styles.container}>
        <View
          style={[
            styles.iconContainer,
            isSelected && { backgroundColor: COLORS.overlay.light },
          ]}
        >
          <Text style={styles.icon}>{config.icon}</Text>
        </View>

        <Text style={styles.label}>{config.label}</Text>

        {workoutsCount !== undefined && (
          <Text style={styles.count}>{workoutsCount} workouts</Text>
        )}

        {isSelected && (
          <View style={styles.selectedBadge}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.overlay.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.white,
  },
  count: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.7,
  },
  selectedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '700',
  },
});
