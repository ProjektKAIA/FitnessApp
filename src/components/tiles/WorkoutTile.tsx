import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseTile } from './BaseTile';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { TTileSize } from '@/types';

interface Props {
  size?: TTileSize;
  workoutName?: string;
  duration?: number;
  exerciseCount?: number;
  isActive?: boolean;
  onPress?: () => void;
}

export const WorkoutTile: React.FC<Props> = ({
  size = '2x1',
  workoutName = 'Start Workout',
  duration,
  exerciseCount,
  isActive = false,
  onPress,
}) => {
  return (
    <BaseTile
      size={size}
      onPress={onPress}
      gradientColors={
        isActive
          ? [COLORS.accent, COLORS.accent]
          : ['rgba(33,150,243,0.8)', 'rgba(33,150,243,0.95)']
      }
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{isActive ? '⏱️' : '💪'}</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.label}>
            {isActive ? 'IN PROGRESS' : 'WORKOUT'}
          </Text>
          <Text style={styles.title}>{workoutName}</Text>

          {(duration !== undefined || exerciseCount !== undefined) && (
            <View style={styles.statsRow}>
              {duration !== undefined && (
                <Text style={styles.stat}>{duration} min</Text>
              )}
              {exerciseCount !== undefined && (
                <Text style={styles.stat}>{exerciseCount} exercises</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.arrow}>
          <Text style={styles.arrowText}>→</Text>
        </View>
      </View>
    </BaseTile>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.overlay.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  icon: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.8,
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  stat: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.8,
    marginRight: SPACING.lg,
  },
  arrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.overlay.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.white,
  },
});
