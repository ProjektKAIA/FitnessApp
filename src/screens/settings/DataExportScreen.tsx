// src/screens/settings/DataExportScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Paths, File } from 'expo-file-system';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { useUserStore } from '@/stores';
import { useHealthStore } from '@/stores/healthStore';
import { useWorkoutStore } from '@/stores/workoutStore';

interface ExportOption {
  id: string;
  icon: string;
  titleKey: string;
  descriptionKey: string;
  selected: boolean;
}

export const DataExportScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const user = useUserStore((state) => state.user);
  const healthSettings = useHealthStore((state) => state.settings);
  const todaySummary = useHealthStore((state) => state.todaySummary);
  const workouts = useWorkoutStore((state) => state.workouts);
  const [isExporting, setIsExporting] = useState(false);

  const [exportOptions, setExportOptions] = useState<ExportOption[]>([
    {
      id: 'profile',
      icon: '👤',
      titleKey: 'dataExport.options.profile',
      descriptionKey: 'dataExport.options.profileDesc',
      selected: true,
    },
    {
      id: 'workouts',
      icon: '🏋️',
      titleKey: 'dataExport.options.workouts',
      descriptionKey: 'dataExport.options.workoutsDesc',
      selected: true,
    },
    {
      id: 'health',
      icon: '❤️',
      titleKey: 'dataExport.options.health',
      descriptionKey: 'dataExport.options.healthDesc',
      selected: true,
    },
    {
      id: 'settings',
      icon: '⚙️',
      titleKey: 'dataExport.options.settings',
      descriptionKey: 'dataExport.options.settingsDesc',
      selected: true,
    },
  ]);

  const toggleOption = (id: string) => {
    setExportOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, selected: !opt.selected } : opt))
    );
  };

  const collectExportData = () => {
    const selectedIds = exportOptions.filter((opt) => opt.selected).map((opt) => opt.id);
    const exportData: Record<string, unknown> = {
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0',
    };

    if (selectedIds.includes('profile') && user) {
      exportData.profile = {
        name: user.name,
        email: user.email,
        height: user.height,
        weight: user.weight,
        birthday: user.birthday,
        gender: user.gender,
        fitnessGoal: user.fitnessGoal,
        favoriteSports: user.favoriteSports,
      };
    }

    if (selectedIds.includes('workouts')) {
      exportData.workouts = workouts;
    }

    if (selectedIds.includes('health')) {
      exportData.health = {
        todaySummary,
        settings: {
          stepsGoal: healthSettings.stepsGoal,
          dataTypes: healthSettings.dataTypes,
        },
      };
    }

    if (selectedIds.includes('settings') && user?.settings) {
      exportData.settings = user.settings;
    }

    return exportData;
  };

  const handleExport = async () => {
    const selectedCount = exportOptions.filter((opt) => opt.selected).length;
    if (selectedCount === 0) {
      Alert.alert(t('common.error'), t('dataExport.noSelection'));
      return;
    }

    setIsExporting(true);

    try {
      const data = collectExportData();
      const jsonString = JSON.stringify(data, null, 2);
      const fileName = `framefit-export-${new Date().toISOString().split('T')[0]}.json`;

      if (Platform.OS === 'web') {
        // Web: Direct download
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Mobile: Save to file and share
        const file = new File(Paths.cache, fileName);
        await file.write(jsonString);

        await Share.share({
          url: file.uri,
          title: t('dataExport.shareTitle'),
        });
      }

      Alert.alert(t('common.success'), t('dataExport.success'));
    } catch (error) {
      console.error('[DataExport]:', error);
      Alert.alert(t('common.error'), t('dataExport.error'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('dataExport.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Card style={styles.infoCard}>
          <Text style={styles.infoIcon}>📦</Text>
          <Text style={styles.infoTitle}>{t('dataExport.infoTitle')}</Text>
          <Text style={styles.infoText}>{t('dataExport.infoText')}</Text>
        </Card>

        <Text style={styles.sectionTitle}>{t('dataExport.selectData')}</Text>
        <Card style={styles.optionsCard}>
          {exportOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={() => toggleOption(option.id)}
            >
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{t(option.titleKey)}</Text>
                <Text style={styles.optionDescription}>{t(option.descriptionKey)}</Text>
              </View>
              <View style={[styles.checkbox, option.selected && styles.checkboxSelected]}>
                {option.selected && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        <TouchableOpacity
          style={[styles.exportButton, isExporting && styles.exportButtonDisabled]}
          onPress={handleExport}
          disabled={isExporting}
        >
          <Text style={styles.exportButtonText}>
            {isExporting ? t('dataExport.exporting') : t('dataExport.exportButton')}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>{t('dataExport.disclaimer')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: SPACING.sm,
    marginLeft: -SPACING.sm,
  },
  backIcon: {
    fontSize: FONT_SIZES['2xl'],
    color: COLORS.gray[900],
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
  infoCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  infoIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  infoTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  optionsCard: {
    padding: 0,
    marginBottom: SPACING.xl,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  optionIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.gray[900],
  },
  optionDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '700',
  },
  exportButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  exportButtonDisabled: {
    backgroundColor: COLORS.gray[300],
  },
  exportButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
  disclaimer: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[400],
    textAlign: 'center',
    lineHeight: 18,
  },
});
