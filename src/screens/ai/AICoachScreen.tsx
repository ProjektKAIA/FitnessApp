// /workspaces/claude-workspace/fitnessapp/src/screens/ai/AICoachScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { chatGPTExportService, ParsedConversation } from '@/services/ai';
import { useAICoachStore, ImportedChat } from '@/stores';
import { useTheme } from '@/contexts';
import { RootStackParamList } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AICoachScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  // Store
  const importedChats = useAICoachStore((state) => state.importedChats);
  const activeChat = useAICoachStore((state) => state.activeChat);
  const setActiveChat = useAICoachStore((state) => state.setActiveChat);
  const removeChat = useAICoachStore((state) => state.removeChat);
  const addImportedChat = useAICoachStore((state) => state.addImportedChat);

  // Import state
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<ParsedConversation[]>([]);
  const [showFitnessOnly, setShowFitnessOnly] = useState(true);

  const handleActivateChat = (chat: ImportedChat) => {
    setActiveChat(chat.id);
  };

  const handleRemoveChat = (chat: ImportedChat) => {
    Alert.alert(
      t('aiCoach.removeChat'),
      t('aiCoach.removeChatConfirm', { title: chat.title }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => removeChat(chat.id),
        },
      ]
    );
  };

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

    // Clear conversations list after import
    setConversations([]);

    Alert.alert(
      t('aiCoach.importSuccess'),
      t('aiCoach.chatImported', { title: conversation.title })
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
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatDateShort = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backButtonText, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('aiCoach.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('aiCoach.subtitle')}</Text>

        {/* Info Card */}
        <Card style={[styles.infoCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={[styles.infoTitle, { color: colors.primary }]}>{t('aiCoach.howItWorks')}</Text>
          </View>
          <Text style={[styles.infoText, { color: isDark ? colors.textSecondary : COLORS.gray[700] }]}>
            {t('aiCoach.howItWorksText')}
          </Text>
        </Card>

        {/* Import Section */}
        <Card style={[styles.instructionCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.instructionTitle, { color: colors.text }]}>{t('aiCoach.howToExport')}</Text>
          <View style={styles.stepContainer}>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={[styles.stepText, { color: colors.textSecondary }]}>{t('aiCoach.step1')}</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={[styles.stepText, { color: colors.textSecondary }]}>{t('aiCoach.step2')}</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={[styles.stepText, { color: colors.textSecondary }]}>{t('aiCoach.step3')}</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>4</Text>
              <Text style={[styles.stepText, { color: colors.textSecondary }]}>{t('aiCoach.step4')}</Text>
            </View>
          </View>

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
        </Card>

        {/* Found Conversations */}
        {conversations.length > 0 && (
          <>
            <View style={styles.filterRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('aiCoach.foundConversations', { count: displayedConversations.length })}
              </Text>
              <TouchableOpacity
                style={[styles.filterButton, { backgroundColor: colors.surfaceElevated }, showFitnessOnly && styles.filterButtonActive]}
                onPress={() => setShowFitnessOnly(!showFitnessOnly)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    { color: colors.textSecondary },
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
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('aiCoach.noFitnessChats')}</Text>
                <TouchableOpacity onPress={() => setShowFitnessOnly(false)}>
                  <Text style={[styles.showAllLink, { color: colors.primary }]}>{t('aiCoach.showAllChats')}</Text>
                </TouchableOpacity>
              </Card>
            ) : (
              displayedConversations.map((conversation) => {
                const imported = isAlreadyImported(conversation.id);

                return (
                  <TouchableOpacity
                    key={conversation.id}
                    style={[styles.conversationCard, { backgroundColor: colors.card }, imported && styles.conversationCardImported]}
                    onPress={() => !imported && handleSelectConversation(conversation)}
                    disabled={imported}
                  >
                    <View style={styles.conversationHeader}>
                      <Text style={[styles.conversationTitle, { color: colors.text }]} numberOfLines={1}>
                        {conversation.title}
                      </Text>
                      {imported && (
                        <View style={styles.importedBadge}>
                          <Text style={styles.importedBadgeText}>{t('aiCoach.imported')}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.conversationPreview, { color: colors.textSecondary }]} numberOfLines={2}>
                      {conversation.preview}
                    </Text>
                    <View style={styles.conversationMeta}>
                      <Text style={[styles.conversationDate, { color: colors.textTertiary }]}>
                        {formatDateShort(conversation.updatedAt)}
                      </Text>
                      <Text style={[styles.conversationCount, { color: colors.textTertiary }]}>
                        {t('aiCoach.messageCount', { count: conversation.messageCount })}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </>
        )}

        {/* Imported Chats */}
        {importedChats.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: SPACING.xl }]}>
              {t('aiCoach.importedChats')}
            </Text>

            {importedChats.map((chat) => {
              const isActive = activeChat?.id === chat.id;

              return (
                <Card
                  key={chat.id}
                  style={[styles.chatCard, { backgroundColor: colors.card }, isActive && styles.chatCardActive]}
                >
                  <TouchableOpacity
                    style={styles.chatContent}
                    onPress={() => handleActivateChat(chat)}
                  >
                    <View style={styles.chatHeader}>
                      <Text style={[styles.chatTitle, { color: colors.text }]} numberOfLines={1}>
                        {chat.title}
                      </Text>
                      {isActive && (
                        <View style={styles.activeBadge}>
                          <Text style={styles.activeBadgeText}>{t('aiCoach.active')}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.chatMeta, { color: colors.textSecondary }]}>
                      {t('aiCoach.importedOn', { date: formatDate(chat.importedAt) })}
                    </Text>
                    <Text style={[styles.chatMessages, { color: colors.textTertiary }]}>
                      {t('aiCoach.messageCount', { count: chat.messages.length })}
                    </Text>

                    {chat.extractedPlan && (
                      <View style={styles.planBadge}>
                        <Text style={styles.planBadgeIcon}>📋</Text>
                        <Text style={styles.planBadgeText}>{t('aiCoach.hasPlan')}</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <View style={[styles.chatActions, { borderTopColor: colors.border }]}>
                    <TouchableOpacity
                      style={[styles.actionButton, { borderRightColor: colors.border }]}
                      onPress={() => navigation.navigate('ChatDetail', { chatId: chat.id })}
                    >
                      <Text style={[styles.actionButtonText, { color: colors.primary }]}>{t('aiCoach.viewChat')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleRemoveChat(chat)}
                    >
                      <Text style={styles.deleteButtonText}>{t('common.delete')}</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              );
            })}
          </>
        )}

        {/* Empty State */}
        {importedChats.length === 0 && conversations.length === 0 && (
          <Card style={[styles.emptyCard, { backgroundColor: colors.card }]}>
            <Text style={styles.emptyIcon}>🤖</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('aiCoach.noChatsYet')}</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('aiCoach.noChatsDescription')}</Text>
          </Card>
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
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
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  infoCard: {
    borderWidth: 1,
    marginBottom: SPACING.lg,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  infoTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  instructionCard: {
    marginBottom: SPACING.xl,
  },
  instructionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  stepContainer: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
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
    overflow: 'hidden',
  },
  stepText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
  },
  importButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
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
  filterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: FONT_SIZES.sm,
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  conversationCard: {
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
    marginBottom: SPACING.sm,
  },
  conversationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  conversationDate: {
    fontSize: FONT_SIZES.xs,
  },
  conversationCount: {
    fontSize: FONT_SIZES.xs,
  },
  chatCard: {
    marginBottom: SPACING.md,
    padding: 0,
    overflow: 'hidden',
  },
  chatCardActive: {
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  chatContent: {
    padding: SPACING.lg,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  chatTitle: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  activeBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  activeBadgeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: '600',
  },
  chatMeta: {
    fontSize: FONT_SIZES.sm,
  },
  chatMessages: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent + '20',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.sm,
  },
  planBadgeIcon: {
    fontSize: 14,
    marginRight: SPACING.xs,
  },
  planBadgeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.accent,
    fontWeight: '500',
  },
  chatActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRightWidth: 1,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  deleteButton: {
    borderRightWidth: 0,
  },
  deleteButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.accent,
    fontWeight: '500',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: SPACING['2xl'],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  showAllLink: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
  },
});
