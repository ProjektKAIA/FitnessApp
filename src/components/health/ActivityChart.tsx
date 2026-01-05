import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { IDailyHealthSummary } from '@/types/health';

interface Props {
  weekData: IDailyHealthSummary[];
  monthData?: IDailyHealthSummary[];
  stepsGoal: number;
}

type Period = 'week' | 'month';

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const ActivityChart: React.FC<Props> = ({ weekData, monthData, stepsGoal }) => {
  const { t, i18n } = useTranslation();
  const [period, setPeriod] = useState<Period>('week');

  const data = period === 'week' ? weekData : (monthData || []);
  const dayLabels = i18n.language === 'de' ? DAYS : DAYS_EN;

  const chartWidth = Dimensions.get('window').width - SPACING.lg * 4;
  const chartHeight = 100;
  const barCount = period === 'week' ? 7 : Math.min(data.length, 30);
  const barWidth = (chartWidth - (barCount - 1) * 4) / barCount;
  const maxSteps = Math.max(stepsGoal, ...data.map((d) => d.steps?.count || 0));

  const getBarHeight = (steps: number): number => {
    if (maxSteps === 0) return 0;
    return (steps / maxSteps) * chartHeight;
  };

  const getBarColor = (steps: number): string => {
    const progress = stepsGoal > 0 ? steps / stepsGoal : 0;
    if (progress >= 1) return COLORS.success;
    if (progress >= 0.7) return COLORS.primary;
    if (progress >= 0.4) return COLORS.warning;
    return COLORS.gray[300];
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('health.activity.title')}</Text>
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, period === 'week' && styles.periodButtonActive]}
            onPress={() => setPeriod('week')}
          >
            <Text style={[styles.periodText, period === 'week' && styles.periodTextActive]}>
              {t('health.activity.week')}
            </Text>
          </TouchableOpacity>
          {monthData && (
            <TouchableOpacity
              style={[styles.periodButton, period === 'month' && styles.periodButtonActive]}
              onPress={() => setPeriod('month')}
            >
              <Text style={[styles.periodText, period === 'month' && styles.periodTextActive]}>
                {t('health.activity.month')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {data.length === 0 ? (
        <Text style={styles.noData}>{t('health.activity.noData')}</Text>
      ) : (
        <View style={styles.chartContainer}>
          <Svg width={chartWidth} height={chartHeight}>
            {/* Goal line */}
            <Rect
              x={0}
              y={chartHeight - getBarHeight(stepsGoal)}
              width={chartWidth}
              height={1}
              fill={COLORS.gray[300]}
            />
            {/* Bars */}
            {data.slice(0, barCount).map((day, index) => {
              const steps = day.steps?.count || 0;
              const height = getBarHeight(steps);
              return (
                <Rect
                  key={index}
                  x={index * (barWidth + 4)}
                  y={chartHeight - height}
                  width={barWidth}
                  height={height}
                  rx={4}
                  fill={getBarColor(steps)}
                />
              );
            })}
          </Svg>
          {period === 'week' && (
            <View style={styles.labelsContainer}>
              {dayLabels.map((day, index) => (
                <Text
                  key={day}
                  style={[styles.dayLabel, { width: barWidth + 4 }]}
                >
                  {day}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.md,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  periodButtonActive: {
    backgroundColor: COLORS.white,
  },
  periodText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  periodTextActive: {
    color: COLORS.gray[900],
    fontWeight: '500',
  },
  chartContainer: {
    marginTop: SPACING.sm,
  },
  labelsContainer: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  dayLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    textAlign: 'center',
  },
  noData: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
    textAlign: 'center',
    paddingVertical: SPACING.xl,
  },
});
