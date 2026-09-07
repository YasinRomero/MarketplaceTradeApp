import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { PublishProductSection } from "@/components/sections/PublishProduct/PublishProductSection";
import { TitlePublishSection } from "@/components/sections/PublishProduct/TitlePublishSection";
import { ScrollView, StyleSheet } from "react-native";

export default function HomeScreen() {
	return (
		<ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>
			<Header />
			<TitlePublishSection />
			<PublishProductSection />
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
