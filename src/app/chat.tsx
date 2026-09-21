import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { ChatSection } from "@/components/sections/Chat/ChatSection";
import { ChatConversationType } from "@/schemas/chat";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

export default function ChatScreen() {
	const params = useLocalSearchParams<{ type?: string; id?: string }>();

	const type = Array.isArray(params.type) ? params.type[0] : params.type;
	const id = Array.isArray(params.id) ? params.id[0] : params.id;
	const reference =
		type && id && ["propuesta", "intercambio", "venta"].includes(type) && Number.isInteger(Number(id))
			? { type: type as ChatConversationType, id: Number(id) }
			: undefined;

	return (
		<ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer} stickyHeaderIndices={[0]}>
			<Header />
			<ChatSection reference={reference} />
			<Footer />
		</ScrollView>
	);
}

const styles = StyleSheet.create({ screen: { width: "100%", flex: 1 }, contentContainer: { flexGrow: 1 } });
