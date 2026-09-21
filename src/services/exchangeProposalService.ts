import { mockUsers } from "@/mocks/products";
import {
	ExchangeProposal,
	ExchangeProposalInput,
	ExchangeProposalInputSchema,
	ExchangeProposalSchema,
	ExchangeTransaction,
	ExchangeTransactionSchema,
} from "@/schemas/exchange";
import { OperationType } from "@/schemas/operation";
import { Product, ProductDraft } from "@/schemas/product";
import { SaleTransaction, SaleTransactionSchema } from "@/schemas/sales";
import {
	getProductById,
	getProductByIdForOperations,
	listProductsByOwner,
	listProductsForOperations,
	reserveProduct,
	reserveProducts,
} from "@/services/productService";
import { OperationEvidenceReference } from "@/types/dispute";

let proposals: ExchangeProposal[] = [];
let transactions: ExchangeTransaction[] = [];
let saleTransactions: SaleTransaction[] = [];
let operationLock: Promise<void> = Promise.resolve();
const proposalReferences = new Map<
	number,
	{
		requestedMedia: Product["media"];
		offeredMedia: Product["media"];
		requestedReferenceValue: number | null;
		offeredReferenceValue: number | null;
	}
>();
const saleReferences = new Map<number, { media: Product["media"]; price: number }>();

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 120));
let operationNowProvider = () => new Date();
const operationNow = () => operationNowProvider();

function assertOperationalUser(userId: number): void {
	const user = mockUsers.find((candidate) => candidate.id === userId);
	if (!user || !user.isActive || user.role !== "usuario") {
		throw new Error("Solo un participante que sea usuario institucional activo puede operar.");
	}
}

export function getOperationNow(): Date {
	return operationNow();
}

export function setOperationClockForTests(provider: (() => Date) | null) {
	operationNowProvider = provider ?? (() => new Date());
}

export const FINANCIAL_ACTIVATION_TOKEN = Symbol("financial-activation");
export const CANCELLATION_TOKEN = Symbol("cancellation");
export const DELIVERY_TOKEN = Symbol("delivery");
export const DISPUTE_TOKEN = Symbol("dispute");
export const CLOSURE_TOKEN = Symbol("closure");

const allowedOperationTransitions: Record<ExchangeTransaction["status"], readonly ExchangeTransaction["status"][]> = {
	pendiente_respaldo: ["pendiente_respaldo", "activa", "cancelacion_pendiente"],
	activa: ["activa", "realizada", "cancelacion_pendiente", "disputa"],
	realizada: ["realizada", "disputa", "completada"],
	completada: ["completada"],
	cancelacion_pendiente: ["cancelacion_pendiente", "cancelada"],
	cancelada: ["cancelada"],
	disputa: ["disputa", "completada"],
};

export function canTransitionOperationStatus(
	current: ExchangeTransaction["status"],
	target: ExchangeTransaction["status"],
): boolean {
	return allowedOperationTransitions[current].includes(target);
}

function assertOperationStatusTransition(
	current: ExchangeTransaction["status"],
	target: ExchangeTransaction["status"],
): void {
	if (!canTransitionOperationStatus(current, target))
		throw new Error(`Transición de operación no permitida: ${current} → ${target}.`);
}

export async function withOperationLock<T>(operation: () => Promise<T>): Promise<T> {
	const queued = operationLock.then(operation);
	operationLock = queued.then(
		() => undefined,
		() => undefined,
	);
	return queued;
}

const isExchangeAvailable = (product: Product | ProductDraft): product is Product =>
	product.status === "activo" && (product.mode === "intercambio" || product.mode === "ambas");

export async function listAvailableExchangeProducts(ownerId: number): Promise<Product[]> {
	await wait();
	const ownedProducts = await listProductsByOwner(ownerId);
	return ownedProducts.filter(isExchangeAvailable);
}

