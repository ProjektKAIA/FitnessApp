// /workspaces/claude-workspace/fitnessapp/src/screens/yoga/YogaActiveScreen.tsx

import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { useTheme } from '@/contexts';
import { RootStackParamList } from '@/types';
import { useYogaStore, IYogaActivePose, useUserStore } from '@/stores';
import {
  getYogaSessionById,
  getYogaPoseById,
  YOGA_STYLE_LABELS,
} from '@/data/yogaLibrary';
import { handleYogaCompletion } from '@/services/workoutCompletionService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'YogaSessionActive'>;

const SIDE_LABELS: Record<string, { de: string; en: string }> = {
  left: { de: 'Linke Seite', en: 'Left Side' },
  right: { de: 'Rechte Seite', en: 'Right Side' },
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const YogaActiveScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const lang = i18n.language as 'de' | 'en';

  const {
    activeSession,
    activePoses,
    currentPoseIndex,
    poseElapsedTime,
    totalElapsedTime,
    isRunning,
    isPaused,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    cancelSession,
    nextPose,
    previousPose,
    updateTime,
    getCurrentPose,
    getNextPose,
    getTotalPoses,
    getProgress,
  } = useYogaStore();

  const user = useUserStore((state) => state.user);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const poseTimerRef = useRef<number>(0);
  const totalTimerRef = useRef<number>(0);

  // Start session on mount
  useEffect(() => {
    const session = getYogaSessionById(route.params.sessionId);
    if (session && !activeSession) {
      startSession(session);
    }
  }, [route.params.sessionId]);

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        poseTimerRef.current += 1;
        totalTimerRef.current += 1;
        updateTime(poseTimerRef.current, totalTimerRef.current);

        // Check if pose duration is complete
        const currentPose = getCurrentPose();
        if (currentPose?.duration) {
          if (poseTimerRef.current >= currentPose.duration) {
            handlePoseComplete();
          }
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isPaused, currentPoseIndex]);

  // Sync refs with store
  useEffect(() => {
    poseTimerRef.current = poseElapsedTime;
    totalTimerRef.current = totalElapsedTime;
  }, [poseElapsedTime, totalElapsedTime]);

  const handlePoseComplete = useCallback(() => {
    Vibration.vibrate([0, 200, 100, 200]); // Double vibration
    const totalPoses = getTotalPoses();

    if (currentPoseIndex < totalPoses - 1) {
      poseTimerRef.current = 0;
      nextPose();
    } else {
      // All poses completed
      handleEndSession();
    }
  }, [currentPoseIndex, nextPose, getTotalPoses]);

  const handleSkipPose = () => {
    const totalPoses = getTotalPoses();
    if (currentPoseIndex < totalPoses - 1) {
      poseTimerRef.current = 0;
      nextPose();
      Vibration.vibrate(100);
    }
  };

  const handlePrevPose = () => {
    if (currentPoseIndex > 0) {
      poseTimerRef.current = 0;
      previousPose();
      Vibration.vibrate(100);
    }
  };

  const handleEndSession = async () => {
    const finishedSession = endSession();
    if (finishedSession) {
      try {
        await handleYogaCompletion(finishedSession, user?.weight);
      } catch (error) {
        console.error('[YogaActive] Completion error:', error);
      }
      navigation.replace('YogaHome');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      lang === 'de' ? 'Session abbrechen?' : 'Cancel session?',
      lang === 'de'
        ? 'Dein Fortschritt wird nicht gespeichert.'
        : 'Your progress will not be saved.',
      [
        { text: lang === 'de' ? 'Weiter' : 'Continue', style: 'cancel' },
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
      lang === 'de' ? 'Session beenden?' : 'End session?',
      lang === 'de'
        ? 'Möchtest du die Session jetzt beenden?'
        : 'Do you want to end the session now?',
      [
        { text: lang === 'de' ? 'Weiter' : 'Continue', style: 'cancel' },
        {
          text: lang === 'de' ? 'Beenden' : 'End',
          onPress: handleEndSession,
        },
      ]
    );
  };

  const currentPose = getCurrentPose();
  const nextPoseData = getNextPose();
  const progress = getProgress();
  const totalPoses = getTotalPoses();

  // Get pose details
  const currentPoseDetails = currentPose ? getYogaPoseById(currentPose.poseId) : null;
  const nextPoseDetails = nextPoseData ? getYogaPoseById(nextPoseData.poseId) : null;

  if (!activeSession || !currentPose || !currentPoseDetails) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          {lang === 'de' ? 'Lädt...' : 'Loading...'}
        </Text>
      </SafeAreaView>
    );
  }

  const poseDuration = currentPose.duration;
  const poseProgress = poseDuration
    ? Math.min((poseElapsedTime / poseDuration) * 100, 100)
    : 0;

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
          {activeSession.sessionName}
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
            style={[styles.progressFill, { width: `${progress}%`, backgroundColor: COLORS.yoga }]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {currentPoseIndex + 1} / {totalPoses}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Total Timer */}
        <View style={styles.totalTimerContainer}>
          <Text style={[styles.totalTimerLabel, { color: colors.textSecondary }]}>
            {lang === 'de' ? 'Gesamtzeit' : 'Total Time'}
          </Text>
          <Text style={[styles.totalTimer, { color: colors.text }]}>
            {formatTime(totalElapsedTime)}
          </Text>
        </View>

        {/* Current Pose Card */}
        <View style={[styles.poseCard, { backgroundColor: COLORS.yoga }]}>
          {/* Pose Icon */}
          <Text style={styles.poseIcon}>{'🧘'}</Text>

          {/* Pose Name */}
          <Text style={styles.poseName}>
            {lang === 'de' ? currentPoseDetails.name : currentPoseDetails.nameEn}
          </Text>

          {/* Sanskrit Name */}
          {currentPoseDetails.sanskritName && (
            <Text style={styles.sanskritName}>{currentPoseDetails.sanskritName}</Text>
          )}

          {/* Side Indicator */}
          {currentPose.side && (
            <View style={styles.sideBadge}>
              <Text style={styles.sideText}>
                {SIDE_LABELS[currentPose.side][lang]}
              </Text>
            </View>
          )}

          {/* Pose Timer */}
          {poseDuration && (
            <View style={styles.poseTimerContainer}>
              <Text style={styles.poseTimer}>
                {formatTime(poseElapsedTime)}
              </Text>
              <Text style={styles.poseTarget}>
                / {formatTime(poseDuration)}
              </Text>
              {/* Pose Progress */}
              <View style={styles.poseProgressBar}>
                <View
                  style={[
                    styles.poseProgressFill,
                    { width: `${poseProgress}%` },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Hold Time Hint */}
          {currentPoseDetails.holdTime && (
            <Text style={styles.holdTimeHint}>
              {lang === 'de' ? 'Halte' : 'Hold'}: {currentPoseDetails.holdTime}
            </Text>
          )}
        </View>

        {/* Brief Instructions */}
        <View style={[styles.instructionsCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.instructionsTitle, { color: colors.text }]}>
            {lang === 'de' ? 'Anleitung' : 'Instructions'}
          </Text>
          {currentPoseDetails.instructions.slice(0, 3).map((instruction, index) => (
            <View key={index} style={styles.instructionRow}>
              <Text style={[styles.instructionNumber, { color: COLORS.yoga }]}>
                {index + 1}
              </Text>
              <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                {instruction}
              </Text>
            </View>
          ))}
        </View>

        {/* Next Pose Preview */}
        {nextPoseDetails && (
          <View style={[styles.nextPoseCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.nextLabel, { color: colors.textSecondary }]}>
              {lang === 'de' ? 'Als Nächstes' : 'Up Next'}
            </Text>
            <View style={styles.nextPoseRow}>
              <Text style={styles.nextIcon}>{'🧘'}</Text>
              <View style={styles.nextPoseInfo}>
                <Text style={[styles.nextPoseName, { color: colors.text }]}>
                  {lang === 'de' ? nextPoseDetails.name : nextPoseDetails.nameEn}
                </Text>
                {nextPoseData?.side && (
                  <Text style={[styles.nextPoseSide, { color: colors.textSecondary }]}>
                    {SIDE_LABELS[nextPoseData.side][lang]}
                  </Text>
                )}
              </View>
              {nextPoseData?.duration && (
                <Text style={[styles.nextDuration, { color: colors.textSecondary }]}>
                  {Math.round(nextPoseData.duration / 60)} min
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Control Buttons */}
      <View style={[styles.controls, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        {/* Previous Button */}
        <TouchableOpacity
          style={[styles.controlButton, styles.navButton, { backgroundColor: colors.background }]}
          onPress={handlePrevPose}
          disabled={currentPoseIndex === 0}
        >
          <Text style={[styles.navIcon, { opacity: currentPoseIndex === 0 ? 0.3 : 1 }]}>{'⏮️'}</Text>
        </TouchableOpacity>

        {/* Pause/Resume Button */}
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.pauseButton,
            { backgroundColor: isPaused ? COLORS.success : COLORS.yoga },
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

        {/* Skip Button */}
        <TouchableOpacity
          style={[styles.controlButton, styles.navButton, { backgroundColor: colors.background }]}
          onPress={handleSkipPose}
          disabled={currentPoseIndex >= totalPoses - 1}
        >
          <Text style={[styles.navIcon, { opacity: currentPoseIndex >= totalPoses - 1 ? 0.3 : 1 }]}>{'⏭️'}</Text>
        </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  totalTimerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  totalTimerLabel: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
  },
  totalTimer: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  poseCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
  },
  poseIcon: {
    fontSize: 64,
    marginBottom: SPACING.sm,
  },
  poseName: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  sanskritName: {
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    opacity: 0.8,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
  sideBadge: {
    backgroundColor: COLORS.overlay.light,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
  },
  sideText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  poseTimerContainer: {
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  poseTimer: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '700',
    color: COLORS.white,
    fontVariant: ['tabular-nums'],
  },
  poseTarget: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
    opacity: 0.7,
    marginTop: SPACING.xs,
  },
  poseProgressBar: {
    width: 200,
    height: 8,
    backgroundColor: COLORS.overlay.light,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.md,
    overflow: 'hidden',
  },
  poseProgressFill: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.full,
  },
  holdTimeHint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SPACING.md,
  },
  instructionsCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  instructionsTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  instructionRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  instructionNumber: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    width: 20,
  },
  instructionText: {
    fontSize: FONT_SIZES.sm,
    flex: 1,
    lineHeight: 20,
  },
  nextPoseCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  nextLabel: {
    fontSize: FONT_SIZES.xs,
    marginBottom: SPACING.sm,
  },
  nextPoseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  nextPoseInfo: {
    flex: 1,
  },
  nextPoseName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  nextPoseSide: {
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  nextDuration: {
    fontSize: FONT_SIZES.sm,
  },
  controls: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
    borderTopWidth: 1,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.md,
  },
  navButton: {
    width: 56,
    height: 56,
  },
  navIcon: {
    fontSize: 24,
  },
  pauseButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  pauseIcon: {
    fontSize: 20,
  },
  pauseText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
});
