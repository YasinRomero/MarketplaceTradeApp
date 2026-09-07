import { useRouter } from "expo-router";
import { useState } from "react";
import {
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
	ViewStyle,
} from "react-native";

import { CardProduct } from "@/components/common/CardProduct";
import { InputWithLabel } from "@/components/common/InputWithLabel";
import { ChevronBackward, ChevronForward } from "@/components/icons";
import { Button, ButtonGhost, ButtonIcon, ButtonOutline } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { colors, radius, spacing, typography } from "@/theme";

export interface MarketplaceProductsSectionProps {
	style?: StyleProp<ViewStyle>;
}

interface ProductItem {
	id: string;
	category: string;
	title: string;
	description: string;
	price: string;
}

const products: ProductItem[] = [
	{
		id: "thinkpad",
		category: "Tecnología · Computadoras",
		title: "Laptop Lenovo ThinkPad",
		description: "Equipo ideal para clases, programación y trabajo diario.",
		price: "S/. 450.00",
	},
	{
		id: "ipad",
		category: "Tecnología · Tablets",
		title: "iPad Air con chip M1",
		description: "Tablet en excelente estado para lectura y notas académicas.",
		price: "S/. 1,550.00",
	},
	{
		id: "books",
		category: "Libros · Ingeniería",
		title: "Colección de libros técnicos",
		description: "Textos de arquitectura, algoritmos y desarrollo de software.",
		price: "S/. 120.00",
	},
	{
		id: "jacket",
		category: "Ropa · Campus",
		title: "Casaca vintage",
		description: "Casaca cómoda y versátil para los días fríos en el campus.",
		price: "S/. 85.00",
	},
];

const subcategories = [
	["Computadoras", "31"],
	["Tablets", "22"],
	["Accesorios", "18"],
	["Celulares", "14"],
];

const filterGroups = [
	{ title: "Modalidad", options: ["Venta", "Intercambio"] },
	{ title: "Condición", options: ["Nuevo", "Usado"] },
];

