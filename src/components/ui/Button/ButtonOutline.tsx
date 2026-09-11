import { radius } from "@/theme";
import { colors } from "@/theme/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { buttonSizeStyles, sharedButtonStyles } from "./button.styles";
import { ButtonOutlineProps } from "./button.types";

export function ButtonOutline({
	icon,
	size = "normal",
	iconPosition = "left",
	disabled = false,
	style,
	children,
	onPress,
}: ButtonOutlineProps) {
	return (
		<Pressable
			disabled={disabled}
			onPress={onPress}
			style={({ pressed }) => [
				sharedButtonStyles.base,
				buttonSizeStyles[size],
				styles.base,
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
		backgroundColor: colors.action.secondary,
		borderWidth: 1,
		borderColor: colors.action.secondaryBorder,
		borderRadius: radius.full,
	},

	active: {
		backgroundColor: colors.action.secondaryActive,
	},

	label: {
		...sharedButtonStyles.label,
		color: colors.action.secondaryForeground,
	},
});
