import { useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useHealthStore } from '@/stores/healthStore';
import { getHealthService, isHealthSupported } from '@/services/health';
import { IDailyHealthSummary } from '@/types/health';

interface UseHealthDataOptions {
  autoSync?: boolean;
  syncOnForeground?: boolean;
  syncInterval?: number; // in milliseconds
}

interface UseHealthDataReturn {
  // Data
  todaySummary: IDailyHealthSummary | null;
  weekSummaries: IDailyHealthSummary[];
  isEnabled: boolean;
  isSupported: boolean;

  // Status
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  lastSyncAt: string | null;

  // Actions
  sync: () => Promise<void>;
  syncToday: () => Promise<void>;
  syncWeek: () => Promise<void>;
}

const DEFAULT_OPTIONS: UseHealthDataOptions = {
  autoSync: true,
  syncOnForeground: true,
  syncInterval: 15 * 60 * 1000, // 15 minutes
};

export function useHealthData(options: UseHealthDataOptions = {}): UseHealthDataReturn {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const lastSyncTimeRef = useRef<number>(0);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const {
    settings,
    todaySummary,
    weekSummaries,
    isLoading,
    isSyncing,
    error,
    setTodaySummary,
    setWeekSummaries,
    setSyncing,
    setLoading,
    setError,
    updateLastSync,
  } = useHealthStore();

  const healthService = getHealthService();
  const isSupported = isHealthSupported();
  const isEnabled = settings.enabled && settings.permissionsGranted;

  const syncToday = useCallback(async () => {
    if (!healthService || !isEnabled) return;

    try {
      const today = new Date();
      const summary = await healthService.getDailySummary(today);
      setTodaySummary(summary);
    } catch (err) {
      console.error('Error syncing today:', err);
      throw err;
    }
  }, [healthService, isEnabled, setTodaySummary]);

  const syncWeek = useCallback(async () => {
    if (!healthService || !isEnabled) return;

    try {
      const today = new Date();
      const summaries: IDailyHealthSummary[] = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const summary = await healthService.getDailySummary(date);
        summaries.push(summary);
      }

      setWeekSummaries(summaries);
    } catch (err) {
      console.error('Error syncing week:', err);
      throw err;
    }
  }, [healthService, isEnabled, setWeekSummaries]);

  const sync = useCallback(async () => {
    if (!healthService || !isEnabled || isSyncing) return;

    setSyncing(true);
    setError(null);

    try {
      await Promise.all([syncToday(), syncWeek()]);
      updateLastSync();
      lastSyncTimeRef.current = Date.now();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      console.error('Health sync error:', err);
    } finally {
      setSyncing(false);
    }
  }, [healthService, isEnabled, isSyncing, syncToday, syncWeek, setSyncing, setError, updateLastSync]);

  // Auto-sync on mount
  useEffect(() => {
    if (opts.autoSync && isEnabled && !todaySummary) {
      sync();
    }
  }, [opts.autoSync, isEnabled]);

  // Sync on app foreground
  useEffect(() => {
    if (!opts.syncOnForeground || !isEnabled) return;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const wasInBackground =
        appStateRef.current.match(/inactive|background/) && nextAppState === 'active';

      if (wasInBackground) {
        const timeSinceLastSync = Date.now() - lastSyncTimeRef.current;
        const shouldSync = timeSinceLastSync >= (opts.syncInterval || 0);

        if (shouldSync) {
          sync();
        }
      }

      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [opts.syncOnForeground, opts.syncInterval, isEnabled, sync]);

  // Periodic sync interval
  useEffect(() => {
    if (!opts.syncInterval || !isEnabled) return;

    const intervalId = setInterval(() => {
      const timeSinceLastSync = Date.now() - lastSyncTimeRef.current;
      if (timeSinceLastSync >= opts.syncInterval!) {
        sync();
      }
    }, opts.syncInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [opts.syncInterval, isEnabled, sync]);

  return {
    // Data
    todaySummary,
    weekSummaries,
    isEnabled,
    isSupported,

    // Status
    isLoading,
    isSyncing,
    error,
    lastSyncAt: settings.lastSyncAt,

    // Actions
    sync,
    syncToday,
    syncWeek,
  };
}
