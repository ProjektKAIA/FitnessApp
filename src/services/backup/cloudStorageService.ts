// /workspaces/claude-workspace/fitnessapp/src/services/backup/cloudStorageService.ts

import { Platform, Share } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Paths, File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { BackupStorageType } from '@/stores/backupStore';
import { logger } from '@/lib/logger';

const log = logger.scope('CloudStorage');

export interface CloudStorageResult {
  success: boolean;
  error?: string;
  filePath?: string;
  fileName?: string;
}

export interface CloudBackupFile {
  name: string;
  uri: string;
  size: number;
  mimeType: string;
}

/**
 * Cloud Storage Service
 *
 * Verwendet den nativen Document Picker / Share Sheet Ansatz:
 * - iOS: User kann in iCloud Drive, Files App, etc. speichern
 * - Android: User kann in Google Drive, lokalen Ordnern, etc. speichern
 *
 * Dieser Ansatz ist datenschutzfreundlich, da der User selbst wählt,
 * wo seine Daten gespeichert werden - kein AVV nötig!
 */

/**
 * Speichert eine Backup-Datei in der Cloud (via Share Sheet)
 * Der User wählt selbst den Speicherort (iCloud, Google Drive, etc.)
 */
export const saveToCloud = async (
  filePath: string,
  fileName: string
): Promise<CloudStorageResult> => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();

    if (!isAvailable) {
      return {
        success: false,
        error: 'Sharing is not available on this device',
      };
    }

    // Share Sheet öffnen - User wählt Speicherort
    await Sharing.shareAsync(filePath, {
      mimeType: 'application/json',
      dialogTitle: `Backup speichern: ${fileName}`,
      UTI: 'public.json', // iOS Uniform Type Identifier
    });

    // Note: Wir können nicht wissen, ob der User wirklich gespeichert hat
    // Das Share Sheet gibt kein Feedback darüber
    return {
      success: true,
      filePath,
      fileName,
    };
  } catch (error) {
    log.error('Save error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Alternative: Direkt speichern mit Platform-spezifischem Verhalten
 */
export const saveToCloudDirect = async (
  content: string,
  fileName: string
): Promise<CloudStorageResult> => {
  try {
    // Temporäre Datei erstellen
    const tempFile = new File(Paths.cache, fileName);
    await tempFile.write(content);

    if (Platform.OS === 'web') {
      // Web: Direct download
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      return { success: true, fileName };
    }

    // Mobile: Share Sheet
    return saveToCloud(tempFile.uri, fileName);
  } catch (error) {
    log.error('Save direct error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Lädt eine Backup-Datei aus der Cloud (via Document Picker)
 * Der User wählt die Datei aus iCloud, Google Drive, etc.
 */
export const loadFromCloud = async (): Promise<CloudStorageResult & { content?: string }> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) {
      return {
        success: false,
        error: 'User cancelled',
      };
    }

    const asset = result.assets[0];

    if (!asset) {
      return {
        success: false,
        error: 'No file selected',
      };
    }

    // Datei lesen
    const file = new File(asset.uri);
    const content = await file.text();

    // Validieren dass es JSON ist
    try {
      JSON.parse(content);
    } catch {
      return {
        success: false,
        error: 'Invalid JSON file',
      };
    }

    return {
      success: true,
      filePath: asset.uri,
      fileName: asset.name,
      content,
    };
  } catch (error) {
    log.error('Load error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Prüft, ob Cloud-Speicher verfügbar ist
 */
export const isCloudStorageAvailable = async (): Promise<boolean> => {
  try {
    return await Sharing.isAvailableAsync();
  } catch {
    return false;
  }
};

/**
 * Gibt den empfohlenen Speicherort basierend auf der Platform zurück
 */
export const getRecommendedStorageType = (): BackupStorageType => {
  if (Platform.OS === 'ios') {
    return 'icloud';
  }
  if (Platform.OS === 'android') {
    return 'gdrive';
  }
  return 'local';
};

/**
 * Gibt den Namen des Cloud-Dienstes zurück
 */
export const getCloudServiceName = (storageType: BackupStorageType): string => {
  switch (storageType) {
    case 'icloud':
      return 'iCloud Drive';
    case 'gdrive':
      return 'Google Drive';
    case 'local':
    default:
      return 'Lokal';
  }
};

/**
 * Gibt das Icon für den Speichertyp zurück
 */
export const getStorageTypeIcon = (storageType: BackupStorageType): string => {
  switch (storageType) {
    case 'icloud':
      return '☁️';
    case 'gdrive':
      return '📁';
    case 'local':
    default:
      return '📱';
  }
};
