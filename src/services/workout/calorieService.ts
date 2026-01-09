// /workspaces/claude-workspace/fitnessapp/src/services/workout/calorieService.ts

import { TDirection } from '@/types';

/**
 * MET values for different workout types (Metabolic Equivalent of Task)
 * Higher MET = more intense activity = more calories burned
 */
export const MET_VALUES: Record<TDirection, number> = {
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
 *
 * @param durationMinutes - Workout duration in minutes
 * @param direction - Type of workout (gym, running, yoga, etc.)
 * @param userWeightKg - User weight in kg (default: 70)
 * @returns Estimated calories burned (rounded)
 */
export const calculateWorkoutCalories = (
  durationMinutes: number,
  direction: TDirection,
  userWeightKg: number = 70
): number => {
  if (durationMinutes <= 0) return 0;

  const met = MET_VALUES[direction] || MET_VALUES.custom;
  const durationHours = durationMinutes / 60;
  const calories = met * userWeightKg * durationHours;

  return Math.round(calories);
};

/**
 * Get MET value for a specific workout direction
 */
export const getMETValue = (direction: TDirection): number => {
  return MET_VALUES[direction] || MET_VALUES.custom;
};
