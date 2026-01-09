// /workspaces/claude-workspace/fitnessapp/src/components/you/CalorieCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useTheme } from '@/contexts';

interface CalorieCardProps {
  dailyCalorieGoal: number;
  consumed: number;
  workoutBurned: number;
  balance: number;
  targetLabel: string;
}

export const CalorieCard: React.FC<CalorieCardProps> = ({
  dailyCalorieGoal,
  consumed,
  workoutBurned,
  balance,
  targetLabel,
}) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();

  const cardGradient: [string, string] = isDark
    ? ['#1E1E2E', '#2D2D44']
    : [COLORS.gray[100], COLORS.gray[200]];

  return (
    <LinearGradient colors={cardGradient} style={styles.calorieCard}>
      <View style={styles.calorieRow}>
        <Text style={[styles.calorieLabel, { color: colors.textSecondary }]}>{t('you.dailyNeed')}</Text>
        <Text style={[styles.calorieValue, { color: isDark ? COLORS.white : colors.text }]}>
          {dailyCalorieGoal} kcal
        </Text>
      </View>
      <View style={styles.calorieRow}>
        <Text style={[styles.calorieLabel, { color: colors.textSecondary }]}>{t('you.consumed')}</Text>
        <Text style={[styles.calorieValue, { color: isDark ? COLORS.white : colors.text }]}>
          {consumed} kcal
        </Text>
      </View>
      <View style={styles.calorieRow}>
        <Text style={[styles.calorieLabel, { color: colors.textSecondary }]}>{t('you.workoutBurned')}</Text>
        <Text style={styles.calorieValueGreen}>-{workoutBurned} kcal</Text>
      </View>
      <View style={[styles.calorieDivider, { backgroundColor: colors.border }]} />
      <View style={styles.calorieRow}>
        <Text style={[styles.calorieLabel, { color: colors.textSecondary }]}>{t('you.target')}</Text>
        <Text style={styles.calorieTargetLabel}>{targetLabel}</Text>
      </View>
      <View style={styles.calorieRow}>
        <Text style={[styles.calorieLabelBold, { color: isDark ? COLORS.white : colors.text }]}>
          {t('you.balance')}
        </Text>
        <Text
          style={[
            styles.calorieBalanceValue,
            balance >= 0 ? styles.caloriePositive : styles.calorieNegative,
          ]}
        >
          {balance >= 0 ? '+' : ''}
          {balance} kcal
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  calorieCard: {
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  calorieLabel: {
    fontSize: FONT_SIZES.sm,
  },
  calorieLabelBold: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  calorieValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  calorieValueGreen: {
    fontSize: FONT_SIZES.sm,
    color: '#10B981',
    fontWeight: '500',
  },
  calorieTargetLabel: {
    fontSize: FONT_SIZES.sm,
    color: '#6366F1',
    fontWeight: '500',
  },
  calorieBalanceValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  caloriePositive: {
    color: '#10B981',
  },
  calorieNegative: {
    color: '#EF4444',
  },
  calorieDivider: {
    height: 1,
    marginVertical: SPACING.sm,
  },
});
