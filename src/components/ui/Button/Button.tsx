import { colors } from "@/theme/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { buttonSizeStyles, sharedButtonStyles } from "./button.styles";
import { ButtonProps } from "./button.types";

export function Button({
	size = "normal",
	icon,
	iconPosition = "left",
	disabled = false,
	style,
	children,
	onPress,
}: ButtonProps) {
	return (
		<Pressable
			disabled={disabled}
			onPress={onPress}
			style={({ pressed, hovered }) => [
				sharedButtonStyles.base,
				buttonSizeStyles[size],
				styles.base,
				hovered && styles.hover,
				pressed && styles.active,
				disabled && sharedButtonStyles.disabled,
				style,
			]}
		>
			{icon && iconPosition === "left" && <View style={sharedButtonStyles.icon}>{icon}</View>}
			<Text style={styles.label}>{children}</Text>
			{icon && iconPosition === "right" && <View style={sharedButtonStyles.icon}>{icon}</View>}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	base: {
		backgroundColor: colors.action.primary,
	},

	hover: {
		backgroundColor: colors.action.primaryHover,
	},

	active: {
		backgroundColor: colors.action.primaryActive,
	},

	label: {
		...sharedButtonStyles.label,
		color: colors.action.primaryForeground,
	},
});
