import { useState } from "react";
import { ImageSourcePropType, StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import { CameraDisplay } from "@/components/common/CameraDisplay";
import { GaleryCardSelect } from "@/components/common/GaleryCardSelect";
import { HeaderSections } from "@/components/common/HeaderSections";
import { Message } from "@/components/common/Message";
import { PhotoCamera, ShieldLock } from "@/components/icons";
import { colors, radius, responsive, spacing } from "@/theme";

export interface CameraGalleryItem {
	label: string;
	image?: ImageSourcePropType;
	checked?: boolean;
	primary?: boolean;
}

export interface CameraActionsCardProps {
	galleryItems?: CameraGalleryItem[];
	onCameraPress?: () => void;
	onVideoPress?: () => void;
	onUploadPress?: () => void;
	style?: StyleProp<ViewStyle>;
}

const defaultGalleryItems: CameraGalleryItem[] = [
	{ label: "Foto de evidencia", checked: true, primary: true },
	{ label: "Foto de evidencia", checked: true },
	{ label: "Foto de evidencia", checked: true },
	{ label: "Foto de evidencia" },
];

export function CameraActionsCard({
	galleryItems = defaultGalleryItems,
	onCameraPress,
	onVideoPress,
	onUploadPress,
	style,
}: CameraActionsCardProps) {
	const { width } = useWindowDimensions();
	const isTabletDown = responsive.isTabletDown(width);

	const [selectedItems, setSelectedItems] = useState(() => galleryItems.map((item) => item.checked ?? false));
	const [publishItems, setPublishItems] = useState(() => galleryItems.map((item) => item.primary ?? false));
	const selectedCount = selectedItems.filter(Boolean).length;

	return (
		<View style={[styles.card, style]}>
			<HeaderSections
				icon={<PhotoCamera size={20} color={colors.text.secondary} />}
				title="Fotos y videos del producto"
				description="Captura obligatoria en vivo desde la cámara web o móvil para validar tenencia física."
			/>

			<Message
				icon={<ShieldLock size={16} color={colors.text.secondary} />}
				message="Por autenticidad de la comunidad, no se permite la carga de archivos locales ni fotos de galería externa."
				style={styles.galleryMessage}
			/>

			<View style={[styles.content, isTabletDown && styles.mobileContent]}>
				<CameraDisplay
					badges={["Vista previa", "Sin archivos"]}
					onCameraPress={onCameraPress}
					onVideoPress={onVideoPress}
					onUploadPress={onUploadPress}
				/>

				<View style={styles.galleryPanel}>
					<HeaderSections size="compact" title={`Archivos Capturas (${selectedCount})`} />
					<View style={styles.galleryGrid}>
						{galleryItems.map((item, index) => (
							<GaleryCardSelect
								key={`${item.label}-${index}`}
								image={item.image}
								label={item.label}
								checked={selectedItems[index] ?? false}
								secondaryChecked={publishItems[index] ?? false}
								onChange={(checked) =>
									setSelectedItems((current) =>
										current.map((value, itemIndex) => (itemIndex === index ? checked : value)),
									)
								}
								onSecondaryChange={(checked) =>
									setPublishItems((current) =>
										current.map((value, itemIndex) => (itemIndex === index ? checked : value)),
									)
								}
							/>
						))}
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		width: "100%",
		padding: spacing.xl,
		gap: spacing.xl,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.xl,
	},

	content: {
		width: "100%",
		flexDirection: "row",
		gap: spacing.xl,
	},

	mobileContent: {
		flexDirection: "column",
	},

	galleryPanel: {
		flex: 1,
		minWidth: 0,
		gap: spacing.sm,
	},

	galleryGrid: {
		width: "100%",
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.sm,
	},

	galleryMessage: {
		marginTop: spacing.sm,
	},
});
