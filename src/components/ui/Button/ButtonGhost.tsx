import { typography } from "@/theme";
import { colors } from "@/theme/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { buttonSizeStyles, sharedButtonStyles } from "./button.styles";
import { ButtonGhostProps } from "./button.types";

export function ButtonGhost({
	children,
	icon,
	iconPosition = "left",
	disabled = false,
	onPress,
	style,
}: ButtonGhostProps) {
	return (
		<Pressable
			disabled={disabled}
			onPress={onPress}
			style={({ pressed }) => [
				sharedButtonStyles.base,
				buttonSizeStyles.normal,
				pressed && styles.active,
				disabled && sharedButtonStyles.disabled,
				style,
			]}
		>
			{({ hovered }) => (
				<>
					{icon && iconPosition === "left" && <View style={sharedButtonStyles.icon}>{icon}</View>}

					<Text style={[styles.label, hovered && styles.labelHover]}>{children}</Text>

					{icon && iconPosition === "right" && <View style={sharedButtonStyles.icon}>{icon}</View>}
				</>
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	label: {
		...sharedButtonStyles.label,
		color: colors.action.ghostForeground,
	},

	labelHover: {
		color: colors.text.primary,
		fontWeight: typography.weight.bold,
	},

	active: {
		backgroundColor: colors.action.ghostActive,
	},
});