async function createExchangeProposalInternal(input: ExchangeProposalInput): Promise<ExchangeProposal> {
	await wait();

	const parsed = ExchangeProposalInputSchema.parse(input);
	assertOperationalUser(parsed.requesterId);

	if (parsed.requestedProductId === parsed.offeredProductId)
		throw new Error("Selecciona un producto diferente al producto solicitado.");

	const requestedProduct = await getProductById(parsed.requestedProductId);
	if (!requestedProduct) throw new Error("El producto solicitado ya no está disponible.");

	if (!isExchangeAvailable(requestedProduct))
		throw new Error("El producto solicitado no admite propuestas de intercambio.");

	if (requestedProduct.ownerId === parsed.requesterId)
		throw new Error("No puedes proponer un intercambio con un producto propio.");

	const offeredProducts = await listProductsByOwner(parsed.requesterId);
	const offeredProduct = offeredProducts.find((product) => product.id === parsed.offeredProductId);

	if (!offeredProduct || offeredProduct.ownerId !== parsed.requesterId)
		throw new Error("El producto ofrecido no pertenece al usuario.");

	if (!isExchangeAvailable(offeredProduct))
		throw new Error("El producto ofrecido debe estar activo y disponible para intercambio.");

	const duplicate = proposals.some(
		(proposal) =>
			proposal.status === "pendiente" &&
			proposal.requesterId === parsed.requesterId &&
			proposal.requestedProductId === parsed.requestedProductId &&
			proposal.offeredProductId === parsed.offeredProductId,
	);

	if (duplicate) throw new Error("Ya existe una propuesta pendiente para estos productos.");

	const now = operationNow().toISOString();
	const proposal = ExchangeProposalSchema.parse({
		id: Math.max(0, ...proposals.map((item) => item.id)) + 1,
		requestedProductId: parsed.requestedProductId,
		offeredProductId: parsed.offeredProductId,
		requesterId: parsed.requesterId,
		additionalAmount: parsed.additionalAmount,
		status: "pendiente",
		createdAt: now,
		updatedAt: null,
	});

	proposals = [...proposals, proposal];
	proposalReferences.set(proposal.id, {
		requestedMedia: requestedProduct.media.map((media) => ({ ...media })),
		offeredMedia: offeredProduct.media.map((media) => ({ ...media })),
		requestedReferenceValue: requestedProduct.referenceValue,
		offeredReferenceValue: offeredProduct.referenceValue,
	});

	return proposal;
}

export async function createExchangeProposal(input: ExchangeProposalInput): Promise<ExchangeProposal> {
	return withOperationLock(() => createExchangeProposalInternal(input));
}

export async function listExchangeProposalsForUser(userId: number): Promise<ExchangeProposal[]> {
	await wait();

	const matchingProposals: ExchangeProposal[] = [];

	for (const proposal of proposals) {
		const requestedProduct = await getProductByIdForOperations(proposal.requestedProductId);
		if (proposal.requesterId === userId || requestedProduct?.ownerId === userId)
			matchingProposals.push(ExchangeProposalSchema.parse(proposal));
	}

	return matchingProposals;
}

export async function listExchangeProposalProducts(): Promise<Product[]> {
	return listProductsForOperations();
}

