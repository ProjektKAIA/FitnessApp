// /workspaces/claude-workspace/fitnessapp/src/components/progress/SectionHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';

interface Props {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export const SectionHeader: React.FC<Props> = ({ title, subtitle, action }) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {action && (
        <TouchableOpacity onPress={action.onPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.action}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  subtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  action: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
});
