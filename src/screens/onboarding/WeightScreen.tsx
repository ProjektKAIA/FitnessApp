// /workspaces/claude-workspace/fitnessapp/src/screens/onboarding/WeightScreen.tsx
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
import { OnboardingStackParamList } from '@/types';
import { OnboardingProgress, ScrollPicker } from '@/components/onboarding';
import { useUserStore } from '@/stores';
import { useTheme } from '@/contexts/ThemeContext';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Weight'>;

const TOTAL_STEPS = 5;
const CURRENT_STEP = 3;

const WEIGHT_VALUES = Array.from({ length: 151 }, (_, i) => 40 + i); // 40-190 kg

export const WeightScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const updateProfile = useUserStore((state) => state.updateProfile);
  const currentWeight = useUserStore((state) => state.user?.weight);
  const [selectedWeight, setSelectedWeight] = useState(currentWeight || 70);

  const handleContinue = () => {
    updateProfile({ weight: selectedWeight });
    navigation.navigate('Sport');
  };

  const handleBack = () => {
    navigation.goBack();
  };

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
        <Text style={[styles.title, { color: colors.text }]}>{t('onboarding.weight.title')}</Text>
        <Text style={[styles.subtitle, { color: colors.textTertiary }]}>{t('onboarding.weight.subtitle')}</Text>

        <View style={styles.pickerContainer}>
          <ScrollPicker
            values={WEIGHT_VALUES}
            selectedValue={selectedWeight}
            onValueChange={setSelectedWeight}
            unit="kg"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.continueButton, { backgroundColor: isDark ? COLORS.white : colors.primary }]} onPress={handleContinue}>
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
    marginBottom: SPACING['2xl'],
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
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
