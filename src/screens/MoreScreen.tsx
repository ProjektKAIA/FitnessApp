// /workspaces/claude-workspace/fitnessapp/src/screens/MoreScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  Linking,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { FONT_SIZES, SPACING, BORDER_RADIUS, APP_VERSION } from '@/constants';
import { Card } from '@/components/common';
import { FLOATING_TAB_BAR_HEIGHT } from '@/components/navigation';
import { useUserStore, useLanguageStore, SUPPORTED_LANGUAGES } from '@/stores';
import { useHealthStore } from '@/stores/healthStore';
import { useTheme } from '@/contexts';
import { RootStackParamList, IUserSettings } from '@/types';

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightElement?: React.ReactNode;
  textColor: string;
  subtitleColor: string;
  arrowColor: string;
  borderColor: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  rightElement,
  textColor,
  subtitleColor,
  arrowColor,
  borderColor,
}) => (
  <TouchableOpacity
    style={[styles.menuItem, { borderBottomColor: borderColor }]}
    onPress={onPress}
    disabled={!onPress}
  >
    <Text style={styles.menuIcon}>{icon}</Text>
    <View style={styles.menuContent}>
      <Text style={[styles.menuTitle, { color: textColor }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.menuSubtitle, { color: subtitleColor }]}>{subtitle}</Text>
      )}
    </View>
    {rightElement || (showArrow && <Text style={[styles.menuArrow, { color: arrowColor }]}>→</Text>)}
  </TouchableOpacity>
);

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type ThemeOption = IUserSettings['theme'];

interface ThemePickerProps {
  visible: boolean;
  onClose: () => void;
  currentTheme: ThemeOption;
  onSelect: (theme: ThemeOption) => void;
}

