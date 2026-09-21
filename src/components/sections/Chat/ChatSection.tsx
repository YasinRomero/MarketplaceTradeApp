import { HeaderSections } from "@/components/common/HeaderSections";
import { InputTextArea } from "@/components/common/InputTextArea";
import { Message } from "@/components/common/Message";
import { ButtonOutline, ButtonRounded } from "@/components/ui/Button";
import { ChatConversationReference } from "@/schemas/chat";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { colors, radius, spacing, typography } from "@/theme";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export interface ChatSectionProps {
	reference?: ChatConversationReference;
}

export function ChatSection({ reference }: ChatSectionProps) {
	const router = useRouter();
	const currentUser = useAuthStore((state) => state.currentUser);
	const { conversations, messages, isLoading, error, loadConversations, loadMessages, send } = useChatStore();
	const [draft, setDraft] = useState("");
	const [feedback, setFeedback] = useState<string | null>(null);
	const referenceType = reference?.type;
	const referenceId = reference?.id;

	useEffect(() => {
		if (!currentUser) return;
		if (referenceType && referenceId !== undefined)
			loadMessages({ type: referenceType, id: referenceId }, currentUser.id);
		else loadConversations(currentUser.id);
	}, [currentUser, referenceId, referenceType, loadConversations, loadMessages]);

	const handleSend = async () => {
		if (!currentUser || !reference) return;
		const sent = await send(reference, currentUser.id, draft);
		if (sent) {
			setDraft("");
			setFeedback("Mensaje enviado.");
		}
	};

	if (!currentUser) {
		return (
			<View style={styles.section}>
				<Message
					title="Inicia sesión para usar el chat"
					message="Las conversaciones pertenecen a cuentas institucionales participantes."
				/>
			</View>
		);
	}

	return (
		<View style={styles.section}>
			<View style={styles.content}>
				<HeaderSections
					title="Chat"
					description="Coordina propuestas y transacciones únicamente con la otra persona participante."
					size="2xl"
				/>
				{isLoading && (
					<Message title="Cargando conversación" message="Estamos consultando el historial mock." />
				)}
				{error && !isLoading && <Message title="No se pudo completar la acción" message={error} />}
				{feedback && <Message title="Chat actualizado" message={feedback} />}
				{!reference ? (
					<View style={styles.group}>
						<Text style={styles.groupTitle}>Tus conversaciones</Text>
						{conversations.length === 0 && !isLoading ? (
							<Message message="Todavía no tienes solicitudes ni transacciones con conversación." />
						) : (
							conversations.map((conversation) => (
								<Pressable
									key={`${conversation.type}-${conversation.id}`}
									style={styles.conversationCard}
									onPress={() => router.push(`/chat?type=${conversation.type}&id=${conversation.id}`)}
								>
									<Text style={styles.conversationTitle}>
										{conversation.type === "propuesta"
											? "Solicitud de intercambio"
											: conversation.type === "intercambio"
												? "Transacción de intercambio"
												: "Transacción de venta"}
									</Text>
									<Text style={styles.detailText}>Referencia #{conversation.id}</Text>
								</Pressable>
							))
						)}
					</View>
				) : (
					<View style={styles.group}>
						<View style={styles.chatHeader}>
							<View>
								<Text style={styles.groupTitle}>
									{reference.type === "propuesta"
										? "Solicitud de intercambio"
										: "Conversación de transacción"}
								</Text>
								<Text style={styles.detailText}>
									Referencia #{reference.id} · El historial se conserva al cerrar.
								</Text>
							</View>
							<ButtonOutline onPress={() => router.replace("/chat")}>Volver</ButtonOutline>
						</View>
						<View style={styles.messagesBox}>
							{messages.length === 0 && !isLoading && (
								<Message message="No hay mensajes todavía. Inicia la coordinación." />
							)}
							{messages.map((message) => (
								<View
									key={message.id}
									style={[
										styles.messageBubble,
										message.senderId === currentUser.id && styles.ownMessage,
									]}
								>
									<Text style={styles.messageAuthor}>
										{message.senderId === currentUser.id
											? "Tú"
											: `Participante #${message.senderId}`}
									</Text>
									<Text style={styles.messageText}>{message.content}</Text>
									<Text style={styles.messageDate}>{new Date(message.sentAt).toLocaleString()}</Text>
								</View>
							))}
						</View>
						<InputTextArea
							label="Nuevo mensaje"
							value={draft}
							onChangeText={setDraft}
							placeholder="Escribe una coordinación..."
							maxLength={2000}
						/>
						<ButtonRounded disabled={isLoading || !draft.trim()} onPress={() => handleSend()}>
							Enviar mensaje
						</ButtonRounded>
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	section: { width: "100%", padding: spacing["2xl"], flex: 1 },
	content: { width: "100%", maxWidth: 1232, alignSelf: "center", gap: spacing.lg },
	group: { gap: spacing.md },
	groupTitle: {
		fontFamily: typography.family,
		fontSize: typography.size.lg,
		lineHeight: typography.lineHeight.xl,
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},
	conversationCard: {
		padding: spacing.lg,
		gap: spacing.xs,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.lg,
	},
	conversationTitle: {
		fontFamily: typography.family,
		fontSize: typography.size.md,
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},
	detailText: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.lg,
		color: colors.text.secondary,
	},
	chatHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing.md },
	messagesBox: {
		gap: spacing.sm,
		padding: spacing.md,
		minHeight: 160,
		backgroundColor: colors.background.subtle,
		borderRadius: radius.md,
	},
	messageBubble: {
		alignSelf: "flex-start",
		maxWidth: "80%",
		padding: spacing.md,
		gap: spacing.xs,
		backgroundColor: colors.background.surface,
		borderRadius: radius.md,
		borderWidth: 1,
		borderColor: colors.border.default,
	},
	ownMessage: { alignSelf: "flex-end", backgroundColor: colors.card.red.background },
	messageAuthor: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		fontWeight: typography.weight.bold,
		color: colors.text.secondary,
	},
	messageText: { fontFamily: typography.family, fontSize: typography.size.sm, color: colors.text.primary },
	messageDate: { fontFamily: typography.family, fontSize: typography.size.xs, color: colors.text.muted },
});
