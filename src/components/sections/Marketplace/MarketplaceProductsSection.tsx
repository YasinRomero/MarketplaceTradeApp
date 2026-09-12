import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleProp, StyleSheet, Text, useWindowDimensions, View, ViewStyle } from "react-native";

import { CardProduct } from "@/components/common/CardProduct";
import { InputWithLabel } from "@/components/common/InputWithLabel";
import { ChevronBackward, ChevronForward } from "@/components/icons";
import { Button, ButtonGhost, ButtonIcon, ButtonOutline } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { colors, radius, responsive, spacing, typography } from "@/theme";

export type ProductModality = "Venta" | "Intercambio" | "Ambos";

export interface MarketplaceProductsSectionProps {
	style?: StyleProp<ViewStyle>;
	searchValue?: string;
	selectedSede?: string | null;
	selectedModality?: ProductModality | null;
	sortValue?: string;
	onResultCountChange?: (count: number) => void;
}

interface ProductItem {
	id: string;
	category: string;
	subcategory: string;
	title: string;
	description: string;
	price: number;
	modality: ProductModality;
	sede: string;
	createdAt: number;
}

const products: ProductItem[] = [
	{
		id: "thinkpad",
		category: "Tecnología",
		subcategory: "Computadoras",
		title: "Laptop Lenovo ThinkPad",
		description: "Equipo ideal para clases, programación y trabajo diario.",
		price: 450,
		modality: "Venta",
		sede: "Lima Centro",
		createdAt: 6,
	},
	{
		id: "ipad",
		category: "Tecnología",
		subcategory: "Tablets",
		title: "iPad Air con chip M1",
		description: "Tablet en excelente estado para lectura y notas académicas.",
		price: 1550,
		modality: "Ambos",
		sede: "Lima Norte",
		createdAt: 5,
	},
	{
		id: "books",
		category: "Libros",
		subcategory: "Ingeniería",
		title: "Colección de libros técnicos",
		description: "Textos de arquitectura, algoritmos y desarrollo de software.",
		price: 120,
		modality: "Intercambio",
		sede: "Lima Centro",
		createdAt: 4,
	},
	{
		id: "jacket",
		category: "Ropa",
		subcategory: "Casacas",
		title: "Casaca vintage",
		description: "Casaca cómoda y versátil para los días fríos en el campus.",
		price: 85,
		modality: "Venta",
		sede: "Lima Sur",
		createdAt: 3,
	},
	{
		id: "keyboard",
		category: "Tecnología",
		subcategory: "Accesorios",
		title: "Teclado mecánico",
		description: "Teclado compacto ideal para programación y videojuegos.",
		price: 180,
		modality: "Ambos",
		sede: "Lima Norte",
		createdAt: 2,
	},
	{
		id: "phone",
		category: "Tecnología",
		subcategory: "Celulares",
		title: "Samsung Galaxy A54",
		description: "Celular en excelente estado con cargador original.",
		price: 850,
		modality: "Intercambio",
		sede: "Lima Sur",
		createdAt: 1,
	},
];

const ITEMS_PER_PAGE = 4;

const MODALITY_OPTIONS: ProductModality[] = ["Venta", "Intercambio", "Ambos"];

