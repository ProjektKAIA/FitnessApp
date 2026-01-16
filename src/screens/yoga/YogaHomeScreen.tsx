// /workspaces/claude-workspace/fitnessapp/src/screens/yoga/YogaHomeScreen.tsx

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
  YOGA_SESSIONS,
  YOGA_PROGRAMS,
  YOGA_STYLE_LABELS,
  YOGA_FOCUS_LABELS,
  YOGA_LEVEL_LABELS,
} from '@/data/yogaLibrary';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface QuickYogaVideo {
  id: string;
  title: string;
  duration: string;
  level: string;
  thumbnail: string;
  youtubeUrl: string;
  channel: string;
}

// Real YouTube yoga videos from popular channels
const QUICK_YOGA_VIDEOS: QuickYogaVideo[] = [
  {
    id: 'video_1',
    title: '10 Min Morning Yoga',
    duration: '10:00',
    level: 'Beginner',
    thumbnail: 'https://i.ytimg.com/vi/4pKly2JojMw/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=4pKly2JojMw',
    channel: 'Yoga With Adriene',
  },
  {
    id: 'video_2',
    title: '15 Min Stress Relief Yoga',
    duration: '15:00',
    level: 'All Levels',
    thumbnail: 'https://i.ytimg.com/vi/hJbRpHZr_d0/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=hJbRpHZr_d0',
    channel: 'Yoga With Adriene',
  },
  {
    id: 'video_3',
    title: '20 Min Full Body Stretch',
    duration: '20:00',
    level: 'Beginner',
    thumbnail: 'https://i.ytimg.com/vi/g_tea8ZNk5A/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=g_tea8ZNk5A',
    channel: 'MadFit',
  },
  {
    id: 'video_4',
    title: '30 Min Power Yoga Flow',
    duration: '30:00',
    level: 'Intermediate',
    thumbnail: 'https://i.ytimg.com/vi/9kOCY0KNByw/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=9kOCY0KNByw',
    channel: 'Boho Beautiful',
  },
  {
    id: 'video_5',
    title: 'Yoga For Beginners',
    duration: '20:00',
    level: 'Beginner',
    thumbnail: 'https://i.ytimg.com/vi/v7AYKMP6rOE/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
    channel: 'Yoga With Adriene',
  },
  {
    id: 'video_6',
    title: 'Bedtime Yoga',
    duration: '12:00',
    level: 'All Levels',
    thumbnail: 'https://i.ytimg.com/vi/v7SN-d4qXx0/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=v7SN-d4qXx0',
    channel: 'Yoga With Adriene',
  },
];

