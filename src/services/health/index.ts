// Health Services - Platform agnostic health data integration
// IMPORTANT: AppleHealthService and HealthConnectService are NOT exported here
// to prevent loading native modules at app startup. Use createHealthService() instead.
export {
  createHealthService,
  getHealthService,
  getHealthPlatform,
  isHealthSupported,
  resetHealthService,
  BaseHealthService,
} from './healthService';

// Data transformers don't import native modules, safe to export
export { transformAppleHealthData, transformHealthConnectData } from './dataTransformers';

export {
  estimateMaxHeartRate,
  calculateZones,
  getZoneForHeartRate,
  analyzeHeartRateZones,
  calculateTRIMP,
  calculateTrainingLoad,
  getTrainingLoadColor,
  getTrainingLoadLabel,
  ZONE_NAMES,
  ZONE_COLORS,
} from './hrZoneCalculator';
