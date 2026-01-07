// /workspaces/claude-workspace/fitnessapp/src/components/progress/ActivityRings.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';

export interface RingData {
  id: string;
  value: number;
  goal: number;
  color: string;
  gradientEnd?: string;
  label: string;
  unit?: string;
  icon?: string;
}

interface Props {
  rings: RingData[];
  size?: number;
  strokeWidth?: number;
  showLabels?: boolean;
  showCenter?: boolean;
  centerContent?: React.ReactNode;
  onRingPress?: (ring: RingData, index: number) => void;
  darkMode?: boolean;
}

export const ActivityRings: React.FC<Props> = ({
  rings,
  size = 200,
  strokeWidth = 16,
  showLabels = true,
  showCenter = true,
  centerContent,
  onRingPress,
  darkMode = true,
}) => {
  const center = size / 2;
  const gap = 6;

  const formatValue = (value: number): string => {
    if (value >= 10000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toLocaleString();
  };

  const bgColor = darkMode ? COLORS.gray[700] : COLORS.gray[300];
  const bgOpacity = darkMode ? 0.3 : 0.6;
  const textColor = darkMode ? COLORS.white : COLORS.gray[900];
  const subtextColor = darkMode ? COLORS.gray[400] : COLORS.gray[600];
  const borderColor = darkMode ? COLORS.gray[700] : COLORS.gray[300];
  const badgeBgColor = darkMode ? COLORS.gray[700] : COLORS.gray[200];

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
                  stroke={bgColor}
                  strokeWidth={strokeWidth}
                  fill="none"
                  opacity={bgOpacity}
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
            const isComplete = progress >= 100;

            const LabelContent = (
              <View style={[styles.labelRow, { borderBottomColor: borderColor }]}>
                <View style={[styles.labelDot, { backgroundColor: ring.color }]} />
                {ring.icon && <Text style={styles.labelIcon}>{ring.icon}</Text>}
                <Text style={[styles.labelText, { color: subtextColor }]}>{ring.label}</Text>
                <Text style={[styles.labelValue, { color: textColor }]}>
                  {formatValue(ring.value)}
                  {ring.unit && <Text style={[styles.labelUnit, { color: subtextColor }]}> {ring.unit}</Text>}
                </Text>
                <View style={[styles.progressBadge, { backgroundColor: badgeBgColor }, isComplete && styles.progressBadgeComplete]}>
                  <Text style={[styles.labelProgress, { color: subtextColor }, isComplete && styles.labelProgressComplete]}>
                    {progress}%
                  </Text>
                </View>
              </View>
            );

            if (onRingPress) {
              return (
                <TouchableOpacity
                  key={ring.id}
                  onPress={() => onRingPress(ring, index)}
                  activeOpacity={0.7}
                >
                  {LabelContent}
                </TouchableOpacity>
              );
            }

            return <View key={ring.id}>{LabelContent}</View>;
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
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  labelDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  labelIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  labelText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
  },
  labelValue: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginRight: SPACING.md,
  },
  labelUnit: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '400',
  },
  progressBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  progressBadgeComplete: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
  },
  labelProgress: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  labelProgressComplete: {
    color: COLORS.success,
  },
});
