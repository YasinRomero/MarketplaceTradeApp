import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { PublicationsSection } from "@/components/sections/Publications/PublicationsSection";
import { ScrollView, StyleSheet } from "react-native";

export default function PublicationsScreen() {
	return (
		<ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer} stickyHeaderIndices={[0]}>
			<Header />
			<PublicationsSection />
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
