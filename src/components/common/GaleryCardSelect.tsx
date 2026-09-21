import { Image } from "expo-image";
import { createElement } from "react";
import { ImageSourcePropType, Platform, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { Close } from "@/components/icons";
import { Checkbox } from "@/components/ui/Checkbox";
import { MediaType } from "@/schemas/product";
import { boxShadows, colors, radius, spacing } from "@/theme";

export interface GaleryCardSelectProps {
	image?: ImageSourcePropType;
	url?: string;
	mediaType?: MediaType;
	label: string;
	publicationChecked: boolean;
	evidenceChecked: boolean;
	onPublicationChange?: (checked: boolean) => void;
	onEvidenceChange?: (checked: boolean) => void;
	onRemove?: () => void;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
}

export function GaleryCardSelect({
	image,
	url,
	mediaType,
	label,
	publicationChecked,
	evidenceChecked,
	onPublicationChange,
	onEvidenceChange,
	onRemove,
	disabled = false,
	style,
}: GaleryCardSelectProps) {
	return (
		<View style={[styles.card, style]}>
			{onRemove && (
				<Pressable accessibilityLabel={`Eliminar ${label}`} onPress={onRemove} style={styles.removeButton}>
					<Close size={14} color={colors.text.inverse} />
				</Pressable>
			)}
			<View style={styles.media}>
				{Platform.OS === "web" && mediaType === "video" && url
					? createElement("video", {
							controls: true,
							muted: true,
							preload: "metadata",
							src: url,
							style: styles.video,
						})
					: image && <Image contentFit="cover" source={image} style={styles.image} />}
			</View>

			<View style={styles.options}>
				<Checkbox
					label="Publicación"
					checked={publicationChecked}
					disabled={disabled}
					onChange={onPublicationChange}
				/>
				<Checkbox label="Evidencia" checked={evidenceChecked} disabled={disabled} onChange={onEvidenceChange} />
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

		boxShadow: boxShadows.default,
		elevation: 1,
		position: "relative",
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

	video: {
		width: "100%",
		height: "100%",
		objectFit: "cover",
	},

	removeButton: {
		position: "absolute",
		top: spacing.xs,
		right: spacing.xs,
		zIndex: 2,
		width: 24,
		height: 24,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.action.primary,
		borderRadius: radius.full,
	},

	options: {
		width: "100%",
		height: 54,
		padding: spacing.sm,
		gap: spacing.xs + 2,
		backgroundColor: colors.background.surface,
	},
});
