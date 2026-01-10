// CRITICAL: Must be first import for React Navigation to work correctly
import 'react-native-gesture-handler';

// Initialize i18n before any other imports that might use translations
import i18n from '@/lib/i18n';

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useTranslation, I18nextProvider } from 'react-i18next';

import {
  HomeScreen,
  WorkoutScreen,
  GuideScreen,
  YouScreen,
  MoreScreen,
  WorkoutActiveScreen,
  WorkoutHistoryScreen,
  WorkoutDetailScreen,
  StreakDetailScreen,
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
  // Running Screens
  RunningHomeScreen,
  RunningPlanListScreen,
  RunningPlanDetailScreen,
  RunningWorkoutDetailScreen,
  RunningActiveScreen,
  // Yoga Screens
  YogaHomeScreen,
  YogaSessionListScreen,
  YogaSessionDetailScreen,
  YogaPoseDetailScreen,
  YogaActiveScreen,
  // Calisthenics Screens
  CalisthenicsHomeScreen,
  CalisthenicsWorkoutListScreen,
  CalisthenicsWorkoutDetailScreen,
  // Homeworkout Screens
  HomeworkoutHomeScreen,
} from '@/screens';
import { BottomNav } from '@/components/navigation';
import { ErrorBoundary, LoadingScreen } from '@/components/common';
import { ThemeProvider } from '@/contexts';
import { useConsentStore, useHydrationStore, useLanguageStore, useTrackingStore } from '@/stores';
import { RootStackParamList, MainTabParamList, OnboardingStackParamList } from '@/types';
import { initI18n } from '@/lib/i18n';
import { requestAppTracking } from '@/utils/tracking';

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
        name="Guide"
        component={GuideScreen}
        options={{ tabBarLabel: t('nav.guide') }}
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

  // Hydration State - separater Store der nicht persistiert wird
  const hasHydrated = useHydrationStore((state) => state.hasHydrated);

  // App wird erst nach Hydration initialisiert - verhindert Flash/Crash
  const [isReady, setIsReady] = useState(false);

  const hasAcceptedPrivacyPolicy = useConsentStore((state) => state.hasAcceptedPrivacyPolicy);
  const hasAcceptedTerms = useConsentStore((state) => state.hasAcceptedTerms);
  const hasRespondedToTracking = useConsentStore((state) => state.hasRespondedToTracking);
  const hasCompletedOnboarding = useConsentStore((state) => state.hasCompletedOnboarding);
  const initializeLanguage = useLanguageStore((state) => state.initialize);

  const hasAskedForTracking = useTrackingStore((state) => state.hasAskedForTracking);
  const setTrackingPermissionStatus = useTrackingStore((state) => state.setTrackingPermissionStatus);
  const setHasAskedForTracking = useTrackingStore((state) => state.setHasAskedForTracking);

  const hasCompletedConsent = hasAcceptedPrivacyPolicy && hasAcceptedTerms && hasRespondedToTracking;

  // Warte auf Hydration und initialisiere App
  useEffect(() => {
    if (hasHydrated) {
      // Stores sind geladen, App kann initialisiert werden
      initI18n();
      initializeLanguage();
      setIsReady(true);
    }
  }, [hasHydrated, initializeLanguage]);

  // Request App Tracking Transparency after onboarding
  useEffect(() => {
    if (!isReady) return;

    const requestTracking = async () => {
      if (hasCompletedOnboarding && hasCompletedConsent && !hasAskedForTracking) {
        // Wait a bit after app launch for better UX
        setTimeout(async () => {
          const status = await requestAppTracking();
          setTrackingPermissionStatus(status);
          setHasAskedForTracking(true);
        }, 1000);
      }
    };

    requestTracking();
  }, [isReady, hasCompletedOnboarding, hasCompletedConsent, hasAskedForTracking, setTrackingPermissionStatus, setHasAskedForTracking]);

  // Warte auf Store-Hydration bevor die App gerendert wird
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
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
            {!hasCompletedConsent ? (
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
                {/* Running Screens */}
                <Stack.Screen
                  name="RunningHome"
                  component={RunningHomeScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="RunningPlanList"
                  component={RunningPlanListScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="RunningPlanDetail"
                  component={RunningPlanDetailScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="RunningWorkoutDetail"
                  component={RunningWorkoutDetailScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="RunningWorkoutActive"
                  component={RunningActiveScreen}
                  options={{
                    presentation: 'fullScreenModal',
                    animation: 'slide_from_bottom',
                    gestureEnabled: false,
                  }}
                />
                {/* Yoga Screens */}
                <Stack.Screen
                  name="YogaHome"
                  component={YogaHomeScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="YogaSessionList"
                  component={YogaSessionListScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="YogaSessionDetail"
                  component={YogaSessionDetailScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="YogaPoseDetail"
                  component={YogaPoseDetailScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="YogaProgramList"
                  component={YogaSessionListScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="YogaProgramDetail"
                  component={YogaSessionDetailScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="YogaSessionActive"
                  component={YogaActiveScreen}
                  options={{
                    presentation: 'fullScreenModal',
                    animation: 'slide_from_bottom',
                    gestureEnabled: false,
                  }}
                />
                {/* Calisthenics Screens */}
                <Stack.Screen
                  name="CalisthenicsHome"
                  component={CalisthenicsHomeScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="CalisthenicsWorkoutList"
                  component={CalisthenicsWorkoutListScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
                <Stack.Screen
                  name="CalisthenicsWorkoutDetail"
                  component={CalisthenicsWorkoutDetailScreen}
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />

                {/* Homeworkout Screens */}
                <Stack.Screen
                  name="HomeworkoutHome"
                  component={HomeworkoutHomeScreen}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
});
