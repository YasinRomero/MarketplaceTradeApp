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
  buttonSizeStyles,
  IconPosition,
  sharedButtonStyles,
} from "./button.styles";

interface ButtonGhostProps {
  children: string;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ButtonGhost({
  children,
  icon,
  iconPosition = "left",
  disabled = false,
  onPress,
  style,
}: ButtonGhostProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed, hovered }) => [
        sharedButtonStyles.base,
        buttonSizeStyles.normal,
        pressed && styles.active,
        disabled && sharedButtonStyles.disabled,
        style,
      ]}
    >
      {({ hovered }) => (
        <>
          {icon && iconPosition === "left" && (
            <View style={sharedButtonStyles.icon}>{icon}</View>
          )}

          <Text style={[styles.label, hovered && styles.labelHover]}>
            {children}
          </Text>

          {icon && iconPosition === "right" && (
            <View style={sharedButtonStyles.icon}>{icon}</View>
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    ...sharedButtonStyles.label,

    color: colors.action.ghostForeground,
  },

  labelHover: {
    color: colors.text.primary,
    fontWeight: "700",
  },

  active: {
    backgroundColor: colors.action.ghostActive,
  },
});
