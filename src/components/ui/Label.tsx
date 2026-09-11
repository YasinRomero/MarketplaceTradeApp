import { colors, typography } from "@/theme";
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from "react-native";

interface LabelProps extends TextProps {
	children: string;
	size?: "default" | "compact";
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
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.lg,
	},

	compact: {
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
	},
});

const styles = StyleSheet.create({
	base: {
		fontFamily: typography.family,
		fontWeight: typography.weight.semibold,
		color: colors.text.primary,
	},
});
