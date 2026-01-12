// /workspaces/claude-workspace/fitnessapp/src/screens/plan/TrainingPlanDetailScreen.tsx

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { useTrainingPlanStore } from '@/stores';
import { useTheme } from '@/contexts';
import { RootStackParamList, IPlannedWorkout, IPlannedExercise, TDirection } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'TrainingPlanDetail'>;

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
type TDay = typeof DAYS[number];

const DAY_LABELS: Record<TDay, string> = {
  mon: 'Montag',
  tue: 'Dienstag',
  wed: 'Mittwoch',
  thu: 'Donnerstag',
  fri: 'Freitag',
  sat: 'Samstag',
  sun: 'Sonntag',
};

const DIRECTION_COLORS: Record<TDirection, string> = {
  gym: COLORS.primary,
  calisthenics: COLORS.warning,
  cardio: COLORS.accent,
  yoga: COLORS.purple,
  mobility: COLORS.success,
  running: COLORS.success,
  custom: COLORS.gray[600],
};

const DIRECTION_LABELS: Record<TDirection, string> = {
  gym: 'Gym',
  calisthenics: 'Calisthenics',
  cardio: 'Cardio',
  yoga: 'Yoga',
  mobility: 'Mobility',
  running: 'Running',
  custom: 'Custom',
};

interface ExerciseRowProps {
  exercise: IPlannedExercise;
  index: number;
  colors: ReturnType<typeof useTheme>['colors'];
}

const ExerciseRow: React.FC<ExerciseRowProps> = ({ exercise, index, colors }) => (
  <View style={[styles.exerciseRow, { borderBottomColor: colors.border }]}>
    <View style={styles.exerciseIndex}>
      <Text style={[styles.exerciseIndexText, { color: colors.textTertiary }]}>
        {index + 1}
      </Text>
    </View>
    <View style={styles.exerciseInfo}>
      <Text style={[styles.exerciseName, { color: colors.text }]}>
        {exercise.name}
      </Text>
      <Text style={[styles.exerciseMuscle, { color: colors.textSecondary }]}>
        {exercise.muscleGroup}
      </Text>
    </View>
    <View style={styles.exerciseSets}>
      <Text style={[styles.setsText, { color: colors.text }]}>
        {exercise.targetSets} × {exercise.targetReps}
      </Text>
      {exercise.targetWeight !== undefined && exercise.targetWeight > 0 && (
        <Text style={[styles.weightText, { color: colors.textSecondary }]}>
          {exercise.targetWeight} kg
        </Text>
      )}
    </View>
  </View>
);

interface DayCardProps {
  day: TDay;
  workout: IPlannedWorkout | null;
  colors: ReturnType<typeof useTheme>['colors'];
  isDark: boolean;
}

