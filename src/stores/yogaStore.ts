// /workspaces/claude-workspace/fitnessapp/src/stores/yogaStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IYogaSession, IYogaSessionPose, TYogaStyle } from '@/types';

export interface IYogaActivePose {
  poseId: string;
  duration: number;
  side?: 'left' | 'right' | 'both';
  notes?: string;
  index: number;
}

export interface IYogaSessionRecord {
  id: string;
  sessionId: string;
  sessionName: string;
  style: TYogaStyle;
  status: 'in_progress' | 'completed' | 'cancelled';
  startedAt: Date;
  finishedAt?: Date;
  duration: number; // in seconds
  totalPoses: number;
  completedPoses: number;
  notes?: string;
}

interface YogaState {
  sessions: IYogaSessionRecord[];
  activeSession: IYogaSessionRecord | null;
  activePoses: IYogaActivePose[];
  currentPoseIndex: number;
  poseElapsedTime: number; // seconds elapsed in current pose
  totalElapsedTime: number; // total seconds since start
  isRunning: boolean;
  isPaused: boolean;

  // Actions
  startSession: (session: IYogaSession) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => IYogaSessionRecord | null;
  cancelSession: () => void;
  nextPose: () => void;
  previousPose: () => void;
  updateTime: (poseSeconds: number, totalSeconds: number) => void;
  completeCurrentPose: () => void;

  // Queries
  getSessionHistory: () => IYogaSessionRecord[];
  getSessionById: (id: string) => IYogaSessionRecord | undefined;
  getLastSessionDate: () => Date | null;
  getCurrentPose: () => IYogaActivePose | null;
  getNextPose: () => IYogaActivePose | null;
  getTotalPoses: () => number;
  getProgress: () => number;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

// Flatten session poses for easier tracking (handle 'both' sides)
const flattenSessionPoses = (poses: IYogaSessionPose[]): IYogaActivePose[] => {
  const flatPoses: IYogaActivePose[] = [];
  let index = 0;

  poses.forEach((pose) => {
    if (pose.side === 'both') {
      // Add left side
      flatPoses.push({
        poseId: pose.poseId,
        duration: pose.duration,
        side: 'left',
        notes: pose.notes,
        index: index++,
      });
      // Add right side
      flatPoses.push({
        poseId: pose.poseId,
        duration: pose.duration,
        side: 'right',
        notes: pose.notes,
        index: index++,
      });
    } else {
      flatPoses.push({
        poseId: pose.poseId,
        duration: pose.duration,
        side: pose.side,
        notes: pose.notes,
        index: index++,
      });
    }
  });

  return flatPoses;
};

export const useYogaStore = create<YogaState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSession: null,
      activePoses: [],
      currentPoseIndex: 0,
      poseElapsedTime: 0,
      totalElapsedTime: 0,
      isRunning: false,
      isPaused: false,

      startSession: (session) => {
        const flatPoses = flattenSessionPoses(session.poses);
        const newSession: IYogaSessionRecord = {
          id: generateId(),
          sessionId: session.id,
          sessionName: session.name,
          style: session.style,
          status: 'in_progress',
          startedAt: new Date(),
          duration: 0,
          totalPoses: flatPoses.length,
          completedPoses: 0,
        };

        set({
          activeSession: newSession,
          activePoses: flatPoses,
          currentPoseIndex: 0,
          poseElapsedTime: 0,
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
        const { activeSession, sessions, totalElapsedTime, currentPoseIndex } = get();
        if (!activeSession) return null;

        const finishedSession: IYogaSessionRecord = {
          ...activeSession,
          status: 'completed',
          finishedAt: new Date(),
          duration: totalElapsedTime,
          completedPoses: currentPoseIndex + 1,
        };

        set({
          sessions: [...sessions, finishedSession],
          activeSession: null,
          activePoses: [],
          currentPoseIndex: 0,
          poseElapsedTime: 0,
          totalElapsedTime: 0,
          isRunning: false,
          isPaused: false,
        });

        return finishedSession;
      },

      cancelSession: () => {
        set({
          activeSession: null,
          activePoses: [],
          currentPoseIndex: 0,
          poseElapsedTime: 0,
          totalElapsedTime: 0,
          isRunning: false,
          isPaused: false,
        });
      },

      nextPose: () => {
        const { activePoses, currentPoseIndex } = get();
        const nextIndex = currentPoseIndex + 1;
        if (nextIndex < activePoses.length) {
          set({
            currentPoseIndex: nextIndex,
            poseElapsedTime: 0,
          });
        }
      },

      previousPose: () => {
        const { currentPoseIndex } = get();
        if (currentPoseIndex > 0) {
          set({
            currentPoseIndex: currentPoseIndex - 1,
            poseElapsedTime: 0,
          });
        }
      },

      updateTime: (poseSeconds, totalSeconds) => {
        set({
          poseElapsedTime: poseSeconds,
          totalElapsedTime: totalSeconds,
        });
      },

      completeCurrentPose: () => {
        const { activePoses, currentPoseIndex } = get();
        const nextIndex = currentPoseIndex + 1;
        if (nextIndex < activePoses.length) {
          set({
            currentPoseIndex: nextIndex,
            poseElapsedTime: 0,
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

      getCurrentPose: () => {
        const { activePoses, currentPoseIndex } = get();
        if (currentPoseIndex >= activePoses.length) return null;
        return activePoses[currentPoseIndex];
      },

      getNextPose: () => {
        const { activePoses, currentPoseIndex } = get();
        const nextIndex = currentPoseIndex + 1;
        if (nextIndex >= activePoses.length) return null;
        return activePoses[nextIndex];
      },

      getTotalPoses: () => {
        return get().activePoses.length;
      },

      getProgress: () => {
        const { activePoses, currentPoseIndex } = get();
        if (activePoses.length === 0) return 0;
        return (currentPoseIndex / activePoses.length) * 100;
      },
    }),
    {
      name: 'yoga-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        sessions: state.sessions,
      }),
    }
  )
);
