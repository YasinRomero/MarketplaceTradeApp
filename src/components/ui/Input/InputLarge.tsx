import { colors, typography } from "@/theme";
import { StyleSheet, TextInput } from "react-native";
import { sharedInputStyles } from "./input.styles";
import { InputLargeProps } from "./input.types";

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
		paddingVertical: 14,
		paddingHorizontal: 16,
		borderColor: colors.border.default,
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.md,
		fontWeight: typography.weight.regular,
		color: colors.text.primary,
	},
});
