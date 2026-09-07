import { useState } from "react";
import {
	ImageSourcePropType,
	StyleProp,
	StyleSheet,
	useWindowDimensions,
	View,
	ViewStyle,
} from "react-native";

import { CameraDisplay } from "@/components/common/CameraDisplay";
import { GaleryCardSelect } from "@/components/common/GaleryCardSelect";
import { HeaderSections } from "@/components/common/HeaderSections";
import { Message } from "@/components/common/Message";
import { PhotoCamera, ShieldLock } from "@/components/icons";
import { colors, radius, spacing } from "@/theme";

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
	{ label: "Foto 1: Frontal", checked: true, primary: true },
	{ label: "Foto 2: Posterior", checked: true },
	{ label: "Foto 3: Detalle", checked: true },
	{ label: "Foto 4: Pantalla" },
];

export function CameraActionsCard({
	galleryItems = defaultGalleryItems,
	onCameraPress,
	onVideoPress,
	onUploadPress,
	style,
}: CameraActionsCardProps) {
	const { width } = useWindowDimensions();
	const isMobile = width < 900;
	const [selectedItems, setSelectedItems] = useState(() =>
		galleryItems.map((item) => item.checked ?? false),
	);

	return (
		<View style={[styles.card, style]}>
			<HeaderSections
				size="xl"
				icon={<PhotoCamera size={20} color={colors.text.secondary} />}
				title="Fotos y videos del producto"
				description="Agrega evidencias visuales para que otros usuarios conozcan mejor tu producto."
			/>

			<View style={[styles.content, isMobile && styles.mobileContent]}>
				<CameraDisplay
					badges={["Vista previa", "Sin archivos"]}
					onCameraPress={onCameraPress}
					onVideoPress={onVideoPress}
					onUploadPress={onUploadPress}
				/>

				<View style={styles.galleryPanel}>
					<HeaderSections size="compact" title="Galería seleccionada" />
					<View style={styles.galleryGrid}>
						{galleryItems.map((item, index) => (
							<GaleryCardSelect
								key={`${item.label}-${index}`}
								image={item.image}
								label={item.label}
								checked={selectedItems[index] ?? false}
								secondaryChecked={item.primary ?? false}
								onChange={(checked) =>
									setSelectedItems((current) =>
										current.map((value, itemIndex) => (itemIndex === index ? checked : value)),
									)
								}
							/>
						))}
					</View>

					<Message
						icon={<ShieldLock size={16} color={colors.text.secondary} />}
						message="Tus evidencias se usarán únicamente para mostrar el estado del producto."
						style={styles.galleryMessage}
					/>
				</View>
			</View>

			<Message
				icon={<ShieldLock size={16} color={colors.text.secondary} />}
				message="Por seguridad, los archivos no se almacenan hasta que confirmes la publicación."
			/>
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
