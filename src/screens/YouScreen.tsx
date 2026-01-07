// /workspaces/claude-workspace/fitnessapp/src/screens/YouScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import {
  ActivityRings,
  MetricCard,
  SectionHeader,
} from '@/components/progress';
import { RootStackParamList } from '@/types';
import { useStatsStore, useUserGoalsStore, useUserStore } from '@/stores';
import { useHealthStore } from '@/stores/healthStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RING_COLORS = {
  move: '#FF2D55',
  exercise: '#30D158',
  stand: '#007AFF',
};

export const YouScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  // Stores
  const stats = useStatsStore((state) => state.stats);
  const user = useUserStore((state) => state.user);
  const healthSettings = useHealthStore((state) => state.settings);
  const todaySummary = useHealthStore((state) => state.todaySummary);
  const isHealthEnabled = healthSettings.enabled && healthSettings.permissionsGranted;

  // User Goals Store
  const {
    dailyCalorieGoal,
    calorieTarget,
    targetAmount,
    goals,
    healthEntries,
    getTodayCalories,
    getCalorieBalance,
    addGoal,
    updateTodayCalories,
    getLatestHealthEntry,
  } = useUserGoalsStore();

  const todayCalories = getTodayCalories();
  const calorieBalance = getCalorieBalance();
  const latestHealth = getLatestHealthEntry();

  // Modal states
  const [showCalorieInput, setShowCalorieInput] = useState(false);
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [showHealthInput, setShowHealthInput] = useState(false);
  const [calorieInputValue, setCalorieInputValue] = useState('');
  const [goalInputValue, setGoalInputValue] = useState('');

  // Activity Rings Data
  const activityRings = useMemo(() => {
    const steps = todaySummary?.steps?.count ?? 0;
    const calories = todaySummary?.calories?.active ?? 0;
    const activeMinutes = todaySummary?.activeMinutes ?? 0;

    return [
      {
        value: steps,
        goal: healthSettings.stepsGoal,
        color: RING_COLORS.move,
        gradientEnd: '#FF6B8A',
        label: t('you.steps'),
        unit: t('health.summary.steps'),
      },
      {
        value: calories,
        goal: 500,
        color: RING_COLORS.exercise,
        gradientEnd: '#5AE17E',
        label: t('you.calories'),
        unit: 'kcal',
      },
      {
        value: activeMinutes,
        goal: 30,
        color: RING_COLORS.stand,
        gradientEnd: '#5AC8FA',
        label: t('you.activeMinutes'),
        unit: 'min',
      },
    ];
  }, [todaySummary, healthSettings.stepsGoal, t]);

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
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || '👤'}
              </Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>{t('you.title')}</Text>
              <Text style={styles.subtitle}>{user?.name || t('you.guest')}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('HealthSettings')}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Activity Rings */}
        <View style={styles.ringsSection}>
          <View style={styles.ringsCard}>
            <ActivityRings
              rings={activityRings}
              size={160}
              strokeWidth={14}
              showLabels={true}
            />
            {!isHealthEnabled && (
              <TouchableOpacity
                style={styles.connectHealthButton}
                onPress={() => navigation.navigate('HealthSettings')}
              >
                <Text style={styles.connectHealthText}>{t('you.connectHealth')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Health Stats Grid */}
        <SectionHeader title={t('you.healthStats')} />
        <View style={styles.statsGrid}>
          <MetricCard
            icon="👣"
            title={t('you.steps')}
            value={todaySummary?.steps?.count ?? 0}
            subtitle={`${t('you.goal')}: ${healthSettings.stepsGoal}`}
            compact
          />
          <MetricCard
            icon="❤️"
            title={t('you.heartRate')}
            value={todaySummary?.restingHeartRate ?? '--'}
            unit="bpm"
            compact
          />
        </View>
        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={styles.metricCardTouchable}
            onPress={() => setShowHealthInput(true)}
          >
            <MetricCard
              icon="⚖️"
              title={t('you.weight')}
              value={latestHealth?.weight ?? user?.weight ?? '--'}
              unit="kg"
              compact
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.metricCardTouchable}
            onPress={() => setShowHealthInput(true)}
          >
            <MetricCard
              icon="💓"
              title={t('you.bloodPressure')}
              value={
                latestHealth?.bloodPressureSystolic
                  ? `${latestHealth.bloodPressureSystolic}/${latestHealth.bloodPressureDiastolic}`
                  : '--'
              }
              compact
            />
          </TouchableOpacity>
        </View>

        {/* Streak & Workouts */}
        <SectionHeader title={t('you.activity')} />
        <View style={styles.statsGrid}>
          <MetricCard
            icon="🔥"
            iconColor={COLORS.accent}
            title={t('you.streak')}
            value={stats.currentStreak}
            unit={t('progress.days')}
            onPress={() => navigation.navigate('StreakDetail')}
          />
          <MetricCard
            icon="💪"
            title={t('you.workouts')}
            value={stats.totalWorkouts}
            subtitle={t('progress.allTime')}
            onPress={() => navigation.navigate('WorkoutHistory')}
          />
        </View>

        {/* Calories Section */}
        <SectionHeader
          title={t('you.caloriesSection')}
          action={{
            label: t('you.addCalories'),
            onPress: () => setShowCalorieInput(true),
          }}
        />
        <View style={styles.calorieCard}>
          <View style={styles.calorieRow}>
            <Text style={styles.calorieLabel}>{t('you.dailyNeed')}</Text>
            <Text style={styles.calorieValue}>{dailyCalorieGoal} kcal</Text>
          </View>
          <View style={styles.calorieRow}>
            <Text style={styles.calorieLabel}>{t('you.consumed')}</Text>
            <Text style={styles.calorieValue}>{todayCalories?.consumed ?? 0} kcal</Text>
          </View>
          <View style={styles.calorieRow}>
            <Text style={styles.calorieLabel}>{t('you.workoutBurned')}</Text>
            <Text style={styles.calorieValueGreen}>
              -{todayCalories?.workoutBurned ?? 0} kcal
            </Text>
          </View>
          <View style={styles.calorieDivider} />
          <View style={styles.calorieRow}>
            <Text style={styles.calorieLabel}>{t('you.target')}</Text>
            <Text style={styles.calorieTargetLabel}>{getCalorieTargetLabel()}</Text>
          </View>
          <View style={styles.calorieRow}>
            <Text style={styles.calorieLabelBold}>{t('you.balance')}</Text>
            <Text
              style={[
                styles.calorieBalanceValue,
                calorieBalance >= 0 ? styles.caloriePositive : styles.calorieNegative,
              ]}
            >
              {calorieBalance >= 0 ? '+' : ''}
              {calorieBalance} kcal
            </Text>
          </View>
          <TouchableOpacity
            style={styles.calculateButton}
            onPress={() => navigation.navigate('HealthSettings')}
          >
            <Text style={styles.calculateButtonText}>{t('you.calculateDailyNeed')}</Text>
          </TouchableOpacity>
        </View>

        {/* Goals Section */}
        <SectionHeader
          title={t('you.myGoal')}
          action={{
            label: t('you.addGoal'),
            onPress: () => setShowGoalInput(true),
          }}
        />
        {activeGoal ? (
          <View style={styles.goalCard}>
            <Text style={styles.goalIcon}>🎯</Text>
            <View style={styles.goalContent}>
              <Text style={styles.goalText}>{activeGoal.text}</Text>
              {activeGoal.deadline && (
                <Text style={styles.goalDeadline}>
                  {t('you.until')}: {new Date(activeGoal.deadline).toLocaleDateString()}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.goalCheckButton}
              onPress={() => useUserGoalsStore.getState().toggleGoalCompleted(activeGoal.id)}
            >
              <Text style={styles.goalCheckIcon}>✓</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.emptyGoalCard}
            onPress={() => setShowGoalInput(true)}
          >
            <Text style={styles.emptyGoalIcon}>🎯</Text>
            <Text style={styles.emptyGoalText}>{t('you.setGoal')}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Calorie Input Modal */}
      <Modal
        visible={showCalorieInput}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCalorieInput(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('you.addCalories')}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="kcal"
              placeholderTextColor={COLORS.gray[500]}
              keyboardType="numeric"
              value={calorieInputValue}
              onChangeText={setCalorieInputValue}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowCalorieInput(false)}
              >
                <Text style={styles.modalButtonCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleAddCalories}>
                <Text style={styles.modalButtonConfirmText}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Goal Input Modal */}
      <Modal
        visible={showGoalInput}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGoalInput(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('you.addGoal')}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={t('you.goalPlaceholder')}
              placeholderTextColor={COLORS.gray[500]}
              value={goalInputValue}
              onChangeText={setGoalInputValue}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowGoalInput(false)}
              >
                <Text style={styles.modalButtonCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleAddGoal}>
                <Text style={styles.modalButtonConfirmText}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Health Input Modal */}
      <HealthInputModal
        visible={showHealthInput}
        onClose={() => setShowHealthInput(false)}
      />
    </SafeAreaView>
  );
};

