// /workspaces/claude-workspace/fitnessapp/src/services/workout/index.ts

// Calorie calculation
export {
  calculateWorkoutCalories,
  getMETValue,
  MET_VALUES,
} from './calorieService';

// Streak management
export {
  isNewWorkoutDay,
  shouldResetStreak,
  getDaysSinceLastWorkout,
} from './streakService';

// Stats updates
export {
  updateCalorieTracking,
  updateStreak,
  updateWorkoutCounts,
  updateAllStats,
  type IStatsUpdateResult,
} from './statsUpdateService';

// Health export
export {
  isHealthExportEnabled,
  exportWorkoutToHealth,
  exportRunningToHealth,
  exportYogaToHealth,
} from './healthExportService';

// Completion handlers (orchestrators)
export {
  handleWorkoutCompletion,
  handleRunningCompletion,
  handleYogaCompletion,
  type ICompletionResult,
} from './completionService';
