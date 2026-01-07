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
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { ActivityRings, MetricCard, SectionHeader } from '@/components/progress';
import type { RingData } from '@/components/progress/ActivityRings';
import { RootStackParamList } from '@/types';
import { useStatsStore, useUserGoalsStore, useUserStore } from '@/stores';
import { useHealthStore } from '@/stores/healthStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Angenehmere, moderne Farbpalette
const RING_PRESETS = {
  steps: {
    color: '#6366F1', // Indigo
    gradientEnd: '#A5B4FC',
    icon: '👟',
  },
  calories: {
    color: '#F59E0B', // Amber
    gradientEnd: '#FCD34D',
    icon: '🔥',
  },
  activeMinutes: {
    color: '#10B981', // Emerald
    gradientEnd: '#6EE7B7',
    icon: '⏱️',
  },
  heartRate: {
    color: '#EC4899', // Pink
    gradientEnd: '#F9A8D4',
    icon: '❤️',
  },
  distance: {
    color: '#06B6D4', // Cyan
    gradientEnd: '#67E8F9',
    icon: '📍',
  },
  water: {
    color: '#3B82F6', // Blue
    gradientEnd: '#93C5FD',
    icon: '💧',
  },
};

type RingType = keyof typeof RING_PRESETS;

interface RingConfig {
  id: RingType;
  enabled: boolean;
  goal: number;
  manualValue?: number;
}

