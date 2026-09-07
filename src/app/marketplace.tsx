import { ScrollView, StyleSheet } from "react-native";

import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { MarketplaceProductsSection } from "@/components/sections/Marketplace/MarketplaceProductsSection";
import { MarketplaceSection } from "@/components/sections/Marketplace/MarketplaceSection";

export default function MarketplaceScreen() {
	return (
		<ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>
			<Header />
			<MarketplaceSection />
			<MarketplaceProductsSection />
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
