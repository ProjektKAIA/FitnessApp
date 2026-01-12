// /workspaces/claude-workspace/fitnessapp/src/hooks/useLiveHealthTracking.ts

import { useEffect, useRef, useState, useCallback } from 'react';
import { getHealthService, isHealthSupported } from '@/services/health';
import { useHealthStore } from '@/stores/healthStore';
import { IStepsData, IDistanceData } from '@/types/health';

interface LiveHealthData {
  steps: number;
  distance: number; // in meters
  stepsPerMinute: number;
  pace: number; // min/km
}

interface UseLiveHealthTrackingOptions {
  enabled?: boolean;
  updateInterval?: number; // ms
}

interface UseLiveHealthTrackingReturn {
  data: LiveHealthData;
  isTracking: boolean;
  isSupported: boolean;
  hasPermissions: boolean;
  startTracking: () => void;
  stopTracking: () => void;
  resetBaseline: () => void;
}

const DEFAULT_OPTIONS: UseLiveHealthTrackingOptions = {
  enabled: true,
  updateInterval: 3000, // 3 Sekunden
};

export function useLiveHealthTracking(
  options: UseLiveHealthTrackingOptions = {}
): UseLiveHealthTrackingReturn {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const healthService = getHealthService();
  const isSupported = isHealthSupported();
  const { settings } = useHealthStore();
  const hasPermissions = settings.enabled && settings.permissionsGranted;

  const [isTracking, setIsTracking] = useState(false);
  const [data, setData] = useState<LiveHealthData>({
    steps: 0,
    distance: 0,
    stepsPerMinute: 0,
    pace: 0,
  });

  const baselineStepsRef = useRef<number | null>(null);
  const baselineDistanceRef = useRef<number | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastStepsRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<Date | null>(null);

  const fetchCurrentData = useCallback(async () => {
    if (!healthService || !hasPermissions) return;

    try {
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);

      const [stepsData, distanceData] = await Promise.all([
        healthService.getSteps(startOfDay, now),
        healthService.getDistance(startOfDay, now),
      ]);

      const totalSteps = stepsData.reduce((sum, s) => sum + s.count, 0);
      const totalDistance = distanceData.reduce((sum, d) => sum + d.meters, 0);

      // Baseline setzen beim ersten Aufruf
      if (baselineStepsRef.current === null) {
        baselineStepsRef.current = totalSteps;
        baselineDistanceRef.current = totalDistance;
        startTimeRef.current = now;
        lastStepsRef.current = 0;
        lastUpdateTimeRef.current = now;
      }

      const sessionSteps = Math.max(0, totalSteps - (baselineStepsRef.current || 0));
      const sessionDistance = Math.max(0, totalDistance - (baselineDistanceRef.current || 0));

      // Schritte pro Minute berechnen
      const elapsedMinutes = startTimeRef.current
        ? (now.getTime() - startTimeRef.current.getTime()) / 60000
        : 0;
      const stepsPerMinute = elapsedMinutes > 0 ? Math.round(sessionSteps / elapsedMinutes) : 0;

      // Pace berechnen (min/km)
      const sessionDistanceKm = sessionDistance / 1000;
      const pace = sessionDistanceKm > 0.01 ? elapsedMinutes / sessionDistanceKm : 0;

      setData({
        steps: sessionSteps,
        distance: sessionDistance,
        stepsPerMinute,
        pace,
      });

      lastStepsRef.current = sessionSteps;
      lastUpdateTimeRef.current = now;
    } catch (error) {
      console.error('[LiveHealthTracking] Error fetching data:', error);
    }
  }, [healthService, hasPermissions]);

  const startTracking = useCallback(() => {
    if (!isSupported || !hasPermissions || isTracking) return;

    // Reset baseline für neue Session
    baselineStepsRef.current = null;
    baselineDistanceRef.current = null;
    startTimeRef.current = null;
    setData({ steps: 0, distance: 0, stepsPerMinute: 0, pace: 0 });

    setIsTracking(true);

    // Sofort erste Daten holen
    fetchCurrentData();

    // Intervall starten
    intervalRef.current = setInterval(fetchCurrentData, opts.updateInterval);
  }, [isSupported, hasPermissions, isTracking, fetchCurrentData, opts.updateInterval]);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetBaseline = useCallback(() => {
    baselineStepsRef.current = null;
    baselineDistanceRef.current = null;
    startTimeRef.current = null;
    setData({ steps: 0, distance: 0, stepsPerMinute: 0, pace: 0 });

    if (isTracking) {
      fetchCurrentData();
    }
  }, [isTracking, fetchCurrentData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-start wenn enabled
  useEffect(() => {
    if (opts.enabled && hasPermissions && !isTracking) {
      startTracking();
    } else if (!opts.enabled && isTracking) {
      stopTracking();
    }
  }, [opts.enabled, hasPermissions]);

  return {
    data,
    isTracking,
    isSupported,
    hasPermissions,
    startTracking,
    stopTracking,
    resetBaseline,
  };
}
