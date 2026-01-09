// /workspaces/claude-workspace/fitnessapp/jest.setup.js

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
}));

// Mock React Native Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios || obj.default),
  },
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

// Mock react-native-health
jest.mock('react-native-health', () => ({
  default: {
    saveWorkout: jest.fn((options, callback) => callback(null, { success: true })),
    initHealthKit: jest.fn((options, callback) => callback(null, true)),
  },
}));

// Mock react-native-health-connect
jest.mock('react-native-health-connect', () => ({
  insertRecords: jest.fn(() => Promise.resolve({ recordIds: ['test-id'] })),
  initialize: jest.fn(() => Promise.resolve(true)),
  requestPermission: jest.fn(() => Promise.resolve(true)),
}));
