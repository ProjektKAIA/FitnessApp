import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, REST_TIMER_DEFAULT } from '@/constants';
import { Button, Card, Modal, LoadingScreen } from '@/components/common';
import { useWorkoutStore, useUserStore, useTrainingPlanStore } from '@/stores';
import { useTheme } from '@/contexts';
import { RootStackParamList, IPlannedWorkout } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type WorkoutActiveRouteProp = RouteProp<RootStackParamList, 'WorkoutActive'>;

export const WorkoutActiveScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<WorkoutActiveRouteProp>();
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout);
  const startWorkout = useWorkoutStore((state) => state.startWorkout);
  const endWorkout = useWorkoutStore((state) => state.endWorkout);
  const cancelWorkout = useWorkoutStore((state) => state.cancelWorkout);
  const addExercise = useWorkoutStore((state) => state.addExercise);
  const addSet = useWorkoutStore((state) => state.addSet);
  const updateSet = useWorkoutStore((state) => state.updateSet);
  const removeSet = useWorkoutStore((state) => state.removeSet);
  const completeSet = useWorkoutStore((state) => state.completeSet);
  const getWorkoutHistory = useWorkoutStore((state) => state.getWorkoutHistory);
  const restTimerActive = useWorkoutStore((state) => state.restTimerActive);
  const restTimeRemaining = useWorkoutStore((state) => state.restTimeRemaining);
  const startRestTimer = useWorkoutStore((state) => state.startRestTimer);
  const stopRestTimer = useWorkoutStore((state) => state.stopRestTimer);
  const updateRestTimer = useWorkoutStore((state) => state.updateRestTimer);

  const activePlan = useTrainingPlanStore((state) => state.getActivePlan());

  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [deleteMode, setDeleteMode] = useState<string | null>(null); // exerciseId wenn im Lösch-Modus
  const [setsToDelete, setSetsToDelete] = useState<string[]>([]);

  // Letzte Performance für eine Übung finden
  const getLastPerformance = (exerciseName: string, setIndex: number): { weight: number; reps: number } | null => {
    const history = getWorkoutHistory();
    for (const workout of history) {
      const exercise = workout.exercises.find((e) => e.name === exerciseName);
      if (exercise && exercise.sets[setIndex]) {
        const set = exercise.sets[setIndex];
        if (set.weight > 0 || set.reps > 0) {
          return { weight: set.weight, reps: set.reps };
        }
      }
    }
    return null;
  };

  const SAMPLE_EXERCISES = [
    { nameKey: 'exercises.benchPress', muscleGroup: 'chest' as const },
    { nameKey: 'exercises.inclineDumbbellPress', muscleGroup: 'chest' as const },
    { nameKey: 'exercises.cableFlyes', muscleGroup: 'chest' as const },
    { nameKey: 'exercises.overheadPress', muscleGroup: 'shoulders' as const },
    { nameKey: 'exercises.lateralRaises', muscleGroup: 'shoulders' as const },
    { nameKey: 'exercises.tricepPushdowns', muscleGroup: 'triceps' as const },
  ];

  useEffect(() => {
    if (activeWorkout) return;

    const workoutId = route.params?.workoutId;

    if (workoutId === 'new') {
      // Neues leeres Workout
      startWorkout({
        userId: user?.id || 'guest',
        name: t('workoutActive.newWorkout'),
        direction: 'gym',
        exercises: [],
        duration: 0,
        totalVolume: 0,
      });
      return;
    }

    if (workoutId && activePlan) {
      // Workout aus Trainingsplan laden
      const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
      let plannedWorkout: IPlannedWorkout | null = null;

      for (const day of days) {
        const dayWorkout = activePlan.weeklySchedule[day];
        if (dayWorkout?.id === workoutId) {
          plannedWorkout = dayWorkout;
          break;
        }
      }

      if (plannedWorkout) {
        startWorkout({
          userId: user?.id || 'guest',
          name: plannedWorkout.name,
          direction: plannedWorkout.direction,
          exercises: plannedWorkout.exercises.map((e) => ({
            id: e.id,
            name: e.name,
            muscleGroup: e.muscleGroup,
            sets: Array.from({ length: e.targetSets }, (_, i) => ({
              id: `${e.id}-set-${i}`,
              weight: e.targetWeight || 0,
              reps: 0,
              completed: false,
            })),
            notes: e.notes,
          })),
          duration: 0,
          totalVolume: 0,
        });
        return;
      }
    }

    // Fallback: Neues Workout wenn nichts anderes zutrifft und workoutId vorhanden
    if (workoutId) {
      startWorkout({
        userId: user?.id || 'guest',
        name: t('workoutActive.newWorkout'),
        direction: 'gym',
        exercises: [],
        duration: 0,
        totalVolume: 0,
      });
    }
  }, [activePlan, route.params?.workoutId]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (activeWorkout?.startedAt) {
        const elapsed = Math.floor(
          (Date.now() - new Date(activeWorkout.startedAt).getTime()) / 1000
        );
        setElapsedTime(elapsed);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeWorkout?.startedAt]);

  useEffect(() => {
    if (!restTimerActive) return;

    const timer = setInterval(() => {
      if (restTimeRemaining <= 1) {
        stopRestTimer();
        if (user?.settings?.hapticFeedback) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } else {
        updateRestTimer(restTimeRemaining - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [restTimerActive, restTimeRemaining]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddExercise = (exercise: { nameKey: string; muscleGroup: 'chest' | 'shoulders' | 'triceps' }) => {
    addExercise({
      name: t(exercise.nameKey),
      muscleGroup: exercise.muscleGroup,
      sets: [{ id: '1', weight: 0, reps: 0, completed: false }],
    });
    setShowExerciseModal(false);
  };

  const handleCompleteSet = (exerciseId: string, setId: string) => {
    completeSet(exerciseId, setId);
    startRestTimer(user?.settings?.restTimerDefault || REST_TIMER_DEFAULT);
    if (user?.settings?.hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleEnterDeleteMode = (exerciseId: string) => {
    setDeleteMode(exerciseId);
    setSetsToDelete([]);
  };

  const handleCancelDeleteMode = () => {
    setDeleteMode(null);
    setSetsToDelete([]);
  };

  const handleToggleSetForDeletion = (setId: string) => {
    setSetsToDelete((prev) =>
      prev.includes(setId) ? prev.filter((id) => id !== setId) : [...prev, setId]
    );
  };

  const handleConfirmDelete = (exerciseId: string) => {
    setsToDelete.forEach((setId) => {
      removeSet(exerciseId, setId);
    });
    setDeleteMode(null);
    setSetsToDelete([]);
  };

  const handleEndWorkout = () => {
    endWorkout();
    navigation.goBack();
  };

  const handleCancelWorkout = () => {
    cancelWorkout();
    navigation.goBack();
  };

  if (!activeWorkout) {
    return <LoadingScreen message={t('workoutActive.loadingWorkout')} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => setShowEndModal(true)}>
          <Text style={[styles.cancelText, { color: COLORS.error }]}>{t('workoutActive.cancel')}</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.workoutName, { color: colors.text }]}>{activeWorkout.name}</Text>
          <Text style={[styles.timer, { color: colors.textSecondary }]}>{formatTime(elapsedTime)}</Text>
        </View>
        <TouchableOpacity onPress={handleEndWorkout}>
          <Text style={[styles.finishText, { color: colors.primary }]}>{t('workoutActive.finish')}</Text>
        </TouchableOpacity>
      </View>

      {restTimerActive && (
        <View style={styles.restTimerBar}>
          <Text style={styles.restTimerText}>
            {t('workoutActive.rest', { time: formatTime(restTimeRemaining) })}
          </Text>
          <TouchableOpacity onPress={stopRestTimer}>
            <Text style={styles.skipText}>{t('workoutActive.skip')}</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeWorkout.exercises.map((exercise) => (
          <Card key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseHeaderLeft}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.muscleGroup}>{t(`muscles.${exercise.muscleGroup}`)}</Text>
              </View>
              <TouchableOpacity
                style={[styles.infoButton, { backgroundColor: colors.border }]}
                onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: exercise.id })}
              >
                <Text style={[styles.infoButtonText, { color: colors.textSecondary }]}>?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.setsHeader}>
              <Text style={styles.setHeaderText}>{t('workoutActive.set')}</Text>
              <Text style={styles.setHeaderText}>{t('workoutActive.kg')}</Text>
              <Text style={styles.setHeaderText}>{t('workoutActive.reps')}</Text>
              <View style={{ width: 44 }} />
            </View>

            {exercise.sets.map((set, setIndex) => {
              const lastPerf = getLastPerformance(exercise.name, setIndex);
              const isInDeleteMode = deleteMode === exercise.id;
              const isSelectedForDelete = setsToDelete.includes(set.id);
              return (
                <View key={set.id} style={styles.setContainer}>
                  <View style={[
                    styles.setRow,
                    set.completed && !isInDeleteMode && styles.setRowCompleted,
                    isSelectedForDelete && styles.setRowSelected,
                  ]}>
                    {isInDeleteMode ? (
                      <TouchableOpacity
                        style={[
                          styles.deleteCheckbox,
                          isSelectedForDelete && styles.deleteCheckboxSelected,
                        ]}
                        onPress={() => handleToggleSetForDeletion(set.id)}
                      >
                        {isSelectedForDelete && <Text style={styles.deleteCheckboxIcon}>✓</Text>}
                      </TouchableOpacity>
                    ) : null}
                    <Text style={[styles.setNumber, !isInDeleteMode && styles.setNumberNormal]}>
                      {setIndex + 1}
                    </Text>
                    <TextInput
                      style={[styles.setInput, { backgroundColor: colors.inputBackground, color: colors.text }]}
                      value={set.weight > 0 ? set.weight.toString() : ''}
                      onChangeText={(text) =>
                        updateSet(exercise.id, set.id, {
                          weight: parseFloat(text) || 0,
                        })
                      }
                      keyboardType="numeric"
                      placeholder={lastPerf ? lastPerf.weight.toString() : '0'}
                      placeholderTextColor={COLORS.gray[400]}
                      editable={!isInDeleteMode}
                    />
                    <TextInput
                      style={[styles.setInput, { backgroundColor: colors.inputBackground, color: colors.text }]}
                      value={set.reps > 0 ? set.reps.toString() : ''}
                      onChangeText={(text) =>
                        updateSet(exercise.id, set.id, {
                          reps: parseInt(text) || 0,
                        })
                      }
                      keyboardType="numeric"
                      placeholder={lastPerf ? lastPerf.reps.toString() : '0'}
                      placeholderTextColor={COLORS.gray[400]}
                      editable={!isInDeleteMode}
                    />
                    <TouchableOpacity
                      style={[
                        styles.checkButton,
                        set.completed && styles.checkButtonCompleted,
                      ]}
                      onPress={() => !isInDeleteMode && handleCompleteSet(exercise.id, set.id)}
                      disabled={isInDeleteMode}
                    >
                      <Text style={styles.checkIcon}>
                        {set.completed ? '✓' : ''}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {lastPerf && !isInDeleteMode && (
                    <Text style={[styles.lastPerfText, { color: colors.textTertiary }]}>
                      {t('workoutActive.lastTime')}: {lastPerf.weight}kg × {lastPerf.reps}
                    </Text>
                  )}
                </View>
              );
            })}

            {deleteMode === exercise.id ? (
              <View style={styles.deleteActionsRow}>
                <TouchableOpacity
                  style={[styles.deleteActionButton, styles.cancelDeleteButton]}
                  onPress={handleCancelDeleteMode}
                >
                  <Text style={styles.cancelDeleteText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.deleteActionButton,
                    styles.confirmDeleteButton,
                    setsToDelete.length === 0 && styles.confirmDeleteButtonDisabled,
                  ]}
                  onPress={() => handleConfirmDelete(exercise.id)}
                  disabled={setsToDelete.length === 0}
                >
                  <Text style={[
                    styles.confirmDeleteText,
                    setsToDelete.length === 0 && styles.confirmDeleteTextDisabled,
                  ]}>
                    {t('workoutActive.deleteSelected', { count: setsToDelete.length })}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.setActionsRow}>
                <TouchableOpacity
                  style={styles.addSetButton}
                  onPress={() => addSet(exercise.id, { weight: 0, reps: 0, completed: false })}
                >
                  <Text style={styles.addSetText}>{t('workoutActive.addSet')}</Text>
                </TouchableOpacity>
                {exercise.sets.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeSetButton}
                    onPress={() => handleEnterDeleteMode(exercise.id)}
                  >
                    <Text style={styles.removeSetText}>{t('workoutActive.removeSet')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Card>
        ))}

        <Button
          title={t('workoutActive.addExercise')}
          variant="outline"
          fullWidth
          onPress={() => setShowExerciseModal(true)}
        />
      </ScrollView>

      <Modal
        visible={showExerciseModal}
        onClose={() => setShowExerciseModal(false)}
        title={t('workoutActive.addExerciseTitle')}
      >
        <ScrollView style={styles.exerciseList}>
          {SAMPLE_EXERCISES.map((exercise, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exerciseItem}
              onPress={() => handleAddExercise(exercise)}
            >
              <Text style={styles.exerciseItemName}>{t(exercise.nameKey)}</Text>
              <Text style={styles.exerciseItemMuscle}>{t(`muscles.${exercise.muscleGroup}`)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Modal>

      <Modal
        visible={showEndModal}
        onClose={() => setShowEndModal(false)}
        title={t('workoutActive.endWorkout')}
      >
        <Text style={styles.modalText}>{t('workoutActive.endWorkoutMessage')}</Text>
        <View style={styles.modalButtons}>
          <Button
            title={t('common.cancel')}
            variant="primary"
            onPress={() => setShowEndModal(false)}
            style={styles.modalButton}
          />
          <Button
            title={t('workoutActive.discard')}
            variant="secondary"
            onPress={handleCancelWorkout}
            style={styles.modalButton}
          />
          <Button
            title={t('common.save')}
            onPress={handleEndWorkout}
            style={styles.modalButton}
          />
        </View>
      </Modal>
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
  cancelText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.error,
  },
  headerCenter: {
    alignItems: 'center',
  },
  workoutName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  timer: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  finishText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.primary,
  },
  restTimerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  restTimerText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.white,
  },
  skipText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  exerciseCard: {
    marginBottom: SPACING.sm,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  exerciseHeaderLeft: {
    flex: 1,
  },
  exerciseName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  muscleGroup: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  infoButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
  },
  setsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    marginBottom: SPACING.sm,
  },
  setHeaderText: {
    flex: 1,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.gray[500],
    textAlign: 'center',
  },
  setContainer: {
    marginBottom: SPACING.xs,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  setRowCompleted: {
    backgroundColor: COLORS.success + '15',
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  deleteSetButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  deleteSetIcon: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.error,
    fontWeight: '600',
    marginTop: -2,
  },
  setNumber: {
    width: 30,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[700],
    textAlign: 'center',
  },
  setNumberNoDelete: {
    marginLeft: 0,
  },
  lastPerfText: {
    fontSize: FONT_SIZES.xs,
    marginLeft: 54,
    marginTop: -4,
    marginBottom: SPACING.xs,
  },
  setInput: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.xs,
    fontSize: FONT_SIZES.base,
    textAlign: 'center',
    color: COLORS.gray[900],
  },
  checkButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkIcon: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
    fontWeight: '700',
  },
  setRowSelected: {
    backgroundColor: COLORS.error + '15',
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  deleteCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray[400],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  deleteCheckboxSelected: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
  },
  deleteCheckboxIcon: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    fontWeight: '700',
  },
  setNumberNormal: {
    marginLeft: 0,
  },
  setActionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.lg,
    marginTop: SPACING.sm,
  },
  addSetButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  addSetText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.primary,
  },
  removeSetButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  removeSetText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.error,
  },
  deleteActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  deleteActionButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  cancelDeleteButton: {
    backgroundColor: COLORS.gray[200],
  },
  cancelDeleteText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.gray[700],
  },
  confirmDeleteButton: {
    backgroundColor: COLORS.error,
  },
  confirmDeleteButtonDisabled: {
    backgroundColor: COLORS.gray[300],
  },
  confirmDeleteText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.white,
  },
  confirmDeleteTextDisabled: {
    color: COLORS.gray[500],
  },
  exerciseList: {
    maxHeight: 300,
  },
  exerciseItem: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  exerciseItemName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.gray[900],
  },
  exerciseItemMuscle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  modalText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  modalButton: {
    flex: 1,
  },
});
