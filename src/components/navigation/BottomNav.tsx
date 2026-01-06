import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { scale, scaleFont, MIN_TOUCH_TARGET } from '@/lib';

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  Home: { active: '🏠', inactive: '🏠' },
  Workout: { active: '💪', inactive: '💪' },
  Plan: { active: '📋', inactive: '📋' },
  Programs: { active: '📊', inactive: '📊' },
  More: { active: '⚙️', inactive: '⚙️' },
};

export const BottomNav: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  // Dynamisches Padding basierend auf SafeArea (für iPhones mit Home-Indicator)
  const bottomPadding = Math.max(insets.bottom, SPACING.md);

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const icons = TAB_ICONS[route.name] || { active: '•', inactive: '•' };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={styles.tab}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View
              style={[
                styles.iconContainer,
                isFocused && styles.iconContainerActive,
              ]}
            >
              <Text style={styles.icon}>
                {isFocused ? icons.active : icons.inactive}
              </Text>
            </View>
            <Text
              style={[styles.label, isFocused && styles.labelActive]}
              numberOfLines={1}
            >
              {typeof label === 'string' ? label : route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// Skalierte Werte für verschiedene Bildschirmgrößen
const ICON_SIZE = scale(26);
const ICON_CONTAINER_SIZE = scale(56);
const LABEL_SIZE = scaleFont(11);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.gray[300],
    paddingTop: SPACING.md,
    // Schatten für bessere visuelle Trennung
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: SPACING.xs,
  },
  iconContainer: {
    width: ICON_CONTAINER_SIZE,
    height: scale(36),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(18),
  },
  iconContainerActive: {
    backgroundColor: COLORS.primary + '18',
  },
  icon: {
    fontSize: ICON_SIZE,
  },
  label: {
    fontSize: LABEL_SIZE,
    color: COLORS.gray[600],
    marginTop: SPACING.xs,
    fontWeight: '500',
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
