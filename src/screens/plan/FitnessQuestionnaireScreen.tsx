// /workspaces/claude-workspace/fitnessapp/src/screens/plan/FitnessQuestionnaireScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useTheme } from '@/contexts';
import { RootStackParamList, TTrainingDay, IPlannedWorkout } from '@/types';
import { useTrainingPlanStore } from '@/stores';
import { PLAN_TEMPLATES, PlanTemplate } from '@/data/planTemplates';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'FitnessQuestionnaire'>;

interface QuestionOption {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

interface Question {
  id: string;
  title: string;
  subtitle?: string;
  options: QuestionOption[];
  multiSelect?: boolean;
}

const QUESTIONS: Question[] = [
  {
    id: 'experience',
    title: 'questionnaire.experience.title',
    subtitle: 'questionnaire.experience.subtitle',
    options: [
      { id: 'beginner', label: 'questionnaire.experience.beginner', icon: '🌱', description: 'questionnaire.experience.beginnerDesc' },
      { id: 'intermediate', label: 'questionnaire.experience.intermediate', icon: '💪', description: 'questionnaire.experience.intermediateDesc' },
      { id: 'advanced', label: 'questionnaire.experience.advanced', icon: '🏆', description: 'questionnaire.experience.advancedDesc' },
    ],
  },
  {
    id: 'goal',
    title: 'questionnaire.goal.title',
    subtitle: 'questionnaire.goal.subtitle',
    options: [
      { id: 'muscle', label: 'questionnaire.goal.muscle', icon: '💪' },
      { id: 'strength', label: 'questionnaire.goal.strength', icon: '🏋️' },
      { id: 'lose_weight', label: 'questionnaire.goal.loseWeight', icon: '🔥' },
      { id: 'fitness', label: 'questionnaire.goal.fitness', icon: '❤️' },
    ],
  },
  {
    id: 'days',
    title: 'questionnaire.days.title',
    subtitle: 'questionnaire.days.subtitle',
    options: [
      { id: '2', label: 'questionnaire.days.two', icon: '2️⃣' },
      { id: '3', label: 'questionnaire.days.three', icon: '3️⃣' },
      { id: '4', label: 'questionnaire.days.four', icon: '4️⃣' },
      { id: '5', label: 'questionnaire.days.five', icon: '5️⃣' },
      { id: '6', label: 'questionnaire.days.six', icon: '6️⃣' },
    ],
  },
];

export const FitnessQuestionnaireScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const createPlan = useTrainingPlanStore((state) => state.createPlan);
  const setWorkoutForDay = useTrainingPlanStore((state) => state.setWorkoutForDay);
  const setActivePlan = useTrainingPlanStore((state) => state.setActivePlan);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const currentQuestion = QUESTIONS[currentStep];
  const progress = (currentStep + 1) / QUESTIONS.length;

  const cardGradient: [string, string] = isDark
    ? ['#1E1E2E', '#2D2D44']
    : [COLORS.gray[50], COLORS.gray[100]];

  const handleSelectOption = (optionId: string) => {
    if (currentQuestion.multiSelect) {
      const currentAnswers = (answers[currentQuestion.id] as string[]) || [];
      if (currentAnswers.includes(optionId)) {
        setAnswers({
          ...answers,
          [currentQuestion.id]: currentAnswers.filter((id) => id !== optionId),
        });
      } else {
        setAnswers({
          ...answers,
          [currentQuestion.id]: [...currentAnswers, optionId],
        });
      }
    } else {
      setAnswers({
        ...answers,
        [currentQuestion.id]: optionId,
      });
    }
  };

  const isOptionSelected = (optionId: string): boolean => {
    const answer = answers[currentQuestion.id];
    if (Array.isArray(answer)) {
      return answer.includes(optionId);
    }
    return answer === optionId;
  };

