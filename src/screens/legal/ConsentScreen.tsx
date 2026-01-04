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
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useConsentStore } from '@/stores';

export const ConsentScreen: React.FC = () => {
  const { acceptAllLegal, setTrackingResponse } = useConsentStore();
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🏋️</Text>
        </View>

        <Text style={styles.title}>Willkommen bei FitnessApp</Text>
        <Text style={styles.subtitle}>
          Bevor du loslegst, brauchen wir deine Zustimmung zu einigen wichtigen Punkten.
        </Text>

        <View style={styles.consentSection}>
          <Text style={styles.sectionTitle}>Rechtliche Hinweise</Text>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setPrivacyAccepted(!privacyAccepted)}
          >
            <View style={[styles.checkbox, privacyAccepted && styles.checkboxChecked]}>
              {privacyAccepted && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              Ich habe die{' '}
              <Text
                style={styles.link}
                onPress={() => Linking.openURL('https://example.com/privacy')}
              >
                Datenschutzerklärung
              </Text>{' '}
              gelesen und akzeptiere sie.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setTermsAccepted(!termsAccepted)}
          >
            <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
              {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              Ich akzeptiere die{' '}
              <Text
                style={styles.link}
                onPress={() => Linking.openURL('https://example.com/terms')}
              >
                Allgemeinen Geschäftsbedingungen
              </Text>
              .
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.trackingSection}>
          <Text style={styles.sectionTitle}>App-Tracking</Text>
          <Text style={styles.trackingDescription}>
            Wir möchten deine Aktivität über Apps und Websites anderer Unternehmen hinweg
            verfolgen, um dir personalisierte Werbung anzuzeigen. Dies hilft uns, die App
            kostenlos anzubieten.
          </Text>
          <Text style={styles.trackingNote}>
            Du kannst diese Einstellung jederzeit in den Systemeinstellungen ändern.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.denyButton, !canContinue && styles.buttonDisabled]}
          onPress={handleDenyTracking}
          disabled={!canContinue}
        >
          <Text style={[styles.buttonText, styles.denyButtonText]}>
            App nicht erlauben zu tracken
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.allowButton, !canContinue && styles.buttonDisabled]}
          onPress={handleAllowTracking}
          disabled={!canContinue}
        >
          <Text style={[styles.buttonText, styles.allowButtonText]}>Erlauben</Text>
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
