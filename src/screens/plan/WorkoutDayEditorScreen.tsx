import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import {
  RootStackParamList,
  IPlannedWorkout,
  IPlannedExercise,
  TDirection,
} from '@/types';
import { useTrainingPlanStore } from '@/stores';
import { Card } from '@/components/common';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'WorkoutDayEditor'>;

const DIRECTIONS: { value: TDirection; labelKey: string; color: string }[] = [
  { value: 'gym', labelKey: 'directions.gym', color: COLORS.primary },
  { value: 'cardio', labelKey: 'directions.cardio', color: COLORS.accent },
  { value: 'calisthenics', labelKey: 'directions.calisthenics', color: COLORS.success },
  { value: 'yoga', labelKey: 'directions.yoga', color: COLORS.purple },
];

const generateId = () => Math.random().toString(36).substring(2, 15);

export const WorkoutDayEditorScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const { planId, day } = route.params;

  const getPlanById = useTrainingPlanStore((state) => state.getPlanById);
  const setWorkoutForDay = useTrainingPlanStore((state) => state.setWorkoutForDay);
  const addExerciseToWorkout = useTrainingPlanStore((state) => state.addExerciseToWorkout);
  const updateExerciseInWorkout = useTrainingPlanStore((state) => state.updateExerciseInWorkout);
  const removeExerciseFromWorkout = useTrainingPlanStore((state) => state.removeExerciseFromWorkout);

  const plan = getPlanById(planId);
  const existingWorkout = plan?.weeklySchedule[day];

  const [workoutName, setWorkoutName] = useState(existingWorkout?.name || '');
  const [direction, setDirection] = useState<TDirection>(existingWorkout?.direction || 'gym');
  const [exercises, setExercises] = useState<IPlannedExercise[]>(
    existingWorkout?.exercises || []
  );
  const [workoutId] = useState(existingWorkout?.id || generateId());

  useEffect(() => {
    if (plan) {
      const currentWorkout = plan.weeklySchedule[day];
      if (currentWorkout) {
        setExercises(currentWorkout.exercises);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId, day]);

  const handleSave = () => {
    if (!workoutName.trim()) {
      Alert.alert(t('workoutEditor.error'), t('workoutEditor.nameRequired'));
      return;
    }

    const workout: IPlannedWorkout = {
      id: workoutId,
      name: workoutName,
      direction,
      exercises,
    };

    setWorkoutForDay(planId, day, workout);
    navigation.goBack();
  };

  const handleAddExercise = () => {
    if (!workoutName.trim()) {
      Alert.alert(t('workoutEditor.error'), t('workoutEditor.nameRequiredFirst'));
      return;
    }

    const workout: IPlannedWorkout = {
      id: workoutId,
      name: workoutName,
      direction,
      exercises,
    };
    setWorkoutForDay(planId, day, workout);

    navigation.navigate('ExercisePicker', { planId, day, workoutId });
  };

  const handleRemoveExercise = (exerciseId: string) => {
    Alert.alert(
      t('workoutEditor.removeExerciseTitle'),
      t('workoutEditor.removeExerciseMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            setExercises((prev) => prev.filter((e) => e.id !== exerciseId));
            removeExerciseFromWorkout(planId, day, exerciseId);
          },
        },
      ]
    );
  };

  const handleUpdateExercise = (
    exerciseId: string,
    field: keyof IPlannedExercise,
    value: string | number
  ) => {
    setExercises((prev) =>
      prev.map((e) => (e.id === exerciseId ? { ...e, [field]: value } : e))
    );
  };

  const getMuscleGroupColor = (muscleGroup: string): string => {
    switch (muscleGroup) {
      case 'chest':
        return COLORS.accent;
      case 'back':
        return COLORS.primary;
      case 'shoulders':
        return COLORS.warning;
      case 'legs':
        return COLORS.success;
      case 'arms':
      case 'biceps':
      case 'triceps':
        return COLORS.purple;
      case 'core':
        return '#00BCD4';
      default:
        return COLORS.gray[500];
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t(`days.${day}`)}</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.infoCard}>
          <Text style={styles.label}>{t('workoutEditor.workoutName')}</Text>
          <TextInput
            style={styles.input}
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder={t('workoutEditor.workoutNamePlaceholder')}
            placeholderTextColor={COLORS.gray[400]}
          />

          <Text style={[styles.label, styles.labelSpacing]}>
            {t('workoutEditor.direction')}
          </Text>
          <View style={styles.directionPicker}>
            {DIRECTIONS.map((dir) => (
              <TouchableOpacity
                key={dir.value}
                style={[
                  styles.directionOption,
                  direction === dir.value && {
                    backgroundColor: dir.color,
                    borderColor: dir.color,
                  },
                ]}
                onPress={() => setDirection(dir.value)}
              >
                <Text
                  style={[
                    styles.directionOptionText,
                    direction === dir.value && styles.directionOptionTextActive,
                  ]}
                >
                  {t(dir.labelKey)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('workoutEditor.exercises')}</Text>
          <Text style={styles.exerciseCount}>
            {t('workoutEditor.exerciseCount', { count: exercises.length })}
          </Text>
        </View>

        {exercises.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>{t('workoutEditor.noExercises')}</Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={handleAddExercise}
            >
              <Text style={styles.addFirstText}>
                {t('workoutEditor.addFirstExercise')}
              </Text>
            </TouchableOpacity>
          </Card>
        ) : (
          <>
            {exercises.map((exercise, index) => (
              <Card key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseOrder}>{index + 1}</Text>
                    <View>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <View
                        style={[
                          styles.muscleGroupBadge,
                          { backgroundColor: getMuscleGroupColor(exercise.muscleGroup) },
                        ]}
                      >
                        <Text style={styles.muscleGroupText}>
                          {t(`muscleGroups.${exercise.muscleGroup}`)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveExercise(exercise.id)}
                  >
                    <Text style={styles.removeIcon}>x</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.exerciseDetails}>
                  <View style={styles.detailInput}>
                    <Text style={styles.detailLabel}>{t('workoutEditor.sets')}</Text>
                    <TextInput
                      style={styles.detailValue}
                      value={String(exercise.targetSets)}
                      onChangeText={(v) =>
                        handleUpdateExercise(exercise.id, 'targetSets', parseInt(v) || 0)
                      }
                      keyboardType="numeric"
                      selectTextOnFocus
                    />
                  </View>
                  <View style={styles.detailInput}>
                    <Text style={styles.detailLabel}>{t('workoutEditor.reps')}</Text>
                    <TextInput
                      style={styles.detailValue}
                      value={exercise.targetReps}
                      onChangeText={(v) =>
                        handleUpdateExercise(exercise.id, 'targetReps', v)
                      }
                      placeholder="8-12"
                      selectTextOnFocus
                    />
                  </View>
                  <View style={styles.detailInput}>
                    <Text style={styles.detailLabel}>{t('workoutEditor.rest')}</Text>
                    <TextInput
                      style={styles.detailValue}
                      value={exercise.restTime ? String(exercise.restTime) : ''}
                      onChangeText={(v) =>
                        handleUpdateExercise(exercise.id, 'restTime', parseInt(v) || 0)
                      }
                      keyboardType="numeric"
                      placeholder="90"
                      selectTextOnFocus
                    />
                  </View>
                </View>
              </Card>
            ))}

            <TouchableOpacity
              style={styles.addExerciseButton}
              onPress={handleAddExercise}
            >
              <Text style={styles.addExerciseIcon}>+</Text>
              <Text style={styles.addExerciseText}>
                {t('workoutEditor.addExercise')}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.gray[900],
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  saveButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  saveText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  infoCard: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: SPACING.xs,
  },
  labelSpacing: {
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[900],
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  directionPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  directionOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    backgroundColor: COLORS.white,
  },
  directionOptionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[700],
    fontWeight: '500',
  },
  directionOptionTextActive: {
    color: COLORS.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  exerciseCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[500],
    marginBottom: SPACING.md,
  },
  addFirstButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  addFirstText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
  exerciseCard: {
    marginBottom: SPACING.sm,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  exerciseOrder: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.gray[200],
    textAlign: 'center',
    lineHeight: 28,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginRight: SPACING.sm,
  },
  exerciseName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  muscleGroupBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  muscleGroupText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: '500',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[500],
    fontWeight: '600',
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  detailInput: {
    flex: 1,
  },
  detailLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    marginBottom: 4,
  },
  detailValue: {
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[900],
    textAlign: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.sm,
  },
  addExerciseIcon: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.gray[400],
    marginRight: SPACING.sm,
  },
  addExerciseText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[500],
    fontWeight: '500',
  },
});
