import { FinancialMovement, FinancialMovementSchema, FinancialMovementStatus } from "@/schemas/financial";
import { OperationType } from "@/schemas/operation";
import { getDisputeForTransaction } from "@/services/disputeService";
import {
	CANCELLATION_TOKEN,
	CLOSURE_TOKEN,
	FINANCIAL_ACTIVATION_TOKEN,
	getExchangeTransactionById,
	getSaleTransactionById,
	hasCompleteConformity,
	updateExchangeTransactionStatus,
	updateSaleTransactionStatus,
	withOperationLock,
} from "@/services/exchangeProposalService";
import {
	finalizeProducts,
	getProductByIdForOperations,
	PRODUCT_FINALIZATION_TOKEN,
	releaseProducts,
} from "@/services/productService";

const MOCK_PROVIDER = "INTIDO proveedor simulado";
const INTIDO_MOCK_USER_ID = 2;

let nextMovementId = 1;
let movements: FinancialMovement[] = [];

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 120));

type ProcessingOutcome = "confirmado" | "fallido" | "error";
const cancellationOriginals = new Map<number, number>();
const closureOriginals = new Map<number, number>();

function parsedMovement(movement: FinancialMovement): FinancialMovement {
	return FinancialMovementSchema.parse(movement);
}

function createMovement(
	input: Omit<
		FinancialMovement,
		"id" | "createdAt" | "processedAt" | "provider" | "providerReference" | "status" | "recognizedAt"
	>,
): FinancialMovement {
	const movement = parsedMovement({
		...input,
		id: nextMovementId++,
		status: "pendiente",
		provider: null,
		providerReference: null,
		createdAt: new Date().toISOString(),
		processedAt: null,
		recognizedAt: null,
	});
	movements = [...movements, movement];
	return movement;
}

function operationMovements(type: OperationType, transactionId: number): FinancialMovement[] {
	return movements.filter(
		(movement) =>
			movement.transactionId === transactionId && (type === "venta" || movement.transactionId === transactionId),
	);
}

function isCancellationMovement(movement: FinancialMovement): boolean {
	return cancellationOriginals.has(movement.id);
}

function getOriginalMovements(transactionId: number): FinancialMovement[] {
	return movements.filter(
		(movement) =>
			movement.transactionId === transactionId &&
			!isCancellationMovement(movement) &&
			!closureOriginals.has(movement.id),
	);
}

function getCancellationMovements(transactionId: number): FinancialMovement[] {
	return movements.filter((movement) => movement.transactionId === transactionId && isCancellationMovement(movement));
}

function getClosureMovements(transactionId: number): FinancialMovement[] {
	return movements.filter(
		(movement) => movement.transactionId === transactionId && closureOriginals.has(movement.id),
	);
}

