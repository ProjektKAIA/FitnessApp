// /workspaces/claude-workspace/fitnessapp/src/components/common/Card.tsx

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { useTheme } from '@/contexts';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  elevated?: boolean;
}

export const Card: React.FC<Props> = ({
  children,
  style,
  padded = true,
  elevated = false,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card },
        padded && styles.padded,
        elevated && styles.elevated,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
  },
  padded: {
    padding: SPACING.lg,
  },
  elevated: {
    ...SHADOWS.md,
  },
});
