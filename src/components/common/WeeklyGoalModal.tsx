import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';
import { Button } from './Button';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { useStatsStore } from '@/stores';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const WeeklyGoalModal: React.FC<Props> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const weeklyGoal = useStatsStore((state) => state.weeklyGoal);
  const setWeeklyGoal = useStatsStore((state) => state.setWeeklyGoal);
  const [tempGoal, setTempGoal] = useState(weeklyGoal || 5);

  useEffect(() => {
    if (visible) {
      setTempGoal(weeklyGoal || 5);
    }
  }, [visible, weeklyGoal]);

  const handleSave = () => {
    setWeeklyGoal(tempGoal);
    onClose();
  };

  const goalOptions = [1, 2, 3, 4, 5, 6, 7];

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={t('home.weeklyGoalSettings')}
    >
      <View style={styles.container}>
        <Text style={styles.description}>
          {t('home.weeklyGoalDescription')}
        </Text>

        <View style={styles.valueContainer}>
          <Text style={styles.valueLabel}>{t('home.workoutsPerWeek')}</Text>
          <Text style={styles.value}>{tempGoal}</Text>
        </View>

        <View style={styles.goalGrid}>
          {goalOptions.map((value) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.goalButton,
                tempGoal === value && styles.goalButtonActive,
              ]}
              onPress={() => setTempGoal(value)}
            >
              <Text
                style={[
                  styles.goalText,
                  tempGoal === value && styles.goalTextActive,
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={t('common.cancel')}
            variant="outline"
            onPress={onClose}
            style={styles.button}
          />
          <Button
            title={t('common.save')}
            onPress={handleSave}
            style={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.lg,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    textAlign: 'center',
  },
  valueContainer: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  valueLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  value: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.primary,
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  goalButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalButtonActive: {
    backgroundColor: COLORS.primary,
  },
  goalText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[600],
  },
  goalTextActive: {
    color: COLORS.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  button: {
    flex: 1,
  },
});
