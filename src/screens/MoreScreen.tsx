import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, APP_VERSION } from '@/constants';
import { Card } from '@/components/common';
import { useUserStore, useLanguageStore, SUPPORTED_LANGUAGES } from '@/stores';
import { useHealthStore } from '@/stores/healthStore';
import { RootStackParamList } from '@/types';

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightElement?: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  rightElement,
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} disabled={!onPress}>
    <Text style={styles.menuIcon}>{icon}</Text>
    <View style={styles.menuContent}>
      <Text style={styles.menuTitle}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    {rightElement || (showArrow && <Text style={styles.menuArrow}>→</Text>)}
  </TouchableOpacity>
);

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const MoreScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const user = useUserStore((state) => state.user);
  const updateSettings = useUserStore((state) => state.updateSettings);
  const logout = useUserStore((state) => state.logout);
  const settings = user?.settings;
  const currentLanguage = useLanguageStore((state) => state.language);

  const currentLanguageName = SUPPORTED_LANGUAGES.find(
    (lang) => lang.code === currentLanguage
  )?.nativeName;

  const healthEnabled = useHealthStore((state) => state.settings.enabled);

  const handleToggleNotifications = () => {
    if (settings) {
      updateSettings({ notifications: !settings.notifications });
    }
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('more.title')}</Text>

        <Card style={styles.profileCard}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || t('more.guestUser')}</Text>
            <Text style={styles.profileEmail}>{user?.email || t('more.notLoggedIn')}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('ProfileEdit')}
          >
            <Text style={styles.editButtonText}>{t('more.edit')}</Text>
          </TouchableOpacity>
        </Card>

        <Text style={styles.sectionTitle}>{t('more.account')}</Text>
        <Card style={styles.menuCard}>
          <MenuItem
            icon="👤"
            title={t('more.profile')}
            subtitle={t('more.profileSubtitle')}
            onPress={() => navigation.navigate('ProfileEdit')}
          />
          <MenuItem
            icon="🔐"
            title={t('more.security')}
            subtitle={t('more.securitySubtitle')}
            onPress={() => navigation.navigate('Security')}
          />
          <MenuItem
            icon="🚪"
            title={t('more.logout')}
            subtitle={t('more.logoutSubtitle')}
            onPress={handleLogout}
          />
        </Card>

        <Text style={styles.sectionTitle}>{t('more.preferences')}</Text>
        <Card style={styles.menuCard}>
          <MenuItem
            icon="🔔"
            title={t('more.notifications')}
            showArrow={false}
            rightElement={
              <Switch
                value={settings?.notifications ?? true}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: COLORS.gray[300], true: COLORS.primary }}
              />
            }
          />
          <MenuItem
            icon="🌙"
            title={t('more.appearance')}
            subtitle={t('more.appearanceSystem')}
          />
          <MenuItem
            icon="🌐"
            title={t('more.language')}
            subtitle={currentLanguageName}
            onPress={() => navigation.navigate('Language')}
          />
          <MenuItem
            icon="❤️"
            title={t('more.healthData')}
            subtitle={healthEnabled ? t('health.connected') : t('health.notConnected')}
            onPress={() => navigation.navigate('HealthSettings')}
          />
        </Card>

        <Text style={styles.sectionTitle}>{t('more.aiCoach')}</Text>
        <Card style={styles.menuCard}>
          <MenuItem
            icon="🤖"
            title={t('more.aiSettings')}
            subtitle={t('more.aiSettingsSubtitle')}
            onPress={() => navigation.navigate('AICoach')}
          />
          <MenuItem
            icon="💬"
            title={t('more.chatgptImport')}
            subtitle={t('more.chatgptImportSubtitle')}
            onPress={() => navigation.navigate('ChatGPTImport')}
          />
        </Card>

        <Text style={styles.sectionTitle}>{t('more.data')}</Text>
        <Card style={styles.menuCard}>
          <MenuItem icon="📤" title={t('more.exportData')} subtitle={t('more.exportDataSubtitle')} />
          <MenuItem icon="📥" title={t('more.importData')} subtitle={t('more.importDataSubtitle')} />
          <MenuItem icon="🗑️" title={t('more.deleteAccount')} subtitle={t('more.deleteAccountSubtitle')} />
        </Card>

        <Text style={styles.sectionTitle}>{t('more.support')}</Text>
        <Card style={styles.menuCard}>
          <MenuItem
            icon="📧"
            title={t('more.contactUs')}
            onPress={() => navigation.navigate('Contact')}
          />
          <MenuItem icon="⭐" title={t('more.rateApp')} />
        </Card>

        <Text style={styles.sectionTitle}>{t('more.legal')}</Text>
        <Card style={styles.menuCard}>
          <MenuItem
            icon="📋"
            title={t('more.terms')}
            subtitle={t('more.termsSubtitle')}
            onPress={() => navigation.navigate('TermsOfService')}
          />
          <MenuItem
            icon="🔒"
            title={t('more.privacy')}
            subtitle={t('more.privacySubtitle')}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
          <MenuItem
            icon="ℹ️"
            title={t('more.impressum')}
            subtitle={t('more.impressumSubtitle')}
            onPress={() => navigation.navigate('Impressum')}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.version}>{t('more.version', { version: APP_VERSION })}</Text>
          <Text style={styles.copyright}>{t('more.madeWith')}</Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.gray[900],
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
    backgroundColor: COLORS.primary,
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
    color: COLORS.white,
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  profileName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  profileEmail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  editButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray[100],
  },
  editButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.primary,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[500],
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
    borderBottomColor: COLORS.gray[100],
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
    color: COLORS.gray[900],
  },
  menuSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  menuArrow: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gray[400],
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  version: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
  },
  copyright: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[400],
    marginTop: SPACING.xs,
  },
});
