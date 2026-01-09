// /workspaces/claude-workspace/fitnessapp/src/services/workout/completionService.ts

import { IWorkout } from '@/types';
import { IRunningSession, useRunningStore } from '@/stores/runningStore';
import { IYogaSessionRecord, useYogaStore } from '@/stores/yogaStore';
import { logger } from '@/lib/logger';
import { calculateWorkoutCalories } from './calorieService';
import { updateAllStats } from './statsUpdateService';
import {
  exportWorkoutToHealth,
  exportRunningToHealth,
  exportYogaToHealth,
  isHealthExportEnabled,
} from './healthExportService';

const log = logger.scope('WorkoutCompletion');

export interface ICompletionResult {
  caloriesBurned: number;
  statsUpdated: boolean;
  healthExported: boolean;
}

/**
 * Main function to handle all post-workout completion tasks
 * Orchestrates: Calories → Stats → Health Export
 */
export const handleWorkoutCompletion = async (
  workout: IWorkout,
  userWeightKg?: number,
  lastWorkoutDate?: Date | null
): Promise<ICompletionResult> => {
  const result: ICompletionResult = {
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

    // 2. Update all stats (calories, streak, workout counts)
    const statsResult = updateAllStats(
      result.caloriesBurned,
      lastWorkoutDate ?? null,
      workout.totalVolume
    );
    result.statsUpdated = statsResult.statsUpdated;

    // 3. Export to Health platforms
    if (isHealthExportEnabled()) {
      try {
        result.healthExported = await exportWorkoutToHealth(workout, result.caloriesBurned);
      } catch (error) {
        log.error('Failed to export to health platform', error);
      }
    }

    log.info('Workout completion processed', {
      workoutId: workout.id,
      duration: workout.duration,
      caloriesBurned: result.caloriesBurned,
      statsUpdated: result.statsUpdated,
      healthExported: result.healthExported,
    });

    return result;
  } catch (error) {
    log.error('Error processing workout completion', error);
    return result;
  }
};

/**
 * Handle running session completion
 */
export const handleRunningCompletion = async (
  session: IRunningSession,
  userWeightKg?: number
): Promise<ICompletionResult> => {
  const result: ICompletionResult = {
    caloriesBurned: 0,
    statsUpdated: false,
    healthExported: false,
  };

  try {
    // 1. Calculate calories burned (duration is in seconds, convert to minutes)
    const durationMinutes = Math.round(session.duration / 60);
    result.caloriesBurned = calculateWorkoutCalories(durationMinutes, 'running', userWeightKg);

    // 2. Update all stats
    const runningStore = useRunningStore.getState();
    const lastSessionDate = runningStore.getLastSessionDate();

    const statsResult = updateAllStats(result.caloriesBurned, lastSessionDate, 0);
    result.statsUpdated = statsResult.statsUpdated;

    // 3. Export to Health platforms
    if (isHealthExportEnabled()) {
      try {
        result.healthExported = await exportRunningToHealth(session, result.caloriesBurned);
      } catch (error) {
        log.error('Failed to export running to health platform', error);
      }
    }

    log.info('Running session completion processed', {
      sessionId: session.id,
      duration: durationMinutes,
      caloriesBurned: result.caloriesBurned,
      statsUpdated: result.statsUpdated,
      healthExported: result.healthExported,
    });

    return result;
  } catch (error) {
    log.error('Error processing running session completion', error);
    return result;
  }
};

/**
 * Handle yoga session completion
 */
export const handleYogaCompletion = async (
  session: IYogaSessionRecord,
  userWeightKg?: number
): Promise<ICompletionResult> => {
  const result: ICompletionResult = {
    caloriesBurned: 0,
    statsUpdated: false,
    healthExported: false,
  };

  try {
    // 1. Calculate calories burned (duration is in seconds, convert to minutes)
    const durationMinutes = Math.round(session.duration / 60);
    result.caloriesBurned = calculateWorkoutCalories(durationMinutes, 'yoga', userWeightKg);

    // 2. Update all stats
    const yogaStore = useYogaStore.getState();
    const lastSessionDate = yogaStore.getLastSessionDate();

    const statsResult = updateAllStats(result.caloriesBurned, lastSessionDate, 0);
    result.statsUpdated = statsResult.statsUpdated;

    // 3. Export to Health platforms
    if (isHealthExportEnabled()) {
      try {
        result.healthExported = await exportYogaToHealth(session, result.caloriesBurned);
      } catch (error) {
        log.error('Failed to export yoga to health platform', error);
      }
    }

    log.info('Yoga session completion processed', {
      sessionId: session.id,
      duration: durationMinutes,
      caloriesBurned: result.caloriesBurned,
      statsUpdated: result.statsUpdated,
      healthExported: result.healthExported,
    });

    return result;
  } catch (error) {
    log.error('Error processing yoga session completion', error);
    return result;
  }
};
