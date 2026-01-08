// /workspaces/claude-workspace/fitnessapp/src/screens/WorkoutScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Button, Card } from '@/components/common';
import { FLOATING_TAB_BAR_HEIGHT } from '@/components/navigation';
import { SectionHeader } from '@/components/progress';
import { useTheme } from '@/contexts';
import { useWorkoutStore, useTrainingPlanStore, useUserStore } from '@/stores';
import { RootStackParamList, TDirection, TTrainingDay } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DAYS: TTrainingDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const WorkoutScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const startWorkout = useWorkoutStore((state) => state.startWorkout);
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout);
  const plans = useTrainingPlanStore((state) => state.plans);
  const activePlan = useTrainingPlanStore((state) => state.getActivePlan());
  const user = useUserStore((state) => state.user);

  const getTodayKey = (): TTrainingDay => {
    const days: TTrainingDay[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[new Date().getDay()];
  };

  const todayKey = getTodayKey();
  const todayWorkout = activePlan?.weeklySchedule[todayKey];

  const getDirectionColor = (direction: string): string => {
    switch (direction) {
      case 'gym':
        return colors.primary;
      case 'cardio':
        return colors.accent;
      case 'yoga':
        return '#8B5CF6';
      case 'calisthenics':
        return colors.success;
      default:
        return colors.textTertiary;
    }
  };

  const handleStartEmptyWorkout = () => {
    startWorkout({
      userId: user?.id || 'guest',
      name: t('workoutActive.newWorkout'),
      direction: 'gym',
      exercises: [],
      duration: 0,
      totalVolume: 0,
    });
    navigation.navigate('WorkoutActive', { workoutId: 'new' });
  };

  const handleStartTodayWorkout = () => {
    if (todayWorkout) {
      navigation.navigate('WorkoutActive', { workoutId: todayWorkout.id });
    }
  };

  const handleStartDayWorkout = (day: TTrainingDay) => {
    if (activePlan) {
      const workout = activePlan.weeklySchedule[day];
      if (workout) {
        navigation.navigate('WorkoutActive', { workoutId: workout.id });
      }
    }
  };

  const handleContinueWorkout = () => {
    if (activeWorkout) {
      navigation.navigate('WorkoutActive', { workoutId: activeWorkout.id });
    }
  };

  const handleEditPlan = () => {
    if (activePlan) {
      navigation.navigate('TrainingPlanEditor', {
        planId: activePlan.id,
        sportType: activePlan.sportType,
      });
    }
  };

  const cardGradient: [string, string] = isDark
    ? ['#1E1E2E', '#2D2D44']
    : [COLORS.gray[100], COLORS.gray[200]];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('workout.title')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('workout.subtitle')}</Text>
        </View>

        {/* Active Workout Card */}
        {activeWorkout && (
          <TouchableOpacity
            style={[styles.activeWorkoutCard, { backgroundColor: colors.primary }]}
            onPress={handleContinueWorkout}
            activeOpacity={0.9}
          >
            <View style={styles.activeWorkoutHeader}>
              <Text style={styles.activeWorkoutLabel}>{t('workout.inProgress')}</Text>
              <View style={[styles.activeDot, { backgroundColor: colors.success }]} />
            </View>
            <Text style={styles.activeWorkoutName}>{activeWorkout.name}</Text>
            <Text style={styles.activeWorkoutInfo}>
              {t('workout.exerciseCount', { count: activeWorkout.exercises.length })}
            </Text>
            <Button
              title={t('workout.continueWorkout')}
              onPress={handleContinueWorkout}
              fullWidth
              style={StyleSheet.flatten([styles.continueButton, { backgroundColor: '#FFFFFF' }])}
              textStyle={{ color: colors.primary }}
            />
          </TouchableOpacity>
        )}

        {/* Today's Workout or Quick Start */}
        {activePlan && todayWorkout ? (
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            style={styles.todayCard}
          >
            <View style={styles.todayHeader}>
              <Text style={styles.todayLabel}>{t('plan.today')}</Text>
              <View style={styles.directionBadge}>
                <Text style={styles.directionText}>
                  {t(`directions.${todayWorkout.direction}`)}
                </Text>
              </View>
            </View>
            <Text style={styles.todayWorkoutName}>{todayWorkout.name}</Text>
            <Text style={styles.todayExerciseCount}>
              {t('plan.exerciseCount', { count: todayWorkout.exercises.length })}
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartTodayWorkout}
            >
              <Text style={styles.startButtonText}>{t('plan.startWorkout')}</Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : activePlan ? (
          <Card style={styles.restDayCard}>
            <Text style={styles.restDayIcon}>😴</Text>
            <Text style={[styles.restDayTitle, { color: colors.text }]}>{t('plan.restDay')}</Text>
            <Text style={[styles.restDaySubtitle, { color: colors.textSecondary }]}>
              {t('workout.restDayDesc')}
            </Text>
            <TouchableOpacity
              style={[styles.emptyWorkoutButton, { backgroundColor: colors.primary }]}
              onPress={handleStartEmptyWorkout}
            >
              <Text style={styles.emptyWorkoutButtonText}>{t('workout.startAnyway')}</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          <TouchableOpacity
            style={[styles.quickStartCard, { backgroundColor: colors.primary }]}
            onPress={handleStartEmptyWorkout}
            activeOpacity={0.9}
          >
            <Text style={styles.quickStartIcon}>⚡</Text>
            <Text style={styles.quickStartTitle}>{t('workout.quickStart')}</Text>
            <Text style={styles.quickStartSubtitle}>{t('workout.quickStartDesc')}</Text>
          </TouchableOpacity>
        )}

        {/* Weekly Schedule (if plan exists) */}
        {activePlan && (
          <>
            <View style={styles.planHeaderRow}>
              <SectionHeader title={activePlan.name} darkMode={isDark} />
              <TouchableOpacity
                style={[styles.editPlanButton, { backgroundColor: colors.surfaceElevated }]}
                onPress={handleEditPlan}
              >
                <Text style={[styles.editPlanText, { color: colors.primary }]}>
                  {t('common.edit')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.weekGrid}>
              {DAYS.map((day) => {
                const workout = activePlan.weeklySchedule[day];
                const isToday = day === todayKey;
                const hasWorkout = workout !== null;

                return (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayCard,
                      { backgroundColor: colors.card },
                      isToday && styles.dayCardToday,
                    ]}
                    onPress={() => hasWorkout && handleStartDayWorkout(day)}
                    disabled={!hasWorkout}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        { color: colors.textSecondary },
                        isToday && styles.dayTextToday,
                      ]}
                    >
                      {t(`days.short.${day}`)}
                    </Text>
                    {hasWorkout ? (
                      <View
                        style={[
                          styles.workoutIndicator,
                          { backgroundColor: getDirectionColor(workout.direction) },
                        ]}
                      />
                    ) : (
                      <Text style={[styles.restIndicator, { color: colors.textTertiary }]}>–</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* Create/Manage Plan Section */}
        <SectionHeader title={t('workout.templates')} darkMode={isDark} />

        {!activePlan && (
          <TouchableOpacity
            style={[styles.createPlanButton]}
            onPress={() => navigation.navigate('SportSelection')}
          >
            <LinearGradient
              colors={cardGradient}
              style={styles.createPlanGradient}
            >
              <View style={styles.createPlanIconContainer}>
                <Text style={styles.createPlanIcon}>📋</Text>
              </View>
              <View style={styles.createPlanContent}>
                <Text style={[styles.createPlanTitle, { color: colors.text }]}>
                  {t('plan.createPlan')}
                </Text>
                <Text style={[styles.createPlanDesc, { color: colors.textSecondary }]}>
                  {t('plan.createPlanDesc')}
                </Text>
              </View>
              <Text style={[styles.createPlanArrow, { color: colors.textTertiary }]}>›</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.manageButton, { backgroundColor: colors.surfaceElevated }]}
          onPress={() => navigation.navigate('WorkoutHistory')}
        >
          <Text style={styles.manageIcon}>📊</Text>
          <View style={styles.manageContent}>
            <Text style={[styles.manageTitle, { color: colors.text }]}>{t('workoutHistory.title')}</Text>
            <Text style={[styles.manageSubtitle, { color: colors.textSecondary }]}>
              {t('common.viewAll')} {t('common.workouts')}
            </Text>
          </View>
          <Text style={[styles.manageArrow, { color: colors.textTertiary }]}>›</Text>
        </TouchableOpacity>

        {activePlan && (
          <TouchableOpacity
            style={[styles.manageButton, { backgroundColor: colors.surfaceElevated }]}
            onPress={() => navigation.navigate('SportSelection')}
          >
            <Text style={styles.manageIcon}>📋</Text>
            <View style={styles.manageContent}>
              <Text style={[styles.manageTitle, { color: colors.text }]}>{t('plan.managePlans', { count: plans.length })}</Text>
              <Text style={[styles.manageSubtitle, { color: colors.textSecondary }]}>{t('plan.subtitle')}</Text>
            </View>
            <Text style={[styles.manageArrow, { color: colors.textTertiary }]}>›</Text>
          </TouchableOpacity>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: FLOATING_TAB_BAR_HEIGHT + SPACING.md,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  activeWorkoutCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  activeWorkoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  activeWorkoutLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.8,
    letterSpacing: 1,
    fontWeight: '600',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: SPACING.sm,
  },
  activeWorkoutName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
  activeWorkoutInfo: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SPACING.xs,
  },
  continueButton: {
    marginTop: SPACING.lg,
  },
  todayCard: {
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  todayLabel: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  directionBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  directionText: {
    fontSize: FONT_SIZES.xs,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  todayWorkoutName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  todayExerciseCount: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: SPACING.md,
  },
  startButton: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: '#6366F1',
  },
  restDayCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  restDayIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  restDayTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  restDaySubtitle: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  emptyWorkoutButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  emptyWorkoutButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
  quickStartCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.xl,
    alignItems: 'center',
  },
  quickStartIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  quickStartTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
  quickStartSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: SPACING.xs,
  },
  planHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: SPACING.lg,
  },
  editPlanButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  editPlanText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  weekGrid: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  dayCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCardToday: {
    backgroundColor: '#6366F1',
  },
  dayText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  dayTextToday: {
    color: COLORS.white,
  },
  workoutIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  restIndicator: {
    fontSize: FONT_SIZES.sm,
  },
  createPlanButton: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  createPlanGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  createPlanIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  createPlanIcon: {
    fontSize: 24,
  },
  createPlanContent: {
    flex: 1,
  },
  createPlanTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginBottom: 4,
  },
  createPlanDesc: {
    fontSize: FONT_SIZES.sm,
  },
  createPlanArrow: {
    fontSize: 24,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  manageIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  manageContent: {
    flex: 1,
  },
  manageTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  manageSubtitle: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  manageArrow: {
    fontSize: 24,
  },
  bottomSpacing: {
    height: SPACING['3xl'],
  },
});
