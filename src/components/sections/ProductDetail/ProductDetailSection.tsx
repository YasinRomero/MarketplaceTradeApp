import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	ImageSourcePropType,
	Modal,
	Pressable,
	ScrollView,
	StyleProp,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
	ViewStyle,
} from "react-native";

import { CardTransactionProduct } from "@/components/common/CardTransactionProduct";
import { DescriptionAcademicContextCard } from "@/components/common/DescriptionAcademicContextCard";
import { DetailsProductBreadcrumb } from "@/components/common/DetailsProductBreadcrumb";
import { InfoAuthorProduct } from "@/components/common/InfoAuthorProduct";
import { MediaViewerCard } from "@/components/common/MediaViewerCard";
import { Message } from "@/components/common/Message";
import { TechnicalSpecsCard } from "@/components/common/TechnicalSpecsCard";
import { ButtonOutline, ButtonRounded } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Product } from "@/schemas/product";
import { getProductById } from "@/services/productService";
import { useAuthStore } from "@/stores/authStore";
import { useExchangeProposalStore } from "@/stores/exchangeProposalStore";
import { colors, radius, spacing, typography } from "@/theme";

export interface ProductDetailSectionProps {
	productId?: string;
	images?: ImageSourcePropType[];
	onPrimaryAction?: () => void;
	onSecondaryAction?: () => void;
	onZoomPress?: (image: ImageSourcePropType, index: number) => void;
	style?: StyleProp<ViewStyle>;
}

const defaultProductImages: ImageSourcePropType[] = [
	{
		uri: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&q=80",
	},
	{
		uri: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=1200&q=80",
	},
	{
		uri: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=1200&q=80",
	},
];

export function ProductDetailSection({
	productId,
	images = defaultProductImages,
	onPrimaryAction,
	onSecondaryAction,
	onZoomPress,
	style,
}: ProductDetailSectionProps) {
	const { width } = useWindowDimensions();
	const router = useRouter();
	const currentUser = useAuthStore((state) => state.currentUser);
	const isMobile = width < 900;
	const [product, setProduct] = useState<Product | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isProposalOpen, setIsProposalOpen] = useState(false);
	const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);

	useEffect(() => {
		let cancelled = false;

		const loadProduct = async () => {
			setProduct(null);
			if (!productId || Number.isNaN(Number(productId))) {
				setIsLoading(false);
				return;
			}

			setIsLoading(true);
			const result = await getProductById(Number(productId));
			if (!cancelled) {
				setProduct(result);
				setIsLoading(false);
			}
		};

		loadProduct();
		return () => {
			cancelled = true;
		};
	}, [productId]);

	if (!productId || isLoading) return <Text style={styles.message}>Cargando publicación...</Text>;
	if (!product) return <Text style={styles.message}>La publicación no está disponible.</Text>;

	const productCategory =
		product.categoryId === 10 ? "Computadoras" : product.categoryId === 11 ? "Libros" : "General";
	const publicMedia = product.media.filter((item) => item.isPublication !== false);
	const productImages = publicMedia.filter((item) => item.type === "imagen").map((item) => ({ uri: item.url }));
	const productVideos = publicMedia.filter((item) => item.type === "video").map((item) => item.url);
	const modeLabel =
		product.mode === "venta"
			? "Venta directa"
			: product.mode === "intercambio"
				? "Intercambio"
				: "Venta e intercambio";
	const productPrice = product.salePrice ?? product.referenceValue;
	const supportsExchange = product.mode === "intercambio" || product.mode === "ambas";
	const supportsSale = product.mode === "venta" || product.mode === "ambas";
	const requireSession = (open: () => void) => {
		if (!currentUser) {
			router.push("/auth");
			return;
		}
		open();
	};
	const openProposal = onPrimaryAction ?? (() => requireSession(() => setIsProposalOpen(true)));
	const openPurchase = onSecondaryAction ?? (() => requireSession(() => setIsPurchaseOpen(true)));

	return (
		<View style={[styles.section, isMobile && styles.mobileSection, style]}>
			<View style={styles.content}>
				<DetailsProductBreadcrumb
					items={[
						{ label: "Inicio" },
						{ label: "Marketplace" },
						{ label: productCategory },
						{ label: product.title },
					]}
				/>

				<View style={[styles.columns, isMobile && styles.mobileColumns]}>
					<View style={styles.mainColumn}>
						<MediaViewerCard
							images={productImages.length > 0 ? productImages : images}
							videos={productVideos}
							onZoomPress={onZoomPress}
						/>
						<TechnicalSpecsCard />
						<DescriptionAcademicContextCard />
					</View>

					<View style={[styles.sideColumn, isMobile && styles.mobileSideColumn]}>
						<CardTransactionProduct
							primaryBadge={modeLabel}
							secondaryBadge={product.status === "activo" ? "Disponible" : "No disponible"}
							title={product.title}
							price={productPrice === null ? "Valor por definir" : `S/. ${productPrice.toFixed(2)}`}
							priceDescription="Equivalente o compensación acordada para intercambio justo."
							primaryActionLabel={supportsExchange ? "Proponer intercambio" : null}
							secondaryActionLabel={supportsSale ? "Comprar ahora" : null}
							reviews={[
								{
									message: "Entrega presencial coordinada dentro del campus universitario",
								},
								{
									message: "Revisión física del artículo antes de confirmar el pago o permuta",
								},
							]}
							securityMessage="Tus datos y la conversación están protegidos por CampusTrade."
							onPrimaryAction={openProposal}
							onSecondaryAction={openPurchase}
						/>

						<InfoAuthorProduct
							authorName="Carlos Méndez"
							institution="Universidad Nacional"
							rating="4.9 estrellas"
							responseTime="Responde en < 1 hora"
							location="Campus universitario"
							authorMessage="Comunidad académica segura: Solo estudiantes con credencial activa coordinan entregas en recintos autorizados."
						/>
					</View>
				</View>
			</View>

			<ProposalModal
				visible={isProposalOpen}
				requestedProduct={product}
				onClose={() => setIsProposalOpen(false)}
			/>
			<PurchaseModal
				visible={isPurchaseOpen}
				product={product}
				onClose={() => setIsPurchaseOpen(false)}
				onPurchased={() => setProduct((current) => (current ? { ...current, status: "reservado" } : current))}
			/>
		</View>
	);
}

