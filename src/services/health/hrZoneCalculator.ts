/**
 * Heart Rate Zone Calculator
 * Calculates HR zones based on max heart rate and analyzes workout intensity
 */

import {
  IHeartRateZoneData,
  IHeartRateData,
  ITrainingLoadData,
  THeartRateZone,
  TTrainingLoadLevel,
} from '@/types/health';

/**
 * Zone thresholds as percentage of max HR
 */
const ZONE_THRESHOLDS = {
  rest: { min: 0, max: 0.5 },
  fat_burn: { min: 0.5, max: 0.6 },
  cardio: { min: 0.6, max: 0.7 },
  peak: { min: 0.7, max: 0.85 },
  max: { min: 0.85, max: 1.0 },
};

/**
 * Zone names for display
 */
export const ZONE_NAMES: Record<THeartRateZone, string> = {
  rest: 'Ruhe',
  fat_burn: 'Fettverbrennung',
  cardio: 'Kardio',
  peak: 'Spitze',
  max: 'Maximum',
};

/**
 * Zone colors for UI
 */
export const ZONE_COLORS: Record<THeartRateZone, string> = {
  rest: '#9CA3AF', // gray
  fat_burn: '#60A5FA', // blue
  cardio: '#34D399', // green
  peak: '#FBBF24', // yellow
  max: '#EF4444', // red
};

/**
 * Estimate max heart rate from age using Tanaka formula
 * More accurate than 220-age for most adults
 */
export function estimateMaxHeartRate(age: number): number {
  // Tanaka formula: 208 - (0.7 × age)
  return Math.round(208 - 0.7 * age);
}

/**
 * Calculate heart rate zones based on max HR
 */
export function calculateZones(maxHR: number): Omit<IHeartRateZoneData, 'minutes' | 'percentage'>[] {
  return (Object.entries(ZONE_THRESHOLDS) as [THeartRateZone, { min: number; max: number }][]).map(
    ([zone, thresholds]) => ({
      zone,
      minBpm: Math.round(maxHR * thresholds.min),
      maxBpm: Math.round(maxHR * thresholds.max),
    })
  );
}

/**
 * Determine which zone a heart rate value falls into
 */
export function getZoneForHeartRate(bpm: number, maxHR: number): THeartRateZone {
  const percentage = bpm / maxHR;

  if (percentage >= ZONE_THRESHOLDS.max.min) return 'max';
  if (percentage >= ZONE_THRESHOLDS.peak.min) return 'peak';
  if (percentage >= ZONE_THRESHOLDS.cardio.min) return 'cardio';
  if (percentage >= ZONE_THRESHOLDS.fat_burn.min) return 'fat_burn';
  return 'rest';
}

/**
 * Analyze heart rate samples and calculate time in each zone
 */
export function analyzeHeartRateZones(
  samples: IHeartRateData[],
  maxHR: number
): IHeartRateZoneData[] {
  if (samples.length === 0) {
    return calculateZones(maxHR).map((zone) => ({
      ...zone,
      minutes: 0,
      percentage: 0,
    }));
  }

  // Sort samples by timestamp
  const sortedSamples = [...samples].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Calculate time in each zone
  const zoneMinutes: Record<THeartRateZone, number> = {
    rest: 0,
    fat_burn: 0,
    cardio: 0,
    peak: 0,
    max: 0,
  };

  for (let i = 0; i < sortedSamples.length - 1; i++) {
    const current = sortedSamples[i];
    const next = sortedSamples[i + 1];

    const zone = getZoneForHeartRate(current.bpm, maxHR);
    const duration =
      (new Date(next.timestamp).getTime() - new Date(current.timestamp).getTime()) / 1000 / 60;

    // Only count if duration is reasonable (less than 10 minutes between samples)
    if (duration > 0 && duration < 10) {
      zoneMinutes[zone] += duration;
    }
  }

  // Calculate total and percentages
  const totalMinutes = Object.values(zoneMinutes).reduce((sum, min) => sum + min, 0);
  const zones = calculateZones(maxHR);

  return zones.map((zone) => ({
    ...zone,
    minutes: Math.round(zoneMinutes[zone.zone]),
    percentage: totalMinutes > 0 ? Math.round((zoneMinutes[zone.zone] / totalMinutes) * 100) : 0,
  }));
}