async function initializeFinancialMovementsInternal(
	type: OperationType,
	transactionId: number,
): Promise<FinancialMovement[]> {
	await wait();
	const existing = operationMovements(type, transactionId);
	if (existing.length > 0) return existing.map(parsedMovement);

	if (type === "venta") {
		const transaction = await getSaleTransactionById(transactionId);
		if (!transaction) throw new Error("La transacción de venta no existe.");
		createMovement({
			transactionId,
			sourceUserId: transaction.buyerId,
			destinationUserId: transaction.sellerId,
			type: "retencion",
			concept: "respaldo_producto",
			amount: transaction.price,
		});
		createMovement({
			transactionId,
			sourceUserId: transaction.sellerId,
			destinationUserId: INTIDO_MOCK_USER_ID,
			type: "comision",
			concept: "comision",
			amount: transaction.commission,
		});
	} else {
		const transaction = await getExchangeTransactionById(transactionId);
		if (!transaction) throw new Error("La transacción de intercambio no existe.");
		createMovement({
			transactionId,
			sourceUserId: transaction.publisherId,
			destinationUserId: transaction.requesterId,
			type: "retencion",
			concept: "respaldo_producto",
			amount: transaction.publishedProductValue,
		});
		createMovement({
			transactionId,
			sourceUserId: transaction.requesterId,
			destinationUserId: transaction.publisherId,
			type: "retencion",
			concept: "respaldo_producto",
			amount: transaction.offeredProductValue,
		});
		if (transaction.additionalAmount > 0) {
			createMovement({
				transactionId,
				sourceUserId: transaction.requesterId,
				destinationUserId: transaction.publisherId,
				type: "retencion",
				concept: "monto_adicional",
				amount: transaction.additionalAmount,
			});
		}
		createMovement({
			transactionId,
			sourceUserId: transaction.publisherId,
			destinationUserId: INTIDO_MOCK_USER_ID,
			type: "comision",
			concept: "comision",
			amount: transaction.commissionPerParticipant,
		});
		createMovement({
			transactionId,
			sourceUserId: transaction.requesterId,
			destinationUserId: INTIDO_MOCK_USER_ID,
			type: "comision",
			concept: "comision",
			amount: transaction.commissionPerParticipant,
		});
	}
	return operationMovements(type, transactionId).map(parsedMovement);
}

export async function initializeFinancialMovements(
	type: OperationType,
	transactionId: number,
): Promise<FinancialMovement[]> {
	return withOperationLock(() => initializeFinancialMovementsInternal(type, transactionId));
}

export async function listFinancialMovements(type: OperationType, transactionId: number): Promise<FinancialMovement[]> {
	await wait();
	return operationMovements(type, transactionId).map(parsedMovement);
}

async function refreshOperationStatus(type: OperationType, transactionId: number): Promise<void> {
	const current = operationMovements(type, transactionId);
	if (current.some((movement) => movement.status !== "confirmado")) return;
	if (type === "venta") {
		const transaction = await getSaleTransactionById(transactionId);
		if (transaction?.status === "pendiente_respaldo")
			await updateSaleTransactionStatus(transactionId, "activa", FINANCIAL_ACTIVATION_TOKEN);
	} else {
		const transaction = await getExchangeTransactionById(transactionId);
		if (transaction?.status === "pendiente_respaldo")
			await updateExchangeTransactionStatus(transactionId, "activa", FINANCIAL_ACTIVATION_TOKEN);
	}
}

async function getOperationProductIds(type: OperationType, transactionId: number): Promise<number[]> {
	if (type === "venta") {
		const transaction = await getSaleTransactionById(transactionId);
		if (!transaction) throw new Error("La transacción de venta no existe.");
		return [transaction.soldProductId];
	}
	const transaction = await getExchangeTransactionById(transactionId);
	if (!transaction) throw new Error("La transacción de intercambio no existe.");
	return [transaction.publishedProductId, transaction.offeredProductId];
}

async function hasRecordedDelivery(type: OperationType, transactionId: number): Promise<boolean> {
	if (type === "venta") {
		const transaction = await getSaleTransactionById(transactionId);
		return Boolean(
			transaction?.sellerConfirmedAt || transaction?.buyerConfirmedAt || transaction?.deliveryCompletedAt,
		);
	}
	const transaction = await getExchangeTransactionById(transactionId);
	return Boolean(
		transaction?.publisherConfirmedAt || transaction?.requesterConfirmedAt || transaction?.exchangeCompletedAt,
	);
}

function reverseMovement(original: FinancialMovement): FinancialMovement {
	const reversal = createMovement({
		transactionId: original.transactionId,
		sourceUserId: original.destinationUserId,
		destinationUserId: original.sourceUserId,
		type: original.type === "comision" ? "anulacion" : "reembolso",
		concept: original.concept,
		amount: original.amount,
	});
	cancellationOriginals.set(reversal.id, original.id);
	return reversal;
}

