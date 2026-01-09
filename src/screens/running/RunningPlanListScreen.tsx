// /workspaces/claude-workspace/fitnessapp/src/screens/running/RunningPlanListScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { useTheme } from '@/contexts';
import { RootStackParamList, TRunningGoal, TRunningLevel } from '@/types';
import {
  RUNNING_PLANS,
  RUNNING_GOAL_LABELS,
  RUNNING_LEVEL_LABELS,
} from '@/data/runningLibrary';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GOAL_FILTERS: Array<{ key: TRunningGoal | 'all'; label: string }> = [
  { key: 'all', label: 'Alle' },
  { key: '5k', label: '5K' },
  { key: '10k', label: '10K' },
  { key: 'half_marathon', label: 'Halbmarathon' },
  { key: 'general_fitness', label: 'Fitness' },
];

export const RunningPlanListScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [selectedGoal, setSelectedGoal] = useState<TRunningGoal | 'all'>('all');

  const filteredPlans = selectedGoal === 'all'
    ? RUNNING_PLANS
    : RUNNING_PLANS.filter(p => p.goal === selectedGoal);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backIcon, { color: colors.text }]}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('running.planList')}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filter Pills */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {GOAL_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterPill,
                {
                  backgroundColor: selectedGoal === filter.key ? COLORS.accent : colors.surface,
                  borderColor: selectedGoal === filter.key ? COLORS.accent : colors.border,
                },
              ]}
              onPress={() => setSelectedGoal(filter.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: selectedGoal === filter.key ? COLORS.white : colors.text },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filteredPlans.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>{'🏃'}</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {t('running.noPlansFound')}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {t('running.noPlansFoundDesc')}
            </Text>
          </View>
        ) : (
          filteredPlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('RunningPlanDetail', { planId: plan.id })}
            >
              <View style={styles.planHeader}>
                <View style={[styles.goalBadge, { backgroundColor: COLORS.accent + '20' }]}>
                  <Text style={[styles.goalBadgeText, { color: COLORS.accent }]}>
                    {RUNNING_GOAL_LABELS[plan.goal].de}
                  </Text>
                </View>
                <View style={[styles.levelBadge, { backgroundColor: colors.background }]}>
                  <Text style={[styles.levelBadgeText, { color: colors.textSecondary }]}>
                    {RUNNING_LEVEL_LABELS[plan.level].de}
                  </Text>
                </View>
              </View>

              <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
              <Text style={[styles.planDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                {plan.description}
              </Text>

              <View style={styles.planStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>{'📅'}</Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {plan.durationWeeks}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    {t('running.weeks')}
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>{'🏃'}</Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {plan.weeklySchedule[0]?.days.filter(d => d.workout).length || 0}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    {t('running.runsPerWeek')}
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>{'🛣️'}</Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    ~{plan.weeklySchedule[0]?.totalDistance || 0}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    km/{t('running.week')}
                  </Text>
                </View>
              </View>

              <View style={[styles.startButton, { backgroundColor: COLORS.accent }]}>
                <Text style={styles.startButtonText}>{t('running.viewPlan')}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
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
  },
  placeholder: {
    width: 40,
  },
  filterContainer: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  filterContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  filterPill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    marginRight: SPACING.sm,
  },
  filterText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING['4xl'],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING['4xl'],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.base,
    textAlign: 'center',
  },
  planCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  planHeader: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  goalBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  goalBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  levelBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  levelBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
  planName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  planDescription: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  planStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.gray[300],
  },
  startButton: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
});
