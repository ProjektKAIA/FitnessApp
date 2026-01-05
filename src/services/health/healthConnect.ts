import {
  initialize,
  requestPermission,
  readRecords,
  getSdkStatus,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';
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
import { transformHealthConnectData } from './dataTransformers';

const PERMISSION_MAP: Record<THealthDataType, string> = {
  steps: 'android.permission.health.READ_STEPS',
  distance: 'android.permission.health.READ_DISTANCE',
  calories: 'android.permission.health.READ_TOTAL_CALORIES_BURNED',
  activeCalories: 'android.permission.health.READ_ACTIVE_CALORIES_BURNED',
  heartRate: 'android.permission.health.READ_HEART_RATE',
  restingHeartRate: 'android.permission.health.READ_RESTING_HEART_RATE',
  workouts: 'android.permission.health.READ_EXERCISE',
};

export class HealthConnectService extends BaseHealthService {
  private permissionStatus: IHealthPermissionStatus = {
    steps: 'not_determined',
    distance: 'not_determined',
    calories: 'not_determined',
    heartRate: 'not_determined',
    workouts: 'not_determined',
  };

  async isAvailable(): Promise<boolean> {
    try {
      const status = await getSdkStatus();
      return status === SdkAvailabilityStatus.SDK_AVAILABLE;
    } catch (error) {
      console.error('Error checking Health Connect availability:', error);
      return false;
    }
  }

  async requestPermissions(dataTypes: THealthDataType[]): Promise<boolean> {
    try {
      // Initialize Health Connect
      const initialized = await initialize();
      if (!initialized) {
        console.error('Failed to initialize Health Connect');
        return false;
      }

      // Build permissions array
      const permissions = dataTypes
        .map((type) => PERMISSION_MAP[type])
        .filter(Boolean)
        .map((permission) => ({ accessType: 'read', recordType: permission }));

      // Request permissions
      const granted = await requestPermission(permissions as any);

      // Update permission status based on granted permissions
      this.permissionStatus = {
        steps: dataTypes.includes('steps') ? 'granted' : 'not_determined',
        distance: dataTypes.includes('distance') ? 'granted' : 'not_determined',
        calories: dataTypes.includes('calories') ? 'granted' : 'not_determined',
        heartRate: dataTypes.includes('heartRate') ? 'granted' : 'not_determined',
        workouts: dataTypes.includes('workouts') ? 'granted' : 'not_determined',
      };

      this.initialized = true;
      return granted.length > 0;
    } catch (error) {
      console.error('Error requesting Health Connect permissions:', error);
      return false;
    }
  }

  async getPermissionStatus(): Promise<IHealthPermissionStatus> {
    return this.permissionStatus;
  }

  async getSteps(startDate: Date, endDate: Date): Promise<IStepsData[]> {
    try {
      const result = await readRecords('Steps', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      return transformHealthConnectData.steps(result.records || []);
    } catch (error) {
      console.error('Error getting steps from Health Connect:', error);
      return [];
    }
  }

  async getDistance(startDate: Date, endDate: Date): Promise<IDistanceData[]> {
    try {
      const result = await readRecords('Distance', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      return transformHealthConnectData.distance(result.records || []);
    } catch (error) {
      console.error('Error getting distance from Health Connect:', error);
      return [];
    }
  }

  async getCalories(startDate: Date, endDate: Date): Promise<ICaloriesData[]> {
    try {
      const [totalResult, activeResult] = await Promise.all([
        readRecords('TotalCaloriesBurned', {
          timeRangeFilter: {
            operator: 'between',
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
          },
        }),
        readRecords('ActiveCaloriesBurned', {
          timeRangeFilter: {
            operator: 'between',
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
          },
        }),
      ]);

      return transformHealthConnectData.calories(
        totalResult.records || [],
        activeResult.records || []
      );
    } catch (error) {
      console.error('Error getting calories from Health Connect:', error);
      return [];
    }
  }

  async getHeartRate(startDate: Date, endDate: Date): Promise<IHeartRateData[]> {
    try {
      const result = await readRecords('HeartRate', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      return transformHealthConnectData.heartRate(result.records || []);
    } catch (error) {
      console.error('Error getting heart rate from Health Connect:', error);
      return [];
    }
  }

  async getRestingHeartRate(startDate: Date, endDate: Date): Promise<IRestingHeartRateData[]> {
    try {
      const result = await readRecords('RestingHeartRate', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      return transformHealthConnectData.restingHeartRate(result.records || []);
    } catch (error) {
      console.error('Error getting resting heart rate from Health Connect:', error);
      return [];
    }
  }

  async getWorkouts(startDate: Date, endDate: Date): Promise<IHealthWorkout[]> {
    try {
      const result = await readRecords('ExerciseSession', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      return transformHealthConnectData.workouts(result.records || []);
    } catch (error) {
      console.error('Error getting workouts from Health Connect:', error);
      return [];
    }
  }
}