async function finalizeCancellation(type: OperationType, transactionId: number): Promise<void> {
	const current =
		type === "venta"
			? await getSaleTransactionById(transactionId)
			: await getExchangeTransactionById(transactionId);
	if (!current || current.status !== "cancelacion_pendiente") return;
	const original = getOriginalMovements(transactionId);
	const reversals = getCancellationMovements(transactionId);
	if (
		original.some(
			(movement) =>
				movement.status === "pendiente" ||
				(movement.status === "confirmado" &&
					!reversals.some(
						(reversal) =>
							cancellationOriginals.get(reversal.id) === movement.id && reversal.status === "confirmado",
					)),
		)
	)
		return;
	if (reversals.some((movement) => movement.status !== "confirmado")) return;
	const products = await getOperationProductIds(type, transactionId);
	for (const productId of products) {
		const product = await getProductByIdForOperations(productId);
		if (!product || product.status !== "reservado")
			throw new Error("No se pueden liberar productos que ya no están reservados.");
	}
	if (type === "venta") {
		const transaction = await getSaleTransactionById(transactionId);
		if (transaction?.status === "cancelacion_pendiente")
			await updateSaleTransactionStatus(transactionId, "cancelada", CANCELLATION_TOKEN);
	} else {
		const transaction = await getExchangeTransactionById(transactionId);
		if (transaction?.status === "cancelacion_pendiente")
			await updateExchangeTransactionStatus(transactionId, "cancelada", CANCELLATION_TOKEN);
	}
	await releaseProducts(products);
}

async function assertCompletionConditions(
	type: OperationType,
	transactionId: number,
): Promise<"liberar" | "reembolsar"> {
	const transaction =
		type === "venta"
			? await getSaleTransactionById(transactionId)
			: await getExchangeTransactionById(transactionId);
	if (!transaction) throw new Error("La operación no existe.");
	if (transaction.status !== "realizada" && transaction.status !== "disputa") {
		throw new Error("La operación todavía no está lista para el cierre económico.");
	}
	const deliveryCompleted =
		"sellerId" in transaction ? transaction.deliveryCompletedAt : transaction.exchangeCompletedAt;
	if (!deliveryCompleted || !hasCompleteConformity(transaction)) {
		throw new Error("El cierre requiere entrega completa y conformidad de todos los participantes.");
	}
	const dispute = await getDisputeForTransaction(transactionId);
	if (transaction.status === "disputa" && (!dispute || dispute.status !== "resuelta")) {
		throw new Error("El cierre permanece bloqueado hasta resolver la disputa.");
	}
	if (
		dispute?.status === "resuelta" &&
		(dispute.requiresProductReturn || dispute.decision === "devolver_productos")
	) {
		throw new Error("El cierre económico espera la devolución confirmada de los productos.");
	}
	if (dispute?.status === "resuelta" && dispute.decision === "devolver_fondos") return "reembolsar";
	return "liberar";
}

async function prepareCompletionMovementsInternal(
	type: OperationType,
	transactionId: number,
): Promise<FinancialMovement[]> {
	const mode = await assertCompletionConditions(type, transactionId);
	const original = getOriginalMovements(transactionId);
	if (original.some((movement) => movement.status !== "confirmado")) {
		throw new Error("No se puede cerrar mientras existan respaldos financieros pendientes o fallidos.");
	}
	const existing = getClosureMovements(transactionId);
	for (const movement of original) {
		if (movement.type === "comision" && mode === "liberar") continue;
		if (existing.some((closure) => closureOriginals.get(closure.id) === movement.id)) continue;
		const isRefund = mode === "reembolsar";
		const closure = createMovement({
			transactionId,
			sourceUserId: isRefund ? movement.destinationUserId : movement.sourceUserId,
			destinationUserId: isRefund ? movement.sourceUserId : movement.destinationUserId,
			type: isRefund ? (movement.type === "comision" ? "anulacion" : "reembolso") : "liberacion",
			concept: movement.concept,
			amount: movement.amount,
		});
		closureOriginals.set(closure.id, movement.id);
	}
	return getClosureMovements(transactionId).map(parsedMovement);
}

