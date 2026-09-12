import { radius, typography } from "@/theme";
import { StyleSheet } from "react-native";

export const buttonSizeStyles = StyleSheet.create({
	compact: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		gap: 6,
	},

	normal: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		gap: 8,
	},

	large: {
		paddingVertical: 15,
		paddingHorizontal: 24,
		gap: 6,
	},
});

export const sharedButtonStyles = StyleSheet.create({
	base: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: radius.sm,
	},

	rounded: {
		borderRadius: radius.full,
	},

	label: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		fontWeight: typography.weight.semibold,
		textAlign: "center",
	},

	icon: {
		justifyContent: "center",
		alignItems: "center",
	},

	disabled: {
		opacity: 0.5,
	},
});
