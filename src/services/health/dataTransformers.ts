/**
 * Data transformers to normalize health data from different platforms
 * into a common format used by the app
 */

import {
  IStepsData,
  IDistanceData,
  ICaloriesData,
  IHeartRateData,
  IRestingHeartRateData,
  IHealthWorkout,
} from '@/types/health';

// Helper to format date to YYYY-MM-DD
function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

// Helper to generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Apple Health data transformers
 */
export const transformAppleHealthData = {
  steps: (data: any[]): IStepsData[] => {
    return data.map((item) => ({
      date: formatDate(item.startDate || item.date),
      count: Math.round(item.value || item.quantity || 0),
      goal: 10000,
      source: item.sourceName || 'Apple Health',
    }));
  },

  distance: (data: any[]): IDistanceData[] => {
    return data.map((item) => ({
      date: formatDate(item.startDate || item.date),
      meters: Math.round(item.value || item.quantity || 0),
      source: item.sourceName || 'Apple Health',
    }));
  },

  calories: (activeData: any[], basalData: any[]): ICaloriesData[] => {
    // Group by date
    const byDate: Record<string, { active: number; basal: number }> = {};

    activeData.forEach((item) => {
      const date = formatDate(item.startDate || item.date);
      if (!byDate[date]) {
        byDate[date] = { active: 0, basal: 0 };
      }
      byDate[date].active += item.value || item.quantity || 0;
    });

    basalData.forEach((item) => {
      const date = formatDate(item.startDate || item.date);
      if (!byDate[date]) {
        byDate[date] = { active: 0, basal: 0 };
      }
      byDate[date].basal += item.value || item.quantity || 0;
    });

    return Object.entries(byDate).map(([date, values]) => ({
      date,
      total: Math.round(values.active + values.basal),
      active: Math.round(values.active),
      basal: Math.round(values.basal),
      source: 'Apple Health',
    }));
  },

  heartRate: (data: any[]): IHeartRateData[] => {
    return data.map((item) => ({
      timestamp: item.startDate || item.date || new Date().toISOString(),
      bpm: Math.round(item.value || item.quantity || 0),
      source: item.sourceName || 'Apple Health',
    }));
  },

  restingHeartRate: (data: any[]): IRestingHeartRateData[] => {
    return data.map((item) => ({
      date: formatDate(item.startDate || item.date),
      bpm: Math.round(item.value || item.quantity || 0),
      source: item.sourceName || 'Apple Health',
    }));
  },

  workouts: (data: any[]): IHealthWorkout[] => {
    return data.map((item) => {
      const startDate = new Date(item.startDate || item.start);
      const endDate = new Date(item.endDate || item.end);
      const durationSeconds = (endDate.getTime() - startDate.getTime()) / 1000;

      return {
        id: item.id || generateId(),
        type: mapAppleWorkoutType(item.activityName || item.type || 'Unknown'),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        duration: Math.round(durationSeconds),
        calories: Math.round(item.calories || item.activeEnergyBurned || 0),
        distance: item.distance ? Math.round(item.distance * 1000) : undefined,
        averageHeartRate: item.averageHeartRate ? Math.round(item.averageHeartRate) : undefined,
        maxHeartRate: item.maxHeartRate ? Math.round(item.maxHeartRate) : undefined,
        source: item.sourceName || 'Apple Health',
      };
    });
  },
};

/**
 * Health Connect (Android) data transformers
 */
