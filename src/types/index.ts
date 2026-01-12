export type TDirection = 'gym' | 'calisthenics' | 'cardio' | 'yoga' | 'mobility' | 'running' | 'custom';

// ============================================
// RUNNING TYPES
// ============================================
export type TRunningWorkoutType =
  | 'easy_run'
  | 'long_run'
  | 'tempo_run'
  | 'interval'
  | 'fartlek'
  | 'recovery'
  | 'hill_training'
  | 'race';

export type TRunningLevel = 'beginner' | 'intermediate' | 'advanced';

export type TRunningGoal = '5k' | '10k' | 'half_marathon' | 'marathon' | 'general_fitness' | 'speed_improvement';

export interface IRunningPlan {
  id: string;
  name: string;
  goal: TRunningGoal;
  level: TRunningLevel;
  durationWeeks: number;
  description: string;
  weeklySchedule: IRunningWeeklySchedule[];
}

export interface IRunningWeeklySchedule {
  week: number;
  days: IRunningDay[];
  totalDistance: number;
  focusNote?: string;
}

export interface IRunningDay {
  day: TTrainingDay;
  workout: IRunningWorkout | null;
}

export interface IRunningWorkout {
  id: string;
  name: string;
  type: TRunningWorkoutType;
  description: string;
  targetDistance?: number;
  targetDuration?: number;
  targetPace?: string;
  warmup?: IRunningSegment;
  mainSet: IRunningSegment[];
  cooldown?: IRunningSegment;
  notes?: string;
}

export interface IRunningSegment {
  type: 'run' | 'walk' | 'jog' | 'sprint' | 'rest';
  duration?: number;
  distance?: number;
  pace?: string;
  effort?: 'easy' | 'moderate' | 'hard' | 'max';
  reps?: number;
}

// ============================================
// YOGA TYPES
// ============================================
export type TYogaStyle =
  | 'hatha'
  | 'vinyasa'
  | 'yin'
  | 'power'
  | 'restorative'
  | 'ashtanga'
  | 'kundalini';

export type TYogaLevel = 'beginner' | 'intermediate' | 'advanced';

export type TYogaFocus =
  | 'flexibility'
  | 'strength'
  | 'balance'
  | 'relaxation'
  | 'energy'
  | 'core'
  | 'back_relief'
  | 'hip_opener'
  | 'full_body';

export interface IYogaPose {
  id: string;
  name: string;
  nameEn: string;
  sanskritName?: string;
  level: TYogaLevel;
  focus: TYogaFocus[];
  duration?: number;
  holdTime?: string;
  description: string;
  instructions: string[];
  benefits: string[];
  contraindications?: string[];
  modifications?: string[];
  imageUrl?: string;
}

export interface IYogaSession {
  id: string;
  name: string;
  style: TYogaStyle;
  level: TYogaLevel;
  duration: number;
  focus: TYogaFocus[];
  description: string;
  poses: IYogaSessionPose[];
}

export interface IYogaSessionPose {
  poseId: string;
  duration: number;
  side?: 'left' | 'right' | 'both';
  notes?: string;
}

export interface IYogaProgram {
  id: string;
  name: string;
  description: string;
  level: TYogaLevel;
  durationWeeks: number;
  focus: TYogaFocus[];
  weeklySchedule: IYogaWeeklySchedule[];
}

export interface IYogaWeeklySchedule {
  week: number;
  days: IYogaDay[];
  focusNote?: string;
}

export interface IYogaDay {
  day: TTrainingDay;
  session: IYogaSession | null;
}

// Onboarding Types
export type TGender = 'male' | 'female' | 'other';

export type TFitnessSport =
  | 'bodybuilding'
  | 'tennis'
  | 'basketball'
  | 'football'
  | 'volleyball'
  | 'badminton'
  | 'shooting'
  | 'running'
  | 'swimming'
  | 'yoga'
  | 'kickboxing'
  | 'karate';

export type TFitnessGoal =
  | 'fat_burning'
  | 'fitness'
  | 'strengthen_muscles'
  | 'increased_metabolism'
  | 'weight_gain';

export type TProgramLevel = 1 | 2 | 3 | 4;

export type TProgramCategory = 'yoga' | 'meditation' | 'bodybuilding' | 'cardio' | 'stretching';

export interface IProgram {
  id: string;
  name: string;
  category: TProgramCategory;
  imageUrl: string;
  duration: string;
  level: TProgramLevel;
  sessionsCount: number;
  description?: string;
}

