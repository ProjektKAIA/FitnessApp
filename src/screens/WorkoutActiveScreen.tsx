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
import { useWorkoutStore, useUserStore } from '@/stores';
import { RootStackParamList } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type WorkoutActiveRouteProp = RouteProp<RootStackParamList, 'WorkoutActive'>;

export const WorkoutActiveScreen: React.FC = () => {
  const { t } = useTranslation();
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
  const completeSet = useWorkoutStore((state) => state.completeSet);
  const restTimerActive = useWorkoutStore((state) => state.restTimerActive);
  const restTimeRemaining = useWorkoutStore((state) => state.restTimeRemaining);
  const startRestTimer = useWorkoutStore((state) => state.startRestTimer);
  const stopRestTimer = useWorkoutStore((state) => state.stopRestTimer);
  const updateRestTimer = useWorkoutStore((state) => state.updateRestTimer);

  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const SAMPLE_EXERCISES = [
    { nameKey: 'exercises.benchPress', muscleGroup: 'chest' as const },
    { nameKey: 'exercises.inclineDumbbellPress', muscleGroup: 'chest' as const },
    { nameKey: 'exercises.cableFlyes', muscleGroup: 'chest' as const },
    { nameKey: 'exercises.overheadPress', muscleGroup: 'shoulders' as const },
    { nameKey: 'exercises.lateralRaises', muscleGroup: 'shoulders' as const },
    { nameKey: 'exercises.tricepPushdowns', muscleGroup: 'triceps' as const },
  ];

  useEffect(() => {
    if (!activeWorkout && route.params?.workoutId === 'new') {
      startWorkout({
        userId: user?.id || 'guest',
        name: t('workoutActive.newWorkout'),
        direction: 'gym',
        exercises: [],
        duration: 0,
        totalVolume: 0,
      });
    }
  }, []);

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

  const handleEndWorkout = () => {
    endWorkout();
    navigation.goBack();
  };

  const handleCancelWorkout = () => {
    cancelWorkout();
    navigation.goBack();
  };

  if (!activeWorkout) {
    return <LoadingScreen message={t('workoutActive.loadingWorkout')} backgroundColor={COLORS.gray[100]} />;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <TouchableOpacity onPress={() => setShowEndModal(true)}>
          <Text style={styles.cancelText}>{t('workoutActive.cancel')}</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.workoutName}>{activeWorkout.name}</Text>
          <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
        </View>
        <TouchableOpacity onPress={handleEndWorkout}>
          <Text style={styles.finishText}>{t('workoutActive.finish')}</Text>
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
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.muscleGroup}>{t(`muscles.${exercise.muscleGroup}`)}</Text>

            <View style={styles.setsHeader}>
              <Text style={styles.setHeaderText}>{t('workoutActive.set')}</Text>
              <Text style={styles.setHeaderText}>{t('workoutActive.kg')}</Text>
              <Text style={styles.setHeaderText}>{t('workoutActive.reps')}</Text>
              <View style={{ width: 44 }} />
            </View>

            {exercise.sets.map((set, setIndex) => (
              <View
                key={set.id}
                style={[styles.setRow, set.completed && styles.setRowCompleted]}
              >
                <Text style={styles.setNumber}>{setIndex + 1}</Text>
                <TextInput
                  style={styles.setInput}
                  value={set.weight > 0 ? set.weight.toString() : ''}
                  onChangeText={(text) =>
                    updateSet(exercise.id, set.id, {
                      weight: parseFloat(text) || 0,
                    })
                  }
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={COLORS.gray[400]}
                />
                <TextInput
                  style={styles.setInput}
                  value={set.reps > 0 ? set.reps.toString() : ''}
                  onChangeText={(text) =>
                    updateSet(exercise.id, set.id, {
                      reps: parseInt(text) || 0,
                    })
                  }
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={COLORS.gray[400]}
                />
                <TouchableOpacity
                  style={[
                    styles.checkButton,
                    set.completed && styles.checkButtonCompleted,
                  ]}
                  onPress={() => handleCompleteSet(exercise.id, set.id)}
                >
                  <Text style={styles.checkIcon}>
                    {set.completed ? '✓' : ''}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addSetButton}
              onPress={() =>
                addSet(exercise.id, { weight: 0, reps: 0, completed: false })
              }
            >
              <Text style={styles.addSetText}>{t('workoutActive.addSet')}</Text>
            </TouchableOpacity>
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
            variant="outline"
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
  exerciseName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  muscleGroup: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginBottom: SPACING.md,
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
  setNumber: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[700],
    textAlign: 'center',
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
  addSetButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  addSetText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.primary,
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
