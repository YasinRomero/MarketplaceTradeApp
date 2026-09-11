import { radius, typography } from "@/theme";
import { StyleSheet } from "react-native";

export const sharedInputStyles = StyleSheet.create({
	base: {
		borderWidth: 1,
		borderRadius: radius.md,
	},

	text: {
		fontFamily: typography.family,
		fontWeight: typography.weight.regular,
	},
});
