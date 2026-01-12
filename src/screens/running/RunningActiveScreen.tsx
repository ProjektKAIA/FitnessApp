// /workspaces/claude-workspace/fitnessapp/src/screens/running/RunningActiveScreen.tsx

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { useTheme } from '@/contexts';
import { RootStackParamList, IRunningSegment } from '@/types';
import { useRunningStore, IFlatSegment } from '@/stores';
import { getRunningWorkoutById, RUNNING_WORKOUT_TYPE_LABELS } from '@/data/runningLibrary';
import { handleRunningCompletion } from '@/services/workoutCompletionService';
import { useUserStore } from '@/stores';
import { useLiveHealthTracking } from '@/hooks';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'RunningWorkoutActive'>;

const EFFORT_COLORS: Record<string, string> = {
  easy: COLORS.success,
  moderate: COLORS.warning,
  hard: COLORS.accent,
  max: COLORS.error,
};

const SEGMENT_TYPE_LABELS: Record<string, { de: string; en: string; icon: string }> = {
  run: { de: 'Laufen', en: 'Run', icon: '🏃' },
  walk: { de: 'Gehen', en: 'Walk', icon: '🚶' },
  jog: { de: 'Traben', en: 'Jog', icon: '🏃' },
  sprint: { de: 'Sprint', en: 'Sprint', icon: '⚡' },
  rest: { de: 'Pause', en: 'Rest', icon: '😮‍💨' },
};

const EFFORT_LABELS: Record<string, { de: string; en: string }> = {
  easy: { de: 'Locker', en: 'Easy' },
  moderate: { de: 'Moderat', en: 'Moderate' },
  hard: { de: 'Intensiv', en: 'Hard' },
  max: { de: 'Maximum', en: 'Max' },
};

