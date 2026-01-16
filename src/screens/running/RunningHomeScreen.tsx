// /workspaces/claude-workspace/fitnessapp/src/screens/running/RunningHomeScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { useTheme } from '@/contexts';
import { RootStackParamList } from '@/types';
import {
  RUNNING_PLANS,
  RUNNING_WORKOUTS,
  RUNNING_WORKOUT_TYPE_LABELS,
  RUNNING_GOAL_LABELS,
  RUNNING_LEVEL_LABELS,
} from '@/data/runningLibrary';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RunningVideo {
  id: string;
  title: string;
  duration: string;
  level: string;
  thumbnail: string;
  youtubeUrl: string;
  channel: string;
}

// Real YouTube running videos
const RUNNING_VIDEOS: RunningVideo[] = [
  {
    id: 'run_video_1',
    title: 'Proper Running Form',
    duration: '8:00',
    level: 'All Levels',
    thumbnail: 'https://i.ytimg.com/vi/brFHyOtTwH4/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=brFHyOtTwH4',
    channel: 'Global Triathlon Network',
  },
  {
    id: 'run_video_2',
    title: '5 Min Running Warm Up',
    duration: '5:00',
    level: 'Beginner',
    thumbnail: 'https://i.ytimg.com/vi/c4xfhQxKlWc/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=c4xfhQxKlWc',
    channel: 'MadFit',
  },
  {
    id: 'run_video_3',
    title: '10 Min Post Run Stretch',
    duration: '10:00',
    level: 'All Levels',
    thumbnail: 'https://i.ytimg.com/vi/KSKhegJRs0o/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=KSKhegJRs0o',
    channel: 'MadFit',
  },
  {
    id: 'run_video_4',
    title: 'Beginner Running Tips',
    duration: '12:00',
    level: 'Beginner',
    thumbnail: 'https://i.ytimg.com/vi/kVnyY17VS9Y/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=kVnyY17VS9Y',
    channel: 'The Run Experience',
  },
  {
    id: 'run_video_5',
    title: 'Runner Strength Training',
    duration: '15:00',
    level: 'Intermediate',
    thumbnail: 'https://i.ytimg.com/vi/6usrL0gfPjs/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=6usrL0gfPjs',
    channel: 'Sydney Cummings',
  },
  {
    id: 'run_video_6',
    title: 'How to Run Longer',
    duration: '10:00',
    level: 'Beginner',
    thumbnail: 'https://i.ytimg.com/vi/9L2b2khySLE/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=9L2b2khySLE',
    channel: 'The Run Experience',
  },
];