export const YogaHomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(false);

  const quickSessions = YOGA_SESSIONS.filter(s => s.duration <= 30).slice(0, 4);
  const featuredPrograms = YOGA_PROGRAMS.slice(0, 2);

  const handleVideoPress = async (video: QuickYogaVideo) => {
    try {
      const supported = await Linking.canOpenURL(video.youtubeUrl);
      if (supported) {
        await Linking.openURL(video.youtubeUrl);
      } else {
        Alert.alert(
          t('yoga.videoError'),
          t('yoga.videoErrorDesc'),
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        t('yoga.videoError'),
        t('yoga.videoErrorDesc'),
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('yoga.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={[styles.heroCard, { backgroundColor: COLORS.purple }]}>
          <Text style={styles.heroIcon}>{'🧘'}</Text>
          <Text style={styles.heroTitle}>{t('yoga.heroTitle')}</Text>
          <Text style={styles.heroSubtitle}>{t('yoga.heroSubtitle')}</Text>
        </View>

        {/* Quick Yoga Videos */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>{t('yoga.quickVideos')}</Text>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setIsDisclaimerVisible(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.infoIcon, { color: colors.textSecondary }]}>{'ⓘ'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          {t('yoga.quickVideosDesc')}
        </Text>

        {QUICK_YOGA_VIDEOS.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoCard}
            onPress={() => handleVideoPress(video)}
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

        {/* Quick Sessions */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: SPACING.lg }]}>
          {t('yoga.quickSessions')}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickSessionsContainer}
        >
          {quickSessions.map((session) => (
            <TouchableOpacity
              key={session.id}
              style={[styles.quickSessionCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('YogaSessionDetail', { sessionId: session.id })}
            >
              <Text style={styles.quickSessionIcon}>
                {YOGA_STYLE_LABELS[session.style].icon}
              </Text>
              <Text style={[styles.quickSessionName, { color: colors.text }]} numberOfLines={1}>
                {session.name}
              </Text>
              <Text style={[styles.quickSessionDuration, { color: colors.textSecondary }]}>
                {session.duration} {t('yoga.min')}
              </Text>
              <View style={[styles.levelBadge, { backgroundColor: COLORS.purple + '20' }]}>
                <Text style={[styles.levelBadgeText, { color: COLORS.purple }]}>
                  {YOGA_LEVEL_LABELS[session.level].de}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Programs */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('yoga.programs')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('YogaProgramList')}>
            <Text style={[styles.seeAllText, { color: COLORS.purple }]}>{t('common.viewAll')}</Text>
          </TouchableOpacity>
        </View>

        {featuredPrograms.map((program) => (
          <TouchableOpacity
            key={program.id}
            style={[styles.programCard, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('YogaProgramDetail', { programId: program.id })}
          >
            <View style={styles.programContent}>
              <View style={styles.programBadges}>
                <View style={[styles.programBadge, { backgroundColor: COLORS.purple + '20' }]}>
                  <Text style={[styles.programBadgeText, { color: COLORS.purple }]}>
                    {YOGA_LEVEL_LABELS[program.level].de}
                  </Text>
                </View>
                {program.focus.slice(0, 2).map((focus) => (
                  <View key={focus} style={[styles.focusBadge, { backgroundColor: colors.background }]}>
                    <Text style={[styles.focusBadgeText, { color: colors.textSecondary }]}>
                      {YOGA_FOCUS_LABELS[focus].icon} {YOGA_FOCUS_LABELS[focus].de}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={[styles.programName, { color: colors.text }]}>{program.name}</Text>
              <Text style={[styles.programDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                {program.description}
              </Text>
              <View style={styles.programMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>{'📅'}</Text>
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    {program.durationWeeks} {t('yoga.weeks')}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={[styles.programArrow, { color: colors.textSecondary }]}>{'>'}</Text>
          </TouchableOpacity>
        ))}

        {/* All Sessions Button */}
        <TouchableOpacity
          style={[styles.allSessionsButton, { backgroundColor: colors.surface, borderColor: COLORS.purple }]}
          onPress={() => navigation.navigate('YogaSessionList')}
        >
          <Text style={[styles.allSessionsText, { color: COLORS.purple }]}>
            {t('yoga.allSessions')}
          </Text>
        </TouchableOpacity>

        {/* Benefits Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('yoga.benefits')}</Text>
        <View style={styles.benefitsGrid}>
          {[
            { icon: '🤸', title: t('yoga.benefitFlexibility'), desc: t('yoga.benefitFlexibilityDesc') },
            { icon: '💪', title: t('yoga.benefitStrength'), desc: t('yoga.benefitStrengthDesc') },
            { icon: '😌', title: t('yoga.benefitRelaxation'), desc: t('yoga.benefitRelaxationDesc') },
            { icon: '⚖️', title: t('yoga.benefitBalance'), desc: t('yoga.benefitBalanceDesc') },
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
              {t('yoga.videoDisclaimer')}
            </Text>
            <TouchableOpacity
              style={[styles.disclaimerButton, { backgroundColor: COLORS.purple }]}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
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
  seeAllText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
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
    color: COLORS.purple,
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
    backgroundColor: COLORS.purple,
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

  // Quick Sessions
  quickSessionsContainer: {
    paddingBottom: SPACING.md,
    marginBottom: SPACING.lg,
  },
  quickSessionCard: {
    width: 140,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  quickSessionIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  quickSessionName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  quickSessionDuration: {
    fontSize: FONT_SIZES.xs,
    marginBottom: SPACING.sm,
  },
  levelBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  levelBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },

  // Programs
  programCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  programContent: {
    flex: 1,
  },
  programBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  programBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  programBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  focusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  focusBadgeText: {
    fontSize: FONT_SIZES.xs,
  },
  programName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  programDescription: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  programMeta: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaIcon: {
    fontSize: 14,
  },
  metaText: {
    fontSize: FONT_SIZES.xs,
  },
  programArrow: {
    fontSize: FONT_SIZES.xl,
    marginLeft: SPACING.md,
  },
  allSessionsButton: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  allSessionsText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
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

  // Info Button & Disclaimer
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
});
