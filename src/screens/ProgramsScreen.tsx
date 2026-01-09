// /workspaces/claude-workspace/fitnessapp/src/screens/ProgramsScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { ProgramCard, LevelSelector } from '@/components/programs';
import {
  ActivityRings,
  WeeklyChart,
  MetricCard,
  SectionHeader,
  PersonalRecordCard,
} from '@/components/progress';
import { RootStackParamList, IProgram, TProgramLevel, TProgramCategory } from '@/types';
import { useStatsStore } from '@/stores';
import { useHealthStore } from '@/stores/healthStore';
import { useTheme } from '@/contexts/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RING_COLORS = {
  move: '#FF2D55',
  exercise: '#30D158',
  stand: '#007AFF',
};

// Sample programs data with stock images from Unsplash
const SAMPLE_PROGRAMS: IProgram[] = [
  {
    id: '1',
    name: 'Yoga Time',
    category: 'yoga',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    duration: '60 hr',
    level: 1,
    sessionsCount: 74,
  },
  {
    id: '2',
    name: 'Meditation Time',
    category: 'meditation',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    duration: '22 hr',
    level: 1,
    sessionsCount: 62,
  },
  {
    id: '3',
    name: 'Bodybuilding Time',
    category: 'bodybuilding',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400',
    duration: '200 hr',
    level: 2,
    sessionsCount: 90,
  },
  {
    id: '4',
    name: 'Cardio Blast',
    category: 'cardio',
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400',
    duration: '45 hr',
    level: 2,
    sessionsCount: 50,
  },
  {
    id: '5',
    name: 'Stretch & Flex',
    category: 'stretching',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
    duration: '30 hr',
    level: 1,
    sessionsCount: 40,
  },
];

export const ProgramsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<IProgram | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<TProgramLevel | null>(null);

  // Stats
  const stats = useStatsStore((state) => state.stats);

  // Health Data
  const healthSettings = useHealthStore((state) => state.settings);
  const todaySummary = useHealthStore((state) => state.todaySummary);
  const isHealthEnabled = healthSettings.enabled && healthSettings.permissionsGranted;

  // Activity Rings Data
  const activityRings = useMemo(() => {
    const steps = todaySummary?.steps?.count ?? 0;
    const calories = todaySummary?.calories?.active ?? 0;
    const activeMinutes = todaySummary?.activeMinutes ?? 0;

    return [
      {
        id: 'steps',
        value: steps,
        goal: healthSettings.stepsGoal,
        color: RING_COLORS.move,
        gradientEnd: '#FF6B8A',
        label: t('progress.rings.move'),
        unit: t('health.summary.steps'),
      },
      {
        id: 'calories',
        value: calories,
        goal: 500,
        color: RING_COLORS.exercise,
        gradientEnd: '#5AE17E',
        label: t('progress.rings.exercise'),
        unit: 'kcal',
      },
      {
        id: 'activeMinutes',
        value: activeMinutes,
        goal: 30,
        color: RING_COLORS.stand,
        gradientEnd: '#5AC8FA',
        label: t('progress.rings.stand'),
        unit: 'min',
      },
    ];
  }, [todaySummary, healthSettings.stepsGoal, t]);

  const handleProgramPress = (program: IProgram) => {
    setSelectedProgram(program);
    setShowLevelSelector(true);
  };

  const handleLevelSelect = (level: TProgramLevel) => {
    setSelectedLevel(level);
    // Navigate to workout or show program details
  };

  const renderProgramItem = ({ item }: { item: IProgram }) => (
    <View style={styles.programCardWrapper}>
      <ProgramCard program={item} onPress={handleProgramPress} />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('programs.title')}</Text>
        </View>

        {/* Activity Rings (if health enabled) */}
        {isHealthEnabled && (
          <View style={styles.ringsSection}>
            <View style={[styles.ringsCard, { backgroundColor: colors.surface }]}>
              <ActivityRings
                rings={activityRings}
                size={140}
                strokeWidth={12}
                showLabels={true}
              />
            </View>
          </View>
        )}

        {/* Programs Section */}
        <SectionHeader title={t('programs.featuredPrograms')} />
        <FlatList
          data={SAMPLE_PROGRAMS}
          renderItem={renderProgramItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.programsList}
          snapToInterval={216}
          decelerationRate="fast"
        />

        {/* Quick Stats */}
        <SectionHeader title={t('progress.overview')} />
        <View style={styles.statsGrid}>
          <MetricCard
            icon="💪"
            title={t('progress.totalWorkouts')}
            value={stats.totalWorkouts}
            subtitle={t('progress.allTime')}
          />
          <MetricCard
            icon="🔥"
            iconColor={colors.accent}
            title={t('progress.currentStreak')}
            value={stats.currentStreak}
            unit={t('progress.days')}
          />
        </View>

        {/* Personal Records */}
        <SectionHeader
          title={t('progress.personalRecords')}
          action={{
            label: t('common.viewAll'),
            onPress: () => navigation.navigate('WorkoutHistory'),
          }}
        />
        {stats.personalRecords.length > 0 ? (
          stats.personalRecords.slice(0, 2).map((pr, index) => (
            <PersonalRecordCard
              key={index}
              exerciseName={pr.exerciseName}
              weight={pr.weight}
              reps={pr.reps}
              date={pr.date instanceof Date ? pr.date.toLocaleDateString() : pr.date}
            />
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
            <Text style={styles.emptyIcon}>🏆</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('progress.noRecordsYet')}</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('progress.noRecordsText')}</Text>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Level Selector Modal */}
      <LevelSelector
        visible={showLevelSelector}
        selectedLevel={selectedLevel}
        onSelectLevel={handleLevelSelect}
        onClose={() => setShowLevelSelector(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[900],
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING['3xl'],
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.white,
  },
  ringsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  ringsCard: {
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  programsList: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  programCardWrapper: {
    marginRight: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  emptyState: {
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING['2xl'],
    marginHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
    textAlign: 'center',
  },
  bottomSpacing: {
    height: SPACING['3xl'],
  },
});
