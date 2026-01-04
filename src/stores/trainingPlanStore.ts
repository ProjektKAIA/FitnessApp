import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ITrainingPlan,
  IPlannedWorkout,
  IPlannedExercise,
  IWeeklySchedule,
  TSportType,
  TTrainingDay,
  TPlanSource,
  IExerciseTemplate,
  TMuscleGroup,
} from '@/types';

const generateId = () => Math.random().toString(36).substring(2, 15);

const TRAINING_DAYS: TTrainingDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const createEmptySchedule = (): IWeeklySchedule => ({
  mon: null,
  tue: null,
  wed: null,
  thu: null,
  fri: null,
  sat: null,
  sun: null,
});

export const GYM_EXERCISES: IExerciseTemplate[] = [
  { id: 'bench_press', name: 'Bankdrücken', muscleGroup: 'chest', direction: ['gym'], category: 'compound', equipment: ['barbell', 'bench'], isCustom: false },
  { id: 'incline_bench', name: 'Schrägbankdrücken', muscleGroup: 'chest', direction: ['gym'], category: 'compound', equipment: ['barbell', 'bench'], isCustom: false },
  { id: 'dumbbell_fly', name: 'Butterfly', muscleGroup: 'chest', direction: ['gym'], category: 'isolation', equipment: ['dumbbells', 'bench'], isCustom: false },
  { id: 'cable_crossover', name: 'Cable Crossover', muscleGroup: 'chest', direction: ['gym'], category: 'isolation', equipment: ['cable'], isCustom: false },
  { id: 'dips', name: 'Dips', muscleGroup: 'chest', direction: ['gym', 'calisthenics'], category: 'compound', equipment: ['dip_bars'], isCustom: false },

  { id: 'deadlift', name: 'Kreuzheben', muscleGroup: 'back', direction: ['gym'], category: 'compound', equipment: ['barbell'], isCustom: false },
  { id: 'lat_pulldown', name: 'Latzug', muscleGroup: 'back', direction: ['gym'], category: 'compound', equipment: ['cable'], isCustom: false },
  { id: 'barbell_row', name: 'Langhantelrudern', muscleGroup: 'back', direction: ['gym'], category: 'compound', equipment: ['barbell'], isCustom: false },
  { id: 'seated_row', name: 'Rudern am Kabel', muscleGroup: 'back', direction: ['gym'], category: 'compound', equipment: ['cable'], isCustom: false },
  { id: 'pullups', name: 'Klimmzüge', muscleGroup: 'back', direction: ['gym', 'calisthenics'], category: 'compound', equipment: ['pull_up_bar'], isCustom: false },
  { id: 'face_pulls', name: 'Face Pulls', muscleGroup: 'back', direction: ['gym'], category: 'isolation', equipment: ['cable'], isCustom: false },

  { id: 'overhead_press', name: 'Schulterdrücken', muscleGroup: 'shoulders', direction: ['gym'], category: 'compound', equipment: ['barbell'], isCustom: false },
  { id: 'lateral_raise', name: 'Seitheben', muscleGroup: 'shoulders', direction: ['gym'], category: 'isolation', equipment: ['dumbbells'], isCustom: false },
  { id: 'front_raise', name: 'Frontheben', muscleGroup: 'shoulders', direction: ['gym'], category: 'isolation', equipment: ['dumbbells'], isCustom: false },
  { id: 'rear_delt_fly', name: 'Reverse Fly', muscleGroup: 'shoulders', direction: ['gym'], category: 'isolation', equipment: ['dumbbells'], isCustom: false },

  { id: 'squat', name: 'Kniebeuge', muscleGroup: 'legs', direction: ['gym'], category: 'compound', equipment: ['barbell', 'squat_rack'], isCustom: false },
  { id: 'leg_press', name: 'Beinpresse', muscleGroup: 'legs', direction: ['gym'], category: 'compound', equipment: ['machine'], isCustom: false },
  { id: 'leg_extension', name: 'Beinstrecker', muscleGroup: 'legs', direction: ['gym'], category: 'isolation', equipment: ['machine'], isCustom: false },
  { id: 'leg_curl', name: 'Beinbeuger', muscleGroup: 'legs', direction: ['gym'], category: 'isolation', equipment: ['machine'], isCustom: false },
  { id: 'lunges', name: 'Ausfallschritte', muscleGroup: 'legs', direction: ['gym'], category: 'compound', equipment: ['dumbbells'], isCustom: false },
  { id: 'calf_raise', name: 'Wadenheben', muscleGroup: 'legs', direction: ['gym'], category: 'isolation', equipment: ['machine'], isCustom: false },
  { id: 'romanian_deadlift', name: 'Rumänisches Kreuzheben', muscleGroup: 'legs', direction: ['gym'], category: 'compound', equipment: ['barbell'], isCustom: false },

  { id: 'hip_thrust', name: 'Hip Thrust', muscleGroup: 'glutes', direction: ['gym'], category: 'compound', equipment: ['barbell', 'bench'], isCustom: false },
  { id: 'glute_bridge', name: 'Glute Bridge', muscleGroup: 'glutes', direction: ['gym', 'calisthenics'], category: 'isolation', isCustom: false },
  { id: 'cable_kickback', name: 'Cable Kickback', muscleGroup: 'glutes', direction: ['gym'], category: 'isolation', equipment: ['cable'], isCustom: false },

  { id: 'bicep_curl', name: 'Bizeps Curls', muscleGroup: 'biceps', direction: ['gym'], category: 'isolation', equipment: ['dumbbells'], isCustom: false },
  { id: 'hammer_curl', name: 'Hammer Curls', muscleGroup: 'biceps', direction: ['gym'], category: 'isolation', equipment: ['dumbbells'], isCustom: false },
  { id: 'preacher_curl', name: 'Preacher Curls', muscleGroup: 'biceps', direction: ['gym'], category: 'isolation', equipment: ['ez_bar'], isCustom: false },

  { id: 'tricep_pushdown', name: 'Trizepsdrücken', muscleGroup: 'triceps', direction: ['gym'], category: 'isolation', equipment: ['cable'], isCustom: false },
  { id: 'skull_crusher', name: 'Skull Crusher', muscleGroup: 'triceps', direction: ['gym'], category: 'isolation', equipment: ['ez_bar'], isCustom: false },
  { id: 'overhead_extension', name: 'Überkopf-Extension', muscleGroup: 'triceps', direction: ['gym'], category: 'isolation', equipment: ['dumbbells'], isCustom: false },

  { id: 'crunches', name: 'Crunches', muscleGroup: 'core', direction: ['gym', 'calisthenics'], category: 'isolation', isCustom: false },
  { id: 'plank', name: 'Plank', muscleGroup: 'core', direction: ['gym', 'calisthenics'], category: 'isolation', isCustom: false },
  { id: 'leg_raise', name: 'Beinheben', muscleGroup: 'core', direction: ['gym', 'calisthenics'], category: 'isolation', isCustom: false },
  { id: 'cable_crunch', name: 'Cable Crunch', muscleGroup: 'core', direction: ['gym'], category: 'isolation', equipment: ['cable'], isCustom: false },
  { id: 'russian_twist', name: 'Russian Twist', muscleGroup: 'core', direction: ['gym', 'calisthenics'], category: 'isolation', isCustom: false },
];

