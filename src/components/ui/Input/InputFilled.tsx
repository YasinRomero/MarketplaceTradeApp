import { colors, radius, typography } from "@/theme";
import { StyleSheet, TextInput, View } from "react-native";
import { InputFilledProps } from "./input.types";

export function InputFilled({ icon, containerStyle, inputStyle, ...props }: InputFilledProps) {
	return (
		<View style={[styles.container, containerStyle]}>
			<View style={styles.icon}>{icon}</View>
			<TextInput {...props} placeholderTextColor={colors.text.secondary} style={[styles.input, inputStyle]} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		minHeight: 44,
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 16,
		gap: 8,
		backgroundColor: colors.background.subtle,
		borderRadius: radius.md,
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
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.md,
		fontWeight: typography.weight.regular,
		color: colors.text.primary,
	},
});
