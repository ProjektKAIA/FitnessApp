// /workspaces/claude-workspace/fitnessapp/src/screens/yoga/YogaSessionDetailScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { useTheme } from '@/contexts';
import { RootStackParamList } from '@/types';
import {
  getYogaSessionById,
  getYogaPoseById,
  YOGA_STYLE_LABELS,
  YOGA_LEVEL_LABELS,
  YOGA_FOCUS_LABELS,
} from '@/data/yogaLibrary';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'YogaSessionDetail'>;

export const YogaSessionDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();

  const session = getYogaSessionById(route.params.sessionId);

  if (!session) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>{t('yoga.sessionNotFound')}</Text>
      </SafeAreaView>
    );
  }

  const totalDuration = session.poses.reduce((sum, p) => sum + p.duration, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backIcon, { color: colors.text }]}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {session.name}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Session Info */}
        <View style={[styles.infoCard, { backgroundColor: COLORS.purple }]}>
          <Text style={styles.sessionIcon}>
            {YOGA_STYLE_LABELS[session.style].icon}
          </Text>
          <Text style={styles.sessionName}>{session.name}</Text>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{YOGA_STYLE_LABELS[session.style].de}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{YOGA_LEVEL_LABELS[session.level].de}</Text>
            </View>
          </View>
          <Text style={styles.sessionDescription}>{session.description}</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{session.duration}</Text>
              <Text style={styles.statLabel}>{t('yoga.min')}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{session.poses.length}</Text>
              <Text style={styles.statLabel}>{t('yoga.poses')}</Text>
            </View>
          </View>
        </View>

        {/* Focus Areas */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('yoga.focusAreas')}</Text>
        <View style={styles.focusContainer}>
          {session.focus.map((focus) => (
            <View key={focus} style={[styles.focusItem, { backgroundColor: colors.surface }]}>
              <Text style={styles.focusIcon}>{YOGA_FOCUS_LABELS[focus].icon}</Text>
              <Text style={[styles.focusText, { color: colors.text }]}>
                {YOGA_FOCUS_LABELS[focus].de}
              </Text>
            </View>
          ))}
        </View>

        {/* Poses */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('yoga.poseSequence')}</Text>
        {session.poses.map((sessionPose, index) => {
          const pose = getYogaPoseById(sessionPose.poseId);
          if (!pose) return null;

          return (
            <TouchableOpacity
              key={`${sessionPose.poseId}-${index}`}
              style={[styles.poseCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('YogaPoseDetail', { poseId: pose.id })}
            >
              <View style={styles.poseNumber}>
                <Text style={[styles.poseNumberText, { color: COLORS.purple }]}>{index + 1}</Text>
              </View>
              <View style={styles.poseContent}>
                <Text style={[styles.poseName, { color: colors.text }]}>{pose.name}</Text>
                {pose.sanskritName && (
                  <Text style={[styles.poseSanskrit, { color: colors.textSecondary }]}>
                    {pose.sanskritName}
                  </Text>
                )}
                <View style={styles.poseMeta}>
                  <Text style={[styles.poseDuration, { color: COLORS.purple }]}>
                    {'⏱️'} {Math.round(sessionPose.duration / 60)} {t('yoga.min')}
                  </Text>
                  {sessionPose.side && (
                    <Text style={[styles.poseSide, { color: colors.textSecondary }]}>
                      {sessionPose.side === 'both' ? t('yoga.bothSides') :
                       sessionPose.side === 'left' ? t('yoga.leftSide') : t('yoga.rightSide')}
                    </Text>
                  )}
                </View>
              </View>
              <Text style={[styles.poseArrow, { color: colors.textSecondary }]}>{'>'}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Start Button */}
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: COLORS.purple }]}
          onPress={() => navigation.navigate('YogaSessionActive', { sessionId: session.id })}
        >
          <Text style={styles.startButtonText}>{t('yoga.startSession')}</Text>
        </TouchableOpacity>
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.md,
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
  errorText: {
    textAlign: 'center',
    marginTop: SPACING['4xl'],
    fontSize: FONT_SIZES.lg,
  },
  infoCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
  },
  sessionIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  sessionName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  badges: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  badge: {
    backgroundColor: COLORS.overlay.light,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  badgeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  sessionDescription: {
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING['3xl'],
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  focusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  focusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  focusIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  focusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  poseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  poseNumber: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.purple + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  poseNumberText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  poseContent: {
    flex: 1,
  },
  poseName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  poseSanskrit: {
    fontSize: FONT_SIZES.sm,
    fontStyle: 'italic',
    marginBottom: SPACING.xs,
  },
  poseMeta: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  poseDuration: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
  poseSide: {
    fontSize: FONT_SIZES.xs,
  },
  poseArrow: {
    fontSize: FONT_SIZES.lg,
    marginLeft: SPACING.sm,
  },
  startButton: {
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    marginTop: SPACING.lg,
    ...SHADOWS.md,
  },
  startButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.white,
  },
});
