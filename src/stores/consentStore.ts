import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ConsentState {
  hasCompletedOnboarding: boolean;
  hasAcceptedPrivacyPolicy: boolean;
  hasAcceptedTerms: boolean;
  hasRespondedToTracking: boolean;
  trackingAllowed: boolean;
  consentDate: string | null;

  setOnboardingComplete: () => void;
  acceptPrivacyPolicy: () => void;
  acceptTerms: () => void;
  setTrackingResponse: (allowed: boolean) => void;
  acceptAllLegal: () => void;
  resetConsent: () => void;
}

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      hasAcceptedPrivacyPolicy: false,
      hasAcceptedTerms: false,
      hasRespondedToTracking: false,
      trackingAllowed: false,
      consentDate: null,

      setOnboardingComplete: () =>
        set({ hasCompletedOnboarding: true }),

      acceptPrivacyPolicy: () =>
        set({
          hasAcceptedPrivacyPolicy: true,
          consentDate: new Date().toISOString(),
        }),

      acceptTerms: () =>
        set({
          hasAcceptedTerms: true,
          consentDate: new Date().toISOString(),
        }),

      setTrackingResponse: (allowed) =>
        set({
          hasRespondedToTracking: true,
          trackingAllowed: allowed,
        }),

      acceptAllLegal: () =>
        set({
          hasAcceptedPrivacyPolicy: true,
          hasAcceptedTerms: true,
          hasRespondedToTracking: true,
          consentDate: new Date().toISOString(),
        }),

      resetConsent: () =>
        set({
          hasCompletedOnboarding: false,
          hasAcceptedPrivacyPolicy: false,
          hasAcceptedTerms: false,
          hasRespondedToTracking: false,
          trackingAllowed: false,
          consentDate: null,
        }),
    }),
    {
      name: 'consent-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
