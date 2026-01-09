// /workspaces/claude-workspace/fitnessapp/src/services/workoutCompletionService.ts
//
// DEPRECATED: This file is kept for backwards compatibility.
// Import from '@/services/workout' instead.
//
// New structure:
// - calorieService.ts: MET values and calorie calculation
// - streakService.ts: Streak logic (isNewWorkoutDay, shouldResetStreak)
// - statsUpdateService.ts: Stats and calorie tracking updates
// - healthExportService.ts: Apple Health / Health Connect export
// - completionService.ts: Orchestrator for all completion tasks

export {
  // Calorie calculation
  calculateWorkoutCalories,
  MET_VALUES,
  // Completion handlers
  handleWorkoutCompletion,
  handleRunningCompletion,
  handleYogaCompletion,
  // Types
  type ICompletionResult,
} from './workout';
