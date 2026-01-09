// /workspaces/claude-workspace/fitnessapp/src/data/runningLibrary.ts
// Running Workouts und Trainingspläne

import {
  IRunningWorkout,
  IRunningPlan,
  TRunningWorkoutType,
  TRunningLevel,
  TRunningGoal,
} from '@/types';

// ============================================
// WORKOUT TEMPLATES
// ============================================
export const RUNNING_WORKOUTS: IRunningWorkout[] = [
  // Easy Runs
  {
    id: 'easy_run_20',
    name: 'Lockerer Lauf 20 Min',
    type: 'easy_run',
    description: 'Entspannter Lauf im Wohlfühltempo. Du solltest dich unterhalten können.',
    targetDuration: 20,
    warmup: { type: 'walk', duration: 3, effort: 'easy' },
    mainSet: [{ type: 'run', duration: 14, effort: 'easy' }],
    cooldown: { type: 'walk', duration: 3, effort: 'easy' },
    notes: 'Fokus auf entspannte Atmung und aufrechte Haltung.',
  },
  {
    id: 'easy_run_30',
    name: 'Lockerer Lauf 30 Min',
    type: 'easy_run',
    description: 'Entspannter Grundlagenlauf. Halte ein Tempo, bei dem du dich unterhalten könntest.',
    targetDuration: 30,
    warmup: { type: 'walk', duration: 5, effort: 'easy' },
    mainSet: [{ type: 'run', duration: 20, effort: 'easy' }],
    cooldown: { type: 'walk', duration: 5, effort: 'easy' },
  },
  {
    id: 'easy_run_45',
    name: 'Lockerer Lauf 45 Min',
    type: 'easy_run',
    description: 'Längerer Grundlagenlauf im entspannten Tempo.',
    targetDuration: 45,
    warmup: { type: 'walk', duration: 5, effort: 'easy' },
    mainSet: [{ type: 'run', duration: 35, effort: 'easy' }],
    cooldown: { type: 'walk', duration: 5, effort: 'easy' },
  },

  // Long Runs
  {
    id: 'long_run_60',
    name: 'Langer Lauf 60 Min',
    type: 'long_run',
    description: 'Ausdauerlauf zur Verbesserung der Grundlagenausdauer.',
    targetDuration: 60,
    warmup: { type: 'walk', duration: 5, effort: 'easy' },
    mainSet: [{ type: 'run', duration: 50, effort: 'easy' }],
    cooldown: { type: 'walk', duration: 5, effort: 'easy' },
    notes: 'Starte langsam und finde deinen Rhythmus. Trinke bei Bedarf.',
  },
  {
    id: 'long_run_75',
    name: 'Langer Lauf 75 Min',
    type: 'long_run',
    description: 'Längerer Ausdauerlauf für fortgeschrittene Läufer.',
    targetDuration: 75,
    warmup: { type: 'walk', duration: 5, effort: 'easy' },
    mainSet: [{ type: 'run', duration: 65, effort: 'easy' }],
    cooldown: { type: 'walk', duration: 5, effort: 'easy' },
  },
  {
    id: 'long_run_90',
    name: 'Langer Lauf 90 Min',
    type: 'long_run',
    description: 'Ausgedehnter Ausdauerlauf für die Marathonvorbereitung.',
    targetDuration: 90,
    warmup: { type: 'walk', duration: 5, effort: 'easy' },
    mainSet: [{ type: 'run', duration: 80, effort: 'easy' }],
    cooldown: { type: 'walk', duration: 5, effort: 'easy' },
    notes: 'Plane eine Route mit Wassermöglichkeit oder nimm Wasser mit.',
  },

  // Tempo Runs
  {
    id: 'tempo_run_20',
    name: 'Tempolauf 20 Min',
    type: 'tempo_run',
    description: 'Lauf im "komfortabel harten" Tempo. Du kannst kurze Sätze sprechen.',
    targetDuration: 35,
    warmup: { type: 'jog', duration: 10, effort: 'easy' },
    mainSet: [{ type: 'run', duration: 20, effort: 'moderate' }],
    cooldown: { type: 'jog', duration: 5, effort: 'easy' },
    notes: 'Das Tempo sollte sich "kontrolliert anstrengend" anfühlen.',
  },
  {
    id: 'tempo_run_30',
    name: 'Tempolauf 30 Min',
    type: 'tempo_run',
    description: 'Längerer Tempolauf zur Verbesserung der Laktatschwelle.',
    targetDuration: 45,
    warmup: { type: 'jog', duration: 10, effort: 'easy' },
    mainSet: [{ type: 'run', duration: 30, effort: 'moderate' }],
    cooldown: { type: 'jog', duration: 5, effort: 'easy' },
  },

  // Intervals
  {
    id: 'interval_400m',
    name: '400m Intervalle',
    type: 'interval',
    description: '8x 400m schnell mit 200m Trabpause. Klassisches Intervalltraining.',
    targetDuration: 40,
    warmup: { type: 'jog', duration: 10, effort: 'easy' },
    mainSet: [
      { type: 'sprint', distance: 0.4, effort: 'hard', reps: 8 },
      { type: 'jog', distance: 0.2, effort: 'easy', reps: 8 },
    ],
    cooldown: { type: 'jog', duration: 10, effort: 'easy' },
    notes: 'Die 400m sollten schnell, aber kontrolliert sein.',
  },
  {
    id: 'interval_800m',
    name: '800m Intervalle',
    type: 'interval',
    description: '5x 800m im 5K-Tempo mit 400m Trabpause.',
    targetDuration: 45,
    warmup: { type: 'jog', duration: 10, effort: 'easy' },
    mainSet: [
      { type: 'sprint', distance: 0.8, effort: 'hard', reps: 5 },
      { type: 'jog', distance: 0.4, effort: 'easy', reps: 5 },
    ],
    cooldown: { type: 'jog', duration: 10, effort: 'easy' },
  },
  {
    id: 'interval_1000m',
    name: '1000m Intervalle',
    type: 'interval',
    description: '4x 1000m im 10K-Tempo mit 2 Min Trabpause.',
    targetDuration: 50,
    warmup: { type: 'jog', duration: 10, effort: 'easy' },
    mainSet: [
      { type: 'sprint', distance: 1.0, effort: 'hard', reps: 4 },
      { type: 'jog', duration: 2, effort: 'easy', reps: 4 },
    ],
    cooldown: { type: 'jog', duration: 10, effort: 'easy' },
  },

  // Fartlek
  {
    id: 'fartlek_beginner',
    name: 'Fartlek Einsteiger',
    type: 'fartlek',
    description: 'Spielerisches Tempotraining mit Wechsel zwischen schnell und langsam.',
    targetDuration: 30,
    warmup: { type: 'jog', duration: 5, effort: 'easy' },
    mainSet: [
      { type: 'run', duration: 2, effort: 'moderate' },
      { type: 'jog', duration: 2, effort: 'easy' },
    ],
    cooldown: { type: 'walk', duration: 5, effort: 'easy' },
    notes: 'Wiederhole den Wechsel 5x. Höre auf deinen Körper.',
  },
  {
    id: 'fartlek_advanced',
    name: 'Fartlek Fortgeschritten',
    type: 'fartlek',
    description: 'Intensiveres Fartlek mit variierten Intervallen.',
    targetDuration: 45,
    warmup: { type: 'jog', duration: 10, effort: 'easy' },
    mainSet: [
      { type: 'sprint', duration: 1, effort: 'hard' },
      { type: 'jog', duration: 1, effort: 'easy' },
      { type: 'run', duration: 3, effort: 'moderate' },
      { type: 'jog', duration: 2, effort: 'easy' },
    ],
    cooldown: { type: 'jog', duration: 5, effort: 'easy' },
    notes: 'Wiederhole das Hauptset 4x.',
  },

  // Recovery
  {
    id: 'recovery_run',
    name: 'Regenerationslauf',
    type: 'recovery',
    description: 'Sehr leichter Lauf zur aktiven Erholung.',
    targetDuration: 20,
    warmup: { type: 'walk', duration: 3, effort: 'easy' },
    mainSet: [{ type: 'jog', duration: 14, effort: 'easy' }],
    cooldown: { type: 'walk', duration: 3, effort: 'easy' },
    notes: 'Bewusst langsam! Dieser Lauf dient der Regeneration.',
  },

  // Hill Training
  {
    id: 'hill_repeats',
    name: 'Bergsprints',
    type: 'hill_training',
    description: '8x Bergaufsprint (30 Sek) mit lockerem Bergablaufen.',
    targetDuration: 35,
    warmup: { type: 'jog', duration: 10, effort: 'easy' },
    mainSet: [
      { type: 'sprint', duration: 0.5, effort: 'hard', reps: 8 },
      { type: 'jog', duration: 1.5, effort: 'easy', reps: 8 },
    ],
    cooldown: { type: 'jog', duration: 5, effort: 'easy' },
    notes: 'Suche eine moderate Steigung (5-8%). Fokus auf kraftvollem Kniehub.',
  },
];

