import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, APP_VERSION } from '@/constants';
import { Card } from '@/components/common';
import { useUserStore } from '@/stores';
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
  const navigation = useNavigation<NavigationProp>();
  const { user, updateSettings } = useUserStore();
  const settings = user?.settings;

  const handleToggleNotifications = () => {
    if (settings) {
      updateSettings({ notifications: !settings.notifications });
    }
  };

  const handleToggleHaptics = () => {
    if (settings) {
      updateSettings({ hapticFeedback: !settings.hapticFeedback });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>More</Text>

        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'Not logged in'}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </Card>

        <Text style={styles.sectionTitle}>Account</Text>
        <Card style={styles.menuCard}>
          <MenuItem icon="👤" title="Profile" subtitle="Edit your profile" />
          <MenuItem icon="🔐" title="Security" subtitle="Password & 2FA" />
          <MenuItem icon="💳" title="Subscription" subtitle="Free Plan" />
        </Card>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <Card style={styles.menuCard}>
          <MenuItem
            icon="🔔"
            title="Notifications"
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
            icon="📳"
            title="Haptic Feedback"
            showArrow={false}
            rightElement={
              <Switch
                value={settings?.hapticFeedback ?? true}
                onValueChange={handleToggleHaptics}
                trackColor={{ false: COLORS.gray[300], true: COLORS.primary }}
              />
            }
          />
          <MenuItem
            icon="📏"
            title="Units"
            subtitle={settings?.units === 'metric' ? 'Metric (kg, km)' : 'Imperial (lb, mi)'}
          />
          <MenuItem icon="🌙" title="Appearance" subtitle="System" />
        </Card>

        <Text style={styles.sectionTitle}>AI Coach</Text>
        <Card style={styles.menuCard}>
          <MenuItem icon="🤖" title="AI Settings" subtitle="Configure your AI coach" />
          <MenuItem icon="🔑" title="OpenAI API Key" subtitle="Bring your own key" />
          <MenuItem icon="💬" title="ChatGPT Import" subtitle="Import from ChatGPT" />
        </Card>

        <Text style={styles.sectionTitle}>Data</Text>
        <Card style={styles.menuCard}>
          <MenuItem icon="📤" title="Export Data" subtitle="Download your workouts" />
          <MenuItem icon="📥" title="Import Data" subtitle="Import from other apps" />
          <MenuItem icon="🗑️" title="Delete Account" subtitle="Permanently delete" />
        </Card>

        <Text style={styles.sectionTitle}>Support</Text>
        <Card style={styles.menuCard}>
          <MenuItem icon="❓" title="Help Center" />
          <MenuItem icon="📧" title="Contact Us" />
          <MenuItem icon="⭐" title="Rate App" />
        </Card>

        <Text style={styles.sectionTitle}>Rechtliches</Text>
        <Card style={styles.menuCard}>
          <MenuItem
            icon="📋"
            title="AGB"
            subtitle="Allgemeine Geschäftsbedingungen"
            onPress={() => navigation.navigate('TermsOfService')}
          />
          <MenuItem
            icon="🔒"
            title="Datenschutz"
            subtitle="Datenschutzerklärung"
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
          <MenuItem
            icon="ℹ️"
            title="Impressum"
            subtitle="Rechtliche Angaben"
            onPress={() => navigation.navigate('Impressum')}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.version}>Version {APP_VERSION}</Text>
          <Text style={styles.copyright}>Made with 💪 for fitness lovers</Text>
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
