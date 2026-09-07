import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
} from "react-native";

import { colors } from "@/theme/colors";
import { sharedInputStyles } from "./input.styles";

interface InputMiniProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
}

export function InputMini({ style, ...props }: InputMiniProps) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={colors.text.secondary}
      style={[sharedInputStyles.base, styles.input, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 25,

    paddingVertical: 4,
    paddingHorizontal: 26,

    borderColor: colors.border.default,

    fontFamily: "Plus Jakarta Sans",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "400",

    color: colors.text.primary,
  },
});
