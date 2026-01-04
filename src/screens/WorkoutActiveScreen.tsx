import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, REST_TIMER_DEFAULT } from '@/constants';
import { Button, Card, Modal } from '@/components/common';
import { useWorkoutStore, useUserStore } from '@/stores';
import { RootStackParamList, IExercise, ISet } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type WorkoutActiveRouteProp = RouteProp<RootStackParamList, 'WorkoutActive'>;

const SAMPLE_EXERCISES = [
  { name: 'Bench Press', muscleGroup: 'chest' as const },
  { name: 'Incline Dumbbell Press', muscleGroup: 'chest' as const },
  { name: 'Cable Flyes', muscleGroup: 'chest' as const },
  { name: 'Overhead Press', muscleGroup: 'shoulders' as const },
  { name: 'Lateral Raises', muscleGroup: 'shoulders' as const },
  { name: 'Tricep Pushdowns', muscleGroup: 'triceps' as const },
];

export const WorkoutActiveScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<WorkoutActiveRouteProp>();
  const { user } = useUserStore();
  const {
    activeWorkout,
    startWorkout,
    endWorkout,
    cancelWorkout,
    addExercise,
    addSet,
    updateSet,
    completeSet,
    restTimerActive,
    restTimeRemaining,
    startRestTimer,
    stopRestTimer,
    updateRestTimer,
  } = useWorkoutStore();

  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!activeWorkout && route.params?.workoutId === 'new') {
      startWorkout({
        userId: user?.id || 'guest',
        name: 'New Workout',
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

  const handleAddExercise = (exercise: { name: string; muscleGroup: 'chest' | 'shoulders' | 'triceps' }) => {
    addExercise({
      name: exercise.name,
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
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowEndModal(true)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.workoutName}>{activeWorkout.name}</Text>
          <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
        </View>
        <TouchableOpacity onPress={handleEndWorkout}>
          <Text style={styles.finishText}>Finish</Text>
        </TouchableOpacity>
      </View>

      {restTimerActive && (
        <View style={styles.restTimerBar}>
          <Text style={styles.restTimerText}>
            Rest: {formatTime(restTimeRemaining)}
          </Text>
          <TouchableOpacity onPress={stopRestTimer}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeWorkout.exercises.map((exercise, exerciseIndex) => (
          <Card key={exercise.id} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.muscleGroup}>{exercise.muscleGroup}</Text>

            <View style={styles.setsHeader}>
              <Text style={styles.setHeaderText}>SET</Text>
              <Text style={styles.setHeaderText}>KG</Text>
              <Text style={styles.setHeaderText}>REPS</Text>
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
              <Text style={styles.addSetText}>+ Add Set</Text>
            </TouchableOpacity>
          </Card>
        ))}

        <Button
          title="+ Add Exercise"
          variant="outline"
          fullWidth
          onPress={() => setShowExerciseModal(true)}
        />
      </ScrollView>

      <Modal
        visible={showExerciseModal}
        onClose={() => setShowExerciseModal(false)}
        title="Add Exercise"
      >
        <ScrollView style={styles.exerciseList}>
          {SAMPLE_EXERCISES.map((exercise, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exerciseItem}
              onPress={() => handleAddExercise(exercise)}
            >
              <Text style={styles.exerciseItemName}>{exercise.name}</Text>
              <Text style={styles.exerciseItemMuscle}>{exercise.muscleGroup}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Modal>

      <Modal
        visible={showEndModal}
        onClose={() => setShowEndModal(false)}
        title="End Workout?"
      >
        <Text style={styles.modalText}>
          Are you sure you want to end this workout? Your progress will be saved.
        </Text>
        <View style={styles.modalButtons}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => setShowEndModal(false)}
            style={styles.modalButton}
          />
          <Button
            title="Discard"
            variant="secondary"
            onPress={handleCancelWorkout}
            style={styles.modalButton}
          />
          <Button
            title="Save"
            onPress={handleEndWorkout}
            style={styles.modalButton}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gray[500],
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
