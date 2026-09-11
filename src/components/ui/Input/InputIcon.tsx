import { ReactNode } from "react";
import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native";

import { colors } from "@/theme/colors";

type InputIconVariant = "plain" | "normal";

interface InputIconProps extends Omit<TextInputProps, "style"> {
	icon: ReactNode;
	variant?: InputIconVariant;

	containerStyle?: StyleProp<ViewStyle>;
	inputStyle?: StyleProp<TextStyle>;
}

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
