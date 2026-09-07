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
import {
  BadgeColor,
  type BadgeColorName,
} from "@/components/ui/Badge/BadgeColor";
import { colors, primitives, radius, spacing, typography } from "@/theme";

export interface CardProcedureProps {
  badge: string;
  title: string;
  description: string;
  icon?: ReactNode;
  color?: BadgeColorName;
  style?: StyleProp<ViewStyle>;
  badgeStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
}

export function CardProcedure({
  badge,
  title,
  description,
  icon = <AccountCircle size={24} color={colors.text.inverse} />,
  color = "orange",
  style,
  badgeStyle,
  titleStyle,
  descriptionStyle,
}: CardProcedureProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.content}>
        <View
          style={[
            styles.icon,
            { backgroundColor: colors.card[color].background },
          ]}
        >
          {icon}
        </View>

        <BadgeColor color={color} style={badgeStyle}>
          {badge}
        </BadgeColor>

        <Text style={[styles.title, titleStyle]}>{title}</Text>
        <Text style={[styles.description, descriptionStyle]}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 390,
    minHeight: 195,

    padding: spacing.xl,

    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.xl,
  },

  content: {
    alignItems: "flex-start",
    gap: 10,
  },

  icon: {
    width: 48,
    height: 48,

    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card.green.background,
    borderRadius: radius.lg,
  },

  title: {
    fontFamily: typography.family,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight["2xl"],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },

  description: {
    alignSelf: "stretch",
    fontFamily: typography.family,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.regular,
    color: primitives.neutral[900],
  },
});