const PHASE_LABELS: Record<string, { de: string; en: string; icon: string }> = {
  warmup: { de: 'Aufwärmen', en: 'Warmup', icon: '🔥' },
  main: { de: 'Hauptteil', en: 'Main Set', icon: '💪' },
  cooldown: { de: 'Cooldown', en: 'Cooldown', icon: '❄️' },
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const RunningActiveScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const lang = i18n.language as 'de' | 'en';

  const {
    activeSession,
    currentSegmentIndex,
    segmentElapsedTime,
    totalElapsedTime,
    isRunning,
    isPaused,
    liveSteps,
    liveDistance,
    livePace,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    cancelSession,
    nextSegment,
    updateTime,
    updateHealthData,
    getCurrentSegment,
    getNextSegment,
    getTotalSegments,
    getProgress,
  } = useRunningStore();

  const user = useUserStore((state) => state.user);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const segmentTimerRef = useRef<number>(0);
  const totalTimerRef = useRef<number>(0);

  const [showEndModal, setShowEndModal] = useState(false);

  // Live Health-Tracking (Schritte/Distanz via Apple Health / Google Fit)
  const {
    data: healthData,
    isTracking: isHealthTracking,
    hasPermissions: hasHealthPermissions,
    startTracking,
    stopTracking,
  } = useLiveHealthTracking({ enabled: isRunning && !isPaused });

  // Health-Daten mit Store synchronisieren
  useEffect(() => {
    if (isHealthTracking) {
      updateHealthData(healthData.steps, healthData.distance, healthData.pace);
    }
  }, [healthData.steps, healthData.distance, healthData.pace, isHealthTracking]);

  // Start session on mount
  useEffect(() => {
    const workout = getRunningWorkoutById(route.params.workoutId);
    if (workout && !activeSession) {
      startSession(workout);
    }
  }, [route.params.workoutId]);

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        segmentTimerRef.current += 1;
        totalTimerRef.current += 1;
        updateTime(segmentTimerRef.current, totalTimerRef.current);

        // Check if segment is time-based and complete
        const currentSeg = getCurrentSegment();
        if (currentSeg?.duration) {
          const targetSeconds = currentSeg.duration * 60;
          if (segmentTimerRef.current >= targetSeconds) {
            handleSegmentComplete();
          }
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isPaused, currentSegmentIndex]);

  // Sync refs with store
  useEffect(() => {
    segmentTimerRef.current = segmentElapsedTime;
    totalTimerRef.current = totalElapsedTime;
  }, [segmentElapsedTime, totalElapsedTime]);

  const handleSegmentComplete = useCallback(() => {
    Vibration.vibrate(500);
    const totalSegments = getTotalSegments();

    if (currentSegmentIndex < totalSegments - 1) {
      segmentTimerRef.current = 0;
      nextSegment();
    } else {
      // All segments completed
      handleEndWorkout();
    }
  }, [currentSegmentIndex, nextSegment, getTotalSegments]);

  const handleSkipSegment = () => {
    const totalSegments = getTotalSegments();
    if (currentSegmentIndex < totalSegments - 1) {
      segmentTimerRef.current = 0;
      nextSegment();
      Vibration.vibrate(200);
    }
  };

  const handleEndWorkout = async () => {
    const finishedSession = endSession();
    if (finishedSession) {
      // Process completion
      try {
        await handleRunningCompletion(
          finishedSession,
          user?.weight
        );
      } catch (error) {
        console.error('[RunningActive] Completion error:', error);
      }
      navigation.replace('RunningHome');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      lang === 'de' ? 'Training abbrechen?' : 'Cancel workout?',
      lang === 'de'
        ? 'Dein Fortschritt wird nicht gespeichert.'
        : 'Your progress will not be saved.',
      [
        { text: lang === 'de' ? 'Weiter trainieren' : 'Keep going', style: 'cancel' },
        {
          text: lang === 'de' ? 'Abbrechen' : 'Cancel',
          style: 'destructive',
          onPress: () => {
            cancelSession();
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleFinish = () => {
    Alert.alert(
      lang === 'de' ? 'Training beenden?' : 'End workout?',
      lang === 'de'
        ? 'Möchtest du das Training jetzt beenden?'
        : 'Do you want to end the workout now?',
      [
        { text: lang === 'de' ? 'Weiter' : 'Continue', style: 'cancel' },
        {
          text: lang === 'de' ? 'Beenden' : 'End',
          onPress: handleEndWorkout,
        },
      ]
    );
  };

  const currentSegment = getCurrentSegment();
  const nextSeg = getNextSegment();
  const progress = getProgress();
  const totalSegments = getTotalSegments();

  if (!activeSession || !currentSegment) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          {lang === 'de' ? 'Lädt...' : 'Loading...'}
        </Text>
      </SafeAreaView>
    );
  }

  const segmentDuration = currentSegment.duration ? currentSegment.duration * 60 : null;
  const segmentProgress = segmentDuration
    ? Math.min((segmentElapsedTime / segmentDuration) * 100, 100)
    : 0;

  const effortColor = currentSegment.effort
    ? EFFORT_COLORS[currentSegment.effort]
    : COLORS.accent;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={[styles.cancelText, { color: COLORS.error }]}>
            {lang === 'de' ? 'Abbrechen' : 'Cancel'}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {activeSession.workoutName}
        </Text>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={[styles.finishText, { color: COLORS.success }]}>
            {lang === 'de' ? 'Beenden' : 'Finish'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressContainer, { backgroundColor: colors.surface }]}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progress}%`, backgroundColor: COLORS.accent }]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {currentSegmentIndex + 1} / {totalSegments}
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Total Timer */}
        <View style={styles.totalTimerContainer}>
          <Text style={[styles.totalTimerLabel, { color: colors.textSecondary }]}>
            {t('running.totalTime')}
          </Text>
          <Text style={[styles.totalTimer, { color: colors.text }]}>
            {formatTime(totalElapsedTime)}
          </Text>
        </View>

        {/* Live Health Stats */}
        {hasHealthPermissions && (
          <View style={[styles.healthStatsContainer, { backgroundColor: colors.surface }]}>
            <View style={styles.healthStatItem}>
              <Text style={styles.healthStatIcon}>👣</Text>
              <Text style={[styles.healthStatValue, { color: colors.text }]}>
                {liveSteps.toLocaleString()}
              </Text>
              <Text style={[styles.healthStatLabel, { color: colors.textSecondary }]}>
                {t('running.steps')}
              </Text>
            </View>
            <View style={[styles.healthStatDivider, { backgroundColor: colors.border }]} />
            <View style={styles.healthStatItem}>
              <Text style={styles.healthStatIcon}>📏</Text>
              <Text style={[styles.healthStatValue, { color: colors.text }]}>
                {liveDistance >= 1000
                  ? `${(liveDistance / 1000).toFixed(2)} km`
                  : `${Math.round(liveDistance)} m`}
              </Text>
              <Text style={[styles.healthStatLabel, { color: colors.textSecondary }]}>
                {t('running.distance')}
              </Text>
            </View>
            <View style={[styles.healthStatDivider, { backgroundColor: colors.border }]} />
            <View style={styles.healthStatItem}>
              <Text style={styles.healthStatIcon}>⏱️</Text>
              <Text style={[styles.healthStatValue, { color: colors.text }]}>
                {livePace > 0 ? `${livePace.toFixed(1)}'` : '--'}
              </Text>
              <Text style={[styles.healthStatLabel, { color: colors.textSecondary }]}>
                {t('running.pacePerKm')}
              </Text>
            </View>
          </View>
        )}

        {/* Current Segment Card */}
        <View style={[styles.segmentCard, { backgroundColor: effortColor }]}>
          <View style={styles.phaseRow}>
            <Text style={styles.phaseIcon}>{PHASE_LABELS[currentSegment.phase].icon}</Text>
            <Text style={styles.phaseText}>
              {PHASE_LABELS[currentSegment.phase][lang]}
            </Text>
          </View>

          <Text style={styles.segmentIcon}>
            {SEGMENT_TYPE_LABELS[currentSegment.type].icon}
          </Text>

          <Text style={styles.segmentType}>
            {SEGMENT_TYPE_LABELS[currentSegment.type][lang]}
          </Text>

          {currentSegment.effort && (
            <Text style={styles.effortText}>
              {EFFORT_LABELS[currentSegment.effort][lang]}
            </Text>
          )}

          {/* Segment Timer / Info */}
          {segmentDuration ? (
            <View style={styles.segmentTimerContainer}>
              <Text style={styles.segmentTimer}>
                {formatTime(segmentElapsedTime)}
              </Text>
              <Text style={styles.segmentTarget}>
                / {formatTime(segmentDuration)}
              </Text>
              {/* Segment Progress */}
              <View style={styles.segmentProgressBar}>
                <View
                  style={[
                    styles.segmentProgressFill,
                    { width: `${segmentProgress}%` },
                  ]}
                />
              </View>
            </View>
          ) : currentSegment.distance ? (
            <View style={styles.distanceContainer}>
              <Text style={styles.distanceValue}>{currentSegment.distance} km</Text>
              <Text style={styles.distanceLabel}>
                {lang === 'de' ? 'Distanz' : 'Distance'}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Next Segment Preview */}
        {nextSeg && (
          <View style={[styles.nextSegmentCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.nextLabel, { color: colors.textSecondary }]}>
              {lang === 'de' ? 'Als Nächstes' : 'Up Next'}
            </Text>
            <View style={styles.nextSegmentRow}>
              <Text style={styles.nextIcon}>
                {SEGMENT_TYPE_LABELS[nextSeg.type].icon}
              </Text>
              <Text style={[styles.nextType, { color: colors.text }]}>
                {SEGMENT_TYPE_LABELS[nextSeg.type][lang]}
              </Text>
              {nextSeg.effort && (
                <View
                  style={[
                    styles.nextEffortBadge,
                    { backgroundColor: EFFORT_COLORS[nextSeg.effort] + '30' },
                  ]}
                >
                  <Text
                    style={[
                      styles.nextEffortText,
                      { color: EFFORT_COLORS[nextSeg.effort] },
                    ]}
                  >
                    {EFFORT_LABELS[nextSeg.effort][lang]}
                  </Text>
                </View>
              )}
              {nextSeg.duration && (
                <Text style={[styles.nextDuration, { color: colors.textSecondary }]}>
                  {nextSeg.duration} min
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Control Buttons */}
        <View style={styles.controls}>
          {/* Skip Button */}
          <TouchableOpacity
            style={[styles.controlButton, styles.skipButton, { backgroundColor: colors.surface }]}
            onPress={handleSkipSegment}
            disabled={currentSegmentIndex >= totalSegments - 1}
          >
            <Text style={styles.skipIcon}>{'⏭️'}</Text>
            <Text style={[styles.skipText, { color: colors.text }]}>
              {lang === 'de' ? 'Überspringen' : 'Skip'}
            </Text>
          </TouchableOpacity>

          {/* Pause/Resume Button */}
          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.pauseButton,
              { backgroundColor: isPaused ? COLORS.success : COLORS.warning },
            ]}
            onPress={isPaused ? resumeSession : pauseSession}
          >
            <Text style={styles.pauseIcon}>{isPaused ? '▶️' : '⏸️'}</Text>
            <Text style={styles.pauseText}>
              {isPaused
                ? lang === 'de' ? 'Fortsetzen' : 'Resume'
                : lang === 'de' ? 'Pause' : 'Pause'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: SPACING['4xl'],
    fontSize: FONT_SIZES.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  cancelButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  cancelText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.sm,
  },
  finishButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  finishText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
  },
  progressText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  totalTimerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  totalTimerLabel: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
  },
  totalTimer: {
    fontSize: FONT_SIZES['4xl'],
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  healthStatsContainer: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  healthStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  healthStatIcon: {
    fontSize: 20,
    marginBottom: SPACING.xs,
  },
  healthStatValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  healthStatLabel: {
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  healthStatDivider: {
    width: 1,
    marginVertical: SPACING.xs,
  },
  segmentCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  phaseIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  phaseText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.9,
    fontWeight: '500',
  },
  segmentIcon: {
    fontSize: 64,
    marginBottom: SPACING.sm,
  },
  segmentType: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  effortText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SPACING.lg,
  },
  segmentTimerContainer: {
    alignItems: 'center',
  },
  segmentTimer: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '700',
    color: COLORS.white,
    fontVariant: ['tabular-nums'],
  },
  segmentTarget: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
    opacity: 0.7,
    marginTop: SPACING.xs,
  },
  segmentProgressBar: {
    width: 200,
    height: 8,
    backgroundColor: COLORS.overlay.light,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.md,
    overflow: 'hidden',
  },
  segmentProgressFill: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.full,
  },
  distanceContainer: {
    alignItems: 'center',
  },
  distanceValue: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '700',
    color: COLORS.white,
  },
  distanceLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.7,
  },
  nextSegmentCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    ...SHADOWS.sm,
  },
  nextLabel: {
    fontSize: FONT_SIZES.xs,
    marginBottom: SPACING.sm,
  },
  nextSegmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  nextIcon: {
    fontSize: 24,
  },
  nextType: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    flex: 1,
  },
  nextEffortBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  nextEffortText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  nextDuration: {
    fontSize: FONT_SIZES.sm,
  },
  controls: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: 'auto',
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    gap: SPACING.sm,
    ...SHADOWS.md,
  },
  skipButton: {},
  skipIcon: {
    fontSize: 20,
  },
  skipText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  pauseButton: {},
  pauseIcon: {
    fontSize: 20,
  },
  pauseText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
});