// ============================================
// TRAINING PLANS
// ============================================
export const RUNNING_PLANS: IRunningPlan[] = [
  // 5K Beginner
  {
    id: '5k_beginner_8weeks',
    name: '5K Einsteiger',
    goal: '5k',
    level: 'beginner',
    durationWeeks: 8,
    description: 'Vom Couch zum 5K in 8 Wochen. Perfekt für absolute Anfänger.',
    weeklySchedule: [
      {
        week: 1,
        totalDistance: 6,
        focusNote: 'Gewöhnung an regelmäßiges Laufen',
        days: [
          { day: 'mon', workout: null },
          { day: 'tue', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_20')! },
          { day: 'wed', workout: null },
          { day: 'thu', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_20')! },
          { day: 'fri', workout: null },
          { day: 'sat', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_20')! },
          { day: 'sun', workout: null },
        ],
      },
      {
        week: 2,
        totalDistance: 8,
        focusNote: 'Langsam steigern',
        days: [
          { day: 'mon', workout: null },
          { day: 'tue', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_20')! },
          { day: 'wed', workout: null },
          { day: 'thu', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'fri', workout: null },
          { day: 'sat', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_20')! },
          { day: 'sun', workout: null },
        ],
      },
      {
        week: 3,
        totalDistance: 10,
        focusNote: 'Erste Steigerung',
        days: [
          { day: 'mon', workout: null },
          { day: 'tue', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'wed', workout: null },
          { day: 'thu', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'fri', workout: null },
          { day: 'sat', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'sun', workout: null },
        ],
      },
      {
        week: 4,
        totalDistance: 12,
        focusNote: 'Spielerisch variieren',
        days: [
          { day: 'mon', workout: null },
          { day: 'tue', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'wed', workout: null },
          { day: 'thu', workout: RUNNING_WORKOUTS.find(w => w.id === 'fartlek_beginner')! },
          { day: 'fri', workout: null },
          { day: 'sat', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'sun', workout: null },
        ],
      },
      {
        week: 5,
        totalDistance: 14,
        focusNote: 'Längere Einheit einbauen',
        days: [
          { day: 'mon', workout: null },
          { day: 'tue', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'wed', workout: null },
          { day: 'thu', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'fri', workout: null },
          { day: 'sat', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_45')! },
          { day: 'sun', workout: null },
        ],
      },
      {
        week: 6,
        totalDistance: 16,
        focusNote: 'Tempo kennenlernen',
        days: [
          { day: 'mon', workout: null },
          { day: 'tue', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'wed', workout: null },
          { day: 'thu', workout: RUNNING_WORKOUTS.find(w => w.id === 'tempo_run_20')! },
          { day: 'fri', workout: null },
          { day: 'sat', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_45')! },
          { day: 'sun', workout: null },
        ],
      },
      {
        week: 7,
        totalDistance: 15,
        focusNote: 'Tapering beginnt',
        days: [
          { day: 'mon', workout: null },
          { day: 'tue', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'wed', workout: null },
          { day: 'thu', workout: RUNNING_WORKOUTS.find(w => w.id === 'fartlek_beginner')! },
          { day: 'fri', workout: null },
          { day: 'sat', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'sun', workout: null },
        ],
      },
      {
        week: 8,
        totalDistance: 10,
        focusNote: 'Rennwoche - Frisch bleiben!',
        days: [
          { day: 'mon', workout: null },
          { day: 'tue', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_20')! },
          { day: 'wed', workout: null },
          { day: 'thu', workout: RUNNING_WORKOUTS.find(w => w.id === 'recovery_run')! },
          { day: 'fri', workout: null },
          { day: 'sat', workout: null },
          { day: 'sun', workout: null }, // Race Day
        ],
      },
    ],
  },

  // 10K Intermediate
  {
    id: '10k_intermediate_8weeks',
    name: '10K Fortgeschritten',
    goal: '10k',
    level: 'intermediate',
    durationWeeks: 8,
    description: 'Für Läufer, die bereits 5K laufen können und sich auf 10K vorbereiten möchten.',
    weeklySchedule: [
      {
        week: 1,
        totalDistance: 25,
        focusNote: 'Basis aufbauen',
        days: [
          { day: 'mon', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'tue', workout: null },
          { day: 'wed', workout: RUNNING_WORKOUTS.find(w => w.id === 'tempo_run_20')! },
          { day: 'thu', workout: null },
          { day: 'fri', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'sat', workout: null },
          { day: 'sun', workout: RUNNING_WORKOUTS.find(w => w.id === 'long_run_60')! },
        ],
      },
      {
        week: 2,
        totalDistance: 28,
        focusNote: 'Intervalle einführen',
        days: [
          { day: 'mon', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'tue', workout: null },
          { day: 'wed', workout: RUNNING_WORKOUTS.find(w => w.id === 'interval_400m')! },
          { day: 'thu', workout: null },
          { day: 'fri', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'sat', workout: null },
          { day: 'sun', workout: RUNNING_WORKOUTS.find(w => w.id === 'long_run_60')! },
        ],
      },
      {
        week: 3,
        totalDistance: 32,
        focusNote: 'Umfang steigern',
        days: [
          { day: 'mon', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_45')! },
          { day: 'tue', workout: null },
          { day: 'wed', workout: RUNNING_WORKOUTS.find(w => w.id === 'tempo_run_20')! },
          { day: 'thu', workout: RUNNING_WORKOUTS.find(w => w.id === 'recovery_run')! },
          { day: 'fri', workout: null },
          { day: 'sat', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'sun', workout: RUNNING_WORKOUTS.find(w => w.id === 'long_run_75')! },
        ],
      },
      {
        week: 4,
        totalDistance: 28,
        focusNote: 'Erholungswoche',
        days: [
          { day: 'mon', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'tue', workout: null },
          { day: 'wed', workout: RUNNING_WORKOUTS.find(w => w.id === 'fartlek_beginner')! },
          { day: 'thu', workout: null },
          { day: 'fri', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'sat', workout: null },
          { day: 'sun', workout: RUNNING_WORKOUTS.find(w => w.id === 'long_run_60')! },
        ],
      },
      {
        week: 5,
        totalDistance: 35,
        focusNote: 'Intensität erhöhen',
        days: [
          { day: 'mon', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_45')! },
          { day: 'tue', workout: null },
          { day: 'wed', workout: RUNNING_WORKOUTS.find(w => w.id === 'interval_800m')! },
          { day: 'thu', workout: RUNNING_WORKOUTS.find(w => w.id === 'recovery_run')! },
          { day: 'fri', workout: null },
          { day: 'sat', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'sun', workout: RUNNING_WORKOUTS.find(w => w.id === 'long_run_75')! },
        ],
      },
      {
        week: 6,
        totalDistance: 38,
        focusNote: 'Peak-Woche',
        days: [
          { day: 'mon', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_45')! },
          { day: 'tue', workout: null },
          { day: 'wed', workout: RUNNING_WORKOUTS.find(w => w.id === 'tempo_run_30')! },
          { day: 'thu', workout: RUNNING_WORKOUTS.find(w => w.id === 'recovery_run')! },
          { day: 'fri', workout: null },
          { day: 'sat', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'sun', workout: RUNNING_WORKOUTS.find(w => w.id === 'long_run_75')! },
        ],
      },
      {
        week: 7,
        totalDistance: 30,
        focusNote: 'Tapering',
        days: [
          { day: 'mon', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'tue', workout: null },
          { day: 'wed', workout: RUNNING_WORKOUTS.find(w => w.id === 'interval_400m')! },
          { day: 'thu', workout: null },
          { day: 'fri', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'sat', workout: null },
          { day: 'sun', workout: RUNNING_WORKOUTS.find(w => w.id === 'long_run_60')! },
        ],
      },
      {
        week: 8,
        totalDistance: 18,
        focusNote: 'Rennwoche',
        days: [
          { day: 'mon', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'tue', workout: null },
          { day: 'wed', workout: RUNNING_WORKOUTS.find(w => w.id === 'fartlek_beginner')! },
          { day: 'thu', workout: RUNNING_WORKOUTS.find(w => w.id === 'recovery_run')! },
          { day: 'fri', workout: null },
          { day: 'sat', workout: null },
          { day: 'sun', workout: null }, // Race Day
        ],
      },
    ],
  },

  // General Fitness Running
  {
    id: 'general_fitness_4weeks',
    name: 'Laufen für Fitness',
    goal: 'general_fitness',
    level: 'beginner',
    durationWeeks: 4,
    description: 'Einfacher Plan für allgemeine Fitness. 3x pro Woche laufen.',
    weeklySchedule: [
      {
        week: 1,
        totalDistance: 8,
        focusNote: 'Einstieg',
        days: [
          { day: 'mon', workout: null },
          { day: 'tue', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_20')! },
          { day: 'wed', workout: null },
          { day: 'thu', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_20')! },
          { day: 'fri', workout: null },
          { day: 'sat', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'sun', workout: null },
        ],
      },
      {
        week: 2,
        totalDistance: 10,
        focusNote: 'Steigerung',
        days: [
          { day: 'mon', workout: null },
          { day: 'tue', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'wed', workout: null },
          { day: 'thu', workout: RUNNING_WORKOUTS.find(w => w.id === 'fartlek_beginner')! },
          { day: 'fri', workout: null },
          { day: 'sat', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'sun', workout: null },
        ],
      },
      {
        week: 3,
        totalDistance: 12,
        focusNote: 'Längere Einheiten',
        days: [
          { day: 'mon', workout: null },
          { day: 'tue', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'wed', workout: null },
          { day: 'thu', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'fri', workout: null },
          { day: 'sat', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_45')! },
          { day: 'sun', workout: null },
        ],
      },
      {
        week: 4,
        totalDistance: 14,
        focusNote: 'Abwechslung',
        days: [
          { day: 'mon', workout: null },
          { day: 'tue', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_30')! },
          { day: 'wed', workout: null },
          { day: 'thu', workout: RUNNING_WORKOUTS.find(w => w.id === 'tempo_run_20')! },
          { day: 'fri', workout: null },
          { day: 'sat', workout: RUNNING_WORKOUTS.find(w => w.id === 'easy_run_45')! },
          { day: 'sun', workout: null },
        ],
      },
    ],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================
export const getRunningWorkoutById = (id: string): IRunningWorkout | undefined => {
  return RUNNING_WORKOUTS.find((w) => w.id === id);
};

export const getRunningWorkoutsByType = (type: TRunningWorkoutType): IRunningWorkout[] => {
  return RUNNING_WORKOUTS.filter((w) => w.type === type);
};

export const getRunningPlanById = (id: string): IRunningPlan | undefined => {
  return RUNNING_PLANS.find((p) => p.id === id);
};

export const getRunningPlansByGoal = (goal: TRunningGoal): IRunningPlan[] => {
  return RUNNING_PLANS.filter((p) => p.goal === goal);
};

export const getRunningPlansByLevel = (level: TRunningLevel): IRunningPlan[] => {
  return RUNNING_PLANS.filter((p) => p.level === level);
};

// Workout Type Labels
export const RUNNING_WORKOUT_TYPE_LABELS: Record<TRunningWorkoutType, { de: string; en: string; icon: string }> = {
  easy_run: { de: 'Lockerer Lauf', en: 'Easy Run', icon: '🏃' },
  long_run: { de: 'Langer Lauf', en: 'Long Run', icon: '🛤️' },
  tempo_run: { de: 'Tempolauf', en: 'Tempo Run', icon: '⚡' },
  interval: { de: 'Intervalle', en: 'Intervals', icon: '📊' },
  fartlek: { de: 'Fartlek', en: 'Fartlek', icon: '🎲' },
  recovery: { de: 'Regeneration', en: 'Recovery', icon: '🧘' },
  hill_training: { de: 'Bergtraining', en: 'Hill Training', icon: '⛰️' },
  race: { de: 'Wettkampf', en: 'Race', icon: '🏆' },
};

// Goal Labels
export const RUNNING_GOAL_LABELS: Record<TRunningGoal, { de: string; en: string }> = {
  '5k': { de: '5 Kilometer', en: '5K' },
  '10k': { de: '10 Kilometer', en: '10K' },
  half_marathon: { de: 'Halbmarathon', en: 'Half Marathon' },
  marathon: { de: 'Marathon', en: 'Marathon' },
  general_fitness: { de: 'Allgemeine Fitness', en: 'General Fitness' },
  speed_improvement: { de: 'Schneller werden', en: 'Speed Improvement' },
};

// Level Labels
export const RUNNING_LEVEL_LABELS: Record<TRunningLevel, { de: string; en: string }> = {
  beginner: { de: 'Anfänger', en: 'Beginner' },
  intermediate: { de: 'Fortgeschritten', en: 'Intermediate' },
  advanced: { de: 'Profi', en: 'Advanced' },
};
