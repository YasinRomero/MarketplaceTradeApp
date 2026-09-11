import { colors } from "@/theme/colors";
import { StyleSheet, Text, View } from "react-native";
import { sharedBadgeStyles } from "./badge.styles";
import { BadgeBlackProps } from "./badge.types";

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
