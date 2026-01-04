import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser, IUserSettings } from '@/types';

interface UserState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  updateSettings: (settings: Partial<IUserSettings>) => void;
  logout: () => void;
}

const defaultSettings: IUserSettings = {
  theme: 'system',
  units: 'metric',
  restTimerDefault: 90,
  notifications: true,
  hapticFeedback: true,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      updateSettings: (newSettings) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                settings: { ...state.user.settings, ...newSettings },
              }
            : null,
        })),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
