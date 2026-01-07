import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { DEV_LOGIN_ENABLED } from '@/constants/config';
import { useTheme } from '@/contexts/ThemeContext';

type AuthMode = 'login' | 'register' | 'forgot';

export const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const devLogin = useAuthStore((state) => state.devLogin);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const handleSubmit = async () => {
    clearError();

    if (!email.trim()) {
      Alert.alert(t('common.error'), t('auth.errorEmailRequired'));
      return;
    }

    if (mode === 'forgot') {
      const result = await forgotPassword(email);
      if (result.success) {
        Alert.alert(t('common.success'), t('auth.successResetEmail'));
        setMode('login');
      }
      return;
    }

    if (!password) {
      Alert.alert(t('common.error'), t('auth.errorPasswordRequired'));
      return;
    }

    if (mode === 'register') {
      if (password.length < 6) {
        Alert.alert(t('common.error'), t('auth.errorPasswordLength'));
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert(t('common.error'), t('auth.errorPasswordMismatch'));
        return;
      }
      await register(email, password);
    } else {
      await login(email, password);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook' | 'apple') => {
    Alert.alert(
      'Social Login',
      t('auth.socialLoginMessage', { provider: provider.charAt(0).toUpperCase() + provider.slice(1) })
    );
  };

  const handleDevLogin = () => {
    if (DEV_LOGIN_ENABLED) {
      devLogin();
    }
  };

  const renderHeader = () => {
    const titles = {
      login: t('auth.welcomeBack'),
      register: t('auth.createAccount'),
      forgot: t('auth.forgotPassword'),
    };

    const subtitles = {
      login: t('auth.loginSubtitle'),
      register: t('auth.registerSubtitle'),
      forgot: t('auth.forgotSubtitle'),
    };

    return (
      <View style={styles.header}>
        <Text style={[styles.logo, { color: colors.accent }]}>{t('auth.logo')}</Text>
        <Text style={[styles.title, { color: colors.text }]}>{titles[mode]}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitles[mode]}</Text>
      </View>
    );
  };

  const renderInputs = () => (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('auth.email')}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder={t('auth.emailPlaceholder')}
          placeholderTextColor={colors.inputPlaceholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>

      {mode !== 'forgot' && (
        <View style={styles.inputWrapper}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('auth.password')}</Text>
          <View style={[styles.passwordContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              style={[styles.passwordInput, { color: colors.text }]}
              placeholder={t('auth.passwordPlaceholder')}
              placeholderTextColor={colors.inputPlaceholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? '👁' : '👁‍🗨'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {mode === 'register' && (
        <View style={styles.inputWrapper}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('auth.confirmPassword')}</Text>
          <View style={[styles.passwordContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              style={[styles.passwordInput, { color: colors.text }]}
              placeholder={t('auth.confirmPasswordPlaceholder')}
              placeholderTextColor={colors.inputPlaceholder}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁' : '👁‍🗨'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {mode === 'login' && (
        <TouchableOpacity style={styles.forgotLink} onPress={() => setMode('forgot')}>
          <Text style={[styles.forgotText, { color: colors.accent }]}>{t('auth.forgotLink')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderError = () => {
    if (!error) return null;
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  };

  const renderSubmitButton = () => {
    const buttonTexts = {
      login: t('auth.login'),
      register: t('auth.register'),
      forgot: t('auth.sendResetLink'),
    };

    return (
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <LinearGradient
          colors={[COLORS.accent, '#FF6B3D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitText}>{buttonTexts[mode]}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderSocialButtons = () => {
    if (mode === 'forgot') return null;

    return (
      <View style={styles.socialContainer}>
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textTertiary }]}>{t('common.or')}</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => handleSocialLogin('google')}
          >
            <Text style={[styles.socialIcon, { color: colors.text }]}>G</Text>
            <Text style={[styles.socialText, { color: colors.text }]}>Google</Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => handleSocialLogin('apple')}
            >
              <Text style={[styles.socialIcon, { color: colors.text }]}></Text>
              <Text style={[styles.socialText, { color: colors.text }]}>Apple</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => handleSocialLogin('facebook')}
          >
            <Text style={[styles.socialIcon, { color: '#1877F2' }]}>f</Text>
            <Text style={[styles.socialText, { color: colors.text }]}>Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderModeSwitch = () => {
    if (mode === 'forgot') {
      return (
        <View style={styles.modeSwitch}>
          <TouchableOpacity onPress={() => setMode('login')}>
            <Text style={[styles.modeSwitchLink, { color: colors.accent }]}>{t('auth.backToLogin')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.modeSwitch}>
        <Text style={[styles.modeSwitchText, { color: colors.textSecondary }]}>
          {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}
        </Text>
        <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
          <Text style={[styles.modeSwitchLink, { color: colors.accent }]}>
            {mode === 'login' ? t('auth.register') : t('auth.login')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDevLogin = () => {
    if (!DEV_LOGIN_ENABLED) return null;

    return (
      <TouchableOpacity style={styles.devButton} onPress={handleDevLogin}>
        <Text style={styles.devButtonText}>{t('auth.devLogin')}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderHeader()}
          {renderError()}
          {renderInputs()}
          {renderSubmitButton()}
          {renderSocialButtons()}
          {renderModeSwitch()}
          {renderDevLogin()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[900],
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING['2xl'],
    paddingTop: SPACING['4xl'],
    paddingBottom: SPACING['2xl'],
  },
  header: {
    marginBottom: SPACING['3xl'],
    alignItems: 'center',
  },
  logo: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '700',
    color: COLORS.accent,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[400],
  },
  inputContainer: {
    marginBottom: SPACING.xl,
  },
  inputWrapper: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray[300],
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray[700],
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.gray[700],
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
  },
  eyeButton: {
    padding: SPACING.md,
    paddingRight: SPACING.lg,
  },
  eyeIcon: {
    fontSize: FONT_SIZES.xl,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: SPACING.sm,
  },
  forgotText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.accent,
  },
  errorContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    textAlign: 'center',
  },
  submitButton: {
    marginBottom: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.white,
  },
  socialContainer: {
    marginBottom: SPACING.xl,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray[700],
  },
  dividerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginHorizontal: SPACING.lg,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[800],
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.gray[700],
    gap: SPACING.sm,
  },
  socialIcon: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
  socialText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    fontWeight: '500',
  },
  modeSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  modeSwitchText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[400],
  },
  modeSwitchLink: {
    fontSize: FONT_SIZES.base,
    color: COLORS.accent,
    fontWeight: '600',
  },
  devButton: {
    marginTop: SPACING['3xl'],
    backgroundColor: COLORS.purple,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    alignSelf: 'center',
  },
  devButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
});
