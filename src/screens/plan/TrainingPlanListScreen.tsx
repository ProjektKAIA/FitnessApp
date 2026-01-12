import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { useTheme } from '@/contexts';
import { RootStackParamList, ITrainingPlan, TTrainingDay } from '@/types';
import { useTrainingPlanStore } from '@/stores';
import { Card } from '@/components/common';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'TrainingPlanList'>;

const DAYS: TTrainingDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const TrainingPlanListScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const sportType = route.params?.sportType;

  const allPlans = useTrainingPlanStore((state) => state.plans);
  const activePlanId = useTrainingPlanStore((state) => state.activePlanId);
  const setActivePlan = useTrainingPlanStore((state) => state.setActivePlan);
  const deletePlan = useTrainingPlanStore((state) => state.deletePlan);
  const duplicatePlan = useTrainingPlanStore((state) => state.duplicatePlan);

  // Show all plans when no sportType filter, otherwise filter by sportType
  const plans = useMemo(
    () => (sportType ? allPlans.filter((p) => p.sportType === sportType) : allPlans),
    [allPlans, sportType]
  );

  const handleCreatePlan = () => {
    if (sportType) {
      navigation.navigate('TrainingPlanEditor', { sportType });
    } else {
      navigation.navigate('SportSelection');
    }
  };

  const handleViewPlan = (plan: ITrainingPlan) => {
    navigation.navigate('TrainingPlanDetail', { planId: plan.id });
  };

  const handleEditPlan = (plan: ITrainingPlan) => {
    navigation.navigate('TrainingPlanEditor', { planId: plan.id, sportType: plan.sportType });
  };

  const handleActivatePlan = (planId: string) => {
    setActivePlan(planId);
  };

  const handleDeletePlan = (plan: ITrainingPlan) => {
    Alert.alert(
      t('planList.deleteTitle'),
      t('planList.deleteMessage', { name: plan.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => deletePlan(plan.id),
        },
      ]
    );
  };

  const handleDuplicatePlan = (plan: ITrainingPlan) => {
    const newPlanId = duplicatePlan(plan.id);
    if (newPlanId) {
      navigation.navigate('TrainingPlanEditor', { planId: newPlanId, sportType: plan.sportType });
    }
  };

  const getWorkoutCount = (plan: ITrainingPlan): number => {
    return DAYS.filter((day) => plan.weeklySchedule[day] !== null).length;
  };

  const getSourceLabel = (source: string): string => {
    switch (source) {
      case 'ai_generated':
        return t('planList.sourceAI');
      case 'imported':
        return t('planList.sourceImported');
      case 'template':
        return t('planList.sourceTemplate');
      default:
        return t('planList.sourceManual');
    }
  };

  const getSourceColor = (source: string): string => {
    switch (source) {
      case 'ai_generated':
        return COLORS.purple;
      case 'imported':
        return COLORS.accent;
      case 'template':
        return COLORS.success;
      default:
        return COLORS.primary;
    }
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {sportType ? t(`sportTypes.${sportType}`) : t('planList.title')}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleCreatePlan}
        >
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {plans.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('planList.emptyTitle')}</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>{t('planList.emptySubtitle')}</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreatePlan}
            >
              <Text style={styles.createButtonText}>{t('planList.createFirst')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                activeOpacity={0.8}
                onPress={() => handleViewPlan(plan)}
              >
                <Card style={styles.planCard} elevated>
                  <View style={styles.planHeader}>
                    <View style={styles.planInfo}>
                      <View style={styles.planTitleRow}>
                        <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
                        {plan.id === activePlanId && (
                          <View style={styles.activeBadge}>
                            <Text style={styles.activeBadgeText}>
                              {t('planList.active')}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.planMeta}>
                        <View
                          style={[
                            styles.sourceBadge,
                            { backgroundColor: getSourceColor(plan.source) },
                          ]}
                        >
                          <Text style={styles.sourceBadgeText}>
                            {getSourceLabel(plan.source)}
                          </Text>
                        </View>
                        <Text style={[styles.workoutCount, { color: colors.textSecondary }]}>
                          {t('planList.workoutsPerWeek', { count: getWorkoutCount(plan) })}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.viewArrow, { color: colors.textTertiary }]}>›</Text>
                  </View>

                  <View style={[styles.weekPreview, { borderTopColor: colors.border }]}>
                    {DAYS.map((day) => {
                      const workout = plan.weeklySchedule[day];
                      return (
                        <View
                          key={day}
                          style={[
                            styles.dayDot,
                            { backgroundColor: colors.background },
                            workout && styles.dayDotActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.dayLabel,
                              { color: colors.textSecondary },
                              workout && styles.dayLabelActive,
                            ]}
                          >
                            {t(`days.short.${day}`)}
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  <View style={styles.planActions}>
                    {plan.id !== activePlanId && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.activateButton]}
                        onPress={(e) => { e.stopPropagation(); handleActivatePlan(plan.id); }}
                      >
                        <Text style={styles.activateButtonText}>
                          {t('planList.activate')}
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={(e) => { e.stopPropagation(); handleEditPlan(plan); }}
                    >
                      <Text style={styles.actionButtonText}>{t('planList.edit')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={(e) => { e.stopPropagation(); handleDuplicatePlan(plan); }}
                    >
                      <Text style={styles.actionButtonText}>{t('planList.duplicate')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={(e) => { e.stopPropagation(); handleDeletePlan(plan); }}
                    >
                      <Text style={[styles.actionButtonText, styles.deleteText]}>
                        {t('common.delete')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.addPlanButton, { borderColor: colors.border }]}
              onPress={handleCreatePlan}
            >
              <Text style={[styles.addPlanIcon, { color: colors.textTertiary }]}>+</Text>
              <Text style={[styles.addPlanText, { color: colors.textSecondary }]}>{t('planList.createNew')}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.gray[900],
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  addIcon: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.white,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
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
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  createButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
  planCard: {
    marginBottom: SPACING.md,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  planInfo: {
    flex: 1,
  },
  viewArrow: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '300',
    marginLeft: SPACING.sm,
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  planName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  activeBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  activeBadgeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: '600',
  },
  planMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
  },
  sourceBadgeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: '500',
  },
  workoutCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  weekPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  dayDot: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayDotActive: {
    backgroundColor: COLORS.primary,
  },
  dayLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    fontWeight: '500',
  },
  dayLabelActive: {
    color: COLORS.white,
  },
  planActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  actionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray[100],
  },
  activateButton: {
    backgroundColor: COLORS.primary,
  },
  activateButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.white,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray[700],
  },
  deleteText: {
    color: COLORS.error,
  },
  addPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.sm,
  },
  addPlanIcon: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.gray[400],
    marginRight: SPACING.sm,
  },
  addPlanText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[500],
    fontWeight: '500',
  },
});
