// /workspaces/claude-workspace/fitnessapp/src/screens/HomeScreen.tsx

import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text, Alert, Linking } from 'react-native';
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
  AdTile,
  HealthTile,
  getTileGap,
} from '@/components/tiles';
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
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout);
  const getWorkoutHistory = useWorkoutStore((state) => state.getWorkoutHistory);

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
      running: 0,
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

  const handleWorkoutHistoryPress = () => {
    navigation.navigate('WorkoutHistory');
  };

  const handleDirectionPress = (direction: TDirection) => {
    if (direction === 'yoga') {
      navigation.navigate('YogaHome');
    } else if (direction === 'running') {
      navigation.navigate('RunningHome');
    } else if (direction === 'calisthenics') {
      navigation.navigate('CalisthenicsHome');
    } else {
      navigation.navigate('WorkoutHistory', { direction });
    }
  };

  const handleHealthPress = () => {
    navigation.navigate('HealthDashboard');
  };

  const handleAffiliateAdPress = (url: string, advertiserName: string) => {
    Alert.alert(
      t('home.ads.affiliate.confirmTitle'),
      t('home.ads.affiliate.confirmMessage', { advertiser: advertiserName }),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.yes'),
          onPress: () => {
            Linking.openURL(url).catch((err) =>
              console.error('[HomeScreen] Failed to open URL:', err)
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              {getGreeting(t)}
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              {t('home.readyToTrain')}
            </Text>
          </View>
          <Text style={[styles.brandName, { color: colors.primary }]}>ShapyFit</Text>
        </View>

        <View style={styles.tilesContainer}>
          <View style={styles.row}>
            <WorkoutTile
              size="1x1"
              workoutName={activeWorkout?.name || t('home.startWorkout')}
              isActive={!!activeWorkout}
              onPress={handleStartWorkout}
            />
            <DirectionTile
              direction="gym"
              workoutsCount={directionCounts.gym}
              onPress={() => handleDirectionPress('gym')}
            />
            <DirectionTile
              direction="running"
              workoutsCount={directionCounts.running}
              onPress={() => handleDirectionPress('running')}
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
                label={t('home.totalWorkouts')}
                value={stats.totalWorkouts}
                icon="💪"
                onPress={handleWorkoutHistoryPress}
              />
            </View>
          )}

          <View style={styles.row}>
            <DirectionTile
              direction="yoga"
              workoutsCount={directionCounts.yoga}
              onPress={() => handleDirectionPress('yoga')}
            />
            <AdTile
              size="1x1"
              title={t('guide.nutrition.supplements')}
              onPress={() => navigation.navigate('Guide')}
              transparent
            />
            <AdTile
              size="1x1"
              title="10% auf ESN"
              onPress={() => handleAffiliateAdPress('https://www.esn.com', 'ESN')}
              transparent
            />
          </View>

          <View style={styles.row}>
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
            <AdTile
              size="1x1"
              title={t('home.ads.plans.title')}
              onPress={() => navigation.navigate('TrainingPlanList')}
              transparent
            />
          </View>

          <View style={styles.row}>
            <AdTile
              size="1x1"
              title={t('home.ads.import.title')}
              onPress={() => navigation.navigate('ChatGPTImport')}
              transparent
            />
            <DirectionTile
              direction="custom"
              workoutsCount={0}
              onPress={() => navigation.navigate('HomeworkoutHome')}
              customTitle={t('homeworkout.title')}
              customImage="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800"
            />
            <AdTile
              size="1x1"
              title={t('home.ads.health.title')}
              onPress={() => navigation.navigate('HealthSettings')}
              transparent
            />
          </View>

          <AdTile
            size="3x1"
            title={t('home.premium.title')}
            description={t('home.premium.description')}
            ctaText={t('home.premium.cta')}
            onPress={() => handleAffiliateAdPress('https://www.example.com', 'Premium Supplements')}
            onClose={() => {}}
          />
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginVertical: SPACING.md,
  },
  headerLeft: {
    flex: 1,
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
  brandName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tilesContainer: {
    gap: getTileGap(),
  },
  row: {
    flexDirection: 'row',
    gap: getTileGap(),
  },
});
