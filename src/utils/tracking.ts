// /workspaces/claude-workspace/fitnessapp/src/utils/tracking.ts

import { Platform } from 'react-native';
import { requestTrackingPermission, getTrackingStatus } from 'react-native-tracking-transparency';

export type TrackingStatus = 'not-determined' | 'authorized' | 'denied' | 'restricted';

/**
 * Requests App Tracking Transparency permission (iOS only)
 * On Android, always returns 'authorized'
 */
export const requestAppTracking = async (): Promise<TrackingStatus> => {
  if (Platform.OS === 'ios') {
    try {
      const status = await requestTrackingPermission();
      return status as TrackingStatus;
    } catch (error) {
      console.error('[Tracking] Error requesting tracking permission:', error);
      return 'denied';
    }
  }
  // Android doesn't have ATT, always return authorized
  return 'authorized';
};

/**
 * Gets the current tracking permission status
 */
export const getAppTrackingStatus = async (): Promise<TrackingStatus> => {
  if (Platform.OS === 'ios') {
    try {
      const status = await getTrackingStatus();
      return status as TrackingStatus;
    } catch (error) {
      console.error('[Tracking] Error getting tracking status:', error);
      return 'denied';
    }
  }
  return 'authorized';
};
