import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser, IUserSettings, IUserProfile } from '@/types';

interface UserState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  updateSettings: (settings: Partial<IUserSettings>) => void;
  updateProfile: (profile: Partial<IUserProfile>) => void;
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
          user: user
            ? {
                ...user,
                settings: { ...defaultSettings, ...user.settings },
              }
            : null,
          isAuthenticated: !!user,
        }),

      updateSettings: (newSettings) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                settings: { ...defaultSettings, ...state.user.settings, ...newSettings },
              }
            : {
                id: 'guest',
                email: '',
                name: 'Guest',
                settings: { ...defaultSettings, ...newSettings },
                createdAt: new Date(),
              },
        })),

      updateProfile: (profile) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                ...profile,
              }
            : {
                id: 'guest',
                email: '',
                name: profile.name || 'Guest',
                settings: defaultSettings,
                createdAt: new Date(),
                ...profile,
              },
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