function ProposalModal({
	visible,
	requestedProduct,
	onClose,
}: {
	visible: boolean;
	requestedProduct: Product;
	onClose: () => void;
}) {
	const router = useRouter();
	const { availableProducts, isLoading, error, loadAvailableProducts, submitProposal } = useExchangeProposalStore();
	const currentUser = useAuthStore((state) => state.currentUser);
	const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
	const [additionalAmount, setAdditionalAmount] = useState("");
	const [localError, setLocalError] = useState<string | null>(null);
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		if (!visible) return;
		if (currentUser) loadAvailableProducts(currentUser.id);
	}, [currentUser, visible, loadAvailableProducts]);

	const handleClose = () => {
		setSelectedProductId(null);
		setAdditionalAmount("");
		setLocalError(null);
		setSubmitted(false);
		onClose();
	};

	const handleSubmit = async () => {
		if (!currentUser) {
			setLocalError("Debes iniciar sesión para enviar una propuesta.");
			return;
		}
		setLocalError(null);
		if (selectedProductId === null) {
			setLocalError("Selecciona un producto propio para ofrecer.");
			return;
		}
		const parsedAmount = additionalAmount.trim() === "" ? 0 : Number(additionalAmount);
		if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
			setLocalError("El monto adicional debe ser un número mayor o igual a cero.");
			return;
		}
		const proposal = await submitProposal({
			requestedProductId: requestedProduct.id,
			offeredProductId: selectedProductId,
			requesterId: currentUser.id,
			additionalAmount: parsedAmount,
		});
		if (proposal) setSubmitted(true);
	};

	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
			<View style={styles.modalBackdrop}>
				<View style={styles.modalCard}>
					{submitted ? (
						<View style={styles.modalContent}>
							<Message
								title="Propuesta enviada"
								message="La solicitud quedó registrada como pendiente."
							/>
							<ButtonRounded onPress={() => router.push("/operations")}>Ver MisOperaciones</ButtonRounded>
							<ButtonOutline onPress={handleClose}>Cerrar</ButtonOutline>
						</View>
					) : (
						<ScrollView contentContainerStyle={styles.modalContent}>
							<Text style={styles.modalTitle}>Proponer intercambio</Text>
							<Text style={styles.modalDescription}>Producto solicitado: {requestedProduct.title}</Text>
							<Text style={styles.fieldLabel}>Selecciona tu producto</Text>
							{isLoading && (
								<Message
									title="Cargando productos"
									message="Buscando publicaciones disponibles para intercambio."
								/>
							)}
							{!isLoading && availableProducts.length === 0 && (
								<Message
									title="No tienes productos disponibles"
									message="Publica o activa un producto con modalidad de intercambio para continuar."
								/>
							)}
							{availableProducts.map((availableProduct) => (
								<Pressable
									key={availableProduct.id}
									onPress={() => setSelectedProductId(availableProduct.id)}
									style={[
										styles.productOption,
										selectedProductId === availableProduct.id && styles.selectedProductOption,
									]}
								>
									<Text style={styles.productOptionTitle}>{availableProduct.title}</Text>
									<Text style={styles.productOptionMeta}>
										Valor referencial: S/. {(availableProduct.referenceValue ?? 0).toFixed(2)}
									</Text>
								</Pressable>
							))}
							<Text style={styles.fieldLabel}>Monto adicional (opcional)</Text>
							<Input
								value={additionalAmount}
								onChangeText={setAdditionalAmount}
								placeholder="0.00"
								keyboardType="decimal-pad"
							/>
							{(localError || error) && (
								<Message
									title="No se pudo enviar"
									message={localError ?? error ?? "Intenta nuevamente."}
								/>
							)}
							<View style={styles.modalActions}>
								<ButtonOutline onPress={handleClose}>Cancelar</ButtonOutline>
								<ButtonRounded disabled={isLoading} onPress={() => handleSubmit()}>
									Enviar propuesta
								</ButtonRounded>
							</View>
						</ScrollView>
					)}
				</View>
			</View>
		</Modal>
	);
}

