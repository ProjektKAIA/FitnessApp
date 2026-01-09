// /workspaces/claude-workspace/fitnessapp/src/screens/calisthenics/CalisthenicsWorkoutDetailScreen.tsx

import React from 'react';
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

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { useTheme } from '@/contexts';
import { RootStackParamList, IExercise, ISet } from '@/types';
import { useWorkoutStore } from '@/stores';
import {
  getCalisthenicsWorkoutById,
  getCalisthenicsExerciseById,
  CALISTHENICS_LEVEL_LABELS,
  ICalisthenicsWorkoutExercise,
} from '@/data/calisthenicsLibrary';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'CalisthenicsWorkoutDetail'>;

export const CalisthenicsWorkoutDetailScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const lang = i18n.language as 'de' | 'en';

  const { startWorkout } = useWorkoutStore();

  const workout = getCalisthenicsWorkoutById(route.params.workoutId);

  if (!workout) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          {lang === 'de' ? 'Workout nicht gefunden' : 'Workout not found'}
        </Text>
      </SafeAreaView>
    );
  }

  const handleStartWorkout = () => {
    // Convert calisthenics workout to IWorkout format
    const exercises: IExercise[] = workout.exercises.map((we, index) => {
      const exerciseData = getCalisthenicsExerciseById(we.exerciseId);
      const sets: ISet[] = [];

      for (let i = 0; i < we.sets; i++) {
        sets.push({
          id: `set-${index}-${i}`,
          weight: 0, // Bodyweight
          reps: typeof we.reps === 'number' ? we.reps : 0,
          completed: false,
          restTime: we.restSeconds,
        });
      }

      return {
        id: `exercise-${index}`,
        name: exerciseData ? (lang === 'de' ? exerciseData.name : exerciseData.nameEn) : we.exerciseId,
        muscleGroup: exerciseData?.muscleGroup || 'full_body',
        sets,
        notes: we.notes,
      };
    });

    startWorkout({
      userId: 'user',
      name: lang === 'de' ? workout.name : workout.nameEn,
      direction: 'calisthenics',
      exercises,
      duration: 0,
      totalVolume: 0,
    });

    navigation.navigate('WorkoutActive', { workoutId: workout.id });
  };

  const renderExerciseCard = (we: ICalisthenicsWorkoutExercise, index: number) => {
    const exercise = getCalisthenicsExerciseById(we.exerciseId);
    if (!exercise) return null;

    return (
      <View key={index} style={[styles.exerciseCard, { backgroundColor: colors.surface }]}>
        <View style={styles.exerciseNumber}>
          <Text style={styles.exerciseNumberText}>{index + 1}</Text>
        </View>
        <View style={styles.exerciseInfo}>
          <Text style={[styles.exerciseName, { color: colors.text }]}>
            {lang === 'de' ? exercise.name : exercise.nameEn}
          </Text>
          <Text style={[styles.exerciseDetails, { color: colors.textSecondary }]}>
            {we.sets} x {we.reps} {we.notes ? `• ${we.notes}` : ''}
          </Text>
        </View>
        <Text style={[styles.restTime, { color: colors.textSecondary }]}>
          {we.restSeconds}s
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.backIcon, { color: colors.text }]}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {lang === 'de' ? workout.name : workout.nameEn}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Workout Info Card */}
        <View style={[styles.infoCard, { backgroundColor: COLORS.calisthenics || COLORS.accent }]}>
          <Text style={styles.workoutIcon}>{'💪'}</Text>
          <Text style={styles.workoutName}>{lang === 'de' ? workout.name : workout.nameEn}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>
              {CALISTHENICS_LEVEL_LABELS[workout.level][lang]}
            </Text>
          </View>
          <Text style={styles.workoutDescription}>{workout.description}</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{workout.duration}</Text>
              <Text style={styles.statLabel}>min</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{workout.exercises.length}</Text>
              <Text style={styles.statLabel}>{lang === 'de' ? 'Übungen' : 'Exercises'}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {workout.exercises.reduce((sum, e) => sum + e.sets, 0)}
              </Text>
              <Text style={styles.statLabel}>Sets</Text>
            </View>
          </View>
        </View>

        {/* Exercise List */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {lang === 'de' ? 'Übungen' : 'Exercises'}
          </Text>
        </View>

        {workout.exercises.map((we, index) => renderExerciseCard(we, index))}

        {/* Start Button */}
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: COLORS.accent }]}
          onPress={handleStartWorkout}
        >
          <Text style={styles.startButtonText}>
            {lang === 'de' ? 'Workout starten' : 'Start Workout'}
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.md,
  },
  placeholder: {
    width: 40,
  },
  errorText: {
    textAlign: 'center',
    marginTop: SPACING['4xl'],
    fontSize: FONT_SIZES.lg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING['4xl'],
  },
  infoCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
  },
  workoutIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  workoutName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  levelBadge: {
    backgroundColor: COLORS.overlay.light,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
  },
  levelBadgeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  workoutDescription: {
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING['3xl'],
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.8,
  },
  sectionHeader: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  exerciseNumberText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.white,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginBottom: 2,
  },
  exerciseDetails: {
    fontSize: FONT_SIZES.sm,
  },
  restTime: {
    fontSize: FONT_SIZES.xs,
  },
  startButton: {
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    marginTop: SPACING.xl,
    ...SHADOWS.md,
  },
  startButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.white,
  },
});
