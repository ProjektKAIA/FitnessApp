// /workspaces/claude-workspace/fitnessapp/src/__tests__/services/streakService.test.ts

import {
  isNewWorkoutDay,
  shouldResetStreak,
  getDaysSinceLastWorkout,
} from '@/services/workout/streakService';

describe('streakService', () => {
  describe('isNewWorkoutDay', () => {
    it('should return true when lastWorkoutDate is null', () => {
      const result = isNewWorkoutDay(null, new Date());
      expect(result).toBe(true);
    });

    it('should return true when workout is on different day', () => {
      const lastWorkout = new Date('2024-01-15T10:00:00');
      const currentDate = new Date('2024-01-16T08:00:00');
      const result = isNewWorkoutDay(lastWorkout, currentDate);
      expect(result).toBe(true);
    });

    it('should return false when workout is on same day', () => {
      const lastWorkout = new Date('2024-01-15T10:00:00');
      const currentDate = new Date('2024-01-15T18:00:00');
      const result = isNewWorkoutDay(lastWorkout, currentDate);
      expect(result).toBe(false);
    });

    it('should handle edge case at midnight', () => {
      const lastWorkout = new Date('2024-01-15T23:59:59');
      const currentDate = new Date('2024-01-16T00:00:01');
      const result = isNewWorkoutDay(lastWorkout, currentDate);
      expect(result).toBe(true);
    });

    it('should handle same exact time', () => {
      const sameDate = new Date('2024-01-15T10:00:00');
      const result = isNewWorkoutDay(sameDate, new Date(sameDate));
      expect(result).toBe(false);
    });
  });

  describe('shouldResetStreak', () => {
    it('should return false when lastWorkoutDate is null', () => {
      const result = shouldResetStreak(null, new Date());
      expect(result).toBe(false);
    });

    it('should return false when gap is exactly 1 day', () => {
      const lastWorkout = new Date('2024-01-15T10:00:00');
      const currentDate = new Date('2024-01-16T08:00:00');
      const result = shouldResetStreak(lastWorkout, currentDate);
      expect(result).toBe(false);
    });

    it('should return true when gap is more than 1 day', () => {
      const lastWorkout = new Date('2024-01-15T10:00:00');
      const currentDate = new Date('2024-01-17T08:00:00');
      const result = shouldResetStreak(lastWorkout, currentDate);
      expect(result).toBe(true);
    });

    it('should return true when gap is 3 days', () => {
      const lastWorkout = new Date('2024-01-15T10:00:00');
      const currentDate = new Date('2024-01-18T08:00:00');
      const result = shouldResetStreak(lastWorkout, currentDate);
      expect(result).toBe(true);
    });

    it('should return false when workout is on same day', () => {
      const lastWorkout = new Date('2024-01-15T10:00:00');
      const currentDate = new Date('2024-01-15T18:00:00');
      const result = shouldResetStreak(lastWorkout, currentDate);
      expect(result).toBe(false);
    });

    it('should handle edge case at 2 day boundary', () => {
      // Last workout: Jan 15
      // Current: Jan 17 (2 days later) → should reset
      const lastWorkout = new Date('2024-01-15T23:59:59');
      const currentDate = new Date('2024-01-17T00:00:01');
      const result = shouldResetStreak(lastWorkout, currentDate);
      expect(result).toBe(true);
    });
  });

  describe('getDaysSinceLastWorkout', () => {
    it('should return Infinity when lastWorkoutDate is null', () => {
      const result = getDaysSinceLastWorkout(null, new Date());
      expect(result).toBe(Infinity);
    });

    it('should return 0 when workout is on same day', () => {
      const lastWorkout = new Date('2024-01-15T10:00:00');
      const currentDate = new Date('2024-01-15T18:00:00');
      const result = getDaysSinceLastWorkout(lastWorkout, currentDate);
      expect(result).toBe(0);
    });

    it('should return 1 when workout was yesterday', () => {
      const lastWorkout = new Date('2024-01-15T10:00:00');
      const currentDate = new Date('2024-01-16T08:00:00');
      const result = getDaysSinceLastWorkout(lastWorkout, currentDate);
      expect(result).toBe(1);
    });

    it('should return correct number of days for larger gaps', () => {
      const lastWorkout = new Date('2024-01-15T10:00:00');
      const currentDate = new Date('2024-01-20T08:00:00');
      const result = getDaysSinceLastWorkout(lastWorkout, currentDate);
      expect(result).toBe(5);
    });

    it('should handle week gap', () => {
      const lastWorkout = new Date('2024-01-15T10:00:00');
      const currentDate = new Date('2024-01-22T08:00:00');
      const result = getDaysSinceLastWorkout(lastWorkout, currentDate);
      expect(result).toBe(7);
    });
  });
});