export type TSportType =
  | 'fitness'
  | 'running'
  | 'cycling'
  | 'martial_arts'
  | 'swimming'
  | 'yoga'
  | 'calisthenics'
  | 'homeworkout'
  | 'custom';

export type TTrainingDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type TPlanSource = 'manual' | 'ai_generated' | 'imported' | 'template';

export interface ITrainingPlan {
  id: string;
  userId: string;
  name: string;
  sportType: TSportType;
  description?: string;
  weeklySchedule: IWeeklySchedule;
  isActive: boolean;
  source: TPlanSource;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWeeklySchedule {
  mon: IPlannedWorkout | null;
  tue: IPlannedWorkout | null;
  wed: IPlannedWorkout | null;
  thu: IPlannedWorkout | null;
  fri: IPlannedWorkout | null;
  sat: IPlannedWorkout | null;
  sun: IPlannedWorkout | null;
}

export interface IPlannedWorkout {
  id: string;
  name: string;
  direction: TDirection;
  exercises: IPlannedExercise[];
  estimatedDuration?: number;
  notes?: string;
}

export interface IPlannedExercise {
  id: string;
  exerciseId?: string;
  name: string;
  muscleGroup: TMuscleGroup;
  targetSets: number;
  targetReps: string;
  targetWeight?: number;
  restTime?: number;
  notes?: string;
  order: number;
}

export interface IExerciseTemplate {
  id: string;
  name: string;
  muscleGroup: TMuscleGroup;
  direction: TDirection[];
  category: string;
  equipment?: string[];
  description?: string;
  isCustom: boolean;
}

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
  healthIntegration?: {
    enabled: boolean;
    lastSyncAt?: string;
  };
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  birthday?: string;
  weight?: number;
  height?: number;
  gender?: TGender;
  favoriteSports?: TFitnessSport[];
  fitnessGoal?: TFitnessGoal;
  createdAt: Date;
  settings: IUserSettings;
}

export interface IUserProfile {
  name: string;
  avatarUrl?: string;
  birthday?: string;
  weight?: number;
  height?: number;
  gender?: TGender;
  favoriteSports?: TFitnessSport[];
  fitnessGoal?: TFitnessGoal;
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

export type TTileSize = '1x1' | '2x1' | '3x1' | '2x2';

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
  Onboarding: undefined;
  Main: undefined;
  WorkoutActive: { workoutId: string };
  WorkoutHistory: { direction?: TDirection } | undefined;
  WorkoutDetail: { workoutId: string };
  StreakDetail: undefined;
  ExerciseDetail: { exerciseId: string };
  Settings: undefined;
  Profile: undefined;
  ProfileEdit: undefined;
  Impressum: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  Language: undefined;
  AICoach: undefined;
  ChatGPTImport: undefined;
  ChatDetail: { chatId: string };
  SportSelection: undefined;
  FitnessQuestionnaire: { sportType: TSportType };
  TrainingPlanList: { sportType?: TSportType; questionnaireAnswers?: Record<string, string | string[]> } | undefined;
  TrainingPlanEditor: { planId?: string; sportType: TSportType };
  TrainingPlanDetail: { planId: string };
  WorkoutDayEditor: { planId: string; day: TTrainingDay };
  ExercisePicker: { planId: string; day: TTrainingDay; workoutId: string };
  HealthSettings: undefined;
  HealthDashboard: undefined;
  Contact: undefined;
  Security: undefined;
  DataExport: undefined;
  DataImport: undefined;
  DataBackup: undefined;
  DeleteAccount: undefined;
  // Running Screens
  RunningHome: undefined;
  RunningPlanList: undefined;
  RunningPlanDetail: { planId: string };
  RunningWorkoutActive: { workoutId: string };
  RunningWorkoutDetail: { workoutId: string };
  RunningQuestionnaire: undefined;
  // Yoga Screens
  YogaHome: undefined;
  YogaSessionList: undefined;
  YogaSessionDetail: { sessionId: string };
  YogaPoseDetail: { poseId: string };
  YogaSessionActive: { sessionId: string };
  YogaProgramList: undefined;
  YogaProgramDetail: { programId: string };
  // Calisthenics Screens
  CalisthenicsHome: undefined;
  CalisthenicsWorkoutList: undefined;
  CalisthenicsWorkoutDetail: { workoutId: string };
  // Homeworkout Screens
  HomeworkoutHome: undefined;
  // Guide Screens
  GuideArticle: { articleId: string };
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  Gender: undefined;
  Height: undefined;
  Weight: undefined;
  Sport: undefined;
  Goal: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Workout: undefined;
  Guide: undefined;
  You: undefined;
  More: undefined;
};
