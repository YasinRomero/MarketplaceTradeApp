import { CameraActionsCard } from "@/components/common/CameraActionsCard";
import { CameraStatus } from "@/components/common/CameraDisplay";
import { EvidencesCard } from "@/components/common/EvidencesCard";
import { Message } from "@/components/common/Message";
import { ProductInformation, ProductInformationCard, ProductMode } from "@/components/common/ProductInformationCard";
import { ProductPreviewCard } from "@/components/common/ProductPreviewCard";
import { Product, ProductDraftInput, ProductMedia } from "@/schemas/product";
import {
	capturePhoto,
	startCamera,
	startVideoRecording,
	stopCamera,
	VideoRecordingController,
} from "@/services/mediaCaptureService";
import { useAuthStore } from "@/stores/authStore";
import { useProductStore } from "@/stores/productStore";
import { responsive, spacing } from "@/theme";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

export interface PublishProductSectionProps {
	productId?: number;
	onCameraPress?: () => void;
	onVideoPress?: () => void;
	onUploadPress?: () => void;
	onPublishPress?: () => void;
	onDraftPress?: () => void;
	style?: StyleProp<ViewStyle>;
}

export function PublishProductSection({
	productId,
	onCameraPress,
	onVideoPress,
	onUploadPress,
	onPublishPress,
	onDraftPress,
	style,
}: PublishProductSectionProps) {
	const { width } = useWindowDimensions();
	const isTabletDown = responsive.isTabletDown(width);
	const currentUser = useAuthStore((state) => state.currentUser);
	const { saveDraft, publish, update, activate, isLoading, error, ownedProducts, loadOwnedProducts } =
		useProductStore();
	const editingProduct = productId === undefined ? undefined : ownedProducts.find((item) => item.id === productId);
	const [saveStatus, setSaveStatus] = useState<"idle" | "success">("idle");
	const [publishStatus, setPublishStatus] = useState<"idle" | "success">("idle");
	const [captureStatus, setCaptureStatus] = useState<"idle" | "loading" | "success">("idle");
	const [captureError, setCaptureError] = useState<string | null>(null);
	const [mediaOverride, setMediaOverride] = useState<ProductMedia[] | null>(null);
	const media = useMemo(() => mediaOverride ?? editingProduct?.media ?? [], [editingProduct, mediaOverride]);
	const updateMedia = (updater: (current: ProductMedia[]) => ProductMedia[]) => {
		setMediaOverride((current) => updater(current ?? editingProduct?.media ?? []));
	};
	const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
	const [cameraStatus, setCameraStatus] = useState<CameraStatus>("off");
	const mediaRef = useRef<ProductMedia[]>([]);
	const streamRef = useRef<MediaStream | null>(null);
	const recordingRef = useRef<VideoRecordingController | null>(null);
	const mediaIdRef = useRef(0);
	const isEditing = productId !== undefined;
	const isEditableStatus =
		editingProduct?.status === "activo" ||
		editingProduct?.status === "borrador" ||
		editingProduct?.status === "inactivo";
	const categoryDefaults: Record<number, { category: string; subcategory: string }> = {
		10: { category: "Tecnología", subcategory: "Computadoras" },
		11: { category: "Libros", subcategory: "Otros" },
		12: { category: "Ropa", subcategory: "Otros" },
	};
	const modeDefaults: Record<Product["mode"], ProductMode> = {
		venta: "sell",
		intercambio: "exchange",
		ambas: "both",
	};

	useEffect(() => {
		if (currentUser && productId !== undefined && !editingProduct && !isLoading && !error) {
			loadOwnedProducts(currentUser.id);
		}
	}, [currentUser, editingProduct, error, isLoading, loadOwnedProducts, productId]);

	useEffect(() => {
		mediaRef.current = media;
	}, [media]);

	useEffect(() => {
		return () => {
			recordingRef.current?.cancel();
			stopCamera(streamRef.current);
			mediaRef.current.forEach((item) => URL.revokeObjectURL(item.url));
		};
	}, []);

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
	const owner = currentUser;
	const initialCategory = editingProduct?.categoryId ? categoryDefaults[editingProduct.categoryId] : undefined;
	const initialPrice = editingProduct
		? ((editingProduct.salePrice ?? editingProduct.referenceValue)?.toFixed(2) ?? "")
		: undefined;
	const editingMode = editingProduct?.mode;
	const editingInitialPrice = initialPrice;

	const toDraftInput = (current: ProductInformation): ProductDraftInput => {
		if (!owner) throw new Error("Debes iniciar sesión para gestionar publicaciones.");
		const amount = current.price ? Number(current.price) : null;
		const mode = current.mode === "sell" ? "venta" : current.mode === "exchange" ? "intercambio" : "ambas";
		const preserveSeparatePrices = editingProduct && editingInitialPrice === current.price && editingMode === mode;

		return {
			ownerId: owner.id,
			siteId: owner.siteId,
			categoryId: categoryIds[current.category],
			title: current.title,
			description: current.description,
			mode,
			salePrice:
				mode === "venta" || mode === "ambas"
					? preserveSeparatePrices
						? editingProduct.salePrice
						: amount
					: null,
			referenceValue:
				mode === "intercambio" || mode === "ambas"
					? preserveSeparatePrices
						? editingProduct.referenceValue
						: amount
					: null,
			attributes: current.attributes,
			media,
		};
	};

	const handleDraftPress = async () => {
		if (!owner) return;
		setSaveStatus("idle");
		const savedProduct =
			isEditing && editingProduct
				? await update(editingProduct.id, owner.id, toDraftInput(product))
				: await saveDraft(toDraftInput(product));
		if (savedProduct) {
			setSaveStatus("success");
			onDraftPress?.();
		}
	};

	const addCapturedMedia = (captured: { type: ProductMedia["type"]; url: string }) => {
		if (mediaIdRef.current === 0) mediaIdRef.current = Date.now();
		const id = ++mediaIdRef.current;
		updateMedia((current) => [
			...current,
			{
				id,
				productId: id,
				type: captured.type,
				url: captured.url,
				capturedAt: new Date().toISOString(),
				isPublication: true,
				isEvidence: true,
			},
		]);
		setCaptureStatus("success");
	};

	const handleStartCamera = async () => {
		setCameraStatus("starting");
		setCaptureError(null);
		try {
			const stream = await startCamera();
			streamRef.current = stream;
			setCameraStream(stream);
			setCameraStatus("on");
		} catch (cameraFailure) {
			setCameraStatus("off");
			setCaptureError(cameraFailure instanceof Error ? cameraFailure.message : "No se pudo iniciar la cámara.");
		}
	};

	const handleStopCamera = () => {
		if (recordingRef.current) return;
		stopCamera(streamRef.current);
		streamRef.current = null;
		setCameraStream(null);
		setCameraStatus("off");
	};

	const handlePhotoCapture = async () => {
		if (!streamRef.current || cameraStatus !== "on") {
			setCaptureError("Inicia la cámara antes de capturar una fotografía.");
			return;
		}
		setCaptureStatus("loading");
		setCaptureError(null);
		try {
			const captured = await capturePhoto(streamRef.current);
			if (!captured.url) throw new Error("La evidencia capturada no tiene un archivo válido.");
			addCapturedMedia(captured);
		} catch (captureFailure) {
			setCaptureStatus("idle");
			setCaptureError(
				captureFailure instanceof Error ? captureFailure.message : "No se pudo capturar la evidencia.",
			);
		}
	};

	const finishVideoRecording = async () => {
		const controller = recordingRef.current;
		if (!controller) return;
		setCaptureStatus("loading");
		try {
			const captured = await controller.stop();
			if (!captured.url) throw new Error("La evidencia capturada no tiene un archivo válido.");
			addCapturedMedia(captured);
		} catch (captureFailure) {
			setCaptureStatus("idle");
			setCaptureError(captureFailure instanceof Error ? captureFailure.message : "No se pudo capturar el video.");
		} finally {
			recordingRef.current = null;
			if (streamRef.current) setCameraStatus("on");
		}
	};

	const handleVideoCapture = async () => {
		if (cameraStatus === "recording") {
			await finishVideoRecording();
			return;
		}
		if (!streamRef.current || cameraStatus !== "on") {
			setCaptureError("Inicia la cámara antes de grabar un video.");
			return;
		}
		setCaptureError(null);
		try {
			recordingRef.current = startVideoRecording(streamRef.current, (recordingFailure) => {
				recordingRef.current = null;
				setCameraStatus("on");
				setCaptureStatus("idle");
				setCaptureError(recordingFailure.message);
			});
			setCameraStatus("recording");
			setCaptureStatus("idle");
		} catch (recordingFailure) {
			setCameraStatus("on");
			setCaptureError(
				recordingFailure instanceof Error ? recordingFailure.message : "No se pudo iniciar el video.",
			);
		}
	};

	const handleRemoveMedia = (id: number) => {
		const removed = mediaRef.current.find((item) => item.id === id);
		if (!removed) return;
		URL.revokeObjectURL(removed.url);
		updateMedia((current) => current.filter((item) => item.id !== id));
	};

	const handlePublicationChange = (id: number, checked: boolean) => {
		updateMedia((current) => current.map((item) => (item.id === id ? { ...item, isPublication: checked } : item)));
	};

	const handleEvidenceChange = (id: number, checked: boolean) => {
		updateMedia((current) => current.map((item) => (item.id === id ? { ...item, isEvidence: checked } : item)));
	};

	const handlePublishPress = async () => {
		if (!owner) return;
		setPublishStatus("idle");
		const savedProduct =
			isEditing && editingProduct?.status === "borrador"
				? await activate(editingProduct.id, owner.id, toDraftInput(product))
				: isEditing && editingProduct
					? await update(editingProduct.id, owner.id, toDraftInput(product))
					: await publish(toDraftInput(product));
		if (savedProduct) {
			if (isEditing && editingProduct?.status === "activo") setSaveStatus("success");
			else setPublishStatus("success");
			onPublishPress?.();
		}
	};

	if (!owner) {
		return (
			<Message
				title="Inicia sesión para continuar"
				message="La publicación y sus evidencias requieren una cuenta institucional."
			/>
		);
	}

	if (isEditing && isLoading && !error && !editingProduct) {
		return <Message title="Cargando publicación" message="Estamos preparando los datos para editarla." />;
	}

	if (isEditing && !editingProduct) {
		return (
			<Message
				title="No se pudo cargar la publicación"
				message={error ?? "La publicación no existe o no pertenece al usuario."}
			/>
		);
	}

	if (isEditing && !isEditableStatus) {
		return (
			<Message
				title="Edición no disponible"
				message="Las publicaciones reservadas o finalizadas no se pueden modificar."
			/>
		);
	}

	return (
		<View style={[styles.section, isTabletDown && styles.mobileSection, style]}>
			<View style={[styles.layout, isTabletDown && styles.mobileLayout]}>
				<View style={styles.leftColumn}>
					<ProductInformationCard
						key={editingProduct?.id ?? "new"}
						initialTitle={editingProduct?.title}
						initialCategory={initialCategory?.category}
						initialSubcategory={initialCategory?.subcategory}
						initialMode={editingProduct ? modeDefaults[editingProduct.mode] : undefined}
						initialPrice={initialPrice}
						initialDescription={editingProduct?.description}
						attributes={
							editingProduct
								? Object.entries(editingProduct.attributes).map(([label, value]) => ({ label, value }))
								: undefined
						}
						onChange={setProduct}
					/>

					<CameraActionsCard
						galleryItems={media.map((item) => ({
							id: item.id,
							label: item.type === "imagen" ? "Fotografía capturada" : "Video capturado",
							image: item.type === "imagen" ? { uri: item.url } : undefined,
							url: item.url,
							mediaType: item.type,
							publication: item.isPublication !== false,
							evidence: item.isEvidence !== false,
						}))}
						stream={cameraStream}
						cameraStatus={cameraStatus}
						onStartCamera={handleStartCamera}
						onStopCamera={handleStopCamera}
						onCameraPress={handlePhotoCapture}
						onVideoPress={handleVideoCapture}
						onPublicationChange={handlePublicationChange}
						onEvidenceChange={handleEvidenceChange}
						onRemove={handleRemoveMedia}
						disabled={captureStatus === "loading" || cameraStatus === "starting"}
					/>

					<EvidencesCard
						evidences={media
							.filter((item) => item.isEvidence !== false)
							.map((item, index) => ({
								label: `${item.type === "imagen" ? "Fotografía" : "Video"} ${index + 1}`,
								image: item.type === "imagen" ? { uri: item.url } : undefined,
								url: item.url,
								type: item.type,
							}))}
					/>
					{captureStatus === "loading" && (
						<Message title="Capturando evidencia" message="Mantén el producto frente a la cámara." />
					)}
					{captureError && <Message title="No se pudo capturar" message={captureError} />}
					{captureStatus === "success" && !captureError && (
						<Message
							title="Evidencia capturada"
							message="La evidencia quedó incorporada a la publicación."
						/>
					)}
					{isLoading && (
						<Message
							title={
								isEditing && editingProduct?.status !== "borrador"
									? "Guardando cambios"
									: "Guardando borrador"
							}
							message="Estamos guardando la información ingresada."
						/>
					)}
					{error && <Message title="No se pudo completar" message={error} />}
					{saveStatus === "success" && !isLoading && !error && (
						<Message
							title={
								isEditing && editingProduct?.status !== "borrador"
									? "Cambios guardados"
									: "Borrador guardado"
							}
							message={
								isEditing && editingProduct?.status !== "borrador"
									? "La publicación activa fue actualizada correctamente."
									: "La publicación quedó guardada como borrador."
							}
						/>
					)}
					{publishStatus === "success" && !isLoading && !error && (
						<Message
							title="Publicación activada"
							message="La publicación ya está disponible en el catálogo."
						/>
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
						primaryActionLabel={
							isEditing && editingProduct?.status !== "borrador" ? "Guardar cambios" : undefined
						}
						secondaryActionLabel={isEditing ? "Guardar cambios" : undefined}
						showSecondaryAction={!isEditing || editingProduct?.status === "borrador"}
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
