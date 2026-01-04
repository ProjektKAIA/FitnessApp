import { useEffect, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useWorkoutStore, useUserStore } from '@/stores';

export const useRestTimer = () => {
  const user = useUserStore((state) => state.user);
  const restTimerActive = useWorkoutStore((state) => state.restTimerActive);
  const restTimeRemaining = useWorkoutStore((state) => state.restTimeRemaining);
  const startRestTimer = useWorkoutStore((state) => state.startRestTimer);
  const stopRestTimer = useWorkoutStore((state) => state.stopRestTimer);
  const updateRestTimer = useWorkoutStore((state) => state.updateRestTimer);

  useEffect(() => {
    if (!restTimerActive) return;

    const timer = setInterval(() => {
      if (restTimeRemaining <= 1) {
        stopRestTimer();
        if (user?.settings?.hapticFeedback) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } else {
        updateRestTimer(restTimeRemaining - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [restTimerActive, restTimeRemaining, stopRestTimer, updateRestTimer, user?.settings?.hapticFeedback]);

  const start = useCallback(
    (seconds?: number) => {
      startRestTimer(seconds || user?.settings?.restTimerDefault || 90);
    },
    [startRestTimer, user?.settings?.restTimerDefault]
  );

  const skip = useCallback(() => {
    stopRestTimer();
  }, [stopRestTimer]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    isActive: restTimerActive,
    timeRemaining: restTimeRemaining,
    formattedTime: formatTime(restTimeRemaining),
    start,
    skip,
  };
};
