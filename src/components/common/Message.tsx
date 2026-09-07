import { ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { AccountCircle } from "@/components/icons";
import { colors, radius, spacing, typography } from "@/theme";

export type MessageVariant =
  "ghost" | "center" | "base" | "medium" | "large" | "iconColored";

export interface MessageProps {
  message: string;
  variant?: MessageVariant;
  title?: string;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
}

export function Message({
  message,
  variant = "base",
  title,
  icon,
  style,
  titleStyle,
  messageStyle,
}: MessageProps) {
  const isColored = variant === "iconColored";
  const defaultIcon = (
    <AccountCircle
      size={isColored ? 16 : 16}
      color={isColored ? colors.text.inverse : colors.text.secondary}
    />
  );

  return (
    <View style={[styles.container, variantStyles[variant].container, style]}>
      {isColored ? (
        <View style={styles.coloredIcon}>{icon ?? defaultIcon}</View>
      ) : (
        (icon ?? defaultIcon)
      )}

      <View style={styles.content}>
        {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
        <Text
          style={[styles.message, variantStyles[variant].message, messageStyle]}
        >
          {message}
        </Text>
      </View>
    </View>
  );
}

const variantStyles: Record<
  MessageVariant,
  { container: ViewStyle; message: TextStyle }
> = {
  ghost: {
    container: {
      alignItems: "flex-start",
    },
    message: {},
  },
  center: {
    container: {
      alignItems: "center",
    },
    message: {},
  },
  base: {
    container: {
      padding: 10,
      minHeight: 42,
      backgroundColor: colors.background.subtle,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    message: {},
  },
  medium: {
    container: {
      padding: spacing.md,
      minHeight: 46,
      backgroundColor: colors.background.subtle,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    message: {},
  },
  large: {
    container: {
      padding: spacing.lg,
      minHeight: 54,
      backgroundColor: colors.background.subtle,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    message: {},
  },
  iconColored: {
    container: {
      padding: spacing.md,
      minHeight: 65,
      backgroundColor: colors.background.subtle,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    message: {},
  },
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    gap: spacing.sm,
    borderRadius: radius.md,
  },

  coloredIcon: {
    width: 24,
    height: 24,
    padding: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card.red.background,
    borderRadius: radius.md,
  },

  content: {
    flex: 1,
    paddingRight: spacing.sm,
    gap: spacing.xs,
  },

  title: {
    fontFamily: typography.family,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },

  message: {
    fontFamily: typography.family,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.regular,
    color: colors.text.secondary,
  },
});