/**
 * Calculate TRIMP (Training Impulse) score
 * Higher score = more training load
 */
export function calculateTRIMP(
  samples: IHeartRateData[],
  maxHR: number,
  restingHR: number
): number {
  if (samples.length === 0) return 0;

  let trimp = 0;
  const sortedSamples = [...samples].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  for (let i = 0; i < sortedSamples.length - 1; i++) {
    const current = sortedSamples[i];
    const next = sortedSamples[i + 1];

    const duration =
      (new Date(next.timestamp).getTime() - new Date(current.timestamp).getTime()) / 1000 / 60;

    if (duration > 0 && duration < 10) {
      // Heart rate reserve fraction
      const hrReserve = (current.bpm - restingHR) / (maxHR - restingHR);
      const clampedHRR = Math.max(0, Math.min(1, hrReserve));

      // Exponential weighting (higher HR = more stress)
      const weight = 0.64 * Math.exp(1.92 * clampedHRR);
      trimp += duration * weight;
    }
  }

  return Math.round(trimp);
}

/**
 * Calculate training load and provide recommendations
 */
export function calculateTrainingLoad(
  weeklyTRIMP: number[],
  monthlyTRIMP: number[]
): ITrainingLoadData {
  // Acute load (last 7 days)
  const acuteLoad =
    weeklyTRIMP.length > 0 ? weeklyTRIMP.reduce((sum, t) => sum + t, 0) / weeklyTRIMP.length : 0;

  // Chronic load (last 28 days)
  const chronicLoad =
    monthlyTRIMP.length > 0 ? monthlyTRIMP.reduce((sum, t) => sum + t, 0) / monthlyTRIMP.length : 0;

  // Acute:Chronic ratio
  const ratio = chronicLoad > 0 ? acuteLoad / chronicLoad : 0;

  // Determine training load level and recommendation
  let level: TTrainingLoadLevel;
  let recommendation: string;

  if (ratio < 0.8) {
    level = 'low';
    recommendation = 'Dein Training ist unter deinem Durchschnitt. Du kannst die Intensität steigern.';
  } else if (ratio <= 1.3) {
    level = 'moderate';
    recommendation = 'Dein Training ist im optimalen Bereich. Weiter so!';
  } else if (ratio <= 1.5) {
    level = 'high';
    recommendation = 'Dein Training ist intensiv. Achte auf ausreichend Erholung.';
  } else {
    level = 'very_high';
    recommendation = 'Vorsicht! Dein Training ist sehr intensiv. Gönn dir Ruhetage.';
  }

  return {
    date: new Date().toISOString().split('T')[0],
    acuteLoad: Math.round(acuteLoad),
    chronicLoad: Math.round(chronicLoad),
    ratio: Math.round(ratio * 100) / 100,
    level,
    recommendation,
  };
}

/**
 * Get training load level color
 */
export function getTrainingLoadColor(level: TTrainingLoadLevel): string {
  const colors: Record<TTrainingLoadLevel, string> = {
    low: '#60A5FA', // blue
    moderate: '#34D399', // green
    high: '#FBBF24', // yellow
    very_high: '#EF4444', // red
  };
  return colors[level];
}

/**
 * Get training load level label
 */
export function getTrainingLoadLabel(level: TTrainingLoadLevel): string {
  const labels: Record<TTrainingLoadLevel, string> = {
    low: 'Niedrig',
    moderate: 'Optimal',
    high: 'Hoch',
    very_high: 'Sehr hoch',
  };
  return labels[level];
}
