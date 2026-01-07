// /workspaces/claude-workspace/fitnessapp/src/components/common/LoadingScreen.tsx

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import { FONT_SIZES, SPACING } from '@/constants';
import { useTheme } from '@/contexts';

interface Props {
  message?: string;
}

export const LoadingScreen: React.FC<Props> = ({ message }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && (
        <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: SPACING.lg,
    fontSize: FONT_SIZES.base,
    textAlign: 'center',
  },
});
