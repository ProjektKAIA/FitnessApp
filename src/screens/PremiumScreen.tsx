// /workspaces/claude-workspace/fitnessapp/src/screens/PremiumScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { RootStackParamList } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PREMIUM_FEATURES = [
  {
    icon: '🏋️',
    titleKey: 'premium.features.unlimitedWorkouts',
    descKey: 'premium.features.unlimitedWorkoutsDesc',
  },
  {
    icon: '📊',
    titleKey: 'premium.features.advancedAnalytics',
    descKey: 'premium.features.advancedAnalyticsDesc',
  },
  {
    icon: '🤖',
    titleKey: 'premium.features.aiCoach',
    descKey: 'premium.features.aiCoachDesc',
  },
  {
    icon: '📱',
    titleKey: 'premium.features.noAds',
    descKey: 'premium.features.noAdsDesc',
  },
  {
    icon: '☁️',
    titleKey: 'premium.features.cloudSync',
    descKey: 'premium.features.cloudSyncDesc',
  },
];

export const PremiumScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const handleClose = () => {
    navigation.goBack();
  };

  const handleSubscribe = () => {
    // TODO: Implement in-app purchase
  };

  const handleRestorePurchase = () => {
    // TODO: Implement restore purchase
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
        }}
        style={styles.heroImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)', COLORS.gray[900]]}
          style={styles.heroGradient}
        >
          <SafeAreaView edges={['top']}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeIcon}>×</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <View style={styles.heroContent}>
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
            <Text style={styles.heroTitle}>FrameFit Pro</Text>
            <Text style={styles.heroSubtitle}>{t('premium.subtitle')}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Features List */}
        <View style={styles.featuresContainer}>
          {PREMIUM_FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>{feature.icon}</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{t(feature.titleKey)}</Text>
                <Text style={styles.featureDesc}>{t(feature.descKey)}</Text>
              </View>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          ))}
        </View>

        {/* Pricing Section */}
        <View style={styles.pricingSection}>
          <View style={styles.pricingCard}>
            <View style={styles.pricingBadge}>
              <Text style={styles.pricingBadgeText}>{t('premium.popular')}</Text>
            </View>
            <Text style={styles.pricingPlan}>{t('premium.yearly')}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceCurrency}>€</Text>
              <Text style={styles.priceAmount}>4.99</Text>
              <Text style={styles.pricePeriod}>/{t('premium.month')}</Text>
            </View>
            <Text style={styles.priceNote}>{t('premium.billedYearly')}</Text>
          </View>

          <View style={styles.pricingCardSecondary}>
            <Text style={styles.pricingPlanSecondary}>{t('premium.monthly')}</Text>
            <View style={styles.priceRowSecondary}>
              <Text style={styles.priceCurrencySecondary}>€</Text>
              <Text style={styles.priceAmountSecondary}>9.99</Text>
              <Text style={styles.pricePeriodSecondary}>/{t('premium.month')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <Text style={styles.subscribeButtonText}>
            {t('premium.getFrameFitPro')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.restoreButton} onPress={handleRestorePurchase}>
          <Text style={styles.restoreButtonText}>{t('premium.restorePurchase')}</Text>
        </TouchableOpacity>
        <Text style={styles.disclaimer}>{t('premium.disclaimer')}</Text>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[900],
  },
  heroImage: {
    height: 300,
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: FONT_SIZES['2xl'],
    color: COLORS.white,
    marginTop: -2,
  },
  heroContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  proBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  proBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[400],
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  featuresContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray[700],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  featureIconText: {
    fontSize: FONT_SIZES.xl,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  checkmark: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.success,
    marginLeft: SPACING.sm,
  },
  pricingSection: {
    gap: SPACING.md,
  },
  pricingCard: {
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 2,
    borderColor: COLORS.accent,
    alignItems: 'center',
  },
  pricingBadge: {
    position: 'absolute',
    top: -12,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  pricingBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.white,
  },
  pricingPlan: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  priceCurrency: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  priceAmount: {
    fontSize: FONT_SIZES['4xl'],
    fontWeight: '700',
    color: COLORS.white,
  },
  pricePeriod: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[400],
    marginBottom: 6,
  },
  priceNote: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginTop: SPACING.xs,
  },
  pricingCardSecondary: {
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  pricingPlanSecondary: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[300],
    marginBottom: SPACING.xs,
  },
  priceRowSecondary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  priceCurrencySecondary: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[300],
    marginBottom: 2,
  },
  priceAmountSecondary: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.gray[300],
  },
  pricePeriodSecondary: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    marginBottom: 4,
  },
  bottomBar: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.gray[900],
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[800],
  },
  subscribeButton: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  subscribeButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  restoreButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  disclaimer: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[600],
    textAlign: 'center',
    lineHeight: 16,
    marginTop: SPACING.sm,
  },
});
