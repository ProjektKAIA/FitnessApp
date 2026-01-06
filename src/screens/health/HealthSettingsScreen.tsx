import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { HealthPermissionCard } from '@/components/health';
import { useHealthStore } from '@/stores/healthStore';
import { getHealthService, getHealthPlatform, isHealthSupported } from '@/services/health';
import { IHealthPermissionStatus, THealthDataType } from '@/types/health';
import { RootStackParamList } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface DataTypeToggleProps {
  icon: string;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const DataTypeToggle: React.FC<DataTypeToggleProps> = ({
  icon,
  label,
  value,
  onValueChange,
  disabled = false,
}) => (
  <View style={styles.toggleItem}>
    <Text style={styles.toggleIcon}>{icon}</Text>
    <Text style={[styles.toggleLabel, disabled && styles.toggleLabelDisabled]}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: COLORS.gray[300], true: COLORS.primary }}
      disabled={disabled}
    />
  </View>
);

export const HealthSettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const [permissionStatus, setPermissionStatus] = useState<IHealthPermissionStatus | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const {
    settings,
    isSyncing,
    setEnabled,
    toggleDataType,
    setStepsGoal,
    setPlatform,
    setPermissionsGranted,
    setSyncing,
    updateLastSync,
    setTodaySummary,
    setWeekSummaries,
    setError,
  } = useHealthStore();

  const healthService = getHealthService();
  const platform = getHealthPlatform();
  const supported = isHealthSupported();

  useEffect(() => {
    if (supported) {
      setPlatform(platform);
      checkPermissions();
    }
  }, [supported]);

  const checkPermissions = async () => {
    if (!healthService) return;
    try {
      const status = await healthService.getPermissionStatus();
      setPermissionStatus(status);
      const allGranted = Object.values(status).every((s) => s === 'granted');
      setPermissionsGranted(allGranted);
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const handleRequestPermission = async () => {
    if (!healthService) return;

    setIsRequestingPermission(true);
    try {
      const enabledTypes: THealthDataType[] = [];
      if (settings.dataTypes.steps) enabledTypes.push('steps');
      if (settings.dataTypes.distance) enabledTypes.push('distance');
      if (settings.dataTypes.calories) enabledTypes.push('calories', 'activeCalories');
      if (settings.dataTypes.heartRate) enabledTypes.push('heartRate', 'restingHeartRate');
      if (settings.dataTypes.workouts) enabledTypes.push('workouts');

      const granted = await healthService.requestPermissions(enabledTypes);
      if (granted) {
        setPermissionsGranted(true);
        await checkPermissions();
        setEnabled(true);
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert(t('common.error'), String(error));
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleToggleEnabled = async (value: boolean) => {
    if (value && !settings.permissionsGranted) {
      await handleRequestPermission();
    } else {
      setEnabled(value);
    }
  };

  const handleSync = async () => {
    if (!healthService || !settings.enabled) return;

    setSyncing(true);
    setError(null);

    try {
      const today = new Date();
      const summary = await healthService.getDailySummary(today);
      setTodaySummary(summary);

      // Get week data
      const weekSummaries = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const daySummary = await healthService.getDailySummary(date);
        weekSummaries.push(daySummary);
      }
      setWeekSummaries(weekSummaries);

      updateLastSync();
      Alert.alert(t('health.sync.success'));
    } catch (error) {
      console.error('Sync error:', error);
      setError(String(error));
      Alert.alert(t('health.sync.error'), String(error));
    } finally {
      setSyncing(false);
    }
  };

  const formatLastSync = (): string => {
    if (!settings.lastSyncAt) return t('health.sync.never');
    const date = new Date(settings.lastSyncAt);
    return date.toLocaleString();
  };

  if (!supported) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('health.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <Card style={styles.card}>
            <Text style={styles.notSupportedText}>
              {t('health.notSupported')}
            </Text>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('health.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>

        {/* Master Toggle */}
        <Card style={styles.card}>
          <View style={styles.masterToggle}>
            <View style={styles.masterToggleInfo}>
              <Text style={styles.platformIcon}>
                {platform === 'apple_health' ? '🍎' : '💚'}
              </Text>
              <View>
                <Text style={styles.masterToggleTitle}>
                  {t(`health.platform.${platform === 'apple_health' ? 'appleHealth' : 'healthConnect'}`)}
                </Text>
                <Text style={styles.masterToggleSubtitle}>
                  {settings.enabled ? t('health.connected') : t('health.notConnected')}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={handleToggleEnabled}
              trackColor={{ false: COLORS.gray[300], true: COLORS.primary }}
            />
          </View>
        </Card>

        {/* Permissions */}
        {settings.enabled && (
          <HealthPermissionCard
            permissionStatus={permissionStatus}
            onRequestPermission={handleRequestPermission}
            isLoading={isRequestingPermission}
          />
        )}

        {/* Data Types */}
        <Text style={styles.sectionTitle}>{t('health.dataTypes.steps')}</Text>
        <Card style={styles.card}>
          <DataTypeToggle
            icon="👟"
            label={t('health.dataTypes.steps')}
            value={settings.dataTypes.steps}
            onValueChange={() => toggleDataType('steps')}
            disabled={!settings.enabled}
          />
          <DataTypeToggle
            icon="📍"
            label={t('health.dataTypes.distance')}
            value={settings.dataTypes.distance}
            onValueChange={() => toggleDataType('distance')}
            disabled={!settings.enabled}
          />
          <DataTypeToggle
            icon="🔥"
            label={t('health.dataTypes.calories')}
            value={settings.dataTypes.calories}
            onValueChange={() => toggleDataType('calories')}
            disabled={!settings.enabled}
          />
          <DataTypeToggle
            icon="❤️"
            label={t('health.dataTypes.heartRate')}
            value={settings.dataTypes.heartRate}
            onValueChange={() => toggleDataType('heartRate')}
            disabled={!settings.enabled}
          />
          <DataTypeToggle
            icon="🏋️"
            label={t('health.dataTypes.workouts')}
            value={settings.dataTypes.workouts}
            onValueChange={() => toggleDataType('workouts')}
            disabled={!settings.enabled}
          />
        </Card>

        {/* Sync */}
        <Text style={styles.sectionTitle}>{t('health.sync.lastSync')}</Text>
        <Card style={styles.card}>
          <Text style={styles.lastSyncText}>{formatLastSync()}</Text>
          <TouchableOpacity
            style={[styles.syncButton, (!settings.enabled || isSyncing) && styles.syncButtonDisabled]}
            onPress={handleSync}
            disabled={!settings.enabled || isSyncing}
          >
            <Text style={styles.syncButtonText}>
              {isSyncing ? t('health.sync.syncing') : t('health.sync.now')}
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Privacy Notice */}
        <Card style={[styles.card, styles.privacyCard]}>
          <Text style={styles.privacyIcon}>🔒</Text>
          <Text style={styles.privacyTitle}>{t('health.privacy.title')}</Text>
          <Text style={styles.privacyText}>{t('health.privacy.description')}</Text>
        </Card>
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  card: {
    marginBottom: SPACING.md,
  },
  masterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  masterToggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  masterToggleTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  masterToggleSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  toggleIcon: {
    fontSize: 16,
    marginRight: SPACING.md,
  },
  toggleLabel: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[900],
  },
  toggleLabelDisabled: {
    color: COLORS.gray[400],
  },
  lastSyncText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
    marginBottom: SPACING.md,
  },
  syncButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  syncButtonDisabled: {
    backgroundColor: COLORS.gray[300],
  },
  syncButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
  privacyCard: {
    backgroundColor: COLORS.gray[50],
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  privacyIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  privacyTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: SPACING.xs,
  },
  privacyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    textAlign: 'center',
    lineHeight: 20,
  },
  notSupportedText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
    textAlign: 'center',
    paddingVertical: SPACING.xl,
  },
});
