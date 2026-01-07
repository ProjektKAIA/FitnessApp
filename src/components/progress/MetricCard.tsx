// /workspaces/claude-workspace/fitnessapp/src/components/progress/MetricCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

interface Props {
  icon?: string;
  iconColor?: string;
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
  };
  onPress?: () => void;
  compact?: boolean;
  darkMode?: boolean;
}

export const MetricCard: React.FC<Props> = ({
  icon,
  iconColor,
  title,
  value,
  unit,
  subtitle,
  trend,
  onPress,
  compact = false,
  darkMode = false,
}) => {
  const bgColor = darkMode ? '#1E1E2E' : COLORS.white;
  const titleColor = darkMode ? COLORS.gray[400] : COLORS.gray[500];
  const valueColor = darkMode ? COLORS.white : COLORS.gray[900];
  const unitColor = darkMode ? COLORS.gray[400] : COLORS.gray[500];
  const subtitleColor = darkMode ? COLORS.gray[500] : COLORS.gray[500];
  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  const getTrendColor = () => {
    if (!trend) return COLORS.gray[500];
    switch (trend.direction) {
      case 'up':
        return COLORS.success;
      case 'down':
        return COLORS.accent;
      default:
        return COLORS.gray[500];
    }
  };

  const content = (
    <View style={[styles.container, compact && styles.containerCompact, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        {icon && (
          <Text style={[styles.icon, iconColor && { color: iconColor }]}>{icon}</Text>
        )}
        <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.valueContainer}>
        <Text style={[styles.value, compact && styles.valueCompact, { color: valueColor }]}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Text>
        {unit && <Text style={[styles.unit, { color: unitColor }]}>{unit}</Text>}
      </View>

      {(subtitle || trend) && (
        <View style={styles.footer}>
          {subtitle && <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>}
          {trend && (
            <View style={styles.trendContainer}>
              <Text style={[styles.trendIcon, { color: getTrendColor() }]}>
                {getTrendIcon()}
              </Text>
              <Text style={[styles.trendValue, { color: getTrendColor() }]}>
                {Math.abs(trend.value)}%
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    minWidth: 140,
  },
  containerCompact: {
    padding: SPACING.md,
    minWidth: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  icon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
  },
  valueCompact: {
    fontSize: FONT_SIZES.xl,
  },
  unit: {
    fontSize: FONT_SIZES.sm,
    marginLeft: SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.xs,
    flex: 1,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    fontSize: FONT_SIZES.xs,
    marginRight: 2,
  },
  trendValue: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
});
