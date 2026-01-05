// Health Services - Platform agnostic health data integration
export {
  createHealthService,
  getHealthService,
  getHealthPlatform,
  isHealthSupported,
  resetHealthService,
  BaseHealthService,
} from './healthService';

export { AppleHealthService } from './appleHealth';
export { HealthConnectService } from './healthConnect';

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
