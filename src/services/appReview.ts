// /workspaces/claude-workspace/fitnessapp/src/services/appReview.ts

import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const STORAGE_KEY = 'app_review_data';

interface ReviewData {
  lastPromptDate: string | null;
  workoutCount: number;
  hasReviewed: boolean;
  promptCount: number;
}

const DEFAULT_DATA: ReviewData = {
  lastPromptDate: null,
  workoutCount: 0,
  hasReviewed: false,
  promptCount: 0,
};

// Konfiguration - wann soll der Dialog erscheinen?
const CONFIG = {
  // Mindestanzahl Workouts vor erstem Prompt
  minWorkoutsBeforePrompt: 5,
  // Mindestanzahl Tage zwischen Prompts
  minDaysBetweenPrompts: 60,
  // Maximale Anzahl Prompts (iOS erlaubt nur 3 pro Jahr)
  maxPromptsPerYear: 3,
};

/**
 * Lädt die Review-Daten aus AsyncStorage
 */
const getReviewData = async (): Promise<ReviewData> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...DEFAULT_DATA, ...JSON.parse(data) };
    }
  } catch (error) {
    console.error('[AppReview] Error loading data:', error);
  }
  return DEFAULT_DATA;
};

/**
 * Speichert die Review-Daten in AsyncStorage
 */
const saveReviewData = async (data: ReviewData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('[AppReview] Error saving data:', error);
  }
};

/**
 * Prüft, ob der Review-Dialog verfügbar ist
 */
export const isReviewAvailable = async (): Promise<boolean> => {
  try {
    return await StoreReview.isAvailableAsync();
  } catch {
    return false;
  }
};

/**
 * Prüft, ob die Bedingungen für einen Review-Prompt erfüllt sind
 */
const shouldPromptForReview = async (): Promise<boolean> => {
  const data = await getReviewData();

  // Bereits bewertet? Nicht mehr fragen
  if (data.hasReviewed) {
    return false;
  }

  // Maximum erreicht?
  if (data.promptCount >= CONFIG.maxPromptsPerYear) {
    return false;
  }

  // Genug Workouts absolviert?
  if (data.workoutCount < CONFIG.minWorkoutsBeforePrompt) {
    return false;
  }

  // Genug Zeit seit letztem Prompt?
  if (data.lastPromptDate) {
    const lastDate = new Date(data.lastPromptDate);
    const daysSinceLastPrompt = Math.floor(
      (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceLastPrompt < CONFIG.minDaysBetweenPrompts) {
      return false;
    }
  }

  return true;
};

/**
 * Zeigt den nativen Review-Dialog an (wenn verfügbar und Bedingungen erfüllt)
 */
export const requestReview = async (): Promise<boolean> => {
  try {
    // Prüfe ob verfügbar
    const available = await isReviewAvailable();
    if (!available) {
      console.log('[AppReview] Store review not available on this device');
      return false;
    }

    // Prüfe Bedingungen
    const shouldPrompt = await shouldPromptForReview();
    if (!shouldPrompt) {
      console.log('[AppReview] Conditions not met for review prompt');
      return false;
    }

    // Zeige den Dialog
    await StoreReview.requestReview();

    // Aktualisiere Daten
    const data = await getReviewData();
    await saveReviewData({
      ...data,
      lastPromptDate: new Date().toISOString(),
      promptCount: data.promptCount + 1,
    });

    console.log('[AppReview] Review prompt shown successfully');
    return true;
  } catch (error) {
    console.error('[AppReview] Error requesting review:', error);
    return false;
  }
};

/**
 * Inkrementiert den Workout-Zähler und prüft auf Review
 * Aufruf: Nach jedem abgeschlossenen Workout
 */
export const trackWorkoutCompleted = async (): Promise<void> => {
  const data = await getReviewData();
  const newCount = data.workoutCount + 1;

  await saveReviewData({
    ...data,
    workoutCount: newCount,
  });

  console.log(`[AppReview] Workout tracked. Total: ${newCount}`);

  // Prüfe ob Review-Prompt angezeigt werden soll
  // Zeige bei bestimmten Meilensteinen: 5, 10, 25, 50, 100
  const milestones = [5, 10, 25, 50, 100];
  if (milestones.includes(newCount)) {
    await requestReview();
  }
};

/**
 * Markiert dass der User bereits bewertet hat
 * (Kann vom User manuell gesetzt werden)
 */
export const markAsReviewed = async (): Promise<void> => {
  const data = await getReviewData();
  await saveReviewData({
    ...data,
    hasReviewed: true,
  });
};

/**
 * Öffnet den Store direkt (für "App bewerten" Button in Einstellungen)
 */
export const openStoreForReview = async (): Promise<boolean> => {
  try {
    // Prüfe ob der Store-Link verfügbar ist
    const hasAction = await StoreReview.hasAction();

    if (hasAction) {
      await StoreReview.requestReview();
      return true;
    }

    console.log('[AppReview] Store link not available');
    return false;
  } catch (error) {
    console.error('[AppReview] Error opening store:', error);
    return false;
  }
};

/**
 * Setzt alle Review-Daten zurück (für Debugging)
 */
export const resetReviewData = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEY);
  console.log('[AppReview] Review data reset');
};

export const appReviewService = {
  isReviewAvailable,
  requestReview,
  trackWorkoutCompleted,
  markAsReviewed,
  openStoreForReview,
  resetReviewData,
};
