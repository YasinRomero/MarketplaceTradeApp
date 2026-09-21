import { ChatConversationReference, ChatMessage } from "@/schemas/chat";
import { listChatConversationsForUser, listMessagesForConversation, sendMessage } from "@/services/chatService";
import { create } from "zustand";

interface ChatStore {
	conversations: ChatConversationReference[];
	messages: ChatMessage[];
	isLoading: boolean;
	error: string | null;
	loadConversations: (userId: number) => Promise<void>;
	loadMessages: (reference: ChatConversationReference, userId: number) => Promise<void>;
	send: (reference: ChatConversationReference, userId: number, content: string) => Promise<ChatMessage | null>;
}

export const useChatStore = create<ChatStore>((set) => ({
	conversations: [],
	messages: [],
	isLoading: false,
	error: null,

	loadConversations: async (userId) => {
		set({ isLoading: true, error: null });
		try {
			set({ conversations: await listChatConversationsForUser(userId), isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudieron cargar las conversaciones.",
			});
		}
	},

	loadMessages: async (reference, userId) => {
		set({ isLoading: true, error: null, messages: [] });
		try {
			set({ messages: await listMessagesForConversation(reference, userId), isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo cargar la conversación.",
			});
		}
	},

	send: async (reference, userId, content) => {
		set({ isLoading: true, error: null });
		try {
			const message = await sendMessage(reference, userId, content);
			set((state) => ({ messages: [...state.messages, message], isLoading: false }));
			return message;
		} catch (error) {
			set({ isLoading: false, error: error instanceof Error ? error.message : "No se pudo enviar el mensaje." });
			return null;
		}
	},
}));
