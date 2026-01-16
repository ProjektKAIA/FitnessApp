// /workspaces/claude-workspace/fitnessapp/src/screens/YouScreen.tsx

import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useTheme } from '@/contexts';
import { FLOATING_TAB_BAR_HEIGHT } from '@/components/navigation';
import { ActivityRings, MetricCard, SectionHeader } from '@/components/progress';
import type { RingData } from '@/components/progress/ActivityRings';
import {
  HealthInputModal,
  CalorieCard,
  GoalCard,
  RingEditorModal,
  RING_PRESETS,
} from '@/components/you';
import type { RingType, RingConfig } from '@/stores/userGoalsStore';
import { RootStackParamList } from '@/types';
import { useStatsStore, useUserGoalsStore, useUserStore } from '@/stores';
import { useHealthStore } from '@/stores/healthStore';
import { getHealthService } from '@/services/health';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const YouScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  // Stores
  const stats = useStatsStore((state) => state.stats);
  const user = useUserStore((state) => state.user);
  const healthSettings = useHealthStore((state) => state.settings);
  const todaySummary = useHealthStore((state) => state.todaySummary);
  const setTodaySummary = useHealthStore((state) => state.setTodaySummary);
  const isHealthEnabled = healthSettings.enabled && healthSettings.permissionsGranted;

  // Pull to refresh state
  const [refreshing, setRefreshing] = useState(false);

  // User Goals Store
  const {
    dailyCalorieGoal,
    calorieTarget,
    targetAmount,
    goals,
    getTodayCalories,
    getCalorieBalance,
    addGoal,
    updateTodayCalories,
    getLatestHealthEntry,
    ringConfigs,
    updateRingConfig,
    toggleRing,
    addRing,
  } = useUserGoalsStore();

  const todayCalories = getTodayCalories();
  const calorieBalance = getCalorieBalance();
  const latestHealth = getLatestHealthEntry();

  // Ring editor state
  const [showRingEditor, setShowRingEditor] = useState(false);
  const [editingRing, setEditingRing] = useState<RingData | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editGoal, setEditGoal] = useState('');

  // Modal states
  const [showCalorieInput, setShowCalorieInput] = useState(false);
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [showHealthInput, setShowHealthInput] = useState(false);
  const [calorieInputValue, setCalorieInputValue] = useState('');
  const [goalInputValue, setGoalInputValue] = useState('');

  // Pull to refresh handler
  const handleRefresh = useCallback(async () => {
    if (!isHealthEnabled) return;

    setRefreshing(true);
    try {
      const healthService = getHealthService();
      if (healthService) {
        const today = new Date();
        const summary = await healthService.getDailySummary(today);
        setTodaySummary(summary);
      }
    } catch (error) {
      console.error('[YouScreen] Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [isHealthEnabled, setTodaySummary]);

  // Dynamic gradient colors based on theme
  const cardGradient: [string, string] = isDark
    ? ['#1E1E2E', '#2D2D44']
    : [COLORS.gray[100], COLORS.gray[200]];

  const modalBgColor = isDark ? '#1E1E2E' : COLORS.white;
  const inputBgColor = isDark ? COLORS.gray[800] : COLORS.gray[100];

  // Build rings from config
  const activityRings = useMemo((): RingData[] => {
    return ringConfigs
      .filter((config) => config.enabled)
      .map((config) => {
        const preset = RING_PRESETS[config.id];
        let value = 0;
        let unit = '';

        switch (config.id) {
          case 'steps':
            value = config.manualValue ?? todaySummary?.steps?.count ?? 0;
            unit = t('you.stepsUnit');
            break;
          case 'calories':
            value = config.manualValue ?? todaySummary?.calories?.active ?? 0;
            unit = 'kcal';
            break;
          case 'activeMinutes':
            value = config.manualValue ?? todaySummary?.activeMinutes ?? 0;
            unit = 'min';
            break;
          case 'heartRate':
            value = config.manualValue ?? (todaySummary?.restingHeartRate?.bpm ?? 0);
            unit = 'bpm';
            break;
          case 'distance':
            value = config.manualValue ?? (todaySummary?.distance?.meters ?? 0) / 1000;
            unit = 'km';
            break;
          case 'water':
            value = config.manualValue ?? 0;
            unit = 'L';
            break;
        }

        return {
          id: config.id,
          value,
          goal: config.goal,
          color: preset.color,
          gradientEnd: preset.gradientEnd,
          label: t(`you.ring.${config.id}`),
          unit,
          icon: preset.icon,
        };
      });
  }, [ringConfigs, todaySummary, t]);

  const handleRingPress = useCallback((ring: RingData) => {
    setEditingRing(ring);
    setEditValue(ring.value.toString());
    const config = ringConfigs.find((c) => c.id === ring.id);
    setEditGoal(config?.goal.toString() || '');
  }, [ringConfigs]);

  const handleSaveRingEdit = () => {
    if (!editingRing) return;

    updateRingConfig(editingRing.id as RingType, {
      manualValue: editValue ? parseFloat(editValue) : undefined,
      goal: editGoal ? parseFloat(editGoal) : undefined,
    });
    setEditingRing(null);
  };

  const handleToggleRing = (ringId: RingType, enabled: boolean) => {
    toggleRing(ringId, enabled);
  };

  const handleAddRing = (ringId: RingType) => {
    addRing(ringId);
  };

  const handleAddCalories = () => {
    const value = parseInt(calorieInputValue, 10);
    if (!isNaN(value) && value > 0) {
      updateTodayCalories(value);
      setCalorieInputValue('');
      setShowCalorieInput(false);
    }
  };

  const handleAddGoal = () => {
    if (goalInputValue.trim()) {
      addGoal(goalInputValue.trim());
      setGoalInputValue('');
      setShowGoalInput(false);
    }
  };

  const getCalorieTargetLabel = () => {
    if (calorieTarget === 'deficit') return `${t('you.deficit')} ${Math.abs(targetAmount)} kcal`;
    if (calorieTarget === 'surplus') return `${t('you.surplus')} +${targetAmount} kcal`;
    return t('you.maintain');
  };

  const activeGoal = goals.find((g) => !g.completed);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.avatarContainer}
            >
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || '👤'}
              </Text>
            </LinearGradient>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>{t('home.greeting')}</Text>
              <Text style={[styles.userName, { color: colors.text }]}>{user?.name || t('you.guest')}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.settingsButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('HealthSettings')}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Activity Rings Card */}
        <View style={styles.ringsSection}>
          <LinearGradient colors={cardGradient} style={styles.ringsCard}>
            <View style={styles.ringsHeader}>
              <Text style={[styles.ringsTitle, { color: isDark ? COLORS.white : colors.text }]}>
                {t('you.todayActivity')}
              </Text>
              <TouchableOpacity
                style={[styles.editRingsButton, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)' }]}
                onPress={() => setShowRingEditor(true)}
              >
                <Text style={styles.editRingsText}>{t('common.edit')}</Text>
              </TouchableOpacity>
            </View>

            <ActivityRings
              rings={activityRings}
              size={180}
              strokeWidth={16}
              showLabels={true}
              onRingPress={handleRingPress}
              darkMode={isDark}
            />

            {!isHealthEnabled && (
              <TouchableOpacity
                style={styles.connectHealthButton}
                onPress={() => navigation.navigate('HealthSettings')}
              >
                <LinearGradient
                  colors={['#6366F1', '#8B5CF6']}
                  style={styles.connectHealthGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.connectHealthText}>{t('you.connectHealth')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </View>

        {/* Health Stats Grid */}
        <SectionHeader title={t('you.healthStats')} darkMode={isDark} />
        <View style={styles.statsGrid}>
          <TouchableOpacity style={styles.metricCardTouchable} onPress={() => setShowHealthInput(true)}>
            <MetricCard
              icon="⚖️"
              title={t('you.weight')}
              value={latestHealth?.weight ?? user?.weight ?? '--'}
              unit="kg"
              compact
              darkMode={isDark}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.metricCardTouchable} onPress={() => setShowHealthInput(true)}>
            <MetricCard
              icon="💓"
              title={t('you.bloodPressure')}
              value={
                latestHealth?.bloodPressureSystolic
                  ? `${latestHealth.bloodPressureSystolic}/${latestHealth.bloodPressureDiastolic}`
                  : '--'
              }
              compact
              darkMode={isDark}
            />
          </TouchableOpacity>
        </View>

        {/* Streak & Workouts */}
        <SectionHeader title={t('you.activity')} darkMode={isDark} />
        <View style={styles.statsGrid}>
          <MetricCard
            icon="🔥"
            iconColor="#F59E0B"
            title={t('you.streak')}
            value={stats.currentStreak}
            unit={t('progress.days')}
            onPress={() => navigation.navigate('StreakDetail')}
            darkMode={isDark}
          />
          <MetricCard
            icon="💪"
            title={t('you.workouts')}
            value={stats.totalWorkouts}
            subtitle={t('progress.allTime')}
            onPress={() => navigation.navigate('WorkoutHistory')}
            darkMode={isDark}
          />
        </View>

        {/* Calories Section */}
        <SectionHeader
          title={t('you.caloriesSection')}
          action={{ label: t('you.addCalories'), onPress: () => setShowCalorieInput(true) }}
          darkMode={isDark}
        />
        <CalorieCard
          dailyCalorieGoal={dailyCalorieGoal}
          consumed={todayCalories?.consumed ?? 0}
          workoutBurned={todayCalories?.workoutBurned ?? 0}
          balance={calorieBalance}
          targetLabel={getCalorieTargetLabel()}
        />

        {/* Goals Section */}
        <SectionHeader
          title={t('you.myGoal')}
          action={{ label: t('you.addGoal'), onPress: () => setShowGoalInput(true) }}
          darkMode={isDark}
        />
        <GoalCard goal={activeGoal} onAddGoal={() => setShowGoalInput(true)} />

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Ring Editor Modal */}
      <RingEditorModal
        visible={showRingEditor}
        onClose={() => setShowRingEditor(false)}
        ringConfigs={ringConfigs}
        onToggleRing={handleToggleRing}
        onAddRing={handleAddRing}
      />

      {/* Ring Edit Modal */}
      <Modal visible={!!editingRing} transparent animationType="fade" onRequestClose={() => setEditingRing(null)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: modalBgColor }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editingRing?.icon} {editingRing?.label}
            </Text>

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('you.currentValue')}</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: inputBgColor, color: colors.text }]}
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
              value={editValue}
              onChangeText={setEditValue}
            />

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('you.goal')}</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: inputBgColor, color: colors.text }]}
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
              value={editGoal}
              onChangeText={setEditGoal}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButtonCancel, { backgroundColor: isDark ? COLORS.gray[700] : COLORS.gray[200] }]}
                onPress={() => setEditingRing(null)}
              >
                <Text style={[styles.modalButtonCancelText, { color: colors.textSecondary }]}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleSaveRingEdit}>
                <Text style={styles.modalButtonConfirmText}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Calorie Input Modal */}
      <Modal visible={showCalorieInput} transparent animationType="fade" onRequestClose={() => setShowCalorieInput(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: modalBgColor }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('you.addCalories')}</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: inputBgColor, color: colors.text }]}
              placeholder="kcal"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              value={calorieInputValue}
              onChangeText={setCalorieInputValue}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButtonCancel, { backgroundColor: isDark ? COLORS.gray[700] : COLORS.gray[200] }]}
                onPress={() => setShowCalorieInput(false)}
              >
                <Text style={[styles.modalButtonCancelText, { color: colors.textSecondary }]}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleAddCalories}>
                <Text style={styles.modalButtonConfirmText}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Goal Input Modal */}
      <Modal visible={showGoalInput} transparent animationType="fade" onRequestClose={() => setShowGoalInput(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: modalBgColor }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('you.addGoal')}</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: inputBgColor, color: colors.text }]}
              placeholder={t('you.goalPlaceholder')}
              placeholderTextColor={colors.textTertiary}
              value={goalInputValue}
              onChangeText={setGoalInputValue}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButtonCancel, { backgroundColor: isDark ? COLORS.gray[700] : COLORS.gray[200] }]}
                onPress={() => setShowGoalInput(false)}
              >
                <Text style={[styles.modalButtonCancelText, { color: colors.textSecondary }]}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleAddGoal}>
                <Text style={styles.modalButtonConfirmText}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Health Input Modal */}
      <HealthInputModal visible={showHealthInput} onClose={() => setShowHealthInput(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: FLOATING_TAB_BAR_HEIGHT + SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.white,
    fontWeight: '700',
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: FONT_SIZES.sm,
  },
  userName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginTop: 2,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 22,
  },
  ringsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  ringsCard: {
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.xl,
  },
  ringsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  ringsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  editRingsButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  editRingsText: {
    fontSize: FONT_SIZES.sm,
    color: '#6366F1',
    fontWeight: '600',
  },
  connectHealthButton: {
    marginTop: SPACING.lg,
  },
  connectHealthGradient: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
  },
  connectHealthText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  metricCardTouchable: {
    flex: 1,
  },
  bottomSpacing: {
    height: SPACING['3xl'],
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BORDER_RADIUS['2xl'],
    borderTopRightRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.xl,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  modalInput: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    fontSize: FONT_SIZES.base,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontWeight: '600',
  },
  modalButtonConfirm: {
    flex: 1,
    backgroundColor: '#6366F1',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  modalButtonConfirmText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});
