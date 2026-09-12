import { ReactNode } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { type CardCategoryTone } from "@/components/common/CardCategoryLink";
import { Chair, Experiment, LaptopChromebook, MenuBook, SportsBasketball } from "@/components/icons";
import { colors, responsive, spacing, typography } from "@/theme";

import { CardCategoryLink as CategoryCard } from "@/components/common/CardCategoryLink";
import { LandingParagraph } from "@/components/common/LandingParagraph";

export interface CategorySectionItem {
	id: string;
	title: string;
	description: string;
	badges?: string[];
	tone?: CardCategoryTone;
	icon?: ReactNode;
	onPress?: () => void;
}

export interface CategorySectionProps {
	onCategoryPress?: (category: CategorySectionItem) => void;
}

const categories: CategorySectionItem[] = [
	{
		id: "1",
		title: "Libros y Textos Académicos",
		description: "Bibliografía obligatoria y manuales recomendados por cátedra.",
		badges: ["Category", "Category", "Category", "Category"],
		tone: "red",
		icon: <MenuBook size={24} color={colors.card.red.foreground} />,
	},
	{
		id: "2",
		title: "Tecnología y Gadgets",
		description: "Herramientas de cómputo y cálculo para alto rendimiento académico.",
		badges: ["Category", "Category", "Category", "Category"],
		tone: "blue",
		icon: <LaptopChromebook size={24} color={colors.card.blue.foreground} />,
	},
	{
		id: "3",
		title: "Material de Laboratorio y Salud",
		description: "Instrumental clínico y de protección verificado para prácticas y clínicas.",
		badges: ["Category", "Category", "Category", "Category"],
		tone: "green",
		icon: <Experiment size={24} color={colors.card.green.foreground} />,
	},
	{
		id: "4",
		title: "Mobiliario y Estudio",
		description: "Equipamiento ergonómico y accesorios para optimizar tu espacio de estudio en casa.",
		badges: ["Category", "Category", "Category", "Category"],
		tone: "purple",
		icon: <Chair size={24} color={colors.card.purple.foreground} />,
	},
	{
		id: "5",
		title: "Deportes y Equipamiento",
		description: "Indumentaria oficial de los representativos universitarios y accesorios para bienestar físico.",
		badges: ["Category", "Category", "Category", "Category"],
		tone: "yellow",
		icon: <SportsBasketball size={24} color={colors.card.yellow.foreground} />,
	},
];

export function CategorySection({ onCategoryPress }: CategorySectionProps) {
	const { width } = useWindowDimensions();
	const isTabletDown = responsive.isTabletDown(width);

	const topCategories = categories.slice(0, 3);
	const bottomCategories = categories.slice(3);

	const renderCategory = (category: CategorySectionItem, style?: object) => (
		<CategoryCard
			key={category.id}
			title={category.title}
			description={category.description}
			badges={category.badges}
			tone={category.tone}
			icon={category.icon}
			onPress={() => {
				category.onPress?.();
				onCategoryPress?.(category);
			}}
			style={style}
		/>
	);

	return (
		<View style={styles.section}>
			<View style={styles.inner}>
				<View style={[styles.titleSection, isTabletDown && styles.mobileTitleSection]}>
					<LandingParagraph subtitle="EXPLORA POR ÁREA DE ESTUDIO" title="Categorías Universitarias Clave" />
					<Text style={styles.description}>
						Encuentra exactamente los materiales específicos que demanda tu carrera sin intermediarios ni
						cobros sorpresa.
					</Text>
				</View>

				{isTabletDown ? (
					<View style={styles.mobileGrid}>{categories.map((category) => renderCategory(category))}</View>
				) : (
					<View style={styles.bento}>
						<View style={styles.topRow}>
							{topCategories.map((category) => renderCategory(category, styles.topCard))}
						</View>
						<View style={styles.bottomRow}>
							{bottomCategories.map((category, index) =>
								renderCategory(category, index === 0 ? styles.bottomSmallCard : styles.bottomLargeCard),
							)}
						</View>
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		paddingVertical: 64,
		paddingHorizontal: spacing["2xl"],
		backgroundColor: colors.background.page,
	},

	inner: {
		maxWidth: 1216,
		alignSelf: "center",
		gap: 40,
	},

	titleSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: spacing["2xl"],
	},

	description: {
		maxWidth: 448,
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.lg,
		fontWeight: typography.weight.regular,
		color: colors.text.primary,
	},

	bento: {
		width: "100%",
		gap: spacing.xl,
	},

	topRow: {
		width: "100%",
		flexDirection: "row",
		gap: spacing.xl,
	},

	topCard: {
		flex: 1,
	},

	bottomRow: {
		width: "100%",
		flexDirection: "row",
		gap: spacing.xl,
	},

	bottomSmallCard: {
		flex: 1,
	},

	bottomLargeCard: {
		flex: 2,
		maxWidth: undefined,
	},

	mobileGrid: {
		width: "100%",
		gap: spacing.xl,
		alignItems: "center",
	},

	// Mobile Responsive
	mobileTitleSection: {
		flexDirection: "column",
	},
});
