// /workspaces/claude-workspace/fitnessapp/src/components/navigation/BottomNav.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Dumbbell, BookOpen, User, Settings, LucideIcon } from 'lucide-react-native';

import { SPACING, BORDER_RADIUS } from '@/constants';
import { useTheme } from '@/contexts';
import { scale, scaleFont, MIN_TOUCH_TARGET } from '@/lib';

const TAB_ICONS: Record<string, LucideIcon> = {
  Home: Home,
  Workout: Dumbbell,
  Guide: BookOpen,
  You: User,
  More: Settings,
};

const TAB_BAR_HEIGHT = scale(70);
const TAB_BAR_MARGIN = SPACING.lg;
const ICON_SIZE = scale(24);
const ICON_CONTAINER_SIZE = scale(48);
const LABEL_SIZE = scaleFont(10);

export const BottomNav: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const bottomMargin = Math.max(insets.bottom, SPACING.md);

  return (
    <View
      style={[
        styles.wrapper,
        {
          bottom: bottomMargin,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark
              ? 'rgba(26, 26, 26, 0.92)'
              : 'rgba(255, 255, 255, 0.92)',
            borderColor: colors.border,
          },
        ]}
      >
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

        const IconComponent = TAB_ICONS[route.name] || Home;
        const iconColor = isFocused ? colors.primary : colors.textSecondary;

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
                isFocused && {
                  backgroundColor: colors.primary + (isDark ? '30' : '18'),
                },
              ]}
            >
              <IconComponent
                size={ICON_SIZE}
                color={iconColor}
                strokeWidth={isFocused ? 2.5 : 2}
              />
            </View>
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary },
                isFocused && { color: colors.primary, fontWeight: '600' },
              ]}
              numberOfLines={1}
            >
              {typeof label === 'string' ? label : route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
      </View>
    </View>
  );
};

// Export height for screens to use as bottom padding
export const FLOATING_TAB_BAR_HEIGHT = TAB_BAR_HEIGHT + TAB_BAR_MARGIN * 2;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: TAB_BAR_MARGIN,
    right: TAB_BAR_MARGIN,
  },
  container: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    borderRadius: BORDER_RADIUS['2xl'],
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: MIN_TOUCH_TARGET,
  },
  iconContainer: {
    width: ICON_CONTAINER_SIZE,
    height: scale(32),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(16),
  },
  label: {
    fontSize: LABEL_SIZE,
    marginTop: 2,
    fontWeight: '500',
  },
});
