import { ReactNode } from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

import { colors } from "@/theme/colors";

type ButtonIconSize = "small" | "large";

type ButtonIconVariant = "primary" | "ghost";

interface ButtonIconProps {
  icon: ReactNode;
  accessibilityLabel: string;
  size?: ButtonIconSize;
  variant?: ButtonIconVariant;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ButtonIcon({
  icon,
  accessibilityLabel,
  size = "small",
  variant = "primary",
  disabled = false,
  onPress,
  style,
}: ButtonIconProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed, hovered }) => [
        styles.base,
        sizeStyles[size],

        getVariantStyle(variant, pressed, hovered),

        size === "large" && styles.rounded,

        disabled && styles.disabled,

        style,
      ]}
    >
      {icon}
    </Pressable>
  );
}

function getVariantStyle(
  variant: ButtonIconVariant,
  pressed: boolean,
  hovered: boolean,
): ViewStyle {
  if (variant === "primary") {
    if (pressed) {
      return {
        backgroundColor: colors.action.primaryActive,
      };
    }

    if (hovered) {
      return {
        backgroundColor: colors.action.primaryHover,
      };
    }

    return {
      backgroundColor: colors.action.primary,
    };
  }

  if (pressed) {
    return {
      backgroundColor: colors.action.ghostActive,
    };
  }

  if (hovered) {
    return {
      backgroundColor: colors.action.ghostHover,
    };
  }

  return {
    backgroundColor: "transparent",
  };
}

const sizeStyles = StyleSheet.create({
  small: {
    width: 32,
    height: 32,
    padding: 4,

    borderRadius: 8,
  },

  large: {
    width: 44,
    height: 44,
    padding: 10,
  },
});

const styles = StyleSheet.create({
  base: {
    justifyContent: "center",
    alignItems: "center",
  },

  rounded: {
    borderRadius: 999,
  },

  disabled: {
    opacity: 0.5,
  },
});
