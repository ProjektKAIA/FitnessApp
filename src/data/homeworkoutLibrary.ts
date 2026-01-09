// /workspaces/claude-workspace/fitnessapp/src/data/homeworkoutLibrary.ts

export interface HomeworkoutVideo {
  id: string;
  title: string;
  titleDe: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'fullbody' | 'upper' | 'lower' | 'core' | 'hiit' | 'stretch';
  thumbnail: string;
  youtubeUrl: string;
  channel: string;
  equipment: string[];
}

export const HOMEWORKOUT_VIDEOS: HomeworkoutVideo[] = [
  // Full Body
  {
    id: 'hw_fullbody_1',
    title: '20 Min Full Body Workout',
    titleDe: '20 Min Ganzkörper Workout',
    duration: '20:00',
    level: 'beginner',
    category: 'fullbody',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=UBMk30rjy0o',
    channel: 'THENX',
    equipment: [],
  },
  {
    id: 'hw_fullbody_2',
    title: '30 Min HIIT Full Body',
    titleDe: '30 Min HIIT Ganzkörper',
    duration: '30:00',
    level: 'intermediate',
    category: 'fullbody',
    thumbnail: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=ml6cT4AZdqI',
    channel: 'THENX',
    equipment: [],
  },
  {
    id: 'hw_fullbody_3',
    title: '15 Min Morning Routine',
    titleDe: '15 Min Morgenroutine',
    duration: '15:00',
    level: 'beginner',
    category: 'fullbody',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=3sEeVJEXTfY',
    channel: 'MadFit',
    equipment: [],
  },

  // Upper Body
  {
    id: 'hw_upper_1',
    title: '10 Min Upper Body Workout',
    titleDe: '10 Min Oberkörper Workout',
    duration: '10:00',
    level: 'beginner',
    category: 'upper',
    thumbnail: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=L_xrDAtykMI',
    channel: 'MadFit',
    equipment: [],
  },
  {
    id: 'hw_upper_2',
    title: '20 Min Push Workout',
    titleDe: '20 Min Push Workout',
    duration: '20:00',
    level: 'intermediate',
    category: 'upper',
    thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=BkS1-El_WlE',
    channel: 'THENX',
    equipment: [],
  },

  // Lower Body
  {
    id: 'hw_lower_1',
    title: '15 Min Leg Workout',
    titleDe: '15 Min Bein Workout',
    duration: '15:00',
    level: 'beginner',
    category: 'lower',
    thumbnail: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=H2dmfReWZQg',
    channel: 'MadFit',
    equipment: [],
  },
  {
    id: 'hw_lower_2',
    title: '20 Min Booty Burn',
    titleDe: '20 Min Po Workout',
    duration: '20:00',
    level: 'intermediate',
    category: 'lower',
    thumbnail: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=AxnGgrgYvIs',
    channel: 'Pamela Reif',
    equipment: [],
  },

  // Core
  {
    id: 'hw_core_1',
    title: '10 Min Ab Workout',
    titleDe: '10 Min Bauch Workout',
    duration: '10:00',
    level: 'beginner',
    category: 'core',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=AnYl6Nk9GOA',
    channel: 'Pamela Reif',
    equipment: [],
  },
  {
    id: 'hw_core_2',
    title: '15 Min Six Pack Abs',
    titleDe: '15 Min Sixpack Workout',
    duration: '15:00',
    level: 'intermediate',
    category: 'core',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=tUqxjbY9gBo',
    channel: 'THENX',
    equipment: [],
  },

  // HIIT
  {
    id: 'hw_hiit_1',
    title: '15 Min Fat Burning HIIT',
    titleDe: '15 Min Fettverbrennung HIIT',
    duration: '15:00',
    level: 'intermediate',
    category: 'hiit',
    thumbnail: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=TkaYafQ-XC4',
    channel: 'MadFit',
    equipment: [],
  },
  {
    id: 'hw_hiit_2',
    title: '20 Min Cardio HIIT',
    titleDe: '20 Min Cardio HIIT',
    duration: '20:00',
    level: 'advanced',
    category: 'hiit',
    thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=EHNmXMTpkWs',
    channel: 'Pamela Reif',
    equipment: [],
  },

  // Stretch / Cooldown
  {
    id: 'hw_stretch_1',
    title: '10 Min Full Body Stretch',
    titleDe: '10 Min Ganzkörper Dehnen',
    duration: '10:00',
    level: 'beginner',
    category: 'stretch',
    thumbnail: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=g_tea8ZNk5A',
    channel: 'MadFit',
    equipment: [],
  },
];

export const HOMEWORKOUT_CATEGORIES = {
  fullbody: { de: 'Ganzkörper', en: 'Full Body', icon: '🏋️' },
  upper: { de: 'Oberkörper', en: 'Upper Body', icon: '💪' },
  lower: { de: 'Unterkörper', en: 'Lower Body', icon: '🦵' },
  core: { de: 'Core / Bauch', en: 'Core / Abs', icon: '🎯' },
  hiit: { de: 'HIIT / Cardio', en: 'HIIT / Cardio', icon: '🔥' },
  stretch: { de: 'Dehnen', en: 'Stretch', icon: '🧘' },
};

export const HOMEWORKOUT_LEVELS = {
  beginner: { de: 'Anfänger', en: 'Beginner' },
  intermediate: { de: 'Fortgeschritten', en: 'Intermediate' },
  advanced: { de: 'Profi', en: 'Advanced' },
};

export const getHomeworkoutsByCategory = (category: HomeworkoutVideo['category']): HomeworkoutVideo[] => {
  return HOMEWORKOUT_VIDEOS.filter((v) => v.category === category);
};

export const getHomeworkoutsByLevel = (level: HomeworkoutVideo['level']): HomeworkoutVideo[] => {
  return HOMEWORKOUT_VIDEOS.filter((v) => v.level === level);
};
