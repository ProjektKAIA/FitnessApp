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

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { Button } from '@/components/common';
import { FLOATING_TAB_BAR_HEIGHT } from '@/components/navigation';
import { useTheme } from '@/contexts';
import { useWorkoutStore, useTrainingPlanStore, useUserStore } from '@/stores';
import { RootStackParamList, TSportType } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SportCardData {
  type: TSportType;
  title: string;
  subtitle: string;
  icon: string;
  image: string;
  color: string;
  available: boolean;
}

export const WorkoutScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const startWorkout = useWorkoutStore((state) => state.startWorkout);
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout);
  const user = useUserStore((state) => state.user);

  const sportCards: SportCardData[] = [
    {
      type: 'fitness',
      title: t('sportTypes.fitness'),
      subtitle: t('workout.sportCards.fitnessDesc'),
      icon: '🏋️',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      color: COLORS.primary,
      available: true,
    },
    {
      type: 'running',
      title: t('sportTypes.running'),
      subtitle: t('workout.sportCards.runningDesc'),
      icon: '🏃',
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
      color: COLORS.accent,
      available: true,
    },
    {
      type: 'yoga',
      title: t('sportTypes.yoga'),
      subtitle: t('workout.sportCards.yogaDesc'),
      icon: '🧘',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
      color: COLORS.purple,
      available: true,
    },
    {
      type: 'calisthenics',
      title: t('sportTypes.calisthenics'),
      subtitle: t('workout.sportCards.calisthenicsDesc'),
      icon: '🤸',
      image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800',
      color: COLORS.warning,
      available: true,
    },
    {
      type: 'homeworkout',
      title: t('homeworkout.title'),
      subtitle: t('homeworkout.subtitle'),
      icon: '🏠',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
      color: COLORS.success,
      available: true,
    },
  ];

  const handleSportPress = (sport: SportCardData) => {
    if (!sport.available) return;

    switch (sport.type) {
      case 'fitness':
        navigation.navigate('TrainingPlanList');
        break;
      case 'running':
        navigation.navigate('RunningHome');
        break;
      case 'yoga':
        navigation.navigate('YogaHome');
        break;
      case 'calisthenics':
        navigation.navigate('CalisthenicsHome');
        break;
      case 'homeworkout':
        navigation.navigate('HomeworkoutHome');
        break;
      default:
        navigation.navigate('SportSelection');
    }
  };

  const handleStartEmptyWorkout = () => {
    startWorkout({
      userId: user?.id || 'guest',
      name: t('workoutActive.newWorkout'),
      direction: 'gym',
      exercises: [],
      duration: 0,
      totalVolume: 0,
    });
    navigation.navigate('WorkoutActive', { workoutId: 'new' });
  };

  const handleContinueWorkout = () => {
    if (activeWorkout) {
      navigation.navigate('WorkoutActive', { workoutId: activeWorkout.id });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('workout.title')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('workout.subtitle')}</Text>
        </View>

        {/* Active Workout Card */}
        {activeWorkout && (
          <TouchableOpacity
            style={[styles.activeWorkoutCard, { backgroundColor: colors.primary }]}
            onPress={handleContinueWorkout}
            activeOpacity={0.9}
          >
            <View style={styles.activeWorkoutHeader}>
              <Text style={styles.activeWorkoutLabel}>{t('workout.inProgress')}</Text>
              <View style={[styles.activeDot, { backgroundColor: colors.success }]} />
            </View>
            <Text style={styles.activeWorkoutName}>{activeWorkout.name}</Text>
            <Text style={styles.activeWorkoutInfo}>
              {t('workout.exerciseCount', { count: activeWorkout.exercises.length })}
            </Text>
            <Button
              title={t('workout.continueWorkout')}
              onPress={handleContinueWorkout}
              fullWidth
              style={StyleSheet.flatten([styles.continueButton, { backgroundColor: '#FFFFFF' }])}
              textStyle={{ color: colors.primary }}
            />
          </TouchableOpacity>
        )}

        {/* Quick Start */}
        <TouchableOpacity
          style={[styles.quickStartCard, { backgroundColor: colors.surfaceElevated }]}
          onPress={handleStartEmptyWorkout}
          activeOpacity={0.8}
        >
          <View style={[styles.quickStartIconContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.quickStartIcon}>⚡</Text>
          </View>
          <View style={styles.quickStartContent}>
            <Text style={[styles.quickStartTitle, { color: colors.text }]}>{t('workout.quickStart')}</Text>
            <Text style={[styles.quickStartSubtitle, { color: colors.textSecondary }]}>
              {t('workout.quickStartDesc')}
            </Text>
          </View>
          <Text style={[styles.quickStartArrow, { color: colors.textTertiary }]}>›</Text>
        </TouchableOpacity>

        {/* Sport Cards */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('workout.chooseSport')}</Text>

        {sportCards.map((sport) => (
          <TouchableOpacity
            key={sport.type}
            style={styles.sportCard}
            onPress={() => handleSportPress(sport)}
            activeOpacity={0.9}
            disabled={!sport.available}
          >
            <ImageBackground
              source={{ uri: sport.image }}
              style={styles.sportCardBackground}
              imageStyle={styles.sportCardImage}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
                style={styles.sportCardGradient}
              >
                <View style={styles.sportCardContent}>
                  <View style={styles.sportTextContainer}>
                    <Text style={styles.sportTitle}>{sport.title}</Text>
                    <Text style={styles.sportSubtitle}>{sport.subtitle}</Text>
                  </View>
                  <View style={styles.sportArrowContainer}>
                    <Text style={styles.sportArrow}>›</Text>
                  </View>
                </View>
                {!sport.available && (
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonText}>{t('home.comingSoon')}</Text>
                  </View>
                )}
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        ))}

        {/* Secondary Actions */}
        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: colors.surfaceElevated }]}
            onPress={() => navigation.navigate('WorkoutHistory')}
          >
            <Text style={styles.secondaryIcon}>📊</Text>
            <View style={styles.secondaryContent}>
              <Text style={[styles.secondaryTitle, { color: colors.text }]}>{t('workoutHistory.title')}</Text>
              <Text style={[styles.secondarySubtitle, { color: colors.textSecondary }]}>
                {t('common.viewAll')} {t('common.workouts')}
              </Text>
            </View>
            <Text style={[styles.secondaryArrow, { color: colors.textTertiary }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: colors.surfaceElevated }]}
            onPress={() => navigation.navigate('TrainingPlanList')}
          >
            <Text style={styles.secondaryIcon}>📋</Text>
            <View style={styles.secondaryContent}>
              <Text style={[styles.secondaryTitle, { color: colors.text }]}>{t('plan.managePlansTitle')}</Text>
              <Text style={[styles.secondarySubtitle, { color: colors.textSecondary }]}>
                {t('plan.subtitle')}
              </Text>
            </View>
            <Text style={[styles.secondaryArrow, { color: colors.textTertiary }]}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
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
    paddingBottom: FLOATING_TAB_BAR_HEIGHT + SPACING.md,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  activeWorkoutCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
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
  },
  quickStartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  quickStartIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  quickStartIcon: {
    fontSize: 24,
  },
  quickStartContent: {
    flex: 1,
  },
  quickStartTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginBottom: 2,
  },
  quickStartSubtitle: {
    fontSize: FONT_SIZES.sm,
  },
  quickStartArrow: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sportCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    height: 140,
    ...SHADOWS.md,
  },
  sportCardBackground: {
    flex: 1,
  },
  sportCardImage: {
    borderRadius: BORDER_RADIUS.xl,
  },
  sportCardGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: SPACING.lg,
  },
  sportCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sportTextContainer: {
    flex: 1,
  },
  sportTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 2,
  },
  sportSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.9,
  },
  sportArrowContainer: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportArrow: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: '600',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  comingSoonText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: '500',
  },
  secondaryActions: {
    marginTop: SPACING.lg,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  secondaryIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  secondaryContent: {
    flex: 1,
  },
  secondaryTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  secondarySubtitle: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  secondaryArrow: {
    fontSize: 24,
  },
  bottomSpacing: {
    height: SPACING['3xl'],
  },
});
