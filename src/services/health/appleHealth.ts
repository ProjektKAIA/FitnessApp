// /workspaces/claude-workspace/fitnessapp/src/services/health/appleHealth.ts

import AppleHealthKit, { HealthKitPermissions, HealthInputOptions } from 'react-native-health';
import { BaseHealthService } from './healthService';
import {
  IHealthPermissionStatus,
  IStepsData,
  IDistanceData,
  ICaloriesData,
  IHeartRateData,
  IRestingHeartRateData,
  IHealthWorkout,
  THealthDataType,
} from '@/types/health';
import { transformAppleHealthData } from './dataTransformers';
import { logger } from '@/lib/logger';

const log = logger.scope('AppleHealth');

const PERMISSIONS: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.BasalEnergyBurned,
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.RestingHeartRate,
      AppleHealthKit.Constants.Permissions.Workout,
    ],
    write: [
      AppleHealthKit.Constants.Permissions.Workout,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
    ],
  },
};

export class AppleHealthService extends BaseHealthService {
  private permissionStatus: IHealthPermissionStatus = {
    steps: 'not_determined',
    distance: 'not_determined',
    calories: 'not_determined',
    heartRate: 'not_determined',
    workouts: 'not_determined',
  };

  async isAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
      AppleHealthKit.isAvailable((error, available) => {
        if (error) {
          log.error('Error checking HealthKit availability', error);
          resolve(false);
          return;
        }
        resolve(available);
      });
    });
  }

  async requestPermissions(dataTypes: THealthDataType[]): Promise<boolean> {
    return new Promise((resolve) => {
      AppleHealthKit.initHealthKit(PERMISSIONS, (error) => {
        if (error) {
          log.error('Error initializing HealthKit', error);
          resolve(false);
          return;
        }

        // Update permission status
        this.permissionStatus = {
          steps: dataTypes.includes('steps') ? 'granted' : 'not_determined',
          distance: dataTypes.includes('distance') ? 'granted' : 'not_determined',
          calories: dataTypes.includes('calories') ? 'granted' : 'not_determined',
          heartRate: dataTypes.includes('heartRate') ? 'granted' : 'not_determined',
          workouts: dataTypes.includes('workouts') ? 'granted' : 'not_determined',
        };

        this.initialized = true;
        resolve(true);
      });
    });
  }

  async getPermissionStatus(): Promise<IHealthPermissionStatus> {
    return this.permissionStatus;
  }

  async getSteps(startDate: Date, endDate: Date): Promise<IStepsData[]> {
    const options: HealthInputOptions = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    return new Promise((resolve) => {
      AppleHealthKit.getDailyStepCountSamples(options, (error, results) => {
        if (error) {
          log.error('Error getting steps', error);
          resolve([]);
          return;
        }

        const stepsData = transformAppleHealthData.steps(results || []);
        resolve(stepsData);
      });
    });
  }

  async getDistance(startDate: Date, endDate: Date): Promise<IDistanceData[]> {
    const options: HealthInputOptions = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    return new Promise((resolve) => {
      AppleHealthKit.getDailyDistanceWalkingRunningSamples(options, (error, results) => {
        if (error) {
          log.error('Error getting distance', error);
          resolve([]);
          return;
        }

        const distanceData = transformAppleHealthData.distance(results || []);
        resolve(distanceData);
      });
    });
  }

  async getCalories(startDate: Date, endDate: Date): Promise<ICaloriesData[]> {
    const options: HealthInputOptions = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    return new Promise((resolve, reject) => {
      // Get active calories
      AppleHealthKit.getActiveEnergyBurned(options, (error, activeResults) => {
        if (error) {
          log.error('Error getting active calories', error);
          resolve([]);
          return;
        }

        // Get basal calories
        AppleHealthKit.getBasalEnergyBurned(options, (error2, basalResults) => {
          if (error2) {
            log.error('Error getting basal calories', error2);
            resolve([]);
            return;
          }

          const caloriesData = transformAppleHealthData.calories(
            activeResults || [],
            basalResults || []
          );
          resolve(caloriesData);
        });
      });
    });
  }

  async getHeartRate(startDate: Date, endDate: Date): Promise<IHeartRateData[]> {
    const options: HealthInputOptions = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    return new Promise((resolve) => {
      AppleHealthKit.getHeartRateSamples(options, (error, results) => {
        if (error) {
          log.error('Error getting heart rate', error);
          resolve([]);
          return;
        }

        const hrData = transformAppleHealthData.heartRate(results || []);
        resolve(hrData);
      });
    });
  }

  async getRestingHeartRate(startDate: Date, endDate: Date): Promise<IRestingHeartRateData[]> {
    const options: HealthInputOptions = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    return new Promise((resolve) => {
      AppleHealthKit.getRestingHeartRate(options, (error, results: any) => {
        if (error) {
          log.error('Error getting resting heart rate', error);
          resolve([]);
          return;
        }

        const data = Array.isArray(results) ? results : results ? [results] : [];
        const restingHRData = transformAppleHealthData.restingHeartRate(data);
        resolve(restingHRData);
      });
    });
  }

  async getWorkouts(startDate: Date, endDate: Date): Promise<IHealthWorkout[]> {
    const options = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      type: 'Workout' as const,
    };

    return new Promise((resolve) => {
      (AppleHealthKit as any).getSamples(options, (error: any, results: any) => {
        if (error) {
          log.error('Error getting workouts', error);
          resolve([]);
          return;
        }

        const workoutData = transformAppleHealthData.workouts(results || []);
        resolve(workoutData);
      });
    });
  }
}