export const transformHealthConnectData = {
  steps: (data: any[]): IStepsData[] => {
    return data.map((item) => ({
      date: formatDate(item.startTime || item.time),
      count: Math.round(item.count || 0),
      goal: 10000,
      source: item.metadata?.dataOrigin || 'Health Connect',
    }));
  },

  distance: (data: any[]): IDistanceData[] => {
    return data.map((item) => ({
      date: formatDate(item.startTime || item.time),
      meters: Math.round(item.distance?.inMeters || item.distance || 0),
      source: item.metadata?.dataOrigin || 'Health Connect',
    }));
  },

  calories: (totalData: any[], activeData: any[]): ICaloriesData[] => {
    // Group by date
    const byDate: Record<string, { total: number; active: number }> = {};

    totalData.forEach((item) => {
      const date = formatDate(item.startTime || item.time);
      if (!byDate[date]) {
        byDate[date] = { total: 0, active: 0 };
      }
      byDate[date].total += item.energy?.inKilocalories || item.energy || 0;
    });

    activeData.forEach((item) => {
      const date = formatDate(item.startTime || item.time);
      if (!byDate[date]) {
        byDate[date] = { total: 0, active: 0 };
      }
      byDate[date].active += item.energy?.inKilocalories || item.energy || 0;
    });

    return Object.entries(byDate).map(([date, values]) => ({
      date,
      total: Math.round(values.total),
      active: Math.round(values.active),
      basal: Math.round(values.total - values.active),
      source: 'Health Connect',
    }));
  },

  heartRate: (data: any[]): IHeartRateData[] => {
    const results: IHeartRateData[] = [];

    data.forEach((item) => {
      // Health Connect returns samples array
      const samples = item.samples || [item];
      samples.forEach((sample: any) => {
        results.push({
          timestamp: sample.time || item.startTime || new Date().toISOString(),
          bpm: Math.round(sample.beatsPerMinute || sample.bpm || 0),
          source: item.metadata?.dataOrigin || 'Health Connect',
        });
      });
    });

    return results;
  },

  restingHeartRate: (data: any[]): IRestingHeartRateData[] => {
    return data.map((item) => ({
      date: formatDate(item.time || item.startTime),
      bpm: Math.round(item.beatsPerMinute || item.bpm || 0),
      source: item.metadata?.dataOrigin || 'Health Connect',
    }));
  },

  workouts: (data: any[]): IHealthWorkout[] => {
    return data.map((item) => {
      const startDate = new Date(item.startTime);
      const endDate = new Date(item.endTime);
      const durationSeconds = (endDate.getTime() - startDate.getTime()) / 1000;

      return {
        id: item.metadata?.id || generateId(),
        type: mapHealthConnectExerciseType(item.exerciseType || 'UNKNOWN'),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        duration: Math.round(durationSeconds),
        calories: Math.round(item.energy?.inKilocalories || 0),
        distance: item.distance?.inMeters ? Math.round(item.distance.inMeters) : undefined,
        averageHeartRate: undefined, // Need to fetch separately
        maxHeartRate: undefined,
        source: item.metadata?.dataOrigin || 'Health Connect',
      };
    });
  },
};

/**
 * Map Apple Health workout types to readable names
 */
function mapAppleWorkoutType(type: string): string {
  const typeMap: Record<string, string> = {
    HKWorkoutActivityTypeRunning: 'Running',
    HKWorkoutActivityTypeWalking: 'Walking',
    HKWorkoutActivityTypeCycling: 'Cycling',
    HKWorkoutActivityTypeSwimming: 'Swimming',
    HKWorkoutActivityTypeYoga: 'Yoga',
    HKWorkoutActivityTypeStrengthTraining: 'Strength Training',
    HKWorkoutActivityTypeHIIT: 'HIIT',
    HKWorkoutActivityTypeFunctionalStrengthTraining: 'Functional Training',
    HKWorkoutActivityTypeTraditionalStrengthTraining: 'Weight Training',
    HKWorkoutActivityTypeCrossTraining: 'Cross Training',
    HKWorkoutActivityTypeElliptical: 'Elliptical',
    HKWorkoutActivityTypeRowing: 'Rowing',
    HKWorkoutActivityTypeStairClimbing: 'Stair Climbing',
  };

  return typeMap[type] || type.replace('HKWorkoutActivityType', '');
}

/**
 * Map Health Connect exercise types to readable names
 */
function mapHealthConnectExerciseType(type: string | number): string {
  const typeMap: Record<string, string> = {
    EXERCISE_TYPE_RUNNING: 'Running',
    EXERCISE_TYPE_WALKING: 'Walking',
    EXERCISE_TYPE_BIKING: 'Cycling',
    EXERCISE_TYPE_SWIMMING_POOL: 'Swimming',
    EXERCISE_TYPE_SWIMMING_OPEN_WATER: 'Open Water Swimming',
    EXERCISE_TYPE_YOGA: 'Yoga',
    EXERCISE_TYPE_STRENGTH_TRAINING: 'Strength Training',
    EXERCISE_TYPE_HIIT: 'HIIT',
    EXERCISE_TYPE_CALISTHENICS: 'Calisthenics',
    EXERCISE_TYPE_ELLIPTICAL: 'Elliptical',
    EXERCISE_TYPE_ROWING_MACHINE: 'Rowing',
    EXERCISE_TYPE_STAIR_CLIMBING: 'Stair Climbing',
    EXERCISE_TYPE_WEIGHTLIFTING: 'Weight Lifting',
  };

  const typeStr = typeof type === 'number' ? `EXERCISE_TYPE_${type}` : type;
  return typeMap[typeStr] || typeStr.replace('EXERCISE_TYPE_', '').replace(/_/g, ' ');
}
