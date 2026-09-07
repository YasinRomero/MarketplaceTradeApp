import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { colors, primitives, radius, spacing, typography } from "@/theme";

export type StepCardTone = keyof typeof colors.card;

export interface StepCardProps {
  step: string | number;
  title: string;
  description: string;
  tone?: StepCardTone;
  style?: StyleProp<ViewStyle>;
  stepStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
}

export function StepCard({
  step,
  title,
  description,
  tone = "red",
  style,
  stepStyle,
  titleStyle,
  descriptionStyle,
}: StepCardProps) {
  const palette = colors.card[tone];

  return (
    <View style={[styles.card, style]}>
      <View style={styles.stepWrapper}>
        <View style={[styles.step, { backgroundColor: palette.background }]}>
          <Text
            style={[styles.stepText, { color: palette.foreground }, stepStyle]}
          >
            {step}
          </Text>
        </View>
      </View>

      <View style={styles.titleWrapper}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </View>

      <Text style={[styles.description, descriptionStyle]}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 384,
    minHeight: 206,

    alignItems: "center",
    padding: spacing["2xl"],

    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.xl,
  },

  stepWrapper: {
    paddingBottom: spacing.xl,
  },

  step: {
    width: 56,
    height: 56,

    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xl,

    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  stepText: {
    fontFamily: typography.family,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight["2xl"],
    fontWeight: typography.weight.bold,
    textAlign: "center",
  },

  titleWrapper: {
    paddingBottom: spacing.md,
  },

  title: {
    fontFamily: typography.family,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight["2xl"],
    fontWeight: typography.weight.bold,
    textAlign: "center",
    color: colors.text.primary,
  },

  description: {
    alignSelf: "stretch",
    fontFamily: typography.family,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.regular,
    textAlign: "center",
    color: primitives.neutral[900],
  },
});
