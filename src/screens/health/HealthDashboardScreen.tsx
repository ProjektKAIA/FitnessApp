import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import {
  HealthSummaryCard,
  HeartRateCard,
  ActivityChart,
  TrainingLoadIndicator,
} from '@/components/health';
import { useHealthStore } from '@/stores/healthStore';
import { getHealthService } from '@/services/health';
import { IHealthWorkout } from '@/types/health';
import { RootStackParamList } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface WorkoutItemProps {
  workout: IHealthWorkout;
}

const WorkoutItem: React.FC<WorkoutItemProps> = ({ workout }) => {
  const { t } = useTranslation();

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const getWorkoutIcon = (type: string): string => {
    const icons: Record<string, string> = {
      running: '🏃',
      cycling: '🚴',
      swimming: '🏊',
      walking: '🚶',
      hiking: '🥾',
      yoga: '🧘',
      strength: '🏋️',
      crossfit: '💪',
      default: '🏃',
    };
    return icons[type.toLowerCase()] || icons.default;
  };

  return (
    <View style={styles.workoutItem}>
      <Text style={styles.workoutIcon}>{getWorkoutIcon(workout.type)}</Text>
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutType}>{workout.type}</Text>
        <Text style={styles.workoutDate}>{formatDate(workout.startDate)}</Text>
      </View>
      <View style={styles.workoutStats}>
        <Text style={styles.workoutDuration}>{formatDuration(workout.duration)}</Text>
        <Text style={styles.workoutCalories}>{workout.calories} kcal</Text>
      </View>
    </View>
  );
};

export const HealthDashboardScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const {
    settings,
    todaySummary,
    weekSummaries,
    trainingLoad,
    isSyncing,
    setSyncing,
    setTodaySummary,
    setWeekSummaries,
    setTrainingLoad,
    updateLastSync,
    setError,
  } = useHealthStore();

  const healthService = getHealthService();

  const handleRefresh = useCallback(async () => {
    if (!healthService || !settings.enabled) return;

    setSyncing(true);
    setError(null);

    try {
      const today = new Date();
      const summary = await healthService.getDailySummary(today);
      setTodaySummary(summary);

      const weekData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const daySummary = await healthService.getDailySummary(date);
        weekData.push(daySummary);
      }
      setWeekSummaries(weekData);

      updateLastSync();
    } catch (error) {
      console.error('Refresh error:', error);
      setError(String(error));
    } finally {
      setSyncing(false);
    }
  }, [healthService, settings.enabled]);

  useEffect(() => {
    if (settings.enabled && !todaySummary) {
      handleRefresh();
    }
  }, [settings.enabled]);

  const navigateToSettings = () => {
    navigation.navigate('HealthSettings');
  };

  if (!settings.enabled) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <Text style={styles.title}>{t('health.dashboard')}</Text>
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>❤️</Text>
            <Text style={styles.emptyTitle}>{t('health.notConnected')}</Text>
            <Text style={styles.emptyText}>{t('health.privacy.description')}</Text>
            <TouchableOpacity style={styles.connectButton} onPress={navigateToSettings}>
              <Text style={styles.connectButtonText}>{t('health.connectNow')}</Text>
            </TouchableOpacity>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isSyncing} onRefresh={handleRefresh} tintColor={COLORS.primary} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('health.dashboard')}</Text>
          <TouchableOpacity onPress={navigateToSettings}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Summary */}
        <HealthSummaryCard summary={todaySummary} stepsGoal={settings.stepsGoal} />

        {/* Heart Rate */}
        {settings.dataTypes.heartRate && (
          <HeartRateCard
            restingHeartRate={todaySummary?.restingHeartRate}
            averageHeartRate={todaySummary?.averageHeartRate}
            zones={todaySummary?.heartRateZones}
          />
        )}

        {/* Activity Chart */}
        {weekSummaries.length > 0 && (
          <ActivityChart weekData={weekSummaries} stepsGoal={settings.stepsGoal} />
        )}

        {/* Training Load */}
        <TrainingLoadIndicator trainingLoad={trainingLoad} />

        {/* Recent Workouts */}
        {settings.dataTypes.workouts && todaySummary?.workouts && todaySummary.workouts.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t('health.workouts.title')}</Text>
            <Card style={styles.workoutsCard}>
              {todaySummary.workouts.slice(0, 5).map((workout) => (
                <WorkoutItem key={workout.id} workout={workout} />
              ))}
            </Card>
          </>
        )}

        {/* Last Sync */}
        {settings.lastSyncAt && (
          <Text style={styles.lastSync}>
            {t('health.sync.lastSync')}: {new Date(settings.lastSyncAt).toLocaleTimeString()}
          </Text>
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  settingsIcon: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  workoutsCard: {
    padding: 0,
    marginBottom: SPACING.md,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  workoutIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutType: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.gray[900],
  },
  workoutDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  workoutStats: {
    alignItems: 'flex-end',
  },
  workoutDuration: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  workoutCalories: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  lastSync: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[400],
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: SPACING['3xl'],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  connectButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING['2xl'],
    borderRadius: BORDER_RADIUS.md,
  },
  connectButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
});
