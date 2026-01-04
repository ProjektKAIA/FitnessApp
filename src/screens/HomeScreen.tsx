import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import {
  WorkoutTile,
  StatTile,
  DirectionTile,
  ProgressTile,
  StreakTile,
  AdTile,
  getTileGap,
} from '@/components/tiles';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { useStatsStore, useWorkoutStore } from '@/stores';
import { RootStackParamList } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout);

  const handleStartWorkout = () => {
    navigation.navigate('WorkoutActive', { workoutId: 'new' });
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
          <WorkoutTile
            size="2x1"
            workoutName={activeWorkout?.name || t('home.startWorkout')}
            isActive={!!activeWorkout}
            onPress={handleStartWorkout}
          />

          <View style={styles.row}>
            <StreakTile
              currentStreak={stats.currentStreak}
              longestStreak={stats.longestStreak}
            />
            <StatTile
              label={t('home.thisWeek')}
              value={stats.thisWeekWorkouts}
              unit={t('common.workouts')}
              icon="📅"
              color={COLORS.primary}
            />
          </View>

          <View style={styles.row}>
            <ProgressTile
              title={t('home.weeklyGoal')}
              current={stats.thisWeekWorkouts}
              target={5}
              color={COLORS.success}
            />
            <StatTile
              label={t('home.totalVolume')}
              value={Math.round(stats.totalVolume / 1000)}
              unit="k kg"
              icon="🏋️"
              color={COLORS.accent}
            />
          </View>

          <Text style={styles.sectionTitle}>{t('home.trainingDirections')}</Text>

          <View style={styles.row}>
            <DirectionTile
              direction="gym"
              isSelected
              workoutsCount={12}
            />
            <DirectionTile
              direction="calisthenics"
              workoutsCount={5}
            />
          </View>

          <View style={styles.row}>
            <DirectionTile
              direction="cardio"
              workoutsCount={8}
            />
            <DirectionTile
              direction="yoga"
              workoutsCount={3}
            />
          </View>

          <AdTile
            title={t('home.premium.title')}
            description={t('home.premium.description')}
            ctaText={t('home.premium.cta')}
            onPress={() => {}}
            onClose={() => {}}
          />

          <View style={styles.row}>
            <StatTile
              label={t('home.totalWorkouts')}
              value={stats.totalWorkouts}
              icon="💪"
              color={COLORS.success}
            />
            <StatTile
              label={t('home.thisMonth')}
              value={stats.thisMonthWorkouts}
              unit={t('common.workouts')}
              icon="📊"
              color={COLORS.purple}
            />
          </View>
        </View>
      </ScrollView>
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
    marginVertical: SPACING.lg,
  },
  greeting: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
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
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
});
