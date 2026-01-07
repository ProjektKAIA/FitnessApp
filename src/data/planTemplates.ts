// /workspaces/claude-workspace/fitnessapp/src/data/planTemplates.ts
// Vordefinierte Trainingsplan-Templates basierend auf bewährten Splits

import { TTrainingDay, IPlannedWorkout, IPlannedExercise, TMuscleGroup } from '@/types';

export interface PlanTemplate {
  id: string;
  name: string;
  description: string;
  category: 'fullbody' | 'upper_lower' | 'ppl' | 'bro_split';
  daysPerWeek: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  goal: 'muscle' | 'strength' | 'fitness' | 'lose_weight';
  schedule: {
    day: TTrainingDay;
    workout: Omit<IPlannedWorkout, 'id'>;
  }[];
}

// Helper zum Erstellen von Übungen
const createExercise = (
  name: string,
  muscleGroup: TMuscleGroup,
  sets: number,
  reps: string,
  exerciseId?: string
): Omit<IPlannedExercise, 'id' | 'order'> => ({
  exerciseId,
  name,
  muscleGroup,
  targetSets: sets,
  targetReps: reps,
});

// ============================================
// GANZKÖRPER PLÄNE (2-3 Tage/Woche)
// ============================================

const FULLBODY_BEGINNER: PlanTemplate = {
  id: 'fullbody_beginner',
  name: 'Ganzkörper Einsteiger',
  description: 'Perfekt für Anfänger. 2x pro Woche den ganzen Körper trainieren mit Grundübungen.',
  category: 'fullbody',
  daysPerWeek: 2,
  level: 'beginner',
  goal: 'fitness',
  schedule: [
    {
      day: 'mon',
      workout: {
        name: 'Ganzkörper A',
        direction: 'gym',
        exercises: [
          createExercise('Kniebeuge', 'legs', 3, '10-12', 'squat'),
          createExercise('Bankdrücken', 'chest', 3, '10-12', 'bench_press'),
          createExercise('Latzug', 'back', 3, '10-12', 'lat_pulldown'),
          createExercise('Schulterdrücken', 'shoulders', 3, '10-12', 'overhead_press'),
          createExercise('Beinbeuger', 'legs', 2, '12-15', 'leg_curl'),
          createExercise('Plank', 'core', 3, '30-45s', 'plank'),
        ].map((e, i) => ({ ...e, id: `fb-a-${i}`, order: i })),
      },
    },
    {
      day: 'thu',
      workout: {
        name: 'Ganzkörper B',
        direction: 'gym',
        exercises: [
          createExercise('Beinpresse', 'legs', 3, '10-12', 'leg_press'),
          createExercise('Schrägbankdrücken', 'chest', 3, '10-12', 'incline_bench'),
          createExercise('Rudern am Kabel', 'back', 3, '10-12', 'seated_row'),
          createExercise('Seitheben', 'shoulders', 3, '12-15', 'lateral_raise'),
          createExercise('Rumänisches Kreuzheben', 'legs', 3, '10-12', 'romanian_deadlift'),
          createExercise('Crunches', 'core', 3, '15-20', 'crunches'),
        ].map((e, i) => ({ ...e, id: `fb-b-${i}`, order: i })),
      },
    },
  ],
};

