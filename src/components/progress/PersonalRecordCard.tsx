// /workspaces/claude-workspace/fitnessapp/src/components/progress/PersonalRecordCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

interface Props {
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  previousRecord?: {
    weight: number;
    reps: number;
  };
  onPress?: () => void;
}

export const PersonalRecordCard: React.FC<Props> = ({
  exerciseName,
  weight,
  reps,
  date,
  previousRecord,
  onPress,
}) => {
  const improvement = previousRecord
    ? ((weight - previousRecord.weight) / previousRecord.weight) * 100
    : null;

  const formattedDate = new Date(date).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'short',
  });

  const content = (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🏆</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.exerciseName} numberOfLines={1}>
          {exerciseName}
        </Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      <View style={styles.valueContainer}>
        <View style={styles.mainValue}>
          <Text style={styles.weight}>{weight}</Text>
          <Text style={styles.unit}>kg</Text>
        </View>
        <Text style={styles.reps}>× {reps}</Text>
      </View>

      {improvement !== null && improvement > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>+{improvement.toFixed(0)}%</Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  exerciseName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  date: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  mainValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  weight: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  unit: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    marginLeft: 2,
  },
  reps: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  badge: {
    backgroundColor: COLORS.success,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    marginLeft: SPACING.sm,
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.white,
  },
});
