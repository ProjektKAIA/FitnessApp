import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { RootStackParamList, ITrainingPlan, IPlannedWorkout, TTrainingDay, IWeeklySchedule } from '@/types';
import { useTrainingPlanStore } from '@/stores';
import { Card } from '@/components/common';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'TrainingPlanEditor'>;

const DAYS: TTrainingDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const generateId = () => Math.random().toString(36).substring(2, 15);

const createEmptySchedule = (): IWeeklySchedule => ({
  mon: null,
  tue: null,
  wed: null,
  thu: null,
  fri: null,
  sat: null,
  sun: null,
});

export const TrainingPlanEditorScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const { planId, sportType } = route.params;

  const getPlanById = useTrainingPlanStore((state) => state.getPlanById);
  const createPlan = useTrainingPlanStore((state) => state.createPlan);
  const updatePlan = useTrainingPlanStore((state) => state.updatePlan);
  const setWorkoutForDay = useTrainingPlanStore((state) => state.setWorkoutForDay);

  const existingPlan = planId ? getPlanById(planId) : undefined;
  const isEditing = !!existingPlan;

  const [planName, setPlanName] = useState(existingPlan?.name || '');
  const [description, setDescription] = useState(existingPlan?.description || '');
  const [schedule, setSchedule] = useState<IWeeklySchedule>(
    existingPlan?.weeklySchedule || createEmptySchedule()
  );
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(planId || null);

  useEffect(() => {
    if (!currentPlanId && planName.trim()) {
      const newId = createPlan(planName, sportType);
      setCurrentPlanId(newId);
    }
  }, []);

  const handleSave = () => {
    if (!planName.trim()) {
      Alert.alert(t('planEditor.error'), t('planEditor.nameRequired'));
      return;
    }

    if (currentPlanId) {
      updatePlan(currentPlanId, {
        name: planName,
        description: description || undefined,
        weeklySchedule: schedule,
      });
    } else {
      const newId = createPlan(planName, sportType);
      updatePlan(newId, {
        description: description || undefined,
        weeklySchedule: schedule,
      });
    }

    navigation.goBack();
  };

  const handleAddWorkout = (day: TTrainingDay) => {
    if (!currentPlanId) {
      if (!planName.trim()) {
        Alert.alert(t('planEditor.error'), t('planEditor.nameRequiredFirst'));
        return;
      }
      const newId = createPlan(planName, sportType);
      setCurrentPlanId(newId);
      navigation.navigate('WorkoutDayEditor', { planId: newId, day });
    } else {
      navigation.navigate('WorkoutDayEditor', { planId: currentPlanId, day });
    }
  };

  const handleEditWorkout = (day: TTrainingDay) => {
    if (currentPlanId) {
      navigation.navigate('WorkoutDayEditor', { planId: currentPlanId, day });
    }
  };

  const handleRemoveWorkout = (day: TTrainingDay) => {
    Alert.alert(
      t('planEditor.removeWorkoutTitle'),
      t('planEditor.removeWorkoutMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            if (currentPlanId) {
              setWorkoutForDay(currentPlanId, day, null);
              setSchedule((prev) => ({ ...prev, [day]: null }));
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (currentPlanId) {
      const plan = getPlanById(currentPlanId);
      if (plan) {
        setSchedule(plan.weeklySchedule);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlanId]);

  const getDirectionColor = (direction: string): string => {
    switch (direction) {
      case 'gym':
        return COLORS.primary;
      case 'cardio':
        return COLORS.accent;
      case 'yoga':
        return COLORS.purple;
      case 'calisthenics':
        return COLORS.success;
      default:
        return COLORS.gray[400];
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? t('planEditor.editTitle') : t('planEditor.createTitle')}
        </Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.infoCard}>
          <Text style={styles.label}>{t('planEditor.planName')}</Text>
          <TextInput
            style={styles.input}
            value={planName}
            onChangeText={setPlanName}
            placeholder={t('planEditor.planNamePlaceholder')}
            placeholderTextColor={COLORS.gray[400]}
          />

          <Text style={[styles.label, styles.labelSpacing]}>
            {t('planEditor.description')}
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder={t('planEditor.descriptionPlaceholder')}
            placeholderTextColor={COLORS.gray[400]}
            multiline
            numberOfLines={3}
          />
        </Card>

        <Text style={styles.sectionTitle}>{t('planEditor.weeklySchedule')}</Text>

        {DAYS.map((day) => {
          const workout = schedule[day];

          return (
            <Card key={day} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <View style={styles.dayInfo}>
                  <Text style={styles.dayName}>{t(`days.${day}`)}</Text>
                  {workout ? (
                    <View
                      style={[
                        styles.directionBadge,
                        { backgroundColor: getDirectionColor(workout.direction) },
                      ]}
                    >
                      <Text style={styles.directionText}>
                        {t(`directions.${workout.direction}`)}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.restDay}>{t('planEditor.restDay')}</Text>
                  )}
                </View>
              </View>

              {workout ? (
                <>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <Text style={styles.exerciseCount}>
                    {t('planEditor.exerciseCount', { count: workout.exercises.length })}
                  </Text>
                  <View style={styles.dayActions}>
                    <TouchableOpacity
                      style={styles.dayAction}
                      onPress={() => handleEditWorkout(day)}
                    >
                      <Text style={styles.dayActionText}>{t('common.edit')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dayAction}
                      onPress={() => handleRemoveWorkout(day)}
                    >
                      <Text style={[styles.dayActionText, styles.removeText]}>
                        {t('common.remove')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.addWorkoutButton}
                  onPress={() => handleAddWorkout(day)}
                >
                  <Text style={styles.addWorkoutIcon}>+</Text>
                  <Text style={styles.addWorkoutText}>
                    {t('planEditor.addWorkout')}
                  </Text>
                </TouchableOpacity>
              )}
            </Card>
          );
        })}
      </ScrollView>
    </View>
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
  saveButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  saveText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  infoCard: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: SPACING.xs,
  },
  labelSpacing: {
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[900],
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
  },
  dayCard: {
    marginBottom: SPACING.sm,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginRight: SPACING.sm,
  },
  directionBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  directionText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  restDay: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
    fontStyle: 'italic',
  },
  workoutName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.gray[800],
    marginBottom: 4,
  },
  exerciseCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginBottom: SPACING.sm,
  },
  dayActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  dayAction: {
    paddingVertical: SPACING.xs,
  },
  dayActionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  removeText: {
    color: COLORS.error,
  },
  addWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray[50],
  },
  addWorkoutIcon: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gray[400],
    marginRight: SPACING.xs,
  },
  addWorkoutText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    fontWeight: '500',
  },
});
