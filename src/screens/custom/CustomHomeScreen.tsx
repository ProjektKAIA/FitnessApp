// /workspaces/claude-workspace/fitnessapp/src/screens/custom/CustomHomeScreen.tsx

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { useTheme } from '@/contexts';
import { RootStackParamList } from '@/types';
import { useCustomWorkoutStore, useStatsStore, useWorkoutStore, useUserStore } from '@/stores';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CustomHomeScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const isGerman = i18n.language === 'de';

  const {
    customWorkouts,
    addCustomWorkout,
    deleteCustomWorkout,
    getWorkoutsByCategory,
    totalWorkoutsCompleted,
    totalMinutesTracked,
  } = useCustomWorkoutStore();

  const { incrementStreak, updateStats, stats } = useStatsStore();
  const startWorkout = useWorkoutStore((state) => state.startWorkout);
  const user = useUserStore((state) => state.user);

  const categories = [
    { id: 'strength', label: isGerman ? 'Kraft' : 'Strength', icon: '💪' },
    { id: 'cardio', label: 'Cardio', icon: '❤️' },
    { id: 'flexibility', label: isGerman ? 'Beweglichkeit' : 'Flexibility', icon: '🧘' },
    { id: 'sports', label: 'Sport', icon: '⚽' },
    { id: 'other', label: isGerman ? 'Sonstiges' : 'Other', icon: '✨' },
  ];

  const filteredWorkouts = useMemo(() => {
    if (selectedCategory) {
      return getWorkoutsByCategory(selectedCategory);
    }
    return customWorkouts;
  }, [selectedCategory, customWorkouts, getWorkoutsByCategory]);

  const handleCreateWorkout = useCallback(() => {
    if (!newWorkoutName.trim()) {
      Alert.alert(
        isGerman ? 'Fehler' : 'Error',
        isGerman ? 'Bitte gib einen Namen ein' : 'Please enter a name'
      );
      return;
    }

    const newWorkout = addCustomWorkout({
      name: newWorkoutName.trim(),
      category: selectedCategory || 'other',
    });

    setIsCreateModalVisible(false);
    setNewWorkoutName('');

    // Start the workout immediately
    startWorkout({
      userId: user?.id || 'guest',
      name: newWorkoutName.trim(),
      direction: 'custom',
      exercises: [],
      duration: 0,
      totalVolume: 0,
    });
    navigation.navigate('WorkoutActive', { workoutId: 'new' });
  }, [newWorkoutName, selectedCategory, addCustomWorkout, startWorkout, user, navigation, isGerman]);

  const handleStartWorkout = useCallback((workout: { id: string; name: string }) => {
    startWorkout({
      userId: user?.id || 'guest',
      name: workout.name,
      direction: 'custom',
      exercises: [],
      duration: 0,
      totalVolume: 0,
    });
    navigation.navigate('WorkoutActive', { workoutId: 'new' });
  }, [startWorkout, user, navigation]);

  const handleDeleteWorkout = useCallback((workoutId: string, workoutName: string) => {
    Alert.alert(
      isGerman ? 'Workout löschen' : 'Delete Workout',
      isGerman
        ? `Möchtest du "${workoutName}" wirklich löschen?`
        : `Are you sure you want to delete "${workoutName}"?`,
      [
        { text: isGerman ? 'Abbrechen' : 'Cancel', style: 'cancel' },
        {
          text: isGerman ? 'Löschen' : 'Delete',
          style: 'destructive',
          onPress: () => deleteCustomWorkout(workoutId),
        },
      ]
    );
  }, [deleteCustomWorkout, isGerman]);

  const handleQuickStart = useCallback(() => {
    startWorkout({
      userId: user?.id || 'guest',
      name: isGerman ? 'Freies Training' : 'Free Workout',
      direction: 'custom',
      exercises: [],
      duration: 0,
      totalVolume: 0,
    });
    navigation.navigate('WorkoutActive', { workoutId: 'new' });
  }, [startWorkout, user, navigation, isGerman]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200' }}
          style={styles.heroSection}
          imageStyle={styles.heroImage}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
            style={styles.heroGradient}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← {t('common.back')}</Text>
            </TouchableOpacity>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>
                {isGerman ? 'Eigenes Training' : 'Custom Workout'}
              </Text>
              <Text style={styles.heroSubtitle}>
                {isGerman
                  ? 'Erstelle und tracke deine eigenen Workouts'
                  : 'Create and track your own workouts'}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Stats Card */}
        <View style={[styles.statsCard, { backgroundColor: colors.surfaceElevated }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{customWorkouts.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {isGerman ? 'Workouts' : 'Workouts'}
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{totalWorkoutsCompleted}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {isGerman ? 'Absolviert' : 'Completed'}
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{totalMinutesTracked}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {isGerman ? 'Minuten' : 'Minutes'}
            </Text>
          </View>
        </View>

        {/* Quick Start Card */}
        <TouchableOpacity
          style={[styles.quickStartCard, { backgroundColor: colors.primary }]}
          onPress={handleQuickStart}
          activeOpacity={0.9}
        >
          <View style={styles.quickStartContent}>
            <Text style={styles.quickStartIcon}>⚡</Text>
            <View style={styles.quickStartText}>
              <Text style={styles.quickStartTitle}>
                {isGerman ? 'Schnellstart' : 'Quick Start'}
              </Text>
              <Text style={styles.quickStartSubtitle}>
                {isGerman
                  ? 'Starte sofort ein freies Training'
                  : 'Start a free workout immediately'}
              </Text>
            </View>
          </View>
          <Text style={styles.quickStartArrow}>→</Text>
        </TouchableOpacity>

        {/* Create New Workout Button */}
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.surfaceElevated }]}
          onPress={() => setIsCreateModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={[styles.createIconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Text style={styles.createIcon}>+</Text>
          </View>
          <View style={styles.createContent}>
            <Text style={[styles.createTitle, { color: colors.text }]}>
              {isGerman ? 'Neues Workout erstellen' : 'Create New Workout'}
            </Text>
            <Text style={[styles.createSubtitle, { color: colors.textSecondary }]}>
              {isGerman
                ? 'Speichere dein eigenes Training'
                : 'Save your own custom workout'}
            </Text>
          </View>
          <Text style={[styles.createArrow, { color: colors.textTertiary }]}>›</Text>
        </TouchableOpacity>

        {/* Category Filter */}
        {customWorkouts.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {isGerman ? 'Kategorien' : 'Categories'}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryContainer}
            >
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  { backgroundColor: selectedCategory === null ? colors.primary : colors.surfaceElevated },
                ]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    { color: selectedCategory === null ? COLORS.white : colors.text },
                  ]}
                >
                  {t('common.all')}
                </Text>
              </TouchableOpacity>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: selectedCategory === cat.id ? colors.primary : colors.surfaceElevated },
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Text style={styles.categoryChipIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: selectedCategory === cat.id ? COLORS.white : colors.text },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Saved Workouts */}
        {customWorkouts.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {isGerman ? 'Deine Workouts' : 'Your Workouts'} ({filteredWorkouts.length})
            </Text>
            <View style={styles.workoutList}>
              {filteredWorkouts.map((workout) => (
                <TouchableOpacity
                  key={workout.id}
                  style={[styles.workoutCard, { backgroundColor: colors.surfaceElevated }]}
                  onPress={() => handleStartWorkout(workout)}
                  onLongPress={() => handleDeleteWorkout(workout.id, workout.name)}
                  activeOpacity={0.8}
                >
                  <View style={styles.workoutCardContent}>
                    <View
                      style={[
                        styles.workoutIconContainer,
                        { backgroundColor: colors.primary + '20' },
                      ]}
                    >
                      <Text style={styles.workoutIcon}>
                        {categories.find((c) => c.id === workout.category)?.icon || '💪'}
                      </Text>
                    </View>
                    <View style={styles.workoutInfo}>
                      <Text style={[styles.workoutName, { color: colors.text }]}>
                        {workout.name}
                      </Text>
                      <Text style={[styles.workoutMeta, { color: colors.textSecondary }]}>
                        {workout.completionCount > 0
                          ? `${workout.completionCount}x ${isGerman ? 'absolviert' : 'completed'}`
                          : isGerman
                          ? 'Noch nicht gestartet'
                          : 'Not started yet'}
                      </Text>
                    </View>
                    <View style={[styles.startButton, { backgroundColor: colors.primary }]}>
                      <Text style={styles.startButtonText}>▶</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.hintText, { color: colors.textTertiary }]}>
              {isGerman
                ? '💡 Tipp: Lange drücken zum Löschen'
                : '💡 Tip: Long press to delete'}
            </Text>
          </>
        )}

        {/* Empty State */}
        {customWorkouts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {isGerman ? 'Noch keine Workouts' : 'No workouts yet'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {isGerman
                ? 'Erstelle dein erstes eigenes Workout oder starte direkt mit dem Schnellstart!'
                : 'Create your first custom workout or start right away with Quick Start!'}
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Create Workout Modal */}
      <Modal
        visible={isCreateModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {isGerman ? 'Neues Workout' : 'New Workout'}
            </Text>

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              {isGerman ? 'Name' : 'Name'}
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceElevated,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder={isGerman ? 'z.B. Oberkörper Push' : 'e.g. Upper Body Push'}
              placeholderTextColor={colors.textTertiary}
              value={newWorkoutName}
              onChangeText={setNewWorkoutName}
              autoFocus
            />

            <Text style={[styles.inputLabel, { color: colors.textSecondary, marginTop: SPACING.lg }]}>
              {isGerman ? 'Kategorie' : 'Category'}
            </Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryOption,
                    {
                      backgroundColor:
                        selectedCategory === cat.id ? colors.primary : colors.surfaceElevated,
                      borderColor:
                        selectedCategory === cat.id ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Text style={styles.categoryOptionIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryOptionText,
                      { color: selectedCategory === cat.id ? COLORS.white : colors.text },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.surfaceElevated }]}
                onPress={() => {
                  setIsCreateModalVisible(false);
                  setNewWorkoutName('');
                  setSelectedCategory(null);
                }}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  {isGerman ? 'Abbrechen' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleCreateWorkout}
              >
                <Text style={[styles.modalButtonText, { color: COLORS.white }]}>
                  {isGerman ? 'Erstellen & Starten' : 'Create & Start'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING['3xl'],
  },
  heroSection: {
    height: 200,
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: SPACING.sm,
    marginLeft: -SPACING.sm,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  heroContent: {
    marginBottom: SPACING.md,
  },
  heroTitle: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    opacity: 0.9,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: SPACING.lg,
    marginTop: -SPACING.xl,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
  },
  quickStartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.md,
  },
  quickStartContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickStartIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  quickStartText: {
    flex: 1,
  },
  quickStartTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
  quickStartSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 2,
  },
  quickStartArrow: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: '600',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.sm,
  },
  createIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  createIcon: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.primary,
  },
  createContent: {
    flex: 1,
  },
  createTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  createSubtitle: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  createArrow: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  categoryScroll: {
    marginBottom: SPACING.md,
  },
  categoryContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  categoryChipIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  categoryChipText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  workoutList: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  workoutCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  workoutCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  workoutIcon: {
    fontSize: 24,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  workoutMeta: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  startButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 14,
    color: COLORS.white,
    marginLeft: 2,
  },
  hintText: {
    fontSize: FONT_SIZES.xs,
    textAlign: 'center',
    marginTop: SPACING.md,
    marginHorizontal: SPACING.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING['3xl'],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.base,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSpacing: {
    height: SPACING['3xl'],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    fontSize: FONT_SIZES.base,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
  },
  categoryOptionIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  categoryOptionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  modalButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
});

export default CustomHomeScreen;
