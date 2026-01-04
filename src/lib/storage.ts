import AsyncStorage from '@react-native-async-storage/async-storage';

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
    console.error(`Storage getItem error for key "${key}":`, error);
    return null;
  }
}

export async function setItem<T>(key: string, value: T, options?: StorageOptions): Promise<boolean> {
  try {
    const fullKey = getKey(key, options?.prefix);
    await AsyncStorage.setItem(fullKey, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Storage setItem error for key "${key}":`, error);
    return false;
  }
}

export async function removeItem(key: string, options?: StorageOptions): Promise<boolean> {
  try {
    const fullKey = getKey(key, options?.prefix);
    await AsyncStorage.removeItem(fullKey);
    return true;
  } catch (error) {
    console.error(`Storage removeItem error for key "${key}":`, error);
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
    console.error('Storage clear error:', error);
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
    console.error('Storage getAllKeys error:', error);
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
