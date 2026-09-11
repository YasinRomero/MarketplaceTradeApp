import { radius } from "@/theme";
import { colors } from "@/theme/colors";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { ButtonIconColor, ButtonIconProps } from "./button.types";

export function ButtonIcon({
	icon,
	size = "small",
	color = "primary",
	disabled = false,
	style,
	onPress,
}: ButtonIconProps) {
	return (
		<Pressable
			disabled={disabled}
			onPress={onPress}
			style={({ pressed, hovered }) => [
				styles.base,
				sizeStyles[size],
				getColorStyle(color, pressed, hovered),
				size === "normal" && styles.rounded,
				disabled && styles.disabled,
				style,
			]}
		>
			{icon}
		</Pressable>
	);
}

function getColorStyle(color: ButtonIconColor, pressed: boolean, hovered: boolean): ViewStyle {
	if (color === "primary") {
		if (pressed) return { backgroundColor: colors.action.primaryActive };
		if (hovered) return { backgroundColor: colors.action.primaryHover };
		return { backgroundColor: colors.action.primary };
	}

	if (pressed) return { backgroundColor: colors.action.ghostActive };
	if (hovered) return { backgroundColor: colors.action.ghostHover };

	return { backgroundColor: "transparent" };
}

const sizeStyles = StyleSheet.create({
	small: {
		width: 32,
		height: 32,
		padding: 4,
		borderRadius: radius.md,
	},

	normal: {
		width: 44,
		height: 44,
		padding: 10,
	},
});

const styles = StyleSheet.create({
	base: {
		justifyContent: "center",
		alignItems: "center",
	},

	rounded: {
		borderRadius: radius.full,
	},

	disabled: {
		opacity: 0.5,
	},
});
