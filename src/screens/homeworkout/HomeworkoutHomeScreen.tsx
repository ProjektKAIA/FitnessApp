// /workspaces/claude-workspace/fitnessapp/src/screens/homeworkout/HomeworkoutHomeScreen.tsx

import React, { useState, useCallback } from 'react';
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
import { useHomeworkoutStore, useStatsStore } from '@/stores';
import {
  HOMEWORKOUT_VIDEOS,
  HOMEWORKOUT_CATEGORIES,
  HOMEWORKOUT_LEVELS,
  HomeworkoutVideo,
} from '@/data/homeworkoutLibrary';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeworkoutHomeScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [completionModalVisible, setCompletionModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<HomeworkoutVideo | null>(null);

  const {
    markVideoCompleted,
    toggleFavorite,
    isFavorite,
    getCompletionCount,
    totalCompletions,
    totalMinutes,
    favorites,
  } = useHomeworkoutStore();
  const { incrementStreak, updateStats, stats } = useStatsStore();

  const isGerman = i18n.language === 'de';

  // Parse duration string to minutes (e.g. "15 min" -> 15)
  const parseDuration = (duration: string): number => {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 15;
  };

  // Estimate calories based on category and duration (MET values)
  const estimateCalories = (category: string, durationMinutes: number): number => {
    const metValues: Record<string, number> = {
      full_body: 6.0,
      hiit: 8.0,
      strength: 5.0,
      cardio: 7.0,
      core: 4.0,
      stretching: 2.5,
    };
    const met = metValues[category] || 5.0;
    // Calories = MET × weight(kg) × duration(hours), assuming 70kg
    return Math.round(met * 70 * (durationMinutes / 60));
  };

  const handleVideoPress = async (video: HomeworkoutVideo) => {
    setSelectedVideo(video);
    try {
      const supported = await Linking.canOpenURL(video.youtubeUrl);
      if (supported) {
        await Linking.openURL(video.youtubeUrl);
        // Show completion modal after opening video
        setTimeout(() => {
          setCompletionModalVisible(true);
        }, 1000);
      } else {
        Alert.alert(
          t('homeworkout.videoError'),
          t('homeworkout.videoErrorMessage')
        );
      }
    } catch (error) {
      console.error('[HomeworkoutHome] Error opening video:', error);
    }
  };

  const handleMarkCompleted = useCallback(() => {
    if (!selectedVideo) return;

    const durationMinutes = parseDuration(selectedVideo.duration);
    const calories = estimateCalories(selectedVideo.category, durationMinutes);

    markVideoCompleted(selectedVideo.id, durationMinutes, calories);
    incrementStreak();
    updateStats({
      totalWorkouts: stats.totalWorkouts + 1,
      thisWeekWorkouts: stats.thisWeekWorkouts + 1,
      thisMonthWorkouts: stats.thisMonthWorkouts + 1,
    });

    setCompletionModalVisible(false);
    setSelectedVideo(null);

    Alert.alert(
      isGerman ? 'Gut gemacht!' : 'Well done!',
      isGerman
        ? `Workout abgeschlossen! ~${calories} kcal verbrannt.`
        : `Workout completed! ~${calories} kcal burned.`
    );
  }, [selectedVideo, isGerman, markVideoCompleted, incrementStreak, updateStats, stats]);

  const handleToggleFavorite = (videoId: string, event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    toggleFavorite(videoId);
  };

  const filteredVideos = selectedCategory
    ? HOMEWORKOUT_VIDEOS.filter((v) => v.category === selectedCategory)
    : HOMEWORKOUT_VIDEOS;

  const favoriteVideos = HOMEWORKOUT_VIDEOS.filter((v) => favorites.includes(v.id));

  const categories = Object.entries(HOMEWORKOUT_CATEGORIES);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200' }}
          style={styles.heroSection}
          imageStyle={styles.heroImage}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
            style={styles.heroGradient}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← {t('common.back')}</Text>
            </TouchableOpacity>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{t('homeworkout.title')}</Text>
              <Text style={styles.heroSubtitle}>{t('homeworkout.subtitle')}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Stats Card */}
        <View style={[styles.statsCard, { backgroundColor: colors.surfaceElevated }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{totalCompletions}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {isGerman ? 'Workouts' : 'Workouts'}
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{totalMinutes}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {isGerman ? 'Minuten' : 'Minutes'}
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{favorites.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {isGerman ? 'Favoriten' : 'Favorites'}
            </Text>
          </View>
        </View>

        {/* Favorites Section */}
        {favoriteVideos.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              ❤️ {isGerman ? 'Deine Favoriten' : 'Your Favorites'}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.favoritesScroll}
              contentContainerStyle={styles.favoritesContainer}
            >
              {favoriteVideos.map((video) => (
                <TouchableOpacity
                  key={`fav-${video.id}`}
                  style={styles.favoriteCard}
                  onPress={() => handleVideoPress(video)}
                  activeOpacity={0.9}
                >
                  <ImageBackground
                    source={{ uri: video.thumbnail }}
                    style={styles.favoriteThumbnail}
                    imageStyle={styles.favoriteImage}
                  >
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.8)']}
                      style={styles.favoriteGradient}
                    >
                      <Text style={styles.favoriteTitle} numberOfLines={2}>
                        {isGerman ? video.titleDe : video.title}
                      </Text>
                      <Text style={styles.favoriteDuration}>{video.duration}</Text>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.surfaceElevated }]}>
          <Text style={styles.infoIcon}>🏠</Text>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              {t('homeworkout.noEquipment')}
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {t('homeworkout.noEquipmentDesc')}
            </Text>
          </View>
        </View>

        {/* Category Filter */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('homeworkout.categories')}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          <TouchableOpacity
            style={[
              styles.categoryChip,
              { backgroundColor: selectedCategory === null ? colors.primary : colors.surfaceElevated },
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.categoryChipText,
                { color: selectedCategory === null ? COLORS.white : colors.text },
              ]}
            >
              {t('common.all')}
            </Text>
          </TouchableOpacity>
          {categories.map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.categoryChip,
                { backgroundColor: selectedCategory === key ? colors.primary : colors.surfaceElevated },
              ]}
              onPress={() => setSelectedCategory(key)}
            >
              <Text style={styles.categoryChipIcon}>{value.icon}</Text>
              <Text
                style={[
                  styles.categoryChipText,
                  { color: selectedCategory === key ? COLORS.white : colors.text },
                ]}
              >
                {isGerman ? value.de : value.en}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Video Grid */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('homeworkout.workouts')} ({filteredVideos.length})
        </Text>
        <View style={styles.videoGrid}>
          {filteredVideos.map((video) => {
            const completionCount = getCompletionCount(video.id);
            const isVideoFavorite = isFavorite(video.id);

            return (
              <TouchableOpacity
                key={video.id}
                style={styles.videoCard}
                onPress={() => handleVideoPress(video)}
                activeOpacity={0.9}
              >
                <ImageBackground
                  source={{ uri: video.thumbnail }}
                  style={styles.videoThumbnail}
                  imageStyle={styles.videoImage}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.videoGradient}
                  >
                    <View style={styles.videoBadges}>
                      <View style={styles.leftBadges}>
                        <View style={[styles.durationBadge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                          <Text style={styles.durationText}>{video.duration}</Text>
                        </View>
                        {completionCount > 0 && (
                          <View style={[styles.completedBadge, { backgroundColor: COLORS.success }]}>
                            <Text style={styles.completedText}>✓ {completionCount}x</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.rightBadges}>
                        <TouchableOpacity
                          style={styles.favoriteButton}
                          onPress={(e) => handleToggleFavorite(video.id, e)}
                        >
                          <Text style={styles.favoriteIcon}>
                            {isVideoFavorite ? '❤️' : '🤍'}
                          </Text>
                        </TouchableOpacity>
                        <View style={[styles.levelBadge, { backgroundColor: colors.primary }]}>
                          <Text style={styles.levelText}>
                            {isGerman
                              ? HOMEWORKOUT_LEVELS[video.level].de
                              : HOMEWORKOUT_LEVELS[video.level].en}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.videoInfo}>
                      <Text style={styles.videoTitle} numberOfLines={2}>
                        {isGerman ? video.titleDe : video.title}
                      </Text>
                      <Text style={styles.videoChannel}>{video.channel}</Text>
                    </View>
                    <View style={styles.playButton}>
                      <Text style={styles.playIcon}>▶</Text>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Disclaimer Button */}
        <TouchableOpacity
          style={[styles.disclaimerButton, { backgroundColor: colors.surfaceElevated }]}
          onPress={() => setIsDisclaimerVisible(true)}
        >
          <Text style={styles.disclaimerIcon}>ℹ️</Text>
          <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
            {t('homeworkout.disclaimerButton')}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Disclaimer Modal */}
      <Modal
        visible={isDisclaimerVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsDisclaimerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t('homeworkout.disclaimerTitle')}
            </Text>
            <Text style={[styles.modalText, { color: colors.textSecondary }]}>
              {t('homeworkout.disclaimerText')}
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={() => setIsDisclaimerVisible(false)}
            >
              <Text style={styles.modalButtonText}>{t('common.understood')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Completion Modal */}
      <Modal
        visible={completionModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCompletionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={styles.completionIcon}>💪</Text>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {isGerman ? 'Workout absolviert?' : 'Workout completed?'}
            </Text>
            <Text style={[styles.modalText, { color: colors.textSecondary }]}>
              {selectedVideo
                ? isGerman
                  ? `Hast du "${selectedVideo.titleDe}" abgeschlossen?`
                  : `Did you complete "${selectedVideo.title}"?`
                : ''}
            </Text>
            <View style={styles.completionButtons}>
              <TouchableOpacity
                style={[styles.completionButton, { backgroundColor: colors.surfaceElevated }]}
                onPress={() => {
                  setCompletionModalVisible(false);
                  setSelectedVideo(null);
                }}
              >
                <Text style={[styles.completionButtonText, { color: colors.text }]}>
                  {isGerman ? 'Nein' : 'No'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.completionButton, { backgroundColor: colors.primary }]}
                onPress={handleMarkCompleted}
              >
                <Text style={[styles.completionButtonText, { color: COLORS.white }]}>
                  {isGerman ? 'Ja, erledigt!' : 'Yes, done!'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: SPACING['3xl'],
  },
  heroSection: {
    height: 220,
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: SPACING.sm,
    marginLeft: -SPACING.sm,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  heroContent: {
    marginBottom: SPACING.md,
  },
  heroTitle: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    opacity: 0.9,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginTop: -SPACING.xl,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.md,
  },
  infoIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  categoryScroll: {
    marginBottom: SPACING.md,
  },
  categoryContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  categoryChipIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  categoryChipText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  videoGrid: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  videoCard: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    height: 180,
    ...SHADOWS.md,
  },
  videoThumbnail: {
    flex: 1,
  },
  videoImage: {
    borderRadius: BORDER_RADIUS.xl,
  },
  videoGradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  videoBadges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  durationText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  levelBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  levelText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  videoInfo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  videoTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginBottom: 2,
  },
  videoChannel: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    opacity: 0.8,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 16,
    color: COLORS.gray[900],
    marginLeft: 2,
  },
  disclaimerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  disclaimerIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  disclaimerText: {
    fontSize: FONT_SIZES.sm,
  },
  bottomSpacing: {
    height: SPACING['3xl'],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  modalText: {
    fontSize: FONT_SIZES.base,
    lineHeight: 22,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  // Stats Card
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: SPACING.lg,
    marginTop: -SPACING.xl,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
  },
  // Favorites Section
  favoritesScroll: {
    marginBottom: SPACING.md,
  },
  favoritesContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  favoriteCard: {
    width: 150,
    height: 100,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginRight: SPACING.md,
    ...SHADOWS.sm,
  },
  favoriteThumbnail: {
    flex: 1,
  },
  favoriteImage: {
    borderRadius: BORDER_RADIUS.lg,
  },
  favoriteGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: SPACING.sm,
  },
  favoriteTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  favoriteDuration: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    opacity: 0.8,
  },
  // Video Card Updates
  leftBadges: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  rightBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  completedBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  completedText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  favoriteButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: BORDER_RADIUS.full,
  },
  favoriteIcon: {
    fontSize: 16,
  },
  // Completion Modal
  completionIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  completionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  completionButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  completionButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
});

export default HomeworkoutHomeScreen;
