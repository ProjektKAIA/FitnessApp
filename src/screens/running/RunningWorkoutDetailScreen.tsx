// /workspaces/claude-workspace/fitnessapp/src/screens/running/RunningWorkoutDetailScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { useTheme } from '@/contexts';
import { RootStackParamList, IRunningSegment } from '@/types';
import {
  getRunningWorkoutById,
  RUNNING_WORKOUT_TYPE_LABELS,
} from '@/data/runningLibrary';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'RunningWorkoutDetail'>;

const EFFORT_LABELS: Record<string, { de: string; color: string }> = {
  easy: { de: 'Locker', color: COLORS.success },
  moderate: { de: 'Moderat', color: COLORS.warning },
  hard: { de: 'Intensiv', color: COLORS.accent },
  max: { de: 'Maximum', color: COLORS.error },
};

const SEGMENT_TYPE_LABELS: Record<string, { de: string; icon: string }> = {
  run: { de: 'Laufen', icon: '🏃' },
  walk: { de: 'Gehen', icon: '🚶' },
  jog: { de: 'Traben', icon: '🏃' },
  sprint: { de: 'Sprint', icon: '⚡' },
  rest: { de: 'Pause', icon: '😮‍💨' },
};

export const RunningWorkoutDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();

  const workout = getRunningWorkoutById(route.params.workoutId);

  if (!workout) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>{t('running.workoutNotFound')}</Text>
      </SafeAreaView>
    );
  }

  const renderSegment = (segment: IRunningSegment, index: number, isMain: boolean = false) => {
    const effortInfo = segment.effort ? EFFORT_LABELS[segment.effort] : null;
    const typeInfo = SEGMENT_TYPE_LABELS[segment.type];
    const reps = segment.reps || 1;

    return (
      <View key={index} style={[styles.segmentCard, { backgroundColor: colors.surface }]}>
        <View style={styles.segmentHeader}>
          <Text style={styles.segmentIcon}>{typeInfo.icon}</Text>
          <View style={styles.segmentInfo}>
            <Text style={[styles.segmentType, { color: colors.text }]}>
              {reps > 1 ? `${reps}x ` : ''}{typeInfo.de}
            </Text>
            {effortInfo && (
              <View style={[styles.effortBadge, { backgroundColor: effortInfo.color + '20' }]}>
                <Text style={[styles.effortText, { color: effortInfo.color }]}>
                  {effortInfo.de}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.segmentDetails}>
          {segment.duration && (
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>{'⏱️'}</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {segment.duration} {t('running.min')}
              </Text>
            </View>
          )}
          {segment.distance && (
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>{'📏'}</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {segment.distance} km
              </Text>
            </View>
          )}
          {segment.pace && (
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>{'🏎️'}</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {segment.pace}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backIcon, { color: colors.text }]}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {workout.name}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Workout Info */}
        <View style={[styles.infoCard, { backgroundColor: COLORS.accent }]}>
          <Text style={styles.workoutIcon}>
            {RUNNING_WORKOUT_TYPE_LABELS[workout.type].icon}
          </Text>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {RUNNING_WORKOUT_TYPE_LABELS[workout.type].de}
            </Text>
          </View>
          <Text style={styles.workoutDescription}>{workout.description}</Text>

          <View style={styles.statsRow}>
            {workout.targetDuration && (
              <View style={styles.stat}>
                <Text style={styles.statValue}>{workout.targetDuration}</Text>
                <Text style={styles.statLabel}>{t('running.min')}</Text>
              </View>
            )}
            {workout.targetDistance && (
              <View style={styles.stat}>
                <Text style={styles.statValue}>{workout.targetDistance}</Text>
                <Text style={styles.statLabel}>km</Text>
              </View>
            )}
          </View>
        </View>

        {/* Warmup */}
        {workout.warmup && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>{'🔥'}</Text>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('running.warmup')}</Text>
            </View>
            {renderSegment(workout.warmup, 0)}
          </>
        )}

        {/* Main Set */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>{'💪'}</Text>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('running.mainSet')}</Text>
        </View>
        {workout.mainSet.map((segment, index) => renderSegment(segment, index, true))}

        {/* Cooldown */}
        {workout.cooldown && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>{'❄️'}</Text>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('running.cooldown')}</Text>
            </View>
            {renderSegment(workout.cooldown, 0)}
          </>
        )}

        {/* Notes */}
        {workout.notes && (
          <View style={[styles.notesCard, { backgroundColor: colors.surface }]}>
            <Text style={styles.notesIcon}>{'💡'}</Text>
            <View style={styles.notesContent}>
              <Text style={[styles.notesLabel, { color: colors.textSecondary }]}>{t('running.tips')}</Text>
              <Text style={[styles.notesText, { color: colors.text }]}>{workout.notes}</Text>
            </View>
          </View>
        )}

        {/* Start Button */}
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: COLORS.accent }]}
          onPress={() => navigation.navigate('RunningWorkoutActive', { workoutId: workout.id })}
        >
          <Text style={styles.startButtonText}>{t('running.startWorkout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.md,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING['4xl'],
  },
  errorText: {
    textAlign: 'center',
    marginTop: SPACING['4xl'],
    fontSize: FONT_SIZES.lg,
  },
  infoCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
  },
  workoutIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  workoutName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  typeBadge: {
    backgroundColor: COLORS.overlay.light,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
  },
  typeBadgeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  workoutDescription: {
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING['3xl'],
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  segmentCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  segmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  segmentIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  segmentInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  segmentType: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  effortBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  effortText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  segmentDetails: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginLeft: 40,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  detailIcon: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: FONT_SIZES.sm,
  },
  notesCard: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.lg,
    ...SHADOWS.sm,
  },
  notesIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  notesContent: {
    flex: 1,
  },
  notesLabel: {
    fontSize: FONT_SIZES.xs,
    marginBottom: SPACING.xs,
  },
  notesText: {
    fontSize: FONT_SIZES.base,
    lineHeight: 22,
  },
  startButton: {
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    marginTop: SPACING.xl,
    ...SHADOWS.md,
  },
  startButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.white,
  },
});