const FULLBODY_INTERMEDIATE: PlanTemplate = {
  id: 'fullbody_intermediate',
  name: 'Ganzkörper Fortgeschritten',
  description: '3x pro Woche mit höherem Volumen. Ideal für Muskelaufbau bei begrenzter Zeit.',
  category: 'fullbody',
  daysPerWeek: 3,
  level: 'intermediate',
  goal: 'muscle',
  schedule: [
    {
      day: 'mon',
      workout: {
        name: 'Ganzkörper A - Push Fokus',
        direction: 'gym',
        exercises: [
          createExercise('Kniebeuge', 'legs', 4, '6-8', 'squat'),
          createExercise('Bankdrücken', 'chest', 4, '6-8', 'bench_press'),
          createExercise('Klimmzüge', 'back', 3, '8-10', 'pullups'),
          createExercise('Schulterdrücken', 'shoulders', 3, '8-10', 'overhead_press'),
          createExercise('Bizeps Curls', 'biceps', 2, '10-12', 'bicep_curl'),
          createExercise('Trizepsdrücken', 'triceps', 2, '10-12', 'tricep_pushdown'),
        ].map((e, i) => ({ ...e, id: `fbi-a-${i}`, order: i })),
      },
    },
    {
      day: 'wed',
      workout: {
        name: 'Ganzkörper B - Pull Fokus',
        direction: 'gym',
        exercises: [
          createExercise('Kreuzheben', 'back', 4, '5-6', 'deadlift'),
          createExercise('Schrägbankdrücken', 'chest', 3, '8-10', 'incline_bench'),
          createExercise('Langhantelrudern', 'back', 4, '6-8', 'barbell_row'),
          createExercise('Beinpresse', 'legs', 3, '10-12', 'leg_press'),
          createExercise('Seitheben', 'shoulders', 3, '12-15', 'lateral_raise'),
          createExercise('Face Pulls', 'back', 3, '12-15', 'face_pulls'),
        ].map((e, i) => ({ ...e, id: `fbi-b-${i}`, order: i })),
      },
    },
    {
      day: 'fri',
      workout: {
        name: 'Ganzkörper C - Legs Fokus',
        direction: 'gym',
        exercises: [
          createExercise('Kniebeuge', 'legs', 4, '8-10', 'squat'),
          createExercise('Rumänisches Kreuzheben', 'legs', 3, '8-10', 'romanian_deadlift'),
          createExercise('Dips', 'chest', 3, '8-12', 'dips'),
          createExercise('Latzug', 'back', 3, '8-10', 'lat_pulldown'),
          createExercise('Wadenheben', 'legs', 4, '12-15', 'calf_raise'),
          createExercise('Beinheben', 'core', 3, '12-15', 'leg_raise'),
        ].map((e, i) => ({ ...e, id: `fbi-c-${i}`, order: i })),
      },
    },
  ],
};

const FULLBODY_STRENGTH: PlanTemplate = {
  id: 'fullbody_strength',
  name: 'Ganzkörper Kraft',
  description: 'Fokus auf die großen Grundübungen mit schwerem Gewicht. 3x pro Woche.',
  category: 'fullbody',
  daysPerWeek: 3,
  level: 'intermediate',
  goal: 'strength',
  schedule: [
    {
      day: 'mon',
      workout: {
        name: 'Kraft A - Squat',
        direction: 'gym',
        exercises: [
          createExercise('Kniebeuge', 'legs', 5, '5', 'squat'),
          createExercise('Bankdrücken', 'chest', 4, '5', 'bench_press'),
          createExercise('Langhantelrudern', 'back', 4, '5', 'barbell_row'),
          createExercise('Dips', 'chest', 3, '6-8', 'dips'),
          createExercise('Plank', 'core', 3, '45-60s', 'plank'),
        ].map((e, i) => ({ ...e, id: `fbs-a-${i}`, order: i })),
      },
    },
    {
      day: 'wed',
      workout: {
        name: 'Kraft B - Deadlift',
        direction: 'gym',
        exercises: [
          createExercise('Kreuzheben', 'back', 5, '5', 'deadlift'),
          createExercise('Schulterdrücken', 'shoulders', 4, '5', 'overhead_press'),
          createExercise('Klimmzüge', 'back', 4, '6-8', 'pullups'),
          createExercise('Ausfallschritte', 'legs', 3, '8/Seite', 'lunges'),
          createExercise('Russian Twist', 'core', 3, '20', 'russian_twist'),
        ].map((e, i) => ({ ...e, id: `fbs-b-${i}`, order: i })),
      },
    },
    {
      day: 'fri',
      workout: {
        name: 'Kraft C - Bench',
        direction: 'gym',
        exercises: [
          createExercise('Bankdrücken', 'chest', 5, '5', 'bench_press'),
          createExercise('Kniebeuge', 'legs', 4, '6-8', 'squat'),
          createExercise('Latzug', 'back', 4, '6-8', 'lat_pulldown'),
          createExercise('Rumänisches Kreuzheben', 'legs', 3, '8', 'romanian_deadlift'),
          createExercise('Face Pulls', 'back', 3, '12-15', 'face_pulls'),
        ].map((e, i) => ({ ...e, id: `fbs-c-${i}`, order: i })),
      },
    },
  ],
};

// ============================================
// UPPER/LOWER PLÄNE (4 Tage/Woche)
// ============================================

