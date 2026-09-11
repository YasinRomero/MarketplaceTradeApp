import { ImageSourcePropType, StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import { CardTransactionProduct } from "@/components/common/CardTransactionProduct";
import { DescriptionAcademicContextCard } from "@/components/common/DescriptionAcademicContextCard";
import { DetailsProductBreadcrumb } from "@/components/common/DetailsProductBreadcrumb";
import { InfoAuthorProduct } from "@/components/common/InfoAuthorProduct";
import { MediaViewerCard } from "@/components/common/MediaViewerCard";
import { TechnicalSpecsCard } from "@/components/common/TechnicalSpecsCard";
import { spacing } from "@/theme";

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

const productDetails: Record<string, { category: string; title: string; price: string }> = {
	thinkpad: {
		category: "Computadoras",
		title: "Laptop Lenovo ThinkPad",
		price: "S/. 450.00",
	},
	ipad: {
		category: "Tablets",
		title: "iPad Air con chip M1",
		price: "S/. 1,550.00",
	},
	jacket: { category: "Ropa", title: "Casaca vintage", price: "S/. 85.00" },
	basketball: {
		category: "Deportes",
		title: "Balón de básquetbol",
		price: "S/. 60.00",
	},
	books: {
		category: "Libros",
		title: "Colección de libros técnicos",
		price: "S/. 120.00",
	},
};

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
	const product = productDetails[productId ?? "thinkpad"] ?? productDetails.thinkpad;

	return (
		<View style={[styles.section, isMobile && styles.mobileSection, style]}>
			<View style={styles.content}>
				<DetailsProductBreadcrumb
					items={[
						{ label: "Inicio" },
						{ label: "Marketplace" },
						{ label: product.category },
						{ label: product.title },
					]}
				/>

				<View style={[styles.columns, isMobile && styles.mobileColumns]}>
					<View style={styles.mainColumn}>
						<MediaViewerCard images={images} onZoomPress={onZoomPress} />
						<TechnicalSpecsCard />
						<DescriptionAcademicContextCard />
					</View>

					<View style={[styles.sideColumn, isMobile && styles.mobileSideColumn]}>
						<CardTransactionProduct
							primaryBadge="Intercambio preferido"
							secondaryBadge="Venta directa"
							title={product.title}
							price={product.price}
							priceDescription="Equivalente o compensación acordada para intercambio justo."
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
