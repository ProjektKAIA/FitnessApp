import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IStats, IPersonalRecord, IWeeklyProgress, IBodyStats } from '@/types';

interface StatsState {
  stats: IStats;
  weeklyProgress: IWeeklyProgress[];
  bodyStats: IBodyStats[];

  updateStats: (stats: Partial<IStats>) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  addPersonalRecord: (pr: IPersonalRecord) => void;
  addWeeklyProgress: (progress: IWeeklyProgress) => void;
  addBodyStats: (stats: Omit<IBodyStats, 'id'>) => void;
  updateBodyStats: (id: string, updates: Partial<IBodyStats>) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const defaultStats: IStats = {
  totalWorkouts: 0,
  totalVolume: 0,
  currentStreak: 0,
  longestStreak: 0,
  thisWeekWorkouts: 0,
  thisMonthWorkouts: 0,
  personalRecords: [],
};

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      stats: defaultStats,
      weeklyProgress: [],
      bodyStats: [],

      updateStats: (newStats) =>
        set((state) => ({
          stats: { ...state.stats, ...newStats },
        })),

      incrementStreak: () =>
        set((state) => {
          const newStreak = state.stats.currentStreak + 1;
          return {
            stats: {
              ...state.stats,
              currentStreak: newStreak,
              longestStreak: Math.max(newStreak, state.stats.longestStreak),
            },
          };
        }),

      resetStreak: () =>
        set((state) => ({
          stats: { ...state.stats, currentStreak: 0 },
        })),

      addPersonalRecord: (pr) =>
        set((state) => {
          const existingIndex = state.stats.personalRecords.findIndex(
            (r) => r.exerciseId === pr.exerciseId
          );

          let newRecords: IPersonalRecord[];
          if (existingIndex >= 0) {
            const existing = state.stats.personalRecords[existingIndex];
            if (pr.weight > existing.weight) {
              newRecords = [...state.stats.personalRecords];
              newRecords[existingIndex] = pr;
            } else {
              newRecords = state.stats.personalRecords;
            }
          } else {
            newRecords = [...state.stats.personalRecords, pr];
          }

          return {
            stats: { ...state.stats, personalRecords: newRecords },
          };
        }),

      addWeeklyProgress: (progress) =>
        set((state) => ({
          weeklyProgress: [...state.weeklyProgress, progress],
        })),

      addBodyStats: (stats) =>
        set((state) => ({
          bodyStats: [...state.bodyStats, { ...stats, id: generateId() }],
        })),

      updateBodyStats: (id, updates) =>
        set((state) => ({
          bodyStats: state.bodyStats.map((bs) =>
            bs.id === id ? { ...bs, ...updates } : bs
          ),
        })),
    }),
    {
      name: 'stats-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
