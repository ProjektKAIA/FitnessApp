// /workspaces/claude-workspace/fitnessapp/src/screens/settings/SecurityScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useSecurityStore } from '@/stores/securityStore';
import { useTheme } from '@/contexts';

// Dynamically import LocalAuthentication to avoid crash if not available
let LocalAuthentication: typeof import('expo-local-authentication') | null = null;
try {
  LocalAuthentication = require('expo-local-authentication');
} catch {
  // Module not available - biometric features will be disabled
}

export const SecurityScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();

  const biometricEnabled = useSecurityStore((state) => state.biometricEnabled);
  const setBiometricEnabled = useSecurityStore((state) => state.setBiometricEnabled);

  // Biometric state
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    if (!LocalAuthentication) {
      setIsBiometricAvailable(false);
      return;
    }

    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (compatible && enrolled) {
        setIsBiometricAvailable(true);
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Fingerprint');
        } else {
          setBiometricType('Biometric');
        }
      }
    } catch {
      setIsBiometricAvailable(false);
    }
  };

  const handleToggleBiometric = async (value: boolean) => {
    if (!LocalAuthentication) {
      Alert.alert(t('common.error'), t('security.biometricNotAvailable'));
      return;
    }

    if (value) {
      // Authenticate first before enabling
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: t('security.biometricPrompt'),
          fallbackLabel: t('security.usePassword'),
          cancelLabel: t('common.cancel'),
        });

        if (result.success) {
          setBiometricEnabled(true);
          Alert.alert(t('common.success'), t('security.biometricEnabled'));
        }
      } catch {
        Alert.alert(t('common.error'), t('security.biometricError'));
      }
    } else {
      setBiometricEnabled(false);
      Alert.alert(t('common.success'), t('security.biometricDisabled'));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('security.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Biometric Section */}
        {isBiometricAvailable ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('security.biometricTitle')}</Text>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingIcon}>
                    {biometricType === 'Face ID' ? '🔐' : '👆'}
                  </Text>
                  <View>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>{biometricType}</Text>
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                      {t('security.biometricSubtitle')}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={biometricEnabled}
                  onValueChange={handleToggleBiometric}
                  trackColor={{ false: colors.border, true: colors.primary }}
                />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingIcon}>🔒</Text>
                  <View>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>{t('security.noBiometric')}</Text>
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                      {t('security.noBiometricDesc')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Info */}
        <View style={[styles.infoBox, { backgroundColor: colors.primary + '15' }]}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>{t('security.infoTextLocal')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: SPACING.sm,
    marginLeft: -SPACING.sm,
  },
  backIcon: {
    fontSize: FONT_SIZES['2xl'],
    color: COLORS.gray[900],
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  settingTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.gray[900],
  },
  settingSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary + '10',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    lineHeight: 20,
  },
});
