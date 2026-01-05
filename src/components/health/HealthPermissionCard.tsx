import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { IHealthPermissionStatus } from '@/types/health';

interface Props {
  permissionStatus: IHealthPermissionStatus | null;
  onRequestPermission: () => void;
  isLoading?: boolean;
}

type PermissionState = 'granted' | 'denied' | 'not_determined';

const PERMISSION_ICONS: Record<string, string> = {
  steps: '👟',
  distance: '📍',
  calories: '🔥',
  heartRate: '❤️',
  workouts: '🏋️',
};

export const HealthPermissionCard: React.FC<Props> = ({
  permissionStatus,
  onRequestPermission,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  const getStatusColor = (status: PermissionState): string => {
    switch (status) {
      case 'granted':
        return COLORS.success;
      case 'denied':
        return COLORS.error;
      default:
        return COLORS.gray[400];
    }
  };

  const getStatusText = (status: PermissionState): string => {
    switch (status) {
      case 'granted':
        return t('health.permissions.granted');
      case 'denied':
        return t('health.permissions.denied');
      default:
        return t('health.permissions.notDetermined');
    }
  };

  const handleOpenSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const hasAnyDenied = permissionStatus
    ? Object.values(permissionStatus).some((status) => status === 'denied')
    : false;

  const allGranted = permissionStatus
    ? Object.values(permissionStatus).every((status) => status === 'granted')
    : false;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('health.permissions.title')}</Text>
        <Text style={styles.subtitle}>{t('health.permissions.subtitle')}</Text>
      </View>

      {permissionStatus && (
        <View style={styles.permissionsList}>
          {Object.entries(permissionStatus).map(([key, status]) => (
            <View key={key} style={styles.permissionItem}>
              <Text style={styles.permissionIcon}>
                {PERMISSION_ICONS[key] || '📊'}
              </Text>
              <Text style={styles.permissionName}>
                {t(`health.dataTypes.${key}`)}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(status) + '20' },
                ]}
              >
                <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                  {getStatusText(status)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        {!allGranted && (
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={onRequestPermission}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? t('common.loading') : t('health.permissions.request')}
            </Text>
          </TouchableOpacity>
        )}
        {hasAnyDenied && (
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleOpenSettings}
          >
            <Text style={styles.secondaryButtonText}>
              {t('health.permissions.openSettings')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  header: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  permissionsList: {
    marginBottom: SPACING.md,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  permissionIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  permissionName: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[900],
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
  actions: {
    gap: SPACING.sm,
  },
  button: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
  secondaryButton: {
    backgroundColor: COLORS.gray[100],
  },
  secondaryButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[700],
  },
});
