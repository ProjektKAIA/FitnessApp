// /workspaces/claude-workspace/fitnessapp/src/screens/HomeScreen.tsx

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
import { FLOATING_TAB_BAR_HEIGHT } from '@/components/navigation';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { useTheme } from '@/contexts';
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
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const stats = useStatsStore((state) => state.stats);
  const weeklyGoal = useStatsStore((state) => state.weeklyGoal);
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout);
  const getWorkoutHistory = useWorkoutStore((state) => state.getWorkoutHistory);
  const [isWeeklyGoalModalVisible, setWeeklyGoalModalVisible] = useState(false);

  const healthSettings = useHealthStore((state) => state.settings);
  const todaySummary = useHealthStore((state) => state.todaySummary);
  const isHealthEnabled = healthSettings.enabled && healthSettings.permissionsGranted;

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

  const handleNavigateToProgress = () => {
    navigation.navigate('Programs');
  };

  const handleStreakPress = () => {
    navigation.navigate('StreakDetail');
  };

  const handleWorkoutHistoryPress = () => {
    navigation.navigate('WorkoutHistory');
  };

  const handleWeeklyGoalPress = () => {
    setWeeklyGoalModalVisible(true);
  };

  const handleDirectionPress = (direction: TDirection) => {
    navigation.navigate('WorkoutHistory', { direction });
  };

  const handleHealthPress = () => {
    navigation.navigate('Programs');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            {getGreeting(t)}
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('home.readyToTrain')}
          </Text>
        </View>

        <View style={styles.tilesContainer}>
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
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: FLOATING_TAB_BAR_HEIGHT + SPACING.md,
  },
  header: {
    marginVertical: SPACING.md,
  },
  greeting: {
    fontSize: FONT_SIZES.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
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