const UPPER_LOWER_CLASSIC: PlanTemplate = {
  id: 'upper_lower_classic',
  name: 'Upper/Lower Klassisch',
  description: '4 Tage Split: 2x Oberkörper, 2x Unterkörper. Ausgewogenes Training.',
  category: 'upper_lower',
  daysPerWeek: 4,
  level: 'intermediate',
  goal: 'muscle',
  schedule: [
    {
      day: 'mon',
      workout: {
        name: 'Upper A',
        direction: 'gym',
        exercises: [
          createExercise('Bankdrücken', 'chest', 4, '6-8', 'bench_press'),
          createExercise('Langhantelrudern', 'back', 4, '6-8', 'barbell_row'),
          createExercise('Schulterdrücken', 'shoulders', 3, '8-10', 'overhead_press'),
          createExercise('Latzug', 'back', 3, '8-10', 'lat_pulldown'),
          createExercise('Seitheben', 'shoulders', 3, '12-15', 'lateral_raise'),
          createExercise('Bizeps Curls', 'biceps', 3, '10-12', 'bicep_curl'),
          createExercise('Trizepsdrücken', 'triceps', 3, '10-12', 'tricep_pushdown'),
        ].map((e, i) => ({ ...e, id: `ulc-ua-${i}`, order: i })),
      },
    },
    {
      day: 'tue',
      workout: {
        name: 'Lower A',
        direction: 'gym',
        exercises: [
          createExercise('Kniebeuge', 'legs', 4, '6-8', 'squat'),
          createExercise('Rumänisches Kreuzheben', 'legs', 4, '8-10', 'romanian_deadlift'),
          createExercise('Beinpresse', 'legs', 3, '10-12', 'leg_press'),
          createExercise('Beinbeuger', 'legs', 3, '10-12', 'leg_curl'),
          createExercise('Wadenheben', 'legs', 4, '12-15', 'calf_raise'),
          createExercise('Beinheben', 'core', 3, '12-15', 'leg_raise'),
        ].map((e, i) => ({ ...e, id: `ulc-la-${i}`, order: i })),
      },
    },
    {
      day: 'thu',
      workout: {
        name: 'Upper B',
        direction: 'gym',
        exercises: [
          createExercise('Schrägbankdrücken', 'chest', 4, '8-10', 'incline_bench'),
          createExercise('Klimmzüge', 'back', 4, '6-10', 'pullups'),
          createExercise('Butterfly', 'chest', 3, '10-12', 'dumbbell_fly'),
          createExercise('Rudern am Kabel', 'back', 3, '10-12', 'seated_row'),
          createExercise('Reverse Fly', 'shoulders', 3, '12-15', 'rear_delt_fly'),
          createExercise('Hammer Curls', 'biceps', 3, '10-12', 'hammer_curl'),
          createExercise('Skull Crusher', 'triceps', 3, '10-12', 'skull_crusher'),
        ].map((e, i) => ({ ...e, id: `ulc-ub-${i}`, order: i })),
      },
    },
    {
      day: 'fri',
      workout: {
        name: 'Lower B',
        direction: 'gym',
        exercises: [
          createExercise('Kreuzheben', 'back', 4, '5-6', 'deadlift'),
          createExercise('Ausfallschritte', 'legs', 3, '10/Seite', 'lunges'),
          createExercise('Beinstrecker', 'legs', 3, '12-15', 'leg_extension'),
          createExercise('Beinbeuger', 'legs', 3, '12-15', 'leg_curl'),
          createExercise('Hip Thrust', 'glutes', 3, '10-12', 'hip_thrust'),
          createExercise('Cable Crunch', 'core', 3, '12-15', 'cable_crunch'),
        ].map((e, i) => ({ ...e, id: `ulc-lb-${i}`, order: i })),
      },
    },
  ],
};

