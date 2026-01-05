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

const PROGRESS_IMAGE = 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&q=80';

export const ProgressTile: React.FC<Props> = ({
  size = '1x1',
  title = 'Ziel',
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
      backgroundImage={PROGRESS_IMAGE}
      gradientColors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.75)']}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.middle}>
          <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${percentage}%`, backgroundColor: color },
            ]}
          />
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
  title: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
  },
  percentage: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: COLORS.overlay.light,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});
