// /workspaces/claude-workspace/fitnessapp/src/screens/onboarding/SportScreen.tsx
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
import { OnboardingStackParamList, TFitnessSport } from '@/types';
import { OnboardingProgress } from '@/components/onboarding';
import { useUserStore } from '@/stores';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Sport'>;

const TOTAL_STEPS = 5;
const CURRENT_STEP = 4;

const SPORT_OPTIONS: TFitnessSport[] = [
  'bodybuilding',
  'tennis',
  'basketball',
  'football',
  'volleyball',
  'badminton',
  'shooting',
  'running',
  'swimming',
  'yoga',
  'kickboxing',
  'karate',
];

export const SportScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const updateProfile = useUserStore((state) => state.updateProfile);
  const currentSports = useUserStore((state) => state.user?.favoriteSports);
  const [selectedSports, setSelectedSports] = useState<TFitnessSport[]>(
    currentSports || []
  );

  const toggleSport = (sport: TFitnessSport) => {
    setSelectedSports((prev) =>
      prev.includes(sport)
        ? prev.filter((s) => s !== sport)
        : [...prev, sport]
    );
  };

  const handleContinue = () => {
    updateProfile({ favoriteSports: selectedSports });
    navigation.navigate('Goal');
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
        <Text style={styles.title}>{t('onboarding.sport.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.sport.subtitle')}</Text>

        <View style={styles.tagsContainer}>
          {SPORT_OPTIONS.map((sport) => {
            const isSelected = selectedSports.includes(sport);
            return (
              <TouchableOpacity
                key={sport}
                style={[styles.tag, isSelected && styles.tagSelected]}
                onPress={() => toggleSport(sport)}
              >
                <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                  {t(`onboarding.sport.options.${sport}`)}
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
            selectedSports.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedSports.length === 0}
        >
          <Text style={styles.continueButtonText}>
            {t('onboarding.continue')}
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tag: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.gray[600],
    backgroundColor: 'transparent',
  },
  tagSelected: {
    borderColor: COLORS.white,
    backgroundColor: COLORS.gray[800],
  },
  tagText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
  },
  tagTextSelected: {
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
