import { CameraDisplay, CameraStatus } from "@/components/common/CameraDisplay";
import { GaleryCardSelect } from "@/components/common/GaleryCardSelect";
import { HeaderSections } from "@/components/common/HeaderSections";
import { Message } from "@/components/common/Message";
import { PhotoCamera, ShieldLock } from "@/components/icons";
import { MediaType } from "@/schemas/product";
import { colors, radius, responsive, spacing } from "@/theme";
import { ImageSourcePropType, StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

export interface CameraGalleryItem {
	id: number;
	label: string;
	image?: ImageSourcePropType;
	url?: string;
	mediaType: MediaType;
	publication: boolean;
	evidence: boolean;
}

export interface CameraActionsCardProps {
	galleryItems: CameraGalleryItem[];
	stream?: MediaStream | null;
	cameraStatus?: CameraStatus;
	onStartCamera?: () => void;
	onStopCamera?: () => void;
	onCameraPress?: () => void;
	onVideoPress?: () => void;
	onPublicationChange?: (id: number, checked: boolean) => void;
	onEvidenceChange?: (id: number, checked: boolean) => void;
	onRemove?: (id: number) => void;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
}

export function CameraActionsCard({
	galleryItems,
	stream = null,
	cameraStatus = "off",
	onStartCamera,
	onStopCamera,
	onCameraPress,
	onVideoPress,
	onPublicationChange,
	onEvidenceChange,
	onRemove,
	disabled = false,
	style,
}: CameraActionsCardProps) {
	const { width } = useWindowDimensions();
	const isTabletDown = responsive.isTabletDown(width);
	const previewImage = galleryItems.find((item) => item.mediaType === "imagen")?.image;
	const lastCapture = galleryItems[galleryItems.length - 1];
	const captureLabel = lastCapture
		? lastCapture.mediaType === "imagen"
			? "Imagen capturada"
			: "Video capturado"
		: "Sin archivos";

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
					image={previewImage}
					stream={stream}
					cameraStatus={cameraStatus}
					captureLabel={captureLabel}
					disabled={disabled}
					onStartCamera={onStartCamera}
					onStopCamera={onStopCamera}
					onCameraPress={onCameraPress}
					onVideoPress={onVideoPress}
				/>

				<View style={styles.galleryPanel}>
					<HeaderSections size="compact" title={`Archivos Capturas (${galleryItems.length})`} />
					<View style={styles.galleryGrid}>
						{galleryItems.map((item) => (
							<GaleryCardSelect
								key={item.id}
								image={item.image}
								url={item.url}
								mediaType={item.mediaType}
								label={item.label}
								publicationChecked={item.publication}
								evidenceChecked={item.evidence}
								disabled={disabled}
								onPublicationChange={(checked) => onPublicationChange?.(item.id, checked)}
								onEvidenceChange={(checked) => onEvidenceChange?.(item.id, checked)}
								onRemove={() => onRemove?.(item.id)}
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
