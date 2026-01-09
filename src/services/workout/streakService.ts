// /workspaces/claude-workspace/fitnessapp/src/services/workout/streakService.ts

/**
 * Check if workout was on a different day than last workout (for streak calculation)
 *
 * @param lastWorkoutDate - Date of the last workout
 * @param currentDate - Current date
 * @returns true if the current workout is on a new day
 */
export const isNewWorkoutDay = (
  lastWorkoutDate: Date | null,
  currentDate: Date
): boolean => {
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
 *
 * @param lastWorkoutDate - Date of the last workout
 * @param currentDate - Current date
 * @returns true if there's more than 1 day gap (streak should reset)
 */
export const shouldResetStreak = (
  lastWorkoutDate: Date | null,
  currentDate: Date
): boolean => {
  if (!lastWorkoutDate) return false;

  const last = new Date(lastWorkoutDate);
  const current = new Date(currentDate);

  // Reset to start of day
  last.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
  );

  return diffDays > 1;
};

/**
 * Calculate the number of consecutive days since last workout
 *
 * @param lastWorkoutDate - Date of the last workout
 * @param currentDate - Current date
 * @returns Number of days since last workout
 */
export const getDaysSinceLastWorkout = (
  lastWorkoutDate: Date | null,
  currentDate: Date
): number => {
  if (!lastWorkoutDate) return Infinity;

  const last = new Date(lastWorkoutDate);
  const current = new Date(currentDate);

  last.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);

  return Math.floor(
    (current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
  );
};
