// /workspaces/claude-workspace/fitnessapp/src/screens/running/RunningResultsScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useTheme } from '@/contexts';
import { RootStackParamList } from '@/types';
import { Card } from '@/components/common';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'RunningResults'>;

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatPace = (pace: number): string => {
  if (pace <= 0) return '--:--';
  const mins = Math.floor(pace);
  const secs = Math.round((pace - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const RunningResultsScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const lang = i18n.language as 'de' | 'en';

  const {
    workoutName,
    totalTime,
    totalDistance,
    totalSteps,
    avgPace,
    calories,
  } = route.params;

  const handleDone = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const handleViewHistory = () => {
    navigation.reset({
      index: 1,
      routes: [
        { name: 'Main' },
        { name: 'RunningHome' },
      ],
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.successBadge}
          >
            <Text style={styles.successIcon}>✓</Text>
          </LinearGradient>
          <Text style={[styles.title, { color: colors.text }]}>
            {lang === 'de' ? 'Workout abgeschlossen!' : 'Workout Complete!'}
          </Text>
          <Text style={[styles.workoutName, { color: colors.textSecondary }]}>
            {workoutName}
          </Text>
        </View>

        {/* Main Stats */}
        <Card style={styles.mainStatsCard}>
          <View style={styles.mainStatRow}>
            <View style={styles.mainStat}>
              <Text style={[styles.mainStatValue, { color: colors.text }]}>
                {formatTime(totalTime)}
              </Text>
              <Text style={[styles.mainStatLabel, { color: colors.textSecondary }]}>
                {lang === 'de' ? 'Dauer' : 'Duration'}
              </Text>
            </View>
            <View style={[styles.mainStatDivider, { backgroundColor: colors.border }]} />
            <View style={styles.mainStat}>
              <Text style={[styles.mainStatValue, { color: colors.text }]}>
                {(totalDistance / 1000).toFixed(2)} km
              </Text>
              <Text style={[styles.mainStatLabel, { color: colors.textSecondary }]}>
                {lang === 'de' ? 'Distanz' : 'Distance'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Detailed Stats */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>👟</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{totalSteps.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {lang === 'de' ? 'Schritte' : 'Steps'}
            </Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{formatPace(avgPace)}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {lang === 'de' ? 'Tempo (min/km)' : 'Pace (min/km)'}
            </Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{Math.round(calories)}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {lang === 'de' ? 'Kalorien' : 'Calories'}
            </Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>🏃</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {totalTime > 0 ? Math.round(totalSteps / (totalTime / 60)) : 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {lang === 'de' ? 'Schritte/min' : 'Steps/min'}
            </Text>
          </Card>
        </View>

        {/* Motivational Message */}
        <Card style={[styles.motivationCard, { backgroundColor: colors.primary + '15' }]}>
          <Text style={styles.motivationEmoji}>💪</Text>
          <Text style={[styles.motivationText, { color: colors.text }]}>
            {lang === 'de'
              ? 'Starke Leistung! Jedes Training bringt dich deinem Ziel näher.'
              : 'Great job! Every workout brings you closer to your goals.'}
          </Text>
        </Card>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: colors.border }]}
          onPress={handleViewHistory}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
            {lang === 'de' ? 'Zur Historie' : 'View History'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleDone}
        >
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            style={styles.primaryButtonGradient}
          >
            <Text style={styles.primaryButtonText}>
              {lang === 'de' ? 'Fertig' : 'Done'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    padding: SPACING.lg,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  successBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  successIcon: {
    fontSize: 40,
    color: COLORS.white,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    textAlign: 'center',
  },
  workoutName: {
    fontSize: FONT_SIZES.base,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  mainStatsCard: {
    marginBottom: SPACING.lg,
  },
  mainStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainStat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  mainStatValue: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '700',
  },
  mainStatLabel: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  mainStatDivider: {
    width: 1,
    height: 50,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  motivationCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  motivationEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  motivationText: {
    fontSize: FONT_SIZES.base,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderTopWidth: 1,
    gap: SPACING.md,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
});
