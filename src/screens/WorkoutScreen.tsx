// /workspaces/claude-workspace/fitnessapp/src/screens/WorkoutScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Button } from '@/components/common';
import { SectionHeader } from '@/components/progress';
import { useWorkoutStore, useTrainingPlanStore } from '@/stores';
import { RootStackParamList, TDirection, TProgramCategory } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ProgramItem {
  id: string;
  name: string;
  category: TProgramCategory;
  imageUrl: string;
  duration: string;
  sessionsCount: number;
  direction: TDirection;
}

const PROGRAMS: ProgramItem[] = [
  {
    id: '1',
    name: 'Yoga Time',
    category: 'yoga',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    duration: '60 hr',
    sessionsCount: 74,
    direction: 'yoga',
  },
  {
    id: '2',
    name: 'Meditation Time',
    category: 'meditation',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    duration: '22 hr',
    sessionsCount: 62,
    direction: 'yoga',
  },
  {
    id: '3',
    name: 'Bodybuilding',
    category: 'bodybuilding',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=800',
    duration: '200 hr',
    sessionsCount: 90,
    direction: 'gym',
  },
  {
    id: '4',
    name: 'Cardio Blast',
    category: 'cardio',
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800',
    duration: '45 hr',
    sessionsCount: 50,
    direction: 'cardio',
  },
  {
    id: '5',
    name: 'Stretch & Flex',
    category: 'stretching',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    duration: '30 hr',
    sessionsCount: 40,
    direction: 'mobility',
  },
];

const CATEGORY_COLORS: Record<TProgramCategory, string> = {
  yoga: '#8B5CF6',
  meditation: '#06B6D4',
  bodybuilding: '#EF4444',
  cardio: '#F59E0B',
  stretching: '#10B981',
};

export const WorkoutScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const startWorkout = useWorkoutStore((state) => state.startWorkout);
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout);
  const activePlan = useTrainingPlanStore((state) => state.getActivePlan());

  const handleStartProgram = (program: ProgramItem) => {
    startWorkout({
      userId: 'user-1',
      name: program.name,
      direction: program.direction,
      exercises: [],
      duration: 0,
      totalVolume: 0,
    });
    navigation.navigate('WorkoutActive', { workoutId: 'new' });
  };

  const handleQuickStart = (type: 'empty' | 'last' | 'plan') => {
    if (type === 'empty') {
      startWorkout({
        userId: 'user-1',
        name: t('workoutActive.newWorkout'),
        direction: 'gym',
        exercises: [],
        duration: 0,
        totalVolume: 0,
      });
      navigation.navigate('WorkoutActive', { workoutId: 'new' });
    } else if (type === 'plan' && activePlan) {
      navigation.navigate('SportSelection');
    }
  };

  const handleContinueWorkout = () => {
    if (activeWorkout) {
      navigation.navigate('WorkoutActive', { workoutId: activeWorkout.id });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('workout.title')}</Text>
          <Text style={styles.subtitle}>{t('workout.subtitle')}</Text>
        </View>

        {/* Active Workout Card */}
        {activeWorkout && (
          <TouchableOpacity
            style={styles.activeWorkoutCard}
            onPress={handleContinueWorkout}
            activeOpacity={0.9}
          >
            <View style={styles.activeWorkoutHeader}>
              <Text style={styles.activeWorkoutLabel}>{t('workout.inProgress')}</Text>
              <View style={styles.activeDot} />
            </View>
            <Text style={styles.activeWorkoutName}>{activeWorkout.name}</Text>
            <Text style={styles.activeWorkoutInfo}>
              {t('workout.exerciseCount', { count: activeWorkout.exercises.length })}
            </Text>
            <Button
              title={t('workout.continueWorkout')}
              onPress={handleContinueWorkout}
              fullWidth
              style={styles.continueButton}
            />
          </TouchableOpacity>
        )}

        {/* Quick Start */}
        <SectionHeader title={t('workout.quickStart')} />
        <View style={styles.quickStartRow}>
          <TouchableOpacity
            style={styles.quickStartButton}
            onPress={() => handleQuickStart('empty')}
          >
            <Text style={styles.quickStartIcon}>⚡</Text>
            <Text style={styles.quickStartText}>{t('workout.empty')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickStartButton}
            onPress={() => handleQuickStart('last')}
          >
            <Text style={styles.quickStartIcon}>📋</Text>
            <Text style={styles.quickStartText}>{t('workout.last')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickStartButton}
            onPress={() => handleQuickStart('plan')}
          >
            <Text style={styles.quickStartIcon}>📅</Text>
            <Text style={styles.quickStartText}>{t('nav.plan')}</Text>
          </TouchableOpacity>
        </View>

        {/* Programs */}
        <SectionHeader
          title={t('programs.featuredPrograms')}
          action={{
            label: t('common.viewAll'),
            onPress: () => {},
          }}
        />

        {PROGRAMS.map((program) => (
          <TouchableOpacity
            key={program.id}
            style={styles.programCard}
            onPress={() => handleStartProgram(program)}
            activeOpacity={0.9}
          >
            <ImageBackground
              source={{ uri: program.imageUrl }}
              style={styles.programImage}
              imageStyle={styles.programImageStyle}
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.programGradient}
              >
                <View style={styles.programContent}>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: CATEGORY_COLORS[program.category] },
                    ]}
                  >
                    <Text style={styles.categoryText}>
                      {t(`programs.categories.${program.category}`)}
                    </Text>
                  </View>
                  <Text style={styles.programName}>{program.name}</Text>
                  <Text style={styles.programMeta}>
                    {program.duration} • {program.sessionsCount} Sessions
                  </Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        ))}

        {/* Manage Workouts */}
        <SectionHeader title={t('workout.templates')} />
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => navigation.navigate('WorkoutHistory')}
        >
          <Text style={styles.manageIcon}>📊</Text>
          <View style={styles.manageContent}>
            <Text style={styles.manageTitle}>{t('workoutHistory.title')}</Text>
            <Text style={styles.manageSubtitle}>
              {t('common.viewAll')} {t('common.workouts')}
            </Text>
          </View>
          <Text style={styles.manageArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => navigation.navigate('SportSelection')}
        >
          <Text style={styles.manageIcon}>📋</Text>
          <View style={styles.manageContent}>
            <Text style={styles.manageTitle}>{t('plan.title')}</Text>
            <Text style={styles.manageSubtitle}>{t('plan.subtitle')}</Text>
          </View>
          <Text style={styles.manageArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
    marginTop: SPACING.xs,
  },
  activeWorkoutCard: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  activeWorkoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  activeWorkoutLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.8,
    letterSpacing: 1,
    fontWeight: '600',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginLeft: SPACING.sm,
  },
  activeWorkoutName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
  activeWorkoutInfo: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SPACING.xs,
  },
  continueButton: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  quickStartRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  quickStartButton: {
    flex: 1,
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  quickStartIcon: {
    fontSize: 28,
    marginBottom: SPACING.sm,
  },
  quickStartText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  programCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    height: 160,
  },
  programImage: {
    flex: 1,
  },
  programImageStyle: {
    borderRadius: BORDER_RADIUS.xl,
  },
  programGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  programContent: {
    padding: SPACING.lg,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.sm,
  },
  categoryText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.white,
  },
  programName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
  programMeta: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[300],
    marginTop: 4,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[800],
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  manageIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  manageContent: {
    flex: 1,
  },
  manageTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.white,
  },
  manageSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
    marginTop: 2,
  },
  manageArrow: {
    fontSize: 24,
    color: COLORS.gray[500],
  },
  bottomSpacing: {
    height: SPACING['3xl'],
  },
});