const UPPER_LOWER_HYPERTROPHY: PlanTemplate = {
  id: 'upper_lower_hypertrophy',
  name: 'Upper/Lower Hypertrophie',
  description: 'Fokus auf Muskelwachstum mit höherem Volumen und moderaten Gewichten.',
  category: 'upper_lower',
  daysPerWeek: 4,
  level: 'intermediate',
  goal: 'muscle',
  schedule: [
    {
      day: 'mon',
      workout: {
        name: 'Upper - Push Fokus',
        direction: 'gym',
        exercises: [
          createExercise('Bankdrücken', 'chest', 4, '8-10', 'bench_press'),
          createExercise('Schrägbankdrücken', 'chest', 3, '10-12', 'incline_bench'),
          createExercise('Latzug', 'back', 4, '8-10', 'lat_pulldown'),
          createExercise('Schulterdrücken', 'shoulders', 3, '10-12', 'overhead_press'),
          createExercise('Cable Crossover', 'chest', 3, '12-15', 'cable_crossover'),
          createExercise('Seitheben', 'shoulders', 4, '12-15', 'lateral_raise'),
          createExercise('Trizepsdrücken', 'triceps', 3, '12-15', 'tricep_pushdown'),
        ].map((e, i) => ({ ...e, id: `ulh-up-${i}`, order: i })),
      },
    },
    {
      day: 'tue',
      workout: {
        name: 'Lower - Quad Fokus',
        direction: 'gym',
        exercises: [
          createExercise('Kniebeuge', 'legs', 4, '8-10', 'squat'),
          createExercise('Beinpresse', 'legs', 4, '10-12', 'leg_press'),
          createExercise('Ausfallschritte', 'legs', 3, '10/Seite', 'lunges'),
          createExercise('Beinstrecker', 'legs', 3, '12-15', 'leg_extension'),
          createExercise('Beinbeuger', 'legs', 3, '12-15', 'leg_curl'),
          createExercise('Wadenheben', 'legs', 4, '15-20', 'calf_raise'),
        ].map((e, i) => ({ ...e, id: `ulh-lq-${i}`, order: i })),
      },
    },
    {
      day: 'thu',
      workout: {
        name: 'Upper - Pull Fokus',
        direction: 'gym',
        exercises: [
          createExercise('Klimmzüge', 'back', 4, '6-10', 'pullups'),
          createExercise('Langhantelrudern', 'back', 4, '8-10', 'barbell_row'),
          createExercise('Rudern am Kabel', 'back', 3, '10-12', 'seated_row'),
          createExercise('Face Pulls', 'back', 3, '12-15', 'face_pulls'),
          createExercise('Reverse Fly', 'shoulders', 3, '12-15', 'rear_delt_fly'),
          createExercise('Bizeps Curls', 'biceps', 3, '10-12', 'bicep_curl'),
          createExercise('Hammer Curls', 'biceps', 3, '10-12', 'hammer_curl'),
        ].map((e, i) => ({ ...e, id: `ulh-upl-${i}`, order: i })),
      },
    },
    {
      day: 'fri',
      workout: {
        name: 'Lower - Hamstring Fokus',
        direction: 'gym',
        exercises: [
          createExercise('Rumänisches Kreuzheben', 'legs', 4, '8-10', 'romanian_deadlift'),
          createExercise('Hip Thrust', 'glutes', 4, '10-12', 'hip_thrust'),
          createExercise('Beinbeuger', 'legs', 4, '10-12', 'leg_curl'),
          createExercise('Bulgarische Kniebeuge', 'legs', 3, '10/Seite', 'lunges'),
          createExercise('Cable Kickback', 'glutes', 3, '12-15', 'cable_kickback'),
          createExercise('Beinheben', 'core', 3, '12-15', 'leg_raise'),
        ].map((e, i) => ({ ...e, id: `ulh-lh-${i}`, order: i })),
      },
    },
  ],
};

