// /workspaces/claude-workspace/fitnessapp/src/components/you/HealthInputModal.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useTheme } from '@/contexts';
import { useUserGoalsStore } from '@/stores';

interface HealthInputModalProps {
  visible: boolean;
  onClose: () => void;
}

export const HealthInputModal: React.FC<HealthInputModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const { addHealthEntry } = useUserGoalsStore();
  const [weight, setWeight] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');

  const modalBgColor = isDark ? '#1E1E2E' : COLORS.white;
  const inputBgColor = isDark ? COLORS.gray[800] : COLORS.gray[100];

  const handleSave = () => {
    const entry: { weight?: number; bloodPressureSystolic?: number; bloodPressureDiastolic?: number } = {};

    if (weight) entry.weight = parseFloat(weight);
    if (systolic && diastolic) {
      entry.bloodPressureSystolic = parseInt(systolic, 10);
      entry.bloodPressureDiastolic = parseInt(diastolic, 10);
    }

    if (Object.keys(entry).length > 0) {
      addHealthEntry(entry);
    }

    setWeight('');
    setSystolic('');
    setDiastolic('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: modalBgColor }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>{t('you.addHealthData')}</Text>

          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('you.weight')} (kg)</Text>
          <TextInput
            style={[styles.modalInput, { backgroundColor: inputBgColor, color: colors.text }]}
            placeholder="75"
            placeholderTextColor={colors.textTertiary}
            keyboardType="decimal-pad"
            value={weight}
            onChangeText={setWeight}
          />

          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('you.bloodPressure')}</Text>
          <View style={styles.bloodPressureInputs}>
            <TextInput
              style={[styles.modalInput, styles.bpInput, { backgroundColor: inputBgColor, color: colors.text }]}
              placeholder="120"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              value={systolic}
              onChangeText={setSystolic}
            />
            <Text style={[styles.bpSeparator, { color: colors.textSecondary }]}>/</Text>
            <TextInput
              style={[styles.modalInput, styles.bpInput, { backgroundColor: inputBgColor, color: colors.text }]}
              placeholder="80"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              value={diastolic}
              onChangeText={setDiastolic}
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButtonCancel, { backgroundColor: isDark ? COLORS.gray[700] : COLORS.gray[200] }]}
              onPress={onClose}
            >
              <Text style={[styles.modalButtonCancelText, { color: colors.textSecondary }]}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleSave}>
              <Text style={styles.modalButtonConfirmText}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BORDER_RADIUS['2xl'],
    borderTopRightRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.xl,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  modalInput: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    fontSize: FONT_SIZES.base,
  },
  bloodPressureInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bpInput: {
    flex: 1,
  },
  bpSeparator: {
    fontSize: FONT_SIZES.xl,
    marginHorizontal: SPACING.sm,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontWeight: '600',
  },
  modalButtonConfirm: {
    flex: 1,
    backgroundColor: '#6366F1',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  modalButtonConfirmText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});
