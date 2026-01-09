// /workspaces/claude-workspace/fitnessapp/src/stores/trackingStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ITrackingState {
  trackingPermissionStatus: 'not-determined' | 'authorized' | 'denied' | 'restricted' | null;
  hasAskedForTracking: boolean;
  setTrackingPermissionStatus: (status: 'not-determined' | 'authorized' | 'denied' | 'restricted') => void;
  setHasAskedForTracking: (hasAsked: boolean) => void;
}

export const useTrackingStore = create<ITrackingState>()(
  persist(
    (set) => ({
      trackingPermissionStatus: null,
      hasAskedForTracking: false,
      setTrackingPermissionStatus: (status) => set({ trackingPermissionStatus: status }),
      setHasAskedForTracking: (hasAsked) => set({ hasAskedForTracking: hasAsked }),
    }),
    {
      name: 'tracking-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
