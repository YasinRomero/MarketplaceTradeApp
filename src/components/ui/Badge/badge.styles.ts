import { radius, typography } from "@/theme";
import { StyleSheet } from "react-native";

export const sharedBadgeStyles = StyleSheet.create({
	pill: {
		borderRadius: radius.full,
	},

	rounded: {
		borderRadius: radius.md,
	},

	text: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
	},

	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
});
