// /workspaces/claude-workspace/fitnessapp/src/screens/running/RunningPlanDetailScreen.tsx

import React, { useState } from 'react';
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
import { RootStackParamList } from '@/types';
import {
  getRunningPlanById,
  RUNNING_GOAL_LABELS,
  RUNNING_LEVEL_LABELS,
  RUNNING_WORKOUT_TYPE_LABELS,
} from '@/data/runningLibrary';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'RunningPlanDetail'>;

const DAY_LABELS: Record<string, string> = {
  mon: 'Mo',
  tue: 'Di',
  wed: 'Mi',
  thu: 'Do',
  fri: 'Fr',
  sat: 'Sa',
  sun: 'So',
};

export const RunningPlanDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const [selectedWeek, setSelectedWeek] = useState(0);

  const plan = getRunningPlanById(route.params.planId);

  if (!plan) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>{t('running.planNotFound')}</Text>
      </SafeAreaView>
    );
  }

  const currentWeekSchedule = plan.weeklySchedule[selectedWeek];

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
          {plan.name}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Plan Info */}
        <View style={[styles.infoCard, { backgroundColor: COLORS.accent }]}>
          <View style={styles.infoBadges}>
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>{RUNNING_GOAL_LABELS[plan.goal].de}</Text>
            </View>
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>{RUNNING_LEVEL_LABELS[plan.level].de}</Text>
            </View>
          </View>
          <Text style={styles.infoDescription}>{plan.description}</Text>
          <View style={styles.infoStats}>
            <View style={styles.infoStat}>
              <Text style={styles.infoStatValue}>{plan.durationWeeks}</Text>
              <Text style={styles.infoStatLabel}>{t('running.weeks')}</Text>
            </View>
            <View style={styles.infoStat}>
              <Text style={styles.infoStatValue}>
                {currentWeekSchedule?.days.filter(d => d.workout).length || 0}
              </Text>
              <Text style={styles.infoStatLabel}>{t('running.runsPerWeek')}</Text>
            </View>
            <View style={styles.infoStat}>
              <Text style={styles.infoStatValue}>~{currentWeekSchedule?.totalDistance || 0}</Text>
              <Text style={styles.infoStatLabel}>km</Text>
            </View>
          </View>
        </View>

        {/* Week Selector */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('running.selectWeek')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekSelector}
        >
          {plan.weeklySchedule.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.weekPill,
                {
                  backgroundColor: selectedWeek === index ? COLORS.accent : colors.surface,
                  borderColor: selectedWeek === index ? COLORS.accent : colors.border,
                },
              ]}
              onPress={() => setSelectedWeek(index)}
            >
              <Text
                style={[
                  styles.weekPillText,
                  { color: selectedWeek === index ? COLORS.white : colors.text },
                ]}
              >
                {t('running.week')} {index + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Week Focus */}
        {currentWeekSchedule?.focusNote && (
          <View style={[styles.focusCard, { backgroundColor: colors.surface }]}>
            <Text style={styles.focusIcon}>{'🎯'}</Text>
            <View style={styles.focusContent}>
              <Text style={[styles.focusLabel, { color: colors.textSecondary }]}>{t('running.weekFocus')}</Text>
              <Text style={[styles.focusText, { color: colors.text }]}>{currentWeekSchedule.focusNote}</Text>
            </View>
          </View>
        )}

        {/* Week Schedule */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('running.weekSchedule')}</Text>
        {currentWeekSchedule?.days.map((day, index) => (
          <TouchableOpacity
            key={day.day}
            style={[styles.dayCard, { backgroundColor: colors.surface }]}
            disabled={!day.workout}
            onPress={() => day.workout && navigation.navigate('RunningWorkoutDetail', { workoutId: day.workout.id })}
          >
            <View style={[styles.dayBadge, { backgroundColor: day.workout ? COLORS.accent : colors.background }]}>
              <Text style={[styles.dayBadgeText, { color: day.workout ? COLORS.white : colors.textSecondary }]}>
                {DAY_LABELS[day.day]}
              </Text>
            </View>
            {day.workout ? (
              <View style={styles.dayContent}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayIcon}>
                    {RUNNING_WORKOUT_TYPE_LABELS[day.workout.type].icon}
                  </Text>
                  <Text style={[styles.dayName, { color: colors.text }]}>{day.workout.name}</Text>
                </View>
                <Text style={[styles.dayDescription, { color: colors.textSecondary }]} numberOfLines={1}>
                  {day.workout.description}
                </Text>
                <Text style={[styles.dayDuration, { color: COLORS.accent }]}>
                  {day.workout.targetDuration} {t('running.min')}
                </Text>
              </View>
            ) : (
              <View style={styles.dayContent}>
                <Text style={[styles.restDay, { color: colors.textSecondary }]}>
                  {'😴'} {t('running.restDay')}
                </Text>
              </View>
            )}
            {day.workout && (
              <Text style={[styles.dayArrow, { color: colors.textSecondary }]}>{'>'}</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Start Plan Button */}
        <TouchableOpacity style={[styles.startButton, { backgroundColor: COLORS.accent }]}>
          <Text style={styles.startButtonText}>{t('running.startPlan')}</Text>
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
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
  },
  infoBadges: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  infoBadge: {
    backgroundColor: COLORS.overlay.light,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  infoBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.white,
  },
  infoDescription: {
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  infoStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoStat: {
    alignItems: 'center',
  },
  infoStatValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
  infoStatLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  weekSelector: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  weekPill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    marginRight: SPACING.sm,
  },
  weekPillText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  focusCard: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  focusIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  focusContent: {
    flex: 1,
  },
  focusLabel: {
    fontSize: FONT_SIZES.xs,
    marginBottom: SPACING.xs,
  },
  focusText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
  },
  dayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  dayBadge: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  dayBadgeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  dayContent: {
    flex: 1,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  dayIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  dayName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  dayDescription: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
  },
  dayDuration: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  restDay: {
    fontSize: FONT_SIZES.base,
  },
  dayArrow: {
    fontSize: FONT_SIZES.lg,
    marginLeft: SPACING.sm,
  },
  startButton: {
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    marginTop: SPACING.lg,
    ...SHADOWS.md,
  },
  startButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.white,
  },
});
