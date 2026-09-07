import { ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { colors } from "@/theme/colors";

type InputSelectSize = "normal" | "compact";

type InputSelectVariant = "outline" | "filled" | "plain";

type IconPosition = "left" | "right" | "both" | "none";

interface InputSelectProps {
  value: string;

  leftIcon?: ReactNode;
  rightIcon?: ReactNode;

  iconPosition?: IconPosition;

  size?: InputSelectSize;
  variant?: InputSelectVariant;

  onPress?: () => void;

  disabled?: boolean;

  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function InputSelect({
  value,

  leftIcon,
  rightIcon,

  iconPosition = "none",

  size = "normal",
  variant = "filled",

  onPress,

  disabled = false,

  containerStyle,
  textStyle,
}: InputSelectProps) {
  const showLeftIcon = iconPosition === "left" || iconPosition === "both";

  const showRightIcon = iconPosition === "right" || iconPosition === "both";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={[
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        disabled && styles.disabled,
        containerStyle,
      ]}
    >
      <View style={styles.valueContainer}>
        {showLeftIcon && leftIcon && (
          <View style={styles.icon}>{leftIcon}</View>
        )}

        <Text numberOfLines={1} style={[styles.text, textStyle]}>
          {value}
        </Text>
      </View>

      {showRightIcon && rightIcon && (
        <View style={styles.icon}>{rightIcon}</View>
      )}
    </Pressable>
  );
}

const sizeStyles = StyleSheet.create({
  normal: {
    minHeight: 44,

    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  compact: {
    minHeight: 32,

    paddingVertical: 4,
    paddingHorizontal: 12,
  },
});

const variantStyles = StyleSheet.create({
  filled: {
    backgroundColor: colors.background.subtle,

    borderRadius: 8,
  },

  outline: {
    backgroundColor: "transparent",

    borderWidth: 1,
    borderColor: colors.border.default,

    borderRadius: 8,
  },

  plain: {
    backgroundColor: "transparent",

    borderRadius: 8,
  },
});

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    gap: 8,
  },

  valueContainer: {
    flex: 1,

    flexDirection: "row",
    alignItems: "center",

    gap: 8,
  },

  icon: {
    width: 24,
    height: 24,

    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    flex: 1,

    fontFamily: "Plus Jakarta Sans",
    fontWeight: "400",

    fontSize: 12,
    lineHeight: 15,

    color: colors.text.primary,
  },

  disabled: {
    opacity: 0.5,
  },
});
