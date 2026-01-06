// /workspaces/claude-workspace/fitnessapp/src/components/programs/LevelSelector.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { TProgramLevel } from '@/types';

interface Props {
  visible: boolean;
  selectedLevel: TProgramLevel | null;
  onSelectLevel: (level: TProgramLevel) => void;
  onClose: () => void;
}

const LEVELS: { level: TProgramLevel; title: string; description: string }[] = [
  { level: 1, title: 'Level 1', description: 'Basic and Starter' },
  { level: 2, title: 'Level 2', description: 'Moderate and Pro' },
  { level: 3, title: 'Level 3', description: 'Complex and Pro' },
  { level: 4, title: 'Level 4', description: 'Super and Master' },
];

export const LevelSelector: React.FC<Props> = ({
  visible,
  selectedLevel,
  onSelectLevel,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.container}>
          <View style={styles.handle} />
          <Text style={styles.title}>{t('programs.selectLevel')}</Text>

          <View style={styles.levelsContainer}>
            {LEVELS.map((item) => {
              const isSelected = selectedLevel === item.level;
              return (
                <TouchableOpacity
                  key={item.level}
                  style={[styles.levelItem, isSelected && styles.levelItemSelected]}
                  onPress={() => {
                    onSelectLevel(item.level);
                    onClose();
                  }}
                >
                  <View style={styles.levelInfo}>
                    <Text
                      style={[
                        styles.levelTitle,
                        isSelected && styles.levelTitleSelected,
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.levelDescription}>{item.description}</Text>
                  </View>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay.dark,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.gray[900],
    borderTopLeftRadius: BORDER_RADIUS['2xl'],
    borderTopRightRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.xl,
    paddingBottom: SPACING['3xl'],
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.gray[600],
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SPACING.xl,
  },
  levelsContainer: {
    gap: SPACING.sm,
  },
  levelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  levelItemSelected: {
    borderColor: COLORS.white,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[300],
    marginBottom: 2,
  },
  levelTitleSelected: {
    color: COLORS.white,
  },
  levelDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
});
