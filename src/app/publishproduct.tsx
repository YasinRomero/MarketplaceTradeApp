import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { PublishProductSection } from "@/components/sections/PublishProduct/PublishProductSection";
import { TitlePublishSection } from "@/components/sections/PublishProduct/TitlePublishSection";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

export default function HomeScreen() {
	const { productId } = useLocalSearchParams<{ productId?: string }>();
	const parsedProductId = productId ? Number(productId) : undefined;
	const isValidProductId = parsedProductId !== undefined && Number.isInteger(parsedProductId) && parsedProductId > 0;

	return (
		<ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer} stickyHeaderIndices={[0]}>
			<Header />
			<TitlePublishSection />
			<PublishProductSection productId={isValidProductId ? parsedProductId : undefined} />
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
