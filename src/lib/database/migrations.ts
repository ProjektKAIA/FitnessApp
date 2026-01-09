// /workspaces/claude-workspace/fitnessapp/src/lib/database/migrations.ts

import type { SQLiteDatabase } from 'expo-sqlite';
import { logger } from '@/lib/logger';

const log = logger.scope('DatabaseMigrations');

interface Migration {
  version: number;
  name: string;
  up: (db: SQLiteDatabase) => Promise<void>;
}

const migrations: Migration[] = [
  {
    version: 1,
    name: 'initial_schema',
    up: async (db: SQLiteDatabase) => {
      // Exercises table for fast search
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS exercises (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          muscle_group TEXT NOT NULL,
          category TEXT,
          description TEXT,
          equipment TEXT,
          search_text TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON exercises(muscle_group);
        CREATE INDEX IF NOT EXISTS idx_exercises_name ON exercises(name);
        CREATE INDEX IF NOT EXISTS idx_exercises_search ON exercises(search_text);
      `);

      // Workout history for date range queries
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS workout_history (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          direction TEXT NOT NULL,
          duration INTEGER,
          total_volume INTEGER DEFAULT 0,
          exercise_count INTEGER DEFAULT 0,
          started_at INTEGER,
          finished_at INTEGER,
          data_json TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_workout_history_finished_at ON workout_history(finished_at);
        CREATE INDEX IF NOT EXISTS idx_workout_history_direction ON workout_history(direction);
      `);

      // Exercise history for progress tracking
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS exercise_history (
          id TEXT PRIMARY KEY,
          exercise_id TEXT NOT NULL,
          workout_id TEXT NOT NULL,
          sets_count INTEGER DEFAULT 0,
          max_weight REAL DEFAULT 0,
          total_volume REAL DEFAULT 0,
          performed_at INTEGER,
          FOREIGN KEY (workout_id) REFERENCES workout_history(id)
        );
        CREATE INDEX IF NOT EXISTS idx_exercise_history_exercise ON exercise_history(exercise_id);
        CREATE INDEX IF NOT EXISTS idx_exercise_history_performed ON exercise_history(performed_at);
      `);
    },
  },
];

/**
 * Run all pending migrations
 */
export const runMigrations = async (db: SQLiteDatabase): Promise<void> => {
  // Create migrations table if not exists
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at INTEGER NOT NULL
    );
  `);

  // Get current version
  const result = await db.getFirstAsync<{ version: number }>(
    'SELECT MAX(version) as version FROM schema_migrations'
  );
  const currentVersion = result?.version ?? 0;

  log.info('Current schema version', { currentVersion });

  // Run pending migrations
  const pendingMigrations = migrations.filter((m) => m.version > currentVersion);

  for (const migration of pendingMigrations) {
    log.info(`Running migration: ${migration.name}`, { version: migration.version });

    try {
      await migration.up(db);

      // Record migration
      await db.runAsync(
        'INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)',
        migration.version,
        migration.name,
        Date.now()
      );

      log.info(`Migration completed: ${migration.name}`);
    } catch (error) {
      log.error(`Migration failed: ${migration.name}`, error);
      throw error;
    }
  }

  if (pendingMigrations.length === 0) {
    log.info('No pending migrations');
  } else {
    log.info(`Applied ${pendingMigrations.length} migrations`);
  }
};

/**
 * Get current schema version
 */
export const getCurrentVersion = async (db: SQLiteDatabase): Promise<number> => {
  const result = await db.getFirstAsync<{ version: number }>(
    'SELECT MAX(version) as version FROM schema_migrations'
  );
  return result?.version ?? 0;
};
