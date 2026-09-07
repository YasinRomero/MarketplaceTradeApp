import { ScrollView, StyleSheet } from "react-native";

import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { AuthenticationSection } from "@/components/sections/Authentication/AuthenticationSection";

export default function AuthScreen() {
	return (
		<ScrollView
			style={styles.screen}
			contentContainerStyle={styles.contentContainer}
			stickyHeaderIndices={[0]}
		>
			<Header />
			<AuthenticationSection />
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
