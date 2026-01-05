import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseTile } from './BaseTile';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { TTileSize } from '@/types';

interface Props {
  size?: TTileSize;
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onPress?: () => void;
  backgroundImage?: string;
}

// Fitness-bezogene Hintergrundbilder
const STAT_IMAGES: Record<string, string> = {
  calendar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
  weight: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80',
  total: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80',
  chart: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
};

export const StatTile: React.FC<Props> = ({
  size = '1x1',
  label,
  value,
  unit,
  icon,
  color = COLORS.primary,
  trend,
  trendValue,
  onPress,
  backgroundImage,
}) => {
  // Wähle Hintergrundbild basierend auf Icon
  const getBackgroundImage = () => {
    if (backgroundImage) return backgroundImage;
    if (icon === '📅') return STAT_IMAGES.calendar;
    if (icon === '🏋️') return STAT_IMAGES.weight;
    if (icon === '💪') return STAT_IMAGES.total;
    if (icon === '📊') return STAT_IMAGES.chart;
    return STAT_IMAGES.total;
  };

  return (
    <BaseTile
      size={size}
      onPress={onPress}
      backgroundImage={getBackgroundImage()}
      gradientColors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.75)']}
    >
      <View style={styles.container}>
        {icon && <Text style={styles.icon}>{icon}</Text>}

        <View style={styles.bottom}>
          <Text style={styles.label} numberOfLines={1}>{label}</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{value}</Text>
            {unit && <Text style={styles.unit}>{unit}</Text>}
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
    textTransform: 'uppercase',
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
    marginLeft: 2,
  },
});
