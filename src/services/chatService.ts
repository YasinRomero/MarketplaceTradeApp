import { mockUsers } from "@/mocks/products";
import { ChatConversationReference, ChatMessage, ChatMessageSchema } from "@/schemas/chat";
import { ExchangeProposal, ExchangeTransaction } from "@/schemas/exchange";
import { SaleTransaction } from "@/schemas/sales";
import {
	getExchangeTransactionById,
	getSaleTransactionById,
	listExchangeProposalsForUser,
	listExchangeTransactionsForUser,
	listSaleTransactionsForUser,
} from "@/services/exchangeProposalService";
import { getProductByIdForOperations } from "@/services/productService";

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 100));

let nextMessageId = 1;
let messages: ChatMessage[] = [];

function assertUser(userId: number): void {
	const user = mockUsers.find((candidate) => candidate.id === userId);
	if (!user || !user.isActive || user.role !== "usuario")
		throw new Error("Solo un usuario institucional activo puede consultar el chat.");
}

function assertMessageParticipant(
	reference: ChatConversationReference,
	userId: number,
	proposal?: ExchangeProposal,
	transaction?: ExchangeTransaction | SaleTransaction,
): void {
	const participantIds = proposal
		? [proposal.requesterId]
		: transaction && "publisherId" in transaction
			? [transaction.publisherId, transaction.requesterId]
			: transaction
				? [transaction.sellerId, transaction.buyerId]
				: [];

	if (proposal) participantIds.push(proposal.requesterId);

	if (!participantIds.includes(userId)) throw new Error("No tienes autorización para acceder a esta conversación.");

	if (reference.type === "propuesta" && proposal?.status !== "pendiente" && proposal?.status !== "aceptada") {
		return;
	}
}

function canSend(
	reference: ChatConversationReference,
	proposal?: ExchangeProposal,
	transaction?: ExchangeTransaction | SaleTransaction,
): boolean {
	if (reference.type === "propuesta") return proposal?.status === "pendiente" || proposal?.status === "aceptada";
	return transaction?.status !== "completada" && transaction?.status !== "cancelada";
}

async function resolveConversation(reference: ChatConversationReference, userId: number) {
	assertUser(userId);

	if (reference.id <= 0 || !Number.isInteger(reference.id))
		throw new Error("La conversación solicitada no es válida.");

	if (reference.type === "propuesta") {
		const proposals = await listExchangeProposalsForUser(userId);
		const proposal = proposals.find((candidate) => candidate.id === reference.id);
		if (!proposal) throw new Error("La conversación no existe o no tienes autorización para verla.");
		const product = await getProductByIdForOperations(proposal.requestedProductId);
		if (!product || (product.ownerId !== userId && proposal.requesterId !== userId)) {
			throw new Error("No tienes autorización para acceder a esta conversación.");
		}
		return { proposal, transaction: undefined };
	}

	const transaction =
		reference.type === "intercambio"
			? await getExchangeTransactionById(reference.id)
			: await getSaleTransactionById(reference.id);

	if (!transaction) throw new Error("La conversación no existe o no tienes autorización para verla.");

	assertMessageParticipant(reference, userId, undefined, transaction);

	return { proposal: undefined, transaction };
}

export async function listMessagesForConversation(
	reference: ChatConversationReference,
	userId: number,
): Promise<ChatMessage[]> {
	await wait();

	const { proposal } = await resolveConversation(reference, userId);

	if (proposal) {
		const product = await getProductByIdForOperations(proposal.requestedProductId);
		if (!product || (product.ownerId !== userId && proposal.requesterId !== userId))
			throw new Error("No tienes autorización para acceder a esta conversación.");
	}

	return messages
		.filter((message) =>
			reference.type === "propuesta"
				? message.exchangeProposalId === reference.id
				: message.transactionId === reference.id,
		)
		.map((message) => ChatMessageSchema.parse(message));
}

export async function sendMessage(
	reference: ChatConversationReference,
	senderId: number,
	content: string,
): Promise<ChatMessage> {
	await wait();

	const normalized = content.trim();

	if (!normalized) throw new Error("Escribe un mensaje antes de enviarlo.");

	const { proposal, transaction } = await resolveConversation(reference, senderId);

	if (proposal) {
		const product = await getProductByIdForOperations(proposal.requestedProductId);
		if (!product || (product.ownerId !== senderId && proposal.requesterId !== senderId))
			throw new Error("No tienes autorización para enviar mensajes.");
	}

	if (!canSend(reference, proposal, transaction))
		throw new Error("Esta conversación está cerrada y solo conserva su historial.");

	const message = ChatMessageSchema.parse({
		id: nextMessageId++,
		exchangeProposalId: reference.type === "propuesta" ? reference.id : null,
		transactionId: reference.type === "propuesta" ? null : reference.id,
		senderId,
		content: normalized,
		sentAt: new Date().toISOString(),
	});

	messages = [...messages, message];

	return message;
}

export async function listChatConversationsForUser(userId: number): Promise<ChatConversationReference[]> {
	await wait();

	assertUser(userId);

	const [proposals, exchanges, sales] = await Promise.all([
		listExchangeProposalsForUser(userId),
		listExchangeTransactionsForUser(userId),
		listSaleTransactionsForUser(userId),
	]);

	return [
		...proposals.map(({ id }) => ({ type: "propuesta" as const, id })),
		...exchanges.map(({ id }) => ({ type: "intercambio" as const, id })),
		...sales.map(({ id }) => ({ type: "venta" as const, id })),
	];
}

export const listConversationMessages = listMessagesForConversation;
export const sendChatMessage = sendMessage;
