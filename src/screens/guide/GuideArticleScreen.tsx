// /workspaces/claude-workspace/fitnessapp/src/screens/guide/GuideArticleScreen.tsx

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Clock, ExternalLink, BookOpen } from 'lucide-react-native';

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { useTheme } from '@/contexts';
import { RootStackParamList } from '@/types';
import { getGuideArticle, IGuideSection, IGuideSource } from '@/data/guideContent';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type GuideArticleRouteProp = RouteProp<RootStackParamList, 'GuideArticle'>;

export const GuideArticleScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<GuideArticleRouteProp>();

  const { articleId } = route.params;
  const article = getGuideArticle(articleId);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSourcePress = useCallback((url: string) => {
    Linking.openURL(url);
  }, []);

  if (!article) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            {t('guide.articleNotFound')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderTextWithFormatting = (text: string, sectionId: string, pIndex: number) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, partIndex) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text
            key={`${sectionId}-p-${pIndex}-part-${partIndex}`}
            style={[styles.boldText, { color: colors.text }]}
          >
            {part.slice(2, -2)}
          </Text>
        );
      }
      return part;
    });
  };

  const renderSection = (section: IGuideSection, index: number) => {
    const paragraphs = section.content.split('\n\n');

    return (
      <Card key={section.id} style={styles.sectionCard}>
        <View style={[styles.sectionHeader, { borderBottomColor: colors.border }]}>
          <View style={[styles.sectionNumber, { backgroundColor: colors.primary }]}>
            <Text style={styles.sectionNumberText}>{index + 1}</Text>
          </View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t(section.titleKey)}
          </Text>
        </View>
        <View style={styles.sectionContent}>
          {paragraphs.map((paragraph, pIndex) => {
            // Check if paragraph is a list (starts with •)
            const lines = paragraph.split('\n');
            const isList = lines.every(line => line.trim().startsWith('•') || line.trim() === '');

            if (isList && lines.some(line => line.trim().startsWith('•'))) {
              return (
                <View key={`${section.id}-list-${pIndex}`} style={styles.listContainer}>
                  {lines.filter(line => line.trim().startsWith('•')).map((line, lineIndex) => {
                    const bulletText = line.trim().substring(2);
                    return (
                      <View key={`${section.id}-bullet-${pIndex}-${lineIndex}`} style={styles.bulletRow}>
                        <View style={[styles.bulletPoint, { backgroundColor: colors.primary }]} />
                        <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                          {renderTextWithFormatting(bulletText, section.id, pIndex * 100 + lineIndex)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            }

            // Check if it's a heading (starts with **)
            const isHeading = paragraph.startsWith('**') && paragraph.indexOf('**', 2) === paragraph.length - 2;
            if (isHeading) {
              return (
                <Text
                  key={`${section.id}-heading-${pIndex}`}
                  style={[styles.subHeading, { color: colors.text }]}
                >
                  {paragraph.slice(2, -2)}
                </Text>
              );
            }

            // Regular paragraph
            return (
              <Text
                key={`${section.id}-p-${pIndex}`}
                style={[styles.paragraph, { color: colors.textSecondary }]}
              >
                {renderTextWithFormatting(paragraph, section.id, pIndex)}
              </Text>
            );
          })}
        </View>
      </Card>
    );
  };

  const renderSource = (source: IGuideSource, index: number) => (
    <TouchableOpacity
      key={`source-${index}`}
      style={[styles.sourceItem, { backgroundColor: colors.card }]}
      onPress={() => handleSourcePress(source.url)}
      activeOpacity={0.7}
    >
      <View style={styles.sourceContent}>
        <Text style={[styles.sourceTitle, { color: colors.text }]} numberOfLines={2}>
          {source.title}
        </Text>
        {source.institution && (
          <Text style={[styles.sourceInstitution, { color: colors.textTertiary }]}>
            {source.institution}
          </Text>
        )}
      </View>
      <ExternalLink size={18} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>{article.icon}</Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t(article.titleKey)}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t(article.subtitleKey)}
          </Text>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            <View style={[styles.metaItem, { backgroundColor: colors.card }]}>
              <Clock size={14} color={colors.textTertiary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {article.readingTime} min
              </Text>
            </View>
            <View style={[styles.metaItem, { backgroundColor: colors.card }]}>
              <BookOpen size={14} color={colors.textTertiary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {article.sections.length} {t('guide.sections')}
              </Text>
            </View>
          </View>
        </View>

        {/* Article Content */}
        <View style={styles.articleContent}>
          {article.sections.map((section, index) => renderSection(section, index))}
        </View>

        {/* Sources Section */}
        <View style={styles.sourcesSection}>
          <Text style={[styles.sourcesTitle, { color: colors.text }]}>
            {t('guide.sources')}
          </Text>
          <Text style={[styles.sourcesSubtitle, { color: colors.textSecondary }]}>
            {t('guide.sourcesDescription')}
          </Text>
          <View style={styles.sourcesList}>
            {article.sources.map((source, index) => renderSource(source, index))}
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: SPACING.xs,
    marginLeft: -SPACING.xs,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 32,
  },
  headerPlaceholder: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING['3xl'],
  },
  titleSection: {
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  metaText: {
    fontSize: FONT_SIZES.sm,
  },
  articleContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  sectionCard: {
    padding: 0,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    gap: SPACING.sm,
  },
  sectionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionNumberText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    flex: 1,
  },
  sectionContent: {
    padding: SPACING.md,
  },
  subHeading: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  paragraph: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  boldText: {
    fontWeight: '600',
  },
  listContainer: {
    marginVertical: SPACING.xs,
    paddingLeft: SPACING.xs,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
    paddingRight: SPACING.sm,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: SPACING.sm,
  },
  bulletText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  sourcesSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    marginTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  sourcesTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  sourcesSubtitle: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.md,
  },
  sourcesList: {
    gap: SPACING.sm,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.md,
  },
  sourceContent: {
    flex: 1,
  },
  sourceTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    marginBottom: 2,
  },
  sourceInstitution: {
    fontSize: FONT_SIZES.xs,
  },
  bottomSpacing: {
    height: SPACING['3xl'],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FONT_SIZES.base,
  },
});
