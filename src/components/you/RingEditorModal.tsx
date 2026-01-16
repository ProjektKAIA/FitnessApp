// /workspaces/claude-workspace/fitnessapp/src/components/you/RingEditorModal.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useTheme } from '@/contexts';
import type { RingType, RingConfig } from '@/stores/userGoalsStore';

// Apple Health inspired color palette
export const RING_PRESETS: Record<RingType, { color: string; gradientEnd: string; icon: string }> = {
  steps: {
    color: '#FF9500',      // Apple Orange (Activity/Steps)
    gradientEnd: '#FFCC00',
    icon: '👟',
  },
  calories: {
    color: '#FF2D55',      // Apple Pink-Red (Move Ring)
    gradientEnd: '#FF6482',
    icon: '🔥',
  },
  activeMinutes: {
    color: '#30D158',      // Apple Green (Exercise Ring)
    gradientEnd: '#63E085',
    icon: '⏱️',
  },
  heartRate: {
    color: '#FF3B30',      // Apple Red (Heart)
    gradientEnd: '#FF6961',
    icon: '❤️',
  },
  distance: {
    color: '#00C7BE',      // Apple Teal (Stand Ring)
    gradientEnd: '#5EEAD4',
    icon: '📍',
  },
  water: {
    color: '#007AFF',      // Apple Blue
    gradientEnd: '#5AC8FA',
    icon: '💧',
  },
};

interface RingEditorModalProps {
  visible: boolean;
  onClose: () => void;
  ringConfigs: RingConfig[];
  onToggleRing: (ringId: RingType, enabled: boolean) => void;
  onAddRing: (ringId: RingType) => void;
}

export const RingEditorModal: React.FC<RingEditorModalProps> = ({
  visible,
  onClose,
  ringConfigs,
  onToggleRing,
  onAddRing,
}) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();

  const modalBgColor = isDark ? '#1E1E2E' : COLORS.white;

  const availableRings = Object.keys(RING_PRESETS).filter(
    (key) => !ringConfigs.find((c) => c.id === key)
  ) as RingType[];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.ringEditorContent, { backgroundColor: modalBgColor }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('you.editRings')}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.modalClose, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.ringEditorSubtitle, { color: colors.textSecondary }]}>
            {t('you.activeRings')}
          </Text>
          {ringConfigs.map((config) => {
            const preset = RING_PRESETS[config.id];
            return (
              <View key={config.id} style={[styles.ringToggleRow, { borderBottomColor: colors.border }]}>
                <View style={[styles.ringToggleDot, { backgroundColor: preset.color }]} />
                <Text style={styles.ringToggleIcon}>{preset.icon}</Text>
                <Text style={[styles.ringToggleLabel, { color: colors.text }]}>
                  {t(`you.ring.${config.id}`)}
                </Text>
                <Switch
                  value={config.enabled}
                  onValueChange={(v) => onToggleRing(config.id, v)}
                  trackColor={{ false: COLORS.gray[600], true: preset.color }}
                  thumbColor={COLORS.white}
                />
              </View>
            );
          })}

          {availableRings.length > 0 && (
            <>
              <Text
                style={[styles.ringEditorSubtitle, { marginTop: SPACING.lg, color: colors.textSecondary }]}
              >
                {t('you.addRing')}
              </Text>
              {availableRings.map((ringId) => {
                const preset = RING_PRESETS[ringId];
                return (
                  <TouchableOpacity
                    key={ringId}
                    style={[styles.addRingRow, { borderBottomColor: colors.border }]}
                    onPress={() => onAddRing(ringId)}
                  >
                    <View style={[styles.ringToggleDot, { backgroundColor: preset.color }]} />
                    <Text style={styles.ringToggleIcon}>{preset.icon}</Text>
                    <Text style={[styles.ringToggleLabel, { color: colors.text }]}>
                      {t(`you.ring.${ringId}`)}
                    </Text>
                    <Text style={styles.addRingPlus}>+</Text>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  ringEditorContent: {
    borderTopLeftRadius: BORDER_RADIUS['2xl'],
    borderTopRightRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  modalClose: {
    fontSize: 24,
  },
  ringEditorSubtitle: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ringToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  ringToggleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  ringToggleIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  ringToggleLabel: {
    flex: 1,
    fontSize: FONT_SIZES.base,
  },
  addRingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  addRingPlus: {
    fontSize: 24,
    color: '#64748B',
    fontWeight: '600',
  },
});
