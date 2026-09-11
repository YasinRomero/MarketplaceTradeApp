import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { colors } from "@/theme/colors";
import { sharedBadgeStyles } from "./badge.styles";

export type BadgeColorName = "yellow" | "pink" | "orange" | "red" | "green" | "cyan" | "blue" | "purple";

interface BadgeColorProps {
	children: string;
	color?: BadgeColorName;
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
}

export function BadgeColor({ children, color = "orange", style, textStyle }: BadgeColorProps) {
	const palette = colors.card[color];

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: palette.background,
				},
				style,
			]}
		>
			<Text
				style={[
					styles.text,
					{
						color: palette.foreground,
					},
					textStyle,
				]}
			>
				{children}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignSelf: "flex-start",

		paddingVertical: 2,
		paddingHorizontal: 8,

		borderRadius: 4,
	},

	text: {
		...sharedBadgeStyles.text,

		fontWeight: "700",
		letterSpacing: 0.5,
	},
});
