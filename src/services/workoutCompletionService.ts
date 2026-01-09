// /workspaces/claude-workspace/fitnessapp/src/services/workoutCompletionService.ts

import { Platform } from 'react-native';
import { IWorkout, TDirection } from '@/types';
import { useStatsStore } from '@/stores/statsStore';
import { useUserGoalsStore } from '@/stores/userGoalsStore';
import { useHealthStore } from '@/stores/healthStore';

// MET values for different workout types (Metabolic Equivalent of Task)
const MET_VALUES: Record<TDirection, number> = {
  gym: 6.0,           // Weight training
  calisthenics: 8.0,  // Bodyweight exercises
  cardio: 7.0,        // General cardio
  yoga: 3.0,          // Yoga
  running: 9.5,       // Running (moderate pace)
  mobility: 2.5,      // Stretching/mobility
  custom: 5.0,        // General exercise
};

/**
 * Calculate calories burned during workout
 * Formula: Calories = MET × weight (kg) × duration (hours)
 */
export const calculateWorkoutCalories = (
  durationMinutes: number,
  direction: TDirection,
  userWeightKg: number = 70 // Default weight if not available
): number => {
  const met = MET_VALUES[direction] || MET_VALUES.custom;
  const durationHours = durationMinutes / 60;
  const calories = met * userWeightKg * durationHours;
  return Math.round(calories);
};

/**
 * Check if workout was on a different day than last workout (for streak calculation)
 */
const isNewWorkoutDay = (lastWorkoutDate: Date | null, currentDate: Date): boolean => {
  if (!lastWorkoutDate) return true;

  const last = new Date(lastWorkoutDate);
  const current = new Date(currentDate);

  // Reset to start of day for comparison
  last.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);

  return current.getTime() > last.getTime();
};

/**
 * Check if streak should be reset (more than 1 day gap)
 */
const shouldResetStreak = (lastWorkoutDate: Date | null, currentDate: Date): boolean => {
  if (!lastWorkoutDate) return false;

  const last = new Date(lastWorkoutDate);
  const current = new Date(currentDate);

  // Reset to start of day
  last.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays > 1;
};

/**
 * Main function to handle all post-workout completion tasks
 */
export const handleWorkoutCompletion = async (
  workout: IWorkout,
  userWeightKg?: number,
  lastWorkoutDate?: Date | null
): Promise<{
  caloriesBurned: number;
  statsUpdated: boolean;
  healthExported: boolean;
}> => {
  const result = {
    caloriesBurned: 0,
    statsUpdated: false,
    healthExported: false,
  };

  try {
    // 1. Calculate calories burned
    result.caloriesBurned = calculateWorkoutCalories(
      workout.duration,
      workout.direction,
      userWeightKg
    );

    // 2. Update calorie tracking
    const userGoalsStore = useUserGoalsStore.getState();
    const currentEntry = userGoalsStore.getTodayCalories();
    const currentBurned = currentEntry?.workoutBurned || 0;
    userGoalsStore.updateTodayWorkoutCalories(currentBurned + result.caloriesBurned);

    // 3. Update stats
    const statsStore = useStatsStore.getState();
    const currentStats = statsStore.stats;
    const now = new Date();

    // Check streak logic
    if (lastWorkoutDate && shouldResetStreak(lastWorkoutDate, now)) {
      statsStore.resetStreak();
    }

    if (!lastWorkoutDate || isNewWorkoutDay(lastWorkoutDate, now)) {
      statsStore.incrementStreak();
    }

    // Update workout counts
    statsStore.updateStats({
      totalWorkouts: currentStats.totalWorkouts + 1,
      totalVolume: currentStats.totalVolume + workout.totalVolume,
      thisWeekWorkouts: currentStats.thisWeekWorkouts + 1,
      thisMonthWorkouts: currentStats.thisMonthWorkouts + 1,
    });

    result.statsUpdated = true;

    // 4. Export to Health platforms
    const healthStore = useHealthStore.getState();
    const healthSettings = healthStore.settings;

    if (healthSettings.enabled && healthSettings.permissionsGranted) {
      try {
        await exportWorkoutToHealth(workout, result.caloriesBurned);
        result.healthExported = true;
      } catch (error) {
        console.error('[WorkoutCompletion] Failed to export to health platform:', error);
      }
    }

    console.log('[WorkoutCompletion] Workout completion processed:', {
      workoutId: workout.id,
      duration: workout.duration,
      caloriesBurned: result.caloriesBurned,
      statsUpdated: result.statsUpdated,
      healthExported: result.healthExported,
    });

    return result;
  } catch (error) {
    console.error('[WorkoutCompletion] Error processing workout completion:', error);
    return result;
  }
};

