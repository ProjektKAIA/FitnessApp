// /workspaces/claude-workspace/fitnessapp/src/screens/WeightHistoryScreen.tsx

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
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useTheme } from '@/contexts';
import { useUserGoalsStore } from '@/stores';
import { RootStackParamList } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const WeightHistoryScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const healthEntries = useUserGoalsStore((state) => state.healthEntries);

  // Filter entries with weight and sort by date (newest first)
  const weightEntries = healthEntries
    .filter((entry) => entry.weight !== undefined)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate weight change from previous entry
  const getWeightChange = (index: number) => {
    if (index >= weightEntries.length - 1) return null;
    const current = weightEntries[index].weight!;
    const previous = weightEntries[index + 1].weight!;
    const change = current - previous;
    return change;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.backIcon, { color: colors.text }]}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('weightHistory.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {weightEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyIcon]}>⚖️</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('weightHistory.noEntries')}
            </Text>
          </View>
        ) : (
          <View style={[styles.table, { backgroundColor: isDark ? '#1E1E2E' : COLORS.white }]}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.headerCell, styles.dateCell, { color: colors.textSecondary }]}>
                {t('weightHistory.date')}
              </Text>
              <Text style={[styles.headerCell, styles.weightCell, { color: colors.textSecondary }]}>
                {t('weightHistory.weight')}
              </Text>
              <Text style={[styles.headerCell, styles.changeCell, { color: colors.textSecondary }]}>
                {t('weightHistory.change')}
              </Text>
            </View>

            {/* Table Rows */}
            {weightEntries.map((entry, index) => {
              const change = getWeightChange(index);
              return (
                <View
                  key={entry.id}
                  style={[
                    styles.tableRow,
                    index < weightEntries.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 },
                  ]}
                >
                  <View style={styles.dateCell}>
                    <Text style={[styles.dateText, { color: colors.text }]}>
                      {formatDate(entry.date)}
                    </Text>
                    <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                      {formatTime(entry.date)}
                    </Text>
                  </View>
                  <Text style={[styles.weightText, styles.weightCell, { color: colors.text }]}>
                    {entry.weight?.toFixed(1)} kg
                  </Text>
                  <View style={styles.changeCell}>
                    {change !== null ? (
                      <Text
                        style={[
                          styles.changeText,
                          { color: change > 0 ? COLORS.error : change < 0 ? COLORS.success : colors.textSecondary },
                        ]}
                      >
                        {change > 0 ? '+' : ''}{change.toFixed(1)} kg
                      </Text>
                    ) : (
                      <Text style={[styles.changeText, { color: colors.textSecondary }]}>-</Text>
                    )}
                  </View>
                </View>
              );
            })}
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
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING['4xl'],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.base,
    textAlign: 'center',
  },
  table: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  tableHeader: {
    borderBottomWidth: 2,
  },
  headerCell: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateCell: {
    flex: 2,
  },
  weightCell: {
    flex: 1.5,
    textAlign: 'center',
  },
  changeCell: {
    flex: 1.5,
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
  },
  timeText: {
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  weightText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  changeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
});
