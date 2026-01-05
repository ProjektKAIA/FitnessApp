import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { IDailyHealthSummary } from '@/types/health';
import { StepsProgressRing } from './StepsProgressRing';

interface Props {
  summary: IDailyHealthSummary | null;
  stepsGoal: number;
  onPress?: () => void;
}

export const HealthSummaryCard: React.FC<Props> = ({ summary, stepsGoal, onPress }) => {
  const { t } = useTranslation();

  const steps = summary?.steps?.count ?? 0;
  const distance = summary?.distance?.meters ?? 0;
  const calories = summary?.calories?.active ?? 0;
  const restingHR = summary?.restingHeartRate?.bpm;

  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} ${t('health.summary.km')}`;
    }
    return `${Math.round(meters)} ${t('health.summary.m')}`;
  };

  const CardContent = (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('health.summary.today')}</Text>
        {onPress && <Text style={styles.arrow}>→</Text>}
      </View>

      <View style={styles.content}>
        <StepsProgressRing steps={steps} goal={stepsGoal} size={90} strokeWidth={8} />

        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🔥</Text>
              <View>
                <Text style={styles.statValue}>{calories}</Text>
                <Text style={styles.statLabel}>{t('health.summary.kcal')}</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📍</Text>
              <View>
                <Text style={styles.statValue}>{formatDistance(distance)}</Text>
                <Text style={styles.statLabel}>{t('health.summary.distance')}</Text>
              </View>
            </View>
          </View>
          {restingHR && (
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>❤️</Text>
                <View>
                  <Text style={styles.statValue}>{restingHR}</Text>
                  <Text style={styles.statLabel}>{t('health.heartRate.resting')}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Card>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  arrow: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gray[400],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsContainer: {
    flex: 1,
    marginLeft: SPACING.lg,
  },
  statRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  statValue: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
  },
});
