// /workspaces/claude-workspace/fitnessapp/src/components/tiles/HealthTile.tsx
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, TILE } from '@/constants';
import { TTileSize } from '@/types';

interface Props {
  size?: TTileSize;
  steps: number;
  stepsGoal: number;
  calories: number;
  caloriesGoal?: number;
  activeMinutes?: number;
  activeMinutesGoal?: number;
  onPress?: () => void;
}

const TILE_GAP = TILE.gap;
const PADDING = SPACING.lg;

export const HealthTile: React.FC<Props> = ({
  size = '2x1',
  steps,
  stepsGoal,
  calories,
  caloriesGoal = 500,
  activeMinutes = 0,
  activeMinutesGoal = 30,
  onPress,
}) => {
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();

  const tileWidth = useMemo(() => {
    const totalGaps = TILE_GAP * (TILE.columns - 1);
    const singleWidth = (screenWidth - PADDING * 2 - totalGaps) / TILE.columns;
    return size === '2x1' ? singleWidth * 2 + TILE_GAP : singleWidth;
  }, [screenWidth, size]);

  const stepsProgress = stepsGoal > 0 ? Math.min(steps / stepsGoal, 1) : 0;
  const caloriesProgress = caloriesGoal > 0 ? Math.min(calories / caloriesGoal, 1) : 0;
  const activeProgress = activeMinutesGoal > 0 ? Math.min(activeMinutes / activeMinutesGoal, 1) : 0;

  const ringSize = 56;
  const strokeWidth = 5;
  const radius = (ringSize - strokeWidth * 3) / 2;
  const circumference = radius * 2 * Math.PI;
  const center = ringSize / 2;

  const formatSteps = (value: number): string => {
    if (value >= 10000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toLocaleString();
  };

  return (
    <TouchableOpacity
      style={[styles.tile, { width: tileWidth, height: TILE.height }]}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.content}>
        {/* Activity Rings (Apple Style) */}
        <View style={styles.ringsContainer}>
          <Svg width={ringSize} height={ringSize}>
            {/* Outer Ring - Steps (Red) */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={COLORS.gray[200]}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#FF2D55"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={circumference - stepsProgress * circumference}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
            />
            {/* Middle Ring - Calories (Green) */}
            <Circle
              cx={center}
              cy={center}
              r={radius - strokeWidth - 2}
              stroke={COLORS.gray[200]}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={center}
              cy={center}
              r={radius - strokeWidth - 2}
              stroke="#30D158"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${(radius - strokeWidth - 2) * 2 * Math.PI} ${(radius - strokeWidth - 2) * 2 * Math.PI}`}
              strokeDashoffset={(radius - strokeWidth - 2) * 2 * Math.PI * (1 - caloriesProgress)}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
            />
            {/* Inner Ring - Active Minutes (Blue) */}
            <Circle
              cx={center}
              cy={center}
              r={radius - (strokeWidth + 2) * 2}
              stroke={COLORS.gray[200]}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={center}
              cy={center}
              r={radius - (strokeWidth + 2) * 2}
              stroke="#007AFF"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${(radius - (strokeWidth + 2) * 2) * 2 * Math.PI} ${(radius - (strokeWidth + 2) * 2) * 2 * Math.PI}`}
              strokeDashoffset={(radius - (strokeWidth + 2) * 2) * 2 * Math.PI * (1 - activeProgress)}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
            />
          </Svg>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <View style={[styles.statDot, { backgroundColor: '#FF2D55' }]} />
            <Text style={styles.statLabel}>{t('health.summary.steps')}</Text>
            <Text style={styles.statValue}>{formatSteps(steps)}</Text>
          </View>
          <View style={styles.statRow}>
            <View style={[styles.statDot, { backgroundColor: '#30D158' }]} />
            <Text style={styles.statLabel}>{t('health.summary.kcal')}</Text>
            <Text style={styles.statValue}>{calories}</Text>
          </View>
          <View style={styles.statRow}>
            <View style={[styles.statDot, { backgroundColor: '#007AFF' }]} />
            <Text style={styles.statLabel}>{t('health.summary.active')}</Text>
            <Text style={styles.statValue}>{activeMinutes}m</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    backgroundColor: COLORS.white,
    borderRadius: 0,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  ringsContainer: {
    marginRight: SPACING.md,
  },
  statsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: SPACING.xs,
  },
  statLabel: {
    flex: 1,
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
  },
  statValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
});
