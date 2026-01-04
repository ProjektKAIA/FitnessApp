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
}

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
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return COLORS.success;
      case 'down':
        return COLORS.error;
      default:
        return COLORS.gray[400];
    }
  };

  return (
    <BaseTile
      size={size}
      onPress={onPress}
      gradientColors={[color, color]}
    >
      <View style={styles.container}>
        {icon && (
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
        )}

        <Text style={styles.label}>{label}</Text>

        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </View>

        {trend && trendValue && (
          <View style={[styles.trendContainer, { backgroundColor: getTrendColor() }]}>
            <Text style={styles.trendText}>
              {getTrendIcon()} {trendValue}
            </Text>
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
    opacity: 0.8,
    textTransform: 'uppercase',
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
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    opacity: 0.8,
    marginLeft: SPACING.xs,
  },
  trendContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  trendText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: '600',
  },
});
