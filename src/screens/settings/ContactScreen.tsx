// /workspaces/claude-workspace/fitnessapp/src/screens/settings/ContactScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useTheme } from '@/contexts';

const CONTACT_EMAIL = 'info@kaiashapes.de';

export const ContactScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();

  const handleDirectEmail = () => {
    Linking.openURL(`mailto:${CONTACT_EMAIL}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('contact.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>📧</Text>
          <Text style={[styles.infoTitle, { color: colors.text }]}>{t('contact.infoTitle')}</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>{t('contact.infoText')}</Text>
          <TouchableOpacity onPress={handleDirectEmail} style={styles.emailLink}>
            <Text style={styles.emailLinkText}>{t('contact.clickHere')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: SPACING.sm,
    marginLeft: -SPACING.sm,
  },
  backIcon: {
    fontSize: FONT_SIZES['2xl'],
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  infoCard: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING['2xl'],
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  infoTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: FONT_SIZES.base,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  emailLink: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
  },
  emailLinkText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
});
