import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { colors, spacing, typography } from "@/theme";

export interface LandingParagraphProps {
  subtitle: string;
  title: string;
  style?: StyleProp<ViewStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

export function LandingParagraph({
  subtitle,
  title,
  style,
  subtitleStyle,
  titleStyle,
}: LandingParagraphProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    gap: spacing.sm,
  },

  subtitle: {
    fontFamily: typography.family,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.6,
    color: colors.action.primary,
  },

  title: {
    fontFamily: typography.family,
    fontSize: typography.size["2xl"],
    lineHeight: typography.lineHeight["3xl"],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
});
