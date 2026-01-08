// /workspaces/claude-workspace/fitnessapp/src/screens/GuideScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { FLOATING_TAB_BAR_HEIGHT } from '@/components/navigation';
import { Card } from '@/components/common';
import { useTheme } from '@/contexts';
import { RootStackParamList } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface GuideCategory {
  id: string;
  icon: string;
  titleKey: string;
  descKey: string;
  gradient: [string, string];
  items: GuideItem[];
}

interface GuideItem {
  id: string;
  icon: string;
  titleKey: string;
  descKey: string;
}

const GUIDE_CATEGORIES: GuideCategory[] = [
  {
    id: 'sport',
    icon: '🏋️',
    titleKey: 'guide.sport.title',
    descKey: 'guide.sport.desc',
    gradient: ['#6366F1', '#8B5CF6'],
    items: [
      { id: 'training-basics', icon: '📚', titleKey: 'guide.sport.trainingBasics', descKey: 'guide.sport.trainingBasicsDesc' },
      { id: 'muscle-building', icon: '💪', titleKey: 'guide.sport.muscleBuilding', descKey: 'guide.sport.muscleBuildingDesc' },
      { id: 'fat-loss', icon: '🔥', titleKey: 'guide.sport.fatLoss', descKey: 'guide.sport.fatLossDesc' },
      { id: 'flexibility', icon: '🧘', titleKey: 'guide.sport.flexibility', descKey: 'guide.sport.flexibilityDesc' },
      { id: 'cardio', icon: '🏃', titleKey: 'guide.sport.cardio', descKey: 'guide.sport.cardioDesc' },
    ],
  },
  {
    id: 'health',
    icon: '❤️',
    titleKey: 'guide.health.title',
    descKey: 'guide.health.desc',
    gradient: ['#EF4444', '#F97316'],
    items: [
      { id: 'sleep', icon: '😴', titleKey: 'guide.health.sleep', descKey: 'guide.health.sleepDesc' },
      { id: 'stress', icon: '🧠', titleKey: 'guide.health.stress', descKey: 'guide.health.stressDesc' },
      { id: 'recovery', icon: '🛁', titleKey: 'guide.health.recovery', descKey: 'guide.health.recoveryDesc' },
      { id: 'hydration', icon: '💧', titleKey: 'guide.health.hydration', descKey: 'guide.health.hydrationDesc' },
    ],
  },
  {
    id: 'nutrition',
    icon: '🥗',
    titleKey: 'guide.nutrition.title',
    descKey: 'guide.nutrition.desc',
    gradient: ['#10B981', '#34D399'],
    items: [
      { id: 'macros', icon: '📊', titleKey: 'guide.nutrition.macros', descKey: 'guide.nutrition.macrosDesc' },
      { id: 'protein', icon: '🥩', titleKey: 'guide.nutrition.protein', descKey: 'guide.nutrition.proteinDesc' },
      { id: 'supplements', icon: '💊', titleKey: 'guide.nutrition.supplements', descKey: 'guide.nutrition.supplementsDesc' },
      { id: 'meal-timing', icon: '⏰', titleKey: 'guide.nutrition.mealTiming', descKey: 'guide.nutrition.mealTimingDesc' },
    ],
  },
];

export const GuideScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const handleCategoryPress = (category: GuideCategory) => {
    // TODO: Navigate to category detail screen
  };

  const handleItemPress = (item: GuideItem) => {
    // TODO: Navigate to guide article screen
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
          <Text style={[styles.title, { color: colors.text }]}>{t('guide.title')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('guide.subtitle')}</Text>
        </View>

        {/* Guide Categories */}
        {GUIDE_CATEGORIES.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            {/* Category Header Card */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleCategoryPress(category)}
            >
              <LinearGradient
                colors={category.gradient}
                style={styles.categoryCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <View style={styles.categoryContent}>
                  <Text style={styles.categoryTitle}>{t(category.titleKey)}</Text>
                  <Text style={styles.categoryDesc}>{t(category.descKey)}</Text>
                </View>
                <Text style={styles.categoryArrow}>›</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Category Items */}
            <View style={styles.itemsContainer}>
              {category.items.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.itemCard,
                    { backgroundColor: colors.card },
                    index === category.items.length - 1 && styles.itemCardLast,
                  ]}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.itemIcon}>{item.icon}</Text>
                  <View style={styles.itemContent}>
                    <Text style={[styles.itemTitle, { color: colors.text }]}>
                      {t(item.titleKey)}
                    </Text>
                    <Text style={[styles.itemDesc, { color: colors.textSecondary }]} numberOfLines={1}>
                      {t(item.descKey)}
                    </Text>
                  </View>
                  <Text style={[styles.itemArrow, { color: colors.textTertiary }]}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Coming Soon Note */}
        <Card style={styles.comingSoonCard}>
          <Text style={styles.comingSoonIcon}>🚀</Text>
          <Text style={[styles.comingSoonTitle, { color: colors.text }]}>
            {t('guide.comingSoon')}
          </Text>
          <Text style={[styles.comingSoonText, { color: colors.textSecondary }]}>
            {t('guide.comingSoonDesc')}
          </Text>
        </Card>

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
  categorySection: {
    marginBottom: SPACING.xl,
  },
  categoryCard: {
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 40,
    marginRight: SPACING.md,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
  categoryDesc: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  categoryArrow: {
    fontSize: 28,
    color: COLORS.white,
    opacity: 0.6,
  },
  itemsContainer: {
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xs,
  },
  itemCardLast: {
    marginBottom: 0,
  },
  itemIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  itemDesc: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  itemArrow: {
    fontSize: 20,
  },
  comingSoonCard: {
    marginHorizontal: SPACING.lg,
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  comingSoonIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  comingSoonTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  comingSoonText: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: SPACING['3xl'],
  },
});
