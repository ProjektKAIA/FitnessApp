import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  HomeScreen,
  WorkoutScreen,
  PlanScreen,
  ProgressScreen,
  MoreScreen,
  WorkoutActiveScreen,
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
  TrainingPlanListScreen,
  TrainingPlanEditorScreen,
  WorkoutDayEditorScreen,
  ExercisePickerScreen,
} from '@/screens';
import { BottomNav } from '@/components/navigation';
import { ErrorBoundary, LoadingScreen } from '@/components/common';
import { useAuthStore, useConsentStore, useLanguageStore } from '@/stores';
import { RootStackParamList, MainTabParamList } from '@/types';
import { COLORS } from '@/constants/theme';
import { initI18n } from '@/lib/i18n';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false,
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
        name="Progress"
        component={ProgressScreen}
        options={{ tabBarLabel: t('nav.progress') }}
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
  const [i18nReady, setI18nReady] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const initializeAuthListener = useAuthStore((state) => state.initializeAuthListener);
  const hasAcceptedPrivacyPolicy = useConsentStore((state) => state.hasAcceptedPrivacyPolicy);
  const hasAcceptedTerms = useConsentStore((state) => state.hasAcceptedTerms);
  const hasRespondedToTracking = useConsentStore((state) => state.hasRespondedToTracking);
  const initializeLanguage = useLanguageStore((state) => state.initialize);

  const hasCompletedConsent = hasAcceptedPrivacyPolicy && hasAcceptedTerms && hasRespondedToTracking;

  useEffect(() => {
    const init = async () => {
      await initI18n();
      await initializeLanguage();
      setI18nReady(true);
    };
    init();
  }, []);

  useEffect(() => {
    const unsubscribe = initializeAuthListener();
    return () => unsubscribe();
  }, [initializeAuthListener]);

  if (!i18nReady || isLoading) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <LoadingScreen message={i18nReady ? t('common.loading') : 'Loading...'} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <NavigationContainer>
          <StatusBar style="light" />
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
              </>
            )}
          </Stack.Navigator>
          </NavigationContainer>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