const UPPER_LOWER_STRENGTH: PlanTemplate = {
  id: 'upper_lower_strength',
  name: 'Upper/Lower Kraft',
  description: 'Kraftorientierter 4-Tage Split mit Fokus auf progressive Überlastung.',
  category: 'upper_lower',
  daysPerWeek: 4,
  level: 'advanced',
  goal: 'strength',
  schedule: [
    {
      day: 'mon',
      workout: {
        name: 'Upper - Heavy',
        direction: 'gym',
        exercises: [
          createExercise('Bankdrücken', 'chest', 5, '5', 'bench_press'),
          createExercise('Klimmzüge', 'back', 5, '5', 'pullups'),
          createExercise('Schulterdrücken', 'shoulders', 4, '5', 'overhead_press'),
          createExercise('Langhantelrudern', 'back', 4, '5', 'barbell_row'),
          createExercise('Dips', 'chest', 3, '6-8', 'dips'),
        ].map((e, i) => ({ ...e, id: `uls-uh-${i}`, order: i })),
      },
    },
    {
      day: 'tue',
      workout: {
        name: 'Lower - Heavy',
        direction: 'gym',
        exercises: [
          createExercise('Kniebeuge', 'legs', 5, '5', 'squat'),
          createExercise('Rumänisches Kreuzheben', 'legs', 4, '6', 'romanian_deadlift'),
          createExercise('Beinpresse', 'legs', 3, '8', 'leg_press'),
          createExercise('Wadenheben', 'legs', 4, '10', 'calf_raise'),
          createExercise('Plank', 'core', 3, '60s', 'plank'),
        ].map((e, i) => ({ ...e, id: `uls-lh-${i}`, order: i })),
      },
    },
    {
      day: 'thu',
      workout: {
        name: 'Upper - Volume',
        direction: 'gym',
        exercises: [
          createExercise('Schrägbankdrücken', 'chest', 4, '8', 'incline_bench'),
          createExercise('Latzug', 'back', 4, '8', 'lat_pulldown'),
          createExercise('Butterfly', 'chest', 3, '10', 'dumbbell_fly'),
          createExercise('Rudern am Kabel', 'back', 3, '10', 'seated_row'),
          createExercise('Seitheben', 'shoulders', 3, '12', 'lateral_raise'),
          createExercise('Bizeps Curls', 'biceps', 3, '10', 'bicep_curl'),
          createExercise('Trizepsdrücken', 'triceps', 3, '10', 'tricep_pushdown'),
        ].map((e, i) => ({ ...e, id: `uls-uv-${i}`, order: i })),
      },
    },
    {
      day: 'fri',
      workout: {
        name: 'Lower - Volume',
        direction: 'gym',
        exercises: [
          createExercise('Kreuzheben', 'back', 4, '5', 'deadlift'),
          createExercise('Ausfallschritte', 'legs', 3, '10/Seite', 'lunges'),
          createExercise('Beinstrecker', 'legs', 3, '12', 'leg_extension'),
          createExercise('Beinbeuger', 'legs', 3, '12', 'leg_curl'),
          createExercise('Hip Thrust', 'glutes', 3, '10', 'hip_thrust'),
          createExercise('Cable Crunch', 'core', 3, '15', 'cable_crunch'),
        ].map((e, i) => ({ ...e, id: `uls-lv-${i}`, order: i })),
      },
    },
  ],
};

// ============================================
// PUSH/PULL/LEGS PLÄNE (3-6 Tage/Woche)
// ============================================

const PPL_3DAY: PlanTemplate = {
  id: 'ppl_3day',
  name: 'Push/Pull/Legs 3-Tage',
  description: 'Klassischer PPL für 3 Trainingstage. Jede Muskelgruppe 1x pro Woche.',
  category: 'ppl',
  daysPerWeek: 3,
  level: 'intermediate',
  goal: 'muscle',
  schedule: [
    {
      day: 'mon',
      workout: {
        name: 'Push',
        direction: 'gym',
        exercises: [
          createExercise('Bankdrücken', 'chest', 4, '6-8', 'bench_press'),
          createExercise('Schrägbankdrücken', 'chest', 3, '8-10', 'incline_bench'),
          createExercise('Schulterdrücken', 'shoulders', 4, '8-10', 'overhead_press'),
          createExercise('Butterfly', 'chest', 3, '10-12', 'dumbbell_fly'),
          createExercise('Seitheben', 'shoulders', 4, '12-15', 'lateral_raise'),
          createExercise('Trizepsdrücken', 'triceps', 3, '10-12', 'tricep_pushdown'),
          createExercise('Überkopf-Extension', 'triceps', 3, '10-12', 'overhead_extension'),
        ].map((e, i) => ({ ...e, id: `ppl3-push-${i}`, order: i })),
      },
    },
    {
      day: 'wed',
      workout: {
        name: 'Pull',
        direction: 'gym',
        exercises: [
          createExercise('Kreuzheben', 'back', 4, '5-6', 'deadlift'),
          createExercise('Klimmzüge', 'back', 4, '6-10', 'pullups'),
          createExercise('Langhantelrudern', 'back', 4, '8-10', 'barbell_row'),
          createExercise('Latzug', 'back', 3, '10-12', 'lat_pulldown'),
          createExercise('Face Pulls', 'back', 3, '12-15', 'face_pulls'),
          createExercise('Bizeps Curls', 'biceps', 3, '10-12', 'bicep_curl'),
          createExercise('Hammer Curls', 'biceps', 3, '10-12', 'hammer_curl'),
        ].map((e, i) => ({ ...e, id: `ppl3-pull-${i}`, order: i })),
      },
    },
    {
      day: 'fri',
      workout: {
        name: 'Legs',
        direction: 'gym',
        exercises: [
          createExercise('Kniebeuge', 'legs', 4, '6-8', 'squat'),
          createExercise('Rumänisches Kreuzheben', 'legs', 4, '8-10', 'romanian_deadlift'),
          createExercise('Beinpresse', 'legs', 3, '10-12', 'leg_press'),
          createExercise('Beinstrecker', 'legs', 3, '12-15', 'leg_extension'),
          createExercise('Beinbeuger', 'legs', 3, '12-15', 'leg_curl'),
          createExercise('Wadenheben', 'legs', 4, '12-15', 'calf_raise'),
          createExercise('Beinheben', 'core', 3, '12-15', 'leg_raise'),
        ].map((e, i) => ({ ...e, id: `ppl3-legs-${i}`, order: i })),
      },
    },
  ],
};

