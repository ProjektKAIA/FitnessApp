import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  WorkoutTile,
  StatTile,
  DirectionTile,
  ProgressTile,
  StreakTile,
  AdTile,
  HealthTile,
  getTileGap,
} from '@/components/tiles';
import { WeeklyGoalModal } from '@/components/common';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { useStatsStore, useWorkoutStore } from '@/stores';
import { useHealthStore } from '@/stores/healthStore';
import { RootStackParamList, MainTabParamList, TDirection } from '@/types';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const getGreeting = (t: (key: string) => string): string => {
  const hour = new Date().getHours();
  if (hour < 12) return t('home.greeting');
  if (hour < 18) return t('home.greetingAfternoon');
  return t('home.greetingEvening');
};

export const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const stats = useStatsStore((state) => state.stats);
  const weeklyGoal = useStatsStore((state) => state.weeklyGoal);
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout);
  const getWorkoutHistory = useWorkoutStore((state) => state.getWorkoutHistory);
  const [isWeeklyGoalModalVisible, setWeeklyGoalModalVisible] = useState(false);

  // Health Data
  const healthSettings = useHealthStore((state) => state.settings);
  const todaySummary = useHealthStore((state) => state.todaySummary);
  const isHealthEnabled = healthSettings.enabled && healthSettings.permissionsGranted;

  // Calculate workout counts per direction
  const directionCounts = useMemo(() => {
    const workouts = getWorkoutHistory();
    const counts: Record<TDirection, number> = {
      gym: 0,
      calisthenics: 0,
      cardio: 0,
      yoga: 0,
      mobility: 0,
      custom: 0,
    };
    workouts.forEach((workout) => {
      if (workout.direction && counts[workout.direction] !== undefined) {
        counts[workout.direction]++;
      }
    });
    return counts;
  }, [getWorkoutHistory]);

  const handleStartWorkout = () => {
    navigation.navigate('WorkoutActive', { workoutId: 'new' });
  };

  // Navigation zu Programs Tab
  const handleNavigateToProgress = () => {
    navigation.navigate('Programs');
  };

  // Streak Tile Handler
  const handleStreakPress = () => {
    navigation.navigate('StreakDetail');
  };

  // Workout History Handler
  const handleWorkoutHistoryPress = () => {
    navigation.navigate('WorkoutHistory');
  };

  // Weekly Goal Modal Handler
  const handleWeeklyGoalPress = () => {
    setWeeklyGoalModalVisible(true);
  };

  // Direction Tile Handler - Navigate to filtered workout history
  const handleDirectionPress = (direction: TDirection) => {
    navigation.navigate('WorkoutHistory', { direction });
  };

  // Health Tile Handler
  const handleHealthPress = () => {
    navigation.navigate('Programs');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting(t)}</Text>
          <Text style={styles.title}>{t('home.readyToTrain')}</Text>
        </View>

        <View style={styles.tilesContainer}>
          {/* Row 1: Workout, Streak, Weekly Goal */}
          <View style={styles.row}>
            <WorkoutTile
              size="1x1"
              workoutName={activeWorkout?.name || t('home.startWorkout')}
              isActive={!!activeWorkout}
              onPress={handleStartWorkout}
            />
            <StreakTile
              currentStreak={stats.currentStreak}
              longestStreak={stats.longestStreak}
              onPress={handleStreakPress}
            />
            <ProgressTile
              title={t('home.weeklyGoal')}
              current={stats.thisWeekWorkouts}
              target={weeklyGoal}
              color={COLORS.success}
              onPress={handleWeeklyGoalPress}
            />
          </View>

          {/* Health Widget - Activity Rings */}
          {isHealthEnabled && (
            <View style={styles.row}>
              <HealthTile
                size="2x1"
                steps={todaySummary?.steps?.count ?? 0}
                stepsGoal={healthSettings.stepsGoal}
                calories={todaySummary?.calories?.active ?? 0}
                activeMinutes={todaySummary?.activeMinutes ?? 0}
                onPress={handleHealthPress}
              />
              <StatTile
                label={t('home.thisMonth')}
                value={stats.thisMonthWorkouts}
                icon="📊"
                onPress={handleNavigateToProgress}
              />
            </View>
          )}

          {/* Row 2: Volume, Total Workouts, This Month */}
          <View style={styles.row}>
            <StatTile
              label={t('home.totalVolume')}
              value={Math.round(stats.totalVolume / 1000)}
              unit="k"
              icon="🏋️"
              onPress={handleNavigateToProgress}
            />
            <StatTile
              label={t('home.totalWorkouts')}
              value={stats.totalWorkouts}
              icon="💪"
              onPress={handleWorkoutHistoryPress}
            />
            <StatTile
              label={t('home.thisMonth')}
              value={stats.thisMonthWorkouts}
              icon="📊"
              onPress={handleNavigateToProgress}
            />
          </View>

          {/* Row 3: Directions (Top) */}
          <View style={styles.row}>
            <DirectionTile
              direction="gym"
              workoutsCount={directionCounts.gym}
              onPress={() => handleDirectionPress('gym')}
            />
            <DirectionTile
              direction="calisthenics"
              workoutsCount={directionCounts.calisthenics}
              onPress={() => handleDirectionPress('calisthenics')}
            />
            <DirectionTile
              direction="cardio"
              workoutsCount={directionCounts.cardio}
              onPress={() => handleDirectionPress('cardio')}
            />
          </View>

          {/* Row 4: Directions (Bottom) */}
          <View style={styles.row}>
            <DirectionTile
              direction="yoga"
              workoutsCount={directionCounts.yoga}
              onPress={() => handleDirectionPress('yoga')}
            />
            <DirectionTile
              direction="mobility"
              workoutsCount={directionCounts.mobility}
              onPress={() => handleDirectionPress('mobility')}
            />
            <DirectionTile
              direction="custom"
              workoutsCount={directionCounts.custom}
              onPress={() => handleDirectionPress('custom')}
            />
          </View>

          {/* Ad Banner - volle Breite */}
          <AdTile
            size="3x1"
            title={t('home.premium.title')}
            description={t('home.premium.description')}
            ctaText={t('home.premium.cta')}
            onPress={() => {}}
            onClose={() => {}}
          />
        </View>
      </ScrollView>

      <WeeklyGoalModal
        visible={isWeeklyGoalModalVisible}
        onClose={() => setWeeklyGoalModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['2xl'],
  },
  header: {
    marginVertical: SPACING.md,
  },
  greeting: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginTop: SPACING.xs,
  },
  tilesContainer: {
    gap: getTileGap(),
  },
  row: {
    flexDirection: 'row',
    gap: getTileGap(),
  },
});