const DEFAULT_RING_CONFIGS: RingConfig[] = [
  { id: 'steps', enabled: true, goal: 10000 },
  { id: 'calories', enabled: true, goal: 500 },
  { id: 'activeMinutes', enabled: true, goal: 30 },
];

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
    getTodayCalories,
    getCalorieBalance,
    addGoal,
    updateTodayCalories,
    getLatestHealthEntry,
  } = useUserGoalsStore();

  const todayCalories = getTodayCalories();
  const calorieBalance = getCalorieBalance();
  const latestHealth = getLatestHealthEntry();

  // Ring configuration state
  const [ringConfigs, setRingConfigs] = useState<RingConfig[]>(DEFAULT_RING_CONFIGS);
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
            value = config.manualValue ?? todaySummary?.restingHeartRate ?? 0;
            unit = 'bpm';
            break;
          case 'distance':
            value = config.manualValue ?? (todaySummary?.distance ?? 0) / 1000;
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

    setRingConfigs((prev) =>
      prev.map((config) => {
        if (config.id === editingRing.id) {
          return {
            ...config,
            manualValue: editValue ? parseFloat(editValue) : undefined,
            goal: editGoal ? parseFloat(editGoal) : config.goal,
          };
        }
        return config;
      })
    );
    setEditingRing(null);
  };

  const handleToggleRing = (ringId: RingType, enabled: boolean) => {
    setRingConfigs((prev) =>
      prev.map((config) => (config.id === ringId ? { ...config, enabled } : config))
    );
  };

  const handleAddRing = (ringId: RingType) => {
    if (!ringConfigs.find((c) => c.id === ringId)) {
      const defaultGoals: Record<RingType, number> = {
        steps: 10000,
        calories: 500,
        activeMinutes: 30,
        heartRate: 70,
        distance: 5,
        water: 2,
      };
      setRingConfigs((prev) => [...prev, { id: ringId, enabled: true, goal: defaultGoals[ringId] }]);
    }
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

  const availableRings = Object.keys(RING_PRESETS).filter(
    (key) => !ringConfigs.find((c) => c.id === key)
  ) as RingType[];

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
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.avatarContainer}
            >
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || '👤'}
              </Text>
            </LinearGradient>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greeting}>{t('home.greeting')}</Text>
              <Text style={styles.userName}>{user?.name || t('you.guest')}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('HealthSettings')}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Activity Rings Card */}
        <View style={styles.ringsSection}>
          <LinearGradient
            colors={['#1E1E2E', '#2D2D44']}
            style={styles.ringsCard}
          >
            <View style={styles.ringsHeader}>
              <Text style={styles.ringsTitle}>{t('you.todayActivity')}</Text>
              <TouchableOpacity
                style={styles.editRingsButton}
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
              darkMode={true}
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
        <SectionHeader title={t('you.healthStats')} />
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
            iconColor="#F59E0B"
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
        <LinearGradient
          colors={['#1E1E2E', '#2D2D44']}
          style={styles.calorieCard}
        >
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
        </LinearGradient>

        {/* Goals Section */}
        <SectionHeader
          title={t('you.myGoal')}
          action={{
            label: t('you.addGoal'),
            onPress: () => setShowGoalInput(true),
          }}
        />
        {activeGoal ? (
          <LinearGradient colors={['#1E1E2E', '#2D2D44']} style={styles.goalCard}>
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
          </LinearGradient>
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

      {/* Ring Editor Modal */}
      <Modal
        visible={showRingEditor}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRingEditor(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.ringEditorContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('you.editRings')}</Text>
              <TouchableOpacity onPress={() => setShowRingEditor(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.ringEditorSubtitle}>{t('you.activeRings')}</Text>
            {ringConfigs.map((config) => {
              const preset = RING_PRESETS[config.id];
              return (
                <View key={config.id} style={styles.ringToggleRow}>
                  <View style={[styles.ringToggleDot, { backgroundColor: preset.color }]} />
                  <Text style={styles.ringToggleIcon}>{preset.icon}</Text>
                  <Text style={styles.ringToggleLabel}>{t(`you.ring.${config.id}`)}</Text>
                  <Switch
                    value={config.enabled}
                    onValueChange={(v) => handleToggleRing(config.id, v)}
                    trackColor={{ false: COLORS.gray[600], true: preset.color }}
                    thumbColor={COLORS.white}
                  />
                </View>
              );
            })}

            {availableRings.length > 0 && (
              <>
                <Text style={[styles.ringEditorSubtitle, { marginTop: SPACING.lg }]}>
                  {t('you.addRing')}
                </Text>
                {availableRings.map((ringId) => {
                  const preset = RING_PRESETS[ringId];
                  return (
                    <TouchableOpacity
                      key={ringId}
                      style={styles.addRingRow}
                      onPress={() => handleAddRing(ringId)}
                    >
                      <View style={[styles.ringToggleDot, { backgroundColor: preset.color }]} />
                      <Text style={styles.ringToggleIcon}>{preset.icon}</Text>
                      <Text style={styles.ringToggleLabel}>{t(`you.ring.${ringId}`)}</Text>
                      <Text style={styles.addRingPlus}>+</Text>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Ring Edit Modal */}
      <Modal
        visible={!!editingRing}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingRing(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingRing?.icon} {editingRing?.label}
            </Text>

            <Text style={styles.inputLabel}>{t('you.currentValue')}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="0"
              placeholderTextColor={COLORS.gray[500]}
              keyboardType="decimal-pad"
              value={editValue}
              onChangeText={setEditValue}
            />

            <Text style={styles.inputLabel}>{t('you.goal')}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="0"
              placeholderTextColor={COLORS.gray[500]}
              keyboardType="decimal-pad"
              value={editGoal}
              onChangeText={setEditGoal}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setEditingRing(null)}
              >
                <Text style={styles.modalButtonCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleSaveRingEdit}>
                <Text style={styles.modalButtonConfirmText}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    backgroundColor: '#0F0F1A',
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
    color: COLORS.gray[400],
  },
  userName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
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
    color: COLORS.white,
  },
  editRingsButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
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
  calorieCard: {
    borderRadius: BORDER_RADIUS['2xl'],
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
    color: '#10B981',
    fontWeight: '500',
  },
  calorieTargetLabel: {
    fontSize: FONT_SIZES.sm,
    color: '#6366F1',
    fontWeight: '500',
  },
  calorieBalanceValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  caloriePositive: {
    color: '#10B981',
  },
  calorieNegative: {
    color: '#EF4444',
  },
  calorieDivider: {
    height: 1,
    backgroundColor: COLORS.gray[700],
    marginVertical: SPACING.sm,
  },
  goalCard: {
    borderRadius: BORDER_RADIUS['2xl'],
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCheckIcon: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: '700',
  },
  emptyGoalCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: BORDER_RADIUS['2xl'],
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
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E1E2E',
    borderTopLeftRadius: BORDER_RADIUS['2xl'],
    borderTopRightRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  modalClose: {
    fontSize: 24,
    color: COLORS.gray[400],
  },
  ringEditorContent: {
    backgroundColor: '#1E1E2E',
    borderTopLeftRadius: BORDER_RADIUS['2xl'],
    borderTopRightRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.xl,
    maxHeight: '80%',
  },
  ringEditorSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ringToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.gray[700],
  },
  ringToggleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  ringToggleIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  ringToggleLabel: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
  },
  addRingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.gray[700],
  },
  addRingPlus: {
    fontSize: 24,
    color: '#6366F1',
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  modalInput: {
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.lg,
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
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    color: COLORS.gray[300],
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
