import { mockUsers } from "@/mocks/products";
import {
	Dispute,
	DisputeAssignmentSchema,
	DisputeEvidence,
	DisputeEvidenceSchema,
	DisputeInput,
	DisputeInputSchema,
	DisputeResolutionInput,
	DisputeResolutionSchema,
	DisputeSchema,
} from "@/schemas/dispute";
import {
	DISPUTE_TOKEN,
	getExchangeTransactionById,
	getOperationEvidenceReference,
	getOperationNow,
	getSaleTransactionById,
	updateExchangeTransactionStatus,
	updateSaleTransactionStatus,
	withOperationLock,
} from "@/services/exchangeProposalService";
import { DisputeOperationContext } from "@/types/dispute";

let nextDisputeId = 1;
let nextEvidenceId = 1;
let disputes: Dispute[] = [];
let evidences: DisputeEvidence[] = [];

function assertModerator(userId: number): void {
	const moderator = mockUsers.find((user) => user.id === userId);
	if (!moderator || moderator.role !== "moderador" || !moderator.isActive)
		throw new Error("Solo un moderador activo puede gestionar disputas.");
}

function hasDelivery(
	transaction:
		| Awaited<ReturnType<typeof getExchangeTransactionById>>
		| Awaited<ReturnType<typeof getSaleTransactionById>>,
): boolean {
	if (!transaction) return false;

	if ("sellerId" in transaction)
		return Boolean(
			transaction.sellerConfirmedAt || transaction.buyerConfirmedAt || transaction.deliveryCompletedAt,
		);

	return Boolean(
		transaction.publisherConfirmedAt || transaction.requesterConfirmedAt || transaction.exchangeCompletedAt,
	);
}

function isParticipant(
	transaction:
		| NonNullable<Awaited<ReturnType<typeof getExchangeTransactionById>>>
		| NonNullable<Awaited<ReturnType<typeof getSaleTransactionById>>>,
	userId: number,
): boolean {
	return "sellerId" in transaction
		? transaction.sellerId === userId || transaction.buyerId === userId
		: transaction.publisherId === userId || transaction.requesterId === userId;
}

function isWithinConformityWindow(
	transaction:
		| NonNullable<Awaited<ReturnType<typeof getExchangeTransactionById>>>
		| NonNullable<Awaited<ReturnType<typeof getSaleTransactionById>>>,
): boolean {
	if (transaction.status !== "realizada") return true;
	if (!transaction.confirmationDeadlineAt) return false;
	return getOperationNow().getTime() <= new Date(transaction.confirmationDeadlineAt).getTime();
}

export async function openDispute(input: DisputeInput): Promise<Dispute> {
	return withOperationLock(async () => {
		const parsed = DisputeInputSchema.parse(input);
		const transaction =
			parsed.type === "venta"
				? await getSaleTransactionById(parsed.transactionId)
				: await getExchangeTransactionById(parsed.transactionId);

		if (!transaction) throw new Error("La operación no existe.");

		if (!isParticipant(transaction, parsed.claimantId))
			throw new Error("Solo un participante puede registrar una incidencia.");

		if (!hasDelivery(transaction)) throw new Error("La incidencia requiere al menos una entrega registrada.");

		if (!isWithinConformityWindow(transaction)) throw new Error("El plazo de reclamo de la operación ya venció.");

		if (
			transaction.status === "disputa" ||
			disputes.some((dispute) => dispute.transactionId === parsed.transactionId && dispute.status !== "resuelta")
		) {
			throw new Error("La operación ya tiene una disputa abierta.");
		}

		if (transaction.status !== "activa" && transaction.status !== "realizada")
			throw new Error("La operación no admite abrir una disputa en su estado actual.");

		const now = getOperationNow().toISOString();
		const dispute = DisputeSchema.parse({
			id: nextDisputeId++,
			transactionId: parsed.transactionId,
			claimantId: parsed.claimantId,
			moderatorId: null,
			reason: parsed.reason,
			status: "abierta",
			decision: null,
			resolution: null,
			requiresProductReturn: false,
			createdAt: now,
			resolvedAt: null,
		});

		disputes = [...disputes, dispute];
		evidences = [
			...evidences,
			...parsed.evidences.map((evidence) =>
				DisputeEvidenceSchema.parse({
					...evidence,
					id: nextEvidenceId++,
					disputeId: dispute.id,
					userId: parsed.claimantId,
					createdAt: now,
				}),
			),
		];

		if (parsed.type === "venta") await updateSaleTransactionStatus(parsed.transactionId, "disputa", DISPUTE_TOKEN);
		else await updateExchangeTransactionStatus(parsed.transactionId, "disputa", DISPUTE_TOKEN);

		return dispute;
	});
}

