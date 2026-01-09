// /workspaces/claude-workspace/fitnessapp/src/screens/plan/ExercisePickerScreen.tsx

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useTheme } from '@/contexts';
import {
  RootStackParamList,
  TMuscleGroup,
  IExerciseTemplate,
} from '@/types';
import { useTrainingPlanStore, GYM_EXERCISES } from '@/stores';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'ExercisePicker'>;

// Item types for FlashList
type ListItemType = 'header' | 'exercise';
interface HeaderItem {
  type: 'header';
  muscleGroup: string;
  count: number;
  color: string;
}
interface ExerciseItem {
  type: 'exercise';
  exercise: IExerciseTemplate;
}
type ListItem = HeaderItem | ExerciseItem;

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
  const { colors } = useTheme();
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

  // Flatten data for FlashList with section headers
  const listData = useMemo((): ListItem[] => {
    if (selectedMuscleGroup !== 'all') {
      // No headers needed when filtering by muscle group
      return filteredExercises.map((exercise) => ({
        type: 'exercise' as const,
        exercise,
      }));
    }

    // Group exercises by muscle group and create flattened list with headers
    const grouped: Record<string, IExerciseTemplate[]> = {};
    filteredExercises.forEach((exercise) => {
      const group = exercise.muscleGroup;
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(exercise);
    });

    const items: ListItem[] = [];
    Object.entries(grouped).forEach(([muscleGroup, exercises]) => {
      const groupInfo = MUSCLE_GROUPS.find((g) => g.value === muscleGroup);
      items.push({
        type: 'header',
        muscleGroup,
        count: exercises.length,
        color: groupInfo?.color || COLORS.gray[500],
      });
      exercises.forEach((exercise) => {
        items.push({ type: 'exercise', exercise });
      });
    });

    return items;
  }, [filteredExercises, selectedMuscleGroup]);

  const handleSelectExercise = useCallback((exercise: IExerciseTemplate) => {
    addExerciseToWorkout(planId, day, {
      exerciseId: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      targetSets: 3,
      targetReps: '8-12',
      restTime: 90,
    });
    navigation.goBack();
  }, [addExerciseToWorkout, planId, day, navigation]);

  const handleShowDetails = useCallback((exerciseId: string) => {
    navigation.navigate('ExerciseDetail', { exerciseId });
  }, [navigation]);

  const renderItem: ListRenderItem<ListItem> = useCallback(({ item }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIndicator, { backgroundColor: item.color }]} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t(`muscleGroups.${item.muscleGroup}`)}
          </Text>
          <Text style={[styles.sectionCount, { color: colors.textTertiary }]}>{item.count}</Text>
        </View>
      );
    }

    const { exercise } = item;
    return (
      <View style={[styles.exerciseItem, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={styles.exerciseInfo}
          onPress={() => handleShowDetails(exercise.id)}
        >
          <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
          {exercise.category && (
            <Text style={[styles.exerciseCategory, { color: colors.textSecondary }]}>
              {t(`exerciseCategories.${exercise.category}`)}
            </Text>
          )}
        </TouchableOpacity>
        <View style={styles.exerciseActions}>
          <TouchableOpacity
            style={[styles.infoIcon, { backgroundColor: colors.border }]}
            onPress={() => handleShowDetails(exercise.id)}
          >
            <Text style={[styles.infoIconText, { color: colors.textSecondary }]}>?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addIcon}
            onPress={() => handleSelectExercise(exercise)}
          >
            <Text style={styles.addIconText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [colors, t, handleShowDetails, handleSelectExercise]);

  const getItemType = useCallback((item: ListItem) => item.type, []);

  const keyExtractor = useCallback((item: ListItem, index: number) => {
    if (item.type === 'header') {
      return `header-${item.muscleGroup}`;
    }
    return item.exercise.id;
  }, []);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {t('exercisePicker.noResults')}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.backIcon, { color: colors.text }]}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('exercisePicker.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.background, color: colors.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('exercisePicker.searchPlaceholder')}
          placeholderTextColor={colors.textTertiary}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filterContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
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

      {listData.length === 0 ? (
        renderEmptyState()
      ) : (
        <View style={styles.flashListContainer}>
          <FlashList
            data={listData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemType={getItemType}
          />
        </View>
      )}
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
  flashListContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
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
  exerciseActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIconText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
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
