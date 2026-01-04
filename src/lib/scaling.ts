import { Dimensions, PixelRatio, Platform } from 'react-native';

// Basis-Referenz: iPhone 14 Pro (393 x 852)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Horizontale Skalierung basierend auf Bildschirmbreite
export const scaleWidth = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Vertikale Skalierung basierend auf Bildschirmhöhe
export const scaleHeight = (size: number): number => {
  const scale = SCREEN_HEIGHT / BASE_HEIGHT;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Moderate Skalierung (Durchschnitt) - für Fonts und Icons
export const scale = (size: number): number => {
  const scaleFactorWidth = SCREEN_WIDTH / BASE_WIDTH;
  const scaleFactorHeight = SCREEN_HEIGHT / BASE_HEIGHT;
  const scaleFactor = (scaleFactorWidth + scaleFactorHeight) / 2;

  // Begrenze die Skalierung auf max 1.3x und min 0.8x
  const clampedScale = Math.min(Math.max(scaleFactor, 0.8), 1.3);
  const newSize = size * clampedScale;

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Font-Skalierung mit zusätzlicher Berücksichtigung von Accessibility-Einstellungen
export const scaleFont = (size: number): number => {
  const scaledSize = scale(size);
  // PixelRatio.getFontScale() berücksichtigt die Systemeinstellung für Schriftgröße
  const fontScale = PixelRatio.getFontScale();

  // Begrenze Font-Skalierung für sehr große System-Einstellungen
  const clampedFontScale = Math.min(fontScale, 1.3);

  return Math.round(scaledSize * clampedFontScale);
};

// Hilfsfunktion für horizontalen Spacing
export const horizontalScale = scaleWidth;

// Hilfsfunktion für vertikalen Spacing
export const verticalScale = scaleHeight;

// Moderate Skalierung für Elemente die in beide Richtungen skalieren sollen
export const moderateScale = (size: number, factor = 0.5): number => {
  const scaleFactorWidth = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size + (size * scaleFactorWidth - size) * factor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Prüft ob es ein kleines Gerät ist (iPhone SE, kleine Android-Phones)
export const isSmallDevice = (): boolean => {
  return SCREEN_WIDTH < 375 || SCREEN_HEIGHT < 700;
};

// Prüft ob es ein großes Gerät ist (iPad, große Android-Tablets)
export const isLargeDevice = (): boolean => {
  return SCREEN_WIDTH >= 768;
};

// Gibt die aktuelle Bildschirmgröße zurück
export const getScreenDimensions = () => ({
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
});

// Bottom Bar spezifische Höhen basierend auf Plattform
export const getBottomBarHeight = (): number => {
  if (Platform.OS === 'ios') {
    // iPhone mit Notch/Dynamic Island haben größere Safe Area
    return SCREEN_HEIGHT >= 812 ? 88 : 70;
  }
  // Android
  return 70;
};

// Touch-Target Mindestgröße nach Apple/Google Guidelines
export const MIN_TOUCH_TARGET = Platform.OS === 'ios' ? 44 : 48;
