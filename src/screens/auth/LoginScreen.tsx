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
import { useAuthStore } from '@/stores';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { DEV_LOGIN_ENABLED } from '@/constants/config';

type AuthMode = 'login' | 'register' | 'forgot';

export const LoginScreen: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login, register, forgotPassword, devLogin, isLoading, error, clearError } =
    useAuthStore();

  const handleSubmit = async () => {
    clearError();

    if (!email.trim()) {
      Alert.alert('Fehler', 'Bitte E-Mail eingeben');
      return;
    }

    if (mode === 'forgot') {
      const result = await forgotPassword(email);
      if (result.success) {
        Alert.alert('Erfolg', 'Passwort-Reset E-Mail wurde gesendet');
        setMode('login');
      }
      return;
    }

    if (!password) {
      Alert.alert('Fehler', 'Bitte Passwort eingeben');
      return;
    }

    if (mode === 'register') {
      if (password.length < 6) {
        Alert.alert('Fehler', 'Passwort muss mindestens 6 Zeichen haben');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Fehler', 'Passwörter stimmen nicht überein');
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
      `${provider.charAt(0).toUpperCase() + provider.slice(1)} Login wird nach der Firebase-Konfiguration verfügbar sein.`
    );
  };

  const handleDevLogin = () => {
    if (DEV_LOGIN_ENABLED) {
      devLogin();
    }
  };

  const renderHeader = () => {
    const titles = {
      login: 'Willkommen zurück',
      register: 'Konto erstellen',
      forgot: 'Passwort vergessen',
    };

    const subtitles = {
      login: 'Melde dich an, um fortzufahren',
      register: 'Erstelle ein kostenloses Konto',
      forgot: 'Wir senden dir einen Reset-Link',
    };

    return (
      <View style={styles.header}>
        <Text style={styles.logo}>FitTrack</Text>
        <Text style={styles.title}>{titles[mode]}</Text>
        <Text style={styles.subtitle}>{subtitles[mode]}</Text>
      </View>
    );
  };

  const renderInputs = () => (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>E-Mail</Text>
        <TextInput
          style={styles.input}
          placeholder="deine@email.de"
          placeholderTextColor={COLORS.gray[400]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>

      {mode !== 'forgot' && (
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Passwort</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Dein Passwort"
              placeholderTextColor={COLORS.gray[400]}
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
          <Text style={styles.inputLabel}>Passwort bestätigen</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Passwort wiederholen"
              placeholderTextColor={COLORS.gray[400]}
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
          <Text style={styles.forgotText}>Passwort vergessen?</Text>
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
      login: 'Anmelden',
      register: 'Registrieren',
      forgot: 'Reset-Link senden',
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
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>oder</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialLogin('google')}
          >
            <Text style={styles.socialIcon}>G</Text>
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('apple')}
            >
              <Text style={styles.socialIcon}></Text>
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialLogin('facebook')}
          >
            <Text style={[styles.socialIcon, { color: '#1877F2' }]}>f</Text>
            <Text style={styles.socialText}>Facebook</Text>
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
            <Text style={styles.modeSwitchLink}>Zurück zur Anmeldung</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.modeSwitch}>
        <Text style={styles.modeSwitchText}>
          {mode === 'login' ? 'Noch kein Konto?' : 'Bereits ein Konto?'}
        </Text>
        <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
          <Text style={styles.modeSwitchLink}>
            {mode === 'login' ? 'Registrieren' : 'Anmelden'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDevLogin = () => {
    if (!DEV_LOGIN_ENABLED) return null;

    return (
      <TouchableOpacity style={styles.devButton} onPress={handleDevLogin}>
        <Text style={styles.devButtonText}>DEV LOGIN (Skip Auth)</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
