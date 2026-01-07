import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { useAICoachStore, ImportedChat } from '@/stores';
import { useTheme } from '@/contexts';
import { RootStackParamList } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AICoachScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const importedChats = useAICoachStore((state) => state.importedChats);
  const activeChat = useAICoachStore((state) => state.activeChat);
  const setActiveChat = useAICoachStore((state) => state.setActiveChat);
  const removeChat = useAICoachStore((state) => state.removeChat);

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
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

        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoTitle}>{t('aiCoach.howItWorks')}</Text>
          </View>
          <Text style={styles.infoText}>{t('aiCoach.howItWorksText')}</Text>
        </Card>

        <TouchableOpacity
          style={[styles.importButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('ChatGPTImport')}
        >
          <Text style={styles.importButtonIcon}>📥</Text>
          <View style={styles.importButtonContent}>
            <Text style={[styles.importButtonTitle, { color: colors.text }]}>{t('aiCoach.importFromChatGPT')}</Text>
            <Text style={[styles.importButtonSubtitle, { color: colors.textSecondary }]}>{t('aiCoach.importDescription')}</Text>
          </View>
          <Text style={[styles.importButtonArrow, { color: colors.primary }]}>→</Text>
        </TouchableOpacity>

        {importedChats.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('aiCoach.importedChats')}</Text>

            {importedChats.map((chat) => {
              const isActive = activeChat?.id === chat.id;

              return (
                <Card
                  key={chat.id}
                  style={[styles.chatCard, isActive && styles.chatCardActive]}
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

        {importedChats.length === 0 && (
          <Card style={styles.emptyCard}>
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
  infoCard: {
    backgroundColor: COLORS.primary + '10',
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
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
    color: COLORS.primary,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[700],
    lineHeight: 20,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    marginBottom: SPACING.xl,
  },
  importButtonIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  importButtonContent: {
    flex: 1,
  },
  importButtonTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  importButtonSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  importButtonArrow: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.primary,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
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
    color: COLORS.gray[900],
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
    color: COLORS.gray[500],
  },
  chatMessages: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
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
    borderTopColor: COLORS.gray[100],
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: COLORS.gray[100],
  },
  actionButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
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
    color: COLORS.gray[900],
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    textAlign: 'center',
    lineHeight: 20,
  },
});
