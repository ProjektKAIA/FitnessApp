// /workspaces/claude-workspace/fitnessapp/src/screens/yoga/YogaSessionListScreen.tsx

import React, { useState } from 'react';
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

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { useTheme } from '@/contexts';
import { RootStackParamList, TYogaLevel } from '@/types';
import {
  YOGA_SESSIONS,
  YOGA_STYLE_LABELS,
  YOGA_LEVEL_LABELS,
  YOGA_FOCUS_LABELS,
} from '@/data/yogaLibrary';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LEVEL_FILTERS: Array<{ key: TYogaLevel | 'all'; label: string }> = [
  { key: 'all', label: 'Alle' },
  { key: 'beginner', label: 'Anfänger' },
  { key: 'intermediate', label: 'Fortgeschritten' },
  { key: 'advanced', label: 'Profi' },
];

export const YogaSessionListScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [selectedLevel, setSelectedLevel] = useState<TYogaLevel | 'all'>('all');

  const filteredSessions = selectedLevel === 'all'
    ? YOGA_SESSIONS
    : YOGA_SESSIONS.filter(s => s.level === selectedLevel);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backIcon, { color: colors.text }]}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('yoga.sessionList')}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filter Pills */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {LEVEL_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterPill,
                {
                  backgroundColor: selectedLevel === filter.key ? COLORS.purple : colors.surface,
                  borderColor: selectedLevel === filter.key ? COLORS.purple : colors.border,
                },
              ]}
              onPress={() => setSelectedLevel(filter.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: selectedLevel === filter.key ? COLORS.white : colors.text },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filteredSessions.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyIcon]}>{'🧘'}</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('yoga.noSessionsFound')}
            </Text>
          </View>
        )}
        {filteredSessions.map((session) => (
          <TouchableOpacity
            key={session.id}
            style={[styles.sessionCard, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('YogaSessionDetail', { sessionId: session.id })}
          >
            <View style={styles.sessionLeft}>
              <Text style={styles.sessionIcon}>
                {YOGA_STYLE_LABELS[session.style].icon}
              </Text>
            </View>
            <View style={styles.sessionContent}>
              <View style={styles.sessionHeader}>
                <Text style={[styles.sessionName, { color: colors.text }]}>{session.name}</Text>
                <View style={[styles.durationBadge, { backgroundColor: COLORS.purple + '20' }]}>
                  <Text style={[styles.durationText, { color: COLORS.purple }]}>
                    {session.duration} {t('yoga.min')}
                  </Text>
                </View>
              </View>
              <Text style={[styles.sessionStyle, { color: colors.textSecondary }]}>
                {YOGA_STYLE_LABELS[session.style].de} • {YOGA_LEVEL_LABELS[session.level].de}
              </Text>
              <View style={styles.focusTags}>
                {session.focus.slice(0, 3).map((focus) => (
                  <View key={focus} style={[styles.focusTag, { backgroundColor: colors.background }]}>
                    <Text style={[styles.focusTagText, { color: colors.textSecondary }]}>
                      {YOGA_FOCUS_LABELS[focus].icon} {YOGA_FOCUS_LABELS[focus].de}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <Text style={[styles.sessionArrow, { color: colors.textSecondary }]}>{'>'}</Text>
          </TouchableOpacity>
        ))}
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
  },
  placeholder: {
    width: 40,
  },
  filterContainer: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  filterContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  filterPill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    marginRight: SPACING.sm,
  },
  filterText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING['4xl'],
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  sessionLeft: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.purple + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  sessionIcon: {
    fontSize: 28,
  },
  sessionContent: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  sessionName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    flex: 1,
  },
  durationBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  durationText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  sessionStyle: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.sm,
  },
  focusTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  focusTag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  focusTagText: {
    fontSize: FONT_SIZES.xs,
  },
  sessionArrow: {
    fontSize: FONT_SIZES.lg,
    marginLeft: SPACING.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING['4xl'],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.base,
    textAlign: 'center',
  },
});
