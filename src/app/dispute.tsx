import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { ResolveDisputeSection } from "@/components/sections/ResolveDispute/ResolveDisputeSection";
import { ScrollView, StyleSheet } from "react-native";

export default function DisputeScreen() {
	return (
		<ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer} stickyHeaderIndices={[0]}>
			<Header />
			<ResolveDisputeSection />
			<Footer />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	screen: { width: "100%", flex: 1 },
	contentContainer: { flexGrow: 1 },
});
