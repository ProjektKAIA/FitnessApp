import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { IAverageHeartRateData, IRestingHeartRateData, IHeartRateZoneData } from '@/types/health';
import { ZONE_COLORS } from '@/services/health';

interface Props {
  restingHeartRate?: IRestingHeartRateData | null;
  averageHeartRate?: IAverageHeartRateData | null;
  zones?: IHeartRateZoneData[];
  compact?: boolean;
}

const ZONE_LABELS: Record<string, string> = {
  rest: 'zone.rest',
  fat_burn: 'zone.fatBurn',
  cardio: 'zone.cardio',
  peak: 'zone.peak',
  max: 'zone.max',
};

export const HeartRateCard: React.FC<Props> = ({
  restingHeartRate,
  averageHeartRate,
  zones = [],
  compact = false,
}) => {
  const { t } = useTranslation();

  const hasData = restingHeartRate || averageHeartRate;

  if (!hasData && !compact) {
    return (
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.heartIcon}>❤️</Text>
          <Text style={styles.title}>{t('health.heartRate.title')}</Text>
        </View>
        <Text style={styles.noData}>{t('health.activity.noData')}</Text>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.heartIcon}>❤️</Text>
        <Text style={styles.title}>{t('health.heartRate.title')}</Text>
      </View>

      <View style={styles.statsRow}>
        {restingHeartRate && (
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{restingHeartRate.bpm}</Text>
            <Text style={styles.statLabel}>{t('health.heartRate.resting')}</Text>
          </View>
        )}
        {averageHeartRate && (
          <>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{averageHeartRate.averageBpm}</Text>
              <Text style={styles.statLabel}>{t('health.heartRate.average')}</Text>
            </View>
            {!compact && (
              <>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, styles.minValue]}>{averageHeartRate.minBpm}</Text>
                  <Text style={styles.statLabel}>{t('health.heartRate.min')}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, styles.maxValue]}>{averageHeartRate.maxBpm}</Text>
                  <Text style={styles.statLabel}>{t('health.heartRate.max')}</Text>
                </View>
              </>
            )}
          </>
        )}
      </View>

      {!compact && zones.length > 0 && (
        <View style={styles.zonesContainer}>
          <Text style={styles.zonesTitle}>{t('health.heartRate.zones')}</Text>
          <View style={styles.zonesBar}>
            {zones.map((zone) => (
              <View
                key={zone.zone}
                style={[
                  styles.zoneSegment,
                  {
                    flex: zone.percentage || 1,
                    backgroundColor: ZONE_COLORS[zone.zone] || COLORS.gray[300],
                  },
                ]}
              />
            ))}
          </View>
          <View style={styles.zonesLegend}>
            {zones.map((zone) => (
              <View key={zone.zone} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColor,
                    { backgroundColor: ZONE_COLORS[zone.zone] || COLORS.gray[300] },
                  ]}
                />
                <Text style={styles.legendText}>
                  {t(`health.heartRate.${ZONE_LABELS[zone.zone] || zone.zone}`)}
                </Text>
                <Text style={styles.legendMinutes}>{zone.minutes}m</Text>
              </View>
            ))}
          </View>
        </View>
      )}
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
  heartIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  minValue: {
    color: COLORS.primary,
  },
  maxValue: {
    color: COLORS.accent,
  },
  noData: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
  zonesContainer: {
    marginTop: SPACING.lg,
  },
  zonesTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: SPACING.sm,
  },
  zonesBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  zoneSegment: {
    minWidth: 4,
  },
  zonesLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[600],
    marginRight: 4,
  },
  legendMinutes: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[400],
  },
});
