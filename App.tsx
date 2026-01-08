// Initialize i18n FIRST before any other imports that might use translations
import i18n from '@/lib/i18n';

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useTranslation, I18nextProvider } from 'react-i18next';

import {
  HomeScreen,
  WorkoutScreen,
  PlanScreen,
  YouScreen,
  MoreScreen,
  WorkoutActiveScreen,
  WorkoutHistoryScreen,
  WorkoutDetailScreen,
  StreakDetailScreen,
  LoginScreen,
  ConsentScreen,
  ImpressumScreen,
  PrivacyPolicyScreen,
  TermsOfServiceScreen,
  LanguageScreen,
  ProfileEditScreen,
  AICoachScreen,
  ChatGPTImportScreen,
  ChatDetailScreen,
  SportSelectionScreen,
  FitnessQuestionnaireScreen,
  TrainingPlanListScreen,
  TrainingPlanEditorScreen,
  WorkoutDayEditorScreen,
  ExercisePickerScreen,
  ExerciseDetailScreen,
  HealthSettingsScreen,
  HealthDashboardScreen,
  ContactScreen,
  SecurityScreen,
  DataExportScreen,
  DataImportScreen,
  DataBackupScreen,
  DeleteAccountScreen,
  WelcomeScreen,
  GenderScreen,
  HeightScreen,
  WeightScreen,
  SportScreen,
  GoalScreen,
} from '@/screens';
import { BottomNav } from '@/components/navigation';
import { ErrorBoundary, LoadingScreen } from '@/components/common';
import { ThemeProvider } from '@/contexts';
import { useAuthStore, useConsentStore, useLanguageStore } from '@/stores';
import { RootStackParamList, MainTabParamList, OnboardingStackParamList } from '@/types';
import { initI18n } from '@/lib/i18n';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator: React.FC = () => {
  return (
    <OnboardingStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStack.Screen name="Gender" component={GenderScreen} />
      <OnboardingStack.Screen name="Height" component={HeightScreen} />
      <OnboardingStack.Screen name="Weight" component={WeightScreen} />
      <OnboardingStack.Screen name="Sport" component={SportScreen} />
      <OnboardingStack.Screen name="Goal" component={GoalScreen} />
    </OnboardingStack.Navigator>
  );
};

const MainTabs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: 'absolute', backgroundColor: 'transparent', borderTopWidth: 0, elevation: 0 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: t('nav.home') }}
      />
      <Tab.Screen
        name="Workout"
        component={WorkoutScreen}
        options={{ tabBarLabel: t('nav.workout') }}
      />
      <Tab.Screen
        name="Plan"
        component={PlanScreen}
        options={{ tabBarLabel: t('nav.plan') }}
      />
      <Tab.Screen
        name="You"
        component={YouScreen}
        options={{ tabBarLabel: t('nav.you') }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{ tabBarLabel: t('nav.more') }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const initializeAuthListener = useAuthStore((state) => state.initializeAuthListener);
  const hasAcceptedPrivacyPolicy = useConsentStore((state) => state.hasAcceptedPrivacyPolicy);
  const hasAcceptedTerms = useConsentStore((state) => state.hasAcceptedTerms);
  const hasRespondedToTracking = useConsentStore((state) => state.hasRespondedToTracking);
  const hasCompletedOnboarding = useConsentStore((state) => state.hasCompletedOnboarding);
  const initializeLanguage = useLanguageStore((state) => state.initialize);

  const hasCompletedConsent = hasAcceptedPrivacyPolicy && hasAcceptedTerms && hasRespondedToTracking;

  useEffect(() => {
    // Load stored language preference (i18n is already initialized synchronously)
    initI18n();
    initializeLanguage();
  }, []);

  useEffect(() => {
    const unsubscribe = initializeAuthListener();
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <I18nextProvider i18n={i18n}>
          <SafeAreaProvider>
            <ThemeProvider>
              <LoadingScreen message={t('common.loading')} />
            </ThemeProvider>
          </SafeAreaProvider>
        </I18nextProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <I18nextProvider i18n={i18n}>
        <SafeAreaProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <NavigationContainer>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
              >
            {!isAuthenticated ? (
              <Stack.Screen
                name="Auth"
                component={LoginScreen}
                options={{
                  animationTypeForReplace: 'pop',
                }}
              />
            ) : !hasCompletedConsent ? (
              <Stack.Screen
                name="Consent"
                component={ConsentScreen}
                options={{
                  animationTypeForReplace: 'push',
                }}
              />
            ) : !hasCompletedOnboarding ? (
              <Stack.Screen
                name="Onboarding"
                component={OnboardingNavigator}
                options={{
                  animationTypeForReplace: 'push',
                }}
              />
            ) : (
              <>
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen
                  name="WorkoutActive"
                  component={WorkoutActiveScreen}
                  options={{
                    presentation: 'fullScreenModal',
                    animation: 'slide_from_bottom',
                  }}
                />
                <Stack.Screen
                  name="WorkoutHistory"
                  component={WorkoutHistoryScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="WorkoutDetail"
                  component={WorkoutDetailScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="StreakDetail"
                  component={StreakDetailScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="Impressum"
                  component={ImpressumScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="PrivacyPolicy"
                  component={PrivacyPolicyScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="TermsOfService"
                  component={TermsOfServiceScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="Language"
                  component={LanguageScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="ProfileEdit"
                  component={ProfileEditScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="AICoach"
                  component={AICoachScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="ChatGPTImport"
                  component={ChatGPTImportScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="ChatDetail"
                  component={ChatDetailScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="SportSelection"
                  component={SportSelectionScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="FitnessQuestionnaire"
                  component={FitnessQuestionnaireScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="TrainingPlanList"
                  component={TrainingPlanListScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="TrainingPlanEditor"
                  component={TrainingPlanEditorScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="WorkoutDayEditor"
                  component={WorkoutDayEditorScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="ExercisePicker"
                  component={ExercisePickerScreen}
                  options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                  }}
                />
                <Stack.Screen
                  name="ExerciseDetail"
                  component={ExerciseDetailScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="HealthSettings"
                  component={HealthSettingsScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="HealthDashboard"
                  component={HealthDashboardScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="Contact"
                  component={ContactScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="Security"
                  component={SecurityScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="DataExport"
                  component={DataExportScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="DataImport"
                  component={DataImportScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="DataBackup"
                  component={DataBackupScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="DeleteAccount"
                  component={DeleteAccountScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
              </>
            )}
              </Stack.Navigator>
              </NavigationContainer>
            </ErrorBoundary>
          </ThemeProvider>
        </SafeAreaProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