async function acceptExchangeProposalInternal(proposalId: number, ownerId: number): Promise<ExchangeTransaction> {
	await wait();
	assertOperationalUser(ownerId);
	const proposal = proposals.find((candidate) => candidate.id === proposalId);
	if (!proposal) throw new Error("La propuesta no existe.");
	if (proposal.status !== "pendiente") throw new Error("La propuesta ya no está pendiente.");

	const publishedProduct = await getProductByIdForOperations(proposal.requestedProductId);
	const offeredProduct = await getProductByIdForOperations(proposal.offeredProductId);

	if (!publishedProduct || publishedProduct.ownerId !== ownerId)
		throw new Error("No tienes autorización para aceptar esta propuesta.");

	if (!offeredProduct || offeredProduct.ownerId !== proposal.requesterId)
		throw new Error("El producto ofrecido ya no pertenece al solicitante.");

	if (publishedProduct.ownerId === offeredProduct.ownerId)
		throw new Error("Los productos deben pertenecer a usuarios diferentes.");

	if (!isExchangeAvailable(publishedProduct) || !isExchangeAvailable(offeredProduct))
		throw new Error("Ambos productos deben continuar activos y disponibles para intercambio.");

	const now = operationNow().toISOString();
	const transaction = ExchangeTransactionSchema.parse({
		id: Math.max(0, ...transactions.map((item) => item.id), ...saleTransactions.map((item) => item.id)) + 1,
		exchangeProposalId: proposal.id,
		publishedProductId: publishedProduct.id,
		offeredProductId: offeredProduct.id,
		publisherId: publishedProduct.ownerId,
		requesterId: proposal.requesterId,
		meetingSiteId: publishedProduct.siteId,
		publishedProductValue:
			proposalReferences.get(proposal.id)?.requestedReferenceValue ?? publishedProduct.referenceValue ?? 0,
		offeredProductValue:
			proposalReferences.get(proposal.id)?.offeredReferenceValue ?? offeredProduct.referenceValue ?? 0,
		additionalAmount: proposal.additionalAmount,
		commissionPerParticipant: 2.5,
		status: "pendiente_respaldo",
		meetingAt: null,
		exchangeCompletedAt: null,
		publisherConfirmedAt: null,
		requesterConfirmedAt: null,
		confirmationDeadlineAt: null,
		publisherConformityAt: null,
		requesterConformityAt: null,
		publisherConformitySource: null,
		requesterConformitySource: null,
		cancellationRequestedById: null,
		cancellationRequestedAt: null,
		cancellationReason: null,
		cancelledAt: null,
		completedAt: null,
		createdAt: now,
		updatedAt: null,
	});

	await reserveProducts([publishedProduct.id, offeredProduct.id]);

	proposals = proposals.map((candidate) => {
		if (candidate.id === proposal.id) return { ...candidate, status: "aceptada", updatedAt: now };
		if (
			candidate.status === "pendiente" &&
			(candidate.requestedProductId === publishedProduct.id ||
				candidate.offeredProductId === publishedProduct.id ||
				candidate.requestedProductId === offeredProduct.id ||
				candidate.offeredProductId === offeredProduct.id)
		) {
			return { ...candidate, status: "rechazada", updatedAt: now };
		}
		return candidate;
	});

	transactions = [...transactions, transaction];

	return transaction;
}

export async function acceptExchangeProposal(proposalId: number, ownerId: number): Promise<ExchangeTransaction> {
	return withOperationLock(() => acceptExchangeProposalInternal(proposalId, ownerId));
}

async function rejectExchangeProposalInternal(proposalId: number, ownerId: number): Promise<ExchangeProposal> {
	await wait();
	assertOperationalUser(ownerId);

	const proposal = proposals.find((candidate) => candidate.id === proposalId);
	if (!proposal) throw new Error("La propuesta no existe.");
	if (proposal.status !== "pendiente") throw new Error("La propuesta ya no está pendiente.");

	const requestedProduct = await getProductByIdForOperations(proposal.requestedProductId);
	if (!requestedProduct || requestedProduct.ownerId !== ownerId)
		throw new Error("No tienes autorización para rechazar esta propuesta.");

	const rejected = { ...proposal, status: "rechazada" as const, updatedAt: new Date().toISOString() };
	proposals = proposals.map((candidate) => (candidate.id === proposal.id ? rejected : candidate));
	return rejected;
}

async function withdrawExchangeProposalInternal(proposalId: number, requesterId: number): Promise<ExchangeProposal> {
	await wait();
	assertOperationalUser(requesterId);

	const proposal = proposals.find((candidate) => candidate.id === proposalId);
	if (!proposal) throw new Error("La propuesta no existe.");
	if (proposal.requesterId !== requesterId) throw new Error("Solo el ofertante puede retirar esta propuesta.");
	if (proposal.status !== "pendiente") throw new Error("Solo se puede retirar una propuesta pendiente.");

	const cancelled = { ...proposal, status: "cancelada" as const, updatedAt: new Date().toISOString() };
	proposals = proposals.map((candidate) => (candidate.id === proposal.id ? cancelled : candidate));

	return cancelled;
}

export async function rejectExchangeProposal(proposalId: number, ownerId: number): Promise<ExchangeProposal> {
	return withOperationLock(() => rejectExchangeProposalInternal(proposalId, ownerId));
}

export async function withdrawExchangeProposal(proposalId: number, requesterId: number): Promise<ExchangeProposal> {
	return withOperationLock(() => withdrawExchangeProposalInternal(proposalId, requesterId));
}

