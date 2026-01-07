import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { useAICoachStore } from '@/stores';
import { useTheme } from '@/contexts';
import { RootStackParamList } from '@/types';

type ChatDetailRouteProp = RouteProp<RootStackParamList, 'ChatDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ChatDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ChatDetailRouteProp>();
  const { chatId } = route.params;
  const importedChats = useAICoachStore((state) => state.importedChats);

  const chat = importedChats.find((c) => c.id === chatId);

  if (!chat) {
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
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: colors.textSecondary }]}>{t('aiCoach.chatNotFound')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatTime = (date: Date | null) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('de-DE', {
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
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>{chat.title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.messageCount, { color: colors.textSecondary }]}>
          {t('aiCoach.messageCount', { count: chat.messages.length })}
        </Text>

        {chat.extractedPlan && (
          <Card style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planIcon}>📋</Text>
              <Text style={styles.planTitle}>{t('aiCoach.extractedPlan')}</Text>
            </View>
            <Text style={styles.planContent} numberOfLines={10}>
              {chat.extractedPlan}
            </Text>
            <TouchableOpacity style={styles.usePlanButton}>
              <Text style={styles.usePlanButtonText}>{t('aiCoach.usePlan')}</Text>
            </TouchableOpacity>
          </Card>
        )}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('aiCoach.conversation')}</Text>

        {chat.messages.map((message, index) => (
          <View
            key={message.id || index}
            style={[
              styles.messageContainer,
              message.role === 'user' ? styles.userMessage : [styles.assistantMessage, { backgroundColor: colors.surface }],
            ]}
          >
            <View style={styles.messageHeader}>
              <Text style={[styles.messageRole, { color: message.role === 'user' ? COLORS.white : colors.textTertiary }]}>
                {message.role === 'user' ? t('aiCoach.you') : 'ChatGPT'}
              </Text>
              {message.timestamp && (
                <Text style={[styles.messageTime, { color: message.role === 'user' ? COLORS.white : colors.textTertiary }]}>{formatTime(message.timestamp)}</Text>
              )}
            </View>
            <Text style={[styles.messageContent, { color: message.role === 'user' ? COLORS.white : colors.text }]}>{message.content}</Text>
          </View>
        ))}
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
    flex: 1,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
    textAlign: 'center',
    marginHorizontal: SPACING.sm,
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
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gray[500],
  },
  messageCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  planCard: {
    backgroundColor: COLORS.success + '10',
    borderWidth: 1,
    borderColor: COLORS.success + '30',
    marginBottom: SPACING.xl,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  planIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  planTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.success,
  },
  planContent: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[700],
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  usePlanButton: {
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  usePlanButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
  },
  messageContainer: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    maxWidth: '90%',
  },
  userMessage: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    backgroundColor: COLORS.white,
    alignSelf: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  messageRole: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.gray[400],
  },
  messageTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[400],
  },
  messageContent: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
});
