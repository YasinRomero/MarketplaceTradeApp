import { radius, typography } from "@/theme";
import { StyleSheet } from "react-native";

export const sharedInputStyles = StyleSheet.create({
	base: {
		minWidth: "100%",
		alignSelf: "stretch",
		borderWidth: 1,
		borderRadius: radius.md,
	},

	text: {
		fontFamily: typography.family,
		fontWeight: typography.weight.regular,
	},
});
