// /workspaces/claude-workspace/fitnessapp/src/components/progress/WeeklyChart.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

interface ChartData {
  label: string;
  value: number;
  isToday?: boolean;
}

interface Props {
  data: ChartData[];
  title?: string;
  unit?: string;
  color?: string;
  height?: number;
  showAverage?: boolean;
}

export const WeeklyChart: React.FC<Props> = ({
  data,
  title,
  unit,
  color = COLORS.primary,
  height = 120,
  showAverage = true,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const average = data.reduce((sum, d) => sum + d.value, 0) / data.length;
  const barWidth = 28;
  const chartWidth = data.length * (barWidth + 8);

  const formatValue = (value: number): string => {
    if (value >= 10000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return Math.round(value).toString();
  };

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </View>
      )}

      <View style={styles.chartContainer}>
        <Svg width="100%" height={height}>
          {/* Average line */}
          {showAverage && average > 0 && (
            <Line
              x1="0"
              y1={height - (average / maxValue) * (height - 20)}
              x2="100%"
              y2={height - (average / maxValue) * (height - 20)}
              stroke={COLORS.gray[400]}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          )}
        </Svg>

        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const barHeight = maxValue > 0 ? (item.value / maxValue) * (height - 30) : 0;
            const isActive = item.value > 0;

            return (
              <View key={index} style={styles.barWrapper}>
                <View style={[styles.barBackground, { height: height - 30 }]}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(barHeight, 4),
                        backgroundColor: isActive
                          ? item.isToday
                            ? color
                            : `${color}99`
                          : COLORS.gray[200],
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, item.isToday && styles.barLabelToday]}>
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {showAverage && (
        <View style={styles.footer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: COLORS.gray[400] }]} />
            <Text style={styles.legendText}>
              Ø {formatValue(average)} {unit}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  unit: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
  },
  chartContainer: {
    position: 'relative',
  },
  barsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.xs,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barBackground: {
    width: 28,
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: BORDER_RADIUS.sm,
  },
  barLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    marginTop: SPACING.xs,
  },
  barLabelToday: {
    color: COLORS.gray[900],
    fontWeight: '600',
  },
  footer: {
    marginTop: SPACING.md,
    flexDirection: 'row',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendLine: {
    width: 16,
    height: 2,
    marginRight: SPACING.xs,
    borderRadius: 1,
  },
  legendText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
  },
});
