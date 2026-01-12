// /workspaces/claude-workspace/fitnessapp/src/screens/settings/DataBackupScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { useTheme } from '@/contexts';
import {
  useBackupStore,
  BackupStorageType,
  AutoBackupFrequency,
} from '@/stores';
import {
  createBackupFile,
  readBackupFile,
  restoreBackup,
  calculateDataSize,
  formatFileSize,
  BackupData,
} from '@/services/backup/backupService';
import {
  saveToCloud,
  loadFromCloud,
  isCloudStorageAvailable,
  getCloudServiceName,
  getStorageTypeIcon,
  getRecommendedStorageType,
} from '@/services/backup/cloudStorageService';
import { safeJsonParse, isValidBackupData } from '@/lib';

interface StorageOption {
  type: BackupStorageType;
  icon: string;
  available: boolean;
}

const STORAGE_OPTIONS: StorageOption[] = [
  { type: 'local', icon: '📱', available: true },
  { type: 'icloud', icon: '☁️', available: Platform.OS === 'ios' },
  { type: 'gdrive', icon: '📁', available: Platform.OS === 'android' },
];

const FREQUENCY_OPTIONS: { key: AutoBackupFrequency; icon: string }[] = [
  { key: 'after_workout', icon: '🏋️' },
  { key: 'daily', icon: '📅' },
  { key: 'weekly', icon: '📆' },
  { key: 'manual', icon: '✋' },
];