export const RunningHomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const quickWorkouts = RUNNING_WORKOUTS.slice(0, 4);

  const handleVideoPress = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error('[RunningHomeScreen] Failed to open video:', err)
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backIcon, { color: colors.text }]}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('running.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={[styles.heroCard, { backgroundColor: COLORS.accent }]}>
          <Text style={styles.heroIcon}>{'🏃'}</Text>
          <Text style={styles.heroTitle}>{t('running.heroTitle')}</Text>
          <Text style={styles.heroSubtitle}>{t('running.heroSubtitle')}</Text>
        </View>

        {/* Video Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('running.videos')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.videosContainer}
        >
          {RUNNING_VIDEOS.map((video) => (
            <TouchableOpacity
              key={video.id}
              style={styles.videoCard}
              onPress={() => handleVideoPress(video.youtubeUrl)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: video.thumbnail }}
                style={styles.videoThumbnail}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.videoGradient}
              >
                <View style={styles.videoPlayButton}>
                  <Text style={styles.videoPlayIcon}>▶</Text>
                </View>
                <View style={styles.videoBadges}>
                  <View style={styles.videoDurationBadge}>
                    <Text style={styles.videoDurationText}>{video.duration}</Text>
                  </View>
                  <View style={styles.videoYoutubeBadge}>
                    <Text style={styles.videoYoutubeText}>YouTube</Text>
                  </View>
                </View>
                <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
                <Text style={styles.videoChannel}>{video.channel}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quick Start */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('running.quickStart')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickWorkoutsContainer}
        >
          {quickWorkouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              style={[styles.quickWorkoutCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('RunningWorkoutDetail', { workoutId: workout.id })}
            >
              <Text style={styles.quickWorkoutIcon}>
                {RUNNING_WORKOUT_TYPE_LABELS[workout.type].icon}
              </Text>
              <Text style={[styles.quickWorkoutName, { color: colors.text }]} numberOfLines={1}>
                {workout.name}
              </Text>
              <Text style={[styles.quickWorkoutDuration, { color: colors.textSecondary }]}>
                {workout.targetDuration} {t('running.min')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Training Plans */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('running.trainingPlans')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RunningPlanList')}>
            <Text style={[styles.seeAllText, { color: COLORS.accent }]}>{t('common.viewAll')}</Text>
          </TouchableOpacity>
        </View>

        {RUNNING_PLANS.slice(0, 3).map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[styles.planCard, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('RunningPlanDetail', { planId: plan.id })}
          >
            <View style={styles.planContent}>
              <View style={[styles.planBadge, { backgroundColor: COLORS.accent + '20' }]}>
                <Text style={[styles.planBadgeText, { color: COLORS.accent }]}>
                  {RUNNING_GOAL_LABELS[plan.goal].de}
                </Text>
              </View>
              <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
              <Text style={[styles.planDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                {plan.description}
              </Text>
              <View style={styles.planMeta}>
                <View style={styles.planMetaItem}>
                  <Text style={[styles.planMetaIcon]}>{'📅'}</Text>
                  <Text style={[styles.planMetaText, { color: colors.textSecondary }]}>
                    {plan.durationWeeks} {t('running.weeks')}
                  </Text>
                </View>
                <View style={styles.planMetaItem}>
                  <Text style={[styles.planMetaIcon]}>{'📊'}</Text>
                  <Text style={[styles.planMetaText, { color: colors.textSecondary }]}>
                    {RUNNING_LEVEL_LABELS[plan.level].de}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={[styles.planArrow, { color: colors.textSecondary }]}>{'>'}</Text>
          </TouchableOpacity>
        ))}

        {/* All Workouts Button */}
        <TouchableOpacity
          style={[styles.allWorkoutsButton, { backgroundColor: colors.surface, borderColor: COLORS.accent }]}
          onPress={() => navigation.navigate('RunningPlanList')}
        >
          <Text style={[styles.allWorkoutsText, { color: COLORS.accent }]}>
            {t('running.allWorkouts')}
          </Text>
        </TouchableOpacity>

        {/* Tips Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('running.tips')}</Text>
        <View style={[styles.tipsCard, { backgroundColor: colors.surface }]}>
          <Text style={styles.tipIcon}>{'💡'}</Text>
          <View style={styles.tipContent}>
            <Text style={[styles.tipTitle, { color: colors.text }]}>{t('running.tipTitle')}</Text>
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>
              {t('running.tipText')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING['4xl'],
  },
  heroCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
  },
  heroIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  heroTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  seeAllText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  quickWorkoutsContainer: {
    paddingBottom: SPACING.md,
    marginBottom: SPACING.lg,
  },
  quickWorkoutCard: {
    width: 130,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  quickWorkoutIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  quickWorkoutName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  quickWorkoutDuration: {
    fontSize: FONT_SIZES.xs,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  planContent: {
    flex: 1,
  },
  planBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  planBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  planName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  planDescription: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  planMeta: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  planMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  planMetaIcon: {
    fontSize: 14,
  },
  planMetaText: {
    fontSize: FONT_SIZES.xs,
  },
  planArrow: {
    fontSize: FONT_SIZES.xl,
    marginLeft: SPACING.md,
  },
  allWorkoutsButton: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  allWorkoutsText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  tipsCard: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.sm,
  },
  tipIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  tipText: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 18,
  },
  videosContainer: {
    paddingBottom: SPACING.md,
    marginBottom: SPACING.lg,
  },
  videoCard: {
    width: 200,
    height: 150,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginRight: SPACING.md,
    ...SHADOWS.md,
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  videoGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    justifyContent: 'flex-end',
    padding: SPACING.sm,
  },
  videoPlayButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayIcon: {
    fontSize: 16,
    color: COLORS.gray[900],
    marginLeft: 2,
  },
  videoBadges: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  videoDurationBadge: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  videoDurationText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
  videoYoutubeBadge: {
    backgroundColor: '#FF0000',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  videoYoutubeText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  videoTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginBottom: 2,
  },
  videoChannel: {
    color: COLORS.gray[300],
    fontSize: FONT_SIZES.xs,
  },
});
