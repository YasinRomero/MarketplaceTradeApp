import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { CategorySection } from "@/components/sections/LandingPage/CategorySection";
import { FunctionsSection } from "@/components/sections/LandingPage/FunctionsSection";
import { HeroSection } from "@/components/sections/LandingPage/HeroSection";
import { PublishProductsSection } from "@/components/sections/LandingPage/PublishProductsSection";
import { ProceduresSection } from "@/components/sections/LandingPage/ProceduresSection";
import { ScrollView, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
    >
      <Header />
      <HeroSection />
      <CategorySection />
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
