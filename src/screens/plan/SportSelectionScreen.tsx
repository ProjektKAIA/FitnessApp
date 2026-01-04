import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants';
import { RootStackParamList, TSportType } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SportOption {
  type: TSportType;
  icon: string;
  color: string;
  available: boolean;
}

const SPORT_OPTIONS: SportOption[] = [
  { type: 'fitness', icon: '🏋️', color: COLORS.primary, available: true },
  { type: 'running', icon: '🏃', color: COLORS.accent, available: false },
  { type: 'cycling', icon: '🚴', color: COLORS.success, available: false },
  { type: 'martial_arts', icon: '🥊', color: COLORS.error, available: false },
  { type: 'swimming', icon: '🏊', color: '#00BCD4', available: false },
  { type: 'yoga', icon: '🧘', color: COLORS.purple, available: false },
];

export const SportSelectionScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const handleSelectSport = (sportType: TSportType) => {
    navigation.navigate('TrainingPlanList', { sportType });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('sportSelection.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>{t('sportSelection.subtitle')}</Text>

        <View style={styles.grid}>
          {SPORT_OPTIONS.map((sport) => (
            <TouchableOpacity
              key={sport.type}
              style={[
                styles.sportCard,
                !sport.available && styles.sportCardDisabled,
              ]}
              onPress={() => sport.available && handleSelectSport(sport.type)}
              disabled={!sport.available}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: sport.available ? sport.color : COLORS.gray[300] },
                ]}
              >
                <Text style={styles.sportIcon}>{sport.icon}</Text>
              </View>
              <Text
                style={[
                  styles.sportName,
                  !sport.available && styles.sportNameDisabled,
                ]}
              >
                {t(`sportTypes.${sport.type}`)}
              </Text>
              {!sport.available && (
                <Text style={styles.comingSoon}>{t('sportSelection.comingSoon')}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.gray[900],
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sportCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  sportCardDisabled: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sportIcon: {
    fontSize: 36,
  },
  sportName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
    textAlign: 'center',
  },
  sportNameDisabled: {
    color: COLORS.gray[500],
  },
  comingSoon: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[400],
    marginTop: SPACING.xs,
  },
});
