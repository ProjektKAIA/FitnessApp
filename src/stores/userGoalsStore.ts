// src/stores/userGoalsStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CalorieTarget = 'deficit' | 'surplus' | 'maintain';
export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface TDEEData {
  gender: Gender;
  age: number;
  height: number; // cm
  weight: number; // kg
  activityLevel: ActivityLevel;
  workActivityLevel: ActivityLevel;
  calculatedTDEE: number;
}

export interface DailyCalorieEntry {
  date: string; // ISO date string
  consumed: number;
  workoutBurned: number;
}

export interface HealthEntry {
  id: string;
  date: string;
  weight?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
}

export interface UserGoal {
  id: string;
  text: string;
  deadline: string | null;
  createdAt: string;
  completed: boolean;
}

interface UserGoalsState {
  // Kalorien
  dailyCalorieGoal: number;
  calorieTarget: CalorieTarget;
  targetAmount: number; // z.B. -500 für Defizit, +300 für Überschuss
  calorieEntries: DailyCalorieEntry[];

  // TDEE Daten
  tdeeData: TDEEData | null;

  // Ziele
  goals: UserGoal[];

  // Manuelle Health-Einträge
  healthEntries: HealthEntry[];

  // Actions - Kalorien
  setDailyCalorieGoal: (goal: number) => void;
  setCalorieTarget: (target: CalorieTarget, amount: number) => void;
  addCalorieEntry: (entry: Partial<DailyCalorieEntry> & { date?: string }) => void;
  updateTodayCalories: (consumed: number) => void;
  updateTodayWorkoutCalories: (burned: number) => void;

  // Actions - TDEE
  setTDEEData: (data: TDEEData) => void;
  calculateTDEE: () => number;

  // Actions - Ziele
  addGoal: (text: string, deadline?: string | null) => void;
  updateGoal: (id: string, updates: Partial<Omit<UserGoal, 'id' | 'createdAt'>>) => void;
  removeGoal: (id: string) => void;
  toggleGoalCompleted: (id: string) => void;

  // Actions - Health Einträge
  addHealthEntry: (entry: Omit<HealthEntry, 'id' | 'date'> & { date?: string }) => void;
  getLatestHealthEntry: () => HealthEntry | null;

  // Computed
  getTodayCalories: () => DailyCalorieEntry | null;
  getCalorieBalance: () => number;
}

const generateId = () => Math.random().toString(36).substring(2, 15);
const getTodayDateString = () => new Date().toISOString().split('T')[0];

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const useUserGoalsStore = create<UserGoalsState>()(
  persist(
    (set, get) => ({
      dailyCalorieGoal: 2000,
      calorieTarget: 'maintain',
      targetAmount: 0,
      calorieEntries: [],
      tdeeData: null,
      goals: [],
      healthEntries: [],

      setDailyCalorieGoal: (goal) => set({ dailyCalorieGoal: goal }),

      setCalorieTarget: (target, amount) =>
        set({ calorieTarget: target, targetAmount: amount }),

      addCalorieEntry: (entry) =>
        set((state) => {
          const date = entry.date || getTodayDateString();
          const existingIndex = state.calorieEntries.findIndex((e) => e.date === date);

          if (existingIndex >= 0) {
            const updated = [...state.calorieEntries];
            updated[existingIndex] = { ...updated[existingIndex], ...entry, date };
            return { calorieEntries: updated };
          }

          return {
            calorieEntries: [
              ...state.calorieEntries,
              { date, consumed: 0, workoutBurned: 0, ...entry },
            ],
          };
        }),

      updateTodayCalories: (consumed) => {
        const today = getTodayDateString();
        const state = get();
        const existingIndex = state.calorieEntries.findIndex((e) => e.date === today);

        if (existingIndex >= 0) {
          const updated = [...state.calorieEntries];
          updated[existingIndex] = { ...updated[existingIndex], consumed };
          set({ calorieEntries: updated });
        } else {
          set({
            calorieEntries: [
              ...state.calorieEntries,
              { date: today, consumed, workoutBurned: 0 },
            ],
          });
        }
      },

      updateTodayWorkoutCalories: (burned) => {
        const today = getTodayDateString();
        const state = get();
        const existingIndex = state.calorieEntries.findIndex((e) => e.date === today);

        if (existingIndex >= 0) {
          const updated = [...state.calorieEntries];
          updated[existingIndex] = { ...updated[existingIndex], workoutBurned: burned };
          set({ calorieEntries: updated });
        } else {
          set({
            calorieEntries: [
              ...state.calorieEntries,
              { date: today, consumed: 0, workoutBurned: burned },
            ],
          });
        }
      },

      setTDEEData: (data) => {
        set({ tdeeData: data, dailyCalorieGoal: data.calculatedTDEE });
      },

      calculateTDEE: () => {
        const { tdeeData } = get();
        if (!tdeeData) return 2000;

        // Mifflin-St Jeor Formel
        let bmr: number;
        if (tdeeData.gender === 'male') {
          bmr = 10 * tdeeData.weight + 6.25 * tdeeData.height - 5 * tdeeData.age + 5;
        } else {
          bmr = 10 * tdeeData.weight + 6.25 * tdeeData.height - 5 * tdeeData.age - 161;
        }

        // Kombinierter Aktivitätsmultiplikator
        const sportMultiplier = ACTIVITY_MULTIPLIERS[tdeeData.activityLevel];
        const workMultiplier = ACTIVITY_MULTIPLIERS[tdeeData.workActivityLevel];
        const avgMultiplier = (sportMultiplier + workMultiplier) / 2;

        return Math.round(bmr * avgMultiplier);
      },

      addGoal: (text, deadline = null) =>
        set((state) => ({
          goals: [
            ...state.goals,
            {
              id: generateId(),
              text,
              deadline,
              createdAt: new Date().toISOString(),
              completed: false,
            },
          ],
        })),

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        })),

      removeGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),

      toggleGoalCompleted: (id) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, completed: !g.completed } : g
          ),
        })),

      addHealthEntry: (entry) =>
        set((state) => ({
          healthEntries: [
            ...state.healthEntries,
            {
              ...entry,
              id: generateId(),
              date: entry.date || new Date().toISOString(),
            },
          ],
        })),

      getLatestHealthEntry: () => {
        const { healthEntries } = get();
        if (healthEntries.length === 0) return null;
        return healthEntries.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
      },

      getTodayCalories: () => {
        const today = getTodayDateString();
        const { calorieEntries } = get();
        return calorieEntries.find((e) => e.date === today) || null;
      },

      getCalorieBalance: () => {
        const { dailyCalorieGoal, targetAmount } = get();
        const todayEntry = get().getTodayCalories();
        const consumed = todayEntry?.consumed || 0;
        const workoutBurned = todayEntry?.workoutBurned || 0;

        const targetCalories = dailyCalorieGoal + targetAmount;
        const netCalories = consumed - workoutBurned;

        return targetCalories - netCalories;
      },
    }),
    {
      name: 'user-goals-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
