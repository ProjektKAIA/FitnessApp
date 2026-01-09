// /workspaces/claude-workspace/fitnessapp/src/data/calisthenicsLibrary.ts
// Calisthenics Workouts und Videos

import { TMuscleGroup } from '@/types';

export type TCalisthenicsLevel = 'beginner' | 'intermediate' | 'advanced';

export interface ICalisthenicsExercise {
  id: string;
  name: string;
  nameEn: string;
  muscleGroup: TMuscleGroup;
  level: TCalisthenicsLevel;
  description: string;
  instructions: string[];
  progressions?: string[];
  regressions?: string[];
}

export interface ICalisthenicsWorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number | string; // string for "max" or "30s"
  restSeconds: number;
  notes?: string;
}

export interface ICalisthenicsWorkout {
  id: string;
  name: string;
  nameEn: string;
  level: TCalisthenicsLevel;
  duration: number; // in minutes
  muscleGroups: TMuscleGroup[];
  description: string;
  exercises: ICalisthenicsWorkoutExercise[];
}

export interface ICalisthenicsVideo {
  id: string;
  title: string;
  duration: string;
  level: string;
  thumbnail: string;
  youtubeUrl: string;
  channel: string;
}

// ============================================
// CALISTHENICS EXERCISES
// ============================================
export const CALISTHENICS_EXERCISES: ICalisthenicsExercise[] = [
  // Push Exercises
  {
    id: 'pushup',
    name: 'Liegestütze',
    nameEn: 'Push-ups',
    muscleGroup: 'chest',
    level: 'beginner',
    description: 'Grundübung für Brust, Schultern und Trizeps.',
    instructions: [
      'Hände schulterbreit auf dem Boden',
      'Körper bildet eine gerade Linie',
      'Senke dich kontrolliert ab bis Brust fast den Boden berührt',
      'Drücke dich explosiv nach oben',
    ],
    progressions: ['Diamond Pushups', 'Archer Pushups', 'One-Arm Pushups'],
    regressions: ['Knie-Liegestütze', 'Wand-Liegestütze'],
  },
  {
    id: 'diamond_pushup',
    name: 'Diamant Liegestütze',
    nameEn: 'Diamond Push-ups',
    muscleGroup: 'triceps',
    level: 'intermediate',
    description: 'Fokus auf Trizeps durch enge Handposition.',
    instructions: [
      'Hände unter der Brust, Daumen und Zeigefinger formen ein Dreieck',
      'Ellenbogen nah am Körper halten',
      'Kontrolliert absenken und hochdrücken',
    ],
    progressions: ['Pike Pushups', 'Handstand Pushups'],
    regressions: ['Normale Liegestütze'],
  },
  {
    id: 'pike_pushup',
    name: 'Pike Liegestütze',
    nameEn: 'Pike Push-ups',
    muscleGroup: 'shoulders',
    level: 'intermediate',
    description: 'Schulter-fokussierte Liegestütz-Variation.',
    instructions: [
      'Hüfte hoch in eine umgekehrte V-Position',
      'Kopf Richtung Boden senken',
      'Ellenbogen nach außen',
      'Fokus auf Schultern',
    ],
    progressions: ['Handstand Pushups'],
    regressions: ['Erhöhte Pike Pushups'],
  },
  {
    id: 'dip',
    name: 'Dips',
    nameEn: 'Dips',
    muscleGroup: 'triceps',
    level: 'intermediate',
    description: 'Effektive Übung für Trizeps und Brust.',
    instructions: [
      'Greife parallele Stangen oder stabile Flächen',
      'Arme gestreckt, Körper aufrecht',
      'Senke dich ab bis Oberarme parallel zum Boden',
      'Drücke dich kontrolliert hoch',
    ],
    progressions: ['Weighted Dips', 'Ring Dips'],
    regressions: ['Bench Dips', 'Assisted Dips'],
  },
  // Pull Exercises
  {
    id: 'pullup',
    name: 'Klimmzüge',
    nameEn: 'Pull-ups',
    muscleGroup: 'back',
    level: 'intermediate',
    description: 'König der Oberkörperübungen für den Rücken.',
    instructions: [
      'Greife die Stange schulterbreit im Obergriff',
      'Aus dem Hang hochziehen bis Kinn über der Stange',
      'Kontrolliert ablassen',
      'Schulterblätter zusammenziehen',
    ],
    progressions: ['Weighted Pullups', 'Muscle-ups'],
    regressions: ['Negative Pullups', 'Australian Pullups', 'Band-Assisted'],
  },
  {
    id: 'chinup',
    name: 'Untergriff-Klimmzüge',
    nameEn: 'Chin-ups',
    muscleGroup: 'biceps',
    level: 'intermediate',
    description: 'Klimmzug-Variation mit mehr Bizeps-Fokus.',
    instructions: [
      'Greife die Stange schulterbreit im Untergriff',
      'Ziehe dich hoch bis Kinn über der Stange',
      'Fokus auf Bizeps-Kontraktion',
    ],
    progressions: ['Weighted Chin-ups'],
    regressions: ['Negative Chin-ups', 'Band-Assisted'],
  },
  {
    id: 'australian_pullup',
    name: 'Körperrudern',
    nameEn: 'Australian Pull-ups',
    muscleGroup: 'back',
    level: 'beginner',
    description: 'Horizontales Rudern am niedrigen Barren.',
    instructions: [
      'Greife eine niedrige Stange',
      'Körper gestreckt, Fersen auf dem Boden',
      'Ziehe die Brust zur Stange',
      'Schulterblätter zusammenziehen',
    ],
    progressions: ['Pull-ups'],
  },
  // Leg Exercises
  {
    id: 'squat',
    name: 'Kniebeugen',
    nameEn: 'Squats',
    muscleGroup: 'legs',
    level: 'beginner',
    description: 'Grundübung für die gesamte Beinmuskulatur.',
    instructions: [
      'Füße schulterbreit, Zehen leicht nach außen',
      'Hüfte nach hinten schieben, Knie beugen',
      'Tief gehen bis Oberschenkel parallel oder tiefer',
      'Gewicht auf den Fersen, Rücken gerade',
    ],
    progressions: ['Pistol Squats', 'Jump Squats'],
    regressions: ['Box Squats', 'Assisted Squats'],
  },
  {
    id: 'lunge',
    name: 'Ausfallschritte',
    nameEn: 'Lunges',
    muscleGroup: 'legs',
    level: 'beginner',
    description: 'Unilaterale Beinübung für Balance und Kraft.',
    instructions: [
      'Großer Schritt nach vorne',
      'Beide Knie auf 90 Grad beugen',
      'Vorderes Knie über dem Knöchel',
      'Oberkörper aufrecht',
    ],
    progressions: ['Jump Lunges', 'Walking Lunges'],
  },
  {
    id: 'pistol_squat',
    name: 'Pistol Squats',
    nameEn: 'Pistol Squats',
    muscleGroup: 'legs',
    level: 'advanced',
    description: 'Einbeinige Kniebeuge - fortgeschrittene Übung.',
    instructions: [
      'Stehe auf einem Bein',
      'Anderes Bein nach vorne gestreckt',
      'Senke dich kontrolliert auf einem Bein ab',
      'Drücke dich wieder hoch',
    ],
    regressions: ['Assisted Pistols', 'Box Pistols'],
  },
  // Core Exercises
  {
    id: 'plank',
    name: 'Unterarmstütz',
    nameEn: 'Plank',
    muscleGroup: 'core',
    level: 'beginner',
    description: 'Statische Core-Übung für Stabilität.',
    instructions: [
      'Unterarme auf dem Boden, Ellenbogen unter Schultern',
      'Körper bildet eine gerade Linie',
      'Bauch anspannen, Hüfte nicht durchhängen lassen',
      'Position halten',
    ],
    progressions: ['Side Plank', 'Plank mit Arm/Bein heben'],
  },
  {
    id: 'leg_raise',
    name: 'Beinheben',
    nameEn: 'Leg Raises',
    muscleGroup: 'core',
    level: 'intermediate',
    description: 'Effektive Übung für den unteren Bauch.',
    instructions: [
      'Rückenlage, Hände unter dem Po oder an der Seite',
      'Beine gestreckt anheben bis 90 Grad',
      'Kontrolliert absenken ohne Boden zu berühren',
      'Unterer Rücken bleibt auf dem Boden',
    ],
    progressions: ['Hanging Leg Raises'],
    regressions: ['Knee Raises'],
  },
  {
    id: 'hanging_leg_raise',
    name: 'Hängendes Beinheben',
    nameEn: 'Hanging Leg Raises',
    muscleGroup: 'core',
    level: 'advanced',
    description: 'Fortgeschrittene Core-Übung an der Stange.',
    instructions: [
      'An der Klimmzugstange hängen',
      'Beine gestreckt nach oben heben',
      'Kontrolliert absenken',
      'Nicht schwingen',
    ],
    regressions: ['Hanging Knee Raises', 'Lying Leg Raises'],
  },
  {
    id: 'mountain_climber',
    name: 'Bergsteiger',
    nameEn: 'Mountain Climbers',
    muscleGroup: 'core',
    level: 'beginner',
    description: 'Dynamische Core- und Cardio-Übung.',
    instructions: [
      'Liegestütz-Position',
      'Abwechselnd Knie zur Brust ziehen',
      'Hüfte stabil halten',
      'Tempo je nach Intensität',
    ],
  },
  {
    id: 'burpee',
    name: 'Burpees',
    nameEn: 'Burpees',
    muscleGroup: 'full_body',
    level: 'intermediate',
    description: 'Ganzkörper-Übung mit hoher Intensität.',
    instructions: [
      'Aus dem Stand in die Hocke',
      'Hände auf den Boden, Beine nach hinten springen',
      'Liegestütz ausführen',
      'Beine nach vorne springen, hochspringen',
    ],
    regressions: ['Burpees ohne Sprung', 'Step-Back Burpees'],
  },
];

