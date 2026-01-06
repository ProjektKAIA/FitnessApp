// /workspaces/claude-workspace/fitnessapp/src/components/onboarding/OnboardingProgress.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

interface Props {
  currentStep: number;
  totalSteps: number;
}

export const OnboardingProgress: React.FC<Props> = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.segment,
            index < currentStep && styles.segmentActive,
            index === currentStep && styles.segmentCurrent,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.xl,
  },
  segment: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.gray[700],
  },
  segmentActive: {
    backgroundColor: COLORS.white,
  },
  segmentCurrent: {
    backgroundColor: COLORS.white,
  },
});