const ThemePicker: React.FC<ThemePickerProps> = ({
  visible,
  onClose,
  currentTheme,
  onSelect,
}) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();

  const themeOptions: { value: ThemeOption; label: string; icon: string }[] = [
    { value: 'light', label: t('more.themeLight'), icon: '☀️' },
    { value: 'dark', label: t('more.themeDark'), icon: '🌙' },
    { value: 'system', label: t('more.themeSystem'), icon: '📱' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={[styles.modalContent, { backgroundColor: colors.surface }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {t('more.appearance')}
          </Text>
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.themeOption,
                { borderBottomColor: colors.border },
                currentTheme === option.value && {
                  backgroundColor: isDark ? colors.surfaceElevated : colors.background,
                },
              ]}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
            >
              <Text style={styles.themeOptionIcon}>{option.icon}</Text>
              <Text style={[styles.themeOptionLabel, { color: colors.text }]}>
                {option.label}
              </Text>
              {currentTheme === option.value && (
                <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: colors.surfaceElevated }]}
            onPress={onClose}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>
              {t('common.cancel')}
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export const MoreScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark, themeSetting, setTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const user = useUserStore((state) => state.user);
  const updateSettings = useUserStore((state) => state.updateSettings);
  const logout = useUserStore((state) => state.logout);
  const settings = user?.settings;
  const currentLanguage = useLanguageStore((state) => state.language);
  const [isThemePickerVisible, setIsThemePickerVisible] = useState(false);

  const currentLanguageName = SUPPORTED_LANGUAGES.find(
    (lang) => lang.code === currentLanguage
  )?.nativeName;

  const healthEnabled = useHealthStore((state) => state.settings.enabled);

  const getThemeLabel = (): string => {
    switch (themeSetting) {
      case 'light':
        return t('more.themeLight');
      case 'dark':
        return t('more.themeDark');
      default:
        return t('more.themeSystem');
    }
  };

  const handleToggleNotifications = () => {
    if (settings) {
      updateSettings({ notifications: !settings.notifications });
    }
  };

  const handleThemeSelect = (theme: ThemeOption) => {
    setTheme(theme);
  };

  const handleLogout = () => {
    Alert.alert(
      t('more.logoutTitle'),
      t('more.logoutMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('more.logout'),
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const handleRateApp = async () => {
    const iosAppId = 'YOUR_APP_ID';
    const androidPackage = 'com.framefit.app';

    const storeUrl = Platform.select({
      ios: `https://apps.apple.com/app/id${iosAppId}?action=write-review`,
      android: `https://play.google.com/store/apps/details?id=${androidPackage}`,
      default: '',
    });

    if (storeUrl) {
      try {
        const canOpen = await Linking.canOpenURL(storeUrl);
        if (canOpen) {
          await Linking.openURL(storeUrl);
        } else {
          Alert.alert(t('common.error'), t('more.rateAppError'));
        }
      } catch (error) {
        console.error('[RateApp]:', error);
        Alert.alert(t('common.error'), t('more.rateAppError'));
      }
    }
  };

  const menuItemProps = {
    textColor: colors.text,
    subtitleColor: colors.textSecondary,
    arrowColor: colors.textTertiary,
    borderColor: colors.borderLight,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text }]}>{t('more.title')}</Text>

        <Card style={[styles.profileCard, { backgroundColor: colors.card }]}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {user?.name || t('more.guestUser')}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
              {user?.email || t('more.notLoggedIn')}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.surfaceElevated }]}
            onPress={() => navigation.navigate('ProfileEdit')}
          >
            <Text style={[styles.editButtonText, { color: colors.primary }]}>
              {t('more.edit')}
            </Text>
          </TouchableOpacity>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('more.account')}
        </Text>
        <Card style={[styles.menuCard, { backgroundColor: colors.card }]}>
          <MenuItem
            icon="👤"
            title={t('more.profile')}
            subtitle={t('more.profileSubtitle')}
            onPress={() => navigation.navigate('ProfileEdit')}
            {...menuItemProps}
          />
          <MenuItem
            icon="🔐"
            title={t('more.security')}
            subtitle={t('more.securitySubtitle')}
            onPress={() => navigation.navigate('Security')}
            {...menuItemProps}
          />
          <MenuItem
            icon="🚪"
            title={t('more.logout')}
            subtitle={t('more.logoutSubtitle')}
            onPress={handleLogout}
            {...menuItemProps}
          />
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('more.preferences')}
        </Text>
        <Card style={[styles.menuCard, { backgroundColor: colors.card }]}>
          <MenuItem
            icon="🔔"
            title={t('more.notifications')}
            showArrow={false}
            rightElement={
              <Switch
                value={settings?.notifications ?? true}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
              />
            }
            {...menuItemProps}
          />
          <MenuItem
            icon={isDark ? '🌙' : '☀️'}
            title={t('more.appearance')}
            subtitle={getThemeLabel()}
            onPress={() => setIsThemePickerVisible(true)}
            {...menuItemProps}
          />
          <MenuItem
            icon="🌐"
            title={t('more.language')}
            subtitle={currentLanguageName}
            onPress={() => navigation.navigate('Language')}
            {...menuItemProps}
          />
          <MenuItem
            icon="❤️"
            title={t('more.healthData')}
            subtitle={healthEnabled ? t('health.connected') : t('health.notConnected')}
            onPress={() => navigation.navigate('HealthSettings')}
            {...menuItemProps}
          />
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('more.aiCoach')}
        </Text>
        <Card style={[styles.menuCard, { backgroundColor: colors.card }]}>
          <MenuItem
            icon="🤖"
            title={t('more.aiSettings')}
            subtitle={t('more.aiSettingsSubtitle')}
            onPress={() => navigation.navigate('AICoach')}
            {...menuItemProps}
          />
          <MenuItem
            icon="💬"
            title={t('more.chatgptImport')}
            subtitle={t('more.chatgptImportSubtitle')}
            onPress={() => navigation.navigate('ChatGPTImport')}
            {...menuItemProps}
          />
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('more.data')}
        </Text>
        <Card style={[styles.menuCard, { backgroundColor: colors.card }]}>
          <MenuItem
            icon="📤"
            title={t('more.exportData')}
            subtitle={t('more.exportDataSubtitle')}
            onPress={() => navigation.navigate('DataExport')}
            {...menuItemProps}
          />
          <MenuItem
            icon="📥"
            title={t('more.importData')}
            subtitle={t('more.importDataSubtitle')}
            onPress={() => navigation.navigate('DataImport')}
            {...menuItemProps}
          />
          <MenuItem
            icon="🗑️"
            title={t('more.deleteAccount')}
            subtitle={t('more.deleteAccountSubtitle')}
            onPress={() => navigation.navigate('DeleteAccount')}
            {...menuItemProps}
          />
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('more.support')}
        </Text>
        <Card style={[styles.menuCard, { backgroundColor: colors.card }]}>
          <MenuItem
            icon="📧"
            title={t('more.contactUs')}
            onPress={() => navigation.navigate('Contact')}
            {...menuItemProps}
          />
          <MenuItem
            icon="⭐"
            title={t('more.rateApp')}
            onPress={handleRateApp}
            {...menuItemProps}
          />
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('more.legal')}
        </Text>
        <Card style={[styles.menuCard, { backgroundColor: colors.card }]}>
          <MenuItem
            icon="📋"
            title={t('more.terms')}
            subtitle={t('more.termsSubtitle')}
            onPress={() => navigation.navigate('TermsOfService')}
            {...menuItemProps}
          />
          <MenuItem
            icon="🔒"
            title={t('more.privacy')}
            subtitle={t('more.privacySubtitle')}
            onPress={() => navigation.navigate('PrivacyPolicy')}
            {...menuItemProps}
          />
          <MenuItem
            icon="ℹ️"
            title={t('more.impressum')}
            subtitle={t('more.impressumSubtitle')}
            onPress={() => navigation.navigate('Impressum')}
            {...menuItemProps}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={[styles.version, { color: colors.textTertiary }]}>
            {t('more.version', { version: APP_VERSION })}
          </Text>
          <Text style={[styles.copyright, { color: colors.textTertiary }]}>
            {t('more.madeWith')}
          </Text>
        </View>
      </ScrollView>

      <ThemePicker
        visible={isThemePickerVisible}
        onClose={() => setIsThemePickerVisible(false)}
        currentTheme={themeSetting}
        onSelect={handleThemeSelect}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: FLOATING_TAB_BAR_HEIGHT + SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  profileName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  editButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  editButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  menuCard: {
    padding: 0,
    marginBottom: SPACING.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: FONT_SIZES.lg,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  version: {
    fontSize: FONT_SIZES.sm,
  },
  copyright: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderBottomWidth: 1,
  },
  themeOptionIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  themeOptionLabel: {
    flex: 1,
    fontSize: FONT_SIZES.base,
  },
  checkmark: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  cancelButton: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
  },
});
