import { z } from "zod";

export const ChatConversationTypeSchema = z.enum(["propuesta", "intercambio", "venta"]);

export const ChatConversationReferenceSchema = z.object({
	type: ChatConversationTypeSchema,
	id: z.number().int().positive(),
});

export const ChatMessageSchema = z.object({
	id: z.number().int().positive(),
	exchangeProposalId: z.number().int().positive().nullable(),
	transactionId: z.number().int().positive().nullable(),
	senderId: z.number().int().positive(),
	content: z.string().trim().min(1).max(2000),
	sentAt: z.iso.datetime(),
});

// Inferencias
export type ChatConversationType = z.infer<typeof ChatConversationTypeSchema>;
export type ChatConversationReference = z.infer<typeof ChatConversationReferenceSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