const PPL_6DAY: PlanTemplate = {
  id: 'ppl_6day',
  name: 'Push/Pull/Legs 6-Tage',
  description: 'Intensiver PPL für maximales Muskelwachstum. Jede Muskelgruppe 2x pro Woche.',
  category: 'ppl',
  daysPerWeek: 6,
  level: 'advanced',
  goal: 'muscle',
  schedule: [
    {
      day: 'mon',
      workout: {
        name: 'Push 1 - Kraft',
        direction: 'gym',
        exercises: [
          createExercise('Bankdrücken', 'chest', 5, '5', 'bench_press'),
          createExercise('Schulterdrücken', 'shoulders', 4, '6-8', 'overhead_press'),
          createExercise('Schrägbankdrücken', 'chest', 3, '8-10', 'incline_bench'),
          createExercise('Seitheben', 'shoulders', 4, '12-15', 'lateral_raise'),
          createExercise('Trizepsdrücken', 'triceps', 3, '10-12', 'tricep_pushdown'),
          createExercise('Frontheben', 'shoulders', 2, '12-15', 'front_raise'),
        ].map((e, i) => ({ ...e, id: `ppl6-push1-${i}`, order: i })),
      },
    },
    {
      day: 'tue',
      workout: {
        name: 'Pull 1 - Kraft',
        direction: 'gym',
        exercises: [
          createExercise('Kreuzheben', 'back', 5, '5', 'deadlift'),
          createExercise('Klimmzüge', 'back', 4, '6-8', 'pullups'),
          createExercise('Langhantelrudern', 'back', 4, '6-8', 'barbell_row'),
          createExercise('Face Pulls', 'back', 3, '12-15', 'face_pulls'),
          createExercise('Bizeps Curls', 'biceps', 3, '10-12', 'bicep_curl'),
          createExercise('Reverse Fly', 'shoulders', 3, '12-15', 'rear_delt_fly'),
        ].map((e, i) => ({ ...e, id: `ppl6-pull1-${i}`, order: i })),
      },
    },
    {
      day: 'wed',
      workout: {
        name: 'Legs 1 - Kraft',
        direction: 'gym',
        exercises: [
          createExercise('Kniebeuge', 'legs', 5, '5', 'squat'),
          createExercise('Beinpresse', 'legs', 4, '8-10', 'leg_press'),
          createExercise('Beinstrecker', 'legs', 3, '10-12', 'leg_extension'),
          createExercise('Beinbeuger', 'legs', 3, '10-12', 'leg_curl'),
          createExercise('Wadenheben', 'legs', 4, '10-12', 'calf_raise'),
          createExercise('Cable Crunch', 'core', 3, '12-15', 'cable_crunch'),
        ].map((e, i) => ({ ...e, id: `ppl6-legs1-${i}`, order: i })),
      },
    },
    {
      day: 'thu',
      workout: {
        name: 'Push 2 - Hypertrophie',
        direction: 'gym',
        exercises: [
          createExercise('Schrägbankdrücken', 'chest', 4, '8-10', 'incline_bench'),
          createExercise('Butterfly', 'chest', 3, '10-12', 'dumbbell_fly'),
          createExercise('Cable Crossover', 'chest', 3, '12-15', 'cable_crossover'),
          createExercise('Seitheben', 'shoulders', 4, '12-15', 'lateral_raise'),
          createExercise('Skull Crusher', 'triceps', 3, '10-12', 'skull_crusher'),
          createExercise('Überkopf-Extension', 'triceps', 3, '12-15', 'overhead_extension'),
        ].map((e, i) => ({ ...e, id: `ppl6-push2-${i}`, order: i })),
      },
    },
    {
      day: 'fri',
      workout: {
        name: 'Pull 2 - Hypertrophie',
        direction: 'gym',
        exercises: [
          createExercise('Latzug', 'back', 4, '8-10', 'lat_pulldown'),
          createExercise('Rudern am Kabel', 'back', 4, '10-12', 'seated_row'),
          createExercise('Face Pulls', 'back', 3, '12-15', 'face_pulls'),
          createExercise('Reverse Fly', 'shoulders', 3, '12-15', 'rear_delt_fly'),
          createExercise('Preacher Curls', 'biceps', 3, '10-12', 'preacher_curl'),
          createExercise('Hammer Curls', 'biceps', 3, '10-12', 'hammer_curl'),
        ].map((e, i) => ({ ...e, id: `ppl6-pull2-${i}`, order: i })),
      },
    },
    {
      day: 'sat',
      workout: {
        name: 'Legs 2 - Hypertrophie',
        direction: 'gym',
        exercises: [
          createExercise('Rumänisches Kreuzheben', 'legs', 4, '8-10', 'romanian_deadlift'),
          createExercise('Hip Thrust', 'glutes', 4, '10-12', 'hip_thrust'),
          createExercise('Ausfallschritte', 'legs', 3, '10/Seite', 'lunges'),
          createExercise('Beinbeuger', 'legs', 4, '10-12', 'leg_curl'),
          createExercise('Wadenheben', 'legs', 4, '15-20', 'calf_raise'),
          createExercise('Beinheben', 'core', 3, '12-15', 'leg_raise'),
        ].map((e, i) => ({ ...e, id: `ppl6-legs2-${i}`, order: i })),
      },
    },
  ],
};

