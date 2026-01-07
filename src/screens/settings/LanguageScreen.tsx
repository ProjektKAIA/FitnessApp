import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { Card } from '@/components/common';
import { useLanguageStore, SUPPORTED_LANGUAGES, Language } from '@/stores';
import { useTheme } from '@/contexts/ThemeContext';

export const LanguageScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const currentLanguage = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const handleLanguageChange = useCallback(
    async (language: Language) => {
      await setLanguage(language);
    },
    [setLanguage]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backText, { color: colors.primary }]}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{t('language.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('language.subtitle')}</Text>

        <Card style={styles.languageCard}>
          {SUPPORTED_LANGUAGES.map((lang, index) => {
            const isSelected = currentLanguage === lang.code;
            const isLast = index === SUPPORTED_LANGUAGES.length - 1;

            return (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageItem,
                  !isLast && [styles.languageItemBorder, { borderBottomColor: colors.borderLight }],
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.languageFlag}>
                    {lang.code === 'de' ? '🇩🇪' : '🇬🇧'}
                  </Text>
                  <View style={styles.languageText}>
                    <Text style={[styles.languageName, { color: colors.text }]}>{lang.nativeName}</Text>
                    <Text style={[styles.languageNameEnglish, { color: colors.textTertiary }]}>{lang.name}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.radioButton,
                    { borderColor: colors.border },
                    isSelected && [styles.radioButtonSelected, { borderColor: colors.primary }],
                  ]}
                >
                  {isSelected && <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </Card>

        <Text style={[styles.note, { color: colors.textTertiary }]}>
          {t('language.current')}: {SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.nativeName}
        </Text>
      </View>
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
    paddingVertical: SPACING.sm,
    paddingRight: SPACING.md,
  },
  backText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primary,
    fontWeight: '500',
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  placeholder: {
    width: 60,
  },
  content: {
    padding: SPACING.lg,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
    marginBottom: SPACING.xl,
  },
  languageCard: {
    padding: 0,
    marginBottom: SPACING.lg,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  languageItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  languageText: {
    flexDirection: 'column',
  },
  languageName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  languageNameEnglish: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  note: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    textAlign: 'center',
  },
});
