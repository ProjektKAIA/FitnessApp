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

// Fitness Workout Hintergrundbilder
const WORKOUT_IMAGES = {
  default: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
  active: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
};

export const WorkoutTile: React.FC<Props> = ({
  size = '1x1',
  workoutName = 'Start',
  duration,
  exerciseCount,
  isActive = false,
  onPress,
}) => {
  return (
    <BaseTile
      size={size}
      onPress={onPress}
      backgroundImage={isActive ? WORKOUT_IMAGES.active : WORKOUT_IMAGES.default}
      gradientColors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)']}
    >
      <View style={styles.container}>
        <Text style={styles.label} numberOfLines={1}>
          {isActive ? 'AKTIV' : 'WORKOUT'}
        </Text>
        <Text style={styles.title} numberOfLines={1}>{workoutName}</Text>
      </View>
    </BaseTile>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 2,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.8,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.white,
  },
});