const PPL_HYPERTROPHY: PlanTemplate = {
  id: 'ppl_hypertrophy',
  name: 'Push/Pull/Legs Hypertrophie',
  description: 'Optimiert für Muskelwachstum mit moderatem Gewicht und hohem Volumen.',
  category: 'ppl',
  daysPerWeek: 6,
  level: 'intermediate',
  goal: 'muscle',
  schedule: [
    {
      day: 'mon',
      workout: {
        name: 'Push - Brust Fokus',
        direction: 'gym',
        exercises: [
          createExercise('Bankdrücken', 'chest', 4, '8-10', 'bench_press'),
          createExercise('Schrägbankdrücken', 'chest', 4, '8-10', 'incline_bench'),
          createExercise('Cable Crossover', 'chest', 3, '12-15', 'cable_crossover'),
          createExercise('Schulterdrücken', 'shoulders', 3, '10-12', 'overhead_press'),
          createExercise('Seitheben', 'shoulders', 4, '12-15', 'lateral_raise'),
          createExercise('Trizepsdrücken', 'triceps', 3, '12-15', 'tricep_pushdown'),
        ].map((e, i) => ({ ...e, id: `pplh-push1-${i}`, order: i })),
      },
    },
    {
      day: 'tue',
      workout: {
        name: 'Pull - Rückenbreite',
        direction: 'gym',
        exercises: [
          createExercise('Klimmzüge', 'back', 4, '8-10', 'pullups'),
          createExercise('Latzug', 'back', 4, '10-12', 'lat_pulldown'),
          createExercise('Rudern am Kabel', 'back', 4, '10-12', 'seated_row'),
          createExercise('Face Pulls', 'back', 3, '15-20', 'face_pulls'),
          createExercise('Bizeps Curls', 'biceps', 4, '10-12', 'bicep_curl'),
          createExercise('Reverse Fly', 'shoulders', 3, '12-15', 'rear_delt_fly'),
        ].map((e, i) => ({ ...e, id: `pplh-pull1-${i}`, order: i })),
      },
    },
    {
      day: 'wed',
      workout: {
        name: 'Legs - Quad Fokus',
        direction: 'gym',
        exercises: [
          createExercise('Kniebeuge', 'legs', 4, '8-10', 'squat'),
          createExercise('Beinpresse', 'legs', 4, '10-12', 'leg_press'),
          createExercise('Ausfallschritte', 'legs', 3, '10/Seite', 'lunges'),
          createExercise('Beinstrecker', 'legs', 3, '12-15', 'leg_extension'),
          createExercise('Wadenheben', 'legs', 4, '12-15', 'calf_raise'),
          createExercise('Plank', 'core', 3, '45-60s', 'plank'),
        ].map((e, i) => ({ ...e, id: `pplh-legs1-${i}`, order: i })),
      },
    },
    {
      day: 'thu',
      workout: {
        name: 'Push - Schulter Fokus',
        direction: 'gym',
        exercises: [
          createExercise('Schulterdrücken', 'shoulders', 4, '8-10', 'overhead_press'),
          createExercise('Seitheben', 'shoulders', 4, '12-15', 'lateral_raise'),
          createExercise('Frontheben', 'shoulders', 3, '12-15', 'front_raise'),
          createExercise('Schrägbankdrücken', 'chest', 3, '10-12', 'incline_bench'),
          createExercise('Dips', 'chest', 3, '10-12', 'dips'),
          createExercise('Skull Crusher', 'triceps', 3, '10-12', 'skull_crusher'),
        ].map((e, i) => ({ ...e, id: `pplh-push2-${i}`, order: i })),
      },
    },
    {
      day: 'fri',
      workout: {
        name: 'Pull - Rückendichte',
        direction: 'gym',
        exercises: [
          createExercise('Langhantelrudern', 'back', 4, '8-10', 'barbell_row'),
          createExercise('Kreuzheben', 'back', 3, '6-8', 'deadlift'),
          createExercise('Latzug eng', 'back', 3, '10-12', 'lat_pulldown'),
          createExercise('Face Pulls', 'back', 3, '15-20', 'face_pulls'),
          createExercise('Hammer Curls', 'biceps', 3, '10-12', 'hammer_curl'),
          createExercise('Preacher Curls', 'biceps', 3, '10-12', 'preacher_curl'),
        ].map((e, i) => ({ ...e, id: `pplh-pull2-${i}`, order: i })),
      },
    },
    {
      day: 'sat',
      workout: {
        name: 'Legs - Hamstring Fokus',
        direction: 'gym',
        exercises: [
          createExercise('Rumänisches Kreuzheben', 'legs', 4, '8-10', 'romanian_deadlift'),
          createExercise('Hip Thrust', 'glutes', 4, '10-12', 'hip_thrust'),
          createExercise('Beinbeuger', 'legs', 4, '10-12', 'leg_curl'),
          createExercise('Glute Bridge', 'glutes', 3, '12-15', 'glute_bridge'),
          createExercise('Cable Kickback', 'glutes', 3, '12-15', 'cable_kickback'),
          createExercise('Russian Twist', 'core', 3, '20', 'russian_twist'),
        ].map((e, i) => ({ ...e, id: `pplh-legs2-${i}`, order: i })),
      },
    },
  ],
};

