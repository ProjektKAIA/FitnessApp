// /workspaces/claude-workspace/fitnessapp/src/screens/onboarding/GenderScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { OnboardingStackParamList, TGender } from '@/types';
import { OnboardingProgress } from '@/components/onboarding';
import { useUserStore } from '@/stores';
import { useTheme } from '@/contexts/ThemeContext';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Gender'>;

const TOTAL_STEPS = 5;
const CURRENT_STEP = 1;

export const GenderScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const updateProfile = useUserStore((state) => state.updateProfile);
  const [selectedGender, setSelectedGender] = useState<TGender | null>(null);

  const handleContinue = () => {
    if (selectedGender) {
      updateProfile({ gender: selectedGender });
      navigation.navigate('Height');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const genderOptions: { key: TGender; label: string }[] = [
    { key: 'female', label: t('onboarding.gender.female') },
    { key: 'male', label: t('onboarding.gender.male') },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={[styles.logoBox, { borderColor: colors.text }]}>
            <Text style={[styles.logoText, { color: colors.text }]}>ShapyFit</Text>
          </View>
        </View>
        <OnboardingProgress currentStep={CURRENT_STEP} totalSteps={TOTAL_STEPS} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{t('onboarding.gender.title')}</Text>
        <Text style={[styles.subtitle, { color: colors.textTertiary }]}>{t('onboarding.gender.subtitle')}</Text>

        <View style={styles.optionsContainer}>
          {genderOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.optionButton,
                { backgroundColor: colors.surface },
                selectedGender === option.key && [styles.optionButtonSelected, { backgroundColor: colors.surfaceElevated, borderColor: colors.text }],
              ]}
              onPress={() => setSelectedGender(option.key)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: colors.textSecondary },
                  selectedGender === option.key && { color: colors.text },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: isDark ? COLORS.white : colors.primary },
            !selectedGender && [styles.continueButtonDisabled, { backgroundColor: colors.border }],
          ]}
          onPress={handleContinue}
          disabled={!selectedGender}
        >
          <Text style={[styles.continueButtonText, { color: isDark ? COLORS.gray[900] : COLORS.white }]}>
            {t('onboarding.continue')}
          </Text>
          <Text style={[styles.arrowIcon, { color: isDark ? COLORS.gray[900] : COLORS.white }]}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={[styles.backButtonText, { color: colors.textSecondary }]}>{t('onboarding.back')}</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING['3xl'],
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
    marginBottom: SPACING['3xl'],
  },
  optionsContainer: {
    gap: SPACING.md,
  },
  optionButton: {
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: COLORS.gray[700],
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  optionText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '400',
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
