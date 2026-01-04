import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IWorkout, IExercise, ISet, TWorkoutStatus } from '@/types';

interface WorkoutState {
  workouts: IWorkout[];
  activeWorkout: IWorkout | null;
  currentExerciseIndex: number;
  restTimerActive: boolean;
  restTimeRemaining: number;

  startWorkout: (workout: Omit<IWorkout, 'id' | 'startedAt' | 'status'>) => void;
  endWorkout: () => void;
  cancelWorkout: () => void;

  addExercise: (exercise: Omit<IExercise, 'id'>) => void;
  removeExercise: (exerciseId: string) => void;
  updateExercise: (exerciseId: string, updates: Partial<IExercise>) => void;

  addSet: (exerciseId: string, set: Omit<ISet, 'id'>) => void;
  updateSet: (exerciseId: string, setId: string, updates: Partial<ISet>) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  completeSet: (exerciseId: string, setId: string) => void;

  setCurrentExerciseIndex: (index: number) => void;
  startRestTimer: (seconds: number) => void;
  stopRestTimer: () => void;
  updateRestTimer: (seconds: number) => void;

  getWorkoutHistory: () => IWorkout[];
  getWorkoutById: (id: string) => IWorkout | undefined;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      workouts: [],
      activeWorkout: null,
      currentExerciseIndex: 0,
      restTimerActive: false,
      restTimeRemaining: 0,

      startWorkout: (workout) => {
        const newWorkout: IWorkout = {
          ...workout,
          id: generateId(),
          status: 'in_progress',
          startedAt: new Date(),
          duration: 0,
          totalVolume: 0,
        };
        set({ activeWorkout: newWorkout, currentExerciseIndex: 0 });
      },

      endWorkout: () => {
        const { activeWorkout, workouts } = get();
        if (!activeWorkout) return;

        const totalVolume = activeWorkout.exercises.reduce((total, exercise) => {
          return (
            total +
            exercise.sets
              .filter((s) => s.completed)
              .reduce((setTotal, s) => setTotal + s.weight * s.reps, 0)
          );
        }, 0);

        const finishedWorkout: IWorkout = {
          ...activeWorkout,
          status: 'completed',
          finishedAt: new Date(),
          duration: activeWorkout.startedAt
            ? Math.floor((Date.now() - new Date(activeWorkout.startedAt).getTime()) / 1000 / 60)
            : 0,
          totalVolume,
        };

        set({
          workouts: [...workouts, finishedWorkout],
          activeWorkout: null,
          currentExerciseIndex: 0,
          restTimerActive: false,
          restTimeRemaining: 0,
        });
      },

      cancelWorkout: () => {
        set({
          activeWorkout: null,
          currentExerciseIndex: 0,
          restTimerActive: false,
          restTimeRemaining: 0,
        });
      },

      addExercise: (exercise) => {
        const { activeWorkout } = get();
        if (!activeWorkout) return;

        const newExercise: IExercise = {
          ...exercise,
          id: generateId(),
        };

        set({
          activeWorkout: {
            ...activeWorkout,
            exercises: [...activeWorkout.exercises, newExercise],
          },
        });
      },

      removeExercise: (exerciseId) => {
        const { activeWorkout } = get();
        if (!activeWorkout) return;

        set({
          activeWorkout: {
            ...activeWorkout,
            exercises: activeWorkout.exercises.filter((e) => e.id !== exerciseId),
          },
        });
      },

      updateExercise: (exerciseId, updates) => {
        const { activeWorkout } = get();
        if (!activeWorkout) return;

        set({
          activeWorkout: {
            ...activeWorkout,
            exercises: activeWorkout.exercises.map((e) =>
              e.id === exerciseId ? { ...e, ...updates } : e
            ),
          },
        });
      },

      addSet: (exerciseId, setData) => {
        const { activeWorkout } = get();
        if (!activeWorkout) return;

        const newSet: ISet = {
          ...setData,
          id: generateId(),
        };

        set({
          activeWorkout: {
            ...activeWorkout,
            exercises: activeWorkout.exercises.map((e) =>
              e.id === exerciseId ? { ...e, sets: [...e.sets, newSet] } : e
            ),
          },
        });
      },

      updateSet: (exerciseId, setId, updates) => {
        const { activeWorkout } = get();
        if (!activeWorkout) return;

        set({
          activeWorkout: {
            ...activeWorkout,
            exercises: activeWorkout.exercises.map((e) =>
              e.id === exerciseId
                ? {
                    ...e,
                    sets: e.sets.map((s) => (s.id === setId ? { ...s, ...updates } : s)),
                  }
                : e
            ),
          },
        });
      },

      removeSet: (exerciseId, setId) => {
        const { activeWorkout } = get();
        if (!activeWorkout) return;

        set({
          activeWorkout: {
            ...activeWorkout,
            exercises: activeWorkout.exercises.map((e) =>
              e.id === exerciseId
                ? { ...e, sets: e.sets.filter((s) => s.id !== setId) }
                : e
            ),
          },
        });
      },

      completeSet: (exerciseId, setId) => {
        const { activeWorkout } = get();
        if (!activeWorkout) return;

        set({
          activeWorkout: {
            ...activeWorkout,
            exercises: activeWorkout.exercises.map((e) =>
              e.id === exerciseId
                ? {
                    ...e,
                    sets: e.sets.map((s) =>
                      s.id === setId ? { ...s, completed: true } : s
                    ),
                  }
                : e
            ),
          },
        });
      },

      setCurrentExerciseIndex: (index) => {
        set({ currentExerciseIndex: index });
      },

      startRestTimer: (seconds) => {
        set({ restTimerActive: true, restTimeRemaining: seconds });
      },

      stopRestTimer: () => {
        set({ restTimerActive: false, restTimeRemaining: 0 });
      },

      updateRestTimer: (seconds) => {
        set({ restTimeRemaining: seconds });
      },

      getWorkoutHistory: () => {
        return get().workouts.filter((w) => w.status === 'completed');
      },

      getWorkoutById: (id) => {
        return get().workouts.find((w) => w.id === id);
      },
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        workouts: state.workouts,
      }),
    }
  )
);
