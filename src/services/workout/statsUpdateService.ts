// /workspaces/claude-workspace/fitnessapp/src/services/workout/statsUpdateService.ts

import { useStatsStore } from '@/stores/statsStore';
import { useUserGoalsStore } from '@/stores/userGoalsStore';
import { isNewWorkoutDay, shouldResetStreak } from './streakService';
import { logger } from '@/lib/logger';

const log = logger.scope('StatsUpdate');

export interface IStatsUpdateResult {
  streakUpdated: boolean;
  statsUpdated: boolean;
  caloriesTracked: boolean;
}

/**
 * Update calorie tracking for today
 *
 * @param caloriesBurned - Calories burned in the workout
 */
export const updateCalorieTracking = (caloriesBurned: number): void => {
  const userGoalsStore = useUserGoalsStore.getState();
  const currentEntry = userGoalsStore.getTodayCalories();
  const currentBurned = currentEntry?.workoutBurned || 0;
  userGoalsStore.updateTodayWorkoutCalories(currentBurned + caloriesBurned);
};

/**
 * Update streak based on last workout date
 *
 * @param lastWorkoutDate - Date of the last workout
 * @returns true if streak was incremented
 */
export const updateStreak = (lastWorkoutDate: Date | null): boolean => {
  const statsStore = useStatsStore.getState();
  const now = new Date();

  // Check if streak should be reset (more than 1 day gap)
  if (lastWorkoutDate && shouldResetStreak(lastWorkoutDate, now)) {
    statsStore.resetStreak();
  }

  // Increment streak if this is a new workout day
  if (!lastWorkoutDate || isNewWorkoutDay(lastWorkoutDate, now)) {
    statsStore.incrementStreak();
    return true;
  }

  return false;
};

/**
 * Update workout stats (counts and volume)
 *
 * @param additionalVolume - Volume to add (0 for cardio/yoga)
 */
export const updateWorkoutCounts = (additionalVolume: number = 0): void => {
  const statsStore = useStatsStore.getState();
  const currentStats = statsStore.stats;

  statsStore.updateStats({
    totalWorkouts: currentStats.totalWorkouts + 1,
    totalVolume: currentStats.totalVolume + additionalVolume,
    thisWeekWorkouts: currentStats.thisWeekWorkouts + 1,
    thisMonthWorkouts: currentStats.thisMonthWorkouts + 1,
  });
};

/**
 * Combined function to update all stats after workout completion
 *
 * @param caloriesBurned - Calories burned in the workout
 * @param lastWorkoutDate - Date of the last workout
 * @param additionalVolume - Volume to add (default: 0)
 * @returns Result indicating what was updated
 */
export const updateAllStats = (
  caloriesBurned: number,
  lastWorkoutDate: Date | null,
  additionalVolume: number = 0
): IStatsUpdateResult => {
  const result: IStatsUpdateResult = {
    streakUpdated: false,
    statsUpdated: false,
    caloriesTracked: false,
  };

  try {
    // Update calorie tracking
    updateCalorieTracking(caloriesBurned);
    result.caloriesTracked = true;

    // Update streak
    result.streakUpdated = updateStreak(lastWorkoutDate);

    // Update workout counts
    updateWorkoutCounts(additionalVolume);
    result.statsUpdated = true;
  } catch (error) {
    log.error('Error updating stats', error);
  }

  return result;
};
