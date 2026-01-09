// /workspaces/claude-workspace/fitnessapp/src/lib/database/exerciseRepository.ts

import { getDatabase } from './index';
import { logger } from '@/lib/logger';

const log = logger.scope('ExerciseRepository');

export interface DbExercise {
  id: string;
  name: string;
  muscle_group: string;
  category: string | null;
  description: string | null;
  equipment: string | null;
  search_text: string | null;
}

/**
 * Search exercises by name or muscle group
 */
export const searchExercises = async (
  query: string,
  limit: number = 50
): Promise<DbExercise[]> => {
  const db = getDatabase();
  const searchTerm = `%${query.toLowerCase()}%`;

  try {
    const results = await db.getAllAsync<DbExercise>(
      `SELECT * FROM exercises
       WHERE search_text LIKE ? OR name LIKE ? OR muscle_group LIKE ?
       ORDER BY name ASC
       LIMIT ?`,
      searchTerm,
      searchTerm,
      searchTerm,
      limit
    );
    return results;
  } catch (error) {
    log.error('Error searching exercises', error);
    return [];
  }
};

/**
 * Get all exercises
 */
export const getAllExercises = async (): Promise<DbExercise[]> => {
  const db = getDatabase();

  try {
    const results = await db.getAllAsync<DbExercise>(
      'SELECT * FROM exercises ORDER BY muscle_group, name'
    );
    return results;
  } catch (error) {
    log.error('Error getting all exercises', error);
    return [];
  }
};

/**
 * Get exercises by muscle group
 */
export const getExercisesByMuscleGroup = async (
  muscleGroup: string
): Promise<DbExercise[]> => {
  const db = getDatabase();

  try {
    const results = await db.getAllAsync<DbExercise>(
      'SELECT * FROM exercises WHERE muscle_group = ? ORDER BY name',
      muscleGroup
    );
    return results;
  } catch (error) {
    log.error('Error getting exercises by muscle group', error);
    return [];
  }
};

/**
 * Get exercise by ID
 */
export const getExerciseById = async (id: string): Promise<DbExercise | null> => {
  const db = getDatabase();

  try {
    const result = await db.getFirstAsync<DbExercise>(
      'SELECT * FROM exercises WHERE id = ?',
      id
    );
    return result ?? null;
  } catch (error) {
    log.error('Error getting exercise by id', error);
    return null;
  }
};

/**
 * Insert or update an exercise
 */
export const upsertExercise = async (exercise: Omit<DbExercise, 'search_text'>): Promise<void> => {
  const db = getDatabase();
  const searchText = `${exercise.name} ${exercise.muscle_group} ${exercise.category || ''}`.toLowerCase();

  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO exercises (id, name, muscle_group, category, description, equipment, search_text)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      exercise.id,
      exercise.name,
      exercise.muscle_group,
      exercise.category,
      exercise.description,
      exercise.equipment,
      searchText
    );
  } catch (error) {
    log.error('Error upserting exercise', error);
    throw error;
  }
};

/**
 * Bulk insert exercises
 */
export const bulkInsertExercises = async (
  exercises: Omit<DbExercise, 'search_text'>[]
): Promise<void> => {
  const db = getDatabase();

  try {
    await db.withTransactionAsync(async () => {
      for (const exercise of exercises) {
        const searchText = `${exercise.name} ${exercise.muscle_group} ${exercise.category || ''}`.toLowerCase();
        await db.runAsync(
          `INSERT OR REPLACE INTO exercises (id, name, muscle_group, category, description, equipment, search_text)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          exercise.id,
          exercise.name,
          exercise.muscle_group,
          exercise.category,
          exercise.description,
          exercise.equipment,
          searchText
        );
      }
    });

    log.info(`Bulk inserted ${exercises.length} exercises`);
  } catch (error) {
    log.error('Error bulk inserting exercises', error);
    throw error;
  }
};

/**
 * Get exercise count
 */
export const getExerciseCount = async (): Promise<number> => {
  const db = getDatabase();

  try {
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM exercises'
    );
    return result?.count ?? 0;
  } catch (error) {
    log.error('Error getting exercise count', error);
    return 0;
  }
};
