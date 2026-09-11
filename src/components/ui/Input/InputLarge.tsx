import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle } from "react-native";

import { colors } from "@/theme/colors";
import { sharedInputStyles } from "./input.styles";

interface InputLargeProps extends TextInputProps {
	style?: StyleProp<TextStyle>;
}

export function InputLarge({ style, ...props }: InputLargeProps) {
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
		minHeight: 48,

		paddingVertical: 14,
		paddingHorizontal: 16,

		borderColor: colors.border.default,

		fontFamily: "Plus Jakarta Sans",
		fontSize: 14,
		lineHeight: 18,
		fontWeight: "400",

		color: colors.text.primary,
	},
});
