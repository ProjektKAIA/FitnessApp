// /workspaces/claude-workspace/fitnessapp/src/lib/logger.ts

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  context: string;
  message: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
  error?: Error;
}

// Queue for potential future remote logging
const logQueue: LogEntry[] = [];
const MAX_QUEUE_SIZE = 100;

// Environment flag
const isDev = __DEV__;

/**
 * Format log entry for console output
 */
const formatLogEntry = (entry: LogEntry): string => {
  const timestamp = entry.timestamp.toISOString();
  const base = `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.context}] ${entry.message}`;
  return base;
};

/**
 * Add entry to queue (for future remote logging)
 */
const queueEntry = (entry: LogEntry): void => {
  logQueue.push(entry);
  if (logQueue.length > MAX_QUEUE_SIZE) {
    logQueue.shift();
  }
};

/**
 * Create a log entry
 */
const createEntry = (
  level: LogLevel,
  context: string,
  message: string,
  metadata?: Record<string, unknown>,
  error?: Error
): LogEntry => ({
  level,
  context,
  message,
  timestamp: new Date(),
  metadata,
  error,
});

/**
 * Logger utility with context and metadata support
 *
 * Usage:
 * logger.info('WorkoutStore', 'Workout started', { workoutId: '123' });
 * logger.error('HealthExport', 'Failed to export', error, { platform: 'ios' });
 */
export const logger = {
  /**
   * Debug level logging (only in development)
   */
  debug: (
    context: string,
    message: string,
    metadata?: Record<string, unknown>
  ): void => {
    if (!isDev) return;

    const entry = createEntry('debug', context, message, metadata);
    console.debug(formatLogEntry(entry), metadata || '');
    queueEntry(entry);
  },

  /**
   * Info level logging
   */
  info: (
    context: string,
    message: string,
    metadata?: Record<string, unknown>
  ): void => {
    const entry = createEntry('info', context, message, metadata);
    console.info(formatLogEntry(entry), metadata || '');
    queueEntry(entry);
  },

  /**
   * Warning level logging
   */
  warn: (
    context: string,
    message: string,
    metadata?: Record<string, unknown>
  ): void => {
    const entry = createEntry('warn', context, message, metadata);
    console.warn(formatLogEntry(entry), metadata || '');
    queueEntry(entry);
  },

  /**
   * Error level logging
   */
  error: (
    context: string,
    message: string,
    error?: unknown,
    metadata?: Record<string, unknown>
  ): void => {
    const errorObj = error instanceof Error ? error : undefined;
    const entry = createEntry('error', context, message, metadata, errorObj);
    console.error(formatLogEntry(entry), error || '', metadata || '');
    queueEntry(entry);

    // Future: Send to crash reporting service (e.g., Sentry)
    // if (errorObj) {
    //   Sentry.captureException(errorObj, { extra: { context, message, ...metadata } });
    // }
  },

  /**
   * Get recent log entries (for debugging)
   */
  getRecentLogs: (count: number = 20): LogEntry[] => {
    return logQueue.slice(-count);
  },

  /**
   * Clear log queue
   */
  clearLogs: (): void => {
    logQueue.length = 0;
  },

  /**
   * Create a scoped logger for a specific context
   */
  scope: (context: string) => ({
    debug: (message: string, metadata?: Record<string, unknown>) =>
      logger.debug(context, message, metadata),
    info: (message: string, metadata?: Record<string, unknown>) =>
      logger.info(context, message, metadata),
    warn: (message: string, metadata?: Record<string, unknown>) =>
      logger.warn(context, message, metadata),
    error: (message: string, error?: unknown, metadata?: Record<string, unknown>) =>
      logger.error(context, message, error, metadata),
  }),
};

// Type for scoped logger
export type ScopedLogger = ReturnType<typeof logger.scope>;
