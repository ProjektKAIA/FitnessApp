export type TDirection = 'gym' | 'calisthenics' | 'cardio' | 'yoga' | 'mobility' | 'custom';

export type TMuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'arms'
  | 'legs'
  | 'glutes'
  | 'core'
  | 'full_body';

export type TWorkoutStatus = 'planned' | 'in_progress' | 'completed' | 'skipped';

export interface IUserSettings {
  theme: 'light' | 'dark' | 'system';
  units: 'metric' | 'imperial';
  restTimerDefault: number;
  notifications: boolean;
  hapticFeedback: boolean;
  openaiApiKey?: string;
  chatgptThreadId?: string;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
  settings: IUserSettings;
}

export interface ISet {
  id: string;
  weight: number;
  reps: number;
  rpe?: number;
  completed: boolean;
  restTime?: number;
}

export interface IExercise {
  id: string;
  name: string;
  muscleGroup: TMuscleGroup;
  sets: ISet[];
  notes?: string;
  supersetWith?: string;
}

export interface IWorkout {
  id: string;
  userId: string;
  name: string;
  direction: TDirection;
  exercises: IExercise[];
  status: TWorkoutStatus;
  plannedAt?: Date;
  startedAt?: Date;
  finishedAt?: Date;
  duration: number;
  totalVolume: number;
  notes?: string;
}

export interface IWorkoutTemplate {
  id: string;
  userId: string;
  name: string;
  direction: TDirection;
  exercises: Omit<IExercise, 'sets'>[];
  isDefault: boolean;
}

export interface IExerciseLibrary {
  id: string;
  name: string;
  muscleGroup: TMuscleGroup;
  direction: TDirection[];
  description?: string;
  videoUrl?: string;
  isCustom: boolean;
}

export interface IExerciseHistory {
  exerciseId: string;
  date: Date;
  sets: ISet[];
  maxWeight: number;
  totalVolume: number;
}

export interface IStats {
  totalWorkouts: number;
  totalVolume: number;
  currentStreak: number;
  longestStreak: number;
  thisWeekWorkouts: number;
  thisMonthWorkouts: number;
  personalRecords: IPersonalRecord[];
}

export interface IPersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: Date;
}

export interface IWeeklyProgress {
  week: string;
  workouts: number;
  volume: number;
  duration: number;
}

export interface IBodyStats {
  id: string;
  userId: string;
  date: Date;
  weight?: number;
  bodyFat?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    thighs?: number;
  };
}

export type TTileSize = '1x1' | '2x1' | '2x2';

export interface ITileConfig {
  id: string;
  type: string;
  size: TTileSize;
  position: number;
  visible: boolean;
}

export type RootStackParamList = {
  Auth: undefined;
  Consent: undefined;
  Main: undefined;
  WorkoutActive: { workoutId: string };
  ExerciseDetail: { exerciseId: string };
  Settings: undefined;
  Profile: undefined;
  Impressum: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Workout: undefined;
  Plan: undefined;
  Progress: undefined;
  More: undefined;
};
