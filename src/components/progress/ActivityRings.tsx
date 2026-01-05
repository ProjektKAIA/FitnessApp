// /workspaces/claude-workspace/fitnessapp/src/components/progress/ActivityRings.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';

interface RingData {
  value: number;
  goal: number;
  color: string;
  gradientEnd?: string;
  label: string;
  unit?: string;
}

interface Props {
  rings: RingData[];
  size?: number;
  strokeWidth?: number;
  showLabels?: boolean;
  showCenter?: boolean;
  centerContent?: React.ReactNode;
}

export const ActivityRings: React.FC<Props> = ({
  rings,
  size = 200,
  strokeWidth = 16,
  showLabels = true,
  showCenter = true,
  centerContent,
}) => {
  const { t } = useTranslation();
  const center = size / 2;
  const gap = 4;

  const formatValue = (value: number): string => {
    if (value >= 10000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.ringsWrapper, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Defs>
            {rings.map((ring, index) => (
              <LinearGradient
                key={`gradient-${index}`}
                id={`ring-gradient-${index}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor={ring.color} />
                <Stop offset="100%" stopColor={ring.gradientEnd || ring.color} />
              </LinearGradient>
            ))}
          </Defs>

          {rings.map((ring, index) => {
            const radius = center - strokeWidth / 2 - (strokeWidth + gap) * index;
            const circumference = radius * 2 * Math.PI;
            const progress = ring.goal > 0 ? Math.min(ring.value / ring.goal, 1.5) : 0;
            const strokeDashoffset = circumference - progress * circumference;

            return (
              <React.Fragment key={index}>
                {/* Background circle */}
                <Circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={COLORS.gray[200]}
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {/* Progress circle */}
                <Circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={`url(#ring-gradient-${index})`}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${center} ${center})`}
                />
              </React.Fragment>
            );
          })}
        </Svg>

        {showCenter && (
          <View style={styles.centerContent}>
            {centerContent}
          </View>
        )}
      </View>

      {showLabels && (
        <View style={styles.labelsContainer}>
          {rings.map((ring, index) => {
            const progress = ring.goal > 0 ? Math.round((ring.value / ring.goal) * 100) : 0;
            return (
              <View key={index} style={styles.labelRow}>
                <View style={[styles.labelDot, { backgroundColor: ring.color }]} />
                <Text style={styles.labelText}>{ring.label}</Text>
                <Text style={styles.labelValue}>
                  {formatValue(ring.value)}
                  {ring.unit && <Text style={styles.labelUnit}> {ring.unit}</Text>}
                </Text>
                <Text style={[styles.labelProgress, progress >= 100 && styles.labelProgressComplete]}>
                  {progress}%
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  ringsWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelsContainer: {
    marginTop: SPACING.lg,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.gray[200],
  },
  labelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.sm,
  },
  labelText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
  },
  labelValue: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginRight: SPACING.md,
  },
  labelUnit: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    fontWeight: '400',
  },
  labelProgress: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    width: 45,
    textAlign: 'right',
  },
  labelProgressComplete: {
    color: COLORS.success,
  },
});
