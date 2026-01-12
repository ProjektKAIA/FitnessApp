import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';

const log = logger.scope('Storage');
const STORAGE_PREFIX = '@fitnessapp:';

export interface StorageOptions {
  prefix?: string;
}

function getKey(key: string, prefix = STORAGE_PREFIX): string {
  return `${prefix}${key}`;
}

export async function getItem<T>(key: string, options?: StorageOptions): Promise<T | null> {
  try {
    const fullKey = getKey(key, options?.prefix);
    const value = await AsyncStorage.getItem(fullKey);

    if (value === null) {
      return null;
    }

    return JSON.parse(value) as T;
  } catch (error) {
    log.error('getItem error', error, { key });
    return null;
  }
}

export async function setItem<T>(key: string, value: T, options?: StorageOptions): Promise<boolean> {
  try {
    const fullKey = getKey(key, options?.prefix);
    await AsyncStorage.setItem(fullKey, JSON.stringify(value));
    return true;
  } catch (error) {
    log.error('setItem error', error, { key });
    return false;
  }
}

export async function removeItem(key: string, options?: StorageOptions): Promise<boolean> {
  try {
    const fullKey = getKey(key, options?.prefix);
    await AsyncStorage.removeItem(fullKey);
    return true;
  } catch (error) {
    log.error('removeItem error', error, { key });
    return false;
  }
}

export async function clear(options?: StorageOptions): Promise<boolean> {
  try {
    const prefix = options?.prefix || STORAGE_PREFIX;
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter((key) => key.startsWith(prefix));
    await AsyncStorage.multiRemove(appKeys);
    return true;
  } catch (error) {
    log.error('clear error', error);
    return false;
  }
}

export async function getAllKeys(options?: StorageOptions): Promise<string[]> {
  try {
    const prefix = options?.prefix || STORAGE_PREFIX;
    const keys = await AsyncStorage.getAllKeys();
    return keys
      .filter((key) => key.startsWith(prefix))
      .map((key) => key.replace(prefix, ''));
  } catch (error) {
    log.error('getAllKeys error', error);
    return [];
  }
}

export const storage = {
  get: getItem,
  set: setItem,
  remove: removeItem,
  clear,
  getAllKeys,
};
