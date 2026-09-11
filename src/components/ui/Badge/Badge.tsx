import { colors, radius, typography } from "@/theme";
import { StyleSheet, Text, View } from "react-native";
import { sharedBadgeStyles } from "./badge.styles";
import { BadgeProps } from "./badge.types";

export function Badge({ children, bordered = false, style, textStyle }: BadgeProps) {
	return (
		<View style={[styles.container, bordered && styles.bordered, style]}>
			<Text style={[styles.text, textStyle]}>{children}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignSelf: "flex-start",
		paddingVertical: 2,
		paddingHorizontal: 8,
		backgroundColor: colors.background.subtle,
		borderRadius: radius.full,
	},

	bordered: {
		borderWidth: 1,
		borderColor: colors.border.default,
	},

	text: {
		...sharedBadgeStyles.text,
		fontWeight: typography.weight.semibold,
		letterSpacing: 0.28,
		color: colors.text.primary,
	},
});
