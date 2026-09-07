import { ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { KeyboardArrowDown } from "@/components/icons";
import { InputSelect } from "@/components/ui/InputSelect";
import { colors, spacing, typography } from "@/theme";

export interface SelectLabelProps {
  label: string;
  value: string;
  alert?: string;
  visibleAlert?: boolean;
  rightIcon?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  selectStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  alertStyle?: StyleProp<TextStyle>;
}

export function SelectLabel({
  label,
  value,
  alert,
  visibleAlert,
  rightIcon = <KeyboardArrowDown size={24} color={colors.text.secondary} />,
  onPress,
  disabled = false,
  containerStyle,
  labelStyle,
  selectStyle,
  textStyle,
  alertStyle,
}: SelectLabelProps) {
  const showAlert = visibleAlert ?? Boolean(alert);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>

      <InputSelect
        value={value}
        rightIcon={rightIcon}
        iconPosition="right"
        variant="outline"
        disabled={disabled}
        onPress={onPress}
        containerStyle={[styles.select, selectStyle]}
        textStyle={[styles.selectText, textStyle]}
      />

      {showAlert && <Text style={[styles.alert, alertStyle]}>{alert}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: spacing.xs,
  },

  label: {
    fontFamily: typography.family,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },

  select: {
    width: "100%",
    height: 46,
  },

  selectText: {
    fontFamily: typography.family,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.weight.regular,
  },

  alert: {
    fontFamily: typography.family,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.regular,
    color: colors.text.secondary,
  },
});
