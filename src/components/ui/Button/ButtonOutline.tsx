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

interface ButtonOutlineProps {
  children: string;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ButtonOutline({
  children,
  size = "normal",
  icon,
  iconPosition = "left",
  disabled = false,
  onPress,
  style,
}: ButtonOutlineProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        sharedButtonStyles.base,
        buttonSizeStyles[size],

        styles.base,

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
    backgroundColor: colors.action.secondary,

    borderWidth: 1,

    borderColor: colors.action.secondaryBorder,

    borderRadius: 999,
  },

  active: {
    backgroundColor: colors.action.secondaryActive,
  },

  label: {
    ...sharedButtonStyles.label,

    color: colors.action.secondaryForeground,
  },
});