export async function listExchangeTransactionsForUser(userId: number): Promise<ExchangeTransaction[]> {
	await wait();

	return transactions
		.filter((transaction) => transaction.publisherId === userId || transaction.requesterId === userId)
		.map((transaction) => ExchangeTransactionSchema.parse(transaction));
}

async function createSaleTransactionInternal(productId: number, buyerId: number): Promise<SaleTransaction> {
	await wait();
	assertOperationalUser(buyerId);

	const product = await getProductByIdForOperations(productId);
	if (!product || product.status !== "activo") throw new Error("El producto ya no está disponible.");
	if (product.mode !== "venta" && product.mode !== "ambas")
		throw new Error("Este producto no está disponible para compra directa.");

	if (product.ownerId === buyerId) throw new Error("No puedes comprar tu propio producto.");
	if (product.salePrice === null) throw new Error("El producto no tiene un precio de venta válido.");

	const commission = Math.round(product.salePrice * 0.06 * 100) / 100;
	const now = operationNow().toISOString();
	const transaction = SaleTransactionSchema.parse({
		id: Math.max(0, ...transactions.map((item) => item.id), ...saleTransactions.map((item) => item.id)) + 1,
		soldProductId: product.id,
		sellerId: product.ownerId,
		buyerId,
		price: product.salePrice,
		commission,
		sellerAmount: Math.round((product.salePrice - commission) * 100) / 100,
		status: "pendiente_respaldo",
		sellerConfirmedAt: null,
		buyerConfirmedAt: null,
		deliveryCompletedAt: null,
		confirmationDeadlineAt: null,
		buyerConformityAt: null,
		buyerConformitySource: null,
		completedAt: null,
		createdAt: now,
		updatedAt: null,
	});

	await reserveProduct(product.id);

	saleReferences.set(transaction.id, {
		media: product.media.map((media) => ({ ...media })),
		price: product.salePrice,
	});

	proposals = proposals.map((proposal) =>
		proposal.status === "pendiente" &&
		(proposal.requestedProductId === product.id || proposal.offeredProductId === product.id)
			? { ...proposal, status: "rechazada" as const, updatedAt: now }
			: proposal,
	);

	saleTransactions = [...saleTransactions, transaction];

	return transaction;
}

export async function createSaleTransaction(productId: number, buyerId: number): Promise<SaleTransaction> {
	return withOperationLock(() => createSaleTransactionInternal(productId, buyerId));
}

export async function getExchangeTransactionById(transactionId: number): Promise<ExchangeTransaction | null> {
	await wait();
	const transaction = transactions.find((candidate) => candidate.id === transactionId);
	return transaction ? ExchangeTransactionSchema.parse(transaction) : null;
}

export async function getSaleTransactionById(transactionId: number): Promise<SaleTransaction | null> {
	await wait();
	const transaction = saleTransactions.find((candidate) => candidate.id === transactionId);
	return transaction ? SaleTransactionSchema.parse(transaction) : null;
}

export async function updateExchangeTransactionStatus(
	transactionId: number,
	status: ExchangeTransaction["status"],
	transitionToken?:
		| typeof FINANCIAL_ACTIVATION_TOKEN
		| typeof CANCELLATION_TOKEN
		| typeof DELIVERY_TOKEN
		| typeof DISPUTE_TOKEN
		| typeof CLOSURE_TOKEN,
): Promise<ExchangeTransaction> {
	const index = transactions.findIndex((candidate) => candidate.id === transactionId);

	if (index < 0) throw new Error("La transacción de intercambio no existe.");
	if (status === "activa" && transitionToken !== FINANCIAL_ACTIVATION_TOKEN)
		throw new Error("La activación requiere la confirmación financiera completa.");

	if (status === "realizada" && transitionToken !== DELIVERY_TOKEN)
		throw new Error("La entrega completa requiere confirmaciones de ambos participantes.");

	if (status === "disputa" && transitionToken !== DISPUTE_TOKEN)
		throw new Error("La apertura de una disputa requiere autorización del servicio de incidencias.");

	if (status === "completada" && transitionToken !== CLOSURE_TOKEN)
		throw new Error("El cierre requiere confirmación de todos los movimientos económicos.");

	if ((status === "cancelacion_pendiente" || status === "cancelada") && transitionToken !== CANCELLATION_TOKEN)
		throw new Error("La cancelación requiere autorización del servicio de cancelaciones.");

	assertOperationStatusTransition(transactions[index].status, status);

	const updated = ExchangeTransactionSchema.parse({
		...transactions[index],
		status,
		completedAt: status === "completada" ? new Date().toISOString() : transactions[index].completedAt,
		updatedAt: new Date().toISOString(),
	});

	transactions = transactions.map((candidate, candidateIndex) => (candidateIndex === index ? updated : candidate));

	return updated;
}