export const DataBackupScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();

  // Store
  const {
    storageType,
    autoBackupFrequency,
    lastBackup,
    backupHistory,
    isBackingUp,
    isRestoring,
    setStorageType,
    setAutoBackupFrequency,
    addBackupToHistory,
    setBackingUp,
    setRestoring,
    setError,
  } = useBackupStore();

  // Local State
  const [dataSize, setDataSize] = useState<number>(0);
  const [isCloudAvailable, setIsCloudAvailable] = useState(false);

  useEffect(() => {
    // Datengröße berechnen
    const size = calculateDataSize();
    setDataSize(size);

    // Cloud-Verfügbarkeit prüfen
    isCloudStorageAvailable().then(setIsCloudAvailable);
  }, []);

  const handleStorageTypeChange = (type: BackupStorageType) => {
    if (type === 'icloud' && Platform.OS !== 'ios') {
      Alert.alert(t('backup.error'), t('backup.icloudOnlyIOS'));
      return;
    }
    if (type === 'gdrive' && Platform.OS !== 'android') {
      Alert.alert(t('backup.error'), t('backup.gdriveOnlyAndroid'));
      return;
    }
    setStorageType(type);
  };

  const handleCreateBackup = async () => {
    if (isBackingUp) return;

    setBackingUp(true);
    setError(null);

    try {
      // Backup-Datei erstellen
      const backupMeta = await createBackupFile();

      if (storageType === 'local') {
        // Nur lokal speichern - Share Sheet öffnen damit User entscheiden kann
        const result = await saveToCloud(backupMeta.filePath, backupMeta.fileName);

        if (result.success) {
          addBackupToHistory({
            fileName: backupMeta.fileName,
            createdAt: backupMeta.createdAt.toISOString(),
            size: backupMeta.size,
            storageType: 'local',
          });

          Alert.alert(
            t('backup.success'),
            t('backup.backupCreated', { fileName: backupMeta.fileName })
          );
        }
      } else {
        // Cloud-Speicher (iCloud/Google Drive)
        const result = await saveToCloud(backupMeta.filePath, backupMeta.fileName);

        if (result.success) {
          addBackupToHistory({
            fileName: backupMeta.fileName,
            createdAt: backupMeta.createdAt.toISOString(),
            size: backupMeta.size,
            storageType,
            cloudPath: result.filePath,
          });

          Alert.alert(
            t('backup.success'),
            t('backup.backupSavedTo', {
              location: getCloudServiceName(storageType),
            })
          );
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      Alert.alert(t('backup.error'), t('backup.backupFailed'));
    } finally {
      setBackingUp(false);
    }
  };

  const handleRestoreBackup = async () => {
    if (isRestoring) return;

    // Warnung anzeigen
    Alert.alert(
      t('backup.restoreTitle'),
      t('backup.restoreWarning'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('backup.restore'),
          style: 'destructive',
          onPress: performRestore,
        },
      ]
    );
  };

  const performRestore = async () => {
    setRestoring(true);
    setError(null);

    try {
      // Datei auswählen
      const loadResult = await loadFromCloud();

      if (!loadResult.success || !loadResult.content) {
        if (loadResult.error !== 'User cancelled') {
          Alert.alert(t('backup.error'), loadResult.error || t('backup.loadFailed'));
        }
        return;
      }

      // Backup sicher parsen und validieren
      const parseResult = safeJsonParse(loadResult.content, isValidBackupData);
      if (!parseResult.success || !parseResult.data) {
        Alert.alert(t('backup.error'), t('backup.invalidBackup'));
        return;
      }

      const backupData = parseResult.data as BackupData;

      // Optionen anzeigen
      Alert.alert(
        t('backup.restoreOptions'),
        t('backup.restoreOptionsDesc', {
          date: new Date(backupData.createdAt).toLocaleDateString(),
          version: backupData.version,
        }),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('backup.replaceAll'),
            style: 'destructive',
            onPress: () => executeRestore(backupData, 'replace'),
          },
          {
            text: t('backup.mergeData'),
            onPress: () => executeRestore(backupData, 'merge'),
          },
        ]
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      Alert.alert(t('backup.error'), t('backup.restoreFailed'));
    } finally {
      setRestoring(false);
    }
  };

  const executeRestore = async (
    backupData: BackupData,
    mode: 'replace' | 'merge'
  ) => {
    setRestoring(true);

    try {
      const result = await restoreBackup(backupData, {
        mergeMode: mode,
      });

      if (result.success) {
        Alert.alert(t('backup.success'), t('backup.restoreComplete'));
      } else {
        Alert.alert(t('backup.error'), result.error || t('backup.restoreFailed'));
      }
    } catch {
      Alert.alert(t('backup.error'), t('backup.restoreFailed'));
    } finally {
      setRestoring(false);
    }
  };

  const formatLastBackupDate = (): string => {
    if (!lastBackup) return t('backup.never');

    const date = new Date(lastBackup.createdAt);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('backup.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoIcon}>💾</Text>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            {t('backup.infoTitle')}
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {t('backup.infoText')}
          </Text>
          <View style={styles.dataSizeRow}>
            <Text style={[styles.dataSizeLabel, { color: colors.textSecondary }]}>
              {t('backup.currentDataSize')}
            </Text>
            <Text style={[styles.dataSizeValue, { color: colors.text }]}>
              {formatFileSize(dataSize)}
            </Text>
          </View>
        </Card>

        {/* Storage Type Selection */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('backup.storageLocation')}
        </Text>
        <Card style={styles.optionsCard}>
          {STORAGE_OPTIONS.filter((opt) => opt.available).map((option) => (
            <TouchableOpacity
              key={option.type}
              style={[
                styles.storageOption,
                { borderBottomColor: colors.border },
              ]}
              onPress={() => handleStorageTypeChange(option.type)}
            >
              <Text style={styles.storageIcon}>{option.icon}</Text>
              <View style={styles.storageContent}>
                <Text style={[styles.storageName, { color: colors.text }]}>
                  {getCloudServiceName(option.type)}
                </Text>
                <Text
                  style={[styles.storageDesc, { color: colors.textSecondary }]}
                >
                  {t(`backup.storageDesc.${option.type}`)}
                </Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  storageType === option.type && styles.radioButtonSelected,
                ]}
              >
                {storageType === option.type && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Auto Backup Frequency */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('backup.autoBackup')}
        </Text>
        <Card style={styles.optionsCard}>
          {FREQUENCY_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.frequencyOption,
                { borderBottomColor: colors.border },
              ]}
              onPress={() => setAutoBackupFrequency(option.key)}
            >
              <Text style={styles.frequencyIcon}>{option.icon}</Text>
              <Text style={[styles.frequencyName, { color: colors.text }]}>
                {t(`backup.frequency.${option.key}`)}
              </Text>
              <View
                style={[
                  styles.radioButton,
                  autoBackupFrequency === option.key &&
                    styles.radioButtonSelected,
                ]}
              >
                {autoBackupFrequency === option.key && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Action Buttons */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.primaryButton,
            isBackingUp && styles.buttonDisabled,
          ]}
          onPress={handleCreateBackup}
          disabled={isBackingUp}
        >
          {isBackingUp ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <>
              <Text style={styles.actionButtonIcon}>📤</Text>
              <Text style={styles.actionButtonText}>
                {t('backup.createBackup')}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.secondaryButton,
            { borderColor: colors.border },
            isRestoring && styles.buttonDisabled,
          ]}
          onPress={handleRestoreBackup}
          disabled={isRestoring}
        >
          {isRestoring ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : (
            <>
              <Text style={styles.actionButtonIcon}>📥</Text>
              <Text
                style={[styles.actionButtonTextSecondary, { color: colors.text }]}
              >
                {t('backup.restoreBackup')}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Last Backup Info */}
        <Card style={styles.lastBackupCard}>
          <View style={styles.lastBackupRow}>
            <Text style={[styles.lastBackupLabel, { color: colors.textSecondary }]}>
              {t('backup.lastBackup')}
            </Text>
            <Text style={[styles.lastBackupValue, { color: colors.text }]}>
              {formatLastBackupDate()}
            </Text>
          </View>
          {lastBackup && (
            <>
              <View style={styles.lastBackupRow}>
                <Text
                  style={[styles.lastBackupLabel, { color: colors.textSecondary }]}
                >
                  {t('backup.size')}
                </Text>
                <Text style={[styles.lastBackupValue, { color: colors.text }]}>
                  {formatFileSize(lastBackup.size)}
                </Text>
              </View>
              <View style={styles.lastBackupRow}>
                <Text
                  style={[styles.lastBackupLabel, { color: colors.textSecondary }]}
                >
                  {t('backup.location')}
                </Text>
                <Text style={[styles.lastBackupValue, { color: colors.text }]}>
                  {getStorageTypeIcon(lastBackup.storageType)}{' '}
                  {getCloudServiceName(lastBackup.storageType)}
                </Text>
              </View>
            </>
          )}
        </Card>

        {/* Backup History */}
        {backupHistory.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {t('backup.history')}
            </Text>
            <Card style={styles.historyCard}>
              {backupHistory.slice(0, 5).map((backup, index) => (
                <View
                  key={`${backup.fileName}-${index}`}
                  style={[
                    styles.historyItem,
                    { borderBottomColor: colors.border },
                    index === backupHistory.slice(0, 5).length - 1 &&
                      styles.historyItemLast,
                  ]}
                >
                  <Text style={styles.historyIcon}>
                    {getStorageTypeIcon(backup.storageType)}
                  </Text>
                  <View style={styles.historyContent}>
                    <Text
                      style={[styles.historyFileName, { color: colors.text }]}
                      numberOfLines={1}
                    >
                      {backup.fileName}
                    </Text>
                    <Text
                      style={[
                        styles.historyDate,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {new Date(backup.createdAt).toLocaleDateString('de-DE')} •{' '}
                      {formatFileSize(backup.size)}
                    </Text>
                  </View>
                </View>
              ))}
            </Card>
          </>
        )}

        {/* Privacy Note */}
        <Text style={[styles.privacyNote, { color: colors.textTertiary }]}>
          {t('backup.privacyNote')}
        </Text>
      </ScrollView>
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
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  dataSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  dataSizeLabel: {
    fontSize: FONT_SIZES.sm,
    marginRight: SPACING.sm,
  },
  dataSizeValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  optionsCard: {
    padding: 0,
    marginBottom: SPACING.md,
  },
  storageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
  },
  storageIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  storageContent: {
    flex: 1,
  },
  storageName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
  },
  storageDesc: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
  },
  frequencyIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  frequencyName: {
    flex: 1,
    fontSize: FONT_SIZES.base,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  actionButtonIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
  actionButtonTextSecondary: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  lastBackupCard: {
    marginTop: SPACING.md,
    padding: SPACING.lg,
  },
  lastBackupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  lastBackupLabel: {
    fontSize: FONT_SIZES.sm,
  },
  lastBackupValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  historyCard: {
    padding: 0,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  historyItemLast: {
    borderBottomWidth: 0,
  },
  historyIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  historyContent: {
    flex: 1,
  },
  historyFileName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  historyDate: {
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  privacyNote: {
    fontSize: FONT_SIZES.xs,
    textAlign: 'center',
    marginTop: SPACING.xl,
    lineHeight: 18,
  },
});
