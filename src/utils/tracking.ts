// /workspaces/claude-workspace/fitnessapp/src/utils/tracking.ts

import { Platform } from 'react-native';
import {
  requestTrackingPermissionsAsync,
  getTrackingPermissionsAsync,
  PermissionStatus,
} from 'expo-tracking-transparency';

export type TrackingStatus = 'not-determined' | 'authorized' | 'denied' | 'restricted';

/**
 * Maps Expo permission status to our TrackingStatus type
 */
const mapPermissionStatus = (status: PermissionStatus): TrackingStatus => {
  switch (status) {
    case PermissionStatus.GRANTED:
      return 'authorized';
    case PermissionStatus.DENIED:
      return 'denied';
    case PermissionStatus.UNDETERMINED:
    default:
      return 'not-determined';
  }
};

/**
 * Requests App Tracking Transparency permission (iOS only)
 * On Android, always returns 'authorized'
 */
export const requestAppTracking = async (): Promise<TrackingStatus> => {
  // Only iOS 14+ has ATT
  if (Platform.OS !== 'ios') {
    return 'authorized';
  }

  try {
    const { status } = await requestTrackingPermissionsAsync();
    return mapPermissionStatus(status);
  } catch (error) {
    console.error('[Tracking] Error requesting tracking permission:', error);
    return 'not-determined';
  }
};

/**
 * Gets the current tracking permission status
 */
export const getAppTrackingStatus = async (): Promise<TrackingStatus> => {
  if (Platform.OS !== 'ios') {
    return 'authorized';
  }

  try {
    const { status } = await getTrackingPermissionsAsync();
    return mapPermissionStatus(status);
  } catch (error) {
    console.error('[Tracking] Error getting tracking status:', error);
    return 'not-determined';
  }
};
