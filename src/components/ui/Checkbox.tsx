import { colors, radius, typography } from "@/theme";
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

interface CheckboxProps {
	label: string;
	checked: boolean;
	inverse?: boolean;
	bold?: boolean;
	onChange?: (checked: boolean) => void;
	style?: StyleProp<ViewStyle>;
	labelStyle?: StyleProp<TextStyle>;
	disabled?: boolean;
}

export function Checkbox({
	label,
	checked,
	inverse = false,
	bold = true,
	onChange,
	style,
	labelStyle,
	disabled = false,
}: CheckboxProps) {
	return (
		<Pressable
			disabled={disabled}
			onPress={() => onChange?.(!checked)}
			style={[styles.container, disabled && styles.disabled, style]}
		>
			<View
				style={[
					styles.checkbox,
					checked ? (inverse ? styles.checkedInverse : styles.checked) : styles.unchecked,
				]}
			>
				{checked && <Text style={styles.check}>✓</Text>}
			</View>

			<Text
				style={[
					styles.label,
					bold ? styles.labelMedium : styles.labelRegular,
					inverse && checked && styles.labelInverse,
					labelStyle,
				]}
			>
				{label}
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
	},

	checkbox: {
		width: 16,
		height: 16,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: radius.xs,
	},

	unchecked: {
		backgroundColor: "transparent",
		borderWidth: 1,
		borderColor: colors.border.default,
	},

	checked: {
		backgroundColor: colors.action.primary,
	},

	checkedInverse: {
		backgroundColor: colors.text.primary,
	},

	check: {
		color: colors.text.inverse,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		fontWeight: typography.weight.bold,
	},

	label: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		color: colors.text.primary,
	},

	labelMedium: {
		fontWeight: typography.weight.medium,
	},

	labelRegular: {
		fontWeight: typography.weight.regular,
	},

	labelInverse: {
		color: colors.text.secondary,
	},

	disabled: {
		opacity: 0.5,
	},
});
