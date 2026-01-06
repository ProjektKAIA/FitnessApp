// /workspaces/claude-workspace/fitnessapp/src/stores/securityStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ISecurityState {
  biometricEnabled: boolean;
  setBiometricEnabled: (enabled: boolean) => void;
}

export const useSecurityStore = create<ISecurityState>()(
  persist(
    (set) => ({
      biometricEnabled: false,
      setBiometricEnabled: (enabled: boolean) => set({ biometricEnabled: enabled }),
    }),
    {
      name: 'security-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