async function refreshCompletionStatus(type: OperationType, transactionId: number): Promise<void> {
	const transaction =
		type === "venta"
			? await getSaleTransactionById(transactionId)
			: await getExchangeTransactionById(transactionId);
	if (!transaction || (transaction.status !== "realizada" && transaction.status !== "disputa")) return;
	const closure = getClosureMovements(transactionId);
	if (closure.length === 0 || closure.some((movement) => movement.status !== "confirmado")) return;
	const dispute = await getDisputeForTransaction(transactionId);
	if (transaction.status === "disputa" && dispute?.status !== "resuelta") return;
	if (!dispute || (dispute.status === "resuelta" && dispute.decision !== "devolver_fondos")) {
		const now = new Date().toISOString();
		movements = movements.map((movement) =>
			movement.transactionId === transactionId && movement.type === "comision" && movement.status === "confirmado"
				? parsedMovement({ ...movement, recognizedAt: now })
				: movement,
		);
	}
	const productIds = await getOperationProductIds(type, transactionId);
	const products = await Promise.all(productIds.map((productId) => getProductByIdForOperations(productId)));
	if (products.some((product) => !product || product.status !== "reservado")) {
		throw new Error("El cierre requiere que todos los productos continúen reservados.");
	}
	await finalizeProducts(productIds, PRODUCT_FINALIZATION_TOKEN);
	if (type === "venta") await updateSaleTransactionStatus(transactionId, "completada", CLOSURE_TOKEN);
	else await updateExchangeTransactionStatus(transactionId, "completada", CLOSURE_TOKEN);
}

export async function prepareOperationClosure(
	type: OperationType,
	transactionId: number,
): Promise<FinancialMovement[]> {
	return withOperationLock(() => prepareCompletionMovementsInternal(type, transactionId));
}

async function refreshCancellationStatus(type: OperationType, transactionId: number): Promise<void> {
	const transaction =
		type === "venta"
			? await getSaleTransactionById(transactionId)
			: await getExchangeTransactionById(transactionId);
	if (!transaction || transaction.status !== "cancelacion_pendiente") return;
	await finalizeCancellation(type, transactionId);
}

async function processFinancialMovementInternal(
	movementId: number,
	outcome: ProcessingOutcome,
): Promise<FinancialMovement> {
	await wait();
	const index = movements.findIndex((movement) => movement.id === movementId);
	if (index < 0) throw new Error("El movimiento financiero no existe.");
	if (outcome === "error") throw new Error("El proveedor financiero simulado no respondió.");
	const current = movements[index];
	if (current.status !== "pendiente") return parsedMovement(current);
	const originalId = cancellationOriginals.get(current.id);
	const processed = parsedMovement({
		...current,
		status: outcome,
		provider: MOCK_PROVIDER,
		providerReference: originalId ? `mock-reversal-of-${originalId}` : `mock-movement-${current.id}`,
		processedAt: new Date().toISOString(),
		recognizedAt: current.recognizedAt,
	});
	movements = movements.map((movement, movementIndex) => (movementIndex === index ? processed : movement));
	const type: OperationType = (await getSaleTransactionById(current.transactionId)) ? "venta" : "intercambio";
	await refreshOperationStatus(type, current.transactionId);
	await refreshCancellationStatus(type, current.transactionId);
	await refreshCompletionStatus(type, current.transactionId);
	return processed;
}

export async function processFinancialMovement(
	movementId: number,
	outcome: ProcessingOutcome,
): Promise<FinancialMovement> {
	return withOperationLock(() => processFinancialMovementInternal(movementId, outcome));
}

