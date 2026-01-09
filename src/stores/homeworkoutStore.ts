// /workspaces/claude-workspace/fitnessapp/src/stores/homeworkoutStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface IHomeworkoutCompletion {
  id: string;
  videoId: string;
  completedAt: string;
  durationMinutes: number;
  caloriesBurned?: number;
}

interface HomeworkoutState {
  // Completed workouts
  completions: IHomeworkoutCompletion[];
  // Favorite video IDs
  favorites: string[];
  // Total stats
  totalCompletions: number;
  totalMinutes: number;
  totalCalories: number;
}

interface HomeworkoutActions {
  // Mark video as completed
  markVideoCompleted: (videoId: string, durationMinutes: number, caloriesBurned?: number) => void;
  // Toggle favorite
  toggleFavorite: (videoId: string) => void;
  // Check if video is favorite
  isFavorite: (videoId: string) => boolean;
  // Get completion count for a video
  getCompletionCount: (videoId: string) => number;
  // Get last completion date for a video
  getLastCompletion: (videoId: string) => string | null;
  // Get recent completions
  getRecentCompletions: (limit?: number) => IHomeworkoutCompletion[];
  // Reset store
  reset: () => void;
}

const initialState: HomeworkoutState = {
  completions: [],
  favorites: [],
  totalCompletions: 0,
  totalMinutes: 0,
  totalCalories: 0,
};

export const useHomeworkoutStore = create<HomeworkoutState & HomeworkoutActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      markVideoCompleted: (videoId, durationMinutes, caloriesBurned) => {
        const completion: IHomeworkoutCompletion = {
          id: `completion-${Date.now()}`,
          videoId,
          completedAt: new Date().toISOString(),
          durationMinutes,
          caloriesBurned,
        };

        set((state) => ({
          completions: [completion, ...state.completions],
          totalCompletions: state.totalCompletions + 1,
          totalMinutes: state.totalMinutes + durationMinutes,
          totalCalories: state.totalCalories + (caloriesBurned || 0),
        }));
      },

      toggleFavorite: (videoId) => {
        set((state) => {
          const isFav = state.favorites.includes(videoId);
          return {
            favorites: isFav
              ? state.favorites.filter((id) => id !== videoId)
              : [...state.favorites, videoId],
          };
        });
      },

      isFavorite: (videoId) => {
        return get().favorites.includes(videoId);
      },

      getCompletionCount: (videoId) => {
        return get().completions.filter((c) => c.videoId === videoId).length;
      },

      getLastCompletion: (videoId) => {
        const completion = get().completions.find((c) => c.videoId === videoId);
        return completion ? completion.completedAt : null;
      },

      getRecentCompletions: (limit = 5) => {
        return get().completions.slice(0, limit);
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'homeworkout-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
