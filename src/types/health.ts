// Health Data Types for Apple Health & Google Health Connect

export type THealthPlatform = 'apple_health' | 'health_connect' | null;

export type THealthDataType =
  | 'steps'
  | 'distance'
  | 'calories'
  | 'activeCalories'
  | 'heartRate'
  | 'restingHeartRate'
  | 'workouts';

export type THeartRateZone = 'rest' | 'fat_burn' | 'cardio' | 'peak' | 'max';

export type TTrainingLoadLevel = 'low' | 'moderate' | 'high' | 'very_high';

// Steps Data
export interface IStepsData {
  date: string;
  count: number;
  goal: number;
  source: string;
}

// Distance Data
export interface IDistanceData {
  date: string;
  meters: number;
  source: string;
}

// Calories Data
export interface ICaloriesData {
  date: string;
  total: number;
  active: number;
  basal: number;
  source: string;
}

// Heart Rate Data
export interface IHeartRateData {
  timestamp: string;
  bpm: number;
  source: string;
}

export interface IRestingHeartRateData {
  date: string;
  bpm: number;
  source: string;
}

export interface IAverageHeartRateData {
  date: string;
  averageBpm: number;
  minBpm: number;
  maxBpm: number;
}

// Heart Rate Zones
export interface IHeartRateZoneData {
  zone: THeartRateZone;
  minBpm: number;
  maxBpm: number;
  minutes: number;
  percentage: number;
}

// Workout Data from Health Apps
export interface IHealthWorkout {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: number; // in seconds
  calories: number;
  distance?: number; // in meters
  averageHeartRate?: number;
  maxHeartRate?: number;
  source: string;
}

// Daily Health Summary
export interface IDailyHealthSummary {
  date: string;
  steps: IStepsData | null;
  distance: IDistanceData | null;
  calories: ICaloriesData | null;
  restingHeartRate: IRestingHeartRateData | null;
  averageHeartRate: IAverageHeartRateData | null;
  heartRateZones: IHeartRateZoneData[];
  workouts: IHealthWorkout[];
  activeMinutes?: number;
}

// Health Trends
export interface IHealthTrend {
  dataType: THealthDataType;
  period: 'week' | 'month';
  data: Array<{
    date: string;
    value: number;
  }>;
  average: number;
  change: number; // percentage change vs previous period
  changeDirection: 'up' | 'down' | 'stable';
}

// Training Load Analysis
export interface ITrainingLoadData {
  date: string;
  acuteLoad: number; // Last 7 days
  chronicLoad: number; // Last 28 days
  ratio: number; // Acute:Chronic ratio
  level: TTrainingLoadLevel;
  recommendation: string;
}

// Health Settings
export interface IHealthSettings {
  enabled: boolean;
  platform: THealthPlatform;
  permissionsGranted: boolean;
  lastSyncAt: string | null;
  dataTypes: {
    steps: boolean;
    distance: boolean;
    calories: boolean;
    heartRate: boolean;
    workouts: boolean;
  };
  stepsGoal: number;
  syncInterval: number; // in minutes
}

// Permission Status
export interface IHealthPermissionStatus {
  steps: 'granted' | 'denied' | 'not_determined';
  distance: 'granted' | 'denied' | 'not_determined';
  calories: 'granted' | 'denied' | 'not_determined';
  heartRate: 'granted' | 'denied' | 'not_determined';
  workouts: 'granted' | 'denied' | 'not_determined';
}

// Health Service Interface
export interface IHealthService {
  isAvailable(): Promise<boolean>;
  requestPermissions(dataTypes: THealthDataType[]): Promise<boolean>;
  getPermissionStatus(): Promise<IHealthPermissionStatus>;
  getSteps(startDate: Date, endDate: Date): Promise<IStepsData[]>;
  getDistance(startDate: Date, endDate: Date): Promise<IDistanceData[]>;
  getCalories(startDate: Date, endDate: Date): Promise<ICaloriesData[]>;
  getHeartRate(startDate: Date, endDate: Date): Promise<IHeartRateData[]>;
  getRestingHeartRate(startDate: Date, endDate: Date): Promise<IRestingHeartRateData[]>;
  getWorkouts(startDate: Date, endDate: Date): Promise<IHealthWorkout[]>;
  getDailySummary(date: Date): Promise<IDailyHealthSummary>;
}

// Default Values
export const DEFAULT_HEALTH_SETTINGS: IHealthSettings = {
  enabled: false,
  platform: null,
  permissionsGranted: false,
  lastSyncAt: null,
  dataTypes: {
    steps: true,
    distance: true,
    calories: true,
    heartRate: true,
    workouts: true,
  },
  stepsGoal: 10000,
  syncInterval: 15,
};

// Heart Rate Zone Calculation (based on max HR)
export function calculateHeartRateZones(maxHR: number): Omit<IHeartRateZoneData, 'minutes' | 'percentage'>[] {
  return [
    { zone: 'rest', minBpm: 0, maxBpm: Math.round(maxHR * 0.5) },
    { zone: 'fat_burn', minBpm: Math.round(maxHR * 0.5), maxBpm: Math.round(maxHR * 0.6) },
    { zone: 'cardio', minBpm: Math.round(maxHR * 0.6), maxBpm: Math.round(maxHR * 0.7) },
    { zone: 'peak', minBpm: Math.round(maxHR * 0.7), maxBpm: Math.round(maxHR * 0.85) },
    { zone: 'max', minBpm: Math.round(maxHR * 0.85), maxBpm: maxHR },
  ];
}

// Estimate Max HR from age
export function estimateMaxHeartRate(age: number): number {
  return Math.round(220 - age);
}
