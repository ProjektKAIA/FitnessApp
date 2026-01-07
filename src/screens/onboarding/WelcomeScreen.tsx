// /workspaces/claude-workspace/fitnessapp/src/screens/onboarding/WelcomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { OnboardingStackParamList } from '@/types';
import { useConsentStore } from '@/stores/consentStore';
import { useTheme } from '@/contexts/ThemeContext';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const setOnboardingComplete = useConsentStore((state) => state.setOnboardingComplete);

  const handleGetStarted = () => {
    navigation.navigate('Gender');
  };

  const handleSkip = () => {
    setOnboardingComplete();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)', colors.background]}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={[styles.logoBox, { borderColor: colors.text }]}>
                  <Text style={[styles.logoText, { color: colors.text }]}>ShapyFit</Text>
                </View>
              </View>
            </View>

            <View style={styles.content}>
              <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>{t('onboarding.welcome.greeting')}</Text>
              <Text style={[styles.title, { color: colors.text }]}>{t('onboarding.welcome.title')}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('onboarding.welcome.subtitle')}</Text>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity style={[styles.primaryButton, { backgroundColor: isDark ? COLORS.white : colors.primary }]} onPress={handleGetStarted}>
                <Text style={[styles.primaryButtonText, { color: isDark ? COLORS.gray[900] : COLORS.white }]}>
                  {t('onboarding.welcome.getStarted')}
                </Text>
                <Text style={[styles.arrowIcon, { color: isDark ? COLORS.gray[900] : COLORS.white }]}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>
                  {t('onboarding.welcome.skip')}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[900],
  },
  backgroundImage: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingHorizontal: SPACING.xl,
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: SPACING['2xl'],
  },
  welcomeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES['4xl'],
    fontWeight: '700',
    color: COLORS.white,
    lineHeight: 56,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[400],
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  primaryButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  arrowIcon: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gray[900],
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  skipButtonText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[400],
  },
});
