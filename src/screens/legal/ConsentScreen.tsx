import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useConsentStore } from '@/stores';
import { useTheme } from '@/contexts';

export const ConsentScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const acceptAllLegal = useConsentStore((state) => state.acceptAllLegal);
  const setTrackingResponse = useConsentStore((state) => state.setTrackingResponse);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const canContinue = privacyAccepted && termsAccepted;

  const handleContinue = () => {
    acceptAllLegal();
  };

  const handleAllowTracking = () => {
    setTrackingResponse(true);
    handleContinue();
  };

  const handleDenyTracking = () => {
    setTrackingResponse(false);
    handleContinue();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🏋️</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{t('consent.title')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('consent.subtitle')}</Text>

        <View style={styles.consentSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('consent.legalSection')}</Text>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setPrivacyAccepted(!privacyAccepted)}
          >
            <View style={[styles.checkbox, { borderColor: colors.border }, privacyAccepted && styles.checkboxChecked]}>
              {privacyAccepted && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.checkboxLabel, { color: colors.textSecondary }]}>
              {t('consent.privacyCheckbox').split(t('consent.privacyPolicy'))[0]}
              <Text
                style={styles.link}
                onPress={() => Linking.openURL('https://example.com/privacy')}
              >
                {t('consent.privacyPolicy')}
              </Text>
              {t('consent.privacyCheckbox').split(t('consent.privacyPolicy'))[1]}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setTermsAccepted(!termsAccepted)}
          >
            <View style={[styles.checkbox, { borderColor: colors.border }, termsAccepted && styles.checkboxChecked]}>
              {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.checkboxLabel, { color: colors.textSecondary }]}>
              {t('consent.termsCheckbox').split(t('consent.termsOfService'))[0]}
              <Text
                style={styles.link}
                onPress={() => Linking.openURL('https://example.com/terms')}
              >
                {t('consent.termsOfService')}
              </Text>
              {t('consent.termsCheckbox').split(t('consent.termsOfService'))[1]}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.trackingSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('consent.trackingSection')}</Text>
          <Text style={[styles.trackingDescription, { color: colors.textSecondary }]}>{t('consent.trackingDescription')}</Text>
          <Text style={[styles.trackingNote, { color: colors.textTertiary }]}>{t('consent.trackingNote')}</Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.background }, !canContinue && styles.buttonDisabled]}
          onPress={handleDenyTracking}
          disabled={!canContinue}
        >
          <Text style={[styles.buttonText, { color: colors.textSecondary }]}>
            {t('consent.denyTracking')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.allowButton, !canContinue && styles.buttonDisabled]}
          onPress={handleAllowTracking}
          disabled={!canContinue}
        >
          <Text style={[styles.buttonText, styles.allowButtonText]}>
            {t('consent.allowTracking')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING['3xl'],
    paddingBottom: SPACING.xl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.gray[900],
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
    textAlign: 'center',
    marginBottom: SPACING['2xl'],
    lineHeight: 20,
  },
  consentSection: {
    marginBottom: SPACING['2xl'],
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.lg,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    marginRight: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[700],
    lineHeight: 22,
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  trackingSection: {
    backgroundColor: COLORS.gray[50],
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  trackingDescription: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[700],
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  trackingNote: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    fontStyle: 'italic',
  },
  buttonContainer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  button: {
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  denyButton: {
    backgroundColor: COLORS.gray[100],
  },
  allowButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  denyButtonText: {
    color: COLORS.gray[700],
  },
  allowButtonText: {
    color: COLORS.white,
  },
});
