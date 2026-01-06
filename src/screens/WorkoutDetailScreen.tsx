// /workspaces/claude-workspace/fitnessapp/src/screens/WorkoutDetailScreen.tsx
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
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

const DIRECTION_IMAGES: Record<TDirection, string> = {
  gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
  calisthenics: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800',
  cardio: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800',
  yoga: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
  mobility: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
  custom: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
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

  const handleStartWorkout = () => {
    if (workout) {
      navigation.navigate('WorkoutActive', { workoutId: workout.id });
    }
  };

  if (!workout) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🏋️</Text>
          <Text style={styles.emptyText}>{t('workoutDetail.notFound')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const imageUrl = DIRECTION_IMAGES[workout.direction];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <ImageBackground
          source={{ uri: imageUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
            style={styles.heroGradient}
          >
            <SafeAreaView edges={['top']}>
              <View style={styles.headerBar}>
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                  <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pauseButton}>
                  <Text style={styles.pauseIcon}>⏸</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </LinearGradient>
        </ImageBackground>

        {/* Content */}
        <View style={styles.content}>
          {/* Workout Info */}
          <View style={styles.workoutInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.workoutName}>{workout.name}</Text>
              <View style={styles.durationBadge}>
                <Text style={styles.durationIcon}>⏱</Text>
                <Text style={styles.durationText}>{formatDuration(workout.duration)}</Text>
              </View>
            </View>

            <Text style={styles.description}>
              {t('workoutDetail.description', {
                exercises: workout.exercises.length,
                direction: t(`directions.${workout.direction}`),
              })}
            </Text>

            {workout.finishedAt && (
              <Text style={styles.dateText}>
                {formatDateTime(workout.finishedAt)}
              </Text>
            )}
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{workout.exercises.length}</Text>
              <Text style={styles.statLabel}>{t('common.exercises')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatDuration(workout.duration)}</Text>
              <Text style={styles.statLabel}>{t('workoutDetail.duration')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {workout.totalVolume >= 1000
                  ? `${(workout.totalVolume / 1000).toFixed(1)}k`
                  : workout.totalVolume}
              </Text>
              <Text style={styles.statLabel}>{t('workoutDetail.totalKg')}</Text>
            </View>
          </View>

          {/* Next Program Preview */}
          <View style={styles.nextProgramCard}>
            <Text style={styles.nextProgramLabel}>{t('workoutDetail.nextProgram')}</Text>
            <View style={styles.nextProgramRow}>
              <View style={styles.nextProgramIcon}>
                <Text style={styles.nextProgramIconText}>🏋️</Text>
              </View>
              <View style={styles.nextProgramInfo}>
                <Text style={styles.nextProgramTitle}>
                  {workout.exercises[0]?.name || t('workoutDetail.noExercises')}
                </Text>
                <Text style={styles.nextProgramMeta}>
                  {workout.exercises[0]?.sets.length || 0} {t('common.sets')} • 12 {t('common.reps')} • 5 {t('common.mins')}
                </Text>
              </View>
              <TouchableOpacity style={styles.playButton}>
                <Text style={styles.playIcon}>▶</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Exercises List */}
          <Text style={styles.sectionTitle}>{t('workoutDetail.exercises')}</Text>
          {workout.exercises.map((exercise, index) => (
            <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
          ))}

          {/* Notes */}
          {workout.notes && (
            <>
              <Text style={styles.sectionTitle}>{t('workoutDetail.notes')}</Text>
              <View style={styles.notesCard}>
                <Text style={styles.notesText}>{workout.notes}</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Start Workout Button */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
          <Text style={styles.startButtonText}>{t('workoutDetail.startWorkout')}</Text>
          <Text style={styles.startButtonArrow}>→</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[900],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroImage: {
    height: 280,
  },
  heroGradient: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.white,
  },
  pauseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseIcon: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: SPACING.lg,
  },
  workoutInfo: {
    marginBottom: SPACING.xl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  workoutName: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.white,
    flex: 1,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[800],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
  },
  durationIcon: {
    fontSize: FONT_SIZES.sm,
  },
  durationText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    fontWeight: '500',
  },
  description: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[400],
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  dateText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.gray[700],
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
  },
  nextProgramCard: {
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  nextProgramLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginBottom: SPACING.md,
  },
  nextProgramRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextProgramIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.gray[700],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  nextProgramIconText: {
    fontSize: FONT_SIZES.xl,
  },
  nextProgramInfo: {
    flex: 1,
  },
  nextProgramTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 2,
  },
  nextProgramMeta: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[900],
    marginLeft: 2,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  exerciseCard: {
    backgroundColor: COLORS.gray[800],
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
    backgroundColor: COLORS.accent,
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
    color: COLORS.white,
  },
  exerciseMuscle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
  },
  setsContainer: {
    backgroundColor: COLORS.gray[700],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
  },
  setsHeader: {
    flexDirection: 'row',
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[600],
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
    color: COLORS.gray[300],
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
    borderTopColor: COLORS.gray[700],
  },
  exerciseTotal: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[400],
    textAlign: 'right',
  },
  notesCard: {
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  notesText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[500],
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.gray[900],
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[800],
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  startButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  startButtonArrow: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gray[900],
  },
});
