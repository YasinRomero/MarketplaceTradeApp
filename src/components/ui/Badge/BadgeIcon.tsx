import { colors, radius } from "@/theme";
import { StyleSheet, Text, View } from "react-native";
import { sharedBadgeStyles } from "./badge.styles";
import { BadgeIconProps } from "./badge.types";

export function BadgeIcon({ children, icon, style, textStyle }: BadgeIconProps) {
	return (
		<View style={[styles.container, style]}>
			<View style={styles.icon}>{icon}</View>
			<Text style={[styles.text, textStyle]}>{children}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignSelf: "flex-start",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 2,
		paddingHorizontal: 8,
		gap: 4,
		backgroundColor: colors.background.subtle,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.full,
	},

	icon: {
		width: 16,
		height: 16,
		alignItems: "center",
		justifyContent: "center",
	},

	text: {
		...sharedBadgeStyles.text,
		fontWeight: "400",
		color: colors.text.primary,
	},
});
