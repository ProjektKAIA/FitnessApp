// /workspaces/claude-workspace/fitnessapp/src/lib/database/re-exports.ts

// Re-export all database modules
export {
  initDatabase,
  getDatabase,
  closeDatabase,
  isDatabaseInitialized,
} from './index';

export { runMigrations, getCurrentVersion } from './migrations';

export {
  searchExercises,
  getAllExercises,
  getExercisesByMuscleGroup,
  getExerciseById,
  upsertExercise,
  bulkInsertExercises,
  getExerciseCount,
  type DbExercise,
} from './exerciseRepository';

export {
  getRecentWorkouts,
  getWorkoutsByDateRange,
  getWorkoutsByDirection,
  getWorkoutById,
  insertWorkout,
  getWorkoutStats,
  getWorkoutsThisWeek,
  getWorkoutsThisMonth,
  deleteWorkout,
  type DbWorkoutHistory,
} from './workoutHistoryRepository';
