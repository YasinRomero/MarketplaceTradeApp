import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { CategorySection } from "@/components/sections/LandingPage/CategorySection";
import { FunctionsSection } from "@/components/sections/LandingPage/FunctionsSection";
import { HeroSection } from "@/components/sections/LandingPage/HeroSection";
import { ProceduresSection } from "@/components/sections/LandingPage/ProceduresSection";
import { PublishProductsSection } from "@/components/sections/LandingPage/PublishProductsSection";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

export default function HomeScreen() {
	const router = useRouter();

	return (
		<ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer} stickyHeaderIndices={[0]}>
			<Header />
			<HeroSection searchBarProps={{ onSearchPress: () => router.push("/marketplace") }} />
			<CategorySection onCategoryPress={() => router.push("/marketplace")} />
			<PublishProductsSection />
			<FunctionsSection />
			<ProceduresSection />
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