export async function updateSaleTransactionStatus(
	transactionId: number,
	status: SaleTransaction["status"],
	transitionToken?:
		| typeof FINANCIAL_ACTIVATION_TOKEN
		| typeof CANCELLATION_TOKEN
		| typeof DELIVERY_TOKEN
		| typeof DISPUTE_TOKEN
		| typeof CLOSURE_TOKEN,
): Promise<SaleTransaction> {
	const index = saleTransactions.findIndex((candidate) => candidate.id === transactionId);

	if (index < 0) throw new Error("La transacción de venta no existe.");
	if (status === "activa" && transitionToken !== FINANCIAL_ACTIVATION_TOKEN)
		throw new Error("La activación requiere la confirmación financiera completa.");

	if (status === "realizada" && transitionToken !== DELIVERY_TOKEN)
		throw new Error("La entrega completa requiere confirmaciones de ambos participantes.");

	if (status === "disputa" && transitionToken !== DISPUTE_TOKEN)
		throw new Error("La apertura de una disputa requiere autorización del servicio de incidencias.");

	if (status === "completada" && transitionToken !== CLOSURE_TOKEN)
		throw new Error("El cierre requiere confirmación de todos los movimientos económicos.");

	if ((status === "cancelacion_pendiente" || status === "cancelada") && transitionToken !== CANCELLATION_TOKEN)
		throw new Error("La cancelación requiere autorización del servicio de cancelaciones.");

	assertOperationStatusTransition(saleTransactions[index].status, status);

	const updated = SaleTransactionSchema.parse({
		...saleTransactions[index],
		status,
		completedAt: status === "completada" ? new Date().toISOString() : saleTransactions[index].completedAt,
		updatedAt: new Date().toISOString(),
	});

	saleTransactions = saleTransactions.map((candidate, candidateIndex) =>
		candidateIndex === index ? updated : candidate,
	);

	return updated;
}

export async function listSaleTransactionsForUser(userId: number): Promise<SaleTransaction[]> {
	await wait();
	return saleTransactions
		.filter((transaction) => transaction.sellerId === userId || transaction.buyerId === userId)
		.map((transaction) => SaleTransactionSchema.parse(transaction));
}