export function MarketplaceProductsSection({ style }: MarketplaceProductsSectionProps) {
	const router = useRouter();
	const { width } = useWindowDimensions();
	const isMobile = width < 768;
	const isTablet = width < 1100;
	const isWideDesktop = width >= 1800;
	const [selectedCategory, setSelectedCategory] = useState("Tecnología");
	const [checkedFilters, setCheckedFilters] = useState<Record<string, boolean>>({
		Venta: true,
		Intercambio: false,
		Nuevo: false,
		Usado: true,
	});
	const [minimumPrice, setMinimumPrice] = useState("");
	const [maximumPrice, setMaximumPrice] = useState("");
	const [page, setPage] = useState(1);

	const toggleFilter = (label: string) => {
		setCheckedFilters((current) => ({ ...current, [label]: !current[label] }));
	};

	return (
		<View style={[styles.section, style]}>
			<View style={[styles.layout, isMobile && styles.mobileLayout]}>
				<View style={[styles.filters, isMobile && styles.mobileFilters]}>
					<FilterCategory
						title="Categoría"
						items={[
							["Tecnología", "86"],
							["Ropa", "45"],
							["Libros", "32"],
						]}
						selectedItem={selectedCategory}
						onSelect={setSelectedCategory}
					/>

					<View style={styles.subcategories}>
						{selectedCategory === "Tecnología" &&
							subcategories.map(([label, count], index) => (
								<FilterLink key={label} label={label} count={count} active={index === 0} />
							))}
					</View>

					{filterGroups.map((group) => (
						<View key={group.title} style={styles.filterGroup}>
							<Text style={styles.filterTitle}>{group.title}</Text>
							{group.options.map((option) => (
								<Checkbox
									key={option}
									label={option}
									checked={Boolean(checkedFilters[option])}
									bold={false}
									onChange={() => toggleFilter(option)}
								/>
							))}
						</View>
					))}

					<View style={styles.filterGroup}>
						<Text style={styles.filterTitle}>Rango de precio</Text>
						<View style={styles.priceInputs}>
							<InputWithLabel
								label=""
								value={minimumPrice}
								onChangeText={setMinimumPrice}
								placeholder="Mín."
								accessibilityLabel="Precio mínimo"
								containerStyle={styles.priceInput}
							/>
							<Text style={styles.rangeSeparator}>-</Text>
							<InputWithLabel
								label=""
								value={maximumPrice}
								onChangeText={setMaximumPrice}
								placeholder="Máx."
								accessibilityLabel="Precio máximo"
								containerStyle={styles.priceInput}
							/>
							<ButtonIcon
								accessibilityLabel="Aplicar rango de precio"
								icon={<ChevronForward size={18} color={colors.text.inverse} />}
								onPress={() => setPage(1)}
								variant="primary"
								style={styles.applyButton}
							/>
						</View>
					</View>
				</View>

				<View style={styles.productsList}>
					<View style={[styles.productsGrid, isMobile && styles.mobileProductsGrid]}>
						{products.map((product) => (
							<CardProduct
								key={product.id}
								span={product.category}
								title={product.title}
								description={product.description}
								price={product.price}
								primaryBadge="Venta"
								secondaryBadge="Universidad"
								actionLabel="Ver producto"
								onActionPress={() =>
									router.push({ pathname: "/productdetails", params: { id: product.id } })
								}
								style={[
									styles.productCard,
									isTablet && styles.tabletProductCard,
									isWideDesktop && styles.wideProductCard,
									isMobile && styles.mobileProductCard,
								]}
							/>
						))}
					</View>

					<View style={[styles.pagination, isMobile && styles.mobilePagination]}>
						<ButtonOutline
							icon={<ChevronBackward size={16} color={colors.text.secondary} />}
							onPress={() => setPage((current) => Math.max(1, current - 1))}
						>
							Anterior
						</ButtonOutline>

						<View style={styles.pages}>
							{[1, 2, 3, 4, 5, 6].map((pageNumber) =>
								pageNumber === page ? (
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
							onPress={() => setPage((current) => Math.min(6, current + 1))}
						>
							Siguiente
						</ButtonOutline>
					</View>
				</View>
			</View>
		</View>
	);
}

function FilterCategory({
	title,
	items,
	selectedItem,
	onSelect,
}: {
	title: string;
	items: string[][];
	selectedItem: string;
	onSelect: (item: string) => void;
}) {
	return (
		<View style={styles.categoryGroup}>
			<Text style={styles.filterTitle}>{title}</Text>
			{items.map(([label, count]) => (
				<FilterLink
					key={label}
					label={label}
					count={count}
					active={label === selectedItem}
					onPress={() => onSelect(label)}
				/>
			))}
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
		minHeight: 640,
		padding: 20,
		gap: spacing.xl,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.lg,
	},
	mobileFilters: {
		width: "100%",
		minHeight: 0,
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
		color: "#B30031",
	},
	filterCount: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: 16,
		fontWeight: typography.weight.regular,
		color: colors.text.secondary,
	},
	subcategories: {
		paddingLeft: spacing.sm,
		gap: spacing.xs,
		borderLeftWidth: 2,
		borderLeftColor: "#B30031",
	},
	filterGroup: {
		paddingTop: spacing.xl,
		gap: spacing.sm,
		borderTopWidth: 1,
		borderTopColor: colors.border.default,
	},
	priceInputs: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	priceInput: {
		flex: 1,
	},
	rangeSeparator: {
		fontFamily: typography.family,
		fontSize: typography.size.base,
		lineHeight: typography.lineHeight.xl,
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
		minWidth: 0,
		gap: spacing["2xl"],
	},
	productsGrid: {
		width: "100%",
		flexDirection: "row",
		flexWrap: "wrap",
		alignContent: "flex-start",
		gap: spacing.lg,
	},
	mobileProductsGrid: {
		flexDirection: "column",
	},
	productCard: {
		width: "31.8%",
		minWidth: 320,
		minHeight: 525,
	},
	wideProductCard: {
		width: "23.5%",
	},
	tabletProductCard: {
		width: "48%",
	},
	mobileProductCard: {
		width: "100%",
		minWidth: 0,
	},
	pagination: {
		width: "100%",
		minHeight: 69,
		paddingTop: spacing.xl,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.lg,
		borderTopWidth: 1,
		borderTopColor: colors.border.default,
	},
	mobilePagination: {
		flexWrap: "wrap",
		justifyContent: "center",
	},
	pages: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	pageButton: {
		minWidth: 34,
	},
});
