// /workspaces/claude-workspace/fitnessapp/src/stores/runningStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IRunningWorkout, IRunningSegment } from '@/types';

// Flattened segment for tracking
export interface IFlatSegment extends IRunningSegment {
  phase: 'warmup' | 'main' | 'cooldown';
  segmentIndex: number;
}

export interface IRunningSession {
  id: string;
  workoutId: string;
  workoutName: string;
  workoutType: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  startedAt: Date;
  finishedAt?: Date;
  duration: number; // in seconds
  segments: IFlatSegment[];
  completedSegments: number;
  notes?: string;
}

interface RunningState {
  sessions: IRunningSession[];
  activeSession: IRunningSession | null;
  currentSegmentIndex: number;
  segmentElapsedTime: number; // seconds elapsed in current segment
  totalElapsedTime: number; // total seconds since start
  isRunning: boolean;
  isPaused: boolean;

  // Actions
  startSession: (workout: IRunningWorkout) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => IRunningSession | null;
  cancelSession: () => void;
  nextSegment: () => void;
  previousSegment: () => void;
  updateTime: (segmentSeconds: number, totalSeconds: number) => void;
  completeCurrentSegment: () => void;

  // Queries
  getSessionHistory: () => IRunningSession[];
  getSessionById: (id: string) => IRunningSession | undefined;
  getLastSessionDate: () => Date | null;
  getCurrentSegment: () => IFlatSegment | null;
  getNextSegment: () => IFlatSegment | null;
  getTotalSegments: () => number;
  getProgress: () => number;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

// Flatten workout segments for easier tracking
const flattenWorkoutSegments = (workout: IRunningWorkout): IFlatSegment[] => {
  const segments: IFlatSegment[] = [];
  let index = 0;

  // Warmup
  if (workout.warmup) {
    segments.push({
      ...workout.warmup,
      phase: 'warmup',
      segmentIndex: index++,
    });
  }

  // Main set - handle repetitions
  workout.mainSet.forEach((segment) => {
    const reps = segment.reps || 1;
    for (let i = 0; i < reps; i++) {
      segments.push({
        ...segment,
        phase: 'main',
        segmentIndex: index++,
        reps: 1, // Reset reps since we're flattening
      });
    }
  });

  // Cooldown
  if (workout.cooldown) {
    segments.push({
      ...workout.cooldown,
      phase: 'cooldown',
      segmentIndex: index++,
    });
  }

  return segments;
};

export const useRunningStore = create<RunningState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSession: null,
      currentSegmentIndex: 0,
      segmentElapsedTime: 0,
      totalElapsedTime: 0,
      isRunning: false,
      isPaused: false,

      startSession: (workout) => {
        const segments = flattenWorkoutSegments(workout);
        const newSession: IRunningSession = {
          id: generateId(),
          workoutId: workout.id,
          workoutName: workout.name,
          workoutType: workout.type,
          status: 'in_progress',
          startedAt: new Date(),
          duration: 0,
          segments,
          completedSegments: 0,
        };

        set({
          activeSession: newSession,
          currentSegmentIndex: 0,
          segmentElapsedTime: 0,
          totalElapsedTime: 0,
          isRunning: true,
          isPaused: false,
        });
      },

      pauseSession: () => {
        set({ isRunning: false, isPaused: true });
      },

      resumeSession: () => {
        set({ isRunning: true, isPaused: false });
      },

      endSession: () => {
        const { activeSession, sessions, totalElapsedTime, currentSegmentIndex } = get();
        if (!activeSession) return null;

        const finishedSession: IRunningSession = {
          ...activeSession,
          status: 'completed',
          finishedAt: new Date(),
          duration: totalElapsedTime,
          completedSegments: currentSegmentIndex + 1,
        };

        set({
          sessions: [...sessions, finishedSession],
          activeSession: null,
          currentSegmentIndex: 0,
          segmentElapsedTime: 0,
          totalElapsedTime: 0,
          isRunning: false,
          isPaused: false,
        });

        return finishedSession;
      },

      cancelSession: () => {
        set({
          activeSession: null,
          currentSegmentIndex: 0,
          segmentElapsedTime: 0,
          totalElapsedTime: 0,
          isRunning: false,
          isPaused: false,
        });
      },

      nextSegment: () => {
        const { activeSession, currentSegmentIndex } = get();
        if (!activeSession) return;

        const nextIndex = currentSegmentIndex + 1;
        if (nextIndex < activeSession.segments.length) {
          set({
            currentSegmentIndex: nextIndex,
            segmentElapsedTime: 0,
          });
        }
      },

      previousSegment: () => {
        const { currentSegmentIndex } = get();
        if (currentSegmentIndex > 0) {
          set({
            currentSegmentIndex: currentSegmentIndex - 1,
            segmentElapsedTime: 0,
          });
        }
      },

      updateTime: (segmentSeconds, totalSeconds) => {
        set({
          segmentElapsedTime: segmentSeconds,
          totalElapsedTime: totalSeconds,
        });
      },

      completeCurrentSegment: () => {
        const { activeSession, currentSegmentIndex } = get();
        if (!activeSession) return;

        const nextIndex = currentSegmentIndex + 1;
        if (nextIndex < activeSession.segments.length) {
          set({
            currentSegmentIndex: nextIndex,
            segmentElapsedTime: 0,
          });
        }
      },

      getSessionHistory: () => {
        return get().sessions.filter((s) => s.status === 'completed');
      },

      getSessionById: (id) => {
        return get().sessions.find((s) => s.id === id);
      },

      getLastSessionDate: () => {
        const completedSessions = get().sessions.filter((s) => s.status === 'completed');
        if (completedSessions.length === 0) return null;

        const sorted = completedSessions.sort((a, b) => {
          const dateA = a.finishedAt ? new Date(a.finishedAt).getTime() : 0;
          const dateB = b.finishedAt ? new Date(b.finishedAt).getTime() : 0;
          return dateB - dateA;
        });

        return sorted[0].finishedAt ? new Date(sorted[0].finishedAt) : null;
      },

      getCurrentSegment: () => {
        const { activeSession, currentSegmentIndex } = get();
        if (!activeSession || currentSegmentIndex >= activeSession.segments.length) {
          return null;
        }
        return activeSession.segments[currentSegmentIndex];
      },

      getNextSegment: () => {
        const { activeSession, currentSegmentIndex } = get();
        if (!activeSession) return null;
        const nextIndex = currentSegmentIndex + 1;
        if (nextIndex >= activeSession.segments.length) return null;
        return activeSession.segments[nextIndex];
      },

      getTotalSegments: () => {
        const { activeSession } = get();
        return activeSession?.segments.length || 0;
      },

      getProgress: () => {
        const { activeSession, currentSegmentIndex } = get();
        if (!activeSession || activeSession.segments.length === 0) return 0;
        return (currentSegmentIndex / activeSession.segments.length) * 100;
      },
    }),
    {
      name: 'running-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        sessions: state.sessions,
      }),
    }
  )
);