export async function registerOperationDelivery(
	type: OperationType,
	transactionId: number,
	userId: number,
): Promise<ExchangeTransaction | SaleTransaction> {
	return withOperationLock(async () => {
		await wait();

		if (type === "intercambio") {
			const transaction = transactions.find((candidate) => candidate.id === transactionId);

			if (!transaction) throw new Error("La operación de intercambio no existe.");
			if (transaction.status !== "activa")
				throw new Error("Solo una operación activa admite registrar entregas.");

			const role =
				userId === transaction.publisherId
					? "publisher"
					: userId === transaction.requesterId
						? "requester"
						: null;

			if (!role) throw new Error("Solo un participante puede registrar la entrega.");
			assertOperationalUser(userId);

			if (
				(role === "publisher" && transaction.publisherConfirmedAt) ||
				(role === "requester" && transaction.requesterConfirmedAt)
			) {
				throw new Error("Ya registraste la entrega de esta operación.");
			}

			const now = operationNow().toISOString();
			const updated = ExchangeTransactionSchema.parse({
				...transaction,
				publisherConfirmedAt: role === "publisher" ? now : transaction.publisherConfirmedAt,
				requesterConfirmedAt: role === "requester" ? now : transaction.requesterConfirmedAt,
				exchangeCompletedAt:
					(role === "publisher" ? true : Boolean(transaction.publisherConfirmedAt)) &&
					(role === "requester" ? true : Boolean(transaction.requesterConfirmedAt))
						? now
						: null,
				confirmationDeadlineAt:
					(role === "publisher" ? true : Boolean(transaction.publisherConfirmedAt)) &&
					(role === "requester" ? true : Boolean(transaction.requesterConfirmedAt))
						? new Date(new Date(now).getTime() + 24 * 60 * 60 * 1000).toISOString()
						: transaction.confirmationDeadlineAt,
				updatedAt: now,
			});

			transactions = transactions.map((candidate) => (candidate.id === transactionId ? updated : candidate));

			if (updated.exchangeCompletedAt)
				return updateExchangeTransactionStatus(transactionId, "realizada", DELIVERY_TOKEN);

			return updated;
		}

		const transaction = saleTransactions.find((candidate) => candidate.id === transactionId);
		if (!transaction) throw new Error("La operación de venta no existe.");
		if (transaction.status !== "activa") throw new Error("Solo una operación activa admite registrar entregas.");

		const role = userId === transaction.sellerId ? "seller" : userId === transaction.buyerId ? "buyer" : null;
		if (!role) throw new Error("Solo un participante puede registrar la entrega.");

		assertOperationalUser(userId);

		if (
			(role === "seller" && transaction.sellerConfirmedAt) ||
			(role === "buyer" && transaction.buyerConfirmedAt)
		) {
			throw new Error("Ya registraste la entrega de esta operación.");
		}

		const now = operationNow().toISOString();
		const updated = SaleTransactionSchema.parse({
			...transaction,
			sellerConfirmedAt: role === "seller" ? now : transaction.sellerConfirmedAt,
			buyerConfirmedAt: role === "buyer" ? now : transaction.buyerConfirmedAt,
			deliveryCompletedAt:
				(role === "seller" ? true : Boolean(transaction.sellerConfirmedAt)) &&
				(role === "buyer" ? true : Boolean(transaction.buyerConfirmedAt))
					? now
					: null,
			confirmationDeadlineAt:
				(role === "seller" ? true : Boolean(transaction.sellerConfirmedAt)) &&
				(role === "buyer" ? true : Boolean(transaction.buyerConfirmedAt))
					? new Date(new Date(now).getTime() + 24 * 60 * 60 * 1000).toISOString()
					: transaction.confirmationDeadlineAt,
			updatedAt: now,
		});

		saleTransactions = saleTransactions.map((candidate) => (candidate.id === transactionId ? updated : candidate));

		if (updated.deliveryCompletedAt) return updateSaleTransactionStatus(transactionId, "realizada", DELIVERY_TOKEN);

		return updated;
	});
}

function assertConformityDeadline(transaction: ExchangeTransaction | SaleTransaction): void {
	const deliveryCompleted =
		"sellerId" in transaction ? transaction.deliveryCompletedAt : transaction.exchangeCompletedAt;
	if (!transaction.confirmationDeadlineAt || !deliveryCompleted) {
		throw new Error("La entrega completa aún no inicia el plazo de conformidad.");
	}
}

function isConformityComplete(transaction: ExchangeTransaction | SaleTransaction): boolean {
	if ("sellerId" in transaction) return Boolean(transaction.buyerConformityAt);
	return Boolean(transaction.publisherConformityAt && transaction.requesterConformityAt);
}

export function hasCompleteConformity(transaction: ExchangeTransaction | SaleTransaction): boolean {
	return isConformityComplete(transaction);
}

