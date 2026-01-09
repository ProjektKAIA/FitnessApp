// /workspaces/claude-workspace/fitnessapp/src/services/backup/backupService.ts

import { Platform } from 'react-native';
import { Paths, File } from 'expo-file-system';
import {
  useWorkoutStore,
  useTrainingPlanStore,
  useStatsStore,
  useUserStore,
  useUserGoalsStore,
  useAICoachStore,
  useLanguageStore,
} from '@/stores';
import { useHealthStore } from '@/stores/healthStore';
import { logger } from '@/lib/logger';

const log = logger.scope('BackupService');

export interface BackupData {
  version: string;
  createdAt: string;
  platform: string;
  data: {
    workouts: unknown;
    activeWorkout: unknown;
    trainingPlans: unknown;
    activePlanId: string | null;
    stats: unknown;
    user: unknown;
    userGoals: unknown;
    aiCoach: unknown;
    health: unknown;
    language: string;
  };
}

export interface BackupMetadata {
  fileName: string;
  filePath: string;
  createdAt: Date;
  size: number;
  version: string;
}

const BACKUP_VERSION = '1.0.0';

/**
 * Sammelt alle relevanten Store-Daten für das Backup
 */
export const collectBackupData = (): BackupData => {
  // Workouts
  const workoutState = useWorkoutStore.getState();
  const workouts = workoutState.workouts;
  const activeWorkout = workoutState.activeWorkout;

  // Training Plans
  const planState = useTrainingPlanStore.getState();
  const trainingPlans = planState.plans;
  const activePlanId = planState.activePlanId;

  // Stats
  const statsState = useStatsStore.getState();
  const stats = statsState.stats;

  // User Profile
  const userState = useUserStore.getState();
  const user = userState.user;

  // User Goals
  const goalsState = useUserGoalsStore.getState();
  const userGoals = {
    dailyCalorieGoal: goalsState.dailyCalorieGoal,
    calorieTarget: goalsState.calorieTarget,
    targetAmount: goalsState.targetAmount,
    goals: goalsState.goals,
    calorieEntries: goalsState.calorieEntries,
    healthEntries: goalsState.healthEntries,
    tdeeData: goalsState.tdeeData,
  };

  // AI Coach
  const aiState = useAICoachStore.getState();
  const aiCoach = {
    importedChats: aiState.importedChats,
    activeChatId: aiState.activeChat?.id || null,
  };

  // Health Settings
  const healthState = useHealthStore.getState();
  const health = {
    settings: healthState.settings,
  };

  // Language
  const langState = useLanguageStore.getState();
  const language = langState.language;

  return {
    version: BACKUP_VERSION,
    createdAt: new Date().toISOString(),
    platform: Platform.OS,
    data: {
      workouts,
      activeWorkout,
      trainingPlans,
      activePlanId,
      stats,
      user,
      userGoals,
      aiCoach,
      health,
      language,
    },
  };
};

/**
 * Erstellt eine Backup-Datei im lokalen Cache
 */
export const createBackupFile = async (): Promise<BackupMetadata> => {
  const backupData = collectBackupData();
  const jsonString = JSON.stringify(backupData, null, 2);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const fileName = `shapyfit_backup_${timestamp}.json`;

  const file = new File(Paths.cache, fileName);
  await file.write(jsonString);

  return {
    fileName,
    filePath: file.uri,
    createdAt: new Date(),
    size: jsonString.length,
    version: BACKUP_VERSION,
  };
};

/**
 * Liest eine Backup-Datei und validiert sie
 */
export const readBackupFile = async (filePath: string): Promise<BackupData | null> => {
  try {
    const file = new File(filePath);
    const fileExists = await file.exists;

    if (!fileExists) {
      log.error('File does not exist', undefined, { filePath });
      return null;
    }

    const content = await file.text();
    const backupData = JSON.parse(content) as BackupData;

    // Validate backup structure
    if (!backupData.version || !backupData.data) {
      log.error('Invalid backup structure');
      return null;
    }

    return backupData;
  } catch (error) {
    log.error('Error reading backup', error);
    return null;
  }
};

