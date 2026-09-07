import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { ProductDetailSection } from "@/components/sections/ProductDetail/ProductDetailSection";

export default function ProductDetailScreen() {
	const { id } = useLocalSearchParams<{ id?: string }>();
	const productId = Array.isArray(id) ? id[0] : id;

	return (
		<ScrollView
			style={styles.screen}
			contentContainerStyle={styles.contentContainer}
			stickyHeaderIndices={[0]}
		>
			<Header />
			<ProductDetailSection productId={productId} />
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
