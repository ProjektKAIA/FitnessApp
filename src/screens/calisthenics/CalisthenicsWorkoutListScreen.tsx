// /workspaces/claude-workspace/fitnessapp/src/screens/calisthenics/CalisthenicsWorkoutListScreen.tsx

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
import { RootStackParamList } from '@/types';
import {
  CALISTHENICS_WORKOUTS,
  CALISTHENICS_LEVEL_LABELS,
  getCalisthenicsExerciseById,
  TCalisthenicsLevel,
  ICalisthenicsWorkout,
} from '@/data/calisthenicsLibrary';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LEVELS: TCalisthenicsLevel[] = ['beginner', 'intermediate', 'advanced'];

export const CalisthenicsWorkoutListScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const lang = i18n.language as 'de' | 'en';

  const [selectedLevel, setSelectedLevel] = useState<TCalisthenicsLevel | 'all'>('all');

  const filteredWorkouts = selectedLevel === 'all'
    ? CALISTHENICS_WORKOUTS
    : CALISTHENICS_WORKOUTS.filter((w) => w.level === selectedLevel);

  const renderWorkoutCard = (workout: ICalisthenicsWorkout) => {
    const muscleText = workout.muscleGroups.slice(0, 3).join(', ');

    return (
      <TouchableOpacity
        key={workout.id}
        style={[styles.workoutCard, { backgroundColor: colors.surface }]}
        onPress={() => navigation.navigate('CalisthenicsWorkoutDetail', { workoutId: workout.id })}
      >
        <View style={styles.workoutHeader}>
          <View style={styles.workoutInfo}>
            <Text style={[styles.workoutName, { color: colors.text }]}>
              {lang === 'de' ? workout.name : workout.nameEn}
            </Text>
            <Text style={[styles.workoutMuscles, { color: colors.textSecondary }]}>
              {muscleText}
            </Text>
          </View>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(workout.level) + '20' }]}>
            <Text style={[styles.levelText, { color: getLevelColor(workout.level) }]}>
              {CALISTHENICS_LEVEL_LABELS[workout.level][lang]}
            </Text>
          </View>
        </View>

        <Text style={[styles.workoutDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {workout.description}
        </Text>

        <View style={styles.workoutStats}>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>{'⏱️'}</Text>
            <Text style={[styles.statText, { color: colors.text }]}>{workout.duration} min</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>{'💪'}</Text>
            <Text style={[styles.statText, { color: colors.text }]}>
              {workout.exercises.length} {lang === 'de' ? 'Übungen' : 'exercises'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.backIcon, { color: colors.text }]}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {lang === 'de' ? 'Workouts' : 'Workouts'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Level Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedLevel === 'all' && styles.filterChipActive,
              { backgroundColor: selectedLevel === 'all' ? COLORS.accent : colors.surface },
            ]}
            onPress={() => setSelectedLevel('all')}
          >
            <Text style={[
              styles.filterText,
              { color: selectedLevel === 'all' ? COLORS.white : colors.text },
            ]}>
              {lang === 'de' ? 'Alle' : 'All'}
            </Text>
          </TouchableOpacity>
          {LEVELS.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.filterChip,
                selectedLevel === level && styles.filterChipActive,
                { backgroundColor: selectedLevel === level ? getLevelColor(level) : colors.surface },
              ]}
              onPress={() => setSelectedLevel(level)}
            >
              <Text style={[
                styles.filterText,
                { color: selectedLevel === level ? COLORS.white : colors.text },
              ]}>
                {CALISTHENICS_LEVEL_LABELS[level][lang]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Workout List */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {filteredWorkouts.map(renderWorkoutCard)}
      </ScrollView>
    </SafeAreaView>
  );
};

const getLevelColor = (level: TCalisthenicsLevel): string => {
  switch (level) {
    case 'beginner':
      return COLORS.success;
    case 'intermediate':
      return COLORS.warning;
    case 'advanced':
      return COLORS.error;
    default:
      return COLORS.accent;
  }
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
  },
  filterScroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  filterChipActive: {},
  filterText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  workoutCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  workoutInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  workoutName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: 2,
  },
  workoutMuscles: {
    fontSize: FONT_SIZES.xs,
    textTransform: 'capitalize',
  },
  levelBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  levelText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  workoutDescription: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statIcon: {
    fontSize: 14,
  },
  statText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
});
