import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { colors } from "@/theme/colors";
import { sharedBadgeStyles } from "./badge.styles";

interface BadgeWhiteProps {
	children: string;
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
}

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
		borderRadius: 999,
	},

	text: {
		...sharedBadgeStyles.text,
		fontWeight: "700",
		color: colors.text.primary,
	},
});