interface TrainingPlanState {
  plans: ITrainingPlan[];
  activePlanId: string | null;
  customExercises: IExerciseTemplate[];
  editingPlan: ITrainingPlan | null;

  createPlan: (name: string, sportType: TSportType, source?: TPlanSource) => string;
  updatePlan: (planId: string, updates: Partial<ITrainingPlan>) => void;
  deletePlan: (planId: string) => void;
  duplicatePlan: (planId: string) => string;
  setActivePlan: (planId: string | null) => void;

  setWorkoutForDay: (planId: string, day: TTrainingDay, workout: IPlannedWorkout | null) => void;
  updateWorkout: (planId: string, day: TTrainingDay, updates: Partial<IPlannedWorkout>) => void;

  addExerciseToWorkout: (planId: string, day: TTrainingDay, exercise: Omit<IPlannedExercise, 'id' | 'order'>) => void;
  updateExerciseInWorkout: (planId: string, day: TTrainingDay, exerciseId: string, updates: Partial<IPlannedExercise>) => void;
  removeExerciseFromWorkout: (planId: string, day: TTrainingDay, exerciseId: string) => void;
  reorderExercises: (planId: string, day: TTrainingDay, exerciseIds: string[]) => void;

  addCustomExercise: (exercise: Omit<IExerciseTemplate, 'id' | 'isCustom'>) => void;
  removeCustomExercise: (exerciseId: string) => void;

