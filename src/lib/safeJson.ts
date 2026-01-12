// /workspaces/claude-workspace/fitnessapp/src/lib/safeJson.ts

export interface SafeParseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Sicheres JSON.parse mit Fehlerbehandlung und optionaler Schema-Validierung
 */
export function safeJsonParse<T>(
  jsonString: string,
  validator?: (data: unknown) => data is T
): SafeParseResult<T> {
  try {
    if (!jsonString || typeof jsonString !== 'string') {
      return {
        success: false,
        error: 'Invalid input: expected non-empty string',
      };
    }

    // Maximale Größe prüfen (10 MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (jsonString.length > MAX_SIZE) {
      return {
        success: false,
        error: 'Input too large: maximum size is 10MB',
      };
    }

    const parsed = JSON.parse(jsonString) as unknown;

    // Wenn kein Validator vorhanden, einfach zurückgeben
    if (!validator) {
      return {
        success: true,
        data: parsed as T,
      };
    }

    // Mit Validator prüfen
    if (validator(parsed)) {
      return {
        success: true,
        data: parsed,
      };
    }

    return {
      success: false,
      error: 'Data validation failed',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof SyntaxError
        ? 'Invalid JSON format'
        : 'Parse error',
    };
  }
}

/**
 * Type Guard für Backup-Daten
 */
export function isValidBackupData(data: unknown): data is {
  version: string;
  createdAt: string;
  data: Record<string, unknown>;
} {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.version === 'string' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.data === 'object' &&
    obj.data !== null
  );
}

/**
 * Type Guard für Import-Daten
 */
export function isValidImportData(data: unknown): data is {
  exportDate?: string;
  appVersion?: string;
  profile?: Record<string, unknown>;
  workouts?: unknown[];
  health?: Record<string, unknown>;
  settings?: Record<string, unknown>;
} {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  // Mindestens eines der erwarteten Felder muss vorhanden sein
  const hasValidField =
    obj.exportDate !== undefined ||
    obj.appVersion !== undefined ||
    obj.profile !== undefined ||
    obj.workouts !== undefined ||
    obj.health !== undefined ||
    obj.settings !== undefined;

  // Wenn Felder vorhanden, müssen sie den richtigen Typ haben
  if (obj.workouts !== undefined && !Array.isArray(obj.workouts)) {
    return false;
  }

  return hasValidField;
}
