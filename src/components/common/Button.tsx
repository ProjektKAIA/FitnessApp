// /workspaces/claude-workspace/fitnessapp/src/components/common/Button.tsx

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { useTheme } from '@/contexts';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface Props {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<Props> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return colors.buttonPrimaryBackground;
      case 'secondary':
        return colors.buttonSecondaryBackground;
      case 'outline':
        return colors.buttonOutlineBackground;
      case 'ghost':
        return 'transparent';
      case 'destructive':
        return colors.error;
      default:
        return colors.buttonPrimaryBackground;
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') return colors.buttonOutlineBorder;
    return 'transparent';
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return colors.buttonPrimaryText;
      case 'secondary':
        return colors.buttonSecondaryText;
      case 'outline':
        return colors.buttonOutlineText;
      case 'ghost':
        return colors.primary;
      case 'destructive':
        return '#FFFFFF';
      default:
        return colors.buttonPrimaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[`size_${size}`],
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.buttonPrimaryText : colors.primary}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              styles[`text_${size}`],
              { color: getTextColor() },
              icon ? styles.textWithIcon : undefined,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.lg,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  size_sm: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    minHeight: 32,
  },
  size_md: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    minHeight: 44,
  },
  size_lg: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    minHeight: 52,
  },
  text: {
    fontWeight: '600',
  },
  textWithIcon: {
    marginLeft: SPACING.sm,
  },
  text_sm: {
    fontSize: FONT_SIZES.sm,
  },
  text_md: {
    fontSize: FONT_SIZES.base,
  },
  text_lg: {
    fontSize: FONT_SIZES.lg,
  },
});
