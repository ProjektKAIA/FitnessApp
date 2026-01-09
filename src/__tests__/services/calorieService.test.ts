// /workspaces/claude-workspace/fitnessapp/src/__tests__/services/calorieService.test.ts

import {
  calculateWorkoutCalories,
  getMETValue,
  MET_VALUES,
} from '@/services/workout/calorieService';

describe('calorieService', () => {
  describe('MET_VALUES', () => {
    it('should have correct MET values for all directions', () => {
      expect(MET_VALUES.gym).toBe(6.0);
      expect(MET_VALUES.running).toBe(9.5);
      expect(MET_VALUES.yoga).toBe(3.0);
      expect(MET_VALUES.calisthenics).toBe(8.0);
      expect(MET_VALUES.cardio).toBe(7.0);
      expect(MET_VALUES.mobility).toBe(2.5);
      expect(MET_VALUES.custom).toBe(5.0);
    });
  });

  describe('getMETValue', () => {
    it('should return correct MET value for known direction', () => {
      expect(getMETValue('gym')).toBe(6.0);
      expect(getMETValue('running')).toBe(9.5);
      expect(getMETValue('yoga')).toBe(3.0);
    });

    it('should return custom MET value for unknown direction', () => {
      // @ts-expect-error Testing unknown direction
      expect(getMETValue('unknown')).toBe(5.0);
    });
  });

  describe('calculateWorkoutCalories', () => {
    const defaultWeight = 70; // kg

    it('should calculate calories correctly for gym workout', () => {
      // Formula: MET × weight × duration (hours)
      // 60 min gym: 6.0 × 70 × 1 = 420 calories
      const result = calculateWorkoutCalories(60, 'gym', defaultWeight);
      expect(result).toBe(420);
    });

    it('should calculate calories correctly for running', () => {
      // 30 min running: 9.5 × 70 × 0.5 = 332.5 ≈ 333 calories
      const result = calculateWorkoutCalories(30, 'running', defaultWeight);
      expect(result).toBe(333);
    });

    it('should calculate calories correctly for yoga', () => {
      // 45 min yoga: 3.0 × 70 × 0.75 = 157.5 ≈ 158 calories
      const result = calculateWorkoutCalories(45, 'yoga', defaultWeight);
      expect(result).toBe(158);
    });

    it('should use default weight when not provided', () => {
      // 60 min gym with default 70kg: 6.0 × 70 × 1 = 420 calories
      const result = calculateWorkoutCalories(60, 'gym');
      expect(result).toBe(420);
    });

    it('should return 0 for 0 duration', () => {
      const result = calculateWorkoutCalories(0, 'gym', defaultWeight);
      expect(result).toBe(0);
    });

    it('should return 0 for negative duration', () => {
      const result = calculateWorkoutCalories(-30, 'gym', defaultWeight);
      expect(result).toBe(0);
    });

    it('should scale correctly with different weights', () => {
      // 60 min gym with 80kg: 6.0 × 80 × 1 = 480 calories
      const result80kg = calculateWorkoutCalories(60, 'gym', 80);
      expect(result80kg).toBe(480);

      // 60 min gym with 60kg: 6.0 × 60 × 1 = 360 calories
      const result60kg = calculateWorkoutCalories(60, 'gym', 60);
      expect(result60kg).toBe(360);
    });

    it('should scale correctly with different durations', () => {
      // 15 min gym: 6.0 × 70 × 0.25 = 105 calories
      const result15min = calculateWorkoutCalories(15, 'gym', defaultWeight);
      expect(result15min).toBe(105);

      // 90 min gym: 6.0 × 70 × 1.5 = 630 calories
      const result90min = calculateWorkoutCalories(90, 'gym', defaultWeight);
      expect(result90min).toBe(630);
    });

    it('should use custom MET for unknown direction', () => {
      // @ts-expect-error Testing unknown direction
      // 60 min unknown: 5.0 × 70 × 1 = 350 calories
      const result = calculateWorkoutCalories(60, 'unknown', defaultWeight);
      expect(result).toBe(350);
    });
  });
});
