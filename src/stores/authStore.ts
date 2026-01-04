import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'firebase/auth';
import {
  signIn,
  signUp,
  logout as firebaseLogout,
  resetPassword,
  signInWithGoogle,
  signInWithApple,
  signInWithFacebook,
  subscribeToAuthChanges,
  AuthResult,
} from '@/services/firebase';
import { DEV_LOGIN_ENABLED } from '@/constants/config';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDevMode: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  login: (email: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<AuthResult>;

  loginWithGoogle: (idToken: string) => Promise<AuthResult>;
  loginWithApple: (identityToken: string, nonce: string) => Promise<AuthResult>;
  loginWithFacebook: (accessToken: string) => Promise<AuthResult>;

  devLogin: () => void;
  initializeAuthListener: () => () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false, // Start with false to prevent blocking on hot-reload
      isDevMode: false,
      error: null,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user || get().isDevMode,
          isLoading: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        const result = await signIn(email, password);
        if (result.success && result.user) {
          set({ user: result.user, isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: false, error: result.error });
        }
        return result;
      },

      register: async (email, password) => {
        set({ isLoading: true, error: null });
        const result = await signUp(email, password);
        if (result.success && result.user) {
          set({ user: result.user, isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: false, error: result.error });
        }
        return result;
      },

      logout: async () => {
        set({ isLoading: true });
        await firebaseLogout();
        set({
          user: null,
          isAuthenticated: false,
          isDevMode: false,
          isLoading: false,
        });
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        const result = await resetPassword(email);
        set({ isLoading: false, error: result.error });
        return result;
      },

      loginWithGoogle: async (idToken) => {
        set({ isLoading: true, error: null });
        const result = await signInWithGoogle(idToken);
        if (result.success && result.user) {
          set({ user: result.user, isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: false, error: result.error });
        }
        return result;
      },

      loginWithApple: async (identityToken, nonce) => {
        set({ isLoading: true, error: null });
        const result = await signInWithApple(identityToken, nonce);
        if (result.success && result.user) {
          set({ user: result.user, isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: false, error: result.error });
        }
        return result;
      },

      loginWithFacebook: async (accessToken) => {
        set({ isLoading: true, error: null });
        const result = await signInWithFacebook(accessToken);
        if (result.success && result.user) {
          set({ user: result.user, isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: false, error: result.error });
        }
        return result;
      },

      devLogin: () => {
        if (DEV_LOGIN_ENABLED) {
          set({
            user: null,
            isAuthenticated: true,
            isDevMode: true,
            isLoading: false,
          });
        }
      },

      initializeAuthListener: () => {
        const unsubscribe = subscribeToAuthChanges((user) => {
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false });
          } else if (!get().isDevMode) {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        });
        return unsubscribe;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isDevMode: state.isDevMode,
        isAuthenticated: state.isDevMode ? true : false,
      }),
    }
  )
);