export async function processAllFinancialMovements(
	type: OperationType,
	transactionId: number,
	outcome: Exclude<ProcessingOutcome, "error"> = "confirmado",
): Promise<FinancialMovement[]> {
	return withOperationLock(async () => {
		await initializeFinancialMovementsInternal(type, transactionId);
		const pending = operationMovements(type, transactionId).filter((movement) => movement.status === "pendiente");
		for (const movement of pending) {
			const index = movements.findIndex((candidate) => candidate.id === movement.id);
			movements[index] = parsedMovement({
				...movement,
				status: outcome,
				provider: MOCK_PROVIDER,
				providerReference: `mock-movement-${movement.id}`,
				processedAt: new Date().toISOString(),
				recognizedAt: movement.recognizedAt,
			});
		}
		await refreshOperationStatus(type, transactionId);
		await refreshCancellationStatus(type, transactionId);
		await refreshCompletionStatus(type, transactionId);
		return operationMovements(type, transactionId).map(parsedMovement);
	});
}

export async function requestOperationCancellation(
	type: OperationType,
	transactionId: number,
	userId: number,
): Promise<FinancialMovement[]> {
	return withOperationLock(async () => {
		const transaction =
			type === "venta"
				? await getSaleTransactionById(transactionId)
				: await getExchangeTransactionById(transactionId);
		if (!transaction) throw new Error("La operación no existe.");
		const participantIds: number[] = [];
		if ("sellerId" in transaction) {
			participantIds.push(transaction.sellerId, transaction.buyerId);
		} else {
			participantIds.push(transaction.publisherId, transaction.requesterId);
		}
		if (!participantIds.includes(userId)) throw new Error("Solo un participante puede solicitar la cancelación.");
		if (transaction.status === "cancelada" || transaction.status === "completada")
			throw new Error("La operación ya no puede cancelarse.");
		if (
			transaction.status !== "pendiente_respaldo" &&
			transaction.status !== "activa" &&
			transaction.status !== "realizada" &&
			transaction.status !== "cancelacion_pendiente"
		) {
			throw new Error("La operación no se encuentra en un estado cancelable.");
		}
		if (await hasRecordedDelivery(type, transactionId))
			throw new Error("La cancelación ordinaria está bloqueada porque existe una entrega registrada.");
		await initializeFinancialMovementsInternal(type, transactionId);
		if (transaction.status !== "cancelacion_pendiente") {
			if (type === "venta")
				await updateSaleTransactionStatus(transactionId, "cancelacion_pendiente", CANCELLATION_TOKEN);
			else await updateExchangeTransactionStatus(transactionId, "cancelacion_pendiente", CANCELLATION_TOKEN);
		}
		const original = getOriginalMovements(transactionId);
		for (const movement of original) {
			if (movement.status === "pendiente") await processFinancialMovementInternal(movement.id, "fallido");
			if (
				movement.status === "confirmado" &&
				!getCancellationMovements(transactionId).some(
					(reversal) => cancellationOriginals.get(reversal.id) === movement.id,
				)
			) {
				reverseMovement(movement);
			}
		}
		await finalizeCancellation(type, transactionId);
		return operationMovements(type, transactionId).map(parsedMovement);
	});
}

export async function retryCancellationMovement(movementId: number): Promise<FinancialMovement> {
	return withOperationLock(async () => {
		if (!cancellationOriginals.has(movementId))
			throw new Error("El movimiento no corresponde a una devolución de cancelación.");
		const index = movements.findIndex((movement) => movement.id === movementId);
		if (index < 0 || movements[index].status !== "fallido")
			throw new Error("Solo se puede reintentar una devolución fallida.");
		movements[index] = parsedMovement({
			...movements[index],
			status: "pendiente",
			provider: null,
			providerReference: null,
			processedAt: null,
		});
		return processFinancialMovementInternal(movementId, "confirmado");
	});
}

export function isFinancialMovementPending(status: FinancialMovementStatus): boolean {
	return status === "pendiente";
}
