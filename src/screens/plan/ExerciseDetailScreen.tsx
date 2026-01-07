// /workspaces/claude-workspace/fitnessapp/src/screens/plan/ExerciseDetailScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useTheme } from '@/contexts';
import { RootStackParamList } from '@/types';
import { getExerciseById, ExerciseDetail } from '@/data';
import { Card } from '@/components/common';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'ExerciseDetail'>;

const DifficultyBadge: React.FC<{ difficulty: ExerciseDetail['difficulty'] }> = ({ difficulty }) => {
  const { t } = useTranslation();

  const getColor = () => {
    switch (difficulty) {
      case 'beginner':
        return COLORS.success;
      case 'intermediate':
        return COLORS.warning;
      case 'advanced':
        return COLORS.error;
      default:
        return COLORS.gray[500];
    }
  };

  return (
    <View style={[styles.difficultyBadge, { backgroundColor: getColor() }]}>
      <Text style={styles.difficultyText}>{t(`difficulty.${difficulty}`)}</Text>
    </View>
  );
};

const MuscleGroupBadge: React.FC<{ muscleGroup: string; isPrimary?: boolean }> = ({
  muscleGroup,
  isPrimary = false
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={[
      styles.muscleGroupBadge,
      {
        backgroundColor: isPrimary ? colors.primary : colors.border,
        opacity: isPrimary ? 1 : 0.8,
      }
    ]}>
      <Text style={[styles.muscleGroupText, { color: isPrimary ? COLORS.white : colors.text }]}>
        {t(`muscleGroups.${muscleGroup}`)}
      </Text>
    </View>
  );
};

export const ExerciseDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();

  const exerciseId = route.params?.exerciseId;
  const exercise = exerciseId ? getExerciseById(exerciseId) : undefined;

  if (!exercise) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + SPACING.md, backgroundColor: colors.surface }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={[styles.backIcon, { color: colors.text }]}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('exerciseDetail.notFound')}</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            {t('exerciseDetail.exerciseNotFound')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.backIcon, { color: colors.text }]}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {exercise.name}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Card style={styles.heroCard}>
          <View style={styles.heroImagePlaceholder}>
            <Text style={styles.heroEmoji}>
              {exercise.muscleGroup === 'chest' && '💪'}
              {exercise.muscleGroup === 'back' && '🔙'}
              {exercise.muscleGroup === 'shoulders' && '🏋️'}
              {exercise.muscleGroup === 'legs' && '🦵'}
              {exercise.muscleGroup === 'glutes' && '🍑'}
              {exercise.muscleGroup === 'biceps' && '💪'}
              {exercise.muscleGroup === 'triceps' && '💪'}
              {exercise.muscleGroup === 'core' && '🧘'}
            </Text>
          </View>
          <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
          <Text style={[styles.exerciseNameEn, { color: colors.textSecondary }]}>{exercise.nameEn}</Text>

          <View style={styles.badgeRow}>
            <DifficultyBadge difficulty={exercise.difficulty} />
            <View style={[styles.categoryBadge, { backgroundColor: colors.border }]}>
              <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
                {t(`exerciseCategories.${exercise.category}`)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Muscle Groups */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('exerciseDetail.muscles')}</Text>
          <View style={styles.muscleGroupRow}>
            <View style={styles.muscleColumn}>
              <Text style={[styles.muscleLabel, { color: colors.textSecondary }]}>
                {t('exerciseDetail.primaryMuscle')}
              </Text>
              <MuscleGroupBadge muscleGroup={exercise.muscleGroup} isPrimary />
            </View>
            {exercise.secondaryMuscles.length > 0 && (
              <View style={styles.muscleColumn}>
                <Text style={[styles.muscleLabel, { color: colors.textSecondary }]}>
                  {t('exerciseDetail.secondaryMuscles')}
                </Text>
                <View style={styles.secondaryMuscles}>
                  {exercise.secondaryMuscles.map((muscle) => (
                    <MuscleGroupBadge key={muscle} muscleGroup={muscle} />
                  ))}
                </View>
              </View>
            )}
          </View>
        </Card>

        {/* Equipment */}
        {exercise.equipment.length > 0 && (
          <Card style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('exerciseDetail.equipment')}</Text>
            <View style={styles.equipmentRow}>
              {exercise.equipment.map((item) => (
                <View key={item} style={[styles.equipmentBadge, { backgroundColor: colors.border }]}>
                  <Text style={[styles.equipmentText, { color: colors.text }]}>
                    {t(`equipment.${item}`)}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Instructions */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('exerciseDetail.instructions')}</Text>
          {exercise.instructions.map((instruction) => (
            <View key={instruction.step} style={styles.instructionRow}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepNumberText}>{instruction.step}</Text>
              </View>
              <Text style={[styles.instructionText, { color: colors.text }]}>{instruction.text}</Text>
            </View>
          ))}
        </Card>

        {/* Breathing */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.breathingIcon}>🌬️</Text>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('exerciseDetail.breathing')}</Text>
          </View>
          <Text style={[styles.breathingText, { color: colors.text }]}>{exercise.breathingPattern}</Text>
        </Card>

        {/* Tips */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('exerciseDetail.tips')}</Text>
          </View>
          {exercise.tips.map((tip, index) => (
            <View key={index} style={styles.tipRow}>
              <Text style={[styles.bulletPoint, { color: colors.success }]}>✓</Text>
              <Text style={[styles.tipText, { color: colors.text }]}>{tip}</Text>
            </View>
          ))}
        </Card>

        {/* Common Mistakes */}
        <Card style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('exerciseDetail.commonMistakes')}</Text>
          </View>
          {exercise.commonMistakes.map((mistake, index) => (
            <View key={index} style={styles.mistakeRow}>
              <Text style={[styles.bulletPoint, { color: colors.error }]}>✗</Text>
              <Text style={[styles.mistakeText, { color: colors.text }]}>{mistake}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
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
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FONT_SIZES.base,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.md,
  },
  heroImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  heroEmoji: {
    fontSize: 48,
  },
  exerciseName: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    textAlign: 'center',
  },
  exerciseNameEn: {
    fontSize: FONT_SIZES.base,
    marginTop: 4,
    marginBottom: SPACING.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  difficultyText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
    textTransform: 'capitalize',
  },
  categoryBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  categoryText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: SPACING.md,
  },
  lastSection: {
    marginBottom: SPACING['4xl'],
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  breathingIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  warningIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  muscleGroupRow: {
    flexDirection: 'row',
    gap: SPACING.xl,
  },
  muscleColumn: {
    flex: 1,
  },
  muscleLabel: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
  },
  muscleGroupBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xs,
  },
  muscleGroupText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  secondaryMuscles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  equipmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  equipmentBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  equipmentText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  stepNumberText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.white,
  },
  instructionText: {
    fontSize: FONT_SIZES.base,
    flex: 1,
    lineHeight: 24,
  },
  breathingText: {
    fontSize: FONT_SIZES.base,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  bulletPoint: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    marginRight: SPACING.sm,
    width: 20,
  },
  tipText: {
    fontSize: FONT_SIZES.base,
    flex: 1,
    lineHeight: 22,
  },
  mistakeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  mistakeText: {
    fontSize: FONT_SIZES.base,
    flex: 1,
    lineHeight: 22,
  },
});
