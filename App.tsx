import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

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
} from '@/screens';
import { BottomNav } from '@/components/navigation';
import { useAuthStore, useConsentStore } from '@/stores';
import { RootStackParamList, MainTabParamList } from '@/types';
import { COLORS } from '@/constants/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workout" component={WorkoutScreen} />
      <Tab.Screen name="Plan" component={PlanScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
};

const LoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLORS.accent} />
  </View>
);

export default function App() {
  const { isAuthenticated, isLoading, initializeAuthListener } = useAuthStore();
  const { hasAcceptedPrivacyPolicy, hasAcceptedTerms, hasRespondedToTracking } = useConsentStore();

  const hasCompletedConsent = hasAcceptedPrivacyPolicy && hasAcceptedTerms && hasRespondedToTracking;

  useEffect(() => {
    const unsubscribe = initializeAuthListener();
    return () => unsubscribe();
  }, [initializeAuthListener]);

  if (isLoading) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <LoadingScreen />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
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
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
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
    backgroundColor: COLORS.gray[900],
  },
});