export async function listDisputesForUser(userId: number): Promise<Dispute[]> {
	return disputes.filter((dispute) => dispute.claimantId === userId).map((dispute) => DisputeSchema.parse(dispute));
}

export async function listDisputeEvidences(disputeId: number): Promise<DisputeEvidence[]> {
	return evidences
		.filter((evidence) => evidence.disputeId === disputeId)
		.map((evidence) => DisputeEvidenceSchema.parse(evidence));
}

export async function listDisputesForModerator(moderatorId: number): Promise<Dispute[]> {
	assertModerator(moderatorId);
	return disputes.map((dispute) => DisputeSchema.parse(dispute));
}

export async function getDisputeById(disputeId: number): Promise<Dispute | null> {
	const dispute = disputes.find((candidate) => candidate.id === disputeId);
	return dispute ? DisputeSchema.parse(dispute) : null;
}

export async function getDisputeForTransaction(transactionId: number): Promise<Dispute | null> {
	const dispute = disputes.find((candidate) => candidate.transactionId === transactionId);
	return dispute ? DisputeSchema.parse(dispute) : null;
}

export async function getDisputeOperationContext(disputeId: number): Promise<DisputeOperationContext | null> {
	const dispute = await getDisputeById(disputeId);

	if (!dispute) return null;

	const exchange = await getExchangeTransactionById(dispute.transactionId);

	if (exchange) {
		return {
			type: "intercambio",
			status: exchange.status,
			participantIds: [exchange.publisherId, exchange.requesterId],
			productIds: [exchange.publishedProductId, exchange.offeredProductId],
			price: null,
			referenceValues: [exchange.publishedProductValue, exchange.offeredProductValue],
			additionalAmount: exchange.additionalAmount,
			evidence: await getOperationEvidenceReference("intercambio", exchange.id),
		};
	}

	const sale = await getSaleTransactionById(dispute.transactionId);

	if (!sale) return null;

	return {
		type: "venta",
		status: sale.status,
		participantIds: [sale.sellerId, sale.buyerId],
		productIds: [sale.soldProductId],
		price: sale.price,
		referenceValues: [],
		additionalAmount: 0,
		evidence: await getOperationEvidenceReference("venta", sale.id),
	};
}

export async function assignDisputeToModerator(input: { disputeId: number; moderatorId: number }): Promise<Dispute> {
	return withOperationLock(async () => {
		const parsed = DisputeAssignmentSchema.parse(input);
		assertModerator(parsed.moderatorId);

		const index = disputes.findIndex((dispute) => dispute.id === parsed.disputeId);
		if (index < 0) throw new Error("La disputa no existe.");

		const current = disputes[index];
		if (current.status !== "abierta") throw new Error("Solo una disputa abierta puede asignarse.");

		const updated = DisputeSchema.parse({
			...current,
			moderatorId: parsed.moderatorId,
			status: "en_revision",
		});

		disputes = disputes.map((dispute, disputeIndex) => (disputeIndex === index ? updated : dispute));

		return updated;
	});
}

export async function resolveDispute(input: DisputeResolutionInput): Promise<Dispute> {
	return withOperationLock(async () => {
		const parsed = DisputeResolutionSchema.parse(input);
		assertModerator(parsed.moderatorId);

		const index = disputes.findIndex((dispute) => dispute.id === parsed.disputeId);
		if (index < 0) throw new Error("La disputa no existe.");

		const current = disputes[index];
		if (current.status !== "en_revision") throw new Error("La disputa debe estar asignada y en revisión.");

		if (current.moderatorId !== parsed.moderatorId) throw new Error("La disputa está asignada a otro moderador.");

		const updated = DisputeSchema.parse({
			...current,
			status: "resuelta",
			decision: parsed.decision,
			resolution: parsed.resolution,
			requiresProductReturn: parsed.requiresProductReturn,
			resolvedAt: getOperationNow().toISOString(),
		});

		disputes = disputes.map((dispute, disputeIndex) => (disputeIndex === index ? updated : dispute));

		return updated;
	});
}
