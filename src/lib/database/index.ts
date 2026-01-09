// /workspaces/claude-workspace/fitnessapp/src/lib/database/index.ts

import * as SQLite from 'expo-sqlite';
import { logger } from '@/lib/logger';
import { runMigrations } from './migrations';

const log = logger.scope('Database');
const DATABASE_NAME = 'shapyfit.db';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize the database and run migrations
 */
export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    return db;
  }

  try {
    log.info('Initializing database');
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    // Run migrations
    await runMigrations(db);

    log.info('Database initialized successfully');
    return db;
  } catch (error) {
    log.error('Failed to initialize database', error);
    throw error;
  }
};

/**
 * Get the database instance
 * @throws Error if database is not initialized
 */
export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

/**
 * Close the database connection
 */
export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.closeAsync();
    db = null;
    log.info('Database closed');
  }
};

/**
 * Check if database is initialized
 */
export const isDatabaseInitialized = (): boolean => {
  return db !== null;
};

export { SQLite };
