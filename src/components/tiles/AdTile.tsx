import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BaseTile } from './BaseTile';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { TTileSize } from '@/types';

interface Props {
  size?: TTileSize;
  title?: string;
  description?: string;
  ctaText?: string;
  onPress?: () => void;
  onClose?: () => void;
}

const AD_IMAGE = 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&q=80';

export const AdTile: React.FC<Props> = ({
  size = '3x1',
  title = 'Premium',
  description = 'Alle Features freischalten',
  ctaText = 'Mehr',
  onPress,
  onClose,
}) => {
  return (
    <BaseTile
      size={size}
      onPress={onPress}
      backgroundImage={AD_IMAGE}
      gradientColors={['rgba(156,39,176,0.5)', 'rgba(156,39,176,0.9)']}
    >
      <View style={styles.container}>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        )}

        <View style={styles.adBadge}>
          <Text style={styles.adText}>AD</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.description} numberOfLines={1}>{description}</Text>
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={onPress}>
          <Text style={styles.ctaText}>{ctaText}</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.white,
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
  ctaText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.purple,
  },
});