// ============================================
// CALISTHENICS WORKOUTS
// ============================================
export const CALISTHENICS_WORKOUTS: ICalisthenicsWorkout[] = [
  {
    id: 'beginner_full_body',
    name: 'Einsteiger Ganzkörper',
    nameEn: 'Beginner Full Body',
    level: 'beginner',
    duration: 20,
    muscleGroups: ['chest', 'back', 'legs', 'core'],
    description: 'Perfekt für den Einstieg ins Calisthenics-Training.',
    exercises: [
      { exerciseId: 'pushup', sets: 3, reps: 10, restSeconds: 60 },
      { exerciseId: 'australian_pullup', sets: 3, reps: 10, restSeconds: 60 },
      { exerciseId: 'squat', sets: 3, reps: 15, restSeconds: 60 },
      { exerciseId: 'plank', sets: 3, reps: '30s', restSeconds: 45 },
      { exerciseId: 'mountain_climber', sets: 3, reps: 20, restSeconds: 45 },
    ],
  },
  {
    id: 'push_workout',
    name: 'Push Training',
    nameEn: 'Push Workout',
    level: 'intermediate',
    duration: 25,
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    description: 'Fokus auf drückende Bewegungen.',
    exercises: [
      { exerciseId: 'pushup', sets: 4, reps: 15, restSeconds: 60 },
      { exerciseId: 'diamond_pushup', sets: 3, reps: 12, restSeconds: 60 },
      { exerciseId: 'pike_pushup', sets: 3, reps: 10, restSeconds: 60 },
      { exerciseId: 'dip', sets: 3, reps: 10, restSeconds: 90 },
      { exerciseId: 'plank', sets: 3, reps: '45s', restSeconds: 45 },
    ],
  },
  {
    id: 'pull_workout',
    name: 'Pull Training',
    nameEn: 'Pull Workout',
    level: 'intermediate',
    duration: 25,
    muscleGroups: ['back', 'biceps', 'core'],
    description: 'Fokus auf ziehende Bewegungen.',
    exercises: [
      { exerciseId: 'pullup', sets: 4, reps: 8, restSeconds: 90 },
      { exerciseId: 'chinup', sets: 3, reps: 8, restSeconds: 90 },
      { exerciseId: 'australian_pullup', sets: 3, reps: 12, restSeconds: 60 },
      { exerciseId: 'hanging_leg_raise', sets: 3, reps: 10, restSeconds: 60 },
      { exerciseId: 'leg_raise', sets: 3, reps: 15, restSeconds: 45 },
    ],
  },
  {
    id: 'leg_workout',
    name: 'Bein Training',
    nameEn: 'Leg Workout',
    level: 'beginner',
    duration: 20,
    muscleGroups: ['legs', 'glutes', 'core'],
    description: 'Kräftige deine Beine ohne Gewichte.',
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: 20, restSeconds: 60 },
      { exerciseId: 'lunge', sets: 3, reps: 12, restSeconds: 60, notes: 'Pro Seite' },
      { exerciseId: 'squat', sets: 3, reps: 15, restSeconds: 60, notes: 'Pause Squats - 3s unten halten' },
      { exerciseId: 'mountain_climber', sets: 3, reps: 30, restSeconds: 45 },
      { exerciseId: 'plank', sets: 3, reps: '45s', restSeconds: 45 },
    ],
  },
  {
    id: 'advanced_full_body',
    name: 'Fortgeschritten Ganzkörper',
    nameEn: 'Advanced Full Body',
    level: 'advanced',
    duration: 35,
    muscleGroups: ['chest', 'back', 'legs', 'core', 'shoulders'],
    description: 'Intensives Ganzkörper-Training für Fortgeschrittene.',
    exercises: [
      { exerciseId: 'pullup', sets: 4, reps: 10, restSeconds: 90 },
      { exerciseId: 'dip', sets: 4, reps: 12, restSeconds: 90 },
      { exerciseId: 'pistol_squat', sets: 3, reps: 6, restSeconds: 90, notes: 'Pro Seite' },
      { exerciseId: 'pike_pushup', sets: 4, reps: 12, restSeconds: 60 },
      { exerciseId: 'hanging_leg_raise', sets: 4, reps: 12, restSeconds: 60 },
      { exerciseId: 'burpee', sets: 3, reps: 10, restSeconds: 60 },
    ],
  },
  {
    id: 'quick_hiit',
    name: 'Schnelles HIIT',
    nameEn: 'Quick HIIT',
    level: 'intermediate',
    duration: 15,
    muscleGroups: ['full_body'],
    description: '15 Minuten hochintensives Intervalltraining.',
    exercises: [
      { exerciseId: 'burpee', sets: 4, reps: 10, restSeconds: 30 },
      { exerciseId: 'pushup', sets: 4, reps: 15, restSeconds: 30 },
      { exerciseId: 'squat', sets: 4, reps: 20, restSeconds: 30 },
      { exerciseId: 'mountain_climber', sets: 4, reps: 30, restSeconds: 30 },
      { exerciseId: 'plank', sets: 4, reps: '30s', restSeconds: 30 },
    ],
  },
];

