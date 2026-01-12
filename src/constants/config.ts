export const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
};

export const OPENAI_API_URL = 'https://api.openai.com/v1';

export const REST_TIMER_DEFAULT = 90;
export const REST_TIMER_OPTIONS = [30, 60, 90, 120, 180, 300];

export const APP_VERSION = '1.0.0';

export const DEV_MODE = __DEV__;
