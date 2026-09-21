import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { MarketplaceProductsSection } from "@/components/sections/Marketplace/MarketplaceProductsSection";
import { MarketplaceExchangeType, MarketplaceSection } from "@/components/sections/Marketplace/MarketplaceSection";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function MarketplaceScreen() {
	const [search, setSearch] = useState("");
	const [selectedSede, setSelectedSede] = useState("Selecciona una sede");
	const [exchangeType, setExchangeType] = useState<MarketplaceExchangeType>("Tipo de intercambio");
	const [sortValue, setSortValue] = useState("Relevancia");
	const [resultCount, setResultCount] = useState(0);

	return (
		<ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer} stickyHeaderIndices={[0]}>
			<Header />
			<MarketplaceSection
				search={search}
				onSearchChange={setSearch}
				onSearch={(value) => {
					setSearch(value);
				}}
				selectedSede={selectedSede}
				onSedeChange={setSelectedSede}
				exchangeType={exchangeType}
				onExchangeTypeChange={setExchangeType}
				sortValue={sortValue}
				onSortChange={setSortValue}
				resultCount={resultCount}
			/>
			<MarketplaceProductsSection
				searchValue={search}
				selectedSede={selectedSede === "Selecciona una sede" ? null : selectedSede}
				selectedModality={exchangeType === "Tipo de intercambio" ? null : exchangeType}
				sortValue={sortValue}
				onResultCountChange={setResultCount}
			/>
			<Footer />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	screen: {
		width: "100%",
		flex: 1,
	},

	contentContainer: {
		flexGrow: 1,
	},
});
