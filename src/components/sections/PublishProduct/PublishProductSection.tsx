import { CameraActionsCard } from "@/components/common/CameraActionsCard";
import { EvidencesCard } from "@/components/common/EvidencesCard";
import { Message } from "@/components/common/Message";
import { ProductInformation, ProductInformationCard } from "@/components/common/ProductInformationCard";
import { ProductPreviewCard } from "@/components/common/ProductPreviewCard";
import { mockUsers } from "@/mocks/products";
import { captureProductMedia } from "@/services/mediaCaptureService";
import { useProductStore } from "@/stores/productStore";
import { responsive, spacing } from "@/theme";
import { ProductDraftInput, ProductMedia } from "@/types/domain";
import { useState } from "react";
import { StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

export interface PublishProductSectionProps {
	onCameraPress?: () => void;
	onVideoPress?: () => void;
	onUploadPress?: () => void;
	onPublishPress?: () => void;
	onDraftPress?: () => void;
	style?: StyleProp<ViewStyle>;
}

export function PublishProductSection({
	onCameraPress,
	onVideoPress,
	onUploadPress,
	onPublishPress,
	onDraftPress,
	style,
}: PublishProductSectionProps) {
	const { width } = useWindowDimensions();
	const isTabletDown = responsive.isTabletDown(width);
	const { saveDraft, publish, isLoading, error } = useProductStore();
	const [saveStatus, setSaveStatus] = useState<"idle" | "success">("idle");
	const [publishStatus, setPublishStatus] = useState<"idle" | "success">("idle");
	const [captureStatus, setCaptureStatus] = useState<"idle" | "loading" | "success">("idle");
	const [captureError, setCaptureError] = useState<string | null>(null);
	const [media, setMedia] = useState<ProductMedia[]>([]);

	const [product, setProduct] = useState<ProductInformation>({
		title: "Laptop Lenovo ThinkPad",
		category: "Tecnología",
		subcategory: "Computadoras",
		mode: "sell",
		price: "450.00",
		description: "Completa los datos esenciales de tu publicación",
		attributes: {},
	});

	const modeLabel = {
		sell: "Venta",
		exchange: "Intercambio",
		both: "Ambos",
	}[product.mode];

	const previewPrice = product.price ? `S/. ${product.price}` : "S/. 0.00";
	const categoryIds: Record<string, number> = { Tecnología: 10, Libros: 11, Ropa: 12 };
	const mockOwner = mockUsers[0];

	const toDraftInput = (current: ProductInformation): ProductDraftInput => {
		const amount = current.price ? Number(current.price) : null;
		const mode = current.mode === "sell" ? "venta" : current.mode === "exchange" ? "intercambio" : "ambas";

		return {
			ownerId: mockOwner.id,
			siteId: mockOwner.siteId,
			categoryId: categoryIds[current.category],
			title: current.title,
			description: current.description,
			mode,
			salePrice: mode === "venta" || mode === "ambas" ? amount : null,
			referenceValue: mode === "intercambio" || mode === "ambas" ? amount : null,
			attributes: current.attributes,
			media,
		};
	};

	const handleDraftPress = async () => {
		setSaveStatus("idle");
		const savedDraft = await saveDraft(toDraftInput(product));
		if (savedDraft) {
			setSaveStatus("success");
			onDraftPress?.();
		}
	};

	const handleCapture = async (type: ProductMedia["type"]) => {
		setCaptureStatus("loading");
		setCaptureError(null);
		try {
			const captured = await captureProductMedia(type);
			setMedia((current) => [
				...current,
				{ id: Date.now(), productId: Date.now(), type: captured.type, url: captured.url, capturedAt: new Date().toISOString() },
			]);
			setCaptureStatus("success");
		} catch (captureFailure) {
			setCaptureStatus("idle");
			setCaptureError(captureFailure instanceof Error ? captureFailure.message : "No se pudo capturar la evidencia.");
		}
	};

	const handlePublishPress = async () => {
		setPublishStatus("idle");
		const published = await publish(toDraftInput(product));
		if (published) {
			setPublishStatus("success");
			onPublishPress?.();
		}
	};

	return (
		<View style={[styles.section, isTabletDown && styles.mobileSection, style]}>
			<View style={[styles.layout, isTabletDown && styles.mobileLayout]}>
				<View style={styles.leftColumn}>
					<ProductInformationCard onChange={setProduct} />

					<CameraActionsCard
						galleryItems={media.map((item) => ({
							label: item.type === "imagen" ? "Fotografía capturada" : "Video capturado",
							checked: true,
							primary: true,
						}))}
						onCameraPress={() => handleCapture("imagen")}
						onVideoPress={() => handleCapture("video")}
						onUploadPress={onUploadPress}
					/>

					<EvidencesCard />
					{captureStatus === "loading" && <Message title="Capturando evidencia" message="Mantén el producto frente a la cámara." />}
					{captureError && <Message title="No se pudo capturar" message={captureError} />}
					{captureStatus === "success" && !captureError && <Message title="Evidencia capturada" message="La evidencia quedó incorporada a la publicación." />}
					{isLoading && (
						<Message title="Guardando borrador" message="Estamos guardando la información ingresada." />
					)}
					{error && <Message title="No se pudo completar" message={error} />}
					{saveStatus === "success" && !isLoading && !error && (
						<Message title="Borrador guardado" message="La publicación quedó guardada como borrador." />
					)}
					{publishStatus === "success" && !isLoading && !error && (
						<Message title="Publicación activada" message="La publicación ya está disponible en el catálogo." />
					)}
				</View>

				<View style={[styles.previewColumn, isTabletDown && styles.mobilePreviewColumn]}>
					<ProductPreviewCard
						category={`${product.category} · ${product.subcategory}`}
						title={product.title}
						description={product.description}
						price={previewPrice}
						primaryBadge={modeLabel}
						onPublishPress={handlePublishPress}
						onDraftPress={handleDraftPress}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		width: "100%",
		padding: spacing["2xl"],
	},

	layout: {
		width: "100%",
		maxWidth: 1232,
		alignSelf: "center",
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing["2xl"],
	},

	leftColumn: {
		flex: 1,
		minWidth: 0,
		gap: spacing["2xl"],
	},

	previewColumn: {
		width: 389,
		maxWidth: "100%",
	},

	// Mobile Responsive
	mobileSection: {
		padding: spacing.lg,
	},

	mobileLayout: {
		flexDirection: "column",
	},

	mobilePreviewColumn: {
		width: "100%",
	},
});
