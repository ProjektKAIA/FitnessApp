export {
  ApiException,
  withErrorHandling,
  fetchWithErrorHandling,
  type ApiErrorCode,
  type ApiErrorDetails,
  type WithErrorHandlingOptions,
} from './apiClient';

export {
  storage,
  getItem,
  setItem,
  removeItem,
  clear,
  getAllKeys,
  type StorageOptions,
} from './storage';

export {
  scale,
  scaleWidth,
  scaleHeight,
  scaleFont,
  horizontalScale,
  verticalScale,
  moderateScale,
  isSmallDevice,
  isLargeDevice,
  getScreenDimensions,
  getBottomBarHeight,
  MIN_TOUCH_TARGET,
} from './scaling';

export {
  initI18n,
  changeLanguage,
  getStoredLanguage,
  setStoredLanguage,
  SUPPORTED_LANGUAGES,
  type Language,
} from './i18n';

export {
  safeJsonParse,
  isValidBackupData,
  isValidImportData,
  type SafeParseResult,
} from './safeJson';
