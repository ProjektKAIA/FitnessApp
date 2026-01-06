// src/screens/settings/DeleteAccountScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  getAuth,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { useUserStore } from '@/stores';

export const DeleteAccountScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const logout = useUserStore((state) => state.logout);
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const requiredConfirmText = t('deleteAccount.confirmWord');
  const isConfirmValid = confirmText.toLowerCase() === requiredConfirmText.toLowerCase();
  const canDelete = password.length > 0 && isConfirmValid;

  const handleDeleteAccount = async () => {
    if (!canDelete) return;

    Alert.alert(
      t('deleteAccount.finalConfirmTitle'),
      t('deleteAccount.finalConfirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('deleteAccount.deleteForever'),
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              const auth = getAuth();
              const user = auth.currentUser;

              if (!user || !user.email) {
                throw new Error('No user logged in');
              }

              // Re-authenticate before deletion
              const credential = EmailAuthProvider.credential(user.email, password);
              await reauthenticateWithCredential(user, credential);

              // Delete the user
              await deleteUser(user);

              // Clear local data
              logout();

              Alert.alert(
                t('deleteAccount.successTitle'),
                t('deleteAccount.successMessage')
              );
            } catch (error: unknown) {
              console.error('[DeleteAccount]:', error);
              const errorCode = (error as { code?: string })?.code;

              if (errorCode === 'auth/wrong-password') {
                Alert.alert(t('common.error'), t('deleteAccount.wrongPassword'));
              } else if (errorCode === 'auth/too-many-requests') {
                Alert.alert(t('common.error'), t('deleteAccount.tooManyRequests'));
              } else if (errorCode === 'auth/requires-recent-login') {
                Alert.alert(t('common.error'), t('deleteAccount.requiresRecentLogin'));
              } else {
                Alert.alert(t('common.error'), t('deleteAccount.error'));
              }
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('deleteAccount.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Card style={styles.warningCard}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningTitle}>{t('deleteAccount.warningTitle')}</Text>
          <Text style={styles.warningText}>{t('deleteAccount.warningText')}</Text>
        </Card>

        <Text style={styles.sectionTitle}>{t('deleteAccount.whatWillBeDeleted')}</Text>
        <Card style={styles.listCard}>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listText}>{t('deleteAccount.deleteItem1')}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listText}>{t('deleteAccount.deleteItem2')}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listText}>{t('deleteAccount.deleteItem3')}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listText}>{t('deleteAccount.deleteItem4')}</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>{t('deleteAccount.confirmIdentity')}</Text>
        <Card style={styles.formCard}>
          <Text style={styles.inputLabel}>{t('deleteAccount.enterPassword')}</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="••••••••"
              placeholderTextColor={COLORS.gray[400]}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>
            {t('deleteAccount.typeToConfirm', { word: requiredConfirmText })}
          </Text>
          <TextInput
            style={styles.input}
            value={confirmText}
            onChangeText={setConfirmText}
            placeholder={requiredConfirmText}
            placeholderTextColor={COLORS.gray[400]}
            autoCapitalize="none"
          />
        </Card>

        <TouchableOpacity
          style={[styles.deleteButton, !canDelete && styles.deleteButtonDisabled]}
          onPress={handleDeleteAccount}
          disabled={!canDelete || isDeleting}
        >
          <Text style={styles.deleteButtonText}>
            {isDeleting ? t('deleteAccount.deleting') : t('deleteAccount.deleteButton')}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>{t('deleteAccount.disclaimer')}</Text>
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
    paddingBottom: SPACING['3xl'],
  },
  warningCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.lg,
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
  },
  warningIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  warningTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: SPACING.xs,
  },
  warningText: {
    fontSize: FONT_SIZES.sm,
    color: '#B91C1C',
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  listCard: {
    marginBottom: SPACING.lg,
  },
  listItem: {
    flexDirection: 'row',
    paddingVertical: SPACING.xs,
  },
  listBullet: {
    fontSize: FONT_SIZES.base,
    color: '#DC2626',
    marginRight: SPACING.sm,
    fontWeight: '700',
  },
  listText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[700],
    lineHeight: 20,
  },
  formCard: {
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray[700],
    marginBottom: SPACING.xs,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    marginBottom: SPACING.lg,
  },
  passwordInput: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[900],
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  eyeButton: {
    padding: SPACING.md,
  },
  eyeIcon: {
    fontSize: 20,
  },
  input: {
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[900],
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  deleteButtonDisabled: {
    backgroundColor: COLORS.gray[300],
  },
  deleteButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
  disclaimer: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[400],
    textAlign: 'center',
    lineHeight: 18,
  },
});
