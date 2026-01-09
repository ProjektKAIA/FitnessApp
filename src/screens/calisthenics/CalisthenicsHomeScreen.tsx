// /workspaces/claude-workspace/fitnessapp/src/screens/calisthenics/CalisthenicsHomeScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Linking,
  Alert,
  Modal,
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
  CALISTHENICS_VIDEOS,
  CALISTHENICS_WORKOUTS,
  CALISTHENICS_LEVEL_LABELS,
} from '@/data/calisthenicsLibrary';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CalisthenicsHomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(false);

  const handleVideoPress = async (videoUrl: string) => {
    try {
      const supported = await Linking.canOpenURL(videoUrl);
      if (supported) {
        await Linking.openURL(videoUrl);
      } else {
        Alert.alert(
          t('calisthenics.videoError'),
          t('calisthenics.videoErrorDesc'),
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        t('calisthenics.videoError'),
        t('calisthenics.videoErrorDesc'),
        [{ text: 'OK' }]
      );
    }
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('calisthenics.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={[styles.heroCard, { backgroundColor: COLORS.orange }]}>
          <Text style={styles.heroIcon}>{'🤸'}</Text>
          <Text style={styles.heroTitle}>{t('calisthenics.heroTitle')}</Text>
          <Text style={styles.heroSubtitle}>{t('calisthenics.heroSubtitle')}</Text>
        </View>

        {/* Start Workout Section */}
        <View style={styles.workoutSection}>
          <View style={styles.workoutSectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('calisthenics.startWorkout')}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('CalisthenicsWorkoutList')}>
              <Text style={[styles.seeAllText, { color: COLORS.accent }]}>
                {t('common.seeAll')}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.workoutScroll}>
            {CALISTHENICS_WORKOUTS.slice(0, 4).map((workout) => (
              <TouchableOpacity
                key={workout.id}
                style={[styles.workoutCard, { backgroundColor: colors.surface }]}
                onPress={() => navigation.navigate('CalisthenicsWorkoutDetail', { workoutId: workout.id })}
              >
                <Text style={styles.workoutCardIcon}>{'💪'}</Text>
                <Text style={[styles.workoutCardName, { color: colors.text }]} numberOfLines={2}>
                  {workout.name}
                </Text>
                <Text style={[styles.workoutCardInfo, { color: colors.textSecondary }]}>
                  {workout.duration} min • {workout.exercises.length} {t('calisthenics.exercises')}
                </Text>
                <View style={[styles.workoutLevelBadge, { backgroundColor: COLORS.accent + '20' }]}>
                  <Text style={[styles.workoutLevelText, { color: COLORS.accent }]}>
                    {CALISTHENICS_LEVEL_LABELS[workout.level].de}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Videos */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
            {t('calisthenics.quickVideos')}
          </Text>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setIsDisclaimerVisible(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.infoIcon, { color: colors.textSecondary }]}>{'ⓘ'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          {t('calisthenics.quickVideosDesc')}
        </Text>

        {CALISTHENICS_VIDEOS.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoCard}
            onPress={() => handleVideoPress(video.youtubeUrl)}
            activeOpacity={0.9}
          >
            <ImageBackground
              source={{ uri: video.thumbnail }}
              style={styles.videoCardBackground}
              imageStyle={styles.videoCardImage}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
                style={styles.videoCardGradient}
              >
                {/* Play Button */}
                <View style={styles.playButtonContainer}>
                  <View style={styles.playButton}>
                    <Text style={styles.playIcon}>{'▶'}</Text>
                  </View>
                </View>

                {/* Video Info */}
                <View style={styles.videoInfo}>
                  <View style={styles.videoMeta}>
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>{video.duration}</Text>
                    </View>
                    <View style={styles.levelBadgeVideo}>
                      <Text style={styles.levelTextVideo}>{video.level}</Text>
                    </View>
                  </View>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  <Text style={styles.videoChannel}>{video.channel}</Text>
                </View>

                {/* YouTube Badge */}
                <View style={styles.youtubeBadge}>
                  <Text style={styles.youtubeIcon}>{'▶'}</Text>
                  <Text style={styles.youtubeText}>YouTube</Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        ))}

        {/* Benefits Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('calisthenics.benefits')}</Text>
        <View style={styles.benefitsGrid}>
          {[
            { icon: '💪', title: t('calisthenics.benefitStrength'), desc: t('calisthenics.benefitStrengthDesc') },
            { icon: '🤸', title: t('calisthenics.benefitFlexibility'), desc: t('calisthenics.benefitFlexibilityDesc') },
            { icon: '⚡', title: t('calisthenics.benefitEndurance'), desc: t('calisthenics.benefitEnduranceDesc') },
            { icon: '🎯', title: t('calisthenics.benefitControl'), desc: t('calisthenics.benefitControlDesc') },
          ].map((benefit, index) => (
            <View key={index} style={[styles.benefitCard, { backgroundColor: colors.surface }]}>
              <Text style={styles.benefitIcon}>{benefit.icon}</Text>
              <Text style={[styles.benefitTitle, { color: colors.text }]}>{benefit.title}</Text>
              <Text style={[styles.benefitDesc, { color: colors.textSecondary }]}>{benefit.desc}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Disclaimer Modal */}
      <Modal
        visible={isDisclaimerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDisclaimerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDisclaimerVisible(false)}
        >
          <View style={[styles.disclaimerPopup, { backgroundColor: colors.surface }]}>
            <Text style={[styles.disclaimerText, { color: colors.text }]}>
              {t('calisthenics.videoDisclaimer')}
            </Text>
            <TouchableOpacity
              style={[styles.disclaimerButton, { backgroundColor: COLORS.orange }]}
              onPress={() => setIsDisclaimerVisible(false)}
            >
              <Text style={styles.disclaimerButtonText}>{t('common.ok')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.md,
    marginTop: -SPACING.xs,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  infoButton: {
    padding: SPACING.xs,
  },
  infoIcon: {
    fontSize: FONT_SIZES.lg,
  },

  // Video Card Styles
  videoCard: {
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    height: 180,
    ...SHADOWS.md,
  },
  videoCardBackground: {
    flex: 1,
  },
  videoCardImage: {
    borderRadius: BORDER_RADIUS.xl,
  },
  videoCardGradient: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'space-between',
  },
  playButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  playIcon: {
    fontSize: 24,
    color: COLORS.orange,
    marginLeft: 4,
  },
  videoInfo: {
    marginTop: 'auto',
  },
  videoMeta: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  durationBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  durationText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: '600',
  },
  levelBadgeVideo: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  levelTextVideo: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: '600',
  },
  videoTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 2,
  },
  videoChannel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.8,
  },
  youtubeBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    gap: 4,
  },
  youtubeIcon: {
    fontSize: 10,
    color: COLORS.white,
  },
  youtubeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: '600',
  },

  // Benefits
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  benefitCard: {
    width: '48%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  benefitIcon: {
    fontSize: 28,
    marginBottom: SPACING.sm,
  },
  benefitTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  benefitDesc: {
    fontSize: FONT_SIZES.xs,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Disclaimer Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  disclaimerPopup: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    maxWidth: 300,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  disclaimerText: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  disclaimerButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
  },
  disclaimerButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },

  // Workout Section
  workoutSection: {
    marginBottom: SPACING.xl,
  },
  workoutSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  seeAllText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  workoutScroll: {
    gap: SPACING.md,
  },
  workoutCard: {
    width: 160,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  workoutCardIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  workoutCardName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    minHeight: 40,
  },
  workoutCardInfo: {
    fontSize: FONT_SIZES.xs,
    marginBottom: SPACING.sm,
  },
  workoutLevelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  workoutLevelText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
});