/**
 * Export workout to Apple Health or Google Health Connect
 */
const exportWorkoutToHealth = async (
  workout: IWorkout,
  caloriesBurned: number
): Promise<void> => {
  const healthStore = useHealthStore.getState();
  const platform = healthStore.settings.platform;

  if (Platform.OS === 'ios' && platform === 'apple_health') {
    await exportToAppleHealth(workout, caloriesBurned);
  } else if (Platform.OS === 'android' && platform === 'health_connect') {
    await exportToHealthConnect(workout, caloriesBurned);
  }
};

/**
 * Export workout to Apple Health
 */
const exportToAppleHealth = async (
  workout: IWorkout,
  caloriesBurned: number
): Promise<void> => {
  try {
    const AppleHealthKit = require('react-native-health').default;

    // Map direction to HealthKit workout type
    const workoutTypeMap: Record<TDirection, string> = {
      gym: 'TraditionalStrengthTraining',
      calisthenics: 'FunctionalStrengthTraining',
      cardio: 'MixedCardio',
      yoga: 'Yoga',
      running: 'Running',
      mobility: 'Flexibility',
      custom: 'Other',
    };

    const workoutType = workoutTypeMap[workout.direction] || 'Other';
    const startDate = workout.startedAt ? new Date(workout.startedAt) : new Date();
    const endDate = workout.finishedAt ? new Date(workout.finishedAt) : new Date();

    const options = {
      type: workoutType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      energyBurned: caloriesBurned,
      energyBurnedUnit: 'calorie',
    };

    await new Promise<void>((resolve, reject) => {
      AppleHealthKit.saveWorkout(options, (error: any, result: any) => {
        if (error) {
          reject(error);
        } else {
          console.log('[AppleHealth] Workout saved:', result);
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('[AppleHealth] Error saving workout:', error);
    throw error;
  }
};

/**
 * Export workout to Google Health Connect
 */
const exportToHealthConnect = async (
  workout: IWorkout,
  caloriesBurned: number
): Promise<void> => {
  try {
    const { insertRecords } = require('react-native-health-connect');

    // Map direction to Health Connect exercise type
    const exerciseTypeMap: Record<TDirection, number> = {
      gym: 78,          // WEIGHTLIFTING
      calisthenics: 9,  // CALISTHENICS
      cardio: 29,       // HIGH_INTENSITY_INTERVAL_TRAINING
      yoga: 83,         // YOGA
      running: 56,      // RUNNING
      mobility: 68,     // STRETCHING
      custom: 0,        // OTHER
    };

    const exerciseType = exerciseTypeMap[workout.direction] || 0;
    const startDate = workout.startedAt ? new Date(workout.startedAt) : new Date();
    const endDate = workout.finishedAt ? new Date(workout.finishedAt) : new Date();

    // Insert exercise session
    await insertRecords([
      {
        recordType: 'ExerciseSession',
        exerciseType,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        title: workout.name,
      },
    ]);

    // Insert calories burned
    if (caloriesBurned > 0) {
      await insertRecords([
        {
          recordType: 'ActiveCaloriesBurned',
          energy: {
            value: caloriesBurned,
            unit: 'kilocalories',
          },
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      ]);
    }

    console.log('[HealthConnect] Workout saved');
  } catch (error) {
    console.error('[HealthConnect] Error saving workout:', error);
    throw error;
  }
};
