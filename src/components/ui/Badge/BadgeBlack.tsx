import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { colors } from "@/theme/colors";
import { sharedBadgeStyles } from "./badge.styles";

interface BadgeBlackProps {
	children: string;
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
}

export function BadgeBlack({ children, style, textStyle }: BadgeBlackProps) {
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

		backgroundColor: colors.text.primary,

		borderRadius: 999,
	},

	text: {
		...sharedBadgeStyles.text,
		fontWeight: "700",
		color: colors.text.inverse,
	},
});
