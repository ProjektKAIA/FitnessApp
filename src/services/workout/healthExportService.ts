// /workspaces/claude-workspace/fitnessapp/src/services/workout/healthExportService.ts

import { Platform } from 'react-native';
import { IWorkout, TDirection } from '@/types';
import { useHealthStore } from '@/stores/healthStore';
import { IRunningSession } from '@/stores/runningStore';
import { IYogaSessionRecord } from '@/stores/yogaStore';
import { logger } from '@/lib/logger';

const log = logger.scope('HealthExport');

// ============================================
// TYPE MAPPINGS
// ============================================

/**
 * Map workout direction to Apple HealthKit workout type
 */
const APPLE_HEALTH_WORKOUT_TYPES: Record<TDirection, string> = {
  gym: 'TraditionalStrengthTraining',
  calisthenics: 'FunctionalStrengthTraining',
  cardio: 'MixedCardio',
  yoga: 'Yoga',
  running: 'Running',
  mobility: 'Flexibility',
  custom: 'Other',
};

/**
 * Map workout direction to Google Health Connect exercise type
 */
const HEALTH_CONNECT_EXERCISE_TYPES: Record<TDirection, number> = {
  gym: 78,          // WEIGHTLIFTING
  calisthenics: 9,  // CALISTHENICS
  cardio: 29,       // HIGH_INTENSITY_INTERVAL_TRAINING
  yoga: 83,         // YOGA
  running: 56,      // RUNNING
  mobility: 68,     // STRETCHING
  custom: 0,        // OTHER
};

// ============================================
// APPLE HEALTH EXPORT
// ============================================

/**
 * Export workout to Apple Health
 */
const exportToAppleHealth = async (
  workoutType: string,
  startDate: Date,
  endDate: Date,
  caloriesBurned: number,
  title?: string
): Promise<void> => {
  const AppleHealthKit = require('react-native-health').default;

  const options = {
    type: workoutType,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    energyBurned: caloriesBurned,
    energyBurnedUnit: 'calorie',
  };

  await new Promise<void>((resolve, reject) => {
    AppleHealthKit.saveWorkout(options, (error: Error | null, result: unknown) => {
      if (error) {
        reject(error);
      } else {
        log.info('Apple Health workout saved', { result });
        resolve();
      }
    });
  });
};

// ============================================
// HEALTH CONNECT EXPORT
// ============================================

/**
 * Export workout to Google Health Connect
 */
const exportToHealthConnect = async (
  exerciseType: number,
  startDate: Date,
  endDate: Date,
  caloriesBurned: number,
  title: string
): Promise<void> => {
  const { insertRecords } = require('react-native-health-connect');

  // Insert exercise session
  await insertRecords([
    {
      recordType: 'ExerciseSession',
      exerciseType,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      title,
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

  log.info('Health Connect workout saved');
};

// ============================================
// PUBLIC EXPORT FUNCTIONS
// ============================================

/**
 * Check if health export is enabled and available
 */
export const isHealthExportEnabled = (): boolean => {
  const healthStore = useHealthStore.getState();
  const { enabled, permissionsGranted } = healthStore.settings;
  return enabled && permissionsGranted;
};

/**
 * Export a gym/calisthenics workout to Health platforms
 */
export const exportWorkoutToHealth = async (
  workout: IWorkout,
  caloriesBurned: number
): Promise<boolean> => {
  if (!isHealthExportEnabled()) return false;

  const healthStore = useHealthStore.getState();
  const platform = healthStore.settings.platform;

  const startDate = workout.startedAt ? new Date(workout.startedAt) : new Date();
  const endDate = workout.finishedAt ? new Date(workout.finishedAt) : new Date();

  try {
    if (Platform.OS === 'ios' && platform === 'apple_health') {
      const workoutType = APPLE_HEALTH_WORKOUT_TYPES[workout.direction] || 'Other';
      await exportToAppleHealth(workoutType, startDate, endDate, caloriesBurned, workout.name);
      return true;
    } else if (Platform.OS === 'android' && platform === 'health_connect') {
      const exerciseType = HEALTH_CONNECT_EXERCISE_TYPES[workout.direction] || 0;
      await exportToHealthConnect(exerciseType, startDate, endDate, caloriesBurned, workout.name);
      return true;
    }
    return false;
  } catch (error) {
    log.error('Error exporting workout', error);
    throw error;
  }
};

/**
 * Export a running session to Health platforms
 */
export const exportRunningToHealth = async (
  session: IRunningSession,
  caloriesBurned: number
): Promise<boolean> => {
  if (!isHealthExportEnabled()) return false;

  const healthStore = useHealthStore.getState();
  const platform = healthStore.settings.platform;

  const startDate = new Date(session.startedAt);
  const endDate = session.finishedAt ? new Date(session.finishedAt) : new Date();

  try {
    if (Platform.OS === 'ios' && platform === 'apple_health') {
      await exportToAppleHealth('Running', startDate, endDate, caloriesBurned, session.workoutName);
      return true;
    } else if (Platform.OS === 'android' && platform === 'health_connect') {
      await exportToHealthConnect(56, startDate, endDate, caloriesBurned, session.workoutName);
      return true;
    }
    return false;
  } catch (error) {
    log.error('Error exporting running session', error);
    throw error;
  }
};

/**
 * Export a yoga session to Health platforms
 */
export const exportYogaToHealth = async (
  session: IYogaSessionRecord,
  caloriesBurned: number
): Promise<boolean> => {
  if (!isHealthExportEnabled()) return false;

  const healthStore = useHealthStore.getState();
  const platform = healthStore.settings.platform;

  const startDate = new Date(session.startedAt);
  const endDate = session.finishedAt ? new Date(session.finishedAt) : new Date();

  try {
    if (Platform.OS === 'ios' && platform === 'apple_health') {
      await exportToAppleHealth('Yoga', startDate, endDate, caloriesBurned, session.sessionName);
      return true;
    } else if (Platform.OS === 'android' && platform === 'health_connect') {
      await exportToHealthConnect(83, startDate, endDate, caloriesBurned, session.sessionName);
      return true;
    }
    return false;
  } catch (error) {
    log.error('Error exporting yoga session', error);
    throw error;
  }
};
