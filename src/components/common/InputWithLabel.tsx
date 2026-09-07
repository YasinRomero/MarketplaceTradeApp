import {
  StyleProp,
  StyleSheet,
  Text,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { Input } from "@/components/ui/Input";
import { InputLarge } from "@/components/ui/Input/InputLarge";
import { colors, spacing, typography } from "@/theme";

export type InputWithLabelSize = "normal" | "compact";

export interface InputWithLabelProps extends TextInputProps {
  label: string;
  alert?: string;
  size?: InputWithLabelSize;
  visibleAlert?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  alertStyle?: StyleProp<TextStyle>;
}

export function InputWithLabel({
  label,
  alert,
  size = "normal",
  visibleAlert,
  containerStyle,
  labelStyle,
  inputStyle,
  alertStyle,
  ...inputProps
}: InputWithLabelProps) {
  const showAlert = visibleAlert ?? Boolean(alert);
  const InputComponent = size === "compact" ? Input : InputLarge;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, sizeStyles[size].label, labelStyle]}>
        {label}
      </Text>

      <InputComponent
        {...inputProps}
        style={[sizeStyles[size].input, inputStyle]}
      />

      {showAlert && <Text style={[styles.alert, alertStyle]}>{alert}</Text>}
    </View>
  );
}

const sizeStyles: Record<
  InputWithLabelSize,
  { label: TextStyle; input: TextStyle }
> = {
  normal: {
    label: {
      fontSize: typography.size.sm,
      lineHeight: typography.lineHeight.lg,
    },

    input: {
      width: "100%",
    },
  },

  compact: {
    label: {
      fontSize: typography.size.xs,
      lineHeight: 16,
    },

    input: {
      width: "100%",
    },
  },
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: spacing.xs,
  },

  label: {
    fontFamily: typography.family,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },

  alert: {
    fontFamily: typography.family,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.regular,
    color: colors.text.secondary,
  },
});
