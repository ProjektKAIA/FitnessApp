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

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { Card } from '@/components/common';
import { FLOATING_TAB_BAR_HEIGHT } from '@/components/navigation';
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

  const handleNavigateToAI = () => {
    navigation.navigate('AICoach');
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text }]}>{t('plan.title')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('plan.subtitle')}</Text>

        {activePlan ? (
          <>
            <Card style={styles.activePlanCard} elevated>
              <View style={styles.activePlanHeader}>
                <View style={styles.activePlanInfo}>
                  <Text style={[styles.activePlanLabel, { color: colors.textSecondary }]}>
                    {t('plan.activePlan')}
                  </Text>
                  <Text style={[styles.activePlanName, { color: colors.text }]}>
                    {activePlan.name}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.editPlanButton, { backgroundColor: colors.surfaceElevated }]}
                  onPress={handleEditPlan}
                >
                  <Text style={[styles.editPlanText, { color: colors.primary }]}>
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
                        { backgroundColor: colors.surfaceElevated },
                        isToday && { backgroundColor: colors.primary },
                        hasWorkout && !isToday && { borderWidth: 1, borderColor: colors.border },
                      ]}
                      onPress={() => hasWorkout && handleStartWorkout(day)}
                      disabled={!hasWorkout}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          { color: colors.textSecondary },
                          isToday && { color: '#FFFFFF' },
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
            </Card>

            {todayWorkout && (
              <Card style={[styles.todayCard, { backgroundColor: isDark ? colors.surfaceElevated : COLORS.gray[800] }]}>
                <View style={styles.todayHeader}>
                  <Text style={styles.todayLabel}>{t('plan.today')}</Text>
                  <View
                    style={[
                      styles.directionBadge,
                      { backgroundColor: getDirectionColor(todayWorkout.direction) },
                    ]}
                  >
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
                  style={[styles.startButton, { backgroundColor: colors.primary }]}
                  onPress={() => handleStartWorkout(todayKey)}
                >
                  <Text style={styles.startButtonText}>{t('plan.startWorkout')}</Text>
                </TouchableOpacity>
              </Card>
            )}

            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('plan.thisWeek')}</Text>

            {DAYS.map((day) => {
              const workout = activePlan.weeklySchedule[day];
              const isToday = day === todayKey;

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.scheduleItem,
                    { backgroundColor: colors.card },
                    isToday && { borderWidth: 2, borderColor: colors.primary },
                  ]}
                  onPress={() => workout && handleStartWorkout(day)}
                  disabled={!workout}
                >
                  <View style={[styles.scheduleDay, { backgroundColor: colors.surfaceElevated }]}>
                    <Text
                      style={[
                        styles.scheduleDayText,
                        { color: colors.textSecondary },
                        isToday && { color: colors.primary },
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
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('plan.noPlan')}</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {t('plan.noPlanDescription')}
            </Text>

            <View style={styles.createOptions}>
              <TouchableOpacity
                style={[
                  styles.createOptionButton,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                  },
                ]}
                onPress={handleCreatePlan}
              >
                <Text style={styles.createOptionIcon}>✏️</Text>
                <Text style={[styles.createOptionTitle, { color: colors.text }]}>
                  {t('plan.createManually')}
                </Text>
                <Text style={[styles.createOptionDesc, { color: colors.textSecondary }]}>
                  {t('plan.createManuallyDesc')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.createOptionButton,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                  },
                ]}
                onPress={handleNavigateToAI}
              >
                <Text style={styles.createOptionIcon}>🤖</Text>
                <Text style={[styles.createOptionTitle, { color: colors.text }]}>
                  {t('plan.createWithAI')}
                </Text>
                <Text style={[styles.createOptionDesc, { color: colors.textSecondary }]}>
                  {t('plan.createWithAIDesc')}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

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

        <Card style={[styles.aiCard, { backgroundColor: isDark ? colors.surfaceElevated : COLORS.gray[800] }]}>
          <View style={styles.aiHeader}>
            <Text style={styles.aiIcon}>🤖</Text>
            <Text style={styles.aiTitle}>{t('plan.aiCoach')}</Text>
          </View>
          <Text style={styles.aiDescription}>{t('plan.aiDescription')}</Text>
          <TouchableOpacity
            style={[styles.aiButton, { backgroundColor: colors.primary }]}
            onPress={handleNavigateToAI}
          >
            <Text style={styles.aiButtonText}>{t('plan.openAICoach')}</Text>
          </TouchableOpacity>
        </Card>
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: FLOATING_TAB_BAR_HEIGHT + SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    marginTop: SPACING.lg,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  activePlanCard: {
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
    borderRadius: BORDER_RADIUS.md,
  },
  editPlanText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
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
  dayText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
  workoutIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  todayCard: {
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
    color: COLORS.gray[400],
    fontWeight: '500',
  },
  directionBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
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
    color: COLORS.gray[400],
    marginBottom: SPACING.md,
  },
  startButton: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
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
    alignItems: 'center',
    paddingVertical: SPACING.xl,
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
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  createOptions: {
    width: '100%',
    gap: SPACING.md,
  },
  createOptionButton: {
    width: '100%',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
  },
  createOptionIcon: {
    fontSize: 28,
    marginBottom: SPACING.sm,
  },
  createOptionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginBottom: 4,
  },
  createOptionDesc: {
    fontSize: FONT_SIZES.sm,
  },
  managePlansButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  managePlansText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
  },
  managePlansArrow: {
    fontSize: FONT_SIZES.lg,
  },
  aiCard: {
    marginTop: SPACING.lg,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  aiIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  aiTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  aiDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[300],
    marginBottom: SPACING.lg,
  },
  aiButton: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  aiButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
