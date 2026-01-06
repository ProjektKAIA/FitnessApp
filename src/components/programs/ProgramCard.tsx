// /workspaces/claude-workspace/fitnessapp/src/components/programs/ProgramCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { IProgram } from '@/types';

interface Props {
  program: IProgram;
  onPress: (program: IProgram) => void;
  variant?: 'horizontal' | 'vertical';
}

const CATEGORY_COLORS: Record<string, string[]> = {
  yoga: ['#E8D5B7', '#F5E6D3'],
  meditation: ['#D4B8E0', '#E8D5F0'],
  bodybuilding: ['#F5D5E0', '#FFE8F0'],
  cardio: ['#B8E0D4', '#D5F0E8'],
  stretching: ['#D5E0B8', '#E8F0D5'],
};

export const ProgramCard: React.FC<Props> = ({
  program,
  onPress,
  variant = 'vertical',
}) => {
  const colors = CATEGORY_COLORS[program.category] || CATEGORY_COLORS.yoga;
  const isHorizontal = variant === 'horizontal';

  return (
    <TouchableOpacity
      style={[styles.container, isHorizontal && styles.containerHorizontal]}
      onPress={() => onPress(program)}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: program.imageUrl }}
        style={[styles.imageBackground, isHorizontal && styles.imageBackgroundHorizontal]}
        imageStyle={styles.image}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={[styles.categoryBadge, { backgroundColor: colors[0] }]}>
              <Text style={styles.categoryText}>{program.category}</Text>
            </View>
            <Text style={styles.title}>{program.name}</Text>
            <View style={styles.meta}>
              <Text style={styles.metaText}>
                {program.sessionsCount} Sessions
              </Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>{program.duration}</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 240,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  containerHorizontal: {
    width: '100%',
    height: 180,
  },
  imageBackground: {
    flex: 1,
  },
  imageBackgroundHorizontal: {
    flex: 1,
  },
  image: {
    borderRadius: BORDER_RADIUS.xl,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: SPACING.lg,
  },
  content: {
    gap: SPACING.xs,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.xs,
  },
  categoryText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.gray[800],
    textTransform: 'capitalize',
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[300],
  },
  metaDot: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[400],
  },
});
