import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseTile } from './BaseTile';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { TTileSize } from '@/types';

interface Props {
  size?: TTileSize;
  title?: string;
  current: number;
  target: number;
  unit?: string;
  color?: string;
  onPress?: () => void;
}

export const ProgressTile: React.FC<Props> = ({
  size = '1x1',
  title = 'Progress',
  current,
  target,
  unit = '',
  color = COLORS.success,
  onPress,
}) => {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <BaseTile
      size={size}
      onPress={onPress}
      gradientColors={[COLORS.gray[800], COLORS.gray[900]]}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.valueContainer}>
          <Text style={styles.current}>{current}</Text>
          <Text style={styles.separator}>/</Text>
          <Text style={styles.target}>
            {target}
            {unit && <Text style={styles.unit}> {unit}</Text>}
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${percentage}%`, backgroundColor: color },
            ]}
          />
        </View>

        <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
      </View>
    </BaseTile>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  current: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.white,
  },
  separator: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
    opacity: 0.5,
    marginHorizontal: SPACING.xs,
  },
  target: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
    opacity: 0.7,
  },
  unit: {
    fontSize: FONT_SIZES.sm,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.overlay.light,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  percentage: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.7,
    alignSelf: 'flex-end',
  },
});
