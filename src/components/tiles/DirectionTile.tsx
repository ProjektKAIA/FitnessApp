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
      backgroundImage={config.image}
      gradientColors={
        isSelected
          ? ['rgba(33,150,243,0.5)', 'rgba(33,150,243,0.85)']
          : ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.75)']
      }
    >
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.icon}>{config.icon}</Text>
          {isSelected && (
            <View style={styles.selectedBadge}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          )}
        </View>

        <View style={styles.bottom}>
          <Text style={styles.label}>{config.label}</Text>
          {workoutsCount !== undefined && (
            <Text style={styles.count}>{workoutsCount}</Text>
          )}
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
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 18,
  },
  selectedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 10,
    color: COLORS.success,
    fontWeight: '700',
  },
  bottom: {
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
