import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, TILE } from '@/constants';
import { TTileSize } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TILE_GAP = TILE.gap;
const PADDING = SPACING.lg;
const TILE_WIDTH = (SCREEN_WIDTH - PADDING * 2 - TILE_GAP) / TILE.columns;

interface Props {
  size?: TTileSize;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  backgroundImage?: string;
  backgroundPosition?: { x: number; y: number };
  gradientColors?: string[];
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const BaseTile: React.FC<Props> = ({
  size = '1x1',
  title,
  subtitle,
  onPress,
  backgroundImage,
  backgroundPosition = { x: 0, y: 0 },
  gradientColors = ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)'],
  children,
  style,
}) => {
  const getTileStyle = (): ViewStyle => {
    switch (size) {
      case '2x1':
        return {
          width: TILE_WIDTH * 2 + TILE_GAP,
          height: TILE.height,
        };
      case '2x2':
        return {
          width: TILE_WIDTH * 2 + TILE_GAP,
          height: TILE.height * 2 + TILE_GAP,
        };
      case '1x1':
      default:
        return {
          width: TILE_WIDTH,
          height: TILE.height,
        };
    }
  };

  const content = (
    <>
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        style={styles.overlay}
      />
      <View style={styles.content}>
        {children ? (
          children
        ) : (
          <>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            {title && <Text style={styles.title}>{title}</Text>}
          </>
        )}
      </View>
    </>
  );

  const tileStyle = [styles.tile, getTileStyle(), style];

  if (backgroundImage) {
    return (
      <TouchableOpacity
        activeOpacity={onPress ? 0.8 : 1}
        onPress={onPress}
        disabled={!onPress}
      >
        <ImageBackground
          source={{ uri: backgroundImage }}
          style={tileStyle}
          imageStyle={[
            styles.backgroundImage,
            {
              transform: [
                { translateX: backgroundPosition.x },
                { translateY: backgroundPosition.y },
              ],
            },
          ]}
        >
          {content}
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[tileStyle, styles.defaultBackground]}
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  defaultBackground: {
    backgroundColor: COLORS.gray[800],
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'flex-end',
  },
  subtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export const getTileWidth = () => TILE_WIDTH;
export const getTileGap = () => TILE_GAP;
