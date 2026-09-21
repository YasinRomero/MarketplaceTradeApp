import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { OperationsSection } from "@/components/sections/Operations/OperationsSection";
import { ScrollView, StyleSheet } from "react-native";

export default function OperationsScreen() {
	return (
		<ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer} stickyHeaderIndices={[0]}>
			<Header />
			<OperationsSection />
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
