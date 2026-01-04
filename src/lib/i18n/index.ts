import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import de from './locales/de';
import en from './locales/en';

const LANGUAGE_STORAGE_KEY = '@app_language';

export const resources = {
  de: { translation: de },
  en: { translation: en },
} as const;

export type Language = keyof typeof resources;
export type TranslationKeys = keyof typeof de;

export const SUPPORTED_LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'en', name: 'English', nativeName: 'English' },
];

export const getStoredLanguage = async (): Promise<Language | null> => {
  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && (storedLanguage === 'de' || storedLanguage === 'en')) {
      return storedLanguage as Language;
    }
    return null;
  } catch {
    return null;
  }
};

export const setStoredLanguage = async (language: Language): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    console.error('Failed to store language preference');
  }
};

export const initI18n = async (): Promise<void> => {
  const storedLanguage = await getStoredLanguage();

  await i18n.use(initReactI18next).init({
    resources,
    lng: storedLanguage || 'de',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
};

export const changeLanguage = async (language: Language): Promise<void> => {
  await i18n.changeLanguage(language);
  await setStoredLanguage(language);
};

export default i18n;
