import { ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { colors } from "@/theme/colors";

interface InputIconProps extends Omit<TextInputProps, "style"> {
  icon: ReactNode;

  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export function InputIcon({
  icon,
  containerStyle,
  inputStyle,
  ...props
}: InputIconProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.icon}>{icon}</View>

      <TextInput
        {...props}
        placeholderTextColor={colors.text.secondary}
        style={[styles.input, inputStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 24,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
    gap: 8,

    borderRadius: 8,
  },

  icon: {
    width: 24,
    height: 24,

    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    flex: 1,

    paddingVertical: 0,
    paddingHorizontal: 0,

    fontFamily: "Plus Jakarta Sans",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "400",

    color: colors.text.primary,
  },
});
