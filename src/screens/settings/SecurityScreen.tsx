// /workspaces/claude-workspace/fitnessapp/src/screens/settings/SecurityScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useUserStore } from '@/stores';
import { useSecurityStore } from '@/stores/securityStore';
import { useTheme } from '@/contexts';

// Dynamically import LocalAuthentication to avoid crash if not available
let LocalAuthentication: typeof import('expo-local-authentication') | null = null;
try {
  LocalAuthentication = require('expo-local-authentication');
} catch (e) {
  console.log('expo-local-authentication not available');
}
import {
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth } from '@/services/firebase/client';

export const SecurityScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const user = useUserStore((state) => state.user);

  const biometricEnabled = useSecurityStore((state) => state.biometricEnabled);
  const setBiometricEnabled = useSecurityStore((state) => state.setBiometricEnabled);

  // Biometric state
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Email change state
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [isChangingEmail, setIsChangingEmail] = useState(false);

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
    } catch (error) {
      console.log('Biometric check failed:', error);
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
      } catch (error) {
        console.log('Biometric auth failed:', error);
        Alert.alert(t('common.error'), t('security.biometricError'));
      }
    } else {
      setBiometricEnabled(false);
      Alert.alert(t('common.success'), t('security.biometricDisabled'));
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t('common.error'), t('security.fillAllFields'));
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(t('common.error'), t('security.passwordTooShort'));
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t('common.error'), t('security.passwordsNoMatch'));
      return;
    }

    setIsChangingPassword(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error('No user logged in');
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, newPassword);

      Alert.alert(t('common.success'), t('security.passwordChanged'));
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      let message = t('security.passwordChangeError');
      if (error.code === 'auth/wrong-password') {
        message = t('security.wrongPassword');
      } else if (error.code === 'auth/weak-password') {
        message = t('security.weakPassword');
      }
      Alert.alert(t('common.error'), message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail || !emailPassword) {
      Alert.alert(t('common.error'), t('security.fillAllFields'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      Alert.alert(t('common.error'), t('security.invalidEmail'));
      return;
    }

    setIsChangingEmail(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error('No user logged in');
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(currentUser.email, emailPassword);
      await reauthenticateWithCredential(currentUser, credential);

      // Update email
      await updateEmail(currentUser, newEmail);

      Alert.alert(t('common.success'), t('security.emailChanged'));
      setShowEmailForm(false);
      setNewEmail('');
      setEmailPassword('');
    } catch (error: any) {
      let message = t('security.emailChangeError');
      if (error.code === 'auth/wrong-password') {
        message = t('security.wrongPassword');
      } else if (error.code === 'auth/email-already-in-use') {
        message = t('security.emailInUse');
      } else if (error.code === 'auth/invalid-email') {
        message = t('security.invalidEmail');
      }
      Alert.alert(t('common.error'), message);
    } finally {
      setIsChangingEmail(false);
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
        {isBiometricAvailable && (
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
        )}

        {/* Password Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('security.passwordTitle')}</Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            {!showPasswordForm ? (
              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => setShowPasswordForm(true)}
              >
                <View style={styles.settingInfo}>
                  <Text style={styles.settingIcon}>🔑</Text>
                  <View>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>{t('security.changePassword')}</Text>
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                      {t('security.changePasswordSubtitle')}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.arrow, { color: colors.textTertiary }]}>→</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.form, { borderTopColor: colors.border }]}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>{t('security.currentPassword')}</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="••••••••"
                    placeholderTextColor={colors.textTertiary}
                    secureTextEntry
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>{t('security.newPassword')}</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="••••••••"
                    placeholderTextColor={colors.textTertiary}
                    secureTextEntry
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>{t('security.confirmPassword')}</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="••••••••"
                    placeholderTextColor={colors.textTertiary}
                    secureTextEntry
                  />
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                  >
                    <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.saveButton, isChangingPassword && styles.saveButtonDisabled]}
                    onPress={handleChangePassword}
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <ActivityIndicator color={COLORS.white} size="small" />
                    ) : (
                      <Text style={styles.saveButtonText}>{t('common.save')}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Email Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('security.emailTitle')}</Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={[styles.currentEmail, { borderBottomColor: colors.border }]}>
              <Text style={[styles.currentEmailLabel, { color: colors.textSecondary }]}>{t('security.currentEmail')}</Text>
              <Text style={[styles.currentEmailValue, { color: colors.text }]}>{user?.email || '-'}</Text>
            </View>

            {!showEmailForm ? (
              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => setShowEmailForm(true)}
              >
                <View style={styles.settingInfo}>
                  <Text style={styles.settingIcon}>✉️</Text>
                  <View>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>{t('security.changeEmail')}</Text>
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                      {t('security.changeEmailSubtitle')}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.arrow, { color: colors.textTertiary }]}>→</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.form, { borderTopColor: colors.border }]}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>{t('security.newEmail')}</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                    value={newEmail}
                    onChangeText={setNewEmail}
                    placeholder="neue@email.de"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>{t('security.confirmWithPassword')}</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                    value={emailPassword}
                    onChangeText={setEmailPassword}
                    placeholder="••••••••"
                    placeholderTextColor={colors.textTertiary}
                    secureTextEntry
                  />
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setShowEmailForm(false);
                      setNewEmail('');
                      setEmailPassword('');
                    }}
                  >
                    <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.saveButton, isChangingEmail && styles.saveButtonDisabled]}
                    onPress={handleChangeEmail}
                    disabled={isChangingEmail}
                  >
                    {isChangingEmail ? (
                      <ActivityIndicator color={COLORS.white} size="small" />
                    ) : (
                      <Text style={styles.saveButtonText}>{t('common.save')}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Info */}
        <View style={[styles.infoBox, { backgroundColor: colors.primary + '15' }]}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>{t('security.infoText')}</Text>
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
  actionRow: {
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
  arrow: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gray[400],
  },
  form: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray[700],
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[900],
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.gray[600],
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
  currentEmail: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  currentEmailLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginBottom: SPACING.xs,
  },
  currentEmailValue: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.gray[900],
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
