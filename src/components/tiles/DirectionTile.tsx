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
  customTitle?: string;
  customImage?: string;
}

const DIRECTION_CONFIG: Record<TDirection, { icon: string; label: string; image: string }> = {
  gym: {
    icon: '🏋️',
    label: 'Gym',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
  },
  calisthenics: {
    icon: '🤸',
    label: 'Calisthenics',
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&q=80',
  },
  cardio: {
    icon: '🏃',
    label: 'Cardio',
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&q=80',
  },
  yoga: {
    icon: '🧘',
    label: 'Yoga',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
  },
  mobility: {
    icon: '🔄',
    label: 'Mobility',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
  },
  custom: {
    icon: '⚡',
    label: 'Custom',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80',
  },
  running: {
    icon: '🏃',
    label: 'Running',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&q=80',
  },
};

export const DirectionTile: React.FC<Props> = ({
  size = '1x1',
  direction,
  isSelected = false,
  workoutsCount,
  onPress,
  customTitle,
  customImage,
}) => {
  const config = DIRECTION_CONFIG[direction];
  const displayTitle = customTitle || config.label;
  const displayImage = customImage || config.image;

  return (
    <BaseTile
      size={size}
      onPress={onPress}
      backgroundImage={displayImage}
      gradientColors={
        isSelected
          ? ['rgba(33,150,243,0.5)', 'rgba(33,150,243,0.85)']
          : ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.75)']
      }
    >
      <View style={styles.container}>
        <Text style={styles.label}>{displayTitle}</Text>
        {workoutsCount !== undefined && workoutsCount > 0 && (
          <Text style={styles.count}>{workoutsCount}</Text>
        )}
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
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  count: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.7,
  },
});
