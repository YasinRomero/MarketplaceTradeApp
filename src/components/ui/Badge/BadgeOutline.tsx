import { colors, radius, typography } from "@/theme";
import { StyleSheet, Text, View } from "react-native";
import { sharedBadgeStyles } from "./badge.styles";
import { BadgeOutlineProps } from "./badge.types";

export function BadgeOutline({ children, style, textStyle }: BadgeOutlineProps) {
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
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.full,
	},

	text: {
		...sharedBadgeStyles.text,
		fontWeight: typography.weight.semibold,
		letterSpacing: 0.28,
		color: colors.text.primary,
	},
});
