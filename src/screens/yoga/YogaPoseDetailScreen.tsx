// /workspaces/claude-workspace/fitnessapp/src/screens/yoga/YogaPoseDetailScreen.tsx

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
  getYogaPoseById,
  YOGA_LEVEL_LABELS,
  YOGA_FOCUS_LABELS,
} from '@/data/yogaLibrary';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'YogaPoseDetail'>;

export const YogaPoseDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();

  const pose = getYogaPoseById(route.params.poseId);

  if (!pose) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>{t('yoga.poseNotFound')}</Text>
      </SafeAreaView>
    );
  }

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
          {pose.name}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Pose Hero */}
        <View style={[styles.heroCard, { backgroundColor: COLORS.purple }]}>
          <Text style={styles.heroIcon}>{'🧘'}</Text>
          <Text style={styles.heroName}>{pose.name}</Text>
          <Text style={styles.heroNameEn}>{pose.nameEn}</Text>
          {pose.sanskritName && (
            <Text style={styles.heroSanskrit}>{pose.sanskritName}</Text>
          )}
          <View style={styles.heroBadges}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{YOGA_LEVEL_LABELS[pose.level].de}</Text>
            </View>
            {pose.holdTime && (
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>{'⏱️'} {pose.holdTime}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('yoga.description')}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{pose.description}</Text>
        </View>

        {/* Focus Areas */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('yoga.focusAreas')}</Text>
          <View style={styles.focusContainer}>
            {pose.focus.map((focus) => (
              <View key={focus} style={[styles.focusItem, { backgroundColor: COLORS.purple + '20' }]}>
                <Text style={styles.focusIcon}>{YOGA_FOCUS_LABELS[focus].icon}</Text>
                <Text style={[styles.focusText, { color: COLORS.purple }]}>
                  {YOGA_FOCUS_LABELS[focus].de}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Instructions */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('yoga.instructions')}</Text>
          {pose.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={[styles.instructionNumberText, { color: COLORS.purple }]}>{index + 1}</Text>
              </View>
              <Text style={[styles.instructionText, { color: colors.text }]}>{instruction}</Text>
            </View>
          ))}
        </View>

        {/* Benefits */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {'✨'} {t('yoga.benefits')}
          </Text>
          {pose.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Text style={styles.bulletPoint}>{'•'}</Text>
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Modifications */}
        {pose.modifications && pose.modifications.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {'💡'} {t('yoga.modifications')}
            </Text>
            {pose.modifications.map((mod, index) => (
              <View key={index} style={styles.modItem}>
                <Text style={styles.bulletPoint}>{'•'}</Text>
                <Text style={[styles.modText, { color: colors.textSecondary }]}>{mod}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Contraindications */}
        {pose.contraindications && pose.contraindications.length > 0 && (
          <View style={[styles.section, { backgroundColor: COLORS.error + '10' }]}>
            <Text style={[styles.sectionTitle, { color: COLORS.error }]}>
              {'⚠️'} {t('yoga.contraindications')}
            </Text>
            {pose.contraindications.map((contra, index) => (
              <View key={index} style={styles.contraItem}>
                <Text style={styles.bulletPoint}>{'•'}</Text>
                <Text style={[styles.contraText, { color: COLORS.error }]}>{contra}</Text>
              </View>
            ))}
          </View>
        )}
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
  heroCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  heroIcon: {
    fontSize: 56,
    marginBottom: SPACING.md,
  },
  heroName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
  },
  heroNameEn: {
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: SPACING.xs,
  },
  heroSanskrit: {
    fontSize: FONT_SIZES.sm,
    fontStyle: 'italic',
    color: COLORS.white,
    opacity: 0.7,
    marginBottom: SPACING.md,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  heroBadge: {
    backgroundColor: COLORS.overlay.light,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  heroBadgeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  section: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZES.base,
    lineHeight: 24,
  },
  focusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  focusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
  },
  focusIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  focusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.purple + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginTop: 2,
  },
  instructionNumberText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  instructionText: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    lineHeight: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  bulletPoint: {
    fontSize: FONT_SIZES.lg,
    marginRight: SPACING.sm,
    color: COLORS.purple,
  },
  benefitText: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    lineHeight: 22,
  },
  modItem: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  modText: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    lineHeight: 22,
  },
  contraItem: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  contraText: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    lineHeight: 22,
  },
});