  const canProceed = (): boolean => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.multiSelect) {
      return Array.isArray(answer) && answer.length > 0;
    }
    return !!answer;
  };

  const findBestTemplate = (): PlanTemplate => {
    const days = parseInt(answers.days as string, 10) || 3;
    const experience = answers.experience as string;
    const goal = answers.goal as string;

    // Score-basierte Template-Auswahl
    let bestTemplate = PLAN_TEMPLATES[0];
    let bestScore = -1;

    PLAN_TEMPLATES.forEach((template) => {
      let score = 0;

      // Tage-Match (höchste Priorität)
      if (template.daysPerWeek === days) {
        score += 100;
      } else if (Math.abs(template.daysPerWeek - days) === 1) {
        score += 50;
      }

      // Level-Match
      if (template.level === experience) {
        score += 30;
      } else if (
        (template.level === 'intermediate' && experience === 'beginner') ||
        (template.level === 'intermediate' && experience === 'advanced')
      ) {
        score += 15;
      }

      // Goal-Match
      if (template.goal === goal) {
        score += 25;
      } else if (template.goal === 'muscle' && (goal === 'fitness' || goal === 'lose_weight')) {
        score += 10;
      }

      if (score > bestScore) {
        bestScore = score;
        bestTemplate = template;
      }
    });

    return bestTemplate;
  };

  const createPlanFromTemplate = (template: PlanTemplate) => {
    // Plan erstellen
    const planId = createPlan(template.name, 'fitness', 'template');

    // Workouts hinzufügen
    template.schedule.forEach(({ day, workout }) => {
      const workoutWithId: IPlannedWorkout = {
        ...workout,
        id: `workout-${Date.now()}-${day}`,
        exercises: workout.exercises.map((e, i) => ({
          ...e,
          id: `${planId}-${day}-${i}`,
          order: i,
        })),
      };
      setWorkoutForDay(planId, day, workoutWithId);
    });

    // Als aktiv setzen
    setActivePlan(planId);

    return planId;
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Bestes Template finden und Plan erstellen
      const template = findBestTemplate();
      const planId = createPlanFromTemplate(template);

      // Zum neuen Plan navigieren
      navigation.reset({
        index: 1,
        routes: [
          { name: 'Main' },
          { name: 'TrainingPlanDetail', params: { planId } },
        ],
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={[styles.backIcon, { color: colors.text }]}>{'<'}</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: `${progress * 100}%` },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {currentStep + 1} / {QUESTIONS.length}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={[styles.questionTitle, { color: colors.text }]}>
            {t(currentQuestion.title)}
          </Text>
          {currentQuestion.subtitle && (
            <Text style={[styles.questionSubtitle, { color: colors.textSecondary }]}>
              {t(currentQuestion.subtitle)}
            </Text>
          )}
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => {
            const isSelected = isOptionSelected(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                style={styles.optionButton}
                onPress={() => handleSelectOption(option.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isSelected ? ['#6366F1', '#8B5CF6'] : cardGradient}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                    !isSelected && { borderWidth: 1, borderColor: colors.border },
                  ]}
                >
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <View style={styles.optionTextContainer}>
                    <Text
                      style={[
                        styles.optionLabel,
                        { color: isSelected ? COLORS.white : colors.text },
                      ]}
                    >
                      {t(option.label)}
                    </Text>
                    {option.description && (
                      <Text
                        style={[
                          styles.optionDescription,
                          { color: isSelected ? 'rgba(255,255,255,0.7)' : colors.textSecondary },
                        ]}
                      >
                        {t(option.description)}
                      </Text>
                    )}
                  </View>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !canProceed() && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <LinearGradient
            colors={canProceed() ? ['#6366F1', '#8B5CF6'] : [COLORS.gray[400], COLORS.gray[400]]}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === QUESTIONS.length - 1
                ? t('questionnaire.finish')
                : t('questionnaire.next')}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
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
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  progressBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  progressText: {
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 120,
  },
  questionContainer: {
    marginBottom: SPACING.xl,
  },
  questionTitle: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  questionSubtitle: {
    fontSize: FONT_SIZES.base,
  },
  optionsContainer: {
    gap: SPACING.md,
  },
  optionButton: {
    width: '100%',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
  },
  optionCardSelected: {
    borderWidth: 0,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  optionDescription: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderTopWidth: 1,
  },
  nextButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
});
