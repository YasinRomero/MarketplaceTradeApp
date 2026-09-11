import { Image } from "expo-image";
import { ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { Checkbox } from "@/components/ui/Checkbox";
import { colors, radius, spacing } from "@/theme";

export interface GaleryCardSelectProps {
	image?: ImageSourcePropType;
	label: string;
	secondaryLabel?: string;
	checked?: boolean;
	secondaryChecked?: boolean;
	inverse?: boolean;
	onChange?: (checked: boolean) => void;
	onSecondaryChange?: (checked: boolean) => void;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
}

export function GaleryCardSelect({
	image,
	label,
	secondaryLabel = "Publicar",
	checked = false,
	secondaryChecked = false,
	inverse = false,
	onChange,
	onSecondaryChange,
	disabled = false,
	style,
}: GaleryCardSelectProps) {
	return (
		<View style={[styles.card, style]}>
			<View style={styles.media}>
				{image && <Image contentFit="cover" source={image} style={styles.image} />}
			</View>

			<View style={styles.options}>
				<Checkbox label={label} checked={checked} inverse={inverse} disabled={disabled} onChange={onChange} />
				<Checkbox
					label={secondaryLabel}
					checked={secondaryChecked}
					inverse
					disabled={disabled}
					labelStyle={styles.secondaryLabel}
					onChange={onSecondaryChange}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		width: 140,
		minHeight: 163.22,

		backgroundColor: colors.background.surface,
		borderRadius: radius.md,
		overflow: "hidden",

		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},

	media: {
		width: "100%",
		height: 109.22,
		backgroundColor: colors.background.subtle,
	},

	image: {
		width: "100%",
		height: "100%",
	},

	options: {
		width: "100%",
		height: 54,
		padding: spacing.sm,
		gap: spacing.xs + 2,
		backgroundColor: colors.background.surface,
	},

	secondaryLabel: {
		color: colors.text.secondary,
	},
});