function PurchaseModal({
	visible,
	product,
	onClose,
	onPurchased,
}: {
	visible: boolean;
	product: Product;
	onClose: () => void;
	onPurchased: () => void;
}) {
	const router = useRouter();
	const { isLoading, error, startSale } = useExchangeProposalStore();
	const currentUser = useAuthStore((state) => state.currentUser);
	const [submitted, setSubmitted] = useState(false);

	const handleConfirm = async () => {
		if (!currentUser) return;
		const transaction = await startSale(product.id, currentUser.id);
		if (transaction) {
			onPurchased();
			setSubmitted(true);
		}
	};

	const handleClose = () => {
		if (isLoading) return;
		setSubmitted(false);
		onClose();
	};

	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
			<View style={styles.modalBackdrop}>
				<View style={styles.modalCard}>
					{submitted ? (
						<View style={styles.modalContent}>
							<Message
								title="Compra iniciada"
								message="El producto quedó reservado y la operación está pendiente de respaldo."
							/>
							<ButtonRounded onPress={() => router.push("/operations")}>Ver MisOperaciones</ButtonRounded>
							<ButtonOutline onPress={handleClose}>Cerrar</ButtonOutline>
						</View>
					) : (
						<View style={styles.modalContent}>
							<Text style={styles.modalTitle}>Confirmar compra</Text>
							<Text style={styles.modalDescription}>Producto: {product.title}</Text>
							<Text style={styles.modalDescription}>
								Precio acordado: S/. {(product.salePrice ?? 0).toFixed(2)}
							</Text>
							<Text style={styles.modalDescription}>
								La compra es simulada. El respaldo financiero quedará pendiente y no se procesará ningún
								pago.
							</Text>
							{error && <Message title="No se pudo iniciar la compra" message={error} />}
							<View style={styles.modalActions}>
								<ButtonOutline disabled={isLoading} onPress={handleClose}>
									Cancelar
								</ButtonOutline>
								<ButtonRounded disabled={isLoading} onPress={() => handleConfirm()}>
									Confirmar compra
								</ButtonRounded>
							</View>
						</View>
					)}
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	section: {
		width: "100%",
		paddingTop: spacing.xl,
		paddingHorizontal: spacing["2xl"],
		paddingBottom: spacing["2xl"],
	},
	mobileSection: {
		paddingTop: spacing.lg,
		paddingHorizontal: spacing.lg,
	},
	content: {
		width: "100%",
		maxWidth: 1232,
		alignSelf: "center",
		gap: spacing.lg,
	},
	message: {
		padding: spacing["2xl"],
		textAlign: "center",
	},
	modalBackdrop: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: spacing.lg,
		backgroundColor: "rgba(0, 0, 0, 0.45)",
	},
	modalCard: {
		width: "100%",
		maxWidth: 560,
		maxHeight: "90%",
		backgroundColor: colors.background.surface,
		borderRadius: radius.lg,
		borderWidth: 1,
		borderColor: colors.border.default,
	},
	modalContent: {
		padding: spacing.xl,
		gap: spacing.md,
	},
	modalTitle: {
		fontFamily: typography.family,
		fontSize: typography.size.xl,
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},
	modalDescription: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.lg,
		color: colors.text.secondary,
	},
	fieldLabel: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		fontWeight: typography.weight.semibold,
		color: colors.text.primary,
	},
	productOption: {
		padding: spacing.md,
		gap: spacing.xs,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.md,
		backgroundColor: colors.background.surface,
	},
	selectedProductOption: {
		borderColor: colors.action.primary,
		backgroundColor: colors.background.subtle,
	},
	productOptionTitle: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		fontWeight: typography.weight.semibold,
		color: colors.text.primary,
	},
	productOptionMeta: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		color: colors.text.secondary,
	},
	modalActions: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: spacing.md,
		flexWrap: "wrap",
	},
	columns: {
		width: "100%",
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing["2xl"],
	},
	mobileColumns: {
		flexDirection: "column",
	},
	mainColumn: {
		flex: 1,
		minWidth: 0,
		gap: spacing["2xl"],
	},
	sideColumn: {
		width: 389,
		gap: spacing.lg,
	},
	mobileSideColumn: {
		width: "100%",
	},
});
