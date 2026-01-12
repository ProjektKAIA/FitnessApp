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
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { useUserStore, useWorkoutStore } from '@/stores';
import { useTheme } from '@/contexts';
import { storage } from '@/lib';

export const DeleteAccountScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const logout = useUserStore((state) => state.logout);
  const setWorkouts = useWorkoutStore((state) => state.setWorkouts);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const requiredConfirmText = t('deleteAccount.confirmWord');
  const isConfirmValid = confirmText.toLowerCase() === requiredConfirmText.toLowerCase();

  const handleDeleteData = async () => {
    if (!isConfirmValid) return;

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
              // Clear workouts
              setWorkouts([]);

              // Clear all storage (this clears all persisted store data)
              await storage.clear();

              // Logout (resets user store)
              logout();

              Alert.alert(
                t('deleteAccount.successTitle'),
                t('deleteAccount.successMessage'),
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch {
              Alert.alert(t('common.error'), t('deleteAccount.error'));
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('deleteAccount.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Card style={styles.warningCard}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningTitle}>{t('deleteAccount.warningTitle')}</Text>
          <Text style={styles.warningText}>{t('deleteAccount.warningText')}</Text>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('deleteAccount.whatWillBeDeleted')}</Text>
        <Card style={styles.listCard}>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={[styles.listText, { color: colors.textSecondary }]}>{t('deleteAccount.deleteItem1')}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={[styles.listText, { color: colors.textSecondary }]}>{t('deleteAccount.deleteItem2')}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={[styles.listText, { color: colors.textSecondary }]}>{t('deleteAccount.deleteItem3')}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={[styles.listText, { color: colors.textSecondary }]}>{t('deleteAccount.deleteItem4')}</Text>
          </View>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('deleteAccount.confirmSection')}</Text>
        <Card style={styles.formCard}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            {t('deleteAccount.typeToConfirm', { word: requiredConfirmText })}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            value={confirmText}
            onChangeText={setConfirmText}
            placeholder={requiredConfirmText}
            placeholderTextColor={colors.textTertiary}
            autoCapitalize="none"
          />
        </Card>

        <TouchableOpacity
          style={[styles.deleteButton, !isConfirmValid && styles.deleteButtonDisabled]}
          onPress={handleDeleteData}
          disabled={!isConfirmValid || isDeleting}
        >
          <Text style={styles.deleteButtonText}>
            {isDeleting ? t('deleteAccount.deleting') : t('deleteAccount.deleteButton')}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>{t('deleteAccount.disclaimer')}</Text>
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
