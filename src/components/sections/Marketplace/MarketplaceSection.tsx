import { useState } from "react";
import { ScrollView, StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import { MarketplaceFilterChip, MarketplaceFilters } from "@/components/common/MarketplaceFilters";
import { MarketplaceSearchBar } from "@/components/common/MarketplaceSearchBar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { colors, spacing } from "@/theme";

export interface MarketplaceSectionProps {
	resultCount?: string | number;
	onSearch?: (value: string) => void;
	style?: StyleProp<ViewStyle>;
}

const institutions = ["Selecciona una sede", "Lima Norte", "Lima Centro"];
const exchangeTypes = ["Tipo de intercambio", "Venta", "Intercambio"];
const sortOptions = ["Relevancia", "Más recientes", "Menor precio"];

export function MarketplaceSection({ resultCount = "1,240", onSearch, style }: MarketplaceSectionProps) {
	const { width } = useWindowDimensions();
	const isMobile = width < 768;
	const [search, setSearch] = useState("");
	const [institution, setInstitution] = useState(institutions[0]);
	const [exchangeType, setExchangeType] = useState(exchangeTypes[0]);
	const [sortValue, setSortValue] = useState(sortOptions[0]);
	const [activeFilters, setActiveFilters] = useState<MarketplaceFilterChip[]>([
		{ id: "institution", label: "Universidad Nacional" },
		{ id: "exchange", label: "Venta" },
	]);

	const removeFilter = (id: string) => {
		setActiveFilters((filters) => filters.filter((filter) => filter.id !== id));
	};

	return (
		<View style={[styles.section, isMobile && styles.mobileSection, style]}>
			<View style={styles.content}>
				<Breadcrumb items={[{ label: "Inicio" }, { label: "Marketplace" }, { label: "Productos" }]} />

				<ScrollView
					horizontal={isMobile}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={isMobile && styles.wideContent}
					style={styles.scroller}
				>
					<MarketplaceSearchBar
						searchValue={search}
						onSearchChange={setSearch}
						onSearchPress={() => onSearch?.(search)}
						institution={institution}
						institutionOptions={institutions}
						onInstitutionChange={setInstitution}
						exchangeType={exchangeType}
						exchangeTypeOptions={exchangeTypes}
						onExchangeChange={setExchangeType}
					/>
				</ScrollView>

				<ScrollView
					horizontal={isMobile}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={isMobile && styles.wideContent}
					style={styles.scroller}
				>
					<MarketplaceFilters
						resultCount={resultCount}
						activeFilters={activeFilters.map((filter) => ({
							...filter,
							onRemove: () => removeFilter(filter.id),
						}))}
						sortValue={sortValue}
						sortOptions={sortOptions}
						onSortChange={setSortValue}
						onClearFilters={() => setActiveFilters([])}
					/>
				</ScrollView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		width: "100%",
		paddingVertical: spacing.xl,
		paddingHorizontal: spacing["2xl"],
		backgroundColor: colors.background.page,
	},
	mobileSection: {
		paddingHorizontal: spacing.lg,
	},
	content: {
		width: "100%",
		maxWidth: 1232,
		alignSelf: "center",
		gap: spacing.lg,
	},
	scroller: {
		width: "100%",
	},
	wideContent: {
		width: 1232,
	},
});
