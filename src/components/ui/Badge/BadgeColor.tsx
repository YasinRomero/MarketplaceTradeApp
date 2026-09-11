import { colors, radius, typography } from "@/theme";
import { StyleSheet, Text, View } from "react-native";
import { sharedBadgeStyles } from "./badge.styles";
import { BadgeColorProps } from "./badge.types";

export function BadgeColor({ children, color = "orange", style, textStyle }: BadgeColorProps) {
	const palette = colors.card[color];

	return (
		<View style={[styles.container, { backgroundColor: palette.background }, style]}>
			<Text style={[styles.text, { color: palette.foreground }, textStyle]}>{children}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignSelf: "flex-start",
		paddingVertical: 2,
		paddingHorizontal: 8,
		borderRadius: radius.xs,
	},

	text: {
		...sharedBadgeStyles.text,
		fontWeight: typography.weight.bold,
		letterSpacing: 0.5,
	},
});
