import { CardProduct } from "@/components/common/CardProduct";
import { LandingParagraph } from "@/components/common/LandingParagraph";
import { ButtonOutline } from "@/components/ui/Button";
import { Product } from "@/schemas/product";
import { useProductStore } from "@/stores/productStore";
import { colors, spacing } from "@/theme";
import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

const siteNames: Record<number, string> = { 1: "Lima Norte" };

const getModeLabel = (mode: Product["mode"]) =>
	mode === "venta" ? "Venta" : mode === "intercambio" ? "Intercambio" : "Venta e intercambio";

const formatProductPrice = (product: Product) => {
	const price = product.salePrice ?? product.referenceValue;
	return price === null ? "Valor por definir" : `S/. ${price.toFixed(2)}`;
};

export function PublishProductsSection() {
	const router = useRouter();
	const { products, loadProducts } = useProductStore();
	const { width } = useWindowDimensions();
	const isMobile = width < 768;

	useEffect(() => {
		loadProducts();
	}, [loadProducts]);

	const recentProducts = useMemo(
		() => [...products].sort((first, second) => second.createdAt.localeCompare(first.createdAt)).slice(0, 3),
		[products],
	);

	return (
		<View style={styles.section}>
			<View style={styles.container}>
				<View style={styles.titleSection}>
					<LandingParagraph subtitle="VERIFICADOS Y RECIENTES" title="Publicaciones Recientes en el Campus" />
				</View>

				<View style={[styles.grid, isMobile && styles.mobileGrid]}>
					{recentProducts.map((product) => {
						const image = product.media.find(
							(media) => media.type === "imagen" && media.isPublication !== false,
						);

						return (
							<CardProduct
								key={product.id}
								image={image ? { uri: image.url } : undefined}
								primaryBadge={getModeLabel(product.mode)}
								secondaryBadge={siteNames[product.siteId] ?? "Sede institucional"}
								span="Publicación verificada"
								title={product.title}
								description={product.description}
								price={formatProductPrice(product)}
								actionLabel="Ver producto"
								onActionPress={() =>
									router.push({ pathname: "/productdetails", params: { id: String(product.id) } })
								}
								style={styles.card}
							/>
						);
					})}
				</View>

				<View style={styles.footerAction}>
					<ButtonOutline onPress={() => router.push("/marketplace")}>Ver más productos</ButtonOutline>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		width: "100%",
		paddingVertical: 64,
		paddingHorizontal: spacing["2xl"],
		backgroundColor: colors.background.page,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: colors.border.default,
	},

	container: {
		width: "100%",
		maxWidth: 1216,
		alignSelf: "center",
		gap: 40,
	},

	titleSection: {
		width: "100%",
	},

	grid: {
		width: "100%",
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing.xl,
	},

	mobileGrid: {
		flexDirection: "column",
		alignItems: "center",
	},

	card: {
		flex: 1,
		maxWidth: 380,
	},

	footerAction: {
		width: "100%",
		alignItems: "center",
		paddingTop: spacing.sm,
	},
});
