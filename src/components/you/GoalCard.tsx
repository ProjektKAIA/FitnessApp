// /workspaces/claude-workspace/fitnessapp/src/components/you/GoalCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useTheme } from '@/contexts';
import { useUserGoalsStore, type UserGoal } from '@/stores/userGoalsStore';

interface GoalCardProps {
  goal?: UserGoal | null;
  onAddGoal: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onAddGoal }) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();

  const cardGradient: [string, string] = isDark
    ? ['#1E1E2E', '#2D2D44']
    : [COLORS.gray[100], COLORS.gray[200]];

  if (!goal) {
    return (
      <TouchableOpacity
        style={[styles.emptyGoalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={onAddGoal}
      >
        <Text style={styles.emptyGoalIcon}>🎯</Text>
        <Text style={[styles.emptyGoalText, { color: colors.textTertiary }]}>{t('you.setGoal')}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <LinearGradient colors={cardGradient} style={styles.goalCard}>
      <Text style={styles.goalIcon}>🎯</Text>
      <View style={styles.goalContent}>
        <Text style={[styles.goalText, { color: isDark ? COLORS.white : colors.text }]}>{goal.text}</Text>
        {goal.deadline && (
          <Text style={[styles.goalDeadline, { color: colors.textSecondary }]}>
            {t('you.until')}: {new Date(goal.deadline).toLocaleDateString()}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.goalCheckButton}
        onPress={() => useUserGoalsStore.getState().toggleGoalCompleted(goal.id)}
      >
        <Text style={styles.goalCheckIcon}>✓</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  goalCard: {
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  goalContent: {
    flex: 1,
  },
  goalText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  goalDeadline: {
    fontSize: FONT_SIZES.sm,
    marginTop: 4,
  },
  goalCheckButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCheckIcon: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: '700',
  },
  emptyGoalCard: {
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.xl,
    marginHorizontal: SPACING.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  emptyGoalIcon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
    opacity: 0.5,
  },
  emptyGoalText: {
    fontSize: FONT_SIZES.sm,
  },
});
