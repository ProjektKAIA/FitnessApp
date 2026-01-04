import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/lib/i18n';
import { Language, SUPPORTED_LANGUAGES } from '@/lib/i18n';

interface LanguageState {
  language: Language;
  isInitialized: boolean;
  setLanguage: (language: Language) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'de',
      isInitialized: false,

      setLanguage: async (language: Language) => {
        await i18n.changeLanguage(language);
        set({ language });
      },

      initialize: async () => {
        const { language } = get();
        if (i18n.language !== language) {
          await i18n.changeLanguage(language);
        }
        set({ isInitialized: true });
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        language: state.language,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initialize();
        }
      },
    }
  )
);

export { SUPPORTED_LANGUAGES, type Language };
