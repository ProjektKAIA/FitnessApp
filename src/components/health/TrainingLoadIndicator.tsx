import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { ITrainingLoadData, TTrainingLoadLevel } from '@/types/health';
import { getTrainingLoadColor } from '@/services/health';

interface Props {
  trainingLoad: ITrainingLoadData | null;
  compact?: boolean;
}

const LEVEL_KEYS: Record<TTrainingLoadLevel, string> = {
  low: 'low',
  moderate: 'moderate',
  high: 'high',
  very_high: 'veryHigh',
};

export const TrainingLoadIndicator: React.FC<Props> = ({ trainingLoad, compact = false }) => {
  const { t } = useTranslation();

  if (!trainingLoad) {
    return compact ? null : (
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.icon}>📊</Text>
          <Text style={styles.title}>{t('health.trainingLoad.title')}</Text>
        </View>
        <Text style={styles.noData}>{t('health.activity.noData')}</Text>
      </Card>
    );
  }

  const levelKey = LEVEL_KEYS[trainingLoad.level] || 'moderate';
  const levelColor = getTrainingLoadColor(trainingLoad.level);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={[styles.levelBadge, { backgroundColor: levelColor }]}>
          <Text style={styles.levelBadgeText}>
            {t(`health.trainingLoad.level.${levelKey}`)}
          </Text>
        </View>
        <Text style={styles.compactRatio}>{trainingLoad.ratio.toFixed(2)}</Text>
      </View>
    );
  }

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>📊</Text>
        <Text style={styles.title}>{t('health.trainingLoad.title')}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.gaugeContainer}>
          <View style={styles.gaugeBackground}>
            <View
              style={[
                styles.gaugeProgress,
                {
                  width: `${Math.min(trainingLoad.ratio * 50, 100)}%`,
                  backgroundColor: levelColor,
                },
              ]}
            />
          </View>
          <View style={styles.ratioContainer}>
            <Text style={styles.ratioValue}>{trainingLoad.ratio.toFixed(2)}</Text>
            <Text style={styles.ratioLabel}>{t('health.trainingLoad.ratio')}</Text>
          </View>
        </View>

        <View style={[styles.levelContainer, { backgroundColor: levelColor + '20' }]}>
          <Text style={[styles.levelText, { color: levelColor }]}>
            {t(`health.trainingLoad.level.${levelKey}`)}
          </Text>
        </View>

        <Text style={styles.recommendation}>
          {t(`health.trainingLoad.recommendation.${levelKey}`)}
        </Text>

        <View style={styles.loadDetails}>
          <View style={styles.loadItem}>
            <Text style={styles.loadValue}>{Math.round(trainingLoad.acuteLoad)}</Text>
            <Text style={styles.loadLabel}>{t('health.trainingLoad.acute')}</Text>
          </View>
          <View style={styles.loadDivider} />
          <View style={styles.loadItem}>
            <Text style={styles.loadValue}>{Math.round(trainingLoad.chronicLoad)}</Text>
            <Text style={styles.loadLabel}>{t('health.trainingLoad.chronic')}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  content: {},
  gaugeContainer: {
    marginBottom: SPACING.md,
  },
  gaugeBackground: {
    height: 8,
    backgroundColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  gaugeProgress: {
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
  },
  ratioContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: SPACING.sm,
  },
  ratioValue: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  ratioLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginLeft: SPACING.sm,
  },
  levelContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.sm,
  },
  levelText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  recommendation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    marginBottom: SPACING.md,
  },
  loadDetails: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  loadItem: {
    flex: 1,
    alignItems: 'center',
  },
  loadValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  loadLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    marginTop: 2,
    textAlign: 'center',
  },
  loadDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.gray[200],
  },
  noData: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
  },
  levelBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.white,
  },
  compactRatio: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[600],
  },
});
