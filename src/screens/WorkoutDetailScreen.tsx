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
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useWorkoutStore } from '@/stores';
import { RootStackParamList, IExercise, TDirection } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type WorkoutDetailRouteProp = RouteProp<RootStackParamList, 'WorkoutDetail'>;

const DIRECTION_COLORS: Record<TDirection, string> = {
  gym: COLORS.primary,
  calisthenics: COLORS.purple,
  cardio: COLORS.accent,
  yoga: COLORS.success,
  mobility: COLORS.gray[500],
  custom: COLORS.gray[600],
};

const formatDateTime = (date: Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

interface ExerciseCardProps {
  exercise: IExercise;
  index: number;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index }) => {
  const { t } = useTranslation();
  const completedSets = exercise.sets.filter((s) => s.completed);
  const totalVolume = completedSets.reduce(
    (sum, s) => sum + s.weight * s.reps,
    0
  );

  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseNumber}>
          <Text style={styles.exerciseNumberText}>{index + 1}</Text>
        </View>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseMuscle}>
            {t(`muscles.${exercise.muscleGroup}`)}
          </Text>
        </View>
      </View>

      <View style={styles.setsContainer}>
        <View style={styles.setsHeader}>
          <Text style={[styles.setHeaderText, styles.setCol]}>{t('workoutDetail.set')}</Text>
          <Text style={[styles.setHeaderText, styles.weightCol]}>{t('workoutDetail.weight')}</Text>
          <Text style={[styles.setHeaderText, styles.repsCol]}>{t('workoutDetail.reps')}</Text>
          <Text style={[styles.setHeaderText, styles.volumeCol]}>{t('workoutDetail.volume')}</Text>
        </View>

        {exercise.sets.map((set, setIndex) => (
          <View
            key={set.id}
            style={[
              styles.setRow,
              !set.completed && styles.setRowIncomplete,
            ]}
          >
            <Text style={[styles.setCell, styles.setCol]}>{setIndex + 1}</Text>
            <Text style={[styles.setCell, styles.weightCol]}>{set.weight} kg</Text>
            <Text style={[styles.setCell, styles.repsCol]}>{set.reps}</Text>
            <Text style={[styles.setCell, styles.volumeCol]}>
              {set.completed ? `${set.weight * set.reps} kg` : '-'}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.exerciseFooter}>
        <Text style={styles.exerciseTotal}>
          {t('workoutDetail.totalVolume')}: {totalVolume} kg
        </Text>
      </View>
    </View>
  );
};

export const WorkoutDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<WorkoutDetailRouteProp>();
  const { workoutId } = route.params;
  const getWorkoutById = useWorkoutStore((state) => state.getWorkoutById);

  const workout = getWorkoutById(workoutId);

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (!workout) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Text style={styles.backText}>{t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('workoutDetail.title')}</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{t('workoutDetail.notFound')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backText}>{t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('workoutDetail.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Workout Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <View
              style={[
                styles.directionBadge,
                { backgroundColor: DIRECTION_COLORS[workout.direction] },
              ]}
            >
              <Text style={styles.directionText}>
                {t(`directions.${workout.direction}`)}
              </Text>
            </View>
          </View>

          {workout.finishedAt && (
            <Text style={styles.workoutDate}>
              {formatDateTime(workout.finishedAt)}
            </Text>
          )}

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{workout.exercises.length}</Text>
              <Text style={styles.statLabel}>{t('common.exercises')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatDuration(workout.duration)}</Text>
              <Text style={styles.statLabel}>{t('workoutDetail.duration')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {workout.totalVolume >= 1000
                  ? `${(workout.totalVolume / 1000).toFixed(1)}k`
                  : workout.totalVolume}
              </Text>
              <Text style={styles.statLabel}>{t('workoutDetail.totalKg')}</Text>
            </View>
          </View>
        </View>

        {/* Exercises */}
        <Text style={styles.sectionTitle}>{t('workoutDetail.exercises')}</Text>
        {workout.exercises.map((exercise, index) => (
          <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
        ))}

        {workout.notes && (
          <>
            <Text style={styles.sectionTitle}>{t('workoutDetail.notes')}</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{workout.notes}</Text>
            </View>
          </>
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
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  workoutName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.gray[900],
    flex: 1,
  },
  directionBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  directionText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    color: COLORS.white,
  },
  workoutDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  statItem: {
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
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  exerciseCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  exerciseNumberText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  exerciseMuscle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
  },
  setsContainer: {
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
  },
  setsHeader: {
    flexDirection: 'row',
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    marginBottom: SPACING.xs,
  },
  setHeaderText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.gray[500],
    textTransform: 'uppercase',
  },
  setRow: {
    flexDirection: 'row',
    paddingVertical: SPACING.xs,
  },
  setRowIncomplete: {
    opacity: 0.5,
  },
  setCell: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[700],
  },
  setCol: {
    width: 40,
  },
  weightCol: {
    flex: 1,
  },
  repsCol: {
    width: 50,
  },
  volumeCol: {
    width: 70,
    textAlign: 'right',
  },
  exerciseFooter: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  exerciseTotal: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[700],
    textAlign: 'right',
  },
  notesCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  notesText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[700],
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[500],
  },
});
