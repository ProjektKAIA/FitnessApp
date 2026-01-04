import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';

interface Props {
  message?: string;
  color?: string;
  size?: 'small' | 'large';
  backgroundColor?: string;
}

export const LoadingScreen: React.FC<Props> = ({
  message,
  color = COLORS.accent,
  size = 'large',
  backgroundColor = COLORS.gray[900],
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
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
    color: COLORS.gray[400],
    textAlign: 'center',
  },
});