export async function registerOperationConformity(
	type: OperationType,
	transactionId: number,
	userId: number,
): Promise<ExchangeTransaction | SaleTransaction> {
	return withOperationLock(async () => {
		await wait();
		if (type === "venta") {
			const transaction = saleTransactions.find((candidate) => candidate.id === transactionId);
			if (!transaction) throw new Error("La operación no existe.");
			if (transaction.status !== "realizada") throw new Error("La conformidad requiere una entrega completa.");
			assertConformityDeadline(transaction);
			if (transaction.buyerId !== userId)
				throw new Error("Solo el comprador puede registrar la conformidad de una venta.");
			assertOperationalUser(userId);
			if (transaction.buyerConformityAt) throw new Error("La conformidad ya fue registrada.");
			const updated = SaleTransactionSchema.parse({
				...transaction,
				buyerConformityAt: operationNow().toISOString(),
				buyerConformitySource: "explicita",
				updatedAt: operationNow().toISOString(),
			});
			saleTransactions = saleTransactions.map((candidate) =>
				candidate.id === transactionId ? updated : candidate,
			);
			return updated;
		}
		const transaction = transactions.find((candidate) => candidate.id === transactionId);
		if (!transaction) throw new Error("La operación no existe.");
		if (transaction.status !== "realizada") throw new Error("La conformidad requiere una entrega completa.");
		assertConformityDeadline(transaction);
		const role =
			userId === transaction.publisherId ? "publisher" : userId === transaction.requesterId ? "requester" : null;
		if (!role) throw new Error("Solo un participante puede registrar la conformidad.");
		assertOperationalUser(userId);
		if (
			(role === "publisher" && transaction.publisherConformityAt) ||
			(role === "requester" && transaction.requesterConformityAt)
		) {
			throw new Error("La conformidad ya fue registrada.");
		}
		const now = operationNow().toISOString();
		const updated = ExchangeTransactionSchema.parse({
			...transaction,
			publisherConformityAt: role === "publisher" ? now : transaction.publisherConformityAt,
			requesterConformityAt: role === "requester" ? now : transaction.requesterConformityAt,
			publisherConformitySource: role === "publisher" ? "explicita" : transaction.publisherConformitySource,
			requesterConformitySource: role === "requester" ? "explicita" : transaction.requesterConformitySource,
			updatedAt: now,
		});
		transactions = transactions.map((candidate) => (candidate.id === transactionId ? updated : candidate));
		return updated;
	});
}

export async function processOperationConformityExpiry(
	type: OperationType,
	transactionId: number,
): Promise<ExchangeTransaction | SaleTransaction | null> {
	return withOperationLock(async () => {
		await wait();
		if (type === "venta") {
			const transaction = saleTransactions.find((candidate) => candidate.id === transactionId);
			if (!transaction) throw new Error("La operación no existe.");
			if (transaction.status !== "realizada" || !transaction.confirmationDeadlineAt) return transaction;
			if (operationNow().getTime() < new Date(transaction.confirmationDeadlineAt).getTime()) return transaction;
			if (transaction.buyerConformityAt) return transaction;
			const updated = SaleTransactionSchema.parse({
				...transaction,
				buyerConformityAt: transaction.confirmationDeadlineAt,
				buyerConformitySource: "vencimiento",
				updatedAt: operationNow().toISOString(),
			});
			saleTransactions = saleTransactions.map((candidate) =>
				candidate.id === transactionId ? updated : candidate,
			);
			return updated;
		}
		const transaction = transactions.find((candidate) => candidate.id === transactionId);
		if (!transaction) throw new Error("La operación no existe.");
		if (transaction.status !== "realizada" || !transaction.confirmationDeadlineAt) return transaction;

		if (operationNow().getTime() < new Date(transaction.confirmationDeadlineAt).getTime()) return transaction;

		const updated = ExchangeTransactionSchema.parse({
			...transaction,
			publisherConformityAt: transaction.publisherConformityAt ?? transaction.confirmationDeadlineAt,
			requesterConformityAt: transaction.requesterConformityAt ?? transaction.confirmationDeadlineAt,
			publisherConformitySource: transaction.publisherConformityAt
				? transaction.publisherConformitySource
				: "vencimiento",
			requesterConformitySource: transaction.requesterConformityAt
				? transaction.requesterConformitySource
				: "vencimiento",
			updatedAt: operationNow().toISOString(),
		});

		transactions = transactions.map((candidate) => (candidate.id === transactionId ? updated : candidate));

		return updated;
	});
}

export async function getOperationEvidenceReference(
	type: "intercambio" | "venta",
	transactionId: number,
): Promise<OperationEvidenceReference | null> {
	await wait();
	if (type === "venta") {
		const reference = saleReferences.get(transactionId);
		return reference ? { media: reference.media.map((media) => ({ ...media })), price: reference.price } : null;
	}

	const transaction = transactions.find((candidate) => candidate.id === transactionId);
	if (!transaction) return null;

	const reference = proposalReferences.get(transaction.exchangeProposalId);
	return reference
		? {
				media: [
					...reference.requestedMedia.map((media) => ({ ...media })),
					...reference.offeredMedia.map((media) => ({ ...media })),
				],
				referenceValue: reference.requestedReferenceValue,
			}
		: null;
}
