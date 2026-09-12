import { useRouter } from "expo-router";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { CardProduct } from "@/components/common/CardProduct";
import { LandingParagraph } from "@/components/common/LandingParagraph";
import { ButtonOutline } from "@/components/ui/Button";
import { colors, spacing } from "@/theme";

export function PublishProductsSection() {
	const router = useRouter();
	const { width } = useWindowDimensions();
	const isMobile = width < 768;

	return (
		<View style={styles.section}>
			<View style={styles.container}>
				<View style={styles.titleSection}>
					<LandingParagraph subtitle="VERIFICADOS Y RECIENTES" title="Publicaciones Recientes en el Campus" />
				</View>

				<View style={[styles.grid, isMobile && styles.mobileGrid]}>
					<CardProduct
						image={{
							uri: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80",
						}}
						primaryBadge="Venta"
						secondaryBadge="Sede Lima Norte"
						span="Laptop en excelente estado"
						title="MacBook Air M1"
						description="Ideal para clases, proyectos y trabajo remoto. Incluye cargador original."
						price="S/. 2,450.00"
						actionLabel="Ver producto"
						onActionPress={() =>
							router.push({
								pathname: "/productdetails",
								params: { id: "thinkpad" },
							})
						}
						style={styles.card}
					/>
					<CardProduct
						image={{
							uri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&q=80",
						}}
						primaryBadge="Venta"
						secondaryBadge="Sede Lima Norte"
						span="Prenda universitaria"
						title="Casaca vintage"
						description="Casaca cómoda y versátil, perfecta para los días fríos en el campus."
						price="S/. 85.00"
						actionLabel="Ver oferta"
						onActionPress={() =>
							router.push({
								pathname: "/productdetails",
								params: { id: "jacket" },
							})
						}
						style={styles.card}
					/>
					<CardProduct
						image={{
							uri: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&q=80",
						}}
						primaryBadge="Venta"
						secondaryBadge="Sede Lima Norte"
						span="Equipo deportivo"
						title="Balón de básquetbol"
						description="Balón oficial con poco uso, listo para tus entrenamientos y partidos."
						price="S/. 60.00"
						actionLabel="Intercambiar"
						onActionPress={() =>
							router.push({
								pathname: "/productdetails",
								params: { id: "basketball" },
							})
						}
						style={styles.card}
					/>
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