const DayCard: React.FC<DayCardProps> = ({ day, workout, colors, isDark }) => {
  const { t } = useTranslation();

  if (!workout) {
    return (
      <View style={[styles.dayCard, styles.restDayCard, { backgroundColor: colors.card }]}>
        <View style={styles.dayHeader}>
          <Text style={[styles.dayLabel, { color: colors.text }]}>{DAY_LABELS[day]}</Text>
          <View style={[styles.restBadge, { backgroundColor: colors.surfaceElevated }]}>
            <Text style={[styles.restBadgeText, { color: colors.textSecondary }]}>
              {t('trainingPlan.restDay')}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const directionColor = DIRECTION_COLORS[workout.direction] || COLORS.gray[600];

  return (
    <Card style={[styles.dayCard, { backgroundColor: colors.card }]} padded={false}>
      <View style={[styles.dayHeader, styles.dayHeaderWithBorder, { borderBottomColor: colors.border }]}>
        <View style={styles.dayHeaderLeft}>
          <Text style={[styles.dayLabel, { color: colors.text }]}>{DAY_LABELS[day]}</Text>
          <View style={[styles.directionBadge, { backgroundColor: directionColor + '20' }]}>
            <View style={[styles.directionDot, { backgroundColor: directionColor }]} />
            <Text style={[styles.directionText, { color: directionColor }]}>
              {DIRECTION_LABELS[workout.direction]}
            </Text>
          </View>
        </View>
        <Text style={[styles.exerciseCount, { color: colors.textSecondary }]}>
          {workout.exercises.length} {t('trainingPlan.exercises')}
        </Text>
      </View>

      <View style={styles.workoutContent}>
        <Text style={[styles.workoutName, { color: colors.text }]}>{workout.name}</Text>

        {workout.exercises.length > 0 && (
          <View style={styles.exerciseList}>
            {workout.exercises.map((exercise, index) => (
              <ExerciseRow
                key={exercise.id}
                exercise={exercise}
                index={index}
                colors={colors}
              />
            ))}
          </View>
        )}

        {workout.estimatedDuration !== undefined && workout.estimatedDuration > 0 && (
          <View style={[styles.durationRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.durationLabel, { color: colors.textSecondary }]}>
              {t('trainingPlan.estimatedDuration')}
            </Text>
            <Text style={[styles.durationValue, { color: colors.text }]}>
              ~{workout.estimatedDuration} min
            </Text>
          </View>
        )}

        {workout.notes && (
          <View style={[styles.notesRow, { backgroundColor: colors.surfaceElevated }]}>
            <Text style={[styles.notesText, { color: colors.textSecondary }]}>
              {workout.notes}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};

export const TrainingPlanDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { planId } = route.params;

  const getPlanById = useTrainingPlanStore((state) => state.getPlanById);
  const setActivePlan = useTrainingPlanStore((state) => state.setActivePlan);
  const activePlanId = useTrainingPlanStore((state) => state.activePlanId);

  const plan = useMemo(() => getPlanById(planId), [planId, getPlanById]);

  const stats = useMemo(() => {
    if (!plan) return { trainingDays: 0, totalExercises: 0, totalSets: 0 };

    let trainingDays = 0;
    let totalExercises = 0;
    let totalSets = 0;

    DAYS.forEach((day) => {
      const workout = plan.weeklySchedule[day];
      if (workout) {
        trainingDays++;
        totalExercises += workout.exercises.length;
        workout.exercises.forEach((ex) => {
          totalSets += ex.targetSets;
        });
      }
    });

    return { trainingDays, totalExercises, totalSets };
  }, [plan]);

  const isActive = activePlanId === planId;

  const handleActivate = () => {
    setActivePlan(planId);
  };

  const handleEdit = () => {
    navigation.navigate('TrainingPlanEditor', { planId });
  };

  if (!plan) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            {t('trainingPlan.notFound')}
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.backLink, { color: colors.primary }]}>
              {t('common.back')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.backButtonText, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {plan.name}
        </Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={[styles.editButtonText, { color: colors.primary }]}>
            {t('common.edit')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Overview */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.trainingDays}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {t('trainingPlan.trainingDays')}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.totalExercises}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {t('trainingPlan.exercises')}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.totalSets}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {t('trainingPlan.sets')}
            </Text>
          </View>
        </View>

        {/* Activate Button */}
        {!isActive && (
          <TouchableOpacity
            style={[styles.activateButton, { backgroundColor: colors.primary }]}
            onPress={handleActivate}
          >
            <Text style={styles.activateButtonText}>
              {t('trainingPlan.activatePlan')}
            </Text>
          </TouchableOpacity>
        )}

        {isActive && (
          <View style={[styles.activeBanner, { backgroundColor: COLORS.success + '20' }]}>
            <Text style={[styles.activeBannerText, { color: COLORS.success }]}>
              ✓ {t('trainingPlan.activePlan')}
            </Text>
          </View>
        )}

        {/* Description */}
        {plan.description && (
          <Card style={[styles.descriptionCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
              {plan.description}
            </Text>
          </Card>
        )}

        {/* Weekly Schedule */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('trainingPlan.weeklySchedule')}
        </Text>

        {DAYS.map((day) => (
          <DayCard
            key={day}
            day={day}
            workout={plan.weeklySchedule[day]}
            colors={colors}
            isDark={isDark}
          />
        ))}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
  },
  headerTitle: {
    flex: 1,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: SPACING.sm,
  },
  editButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  editButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  activateButton: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  activateButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  activeBanner: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  activeBannerText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  descriptionCard: {
    marginBottom: SPACING.lg,
  },
  descriptionText: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  dayCard: {
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  restDayCard: {
    padding: SPACING.lg,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayHeaderWithBorder: {
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  dayHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  dayLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  restBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  restBadgeText: {
    fontSize: FONT_SIZES.xs,
  },
  directionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    gap: 4,
  },
  directionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  directionText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
  exerciseCount: {
    fontSize: FONT_SIZES.xs,
  },
  workoutContent: {
    padding: SPACING.md,
  },
  workoutName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  exerciseList: {
    marginTop: SPACING.xs,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
  },
  exerciseIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  exerciseIndexText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  exerciseMuscle: {
    fontSize: FONT_SIZES.xs,
    marginTop: 1,
  },
  exerciseSets: {
    alignItems: 'flex-end',
  },
  setsText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  weightText: {
    fontSize: FONT_SIZES.xs,
    marginTop: 1,
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    marginTop: SPACING.sm,
    borderTopWidth: 1,
  },
  durationLabel: {
    fontSize: FONT_SIZES.xs,
  },
  durationValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  notesRow: {
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  notesText: {
    fontSize: FONT_SIZES.xs,
    fontStyle: 'italic',
  },
  bottomSpacing: {
    height: SPACING['2xl'],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorText: {
    fontSize: FONT_SIZES.lg,
    marginBottom: SPACING.md,
  },
  backLink: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
  },
});
