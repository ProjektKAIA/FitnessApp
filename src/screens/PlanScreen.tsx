import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface ScheduledWorkout {
  id: string;
  day: string;
  name: string;
  direction: string;
  time?: string;
}

const SAMPLE_SCHEDULE: ScheduledWorkout[] = [
  { id: '1', day: 'Mon', name: 'Push Day', direction: 'gym', time: '07:00' },
  { id: '2', day: 'Tue', name: 'Pull Day', direction: 'gym', time: '07:00' },
  { id: '3', day: 'Wed', name: 'Rest / Cardio', direction: 'cardio' },
  { id: '4', day: 'Thu', name: 'Leg Day', direction: 'gym', time: '07:00' },
  { id: '5', day: 'Fri', name: 'Upper Body', direction: 'gym', time: '07:00' },
  { id: '6', day: 'Sat', name: 'Active Recovery', direction: 'yoga' },
  { id: '7', day: 'Sun', name: 'Rest', direction: 'custom' },
];

export const PlanScreen: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('Mon');

  const selectedWorkout = SAMPLE_SCHEDULE.find((w) => w.day === selectedDay);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Training Plan</Text>
        <Text style={styles.subtitle}>Your weekly schedule</Text>

        <View style={styles.weekContainer}>
          {DAYS.map((day) => {
            const workout = SAMPLE_SCHEDULE.find((w) => w.day === day);
            const isSelected = selectedDay === day;
            const hasWorkout = workout && workout.name !== 'Rest';

            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  isSelected && styles.dayButtonSelected,
                  hasWorkout && styles.dayButtonHasWorkout,
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    isSelected && styles.dayTextSelected,
                  ]}
                >
                  {day}
                </Text>
                {hasWorkout && !isSelected && <View style={styles.workoutDot} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedWorkout && (
          <Card style={styles.workoutCard} elevated>
            <View style={styles.workoutHeader}>
              <View
                style={[
                  styles.directionBadge,
                  { backgroundColor: getDirectionColor(selectedWorkout.direction) },
                ]}
              >
                <Text style={styles.directionText}>{selectedWorkout.direction}</Text>
              </View>
              {selectedWorkout.time && (
                <Text style={styles.timeText}>{selectedWorkout.time}</Text>
              )}
            </View>
            <Text style={styles.workoutName}>{selectedWorkout.name}</Text>

            {selectedWorkout.name !== 'Rest' && (
              <View style={styles.workoutActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionIcon}>✏️</Text>
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionIcon}>🔄</Text>
                  <Text style={styles.actionText}>Swap</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionIcon}>⏭️</Text>
                  <Text style={styles.actionText}>Skip</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>
        )}

        <Text style={styles.sectionTitle}>This Week</Text>

        {SAMPLE_SCHEDULE.map((workout) => (
          <TouchableOpacity
            key={workout.id}
            style={styles.scheduleItem}
            onPress={() => setSelectedDay(workout.day)}
          >
            <View style={styles.scheduleDay}>
              <Text style={styles.scheduleDayText}>{workout.day}</Text>
            </View>
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleName}>{workout.name}</Text>
              {workout.time && (
                <Text style={styles.scheduleTime}>{workout.time}</Text>
              )}
            </View>
            <View
              style={[
                styles.scheduleIndicator,
                { backgroundColor: getDirectionColor(workout.direction) },
              ]}
            />
          </TouchableOpacity>
        ))}

        <Card style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Text style={styles.aiIcon}>🤖</Text>
            <Text style={styles.aiTitle}>AI Coach</Text>
          </View>
          <Text style={styles.aiDescription}>
            Let our AI create a personalized training plan based on your goals and
            preferences.
          </Text>
          <TouchableOpacity style={styles.aiButton}>
            <Text style={styles.aiButtonText}>Generate Plan</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const getDirectionColor = (direction: string): string => {
  switch (direction) {
    case 'gym':
      return COLORS.primary;
    case 'cardio':
      return COLORS.accent;
    case 'yoga':
      return COLORS.purple;
    case 'calisthenics':
      return COLORS.success;
    default:
      return COLORS.gray[400];
  }
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
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  dayButton: {
    width: 44,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  dayButtonHasWorkout: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  dayText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray[700],
  },
  dayTextSelected: {
    color: COLORS.white,
  },
  workoutDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
  workoutCard: {
    marginBottom: SPACING.xl,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  directionBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  directionText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  workoutName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: SPACING.lg,
  },
  workoutActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    paddingTop: SPACING.md,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[600],
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  scheduleDay: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  scheduleDayText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[700],
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.gray[900],
  },
  scheduleTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  scheduleIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
  },
  aiCard: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.gray[800],
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  aiIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  aiTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.white,
  },
  aiDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[300],
    marginBottom: SPACING.lg,
  },
  aiButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  aiButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
});
