import { useState } from "react";
import { ScrollView, StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import { MarketplaceFilterChip, MarketplaceFilters } from "@/components/common/MarketplaceFilters";
import { MarketplaceSearchBar } from "@/components/common/MarketplaceSearchBar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { colors, spacing } from "@/theme";

export type MarketplaceExchangeType = "Tipo de intercambio" | "Venta" | "Intercambio" | "Ambos";

export interface MarketplaceSectionProps {
	resultCount?: string | number;

	search: string;
	onSearchChange: (value: string) => void;
	onSearch?: (value: string) => void;

	selectedSede: string;
	onSedeChange: (value: string) => void;

	exchangeType: MarketplaceExchangeType;
	onExchangeTypeChange: (value: MarketplaceExchangeType) => void;

	style?: StyleProp<ViewStyle>;
}

const institutions = ["Selecciona una sede", "Lima Norte", "Lima Centro", "Lima Sur"];

const exchangeTypes: MarketplaceExchangeType[] = ["Tipo de intercambio", "Venta", "Intercambio", "Ambos"];

const sortOptions = ["Relevancia", "Más recientes", "Menor precio"];

export function MarketplaceSection({
	resultCount = 0,

	search,
	onSearchChange,
	onSearch,

	selectedSede,
	onSedeChange,

	exchangeType,
	onExchangeTypeChange,

	style,
}: MarketplaceSectionProps) {
	const { width } = useWindowDimensions();
	const isMobile = width < 768;

	const [sortValue, setSortValue] = useState(sortOptions[0]);
	const activeFilters: MarketplaceFilterChip[] = [];

	if (selectedSede && selectedSede !== "Selecciona una sede") {
		activeFilters.push({
			id: "institution",
			label: selectedSede,
		});
	}

	if (exchangeType && exchangeType !== "Tipo de intercambio") {
		activeFilters.push({
			id: "exchange",
			label: exchangeType,
		});
	}

	const removeFilter = (id: string) => {
		if (id === "institution") {
			onSedeChange("Selecciona una sede");
		}

		if (id === "exchange") {
			onExchangeTypeChange("Tipo de intercambio");
		}
	};

	const clearFilters = () => {
		onSedeChange("Selecciona una sede");

		onExchangeTypeChange("Tipo de intercambio");
	};

	return (
		<View style={[styles.section, isMobile && styles.mobileSection, style]}>
			<View style={styles.content}>
				<Breadcrumb
					items={[
						{ label: "Inicio" },
						{
							label: "Marketplace",
						},
						{
							label: "Productos",
						},
					]}
				/>

				<ScrollView
					horizontal={isMobile}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={isMobile ? styles.wideContent : undefined}
					style={styles.scroller}
				>
					<MarketplaceSearchBar
						searchValue={search}
						onSearchChange={onSearchChange}
						onSearchPress={() => onSearch?.(search)}
						institution={selectedSede}
						institutionOptions={institutions}
						onInstitutionChange={onSedeChange}
						exchangeType={exchangeType}
						exchangeTypeOptions={exchangeTypes}
						onExchangeChange={(value) => onExchangeTypeChange(value as MarketplaceExchangeType)}
					/>
				</ScrollView>

				<ScrollView
					horizontal={isMobile}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={isMobile ? styles.wideContent : undefined}
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
						onClearFilters={clearFilters}
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
