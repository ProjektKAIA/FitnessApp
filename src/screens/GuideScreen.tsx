// /workspaces/claude-workspace/fitnessapp/src/screens/GuideScreen.tsx

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

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { FLOATING_TAB_BAR_HEIGHT } from '@/components/navigation';
import { Card } from '@/components/common';
import { useTheme } from '@/contexts';
import { RootStackParamList } from '@/types';
import { GUIDE_ARTICLES } from '@/data/guideContent';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface GuideCategory {
  id: string;
  titleKey: string;
  descKey: string;
  image: string;
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
    titleKey: 'guide.sport.title',
    descKey: 'guide.sport.desc',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
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
    titleKey: 'guide.health.title',
    descKey: 'guide.health.desc',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    items: [
      { id: 'sleep', icon: '😴', titleKey: 'guide.health.sleep', descKey: 'guide.health.sleepDesc' },
      { id: 'stress', icon: '🧠', titleKey: 'guide.health.stress', descKey: 'guide.health.stressDesc' },
      { id: 'recovery', icon: '🛁', titleKey: 'guide.health.recovery', descKey: 'guide.health.recoveryDesc' },
      { id: 'hydration', icon: '💧', titleKey: 'guide.health.hydration', descKey: 'guide.health.hydrationDesc' },
    ],
  },
  {
    id: 'nutrition',
    titleKey: 'guide.nutrition.title',
    descKey: 'guide.nutrition.desc',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    items: [
      { id: 'macros', icon: '📊', titleKey: 'guide.nutrition.macros', descKey: 'guide.nutrition.macrosDesc' },
      { id: 'protein', icon: '🥩', titleKey: 'guide.nutrition.protein', descKey: 'guide.nutrition.proteinDesc' },
      { id: 'supplements', icon: '💊', titleKey: 'guide.nutrition.supplements', descKey: 'guide.nutrition.supplementsDesc' },
      { id: 'meal-timing', icon: '⏰', titleKey: 'guide.nutrition.mealTiming', descKey: 'guide.nutrition.mealTimingDesc' },
    ],
  },
];

// Check if an article is available (has content)
const isArticleAvailable = (articleId: string): boolean => {
  return articleId in GUIDE_ARTICLES;
};

export const GuideScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const handleCategoryPress = (category: GuideCategory) => {
    // Navigate to first available item in category
    const availableItem = category.items.find((item) => isArticleAvailable(item.id));
    if (availableItem) {
      handleItemPress(availableItem);
    }
  };

  const handleItemPress = (item: GuideItem) => {
    if (isArticleAvailable(item.id)) {
      navigation.navigate('GuideArticle', { articleId: item.id });
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
              style={styles.categoryCardWrapper}
            >
              <ImageBackground
                source={{ uri: category.image }}
                style={styles.categoryCard}
                imageStyle={styles.categoryCardImage}
              >
                <LinearGradient
                  colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                  style={styles.categoryCardOverlay}
                >
                  <View style={styles.categoryContent}>
                    <Text style={styles.categoryTitle}>{t(category.titleKey)}</Text>
                    <Text style={styles.categoryDesc}>{t(category.descKey)}</Text>
                  </View>
                  <Text style={styles.categoryArrow}>›</Text>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>

            {/* Category Items */}
            <View style={styles.itemsContainer}>
              {category.items.map((item, index) => {
                const isAvailable = isArticleAvailable(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.itemCard,
                      { backgroundColor: colors.card },
                      index === category.items.length - 1 && styles.itemCardLast,
                      !isAvailable && styles.itemCardDisabled,
                    ]}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={isAvailable ? 0.7 : 1}
                    disabled={!isAvailable}
                  >
                    <Text style={[styles.itemIcon, !isAvailable && styles.itemIconDisabled]}>
                      {item.icon}
                    </Text>
                    <View style={styles.itemContent}>
                      <Text style={[
                        styles.itemTitle,
                        { color: isAvailable ? colors.text : colors.textTertiary },
                      ]}>
                        {t(item.titleKey)}
                      </Text>
                      <Text
                        style={[
                          styles.itemDesc,
                          { color: isAvailable ? colors.textSecondary : colors.textTertiary },
                        ]}
                        numberOfLines={1}
                      >
                        {isAvailable ? t(item.descKey) : t('guide.comingSoon')}
                      </Text>
                    </View>
                    {isAvailable ? (
                      <Text style={[styles.itemArrow, { color: colors.textTertiary }]}>›</Text>
                    ) : (
                      <View style={styles.comingSoonBadge}>
                        <Text style={styles.comingSoonBadgeText}>Soon</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
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
  categoryCardWrapper: {
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  categoryCard: {
    height: 120,
  },
  categoryCardImage: {
    borderRadius: BORDER_RADIUS.xl,
  },
  categoryCardOverlay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
  categoryDesc: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  categoryArrow: {
    fontSize: 32,
    color: COLORS.white,
    opacity: 0.8,
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
  itemCardDisabled: {
    opacity: 0.5,
  },
  itemIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  itemIconDisabled: {
    opacity: 0.5,
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
  comingSoonBadge: {
    backgroundColor: COLORS.gray[200],
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  comingSoonBadgeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    fontWeight: '500',
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
