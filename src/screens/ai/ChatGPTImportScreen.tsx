import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { chatGPTExportService, ParsedConversation } from '@/services/ai';
import { useAICoachStore } from '@/stores';
import { RootStackParamList } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ChatGPTImportScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<ParsedConversation[]>([]);
  const [showFitnessOnly, setShowFitnessOnly] = useState(true);
  const addImportedChat = useAICoachStore((state) => state.addImportedChat);
  const importedChats = useAICoachStore((state) => state.importedChats);

  const handlePickFile = async () => {
    setIsLoading(true);
    try {
      const result = await chatGPTExportService.pickAndImportFile();

      if (!result.success) {
        Alert.alert(t('aiCoach.importError'), result.error || t('aiCoach.unknownError'));
        return;
      }

      if (result.conversations) {
        setConversations(result.conversations);
      }
    } catch (error) {
      Alert.alert(
        t('aiCoach.importError'),
        error instanceof Error ? error.message : t('aiCoach.unknownError')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = (conversation: ParsedConversation) => {
    const extractedPlan = chatGPTExportService.extractWorkoutPlan(conversation);
    addImportedChat(conversation, extractedPlan || undefined);

    Alert.alert(
      t('aiCoach.importSuccess'),
      t('aiCoach.chatImported', { title: conversation.title }),
      [
        {
          text: t('common.ok'),
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const displayedConversations = showFitnessOnly
    ? chatGPTExportService.filterFitnessConversations(conversations)
    : conversations;

  const isAlreadyImported = (convId: string) =>
    importedChats.some((chat) => chat.id === convId);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('aiCoach.importTitle')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>{t('aiCoach.importSubtitle')}</Text>

        <Card style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>{t('aiCoach.howToExport')}</Text>
          <View style={styles.stepContainer}>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>{t('aiCoach.step1')}</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>{t('aiCoach.step2')}</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>{t('aiCoach.step3')}</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>4</Text>
              <Text style={styles.stepText}>{t('aiCoach.step4')}</Text>
            </View>
          </View>
        </Card>

        <TouchableOpacity
          style={[styles.importButton, isLoading && styles.importButtonDisabled]}
          onPress={handlePickFile}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Text style={styles.importButtonIcon}>📂</Text>
              <Text style={styles.importButtonText}>{t('aiCoach.selectFile')}</Text>
            </>
          )}
        </TouchableOpacity>

        {conversations.length > 0 && (
          <>
            <View style={styles.filterRow}>
              <Text style={styles.conversationsTitle}>
                {t('aiCoach.foundConversations', { count: displayedConversations.length })}
              </Text>
              <TouchableOpacity
                style={[styles.filterButton, showFitnessOnly && styles.filterButtonActive]}
                onPress={() => setShowFitnessOnly(!showFitnessOnly)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    showFitnessOnly && styles.filterButtonTextActive,
                  ]}
                >
                  {t('aiCoach.fitnessOnly')}
                </Text>
              </TouchableOpacity>
            </View>

            {displayedConversations.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyText}>{t('aiCoach.noFitnessChats')}</Text>
                <TouchableOpacity onPress={() => setShowFitnessOnly(false)}>
                  <Text style={styles.showAllLink}>{t('aiCoach.showAllChats')}</Text>
                </TouchableOpacity>
              </Card>
            ) : (
              displayedConversations.map((conversation) => {
                const imported = isAlreadyImported(conversation.id);

                return (
                  <TouchableOpacity
                    key={conversation.id}
                    style={[styles.conversationCard, imported && styles.conversationCardImported]}
                    onPress={() => !imported && handleSelectConversation(conversation)}
                    disabled={imported}
                  >
                    <View style={styles.conversationHeader}>
                      <Text style={styles.conversationTitle} numberOfLines={1}>
                        {conversation.title}
                      </Text>
                      {imported && (
                        <View style={styles.importedBadge}>
                          <Text style={styles.importedBadgeText}>{t('aiCoach.imported')}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.conversationPreview} numberOfLines={2}>
                      {conversation.preview}
                    </Text>
                    <View style={styles.conversationMeta}>
                      <Text style={styles.conversationDate}>
                        {formatDate(conversation.updatedAt)}
                      </Text>
                      <Text style={styles.conversationCount}>
                        {t('aiCoach.messageCount', { count: conversation.messageCount })}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.gray[100],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.primary,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[500],
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  instructionCard: {
    marginBottom: SPACING.xl,
  },
  instructionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
  },
  stepContainer: {
    gap: SPACING.sm,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: SPACING.sm,
  },
  stepText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[700],
  },
  importButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  importButtonDisabled: {
    opacity: 0.7,
  },
  importButtonIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  importButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  conversationsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  filterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.gray[200],
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[700],
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: SPACING['2xl'],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  showAllLink: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primary,
    fontWeight: '500',
  },
  conversationCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  conversationCardImported: {
    opacity: 0.6,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  conversationTitle: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  importedBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  importedBadgeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: '500',
  },
  conversationPreview: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginBottom: SPACING.sm,
  },
  conversationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  conversationDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[400],
  },
  conversationCount: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[400],
  },
});