const formatPrice = (price: number) =>
	`S/. ${price.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;

export function MarketplaceProductsSection({
	style,
	searchValue = "",
	selectedSede = null,
	selectedModality = null,
	sortValue = "Relevancia",
	onResultCountChange,
}: MarketplaceProductsSectionProps) {
	const router = useRouter();
	const { width } = useWindowDimensions();

	const isTabletDown = responsive.isTabletDown(width);
	const isMobileDown = responsive.isMobileDown(width);

	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
	const [checkedFilters, setCheckedFilters] = useState<Record<ProductModality, boolean>>({
		Venta: false,
		Intercambio: false,
		Ambos: false,
	});

	const [minimumPrice, setMinimumPrice] = useState("");
	const [maximumPrice, setMaximumPrice] = useState("");
	const [page, setPage] = useState(1);
	const categories = useMemo(() => {
		return [...new Set(products.map((product) => product.category))];
	}, []);

	const subcategories = useMemo(() => {
		if (!selectedCategory) {
			return [];
		}

		return [
			...new Set(
				products
					.filter((product) => product.category === selectedCategory)
					.map((product) => product.subcategory),
			),
		];
	}, [selectedCategory]);

	const categoryCount = (category: string) => products.filter((product) => product.category === category).length;

	const subcategoryCount = (subcategory: string) =>
		products.filter((product) => product.category === selectedCategory && product.subcategory === subcategory)
			.length;

	const toggleFilter = (option: ProductModality) => {
		setCheckedFilters((current) => ({
			...current,
			[option]: !current[option],
		}));

		setPage(1);
	};

	const matchesModality = (product: ProductItem, modality: ProductModality) => {
		if (modality === "Venta") {
			return product.modality === "Venta" || product.modality === "Ambos";
		}

		if (modality === "Intercambio") {
			return product.modality === "Intercambio" || product.modality === "Ambos";
		}

		return product.modality === "Ambos";
	};

	const filteredProducts = useMemo(() => {
		const normalizedSearch = searchValue.trim().toLowerCase();
		const min = minimumPrice !== "" ? Number(minimumPrice) : null;
		const max = maximumPrice !== "" ? Number(maximumPrice) : null;
		const activeModalities = MODALITY_OPTIONS.filter((option) => checkedFilters[option]);

		const result = products.filter((product) => {
			const matchesSearch =
				!normalizedSearch ||
				product.title.toLowerCase().includes(normalizedSearch) ||
				product.description.toLowerCase().includes(normalizedSearch) ||
				product.category.toLowerCase().includes(normalizedSearch) ||
				product.subcategory.toLowerCase().includes(normalizedSearch) ||
				product.sede.toLowerCase().includes(normalizedSearch);

			const matchesSede = !selectedSede || product.sede === selectedSede;
			const matchesTopModality = !selectedModality || matchesModality(product, selectedModality);
			const matchesCategory = !selectedCategory || product.category === selectedCategory;
			const matchesSubcategory = !selectedSubcategory || product.subcategory === selectedSubcategory;

			const matchesSidebarModality =
				activeModalities.length === 0 ||
				activeModalities.some((modality) => matchesModality(product, modality));

			const matchesMinimum = min === null || product.price >= min;
			const matchesMaximum = max === null || product.price <= max;

			return (
				matchesSearch &&
				matchesSede &&
				matchesTopModality &&
				matchesCategory &&
				matchesSubcategory &&
				matchesSidebarModality &&
				matchesMinimum &&
				matchesMaximum
			);
		});

		if (sortValue === "Menor precio") {
			return [...result].sort((a, b) => a.price - b.price);
		}

		if (sortValue === "Más recientes") {
			return [...result].sort((a, b) => b.createdAt - a.createdAt);
		}

		return result;
	}, [
		searchValue,
		selectedSede,
		selectedModality,
		selectedCategory,
		selectedSubcategory,
		checkedFilters,
		minimumPrice,
		maximumPrice,
		sortValue,
	]);

	const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

	const safePage = Math.min(page, totalPages);

	const paginatedProducts = filteredProducts.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

	const selectCategory = (category: string) => {
		setSelectedCategory((current) => (current === category ? null : category));

		setSelectedSubcategory(null);
		setPage(1);
	};

	const selectSubcategory = (subcategory: string) => {
		setSelectedSubcategory((current) => (current === subcategory ? null : subcategory));

		setPage(1);
	};

	if (onResultCountChange) {
		onResultCountChange(filteredProducts.length);
	}

	return (
		<View style={[styles.section, isMobileDown && styles.mobileSection, style]}>
			<View style={[styles.layout, isTabletDown && styles.mobileLayout]}>
				<View style={[styles.filters, isTabletDown && styles.mobileFilters]}>
					<View style={styles.categoryGroup}>
						<Text style={styles.filterTitle}>Categoría</Text>

						{categories.map((category) => (
							<FilterLink
								key={category}
								label={category}
								count={String(categoryCount(category))}
								active={selectedCategory === category}
								onPress={() => selectCategory(category)}
							/>
						))}
					</View>

					{selectedCategory && subcategories.length > 0 && (
						<View style={styles.subcategories}>
							{subcategories.map((subcategory) => (
								<FilterLink
									key={subcategory}
									label={subcategory}
									count={String(subcategoryCount(subcategory))}
									active={selectedSubcategory === subcategory}
									onPress={() => selectSubcategory(subcategory)}
								/>
							))}
						</View>
					)}

					<View style={styles.filterGroup}>
						<Text style={styles.filterTitle}>Modalidad</Text>

						{MODALITY_OPTIONS.map((option) => (
							<Checkbox
								key={option}
								label={option}
								checked={checkedFilters[option]}
								bold={false}
								onChange={() => toggleFilter(option)}
							/>
						))}
					</View>

					<View style={styles.filterGroup}>
						<Text style={styles.filterTitle}>Rango de precio</Text>

						<View style={styles.priceInputs}>
							<InputWithLabel
								label=""
								value={minimumPrice}
								onChangeText={(value) => {
									setMinimumPrice(value.replace(/\D/g, ""));

									setPage(1);
								}}
								placeholder="Mín."
								keyboardType="numeric"
								containerStyle={styles.priceInput}
							/>

							<Text style={styles.rangeSeparator}>-</Text>

							<InputWithLabel
								label=""
								value={maximumPrice}
								onChangeText={(value) => {
									setMaximumPrice(value.replace(/\D/g, ""));

									setPage(1);
								}}
								placeholder="Máx."
								keyboardType="numeric"
								containerStyle={styles.priceInput}
							/>

							<ButtonIcon
								icon={<ChevronForward size={18} color={colors.text.inverse} />}
								onPress={() => setPage(1)}
								color="primary"
								style={styles.applyButton}
							/>
						</View>
					</View>
				</View>

				<View style={styles.productsList}>
					<View style={styles.resultsHeader}>
						<Text style={styles.resultsText}>
							{filteredProducts.length}{" "}
							{filteredProducts.length === 1 ? "producto encontrado" : "productos encontrados"}
						</Text>
					</View>

					{paginatedProducts.length > 0 ? (
						<View style={[styles.productsGrid, isMobileDown && styles.mobileProductsGrid]}>
							{paginatedProducts.map((product) => (
								<CardProduct
									key={product.id}
									span={`${product.category} · ${product.subcategory}`}
									title={product.title}
									description={product.description}
									price={formatPrice(product.price)}
									primaryBadge={product.modality}
									secondaryBadge={product.sede}
									actionLabel="Ver producto"
									onActionPress={() =>
										router.push({
											pathname: "/productdetails",
											params: {
												id: product.id,
											},
										})
									}
									style={[
										styles.productCard,
										isTabletDown && styles.tabletProductCard,
										isMobileDown && styles.mobileProductCard,
									]}
								/>
							))}
						</View>
					) : (
						<View style={styles.emptyState}>
							<Text style={styles.emptyTitle}>No encontramos productos</Text>

							<Text style={styles.emptyDescription}>
								Prueba modificando los filtros, la sede o la búsqueda.
							</Text>
						</View>
					)}

					{filteredProducts.length > 0 && (
						<View style={[styles.pagination, isMobileDown && styles.mobilePagination]}>
							<ButtonOutline
								icon={<ChevronBackward size={16} color={colors.text.secondary} />}
								onPress={() => setPage((current) => Math.max(1, current - 1))}
							>
								Anterior
							</ButtonOutline>

							<View style={styles.pages}>
								{Array.from(
									{
										length: totalPages,
									},
									(_, index) => index + 1,
								).map((pageNumber) =>
									pageNumber === safePage ? (
										<Button
											key={pageNumber}
											onPress={() => setPage(pageNumber)}
											style={styles.pageButton}
										>
											{String(pageNumber)}
										</Button>
									) : (
										<ButtonGhost
											key={pageNumber}
											onPress={() => setPage(pageNumber)}
											style={styles.pageButton}
										>
											{String(pageNumber)}
										</ButtonGhost>
									),
								)}
							</View>

							<ButtonOutline
								iconPosition="right"
								icon={<ChevronForward size={16} color={colors.text.secondary} />}
								onPress={() => setPage((current) => Math.min(totalPages, current + 1))}
							>
								Siguiente
							</ButtonOutline>
						</View>
					)}
				</View>
			</View>
		</View>
	);
}

function FilterLink({
	label,
	count,
	active = false,
	onPress,
}: {
	label: string;
	count: string;
	active?: boolean;
	onPress?: () => void;
}) {
	return (
		<Pressable
			accessibilityRole="button"
			onPress={onPress}
			style={[styles.filterLink, active && styles.activeFilterLink]}
		>
			<Text style={[styles.filterLabel, active && styles.activeFilterLabel]}>{label}</Text>

			<Text style={[styles.filterCount, active && styles.activeFilterLabel]}>{count}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	section: {
		width: "100%",
		paddingHorizontal: spacing["2xl"],
		paddingBottom: spacing["2xl"],
		backgroundColor: colors.background.page,
	},

	mobileSection: {
		paddingHorizontal: spacing.md,
	},

	layout: {
		width: "100%",
		maxWidth: 1800,
		alignSelf: "center",
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing["2xl"],
	},

	mobileLayout: {
		flexDirection: "column",
	},

	filters: {
		width: 284,
		padding: 20,
		gap: spacing.xl,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.lg,
	},

	mobileFilters: {
		width: "100%",
	},

	categoryGroup: {
		gap: spacing.sm,
	},

	filterTitle: {
		marginBottom: spacing.xs,
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.lg,
		fontWeight: typography.weight.semibold,
		color: colors.text.primary,
	},

	filterLink: {
		minHeight: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 2,
	},

	activeFilterLink: {
		paddingLeft: spacing.sm,
		borderLeftWidth: 2,
		borderLeftColor: colors.action.primary,
	},

	filterLabel: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: 16,
		fontWeight: typography.weight.regular,
		color: colors.text.secondary,
	},

	activeFilterLabel: {
		fontWeight: typography.weight.bold,
		color: colors.action.primary,
	},

	filterCount: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: 16,
		color: colors.text.secondary,
	},

	subcategories: {
		paddingLeft: spacing.sm,
		gap: spacing.xs,
		borderLeftWidth: 2,
		borderLeftColor: colors.action.primary,
	},

	filterGroup: {
		paddingTop: spacing.xl,
		gap: spacing.sm,
		borderTopWidth: 1,
		borderTopColor: colors.border.default,
	},

	priceInputs: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},

	priceInput: {
		flex: 1,
		minWidth: 0,
	},

	rangeSeparator: {
		fontFamily: typography.family,
		fontSize: typography.size.base,
		color: colors.text.secondary,
	},

	applyButton: {
		width: 32,
		height: 32,
		paddingHorizontal: 4,
		paddingVertical: 4,
		borderRadius: radius.md,
	},

	productsList: {
		flex: 1,
		width: "100%",
		minWidth: 0,
		gap: spacing.xl,
	},

	resultsHeader: {
		width: "100%",
	},

	resultsText: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		fontWeight: typography.weight.semibold,
		color: colors.text.secondary,
	},

	productsGrid: {
		width: "100%",
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "flex-start",
		gap: spacing.lg,
	},

	mobileProductsGrid: {
		flexDirection: "column",
		flexWrap: "nowrap",
	},

	productCard: {
		flexBasis: "31%",
		flexGrow: 1,
		maxWidth: 380,
		minWidth: 280,
	},

	tabletProductCard: {
		flexBasis: "47%",
		maxWidth: "100%",
	},

	mobileProductCard: {
		width: "100%",
		flexBasis: "auto",
		flexGrow: 0,
		maxWidth: "100%",
		minWidth: 0,
		alignSelf: "stretch",
	},

	emptyState: {
		width: "100%",
		paddingVertical: spacing["2xl"],
		alignItems: "center",
		gap: spacing.sm,
	},

	emptyTitle: {
		fontFamily: typography.family,
		fontSize: typography.size.md,
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},

	emptyDescription: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		color: colors.text.secondary,
		textAlign: "center",
	},

	pagination: {
		width: "100%",
		paddingTop: spacing.xl,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.lg,
		borderTopWidth: 1,
		borderTopColor: colors.border.default,
	},

	mobilePagination: {
		justifyContent: "center",
		flexWrap: "wrap",
		gap: spacing.md,
	},

	pages: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		justifyContent: "center",
		gap: spacing.xs,
	},

	pageButton: {
		minWidth: 34,
	},
});
