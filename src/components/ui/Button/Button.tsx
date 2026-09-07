import { ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { colors } from "@/theme/colors";

import {
  ButtonSize,
  IconPosition,
  buttonSizeStyles,
  sharedButtonStyles,
} from "./button.styles";

interface ButtonProps {
  children: string;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  children,
  size = "normal",
  icon,
  iconPosition = "left",
  disabled = false,
  onPress,
  style,
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed, hovered }) => [
        sharedButtonStyles.base,
        buttonSizeStyles[size],

        styles.base,

        hovered && styles.hover,
        pressed && styles.active,

        disabled && sharedButtonStyles.disabled,

        style,
      ]}
    >
      {icon && iconPosition === "left" && (
        <View style={sharedButtonStyles.icon}>{icon}</View>
      )}

      <Text style={styles.label}>{children}</Text>

      {icon && iconPosition === "right" && (
        <View style={sharedButtonStyles.icon}>{icon}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.action.primary,
  },

  hover: {
    backgroundColor: colors.action.primaryHover,
  },

  active: {
    backgroundColor: colors.action.primaryActive,
  },

  label: {
    ...sharedButtonStyles.label,

    color: colors.action.primaryForeground,
  },
});
