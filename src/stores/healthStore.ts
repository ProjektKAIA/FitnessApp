import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  IHealthSettings,
  IDailyHealthSummary,
  IHealthTrend,
  ITrainingLoadData,
  THealthDataType,
  THealthPlatform,
  DEFAULT_HEALTH_SETTINGS,
} from '@/types/health';

interface HealthState {
  // Settings
  settings: IHealthSettings;

  // Data
  todaySummary: IDailyHealthSummary | null;
  weekSummaries: IDailyHealthSummary[];
  monthSummaries: IDailyHealthSummary[];
  trends: IHealthTrend[];
  trainingLoad: ITrainingLoadData | null;

  // Status
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;

  // Actions - Settings
  setEnabled: (enabled: boolean) => void;
  setPlatform: (platform: THealthPlatform) => void;
  setPermissionsGranted: (granted: boolean) => void;
  toggleDataType: (dataType: keyof IHealthSettings['dataTypes']) => void;
  setStepsGoal: (goal: number) => void;
  updateSettings: (settings: Partial<IHealthSettings>) => void;

  // Actions - Data
  setTodaySummary: (summary: IDailyHealthSummary | null) => void;
  setWeekSummaries: (summaries: IDailyHealthSummary[]) => void;
  setMonthSummaries: (summaries: IDailyHealthSummary[]) => void;
  setTrends: (trends: IHealthTrend[]) => void;
  setTrainingLoad: (load: ITrainingLoadData | null) => void;

  // Actions - Status
  setLoading: (loading: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setError: (error: string | null) => void;
  updateLastSync: () => void;

  // Actions - Reset
  resetHealthData: () => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      // Initial State - Settings
      settings: DEFAULT_HEALTH_SETTINGS,

      // Initial State - Data
      todaySummary: null,
      weekSummaries: [],
      monthSummaries: [],
      trends: [],
      trainingLoad: null,

      // Initial State - Status
      isLoading: false,
      isSyncing: false,
      error: null,

      // Settings Actions
      setEnabled: (enabled) =>
        set((state) => ({
          settings: { ...state.settings, enabled },
        })),

      setPlatform: (platform) =>
        set((state) => ({
          settings: { ...state.settings, platform },
        })),

      setPermissionsGranted: (granted) =>
        set((state) => ({
          settings: { ...state.settings, permissionsGranted: granted },
        })),

      toggleDataType: (dataType) =>
        set((state) => ({
          settings: {
            ...state.settings,
            dataTypes: {
              ...state.settings.dataTypes,
              [dataType]: !state.settings.dataTypes[dataType],
            },
          },
        })),

      setStepsGoal: (goal) =>
        set((state) => ({
          settings: { ...state.settings, stepsGoal: goal },
        })),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // Data Actions
      setTodaySummary: (summary) => set({ todaySummary: summary }),

      setWeekSummaries: (summaries) => set({ weekSummaries: summaries }),

      setMonthSummaries: (summaries) => set({ monthSummaries: summaries }),

      setTrends: (trends) => set({ trends }),

      setTrainingLoad: (load) => set({ trainingLoad: load }),

      // Status Actions
      setLoading: (loading) => set({ isLoading: loading }),

      setSyncing: (syncing) => set({ isSyncing: syncing }),

      setError: (error) => set({ error }),

      updateLastSync: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            lastSyncAt: new Date().toISOString(),
          },
        })),

      // Reset Action
      resetHealthData: () =>
        set({
          settings: DEFAULT_HEALTH_SETTINGS,
          todaySummary: null,
          weekSummaries: [],
          monthSummaries: [],
          trends: [],
          trainingLoad: null,
          error: null,
        }),
    }),
    {
      name: 'health-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        settings: state.settings,
        todaySummary: state.todaySummary,
        weekSummaries: state.weekSummaries,
        trainingLoad: state.trainingLoad,
      }),
    }
  )
);

// Selectors
export const selectIsHealthEnabled = (state: HealthState) => state.settings.enabled;
export const selectHealthPlatform = (state: HealthState) => state.settings.platform;
export const selectTodaySteps = (state: HealthState) => state.todaySummary?.steps?.count ?? 0;
export const selectStepsGoal = (state: HealthState) => state.settings.stepsGoal;
export const selectStepsProgress = (state: HealthState) => {
  const steps = state.todaySummary?.steps?.count ?? 0;
  const goal = state.settings.stepsGoal;
  return goal > 0 ? Math.min(steps / goal, 1) : 0;
};
