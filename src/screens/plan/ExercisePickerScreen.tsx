import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import {
  RootStackParamList,
  TMuscleGroup,
  IExerciseTemplate,
} from '@/types';
import { useTrainingPlanStore, GYM_EXERCISES } from '@/stores';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'ExercisePicker'>;

const MUSCLE_GROUPS: { value: TMuscleGroup | 'all'; labelKey: string; color: string }[] = [
  { value: 'all', labelKey: 'muscleGroups.all', color: COLORS.gray[700] },
  { value: 'chest', labelKey: 'muscleGroups.chest', color: COLORS.accent },
  { value: 'back', labelKey: 'muscleGroups.back', color: COLORS.primary },
  { value: 'shoulders', labelKey: 'muscleGroups.shoulders', color: COLORS.warning },
  { value: 'legs', labelKey: 'muscleGroups.legs', color: COLORS.success },
  { value: 'glutes', labelKey: 'muscleGroups.glutes', color: '#E91E63' },
  { value: 'biceps', labelKey: 'muscleGroups.biceps', color: COLORS.purple },
  { value: 'triceps', labelKey: 'muscleGroups.triceps', color: '#9C27B0' },
  { value: 'core', labelKey: 'muscleGroups.core', color: '#00BCD4' },
];

export const ExercisePickerScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const { planId, day } = route.params;

  const addExerciseToWorkout = useTrainingPlanStore((state) => state.addExerciseToWorkout);
  const customExercises = useTrainingPlanStore((state) => state.customExercises);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<TMuscleGroup | 'all'>('all');

  const allExercises = useMemo(() => {
    return [...GYM_EXERCISES, ...customExercises];
  }, [customExercises]);

  const filteredExercises = useMemo(() => {
    return allExercises.filter((exercise) => {
      const matchesSearch = exercise.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesMuscleGroup =
        selectedMuscleGroup === 'all' || exercise.muscleGroup === selectedMuscleGroup;
      return matchesSearch && matchesMuscleGroup;
    });
  }, [allExercises, searchQuery, selectedMuscleGroup]);

  const groupedExercises = useMemo(() => {
    const grouped: Record<string, IExerciseTemplate[]> = {};
    filteredExercises.forEach((exercise) => {
      const group = exercise.muscleGroup;
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(exercise);
    });
    return grouped;
  }, [filteredExercises]);

  const handleSelectExercise = (exercise: IExerciseTemplate) => {
    addExerciseToWorkout(planId, day, {
      exerciseId: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      targetSets: 3,
      targetReps: '8-12',
      restTime: 90,
    });
    navigation.goBack();
  };

  const getMuscleGroupColor = (muscleGroup: string): string => {
    const group = MUSCLE_GROUPS.find((g) => g.value === muscleGroup);
    return group?.color || COLORS.gray[500];
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
        <Text style={styles.headerTitle}>{t('exercisePicker.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('exercisePicker.searchPlaceholder')}
          placeholderTextColor={COLORS.gray[400]}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {MUSCLE_GROUPS.map((group) => (
          <TouchableOpacity
            key={group.value}
            style={[
              styles.filterButton,
              selectedMuscleGroup === group.value && {
                backgroundColor: group.color,
                borderColor: group.color,
              },
            ]}
            onPress={() => setSelectedMuscleGroup(group.value)}
          >
            <Text
              style={[
                styles.filterText,
                selectedMuscleGroup === group.value && styles.filterTextActive,
              ]}
            >
              {t(group.labelKey)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filteredExercises.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>{t('exercisePicker.noResults')}</Text>
          </View>
        ) : selectedMuscleGroup === 'all' ? (
          Object.entries(groupedExercises).map(([muscleGroup, exercises]) => (
            <View key={muscleGroup} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View
                  style={[
                    styles.sectionIndicator,
                    { backgroundColor: getMuscleGroupColor(muscleGroup) },
                  ]}
                />
                <Text style={styles.sectionTitle}>
                  {t(`muscleGroups.${muscleGroup}`)}
                </Text>
                <Text style={styles.sectionCount}>{exercises.length}</Text>
              </View>
              {exercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={styles.exerciseItem}
                  onPress={() => handleSelectExercise(exercise)}
                >
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    {exercise.category && (
                      <Text style={styles.exerciseCategory}>
                        {t(`exerciseCategories.${exercise.category}`)}
                      </Text>
                    )}
                  </View>
                  <View style={styles.addIcon}>
                    <Text style={styles.addIconText}>+</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.section}>
            {filteredExercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseItem}
                onPress={() => handleSelectExercise(exercise)}
              >
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  {exercise.category && (
                    <Text style={styles.exerciseCategory}>
                      {t(`exerciseCategories.${exercise.category}`)}
                    </Text>
                  )}
                </View>
                <View style={styles.addIcon}>
                  <Text style={styles.addIconText}>+</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[900],
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    maxHeight: 60,
  },
  filterContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  filterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    backgroundColor: COLORS.white,
    marginRight: SPACING.sm,
  },
  filterText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[700],
    fontWeight: '500',
  },
  filterTextActive: {
    color: COLORS.white,
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
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[500],
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
    flex: 1,
  },
  sectionCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.gray[900],
  },
  exerciseCategory: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  addIcon: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIconText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
    fontWeight: '600',
  },
});
