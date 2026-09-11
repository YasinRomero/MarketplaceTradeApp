import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from "react-native";

import { colors } from "@/theme/colors";

type LabelSize = "default" | "compact";

interface LabelProps extends TextProps {
	children: string;
	size?: LabelSize;
	style?: StyleProp<TextStyle>;
}

export function Label({ children, size = "default", style, ...props }: LabelProps) {
	return (
		<Text {...props} style={[styles.base, sizeStyles[size], style]}>
			{children}
		</Text>
	);
}

const sizeStyles = StyleSheet.create({
	default: {
		fontSize: 14,
		lineHeight: 20,
	},

	compact: {
		fontSize: 12,
		lineHeight: 16,
	},
});

const styles = StyleSheet.create({
	base: {
		fontFamily: "Plus Jakarta Sans",
		fontWeight: "600",
		color: colors.text.primary,
	},
});
