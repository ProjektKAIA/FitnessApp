// /workspaces/claude-workspace/fitnessapp/src/screens/onboarding/GoalScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { OnboardingStackParamList, TFitnessGoal } from '@/types';
import { OnboardingProgress } from '@/components/onboarding';
import { useUserStore } from '@/stores';
import { useConsentStore } from '@/stores/consentStore';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Goal'>;

const TOTAL_STEPS = 5;
const CURRENT_STEP = 5;

const GOAL_OPTIONS: TFitnessGoal[] = [
  'fat_burning',
  'fitness',
  'strengthen_muscles',
  'increased_metabolism',
  'weight_gain',
];

export const GoalScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const updateProfile = useUserStore((state) => state.updateProfile);
  const setOnboardingComplete = useConsentStore((state) => state.setOnboardingComplete);
  const currentGoal = useUserStore((state) => state.user?.fitnessGoal);
  const [selectedGoal, setSelectedGoal] = useState<TFitnessGoal | null>(
    currentGoal || null
  );

  const handleContinue = () => {
    if (selectedGoal) {
      updateProfile({ fitnessGoal: selectedGoal });
      setOnboardingComplete();
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>FrameFit</Text>
          </View>
        </View>
        <OnboardingProgress currentStep={CURRENT_STEP} totalSteps={TOTAL_STEPS} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('onboarding.goal.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.goal.subtitle')}</Text>

        <View style={styles.optionsContainer}>
          {GOAL_OPTIONS.map((goal) => {
            const isSelected = selectedGoal === goal;
            return (
              <TouchableOpacity
                key={goal}
                style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                onPress={() => setSelectedGoal(goal)}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {t(`onboarding.goal.options.${goal}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedGoal && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedGoal}
        >
          <Text style={styles.continueButtonText}>
            {t('onboarding.finish')}
          </Text>
          <Text style={styles.arrowIcon}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>{t('onboarding.back')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[900],
  },
  header: {
    paddingTop: SPACING.lg,
    gap: SPACING.xl,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  logoBox: {
    borderWidth: 1,
    borderColor: COLORS.white,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  logoText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.white,
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING['3xl'],
    paddingBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '300',
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[500],
    marginBottom: SPACING['2xl'],
  },
  optionsContainer: {
    gap: SPACING.md,
  },
  optionButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.gray[600],
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: COLORS.white,
    backgroundColor: COLORS.gray[800],
  },
  optionText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[400],
  },
  optionTextSelected: {
    color: COLORS.white,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  continueButtonDisabled: {
    backgroundColor: COLORS.gray[700],
  },
  continueButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  arrowIcon: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gray[900],
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  backButtonText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[400],
  },
});
