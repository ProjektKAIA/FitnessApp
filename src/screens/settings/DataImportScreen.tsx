// src/screens/settings/DataImportScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { useUserStore } from '@/stores';
import { useHealthStore } from '@/stores/healthStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useTheme } from '@/contexts';

interface ImportData {
  exportDate?: string;
  appVersion?: string;
  profile?: Record<string, unknown>;
  workouts?: unknown[];
  health?: {
    todaySummary?: unknown;
    settings?: {
      stepsGoal?: number;
      dataTypes?: Record<string, boolean>;
    };
  };
  settings?: Record<string, unknown>;
}

export const DataImportScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const updateProfile = useUserStore((state) => state.updateProfile);
  const updateSettings = useUserStore((state) => state.updateSettings);
  const setStepsGoal = useHealthStore((state) => state.setStepsGoal);
  const setWorkouts = useWorkoutStore((state) => state.setWorkouts);

  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [importData, setImportData] = useState<ImportData | null>(null);
  const [importOptions, setImportOptions] = useState({
    profile: true,
    workouts: true,
    health: true,
    settings: true,
  });

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      setSelectedFile(file.name);

      const importFile = new File(file.uri);
      const content = await importFile.text();

      const data = JSON.parse(content) as ImportData;
      setImportData(data);

      // Auto-select available data types
      setImportOptions({
        profile: !!data.profile,
        workouts: !!data.workouts && data.workouts.length > 0,
        health: !!data.health,
        settings: !!data.settings,
      });
    } catch (error) {
      console.error('[DataImport]:', error);
      Alert.alert(t('common.error'), t('dataImport.invalidFile'));
      setSelectedFile(null);
      setImportData(null);
    }
  };

  const toggleOption = (key: keyof typeof importOptions) => {
    if (!importData) return;

    // Only allow toggling if data exists
    const dataExists = key === 'profile' ? !!importData.profile :
      key === 'workouts' ? !!importData.workouts :
      key === 'health' ? !!importData.health :
      !!importData.settings;

    if (dataExists) {
      setImportOptions((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleImport = async () => {
    if (!importData) return;

    const selectedCount = Object.values(importOptions).filter(Boolean).length;
    if (selectedCount === 0) {
      Alert.alert(t('common.error'), t('dataImport.noSelection'));
      return;
    }

    Alert.alert(
      t('dataImport.confirmTitle'),
      t('dataImport.confirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('dataImport.import'),
          onPress: async () => {
            setIsImporting(true);
            try {
              if (importOptions.profile && importData.profile) {
                updateProfile(importData.profile as Parameters<typeof updateProfile>[0]);
              }

              if (importOptions.workouts && importData.workouts) {
                setWorkouts(importData.workouts as Parameters<typeof setWorkouts>[0]);
              }

              if (importOptions.health && importData.health?.settings) {
                if (importData.health.settings.stepsGoal) {
                  setStepsGoal(importData.health.settings.stepsGoal);
                }
              }

              if (importOptions.settings && importData.settings) {
                updateSettings(importData.settings as Parameters<typeof updateSettings>[0]);
              }

              Alert.alert(t('common.success'), t('dataImport.success'));
              navigation.goBack();
            } catch (error) {
              console.error('[DataImport]:', error);
              Alert.alert(t('common.error'), t('dataImport.error'));
            } finally {
              setIsImporting(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('dataImport.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Card style={styles.infoCard}>
          <Text style={styles.infoIcon}>📥</Text>
          <Text style={styles.infoTitle}>{t('dataImport.infoTitle')}</Text>
          <Text style={styles.infoText}>{t('dataImport.infoText')}</Text>
        </Card>

        <TouchableOpacity style={styles.selectButton} onPress={handleSelectFile}>
          <Text style={styles.selectButtonIcon}>📁</Text>
          <Text style={styles.selectButtonText}>
            {selectedFile || t('dataImport.selectFile')}
          </Text>
        </TouchableOpacity>

        {importData && (
          <>
            <Card style={styles.fileInfoCard}>
              <Text style={styles.fileInfoLabel}>{t('dataImport.exportDate')}</Text>
              <Text style={styles.fileInfoValue}>{formatDate(importData.exportDate)}</Text>
            </Card>

            <Text style={styles.sectionTitle}>{t('dataImport.selectData')}</Text>
            <Card style={styles.optionsCard}>
              <TouchableOpacity
                style={[styles.optionItem, !importData.profile && styles.optionDisabled]}
                onPress={() => toggleOption('profile')}
                disabled={!importData.profile}
              >
                <Text style={styles.optionIcon}>👤</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{t('dataExport.options.profile')}</Text>
                  <Text style={styles.optionStatus}>
                    {importData.profile ? t('dataImport.available') : t('dataImport.notAvailable')}
                  </Text>
                </View>
                <View style={[
                  styles.checkbox,
                  importOptions.profile && styles.checkboxSelected,
                  !importData.profile && styles.checkboxDisabled,
                ]}>
                  {importOptions.profile && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionItem, !importData.workouts && styles.optionDisabled]}
                onPress={() => toggleOption('workouts')}
                disabled={!importData.workouts}
              >
                <Text style={styles.optionIcon}>🏋️</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{t('dataExport.options.workouts')}</Text>
                  <Text style={styles.optionStatus}>
                    {importData.workouts
                      ? t('dataImport.workoutCount', { count: importData.workouts.length })
                      : t('dataImport.notAvailable')}
                  </Text>
                </View>
                <View style={[
                  styles.checkbox,
                  importOptions.workouts && styles.checkboxSelected,
                  !importData.workouts && styles.checkboxDisabled,
                ]}>
                  {importOptions.workouts && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionItem, !importData.health && styles.optionDisabled]}
                onPress={() => toggleOption('health')}
                disabled={!importData.health}
              >
                <Text style={styles.optionIcon}>❤️</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{t('dataExport.options.health')}</Text>
                  <Text style={styles.optionStatus}>
                    {importData.health ? t('dataImport.available') : t('dataImport.notAvailable')}
                  </Text>
                </View>
                <View style={[
                  styles.checkbox,
                  importOptions.health && styles.checkboxSelected,
                  !importData.health && styles.checkboxDisabled,
                ]}>
                  {importOptions.health && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionItem, !importData.settings && styles.optionDisabled]}
                onPress={() => toggleOption('settings')}
                disabled={!importData.settings}
              >
                <Text style={styles.optionIcon}>⚙️</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{t('dataExport.options.settings')}</Text>
                  <Text style={styles.optionStatus}>
                    {importData.settings ? t('dataImport.available') : t('dataImport.notAvailable')}
                  </Text>
                </View>
                <View style={[
                  styles.checkbox,
                  importOptions.settings && styles.checkboxSelected,
                  !importData.settings && styles.checkboxDisabled,
                ]}>
                  {importOptions.settings && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            </Card>

            <TouchableOpacity
              style={[styles.importButton, isImporting && styles.importButtonDisabled]}
              onPress={handleImport}
              disabled={isImporting}
            >
              <Text style={styles.importButtonText}>
                {isImporting ? t('dataImport.importing') : t('dataImport.importButton')}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.disclaimer}>{t('dataImport.disclaimer')}</Text>
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
  infoCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.lg,
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
    lineHeight: 20,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.gray[300],
    marginBottom: SPACING.lg,
  },
  selectButtonIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  selectButtonText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
  },
  fileInfoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  fileInfoLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  fileInfoValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray[900],
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  optionsCard: {
    padding: 0,
    marginBottom: SPACING.xl,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.gray[900],
  },
  optionStatus: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxDisabled: {
    backgroundColor: COLORS.gray[200],
    borderColor: COLORS.gray[200],
  },
  checkmark: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '700',
  },
  importButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  importButtonDisabled: {
    backgroundColor: COLORS.gray[300],
  },
  importButtonText: {
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
