import { StyleProp, StyleSheet, Text, TextInputProps, TextStyle, View, ViewStyle } from "react-native";

import { InputLarge } from "@/components/ui/Input/InputLarge";
import { colors, spacing, typography } from "@/theme";

export interface InputTextAreaProps extends TextInputProps {
	label: string;
	alert?: string;
	visibleAlert?: boolean;
	containerStyle?: StyleProp<ViewStyle>;
	labelStyle?: StyleProp<TextStyle>;
	inputStyle?: StyleProp<TextStyle>;
	alertStyle?: StyleProp<TextStyle>;
}

export function InputTextArea({
	label,
	alert,
	visibleAlert,
	containerStyle,
	labelStyle,
	inputStyle,
	alertStyle,
	...inputProps
}: InputTextAreaProps) {
	const showAlert = visibleAlert ?? Boolean(alert);

	return (
		<View style={[styles.container, containerStyle]}>
			<Text style={[styles.label, labelStyle]}>{label}</Text>

			<InputLarge {...inputProps} multiline style={[styles.input, inputStyle]} />

			{showAlert && <Text style={[styles.alert, alertStyle]}>{alert}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		gap: spacing.xs,
	},

	label: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.lg,
		fontWeight: typography.weight.semibold,
		color: colors.text.primary,
	},

	input: {
		width: "100%",
		height: 72,
		paddingTop: spacing.lg,
		paddingRight: spacing.lg,
		paddingBottom: 36,
		paddingLeft: spacing.lg,
		textAlignVertical: "top",
	},

	alert: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.lg,
		fontWeight: typography.weight.regular,
		color: colors.text.secondary,
	},
});
