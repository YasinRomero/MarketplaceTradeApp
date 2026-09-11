import { colors, radius, typography } from "@/theme";
import { StyleSheet, Text, View } from "react-native";
import { sharedBadgeStyles } from "./badge.styles";
import { BadgeWhiteProps } from "./badge.types";

export function BadgeWhite({ children, style, textStyle }: BadgeWhiteProps) {
	return (
		<View style={[styles.container, style]}>
			<Text style={[styles.text, textStyle]}>{children}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignSelf: "flex-start",
		paddingVertical: 4,
		paddingHorizontal: 12,
		backgroundColor: colors.background.surface,
		borderRadius: radius.full,
	},

	text: {
		...sharedBadgeStyles.text,
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},
});
