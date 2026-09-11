import { ReactNode } from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { colors } from "@/theme/colors";
import { sharedBadgeStyles } from "./badge.styles";

interface BadgeIconProps {
	children: string;
	icon: ReactNode;
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
}

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
		borderRadius: 999,
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
