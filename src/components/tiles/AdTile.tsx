import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BaseTile } from './BaseTile';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { TTileSize } from '@/types';

interface Props {
  size?: TTileSize;
  title?: string;
  description?: string;
  ctaText?: string;
  onPress?: () => void;
  onClose?: () => void;
  transparent?: boolean;
}

const AD_IMAGES: Record<string, string> = {
  default: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&q=80',
  coaching: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
  plans: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
  health: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80',
};

const GRADIENT_COLORS: Partial<Record<TTileSize, [string, string]>> = {
  '1x1': ['rgba(99,102,241,0.6)', 'rgba(99,102,241,0.95)'],
  '2x1': ['rgba(16,185,129,0.6)', 'rgba(16,185,129,0.95)'],
  '2x2': ['rgba(236,72,153,0.6)', 'rgba(236,72,153,0.95)'],
  '3x1': ['rgba(156,39,176,0.5)', 'rgba(156,39,176,0.9)'],
};

export const AdTile: React.FC<Props> = ({
  size = '3x1',
  title = 'Premium',
  description = 'Alle Features freischalten',
  ctaText = 'Mehr',
  onPress,
  onClose,
  transparent = false,
}) => {
  const isCompact = size === '1x1';
  const isMedium = size === '2x1';

  const getImageUrl = () => {
    if (title?.toLowerCase().includes('coach') || title?.toLowerCase().includes('ki')) {
      return AD_IMAGES.coaching;
    }
    if (title?.toLowerCase().includes('plan') || title?.toLowerCase().includes('training')) {
      return AD_IMAGES.plans;
    }
    if (title?.toLowerCase().includes('health') || title?.toLowerCase().includes('connect')) {
      return AD_IMAGES.health;
    }
    return AD_IMAGES.default;
  };

  const gradientColors = transparent
    ? ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)'] as [string, string]
    : GRADIENT_COLORS[size] || GRADIENT_COLORS['3x1'];

  return (
    <BaseTile
      size={size}
      onPress={onPress}
      backgroundImage={getImageUrl()}
      gradientColors={gradientColors}
    >
      <View style={[styles.container, isCompact && styles.containerCompact]}>
        {onClose && !isCompact && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        )}

        {!isCompact && (
          <View style={styles.adBadge}>
            <Text style={styles.adText}>AD</Text>
          </View>
        )}

        <View style={[styles.content, isCompact && styles.contentCompact]}>
          <Text style={[styles.title, isCompact && styles.titleCompact]} numberOfLines={isCompact ? 2 : 1}>
            {title}
          </Text>
          {!isCompact && description ? (
            <Text style={styles.description} numberOfLines={1}>{description}</Text>
          ) : null}
        </View>

        {!isCompact && (
          <TouchableOpacity style={[styles.ctaButton, isMedium && styles.ctaButtonMedium]} onPress={onPress}>
            <Text style={styles.ctaText}>{ctaText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </BaseTile>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerCompact: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.overlay.medium,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeText: {
    fontSize: 10,
    color: COLORS.white,
  },
  adBadge: {
    position: 'absolute',
    top: -4,
    left: -4,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 1,
    backgroundColor: COLORS.overlay.medium,
    borderRadius: 2,
  },
  adText: {
    fontSize: 8,
    color: COLORS.white,
    opacity: 0.8,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  contentCompact: {
    flex: 0,
    marginRight: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.white,
  },
  titleCompact: {
    fontSize: FONT_SIZES.xs,
    textAlign: 'center',
  },
  description: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.8,
  },
  ctaButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  ctaButtonMedium: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  ctaText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.purple,
  },
});
