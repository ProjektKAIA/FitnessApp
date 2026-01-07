// /workspaces/claude-workspace/fitnessapp/src/screens/ProgressScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import {
  ActivityRings,
  WeeklyChart,
  MetricCard,
  SectionHeader,
  PersonalRecordCard,
} from '@/components/progress';
import { HeartRateCard } from '@/components/health';
import { useStatsStore, useWorkoutStore } from '@/stores';
import { useHealthStore } from '@/stores/healthStore';
import { useTheme } from '@/contexts';
import { RootStackParamList } from '@/types';

type TimeRange = 'week' | 'month' | 'year';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Apple Fitness Colors
const RING_COLORS = {
  move: '#FF2D55',
  exercise: '#30D158',
  stand: '#007AFF',
};

export const ProgressScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const { width: screenWidth } = useWindowDimensions();

  // Stats
  const stats = useStatsStore((state) => state.stats);
  const getWorkoutHistory = useWorkoutStore((state) => state.getWorkoutHistory);

  // Health Data
  const healthSettings = useHealthStore((state) => state.settings);
  const todaySummary = useHealthStore((state) => state.todaySummary);
  const weekSummaries = useHealthStore((state) => state.weekSummaries);
  const isHealthEnabled = healthSettings.enabled && healthSettings.permissionsGranted;

  // Calculate card width for 2-column grid
  const cardWidth = (screenWidth - SPACING.lg * 2 - SPACING.md) / 2;

  // Activity Rings Data
  const activityRings = useMemo(() => {
    const steps = todaySummary?.steps?.count ?? 0;
    const calories = todaySummary?.calories?.active ?? 0;
    const activeMinutes = todaySummary?.activeMinutes ?? 0;

    return [
      {
        value: steps,
        goal: healthSettings.stepsGoal,
        color: RING_COLORS.move,
        gradientEnd: '#FF6B8A',
        label: t('progress.rings.move'),
        unit: t('health.summary.steps'),
      },
      {
        value: calories,
        goal: 500,
        color: RING_COLORS.exercise,
        gradientEnd: '#5AE17E',
        label: t('progress.rings.exercise'),
        unit: 'kcal',
      },
      {
        value: activeMinutes,
        goal: 30,
        color: RING_COLORS.stand,
        gradientEnd: '#5AC8FA',
        label: t('progress.rings.stand'),
        unit: 'min',
      },
    ];
  }, [todaySummary, healthSettings.stepsGoal, t]);

  // Weekly workout chart data
  const weeklyWorkoutData = useMemo(() => {
    const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    const today = new Date().getDay();
    const todayIndex = today === 0 ? 6 : today - 1;

    // In einer echten Implementierung würden wir hier die echten Daten holen
    return days.map((label, index) => ({
      label,
      value: index <= todayIndex ? Math.floor(Math.random() * 60) + 15 : 0,
      isToday: index === todayIndex,
    }));
  }, []);

  // Weekly steps chart data
  const weeklyStepsData = useMemo(() => {
    const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    const today = new Date().getDay();
    const todayIndex = today === 0 ? 6 : today - 1;

    if (weekSummaries.length > 0) {
      return weekSummaries.slice(0, 7).map((summary, index) => ({
        label: days[index] || '',
        value: summary.steps?.count ?? 0,
        isToday: index === todayIndex,
      }));
    }

    // Fallback mit Beispieldaten
    return days.map((label, index) => ({
      label,
      value: index <= todayIndex ? Math.floor(Math.random() * 8000) + 3000 : 0,
      isToday: index === todayIndex,
    }));
  }, [weekSummaries]);

  const timeRangeLabels: Record<TimeRange, string> = {
    week: t('progress.week'),
    month: t('progress.month'),
    year: t('progress.year'),
  };

  const handleHealthSettingsPress = () => {
    navigation.navigate('HealthSettings');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('progress.title')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('progress.subtitle')}</Text>
        </View>

        {/* Time Range Selector */}
        <View style={[styles.timeRangeContainer, { backgroundColor: colors.border }]}>
          {(['week', 'month', 'year'] as TimeRange[]).map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                timeRange === range && [styles.timeRangeButtonActive, { backgroundColor: colors.surface }],
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  { color: colors.textSecondary },
                  timeRange === range && { color: colors.text },
                ]}
              >
                {timeRangeLabels[range]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Activity Rings Section */}
        {isHealthEnabled && (
          <>
            <SectionHeader
              title={t('progress.activity')}
              subtitle={t('progress.today')}
              action={{
                label: t('common.settings'),
                onPress: handleHealthSettingsPress,
              }}
            />
            <View style={[styles.ringsCard, { backgroundColor: colors.card }]}>
              <ActivityRings
                rings={activityRings}
                size={180}
                strokeWidth={14}
                showLabels={true}
              />
            </View>
          </>
        )}

        {/* Quick Stats Grid */}
        <SectionHeader title={t('progress.overview')} />
        <View style={styles.statsGrid}>
          <MetricCard
            icon="💪"
            title={t('progress.totalWorkouts')}
            value={stats.totalWorkouts}
            subtitle={t('progress.allTime')}
          />
          <MetricCard
            icon="🔥"
            iconColor={COLORS.accent}
            title={t('progress.currentStreak')}
            value={stats.currentStreak}
            unit={t('progress.days')}
            trend={
              stats.currentStreak > 3
                ? { value: 15, direction: 'up' }
                : undefined
            }
          />
          <MetricCard
            icon="🏋️"
            title={t('progress.totalVolume')}
            value={`${Math.round(stats.totalVolume / 1000)}k`}
            unit="kg"
          />
          <MetricCard
            icon="🏆"
            iconColor="#FFD700"
            title={t('progress.bestStreak')}
            value={stats.longestStreak}
            unit={t('progress.days')}
          />
        </View>

        {/* Weekly Activity Chart */}
        <SectionHeader title={t('progress.weeklyActivity')} />
        <WeeklyChart
          data={weeklyWorkoutData}
          title={t('progress.workoutDuration')}
          unit="min"
          color={COLORS.primary}
          showAverage={true}
        />

        {/* Steps Chart (if health enabled) */}
        {isHealthEnabled && (
          <View style={styles.chartSpacing}>
            <WeeklyChart
              data={weeklyStepsData}
              title={t('health.summary.steps')}
              unit={t('health.summary.steps')}
              color={RING_COLORS.move}
              showAverage={true}
            />
          </View>
        )}

        {/* Heart Rate (if health enabled) */}
        {isHealthEnabled && healthSettings.dataTypes.heartRate && (
          <>
            <SectionHeader title={t('health.heartRate.title')} />
            <HeartRateCard
              restingHeartRate={todaySummary?.restingHeartRate}
              averageHeartRate={todaySummary?.averageHeartRate}
              zones={todaySummary?.heartRateZones}
            />
          </>
        )}

        {/* Personal Records */}
        <SectionHeader
          title={t('progress.personalRecords')}
          action={{
            label: t('common.viewAll'),
            onPress: () => navigation.navigate('WorkoutHistory'),
          }}
        />
        {stats.personalRecords.length > 0 ? (
          stats.personalRecords.slice(0, 3).map((pr, index) => (
            <PersonalRecordCard
              key={index}
              exerciseName={pr.exerciseName}
              weight={pr.weight}
              reps={pr.reps}
              date={pr.date instanceof Date ? pr.date.toLocaleDateString() : pr.date}
            />
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Text style={styles.emptyIcon}>🏆</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('progress.noRecordsYet')}</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('progress.noRecordsText')}</Text>
          </View>
        )}

        {/* Body Stats */}
        <SectionHeader title={t('progress.bodyStats')} />
        <View style={[styles.bodyStatsCard, { backgroundColor: colors.card }]}>
          <View style={styles.bodyStatsRow}>
            <View style={styles.bodyStat}>
              <Text style={[styles.bodyStatLabel, { color: colors.textSecondary }]}>{t('progress.weight')}</Text>
              <Text style={[styles.bodyStatValue, { color: colors.text }]}>--</Text>
              <Text style={[styles.bodyStatUnit, { color: colors.textSecondary }]}>kg</Text>
            </View>
            <View style={[styles.bodyStatDivider, { backgroundColor: colors.border }]} />
            <View style={styles.bodyStat}>
              <Text style={[styles.bodyStatLabel, { color: colors.textSecondary }]}>{t('progress.bodyFat')}</Text>
              <Text style={[styles.bodyStatValue, { color: colors.text }]}>--</Text>
              <Text style={[styles.bodyStatUnit, { color: colors.textSecondary }]}>%</Text>
            </View>
            <View style={[styles.bodyStatDivider, { backgroundColor: colors.border }]} />
            <View style={styles.bodyStat}>
              <Text style={[styles.bodyStatLabel, { color: colors.textSecondary }]}>{t('progress.muscle')}</Text>
              <Text style={[styles.bodyStatValue, { color: colors.text }]}>--</Text>
              <Text style={[styles.bodyStatUnit, { color: colors.textSecondary }]}>kg</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.background }]}>
            <Text style={[styles.addButtonText, { color: colors.primary }]}>{t('progress.addMeasurement')}</Text>
          </TouchableOpacity>
        </View>

        {/* Health Connect Prompt (if not enabled) */}
        {!isHealthEnabled && (
          <>
            <SectionHeader title={t('health.title')} />
            <TouchableOpacity
              style={[styles.healthPrompt, { backgroundColor: colors.card }]}
              onPress={handleHealthSettingsPress}
            >
              <View style={styles.healthPromptIcon}>
                <Text style={styles.healthPromptEmoji}>❤️</Text>
              </View>
              <View style={styles.healthPromptContent}>
                <Text style={[styles.healthPromptTitle, { color: colors.text }]}>
                  {t('health.connect.title')}
                </Text>
                <Text style={[styles.healthPromptText, { color: colors.textSecondary }]}>
                  {t('health.connect.description')}
                </Text>
              </View>
              <Text style={[styles.healthPromptArrow, { color: colors.textTertiary }]}>→</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.bottomSpacing} />
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
  },
  header: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[500],
    marginTop: SPACING.xs,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.lg,
    padding: 4,
    marginBottom: SPACING.md,
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
  ringsCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  chartSpacing: {
    marginTop: SPACING.md,
  },
  emptyState: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING['2xl'],
    alignItems: 'center',
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
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  bodyStatsRow: {
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
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    marginBottom: SPACING.xs,
  },
  bodyStatValue: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  bodyStatUnit: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
  },
  addButton: {
    backgroundColor: COLORS.gray[100],
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.primary,
  },
  healthPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  healthPromptIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  healthPromptEmoji: {
    fontSize: 24,
  },
  healthPromptContent: {
    flex: 1,
  },
  healthPromptTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  healthPromptText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
  },
  healthPromptArrow: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.gray[400],
  },
  bottomSpacing: {
    height: SPACING['3xl'],
  },
});
