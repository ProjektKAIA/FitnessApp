// /workspaces/claude-workspace/fitnessapp/src/stores/backupStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type BackupStorageType = 'local' | 'icloud' | 'gdrive';
export type AutoBackupFrequency = 'after_workout' | 'daily' | 'weekly' | 'manual';

interface BackupInfo {
  fileName: string;
  createdAt: string;
  size: number;
  storageType: BackupStorageType;
  cloudPath?: string;
}

interface BackupState {
  // Settings
  storageType: BackupStorageType;
  autoBackupFrequency: AutoBackupFrequency;
  isCloudConnected: boolean;
  cloudEmail?: string;

  // Backup History
  lastBackup: BackupInfo | null;
  backupHistory: BackupInfo[];

  // Status
  isBackingUp: boolean;
  isRestoring: boolean;
  lastError: string | null;

  // Actions
  setStorageType: (type: BackupStorageType) => void;
  setAutoBackupFrequency: (frequency: AutoBackupFrequency) => void;
  setCloudConnected: (connected: boolean, email?: string) => void;

  addBackupToHistory: (backup: BackupInfo) => void;
  setLastBackup: (backup: BackupInfo) => void;
  clearBackupHistory: () => void;

  setBackingUp: (status: boolean) => void;
  setRestoring: (status: boolean) => void;
  setError: (error: string | null) => void;

  // Helpers
  shouldAutoBackup: () => boolean;
  getLastBackupDate: () => Date | null;
}

const MAX_BACKUP_HISTORY = 10;

export const useBackupStore = create<BackupState>()(
  persist(
    (set, get) => ({
      // Default Settings
      storageType: 'local',
      autoBackupFrequency: 'manual',
      isCloudConnected: false,
      cloudEmail: undefined,

      // Backup History
      lastBackup: null,
      backupHistory: [],

      // Status
      isBackingUp: false,
      isRestoring: false,
      lastError: null,

      // Actions
      setStorageType: (type) => set({ storageType: type }),

      setAutoBackupFrequency: (frequency) => set({ autoBackupFrequency: frequency }),

      setCloudConnected: (connected, email) =>
        set({
          isCloudConnected: connected,
          cloudEmail: connected ? email : undefined,
        }),

      addBackupToHistory: (backup) =>
        set((state) => {
          const newHistory = [backup, ...state.backupHistory].slice(0, MAX_BACKUP_HISTORY);
          return {
            backupHistory: newHistory,
            lastBackup: backup,
          };
        }),

      setLastBackup: (backup) => set({ lastBackup: backup }),

      clearBackupHistory: () => set({ backupHistory: [], lastBackup: null }),

      setBackingUp: (status) => set({ isBackingUp: status }),

      setRestoring: (status) => set({ isRestoring: status }),

      setError: (error) => set({ lastError: error }),

      // Helpers
      shouldAutoBackup: () => {
        const { autoBackupFrequency, lastBackup } = get();

        if (autoBackupFrequency === 'manual') return false;
        if (autoBackupFrequency === 'after_workout') return true;

        if (!lastBackup) return true;

        const lastBackupDate = new Date(lastBackup.createdAt);
        const now = new Date();
        const hoursSinceLastBackup =
          (now.getTime() - lastBackupDate.getTime()) / (1000 * 60 * 60);

        if (autoBackupFrequency === 'daily') {
          return hoursSinceLastBackup >= 24;
        }

        if (autoBackupFrequency === 'weekly') {
          return hoursSinceLastBackup >= 168; // 7 * 24
        }

        return false;
      },

      getLastBackupDate: () => {
        const { lastBackup } = get();
        return lastBackup ? new Date(lastBackup.createdAt) : null;
      },
    }),
    {
      name: 'backup-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        storageType: state.storageType,
        autoBackupFrequency: state.autoBackupFrequency,
        isCloudConnected: state.isCloudConnected,
        cloudEmail: state.cloudEmail,
        lastBackup: state.lastBackup,
        backupHistory: state.backupHistory,
      }),
    }
  )
);