// ============================================
// YOUTUBE VIDEOS
// ============================================
export const CALISTHENICS_VIDEOS: ICalisthenicsVideo[] = [
  {
    id: 'cali_video_1',
    title: '10 Min Beginner Calisthenics',
    duration: '10:00',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=placeholder1',
    channel: 'Calisthenics Movement',
  },
  {
    id: 'cali_video_2',
    title: '15 Min Full Body Workout',
    duration: '15:00',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=placeholder2',
    channel: 'Calisthenics Movement',
  },
  {
    id: 'cali_video_3',
    title: '20 Min Push & Pull Routine',
    duration: '20:00',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=placeholder3',
    channel: 'FitnessFAQs',
  },
  {
    id: 'cali_video_4',
    title: '30 Min Advanced Bodyweight',
    duration: '30:00',
    level: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=placeholder4',
    channel: 'Austin Dunham',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================
export const getCalisthenicsExerciseById = (id: string): ICalisthenicsExercise | undefined => {
  return CALISTHENICS_EXERCISES.find((e) => e.id === id);
};

export const getCalisthenicsExercisesByLevel = (level: TCalisthenicsLevel): ICalisthenicsExercise[] => {
  return CALISTHENICS_EXERCISES.filter((e) => e.level === level);
};

export const getCalisthenicsWorkoutById = (id: string): ICalisthenicsWorkout | undefined => {
  return CALISTHENICS_WORKOUTS.find((w) => w.id === id);
};

export const getCalisthenicsWorkoutsByLevel = (level: TCalisthenicsLevel): ICalisthenicsWorkout[] => {
  return CALISTHENICS_WORKOUTS.filter((w) => w.level === level);
};

// Labels
export const CALISTHENICS_LEVEL_LABELS: Record<TCalisthenicsLevel, { de: string; en: string }> = {
  beginner: { de: 'Anfänger', en: 'Beginner' },
  intermediate: { de: 'Fortgeschritten', en: 'Intermediate' },
  advanced: { de: 'Profi', en: 'Advanced' },
};
