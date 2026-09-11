import { colors, radius, typography } from "@/theme";
import { StyleSheet, TextInput, TextStyle, View, ViewStyle } from "react-native";
import { InputIconProps, InputIconVariant } from "./input.types";

export function InputIcon({ icon, variant = "plain", containerStyle, inputStyle, ...props }: InputIconProps) {
	return (
		<View style={[styles.container, variantStyles[variant].container, containerStyle]}>
			<View style={styles.icon}>{icon}</View>
			<TextInput
				{...props}
				placeholderTextColor={colors.text.secondary}
				style={[styles.input, variantStyles[variant].input, inputStyle]}
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

const variantStyles: Record<InputIconVariant, { container: ViewStyle; input: TextStyle }> = {
	plain: {
		container: {},
		input: {},
	},
	normal: {
		container: {
			minHeight: 41,
			paddingVertical: 0,
			backgroundColor: "transparent",
			borderWidth: 0,
		},
		input: {
			paddingVertical: 12,
			paddingHorizontal: 12,
		},
	},
};
