// /workspaces/claude-workspace/fitnessapp/src/screens/PlanScreen.tsx

import React from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { FLOATING_TAB_BAR_HEIGHT } from '@/components/navigation';
import { SectionHeader } from '@/components/progress';
import { useTheme } from '@/contexts';
import { useTrainingPlanStore } from '@/stores';
import { RootStackParamList, TTrainingDay } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DAYS: TTrainingDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const PlanScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const activePlan = useTrainingPlanStore((state) => state.getActivePlan());
  const plans = useTrainingPlanStore((state) => state.plans);

  const handleCreatePlan = () => {
    navigation.navigate('SportSelection');
  };

  const handleEditPlan = () => {
    if (activePlan) {
      navigation.navigate('TrainingPlanEditor', {
        planId: activePlan.id,
        sportType: activePlan.sportType,
      });
    }
  };

  const handleManagePlans = () => {
    navigation.navigate('SportSelection');
  };

  const handleStartWorkout = (day: TTrainingDay) => {
    if (activePlan) {
      const workout = activePlan.weeklySchedule[day];
      if (workout) {
        navigation.navigate('WorkoutActive', { workoutId: workout.id });
      }
    }
  };

  const handleImportFromChatGPT = () => {
    navigation.navigate('ChatGPTImport');
  };

  const getDirectionColor = (direction: string): string => {
    switch (direction) {
      case 'gym':
        return colors.primary;
      case 'cardio':
        return colors.accent;
      case 'yoga':
        return colors.purple;
      case 'calisthenics':
        return colors.success;
      default:
        return colors.textTertiary;
    }
  };

  const getTodayKey = (): TTrainingDay => {
    const days: TTrainingDay[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[new Date().getDay()];
  };

  const todayKey = getTodayKey();
  const todayWorkout = activePlan?.weeklySchedule[todayKey];

  // Dynamic gradient colors based on theme
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
          <Text style={[styles.title, { color: colors.text }]}>{t('plan.title')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('plan.subtitle')}</Text>
        </View>

        {activePlan ? (
          <>
            {/* Active Plan Card */}
            <LinearGradient
              colors={cardGradient}
              style={styles.activePlanCard}
            >
              <View style={styles.activePlanHeader}>
                <View style={styles.activePlanInfo}>
                  <Text style={[styles.activePlanLabel, { color: colors.textSecondary }]}>
                    {t('plan.activePlan')}
                  </Text>
                  <Text style={[styles.activePlanName, { color: isDark ? COLORS.white : colors.text }]}>
                    {activePlan.name}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.editPlanButton, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)' }]}
                  onPress={handleEditPlan}
                >
                  <Text style={styles.editPlanText}>
                    {t('common.edit')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.weekContainer}>
                {DAYS.map((day) => {
                  const workout = activePlan.weeklySchedule[day];
                  const isToday = day === todayKey;
                  const hasWorkout = workout !== null;

                  return (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayButton,
                        { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                        isToday && styles.dayButtonToday,
                        hasWorkout && !isToday && { borderWidth: 1, borderColor: colors.border },
                      ]}
                      onPress={() => hasWorkout && handleStartWorkout(day)}
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
                      {hasWorkout && (
                        <View
                          style={[
                            styles.workoutIndicator,
                            { backgroundColor: getDirectionColor(workout.direction) },
                          ]}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </LinearGradient>

            {/* Today Workout Card */}
            {todayWorkout && (
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
                  onPress={() => handleStartWorkout(todayKey)}
                >
                  <Text style={styles.startButtonText}>{t('plan.startWorkout')}</Text>
                </TouchableOpacity>
              </LinearGradient>
            )}

            {/* Weekly Schedule */}
            <SectionHeader title={t('plan.thisWeek')} darkMode={isDark} />

            {DAYS.map((day) => {
              const workout = activePlan.weeklySchedule[day];
              const isToday = day === todayKey;

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.scheduleItem,
                    { backgroundColor: colors.card },
                    isToday && styles.scheduleItemToday,
                  ]}
                  onPress={() => workout && handleStartWorkout(day)}
                  disabled={!workout}
                >
                  <View style={[styles.scheduleDay, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                    <Text
                      style={[
                        styles.scheduleDayText,
                        { color: colors.textSecondary },
                        isToday && styles.scheduleDayTextToday,
                      ]}
                    >
                      {t(`days.short.${day}`)}
                    </Text>
                  </View>
                  <View style={styles.scheduleInfo}>
                    {workout ? (
                      <>
                        <Text style={[styles.scheduleName, { color: colors.text }]}>
                          {workout.name}
                        </Text>
                        <Text style={[styles.scheduleExercises, { color: colors.textSecondary }]}>
                          {t('plan.exerciseCount', { count: workout.exercises.length })}
                        </Text>
                      </>
                    ) : (
                      <Text style={[styles.scheduleRest, { color: colors.textTertiary }]}>
                        {t('plan.restDay')}
                      </Text>
                    )}
                  </View>
                  {workout && (
                    <View
                      style={[
                        styles.scheduleIndicator,
                        { backgroundColor: getDirectionColor(workout.direction) },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </>
        ) : (
          <>
            {/* Empty State - Create Options */}
            <LinearGradient
              colors={cardGradient}
              style={styles.emptyCard}
            >
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={[styles.emptyTitle, { color: isDark ? COLORS.white : colors.text }]}>{t('plan.noPlan')}</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                {t('plan.noPlanDescription')}
              </Text>
            </LinearGradient>

            <SectionHeader title={t('plan.createOptions')} darkMode={isDark} />

            {/* Manual Create */}
            <TouchableOpacity
              style={styles.createOptionButton}
              onPress={handleCreatePlan}
            >
              <LinearGradient
                colors={cardGradient}
                style={styles.createOptionGradient}
              >
                <View style={styles.createOptionIconContainer}>
                  <Text style={styles.createOptionIcon}>✏️</Text>
                </View>
                <View style={styles.createOptionContent}>
                  <Text style={[styles.createOptionTitle, { color: isDark ? COLORS.white : colors.text }]}>
                    {t('plan.createManually')}
                  </Text>
                  <Text style={[styles.createOptionDesc, { color: colors.textSecondary }]}>
                    {t('plan.createManuallyDesc')}
                  </Text>
                </View>
                <Text style={[styles.createOptionArrow, { color: colors.textTertiary }]}>›</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Import from ChatGPT */}
            <TouchableOpacity
              style={styles.createOptionButton}
              onPress={handleImportFromChatGPT}
            >
              <LinearGradient
                colors={cardGradient}
                style={styles.createOptionGradient}
              >
                <View style={[styles.createOptionIconContainer, { backgroundColor: '#10B981' }]}>
                  <Text style={styles.createOptionIcon}>💬</Text>
                </View>
                <View style={styles.createOptionContent}>
                  <Text style={[styles.createOptionTitle, { color: isDark ? COLORS.white : colors.text }]}>
                    {t('plan.importFromChatGPT')}
                  </Text>
                  <Text style={[styles.createOptionDesc, { color: colors.textSecondary }]}>
                    {t('plan.importFromChatGPTDesc')}
                  </Text>
                </View>
                <Text style={[styles.createOptionArrow, { color: colors.textTertiary }]}>›</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {/* Manage Plans Button */}
        {plans.length > 0 && (
          <TouchableOpacity
            style={[styles.managePlansButton, { backgroundColor: colors.card }]}
            onPress={handleManagePlans}
          >
            <Text style={[styles.managePlansText, { color: colors.text }]}>
              {t('plan.managePlans', { count: plans.length })}
            </Text>
            <Text style={[styles.managePlansArrow, { color: colors.textTertiary }]}>→</Text>
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
  activePlanCard: {
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  activePlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  activePlanInfo: {
    flex: 1,
  },
  activePlanLabel: {
    fontSize: FONT_SIZES.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activePlanName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginTop: 2,
  },
  editPlanButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  editPlanText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: '#6366F1',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 40,
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonToday: {
    backgroundColor: '#6366F1',
  },
  dayText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
  dayTextToday: {
    color: COLORS.white,
  },
  workoutIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
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
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
  },
  scheduleItemToday: {
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  scheduleDay: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  scheduleDayText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  scheduleDayTextToday: {
    color: '#6366F1',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
  },
  scheduleExercises: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  scheduleRest: {
    fontSize: FONT_SIZES.base,
    fontStyle: 'italic',
  },
  scheduleIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
  },
  emptyCard: {
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.base,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  createOptionButton: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  createOptionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  createOptionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  createOptionIcon: {
    fontSize: 24,
  },
  createOptionContent: {
    flex: 1,
  },
  createOptionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginBottom: 4,
  },
  createOptionDesc: {
    fontSize: FONT_SIZES.sm,
  },
  createOptionArrow: {
    fontSize: 24,
  },
  managePlansButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
  },
  managePlansText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
  },
  managePlansArrow: {
    fontSize: FONT_SIZES.lg,
  },
  bottomSpacing: {
    height: SPACING['3xl'],
  },
});
