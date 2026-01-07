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
  darkMode?: boolean;
}

export const SectionHeader: React.FC<Props> = ({ title, subtitle, action, darkMode = false }) => {
  const titleColor = darkMode ? COLORS.white : COLORS.gray[900];
  const subtitleColor = darkMode ? COLORS.gray[400] : COLORS.gray[500];
  const actionColor = darkMode ? '#6366F1' : COLORS.primary;

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>}
      </View>
      {action && (
        <TouchableOpacity onPress={action.onPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={[styles.action, { color: actionColor }]}>{action.label}</Text>
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
    paddingHorizontal: SPACING.lg,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  action: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
});
