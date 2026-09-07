import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle } from "react-native";

import { colors } from "@/theme/colors";
import { sharedInputStyles } from "./input.styles";

interface InputProps extends TextInputProps {
	style?: StyleProp<TextStyle>;
}

export function Input({ style, ...props }: InputProps) {
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
		minHeight: 41,

		padding: 12,

		borderColor: colors.border.default,

		fontFamily: "Plus Jakarta Sans",
		fontSize: 12,
		lineHeight: 15,
		fontWeight: "400",

		color: colors.text.primary,
	},
});
