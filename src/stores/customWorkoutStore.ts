// /workspaces/claude-workspace/fitnessapp/src/stores/customWorkoutStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CustomWorkout {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  lastUsedAt?: string;
  completionCount: number;
  totalMinutes: number;
}

interface CustomWorkoutState {
  customWorkouts: CustomWorkout[];
  totalWorkoutsCompleted: number;
  totalMinutesTracked: number;

  // Actions
  addCustomWorkout: (workout: { name: string; category: string }) => CustomWorkout;
  updateCustomWorkout: (id: string, updates: Partial<CustomWorkout>) => void;
  deleteCustomWorkout: (id: string) => void;
  markWorkoutCompleted: (id: string, minutes: number) => void;
  getWorkoutsByCategory: (category: string) => CustomWorkout[];
  getRecentWorkouts: (limit?: number) => CustomWorkout[];
}

export const useCustomWorkoutStore = create<CustomWorkoutState>()(
  persist(
    (set, get) => ({
      customWorkouts: [],
      totalWorkoutsCompleted: 0,
      totalMinutesTracked: 0,

      addCustomWorkout: (workout) => {
        const newWorkout: CustomWorkout = {
          id: Date.now().toString(),
          name: workout.name,
          category: workout.category,
          createdAt: new Date().toISOString(),
          completionCount: 0,
          totalMinutes: 0,
        };

        set((state) => ({
          customWorkouts: [newWorkout, ...state.customWorkouts],
        }));

        return newWorkout;
      },

      updateCustomWorkout: (id, updates) => {
        set((state) => ({
          customWorkouts: state.customWorkouts.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        }));
      },

      deleteCustomWorkout: (id) => {
        set((state) => ({
          customWorkouts: state.customWorkouts.filter((w) => w.id !== id),
        }));
      },

      markWorkoutCompleted: (id, minutes) => {
        set((state) => {
          const updatedWorkouts = state.customWorkouts.map((w) =>
            w.id === id
              ? {
                  ...w,
                  completionCount: w.completionCount + 1,
                  totalMinutes: w.totalMinutes + minutes,
                  lastUsedAt: new Date().toISOString(),
                }
              : w
          );

          return {
            customWorkouts: updatedWorkouts,
            totalWorkoutsCompleted: state.totalWorkoutsCompleted + 1,
            totalMinutesTracked: state.totalMinutesTracked + minutes,
          };
        });
      },

      getWorkoutsByCategory: (category) => {
        return get().customWorkouts.filter((w) => w.category === category);
      },

      getRecentWorkouts: (limit = 5) => {
        return [...get().customWorkouts]
          .sort((a, b) => {
            const dateA = a.lastUsedAt || a.createdAt;
            const dateB = b.lastUsedAt || b.createdAt;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          })
          .slice(0, limit);
      },
    }),
    {
      name: 'custom-workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
