import {
	ImageSourcePropType,
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
	ViewStyle,
} from "react-native";

import { CardProduct } from "@/components/common/CardProduct";
import { HeaderSections } from "@/components/common/HeaderSections";
import { colors, spacing, typography } from "@/theme";

export interface RecommendationItem {
	id: string;
	image?: ImageSourcePropType;
	category: string;
	title: string;
	description: string;
	price: string;
	primaryBadge?: string;
	secondaryBadge?: string;
}

export interface RecommendationsSectionProps {
	recommendations?: RecommendationItem[];
	title?: string;
	description?: string;
	viewAllLabel?: string;
	onViewAllPress?: () => void;
	onProductPress?: (product: RecommendationItem) => void;
	style?: StyleProp<ViewStyle>;
}

const defaultRecommendations: RecommendationItem[] = [
	{
		id: "thinkpad",
		category: "Tecnología · Computadoras",
		title: "Laptop Lenovo ThinkPad",
		description: "Equipo ideal para clases, programación y trabajo diario.",
		price: "S/. 450.00",
		primaryBadge: "Venta",
		secondaryBadge: "Universidad",
	},
	{
		id: "ipad-air",
		category: "Tecnología · Tablets",
		title: "iPad Air con chip M1",
		description: "Tablet en excelente estado para lectura y notas académicas.",
		price: "S/. 1,550.00",
		primaryBadge: "Venta",
		secondaryBadge: "Universidad",
	},
	{
		id: "books",
		category: "Libros · Ingeniería",
		title: "Colección de libros técnicos",
		description: "Textos de arquitectura, algoritmos y desarrollo de software.",
		price: "S/. 120.00",
		primaryBadge: "Venta",
		secondaryBadge: "Universidad",
	},
	{
		id: "desk",
		category: "Mobiliario · Estudio",
		title: "Escritorio de estudio",
		description: "Espacio compacto y funcional para tu setup académico.",
		price: "S/. 180.00",
		primaryBadge: "Venta",
		secondaryBadge: "Campus",
	},
];

export function RecommendationsSection({
	recommendations = defaultRecommendations,
	title = "Recomendaciones para ti",
	description = "Productos destacados de tu comunidad universitaria.",
	viewAllLabel = "Ver todas en Campus Tecnológico",
	onViewAllPress,
	onProductPress,
	style,
}: RecommendationsSectionProps) {
	const { width } = useWindowDimensions();
	const columns = width < 700 ? 1 : width < 1100 ? 2 : 4;

	return (
		<View style={[styles.section, style]}>
			<View style={styles.content}>
				<HeaderSections
					size="2xl"
					title={title}
					description={description}
					titleStyle={styles.title}
					descriptionStyle={styles.description}
					aside={
						<Pressable accessibilityRole="link" onPress={onViewAllPress}>
							<Text style={styles.viewAll}>{viewAllLabel}</Text>
						</Pressable>
					}
				/>

				<View style={styles.productsGrid}>
					{recommendations.map((product) => (
						<View key={product.id} style={[styles.productItem, getColumnStyle(columns)]}>
							<CardProduct
								image={product.image}
								primaryBadge={product.primaryBadge}
								secondaryBadge={product.secondaryBadge}
								span={product.category}
								title={product.title}
								description={product.description}
								price={product.price}
								onActionPress={() => onProductPress?.(product)}
								style={styles.productCard}
							/>
						</View>
					))}
				</View>
			</View>
		</View>
	);
}

function getColumnStyle(columns: number): ViewStyle {
	if (columns === 4) return styles.fourColumns;
	if (columns === 2) return styles.twoColumns;
	return styles.oneColumn;
}

const styles = StyleSheet.create({
	section: {
		width: "100%",
		paddingTop: 40,
		paddingBottom: spacing["2xl"],
		backgroundColor: colors.background.page,
	},
	content: {
		width: "100%",
		maxWidth: 1232,
		alignSelf: "center",
		gap: spacing.xl,
	},
	title: {
		fontSize: 36,
		lineHeight: 40,
	},
	description: {
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.lg,
	},
	viewAll: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.md,
		fontWeight: typography.weight.semibold,
		color: colors.action.primary,
	},
	productsGrid: {
		width: "100%",
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.xl,
	},
	productItem: {
		minWidth: 0,
	},
	fourColumns: {
		width: "23.4%",
	},
	twoColumns: {
		width: "46%",
	},
	oneColumn: {
		width: "100%",
	},
	productCard: {
		width: "100%",
	},
});
