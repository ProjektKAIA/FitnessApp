import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useStatsStore, useWorkoutStore } from '@/stores';
import { RootStackParamList } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WEEKS_TO_SHOW = 12;
const DAYS_IN_WEEK = 7;

interface DayData {
  date: Date;
  hasWorkout: boolean;
  workoutCount: number;
}

const getWeekDays = (): string[] => {
  return ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const HeatmapCell: React.FC<{ data: DayData; isToday: boolean }> = ({
  data,
  isToday,
}) => {
  const getColor = () => {
    if (!data.hasWorkout) return COLORS.gray[100];
    if (data.workoutCount >= 2) return COLORS.success;
    return `${COLORS.success}99`; // 60% opacity
  };

  return (
    <View
      style={[
        styles.heatmapCell,
        { backgroundColor: getColor() },
        isToday && styles.heatmapCellToday,
      ]}
    />
  );
};

export const StreakDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const stats = useStatsStore((state) => state.stats);
  const getWorkoutHistory = useWorkoutStore((state) => state.getWorkoutHistory);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const heatmapData = useMemo(() => {
    const workouts = getWorkoutHistory();
    const today = new Date();
    const weeks: DayData[][] = [];

    // Calculate start date (12 weeks ago, starting from Monday)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (WEEKS_TO_SHOW * DAYS_IN_WEEK));
    // Adjust to Monday
    const dayOfWeek = startDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToMonday);

    for (let week = 0; week < WEEKS_TO_SHOW; week++) {
      const weekData: DayData[] = [];
      for (let day = 0; day < DAYS_IN_WEEK; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + week * DAYS_IN_WEEK + day);

        const workoutsOnDay = workouts.filter((w) => {
          if (!w.finishedAt) return false;
          return isSameDay(new Date(w.finishedAt), currentDate);
        });

        weekData.push({
          date: currentDate,
          hasWorkout: workoutsOnDay.length > 0,
          workoutCount: workoutsOnDay.length,
        });
      }
      weeks.push(weekData);
    }

    return weeks;
  }, [getWorkoutHistory]);

  const daysUntilRecord = useMemo(() => {
    if (stats.currentStreak >= stats.longestStreak) {
      return 0;
    }
    return stats.longestStreak - stats.currentStreak;
  }, [stats.currentStreak, stats.longestStreak]);

  const today = new Date();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backText}>{t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('streakDetail.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Streak Card */}
        <View style={styles.streakCard}>
          <Text style={styles.streakIcon}>
            {stats.currentStreak >= 7 ? '🔥' : '⚡'}
          </Text>
          <Text style={styles.streakValue}>{stats.currentStreak}</Text>
          <Text style={styles.streakLabel}>{t('streakDetail.currentStreak')}</Text>

          {daysUntilRecord > 0 && (
            <View style={styles.motivationBanner}>
              <Text style={styles.motivationText}>
                {t('streakDetail.daysUntilRecord', { days: daysUntilRecord })}
              </Text>
            </View>
          )}

          {daysUntilRecord === 0 && stats.currentStreak > 0 && (
            <View style={[styles.motivationBanner, styles.recordBanner]}>
              <Text style={styles.motivationText}>
                {t('streakDetail.newRecord')}
              </Text>
            </View>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.longestStreak}</Text>
            <Text style={styles.statLabel}>{t('streakDetail.longestStreak')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.thisWeekWorkouts}</Text>
            <Text style={styles.statLabel}>{t('streakDetail.thisWeek')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.thisMonthWorkouts}</Text>
            <Text style={styles.statLabel}>{t('streakDetail.thisMonth')}</Text>
          </View>
        </View>

        {/* Heatmap */}
        <View style={styles.heatmapCard}>
          <Text style={styles.sectionTitle}>
            {t('streakDetail.last12Weeks')}
          </Text>

          {/* Day labels */}
          <View style={styles.heatmapContainer}>
            <View style={styles.dayLabels}>
              {getWeekDays().map((day, index) => (
                <Text key={index} style={styles.dayLabel}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Heatmap grid */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.heatmapScroll}
            >
              {heatmapData.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.heatmapColumn}>
                  {week.map((day, dayIndex) => (
                    <HeatmapCell
                      key={dayIndex}
                      data={day}
                      isToday={isSameDay(day.date, today)}
                    />
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <Text style={styles.legendText}>{t('streakDetail.less')}</Text>
            <View style={[styles.legendCell, { backgroundColor: COLORS.gray[100] }]} />
            <View style={[styles.legendCell, { backgroundColor: `${COLORS.success}99` }]} />
            <View style={[styles.legendCell, { backgroundColor: COLORS.success }]} />
            <Text style={styles.legendText}>{t('streakDetail.more')}</Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.sectionTitle}>{t('streakDetail.tips')}</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>{t('streakDetail.tip1')}</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>🎯</Text>
            <Text style={styles.tipText}>{t('streakDetail.tip2')}</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>📅</Text>
            <Text style={styles.tipText}>{t('streakDetail.tip3')}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: SPACING.xs,
  },
  backText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primary,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  streakCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  streakIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  streakValue: {
    fontSize: 64,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  streakLabel: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[500],
    marginTop: SPACING.xs,
  },
  motivationBanner: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
  },
  recordBanner: {
    backgroundColor: COLORS.success,
  },
  motivationText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    marginTop: 2,
    textAlign: 'center',
  },
  heatmapCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: SPACING.md,
  },
  heatmapContainer: {
    flexDirection: 'row',
  },
  dayLabels: {
    marginRight: SPACING.xs,
    justifyContent: 'space-around',
  },
  dayLabel: {
    fontSize: 9,
    color: COLORS.gray[500],
    height: 14,
    lineHeight: 14,
  },
  heatmapScroll: {
    flexDirection: 'row',
    gap: 3,
  },
  heatmapColumn: {
    gap: 3,
  },
  heatmapCell: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  heatmapCellToday: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: SPACING.md,
    gap: 4,
  },
  legendText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
  },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  tipsCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  tipText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[700],
    lineHeight: 20,
  },
});
