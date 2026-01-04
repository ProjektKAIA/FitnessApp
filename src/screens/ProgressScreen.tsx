import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { useStatsStore } from '@/stores';

type TimeRange = 'week' | 'month' | 'year';

export const ProgressScreen: React.FC = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const stats = useStatsStore((state) => state.stats);
  const { width: screenWidth } = useWindowDimensions();

  const SAMPLE_CHART_DATA = [
    { label: t('days.mon'), value: 45 },
    { label: t('days.tue'), value: 60 },
    { label: t('days.wed'), value: 0 },
    { label: t('days.thu'), value: 75 },
    { label: t('days.fri'), value: 50 },
    { label: t('days.sat'), value: 30 },
    { label: t('days.sun'), value: 0 },
  ];

  const maxValue = Math.max(...SAMPLE_CHART_DATA.map((d) => d.value));
  const statCardWidth = (screenWidth - SPACING.lg * 2 - SPACING.md) / 2 - 1;

  const timeRangeLabels: Record<TimeRange, string> = {
    week: t('progress.week'),
    month: t('progress.month'),
    year: t('progress.year'),
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('progress.title')}</Text>
        <Text style={styles.subtitle}>{t('progress.subtitle')}</Text>

        <View style={styles.timeRangeContainer}>
          {(['week', 'month', 'year'] as TimeRange[]).map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                timeRange === range && styles.timeRangeButtonActive,
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  timeRange === range && styles.timeRangeTextActive,
                ]}
              >
                {timeRangeLabels[range]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.chartCard} elevated>
          <Text style={styles.chartTitle}>{t('progress.workoutDuration')}</Text>
          <Text style={styles.chartSubtitle}>{t('progress.minutesPerDay')}</Text>

          <View style={styles.chart}>
            {SAMPLE_CHART_DATA.map((data, index) => (
              <View key={index} style={styles.chartBar}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: maxValue > 0 ? `${(data.value / maxValue) * 100}%` : 0,
                        backgroundColor:
                          data.value > 0 ? COLORS.primary : COLORS.gray[200],
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{data.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.statsGrid}>
          <Card style={[styles.statCard, { width: statCardWidth }]}>
            <Text style={styles.statIcon}>💪</Text>
            <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>{t('progress.totalWorkouts')}</Text>
          </Card>

          <Card style={[styles.statCard, { width: statCardWidth }]}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{stats.currentStreak}</Text>
            <Text style={styles.statLabel}>{t('progress.dayStreak')}</Text>
          </Card>

          <Card style={[styles.statCard, { width: statCardWidth }]}>
            <Text style={styles.statIcon}>🏋️</Text>
            <Text style={styles.statValue}>
              {Math.round(stats.totalVolume / 1000)}k
            </Text>
            <Text style={styles.statLabel}>{t('progress.totalVolume')}</Text>
          </Card>

          <Card style={[styles.statCard, { width: statCardWidth }]}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statValue}>{stats.longestStreak}</Text>
            <Text style={styles.statLabel}>{t('progress.bestStreak')}</Text>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>{t('progress.personalRecords')}</Text>

        {stats.personalRecords.length > 0 ? (
          stats.personalRecords.map((pr, index) => (
            <Card key={index} style={styles.prCard}>
              <View style={styles.prInfo}>
                <Text style={styles.prName}>{pr.exerciseName}</Text>
                <Text style={styles.prDate}>
                  {new Date(pr.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.prValue}>
                <Text style={styles.prWeight}>{pr.weight} kg</Text>
                <Text style={styles.prReps}>× {pr.reps}</Text>
              </View>
            </Card>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🏆</Text>
            <Text style={styles.emptyTitle}>{t('progress.noRecordsYet')}</Text>
            <Text style={styles.emptyText}>{t('progress.noRecordsText')}</Text>
          </Card>
        )}

        <Text style={styles.sectionTitle}>{t('progress.bodyStats')}</Text>

        <Card style={styles.bodyStatsCard}>
          <View style={styles.bodyStatRow}>
            <View style={styles.bodyStat}>
              <Text style={styles.bodyStatLabel}>{t('progress.weight')}</Text>
              <Text style={styles.bodyStatValue}>--</Text>
              <Text style={styles.bodyStatUnit}>kg</Text>
            </View>
            <View style={styles.bodyStatDivider} />
            <View style={styles.bodyStat}>
              <Text style={styles.bodyStatLabel}>{t('progress.bodyFat')}</Text>
              <Text style={styles.bodyStatValue}>--</Text>
              <Text style={styles.bodyStatUnit}>%</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.addBodyStatButton}>
            <Text style={styles.addBodyStatText}>{t('progress.addMeasurement')}</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.gray[900],
    marginTop: SPACING.lg,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[500],
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.lg,
    padding: 4,
    marginBottom: SPACING.xl,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  timeRangeButtonActive: {
    backgroundColor: COLORS.white,
  },
  timeRangeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray[500],
  },
  timeRangeTextActive: {
    color: COLORS.gray[900],
  },
  chartCard: {
    marginBottom: SPACING.xl,
  },
  chartTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  chartSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginBottom: SPACING.lg,
  },
  chart: {
    flexDirection: 'row',
    height: 150,
    alignItems: 'flex-end',
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    flex: 1,
    width: 24,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    marginTop: SPACING.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
  },
  prCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  prInfo: {
    flex: 1,
  },
  prName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.gray[900],
  },
  prDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  prValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  prWeight: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  prReps: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginLeft: SPACING.xs,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: SPACING['2xl'],
    marginBottom: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  emptyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    textAlign: 'center',
  },
  bodyStatsCard: {
    marginBottom: SPACING.xl,
  },
  bodyStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  bodyStat: {
    flex: 1,
    alignItems: 'center',
  },
  bodyStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.gray[200],
  },
  bodyStatLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginBottom: SPACING.xs,
  },
  bodyStatValue: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  bodyStatUnit: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  addBodyStatButton: {
    backgroundColor: COLORS.gray[100],
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  addBodyStatText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.primary,
  },
});
