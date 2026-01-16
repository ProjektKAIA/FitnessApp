import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useWorkoutStore } from '@/stores';
import { useRunningStore, IRunningSession } from '@/stores/runningStore';
import { useYogaStore, IYogaSessionRecord } from '@/stores/yogaStore';
import { useTheme } from '@/contexts';
import { RootStackParamList, IWorkout, TDirection } from '@/types';

// Unified activity type for all sports
interface IUnifiedActivity {
  id: string;
  type: 'workout' | 'running' | 'yoga';
  name: string;
  direction: TDirection;
  finishedAt: Date;
  duration: number; // in minutes for workout, seconds for running/yoga
  // Workout specific
  exercises?: number;
  totalVolume?: number;
  // Running specific
  segments?: number;
  // Yoga specific
  poses?: number;
  style?: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type WorkoutHistoryRouteProp = RouteProp<RootStackParamList, 'WorkoutHistory'>;

const DIRECTION_COLORS: Record<TDirection, string> = {
  gym: COLORS.primary,
  calisthenics: COLORS.purple,
  cardio: COLORS.accent,
  yoga: COLORS.success,
  mobility: COLORS.gray[500],
  custom: COLORS.gray[600],
  running: COLORS.accent,
};

const ALL_DIRECTIONS: TDirection[] = ['gym', 'calisthenics', 'cardio', 'yoga', 'mobility', 'custom', 'running'];

const formatDate = (date: Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

const formatVolume = (volume: number): string => {
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}k kg`;
  }
  return `${volume} kg`;
};

const getMonthYear = (date: Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
};

interface ActivityItemProps {
  activity: IUnifiedActivity;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onPress, colors }) => {
  const { t } = useTranslation();

  const renderStats = () => {
    if (activity.type === 'workout') {
      return (
        <>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>{activity.exercises || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('common.exercises')}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>{formatDuration(activity.duration)}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('workoutHistory.duration')}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>{formatVolume(activity.totalVolume || 0)}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('workoutHistory.volume')}</Text>
          </View>
        </>
      );
    }

    if (activity.type === 'running') {
      const durationMinutes = Math.round(activity.duration / 60);
      return (
        <>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>{activity.segments || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Segmente</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>{formatDuration(durationMinutes)}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('workoutHistory.duration')}</Text>
          </View>
        </>
      );
    }

    if (activity.type === 'yoga') {
      const durationMinutes = Math.round(activity.duration / 60);
      return (
        <>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>{activity.poses || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('workoutHistory.poses')}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>{formatDuration(durationMinutes)}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('workoutHistory.duration')}</Text>
          </View>
        </>
      );
    }

    return null;
  };

  return (
    <TouchableOpacity style={[styles.workoutItem, { backgroundColor: colors.card }]} onPress={onPress}>
      <View style={styles.workoutHeader}>
        <View style={styles.workoutTitleRow}>
          <Text style={[styles.workoutName, { color: colors.text }]}>{activity.name}</Text>
          <View
            style={[
              styles.directionBadge,
              { backgroundColor: DIRECTION_COLORS[activity.direction] },
            ]}
          >
            <Text style={styles.directionText}>
              {t(`directions.${activity.direction}`)}
            </Text>
          </View>
        </View>
        <Text style={[styles.workoutDate, { color: colors.textSecondary }]}>
          {formatDate(activity.finishedAt)}
        </Text>
      </View>

      <View style={styles.workoutStats}>
        {renderStats()}
      </View>
    </TouchableOpacity>
  );
};

interface FilterChipProps {
  label: string;
  isActive: boolean;
  color?: string;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
}

const FilterChip: React.FC<FilterChipProps> = ({ label, isActive, color, onPress, colors }) => (
  <TouchableOpacity
    style={[
      styles.filterChip,
      { backgroundColor: colors.surfaceElevated },
      isActive && { backgroundColor: color || COLORS.primary },
    ]}
    onPress={onPress}
  >
    <Text style={[styles.filterChipText, { color: colors.textSecondary }, isActive && styles.filterChipTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export const WorkoutHistoryScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<WorkoutHistoryRouteProp>();

  // Get data from all stores
  const getWorkoutHistory = useWorkoutStore((state) => state.getWorkoutHistory);
  const getRunningHistory = useRunningStore((state) => state.getSessionHistory);
  const getYogaHistory = useYogaStore((state) => state.getSessionHistory);

  // Get initial filter from route params
  const initialDirection = route.params?.direction;
  const [activeFilter, setActiveFilter] = useState<TDirection | null>(initialDirection || null);

  const sections = useMemo(() => {
    // Convert workouts to unified activities
    const workoutActivities: IUnifiedActivity[] = getWorkoutHistory()
      .filter((w) => w.finishedAt)
      .map((w) => ({
        id: w.id,
        type: 'workout' as const,
        name: w.name,
        direction: w.direction,
        finishedAt: new Date(w.finishedAt!),
        duration: w.duration,
        exercises: w.exercises.length,
        totalVolume: w.totalVolume,
      }));

    // Convert running sessions to unified activities
    const runningActivities: IUnifiedActivity[] = getRunningHistory()
      .filter((s) => s.finishedAt && s.status === 'completed')
      .map((s) => ({
        id: s.id,
        type: 'running' as const,
        name: s.workoutName,
        direction: 'running' as TDirection,
        finishedAt: new Date(s.finishedAt!),
        duration: s.duration,
        segments: s.completedSegments,
      }));

    // Convert yoga sessions to unified activities
    const yogaActivities: IUnifiedActivity[] = getYogaHistory()
      .filter((s) => s.finishedAt && s.status === 'completed')
      .map((s) => ({
        id: s.id,
        type: 'yoga' as const,
        name: s.sessionName,
        direction: 'yoga' as TDirection,
        finishedAt: new Date(s.finishedAt!),
        duration: s.duration,
        poses: s.completedPoses,
        style: s.style,
      }));

    // Combine all activities
    let allActivities = [...workoutActivities, ...runningActivities, ...yogaActivities];

    // Apply direction filter
    if (activeFilter) {
      allActivities = allActivities.filter((a) => a.direction === activeFilter);
    }

    // Sort by date descending
    const sorted = allActivities.sort((a, b) => {
      return new Date(b.finishedAt).getTime() - new Date(a.finishedAt).getTime();
    });

    // Group by month
    const groups: Record<string, IUnifiedActivity[]> = {};
    sorted.forEach((activity) => {
      const key = getMonthYear(activity.finishedAt);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(activity);
    });

    return Object.entries(groups).map(([title, data]) => ({
      title,
      data,
    }));
  }, [getWorkoutHistory, getRunningHistory, getYogaHistory, activeFilter]);

  const handleActivityPress = (activity: IUnifiedActivity) => {
    if (activity.type === 'workout') {
      navigation.navigate('WorkoutDetail', { workoutId: activity.id });
    }
    // Running and yoga details can be added later
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleFilterPress = (direction: TDirection | null) => {
    setActiveFilter(direction);
  };

  const totalCount = useMemo(() => {
    return sections.reduce((sum, section) => sum + section.data.length, 0);
  }, [sections]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.primary }]}>{t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{t('workoutHistory.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filter Chips */}
      <View style={[styles.filterContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <FilterChip
            label={t('workoutHistory.all')}
            isActive={activeFilter === null}
            onPress={() => handleFilterPress(null)}
            colors={colors}
          />
          {ALL_DIRECTIONS.map((direction) => (
            <FilterChip
              key={direction}
              label={t(`directions.${direction}`)}
              isActive={activeFilter === direction}
              color={DIRECTION_COLORS[direction]}
              onPress={() => handleFilterPress(direction)}
              colors={colors}
            />
          ))}
        </ScrollView>
      </View>

      {/* Results count */}
      {activeFilter && (
        <View style={[styles.resultsInfo, { backgroundColor: colors.card }]}>
          <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
            {t('workoutHistory.filteredResults', { count: totalCount })}
          </Text>
        </View>
      )}

      {sections.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            {activeFilter
              ? t('workoutHistory.emptyFilteredTitle')
              : t('workoutHistory.emptyTitle')}
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {activeFilter
              ? t('workoutHistory.emptyFilteredText', {
                  direction: t(`directions.${activeFilter}`),
                })
              : t('workoutHistory.emptyText')}
          </Text>
          {activeFilter && (
            <TouchableOpacity
              style={styles.clearFilterButton}
              onPress={() => setActiveFilter(null)}
            >
              <Text style={styles.clearFilterText}>
                {t('workoutHistory.clearFilter')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ActivityItem
              activity={item}
              onPress={() => handleActivityPress(item)}
              colors={colors}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
        />
      )}
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: SPACING.xs,
  },
  backText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primary,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  placeholder: {
    width: 60,
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  filterScroll: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.gray[100],
    marginRight: SPACING.xs,
  },
  filterChipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  resultsInfo: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.gray[50],
  },
  resultsText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
  },
  listContent: {
    padding: SPACING.lg,
  },
  sectionHeader: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  workoutItem: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  workoutHeader: {
    marginBottom: SPACING.md,
  },
  workoutTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  workoutName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
    flex: 1,
  },
  directionBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  directionText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    color: COLORS.white,
  },
  workoutDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
  },
  workoutStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.gray[200],
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  emptyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    textAlign: 'center',
  },
  clearFilterButton: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
  },
  clearFilterText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
});
