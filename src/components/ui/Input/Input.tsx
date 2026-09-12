import { colors, spacing, typography } from "@/theme";
import { StyleSheet, TextInput } from "react-native";
import { sharedInputStyles } from "./input.styles";
import { InputProps } from "./input.types";

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
		padding: spacing.md,
		borderColor: colors.border.default,
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		fontWeight: typography.weight.regular,
		color: colors.text.primary,
	},
});