// ============================================
// ALLE TEMPLATES EXPORTIEREN
// ============================================

export const PLAN_TEMPLATES: PlanTemplate[] = [
  // Ganzkörper
  FULLBODY_BEGINNER,
  FULLBODY_INTERMEDIATE,
  FULLBODY_STRENGTH,
  // Upper/Lower
  UPPER_LOWER_CLASSIC,
  UPPER_LOWER_HYPERTROPHY,
  UPPER_LOWER_STRENGTH,
  // Push/Pull/Legs
  PPL_3DAY,
  PPL_6DAY,
  PPL_HYPERTROPHY,
];

// Gruppierte Templates für einfachen Zugriff
export const TEMPLATES_BY_CATEGORY = {
  fullbody: [FULLBODY_BEGINNER, FULLBODY_INTERMEDIATE, FULLBODY_STRENGTH],
  upper_lower: [UPPER_LOWER_CLASSIC, UPPER_LOWER_HYPERTROPHY, UPPER_LOWER_STRENGTH],
  ppl: [PPL_3DAY, PPL_6DAY, PPL_HYPERTROPHY],
};

export const getTemplatesByDays = (days: number): PlanTemplate[] => {
  return PLAN_TEMPLATES.filter((t) => t.daysPerWeek === days);
};

export const getTemplatesByLevel = (level: PlanTemplate['level']): PlanTemplate[] => {
  return PLAN_TEMPLATES.filter((t) => t.level === level);
};

export const getTemplatesByGoal = (goal: PlanTemplate['goal']): PlanTemplate[] => {
  return PLAN_TEMPLATES.filter((t) => t.goal === goal);
};
