// /workspaces/claude-workspace/fitnessapp/src/services/health/healthService.ts

import { Platform } from 'react-native';
import {
  IHealthService,
  IHealthPermissionStatus,
  IStepsData,
  IDistanceData,
  ICaloriesData,
  IHeartRateData,
  IRestingHeartRateData,
  IHealthWorkout,
  IDailyHealthSummary,
  THealthDataType,
  THealthPlatform,
} from '@/types/health';
import { logger } from '@/lib/logger';

const log = logger.scope('HealthService');

// Singleton instance
let healthServiceInstance: IHealthService | null = null;

/**
 * Factory function to create the appropriate health service based on platform
 */
export async function createHealthService(): Promise<IHealthService | null> {
  if (healthServiceInstance) {
    return healthServiceInstance;
  }

  try {
    if (Platform.OS === 'ios') {
      const { AppleHealthService } = await import('./appleHealth');
      healthServiceInstance = new AppleHealthService();
    } else if (Platform.OS === 'android') {
      const { HealthConnectService } = await import('./healthConnect');
      healthServiceInstance = new HealthConnectService();
    } else {
      log.warn('Health services not available on this platform');
      return null;
    }

    return healthServiceInstance;
  } catch (error) {
    log.error('Failed to create health service', error);
    return null;
  }
}

/**
 * Get the current health service instance
 */
export function getHealthService(): IHealthService | null {
  return healthServiceInstance;
}

/**
 * Get the current health platform
 */
export function getHealthPlatform(): THealthPlatform {
  if (Platform.OS === 'ios') return 'apple_health';
  if (Platform.OS === 'android') return 'health_connect';
  return null;
}

/**
 * Check if health services are supported on this platform
 */
export function isHealthSupported(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

/**
 * Reset the health service instance (useful for testing)
 */
export function resetHealthService(): void {
  healthServiceInstance = null;
}

/**
 * Abstract base class for health services
 * Provides common functionality and enforces interface contract
 */
export abstract class BaseHealthService implements IHealthService {
  protected initialized = false;

  abstract isAvailable(): Promise<boolean>;
  abstract requestPermissions(dataTypes: THealthDataType[]): Promise<boolean>;
  abstract getPermissionStatus(): Promise<IHealthPermissionStatus>;
  abstract getSteps(startDate: Date, endDate: Date): Promise<IStepsData[]>;
  abstract getDistance(startDate: Date, endDate: Date): Promise<IDistanceData[]>;
  abstract getCalories(startDate: Date, endDate: Date): Promise<ICaloriesData[]>;
  abstract getHeartRate(startDate: Date, endDate: Date): Promise<IHeartRateData[]>;
  abstract getRestingHeartRate(startDate: Date, endDate: Date): Promise<IRestingHeartRateData[]>;
  abstract getWorkouts(startDate: Date, endDate: Date): Promise<IHealthWorkout[]>;

  /**
   * Get a complete daily summary combining all health data
   */
  async getDailySummary(date: Date): Promise<IDailyHealthSummary> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const dateString = date.toISOString().split('T')[0];

    try {
      const [steps, distance, calories, heartRates, restingHR, workouts] = await Promise.all([
        this.getSteps(startOfDay, endOfDay).catch(() => []),
        this.getDistance(startOfDay, endOfDay).catch(() => []),
        this.getCalories(startOfDay, endOfDay).catch(() => []),
        this.getHeartRate(startOfDay, endOfDay).catch(() => []),
        this.getRestingHeartRate(startOfDay, endOfDay).catch(() => []),
        this.getWorkouts(startOfDay, endOfDay).catch(() => []),
      ]);

      // Aggregate steps for the day
      const totalSteps = steps.reduce((sum, s) => sum + s.count, 0);
      const stepsData: IStepsData | null =
        steps.length > 0
          ? {
              date: dateString,
              count: totalSteps,
              goal: 10000,
              source: steps[0].source,
            }
          : null;

      // Aggregate distance for the day
      const totalDistance = distance.reduce((sum, d) => sum + d.meters, 0);
      const distanceData: IDistanceData | null =
        distance.length > 0
          ? {
              date: dateString,
              meters: totalDistance,
              source: distance[0].source,
            }
          : null;

      // Aggregate calories for the day
      const totalCalories = calories.reduce((sum, c) => sum + c.total, 0);
      const activeCalories = calories.reduce((sum, c) => sum + c.active, 0);
      const caloriesData: ICaloriesData | null =
        calories.length > 0
          ? {
              date: dateString,
              total: totalCalories,
              active: activeCalories,
              basal: totalCalories - activeCalories,
              source: calories[0].source,
            }
          : null;

      // Calculate average heart rate
      const avgHR =
        heartRates.length > 0 ? heartRates.reduce((sum, hr) => sum + hr.bpm, 0) / heartRates.length : null;

      const minHR = heartRates.length > 0 ? Math.min(...heartRates.map((hr) => hr.bpm)) : null;
      const maxHR = heartRates.length > 0 ? Math.max(...heartRates.map((hr) => hr.bpm)) : null;

      return {
        date: dateString,
        steps: stepsData,
        distance: distanceData,
        calories: caloriesData,
        restingHeartRate: restingHR.length > 0 ? restingHR[0] : null,
        averageHeartRate:
          avgHR !== null
            ? {
                date: dateString,
                averageBpm: Math.round(avgHR),
                minBpm: minHR!,
                maxBpm: maxHR!,
              }
            : null,
        heartRateZones: [], // Calculated separately with user's max HR
        workouts,
      };
    } catch (error) {
      log.error('Error getting daily summary', error);
      return {
        date: dateString,
        steps: null,
        distance: null,
        calories: null,
        restingHeartRate: null,
        averageHeartRate: null,
        heartRateZones: [],
        workouts: [],
      };
    }
  }

  /**
   * Helper to get date range for last N days
   */
  protected getDateRange(days: number): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    return { startDate, endDate };
  }
}
