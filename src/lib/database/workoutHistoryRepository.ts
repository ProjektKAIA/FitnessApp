// /workspaces/claude-workspace/fitnessapp/src/lib/database/workoutHistoryRepository.ts

import { getDatabase } from './index';
import { logger } from '@/lib/logger';

const log = logger.scope('WorkoutHistoryRepository');

export interface DbWorkoutHistory {
  id: string;
  name: string;
  direction: string;
  duration: number | null;
  total_volume: number;
  exercise_count: number;
  started_at: number | null;
  finished_at: number | null;
  data_json: string | null;
}

/**
 * Get recent workouts
 */
export const getRecentWorkouts = async (limit: number = 20): Promise<DbWorkoutHistory[]> => {
  const db = getDatabase();

  try {
    const results = await db.getAllAsync<DbWorkoutHistory>(
      `SELECT * FROM workout_history
       WHERE finished_at IS NOT NULL
       ORDER BY finished_at DESC
       LIMIT ?`,
      limit
    );
    return results;
  } catch (error) {
    log.error('Error getting recent workouts', error);
    return [];
  }
};

/**
 * Get workouts by date range
 */
export const getWorkoutsByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<DbWorkoutHistory[]> => {
  const db = getDatabase();
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();

  try {
    const results = await db.getAllAsync<DbWorkoutHistory>(
      `SELECT * FROM workout_history
       WHERE finished_at >= ? AND finished_at <= ?
       ORDER BY finished_at DESC`,
      startTimestamp,
      endTimestamp
    );
    return results;
  } catch (error) {
    log.error('Error getting workouts by date range', error);
    return [];
  }
};

/**
 * Get workouts by direction (type)
 */
export const getWorkoutsByDirection = async (
  direction: string,
  limit: number = 50
): Promise<DbWorkoutHistory[]> => {
  const db = getDatabase();

  try {
    const results = await db.getAllAsync<DbWorkoutHistory>(
      `SELECT * FROM workout_history
       WHERE direction = ? AND finished_at IS NOT NULL
       ORDER BY finished_at DESC
       LIMIT ?`,
      direction,
      limit
    );
    return results;
  } catch (error) {
    log.error('Error getting workouts by direction', error);
    return [];
  }
};

/**
 * Get workout by ID
 */
export const getWorkoutById = async (id: string): Promise<DbWorkoutHistory | null> => {
  const db = getDatabase();

  try {
    const result = await db.getFirstAsync<DbWorkoutHistory>(
      'SELECT * FROM workout_history WHERE id = ?',
      id
    );
    return result ?? null;
  } catch (error) {
    log.error('Error getting workout by id', error);
    return null;
  }
};

/**
 * Insert a workout
 */
export const insertWorkout = async (workout: DbWorkoutHistory): Promise<void> => {
  const db = getDatabase();

  try {
    await db.runAsync(
      `INSERT INTO workout_history (id, name, direction, duration, total_volume, exercise_count, started_at, finished_at, data_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      workout.id,
      workout.name,
      workout.direction,
      workout.duration,
      workout.total_volume,
      workout.exercise_count,
      workout.started_at,
      workout.finished_at,
      workout.data_json
    );
  } catch (error) {
    log.error('Error inserting workout', error);
    throw error;
  }
};

/**
 * Get workout statistics
 */
export const getWorkoutStats = async (): Promise<{
  totalWorkouts: number;
  totalVolume: number;
  totalDuration: number;
  byDirection: Record<string, number>;
}> => {
  const db = getDatabase();

  try {
    const totals = await db.getFirstAsync<{
      total_workouts: number;
      total_volume: number;
      total_duration: number;
    }>(`
      SELECT
        COUNT(*) as total_workouts,
        COALESCE(SUM(total_volume), 0) as total_volume,
        COALESCE(SUM(duration), 0) as total_duration
      FROM workout_history
      WHERE finished_at IS NOT NULL
    `);

    const byDirectionResults = await db.getAllAsync<{ direction: string; count: number }>(`
      SELECT direction, COUNT(*) as count
      FROM workout_history
      WHERE finished_at IS NOT NULL
      GROUP BY direction
    `);

    const byDirection: Record<string, number> = {};
    for (const row of byDirectionResults) {
      byDirection[row.direction] = row.count;
    }

    return {
      totalWorkouts: totals?.total_workouts ?? 0,
      totalVolume: totals?.total_volume ?? 0,
      totalDuration: totals?.total_duration ?? 0,
      byDirection,
    };
  } catch (error) {
    log.error('Error getting workout stats', error);
    return { totalWorkouts: 0, totalVolume: 0, totalDuration: 0, byDirection: {} };
  }
};

/**
 * Get workouts this week
 */
export const getWorkoutsThisWeek = async (): Promise<DbWorkoutHistory[]> => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  return getWorkoutsByDateRange(startOfWeek, now);
};

/**
 * Get workouts this month
 */
export const getWorkoutsThisMonth = async (): Promise<DbWorkoutHistory[]> => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return getWorkoutsByDateRange(startOfMonth, now);
};

/**
 * Delete a workout
 */
export const deleteWorkout = async (id: string): Promise<void> => {
  const db = getDatabase();

  try {
    await db.runAsync('DELETE FROM workout_history WHERE id = ?', id);
    log.info('Workout deleted', { id });
  } catch (error) {
    log.error('Error deleting workout', error);
    throw error;
  }
};
