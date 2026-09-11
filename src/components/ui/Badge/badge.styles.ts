import { StyleSheet } from "react-native";

export const sharedBadgeStyles = StyleSheet.create({
	pill: {
		borderRadius: 999,
	},

	rounded: {
		borderRadius: 8,
	},

	text: {
		fontFamily: "Plus Jakarta Sans",
		fontSize: 12,
		lineHeight: 15,
	},

	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
});
