import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { colors } from "@/theme/colors";

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
			accessibilityRole="checkbox"
			accessibilityState={{
				checked,
				disabled,
			}}
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

		borderRadius: 4,
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

		fontSize: 12,
		lineHeight: 14,

		fontWeight: "700",
	},

	label: {
		fontFamily: "Plus Jakarta Sans",

		fontSize: 12,
		lineHeight: 15,

		color: colors.text.primary,
	},

	labelMedium: {
		fontWeight: "500",
	},

	labelRegular: {
		fontWeight: "400",
	},

	labelInverse: {
		color: colors.text.secondary,
	},

	disabled: {
		opacity: 0.5,
	},
});
