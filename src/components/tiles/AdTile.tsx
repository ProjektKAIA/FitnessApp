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

export const AdTile: React.FC<Props> = ({
  size = '2x1',
  title = 'Premium Partner',
  description = 'Discover amazing fitness products',
  ctaText = 'Learn More',
  onPress,
  onClose,
}) => {
  return (
    <BaseTile
      size={size}
      onPress={onPress}
      gradientColors={[COLORS.purple, '#7B1FA2']}
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
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.ctaButton}>
          <Text style={styles.ctaText}>{ctaText}</Text>
        </View>
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
    top: -SPACING.sm,
    right: -SPACING.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.overlay.medium,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeText: {
    fontSize: 12,
    color: COLORS.white,
  },
  adBadge: {
    position: 'absolute',
    top: -SPACING.sm,
    left: -SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    backgroundColor: COLORS.overlay.medium,
    borderRadius: 4,
  },
  adText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.8,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    marginRight: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.8,
  },
  ctaButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  ctaText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.purple,
  },
});
