import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { useAICoachStore } from '@/stores';
import { RootStackParamList } from '@/types';

type ChatDetailRouteProp = RouteProp<RootStackParamList, 'ChatDetail'>;

export const ChatDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const route = useRoute<ChatDetailRouteProp>();
  const { chatId } = route.params;
  const importedChats = useAICoachStore((state) => state.importedChats);

  const chat = importedChats.find((c) => c.id === chatId);

  if (!chat) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>{t('aiCoach.chatNotFound')}</Text>
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{chat.title}</Text>
        <Text style={styles.messageCount}>
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

        <Text style={styles.sectionTitle}>{t('aiCoach.conversation')}</Text>

        {chat.messages.map((message, index) => (
          <View
            key={message.id || index}
            style={[
              styles.messageContainer,
              message.role === 'user' ? styles.userMessage : styles.assistantMessage,
            ]}
          >
            <View style={styles.messageHeader}>
              <Text style={styles.messageRole}>
                {message.role === 'user' ? t('aiCoach.you') : 'ChatGPT'}
              </Text>
              {message.timestamp && (
                <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
              )}
            </View>
            <Text style={styles.messageContent}>{message.content}</Text>
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
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.gray[900],
    marginTop: SPACING.lg,
  },
  messageCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: SPACING.xs,
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
