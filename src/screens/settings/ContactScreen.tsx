// /workspaces/claude-workspace/fitnessapp/src/screens/settings/ContactScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useUserStore } from '@/stores';
import { useTheme } from '@/contexts';

const CONTACT_EMAIL = 'info@kaiashapes.de';

export const ContactScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const user = useUserStore((state) => state.user);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validierung
    if (!name.trim()) {
      Alert.alert(t('common.error'), t('contact.errorName'));
      return;
    }
    if (!email.trim()) {
      Alert.alert(t('common.error'), t('contact.errorEmail'));
      return;
    }
    if (!subject.trim()) {
      Alert.alert(t('common.error'), t('contact.errorSubject'));
      return;
    }
    if (!message.trim()) {
      Alert.alert(t('common.error'), t('contact.errorMessage'));
      return;
    }

    setIsSubmitting(true);

    // E-Mail über mailto: öffnen
    const mailtoBody = `${message}\n\n---\nName: ${name}\nE-Mail: ${email}`;
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
        // Formular zurücksetzen nach erfolgreichem Öffnen
        setSubject('');
        setMessage('');
        Alert.alert(
          t('contact.successTitle'),
          t('contact.successMessage'),
          [{ text: t('common.ok'), onPress: () => navigation.goBack() }]
        );
      } else {
        // Fallback: E-Mail-Adresse kopieren
        Alert.alert(
          t('contact.noMailAppTitle'),
          t('contact.noMailAppMessage', { email: CONTACT_EMAIL })
        );
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('contact.errorSending'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectEmail = () => {
    Linking.openURL(`mailto:${CONTACT_EMAIL}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('contact.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>📧</Text>
            <Text style={[styles.infoTitle, { color: colors.text }]}>{t('contact.infoTitle')}</Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>{t('contact.infoText')}</Text>
            <TouchableOpacity onPress={handleDirectEmail} style={styles.emailLink}>
              <Text style={styles.emailLinkText}>{CONTACT_EMAIL}</Text>
            </TouchableOpacity>
          </View>

          {/* Formular */}
          <View style={[styles.form, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('contact.formTitle')}</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{t('contact.name')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                value={name}
                onChangeText={setName}
                placeholder={t('contact.namePlaceholder')}
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{t('contact.email')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                value={email}
                onChangeText={setEmail}
                placeholder={t('contact.emailPlaceholder')}
                placeholderTextColor={colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{t('contact.subject')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                value={subject}
                onChangeText={setSubject}
                placeholder={t('contact.subjectPlaceholder')}
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{t('contact.message')}</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                value={message}
                onChangeText={setMessage}
                placeholder={t('contact.messagePlaceholder')}
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? t('contact.sending') : t('contact.send')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Weitere Kontaktmöglichkeiten */}
          <View style={styles.alternativeContact}>
            <Text style={[styles.alternativeTitle, { color: colors.textSecondary }]}>{t('contact.alternativeTitle')}</Text>
            <Text style={[styles.alternativeText, { color: colors.textTertiary }]}>{t('contact.alternativeText')}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
  },
  keyboardView: {
    flex: 1,
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
  infoCard: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  infoIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  infoTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  emailLink: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  emailLinkText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
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
  textArea: {
    minHeight: 120,
    paddingTop: SPACING.md,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
  alternativeContact: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  alternativeTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[500],
    marginBottom: SPACING.xs,
  },
  alternativeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
    textAlign: 'center',
  },
});
