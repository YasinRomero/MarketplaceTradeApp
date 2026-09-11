import { colors, typography } from "@/theme";
import { StyleSheet, TextInput } from "react-native";
import { sharedInputStyles } from "./input.styles";
import { InputMiniProps } from "./input.types";

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
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		fontWeight: typography.weight.regular,
		color: colors.text.primary,
	},
});