interface HealthInputModalProps {
  visible: boolean;
  onClose: () => void;
}

const HealthInputModal: React.FC<HealthInputModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { addHealthEntry } = useUserGoalsStore();
  const [weight, setWeight] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');

  const handleSave = () => {
    const entry: { weight?: number; bloodPressureSystolic?: number; bloodPressureDiastolic?: number } = {};

    if (weight) entry.weight = parseFloat(weight);
    if (systolic && diastolic) {
      entry.bloodPressureSystolic = parseInt(systolic, 10);
      entry.bloodPressureDiastolic = parseInt(diastolic, 10);
    }

    if (Object.keys(entry).length > 0) {
      addHealthEntry(entry);
    }

    setWeight('');
    setSystolic('');
    setDiastolic('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('you.addHealthData')}</Text>

          <Text style={styles.inputLabel}>{t('you.weight')} (kg)</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="75"
            placeholderTextColor={COLORS.gray[500]}
            keyboardType="decimal-pad"
            value={weight}
            onChangeText={setWeight}
          />

          <Text style={styles.inputLabel}>{t('you.bloodPressure')}</Text>
          <View style={styles.bloodPressureInputs}>
            <TextInput
              style={[styles.modalInput, styles.bpInput]}
              placeholder="120"
              placeholderTextColor={COLORS.gray[500]}
              keyboardType="numeric"
              value={systolic}
              onChangeText={setSystolic}
            />
            <Text style={styles.bpSeparator}>/</Text>
            <TextInput
              style={[styles.modalInput, styles.bpInput]}
              placeholder="80"
              placeholderTextColor={COLORS.gray[500]}
              keyboardType="numeric"
              value={diastolic}
              onChangeText={setDiastolic}
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButtonCancel} onPress={onClose}>
              <Text style={styles.modalButtonCancelText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleSave}>
              <Text style={styles.modalButtonConfirmText}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[900],
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING['3xl'],
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.white,
    fontWeight: '600',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
    marginTop: 2,
  },
  settingsButton: {
    padding: SPACING.sm,
  },
  settingsIcon: {
    fontSize: 24,
  },
  ringsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  ringsCard: {
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  connectHealthButton: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
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
  calorieCard: {
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  calorieLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
  },
  calorieLabelBold: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    fontWeight: '600',
  },
  calorieValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    fontWeight: '500',
  },
  calorieValueGreen: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
    fontWeight: '500',
  },
  calorieTargetLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  calorieBalanceValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  caloriePositive: {
    color: COLORS.success,
  },
  calorieNegative: {
    color: COLORS.error,
  },
  calorieDivider: {
    height: 1,
    backgroundColor: COLORS.gray[700],
    marginVertical: SPACING.sm,
  },
  calculateButton: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.gray[700],
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  },
  goalCard: {
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  goalContent: {
    flex: 1,
  },
  goalText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    fontWeight: '600',
  },
  goalDeadline: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
    marginTop: 4,
  },
  goalCheckButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCheckIcon: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: '700',
  },
  emptyGoalCard: {
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginHorizontal: SPACING.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gray[700],
    borderStyle: 'dashed',
  },
  emptyGoalIcon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
    opacity: 0.5,
  },
  emptyGoalText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  bottomSpacing: {
    height: SPACING['3xl'],
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  modalInput: {
    backgroundColor: COLORS.gray[700],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
  },
  bloodPressureInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bpInput: {
    flex: 1,
  },
  bpSeparator: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.gray[400],
    marginHorizontal: SPACING.sm,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: COLORS.gray[700],
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    color: COLORS.gray[300],
    fontWeight: '600',
  },
  modalButtonConfirm: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  modalButtonConfirmText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});
