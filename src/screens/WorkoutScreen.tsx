import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Button, Card } from '@/components/common';
import { useWorkoutStore } from '@/stores';
import { TDirection } from '@/types';

const WORKOUT_TEMPLATES = [
  { id: '1', name: 'Push Day', direction: 'gym' as TDirection, exercises: 6 },
  { id: '2', name: 'Pull Day', direction: 'gym' as TDirection, exercises: 6 },
  { id: '3', name: 'Leg Day', direction: 'gym' as TDirection, exercises: 5 },
  { id: '4', name: 'Upper Body', direction: 'gym' as TDirection, exercises: 8 },
  { id: '5', name: 'Full Body HIIT', direction: 'cardio' as TDirection, exercises: 10 },
  { id: '6', name: 'Morning Yoga', direction: 'yoga' as TDirection, exercises: 12 },
];

export const WorkoutScreen: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { startWorkout, activeWorkout } = useWorkoutStore();

  const handleStartWorkout = () => {
    if (!selectedTemplate) return;

    const template = WORKOUT_TEMPLATES.find((t) => t.id === selectedTemplate);
    if (!template) return;

    startWorkout({
      userId: 'user-1',
      name: template.name,
      direction: template.direction,
      exercises: [],
      duration: 0,
      totalVolume: 0,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Start Workout</Text>
        <Text style={styles.subtitle}>Choose a template or create your own</Text>

        {activeWorkout && (
          <Card style={styles.activeWorkoutCard} elevated>
            <View style={styles.activeWorkoutHeader}>
              <Text style={styles.activeWorkoutLabel}>IN PROGRESS</Text>
              <View style={styles.activeDot} />
            </View>
            <Text style={styles.activeWorkoutName}>{activeWorkout.name}</Text>
            <Text style={styles.activeWorkoutInfo}>
              {activeWorkout.exercises.length} exercises
            </Text>
            <Button
              title="Continue Workout"
              onPress={() => {}}
              fullWidth
              style={styles.continueButton}
            />
          </Card>
        )}

        <Text style={styles.sectionTitle}>Quick Start</Text>

        <View style={styles.quickStartRow}>
          <TouchableOpacity style={styles.quickStartButton}>
            <Text style={styles.quickStartIcon}>⚡</Text>
            <Text style={styles.quickStartText}>Empty</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickStartButton}>
            <Text style={styles.quickStartIcon}>📋</Text>
            <Text style={styles.quickStartText}>Last</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickStartButton}>
            <Text style={styles.quickStartIcon}>🤖</Text>
            <Text style={styles.quickStartText}>AI</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Templates</Text>

        {WORKOUT_TEMPLATES.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={[
              styles.templateCard,
              selectedTemplate === template.id && styles.templateCardSelected,
            ]}
            onPress={() => setSelectedTemplate(template.id)}
          >
            <View style={styles.templateInfo}>
              <Text style={styles.templateName}>{template.name}</Text>
              <Text style={styles.templateMeta}>
                {template.direction} • {template.exercises} exercises
              </Text>
            </View>
            <View
              style={[
                styles.radioButton,
                selectedTemplate === template.id && styles.radioButtonSelected,
              ]}
            >
              {selectedTemplate === template.id && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </TouchableOpacity>
        ))}

        <Button
          title="Start Workout"
          onPress={handleStartWorkout}
          disabled={!selectedTemplate}
          fullWidth
          style={styles.startButton}
        />
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
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.gray[900],
    marginTop: SPACING.lg,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[500],
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  activeWorkoutCard: {
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.xl,
  },
  activeWorkoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  activeWorkoutLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.8,
    letterSpacing: 1,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginLeft: SPACING.sm,
  },
  activeWorkoutName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
  activeWorkoutInfo: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SPACING.xs,
  },
  continueButton: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
  },
  quickStartRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  quickStartButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  quickStartIcon: {
    fontSize: 28,
    marginBottom: SPACING.sm,
  },
  quickStartText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray[700],
  },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  templateCardSelected: {
    borderColor: COLORS.primary,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  templateMeta: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  startButton: {
    marginTop: SPACING.xl,
  },
});