/**
 * Stellt ein Backup wieder her
 */
export const restoreBackup = async (
  backupData: BackupData,
  options: {
    restoreWorkouts?: boolean;
    restorePlans?: boolean;
    restoreStats?: boolean;
    restoreProfile?: boolean;
    restoreGoals?: boolean;
    restoreAIChats?: boolean;
    mergeMode?: 'replace' | 'merge';
  } = {}
): Promise<{ success: boolean; error?: string }> => {
  const {
    restoreWorkouts = true,
    restorePlans = true,
    restoreStats = true,
    restoreProfile = true,
    restoreGoals = true,
    restoreAIChats = true,
    mergeMode = 'replace',
  } = options;

  try {
    const { data } = backupData;

    // Restore Workouts
    if (restoreWorkouts && data.workouts) {
      const workoutStore = useWorkoutStore.getState();
      if (mergeMode === 'replace') {
        workoutStore.setWorkouts(data.workouts as never[]);
      } else {
        // Merge: Add only workouts that don't exist
        const existingIds = new Set(workoutStore.workouts.map((w) => w.id));
        const newWorkouts = (data.workouts as never[]).filter(
          (w: { id: string }) => !existingIds.has(w.id)
        );
        workoutStore.setWorkouts([...workoutStore.workouts, ...newWorkouts]);
      }
    }

    // Restore Training Plans
    if (restorePlans && data.trainingPlans) {
      const planStore = useTrainingPlanStore.getState();
      if (mergeMode === 'replace') {
        // Clear existing plans
        const existingPlanIds = [...planStore.plans.map((p) => p.id)];
        existingPlanIds.forEach((id) => planStore.deletePlan(id));
        // Import each plan using importPlanFromAI
        (data.trainingPlans as Array<Record<string, unknown>>).forEach((plan) => {
          planStore.importPlanFromAI(plan as never);
        });
        if (data.activePlanId) {
          planStore.setActivePlan(data.activePlanId);
        }
      }
    }

    // Restore Stats - use updateStats
    if (restoreStats && data.stats) {
      const statsStore = useStatsStore.getState();
      statsStore.updateStats(data.stats as never);
    }

    // Restore Profile
    if (restoreProfile && data.user) {
      const userStore = useUserStore.getState();
      userStore.setUser(data.user as never);
    }

    // Restore Goals
    if (restoreGoals && data.userGoals) {
      const goalsStore = useUserGoalsStore.getState();
      const goals = data.userGoals as {
        dailyCalorieGoal?: number;
        calorieTarget?: 'maintain' | 'deficit' | 'surplus';
        targetAmount?: number;
      };

      if (goals.dailyCalorieGoal) {
        goalsStore.setDailyCalorieGoal(goals.dailyCalorieGoal);
      }
      if (goals.calorieTarget) {
        goalsStore.setCalorieTarget(goals.calorieTarget, goals.targetAmount || 0);
      }
    }

    // Restore AI Chats
    if (restoreAIChats && data.aiCoach) {
      const aiStore = useAICoachStore.getState();
      const aiData = data.aiCoach as {
        importedChats?: never[];
        activeChatId?: string;
      };

      if (aiData.importedChats && mergeMode === 'replace') {
        // Clear existing and restore
        aiStore.importedChats.forEach((chat) => aiStore.removeChat(chat.id));
        aiData.importedChats.forEach((chat: never) => {
          aiStore.addImportedChat(chat);
        });
      }
    }

    // Restore Language
    if (data.language) {
      const langStore = useLanguageStore.getState();
      langStore.setLanguage(data.language as 'de' | 'en');
    }

    return { success: true };
  } catch (error) {
    log.error('Restore error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Berechnet die Größe der aktuellen Daten
 */
export const calculateDataSize = (): number => {
  const backupData = collectBackupData();
  const jsonString = JSON.stringify(backupData);
  return jsonString.length;
};

/**
 * Formatiert Bytes in lesbare Größe
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