  setEditingPlan: (plan: ITrainingPlan | null) => void;
  saveEditingPlan: () => void;

  importPlanFromAI: (planData: Partial<ITrainingPlan>) => string;

  getPlanById: (planId: string) => ITrainingPlan | undefined;
  getActivePlan: () => ITrainingPlan | undefined;
  getPlansBySport: (sportType: TSportType) => ITrainingPlan[];
  getAllExercises: (muscleGroup?: TMuscleGroup) => IExerciseTemplate[];
}

export const useTrainingPlanStore = create<TrainingPlanState>()(
  persist(
    (set, get) => ({
      plans: [],
      activePlanId: null,
      customExercises: [],
      editingPlan: null,

      createPlan: (name, sportType, source = 'manual') => {
        const id = generateId();
        const newPlan: ITrainingPlan = {
          id,
          userId: '',
          name,
          sportType,
          weeklySchedule: createEmptySchedule(),
          isActive: false,
          source,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ plans: [...state.plans, newPlan] }));
        return id;
      },

      updatePlan: (planId, updates) => {
        set((state) => ({
          plans: state.plans.map((p) =>
            p.id === planId ? { ...p, ...updates, updatedAt: new Date() } : p
          ),
        }));
      },

      deletePlan: (planId) => {
        set((state) => ({
          plans: state.plans.filter((p) => p.id !== planId),
          activePlanId: state.activePlanId === planId ? null : state.activePlanId,
        }));
      },

      duplicatePlan: (planId) => {
        const plan = get().getPlanById(planId);
        if (!plan) return '';

        const newId = generateId();
        const duplicatedPlan: ITrainingPlan = {
          ...plan,
          id: newId,
          name: `${plan.name} (Kopie)`,
          isActive: false,
          source: 'manual',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ plans: [...state.plans, duplicatedPlan] }));
        return newId;
      },

      setActivePlan: (planId) => {
        set((state) => ({
          activePlanId: planId,
          plans: state.plans.map((p) => ({
            ...p,
            isActive: p.id === planId,
          })),
        }));
      },

      setWorkoutForDay: (planId, day, workout) => {
        set((state) => ({
          plans: state.plans.map((p) =>
            p.id === planId
              ? {
                  ...p,
                  weeklySchedule: { ...p.weeklySchedule, [day]: workout },
                  updatedAt: new Date(),
                }
              : p
          ),
        }));
      },

      updateWorkout: (planId, day, updates) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId) return p;
            const existingWorkout = p.weeklySchedule[day];
            if (!existingWorkout) return p;
            return {
              ...p,
              weeklySchedule: {
                ...p.weeklySchedule,
                [day]: { ...existingWorkout, ...updates },
              },
              updatedAt: new Date(),
            };
          }),
        }));
      },

      addExerciseToWorkout: (planId, day, exercise) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId) return p;
            const existingWorkout = p.weeklySchedule[day];
            if (!existingWorkout) return p;

            const newExercise: IPlannedExercise = {
              ...exercise,
              id: generateId(),
              order: existingWorkout.exercises.length,
            };

            return {
              ...p,
              weeklySchedule: {
                ...p.weeklySchedule,
                [day]: {
                  ...existingWorkout,
                  exercises: [...existingWorkout.exercises, newExercise],
                },
              },
              updatedAt: new Date(),
            };
          }),
        }));
      },

      updateExerciseInWorkout: (planId, day, exerciseId, updates) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId) return p;
            const existingWorkout = p.weeklySchedule[day];
            if (!existingWorkout) return p;

            return {
              ...p,
              weeklySchedule: {
                ...p.weeklySchedule,
                [day]: {
                  ...existingWorkout,
                  exercises: existingWorkout.exercises.map((e) =>
                    e.id === exerciseId ? { ...e, ...updates } : e
                  ),
                },
              },
              updatedAt: new Date(),
            };
          }),
        }));
      },

      removeExerciseFromWorkout: (planId, day, exerciseId) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId) return p;
            const existingWorkout = p.weeklySchedule[day];
            if (!existingWorkout) return p;

            const filteredExercises = existingWorkout.exercises
              .filter((e) => e.id !== exerciseId)
              .map((e, index) => ({ ...e, order: index }));

            return {
              ...p,
              weeklySchedule: {
                ...p.weeklySchedule,
                [day]: {
                  ...existingWorkout,
                  exercises: filteredExercises,
                },
              },
              updatedAt: new Date(),
            };
          }),
        }));
      },

      reorderExercises: (planId, day, exerciseIds) => {
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId) return p;
            const existingWorkout = p.weeklySchedule[day];
            if (!existingWorkout) return p;

            const reorderedExercises = exerciseIds
              .map((id, index) => {
                const exercise = existingWorkout.exercises.find((e) => e.id === id);
                return exercise ? { ...exercise, order: index } : null;
              })
              .filter((e): e is IPlannedExercise => e !== null);

            return {
              ...p,
              weeklySchedule: {
                ...p.weeklySchedule,
                [day]: {
                  ...existingWorkout,
                  exercises: reorderedExercises,
                },
              },
              updatedAt: new Date(),
            };
          }),
        }));
      },

      addCustomExercise: (exercise) => {
        const newExercise: IExerciseTemplate = {
          ...exercise,
          id: generateId(),
          isCustom: true,
        };
        set((state) => ({
          customExercises: [...state.customExercises, newExercise],
        }));
      },

      removeCustomExercise: (exerciseId) => {
        set((state) => ({
          customExercises: state.customExercises.filter((e) => e.id !== exerciseId),
        }));
      },

      setEditingPlan: (plan) => {
        set({ editingPlan: plan ? { ...plan } : null });
      },

      saveEditingPlan: () => {
        const { editingPlan, plans } = get();
        if (!editingPlan) return;

        const existingPlanIndex = plans.findIndex((p) => p.id === editingPlan.id);
        if (existingPlanIndex >= 0) {
          set((state) => ({
            plans: state.plans.map((p) =>
              p.id === editingPlan.id ? { ...editingPlan, updatedAt: new Date() } : p
            ),
            editingPlan: null,
          }));
        } else {
          set((state) => ({
            plans: [...state.plans, { ...editingPlan, updatedAt: new Date() }],
            editingPlan: null,
          }));
        }
      },

      importPlanFromAI: (planData) => {
        const id = generateId();
        const newPlan: ITrainingPlan = {
          id,
          userId: '',
          name: planData.name || 'KI-generierter Plan',
          sportType: planData.sportType || 'fitness',
          description: planData.description,
          weeklySchedule: planData.weeklySchedule || createEmptySchedule(),
          isActive: false,
          source: 'ai_generated',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ plans: [...state.plans, newPlan] }));
        return id;
      },

      getPlanById: (planId) => {
        return get().plans.find((p) => p.id === planId);
      },

      getActivePlan: () => {
        const { plans, activePlanId } = get();
        return plans.find((p) => p.id === activePlanId);
      },

      getPlansBySport: (sportType) => {
        return get().plans.filter((p) => p.sportType === sportType);
      },

      getAllExercises: (muscleGroup) => {
        const { customExercises } = get();
        const allExercises = [...GYM_EXERCISES, ...customExercises];
        if (muscleGroup) {
          return allExercises.filter((e) => e.muscleGroup === muscleGroup);
        }
        return allExercises;
      },
    }),
    {
      name: 'training-plan-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        plans: state.plans,
        activePlanId: state.activePlanId,
        customExercises: state.customExercises,
      }),
    }
  )
);
