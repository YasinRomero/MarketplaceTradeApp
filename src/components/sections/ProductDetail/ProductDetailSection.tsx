import { useEffect, useState } from "react";
import { ImageSourcePropType, StyleProp, StyleSheet, Text, useWindowDimensions, View, ViewStyle } from "react-native";

import { CardTransactionProduct } from "@/components/common/CardTransactionProduct";
import { DescriptionAcademicContextCard } from "@/components/common/DescriptionAcademicContextCard";
import { DetailsProductBreadcrumb } from "@/components/common/DetailsProductBreadcrumb";
import { InfoAuthorProduct } from "@/components/common/InfoAuthorProduct";
import { MediaViewerCard } from "@/components/common/MediaViewerCard";
import { TechnicalSpecsCard } from "@/components/common/TechnicalSpecsCard";
import { getProductById } from "@/services/productService";
import { spacing } from "@/theme";
import { Product } from "@/types/domain";

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
	const isMobile = width < 900;
	const [product, setProduct] = useState<Product | null>(null);
	const [isLoading, setIsLoading] = useState(true);

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

		void loadProduct();
		return () => {
			cancelled = true;
		};
	}, [productId]);

	if (!productId || isLoading) return <Text style={styles.message}>Cargando publicación...</Text>;
	if (!product) return <Text style={styles.message}>La publicación no está disponible.</Text>;

	const productCategory =
		product.categoryId === 10 ? "Computadoras" : product.categoryId === 11 ? "Libros" : "General";
	const productImages = product.media.filter((item) => item.type === "imagen").map((item) => ({ uri: item.url }));
	const productVideos = product.media.filter((item) => item.type === "video").map((item) => item.url);
	const modeLabel =
		product.mode === "venta"
			? "Venta directa"
			: product.mode === "intercambio"
				? "Intercambio"
				: "Venta e intercambio";
	const productPrice = product.salePrice ?? product.referenceValue;
	const supportsExchange = product.mode === "intercambio" || product.mode === "ambas";
	const supportsSale = product.mode === "venta" || product.mode === "ambas";

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
							primaryActionLabel={supportsExchange ? "Solicitar intercambio" : null}
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
							onPrimaryAction={onPrimaryAction}
							onSecondaryAction={onSecondaryAction}
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
		</View>
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
