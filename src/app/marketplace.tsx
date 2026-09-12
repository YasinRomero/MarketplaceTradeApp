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
			/>
			<MarketplaceProductsSection selectedSede={selectedSede === "Selecciona una sede" ? null : selectedSede} />
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
