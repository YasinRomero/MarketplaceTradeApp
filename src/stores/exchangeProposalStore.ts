import { Dispute, DisputeEvidence, DisputeInput, DisputeResolutionInput } from "@/schemas/dispute";
import { ExchangeProposal, ExchangeProposalInput, ExchangeTransaction } from "@/schemas/exchange";
import { FinancialMovement } from "@/schemas/financial";
import { OperationType } from "@/schemas/operation";
import { Product } from "@/schemas/product";
import { SaleTransaction } from "@/schemas/sales";
import {
	assignDisputeToModerator,
	getDisputeOperationContext,
	listDisputeEvidences,
	listDisputesForModerator,
	listDisputesForUser,
	openDispute,
	resolveDispute,
} from "@/services/disputeService";
import {
	acceptExchangeProposal,
	createExchangeProposal,
	createSaleTransaction,
	listAvailableExchangeProducts,
	listExchangeProposalProducts,
	listExchangeProposalsForUser,
	listExchangeTransactionsForUser,
	listSaleTransactionsForUser,
	processOperationConformityExpiry,
	registerOperationConformity,
	registerOperationDelivery,
	rejectExchangeProposal,
	withdrawExchangeProposal,
} from "@/services/exchangeProposalService";
import {
	initializeFinancialMovements,
	listFinancialMovements,
	prepareOperationClosure,
	processAllFinancialMovements,
	processFinancialMovement,
	requestOperationCancellation,
	retryCancellationMovement,
} from "@/services/financialMovementService";
import { useAuthStore } from "@/stores/authStore";
import { useProductStore } from "@/stores/productStore";
import { DisputeOperationContext } from "@/types/dispute";
import { create } from "zustand";

interface ExchangeProposalStore {
	proposals: ExchangeProposal[];
	availableProducts: Product[];
	productDirectory: Record<number, Product>;
	transactions: ExchangeTransaction[];
	saleTransactions: SaleTransaction[];
	financialMovements: Record<string, FinancialMovement[]>;
	disputes: Dispute[];
	disputeEvidences: Record<number, DisputeEvidence[]>;
	disputeOperationContexts: Record<number, DisputeOperationContext>;
	isLoading: boolean;
	error: string | null;
	loadAvailableProducts: (ownerId: number) => Promise<void>;
	loadProposals: (userId: number) => Promise<void>;
	submitProposal: (input: ExchangeProposalInput) => Promise<ExchangeProposal | null>;
	acceptProposal: (proposalId: number, ownerId: number) => Promise<ExchangeTransaction | null>;
	rejectProposal: (proposalId: number, ownerId: number) => Promise<ExchangeProposal | null>;
	startSale: (productId: number, buyerId: number) => Promise<SaleTransaction | null>;
	processFinancialMovements: (type: OperationType, transactionId: number) => Promise<void>;
	prepareOperationClosure: (type: OperationType, transactionId: number) => Promise<boolean>;
	cancelOperation: (type: OperationType, transactionId: number, userId: number) => Promise<boolean>;
	withdrawProposal: (proposalId: number, requesterId: number) => Promise<boolean>;
	processFinancialMovement: (movementId: number, outcome?: "confirmado" | "fallido") => Promise<void>;
	retryCancellationMovement: (movementId: number) => Promise<void>;
	registerDelivery: (type: OperationType, transactionId: number, userId: number) => Promise<boolean>;
	registerConformity: (type: OperationType, transactionId: number, userId: number) => Promise<boolean>;
	processConformityExpiry: (type: OperationType, transactionId: number) => Promise<void>;
	openDispute: (input: DisputeInput) => Promise<boolean>;
	loadDisputesForModerator: (moderatorId: number) => Promise<void>;
	assignDispute: (disputeId: number, moderatorId: number) => Promise<boolean>;
	resolveDispute: (input: DisputeResolutionInput) => Promise<boolean>;
}

const movementKey = (type: OperationType, transactionId: number) => `${type}:${transactionId}`;

const requireSessionUserId = (): number => {
	const userId = useAuthStore.getState().currentUser?.id;
	if (userId === undefined) throw new Error("Debes iniciar sesión para consultar tus operaciones.");
	return userId;
};

export const useExchangeProposalStore = create<ExchangeProposalStore>((set, get) => ({
	proposals: [],
	availableProducts: [],
	productDirectory: {},
	transactions: [],
	saleTransactions: [],
	financialMovements: {},
	disputes: [],
	disputeEvidences: {},
	disputeOperationContexts: {},
	isLoading: false,
	error: null,

	loadAvailableProducts: async (ownerId) => {
		set({ isLoading: true, error: null });
		try {
			set({ availableProducts: await listAvailableExchangeProducts(ownerId), isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudieron cargar tus productos.",
			});
		}
	},

	loadProposals: async (userId) => {
		set({ isLoading: true, error: null });
		try {
			const [loadedProposals, products, loadedTransactions, loadedSaleTransactions] = await Promise.all([
				listExchangeProposalsForUser(userId),
				listExchangeProposalProducts(),
				listExchangeTransactionsForUser(userId),
				listSaleTransactionsForUser(userId),
			]);
			const loadedDisputes = await listDisputesForUser(userId);
			await Promise.all([
				...loadedTransactions.map((transaction) =>
					processOperationConformityExpiry("intercambio", transaction.id),
				),
				...loadedSaleTransactions.map((transaction) =>
					processOperationConformityExpiry("venta", transaction.id),
				),
			]);
			const [refreshedTransactions, refreshedSaleTransactions] = await Promise.all([
				listExchangeTransactionsForUser(userId),
				listSaleTransactionsForUser(userId),
			]);
			await Promise.all([
				...refreshedTransactions.map((transaction) =>
					initializeFinancialMovements("intercambio", transaction.id),
				),
				...refreshedSaleTransactions.map((transaction) =>
					initializeFinancialMovements("venta", transaction.id),
				),
			]);
			const loadedMovements = await Promise.all([
				...refreshedTransactions.map(
					async (transaction) =>
						[
							movementKey("intercambio", transaction.id),
							await listFinancialMovements("intercambio", transaction.id),
						] as const,
				),
				...refreshedSaleTransactions.map(
					async (transaction) =>
						[
							movementKey("venta", transaction.id),
							await listFinancialMovements("venta", transaction.id),
						] as const,
				),
			]);
			const productDirectory = Object.fromEntries(products.map((product) => [product.id, product]));
			set({
				proposals: loadedProposals,
				productDirectory,
				transactions: refreshedTransactions,
				saleTransactions: refreshedSaleTransactions,
				financialMovements: Object.fromEntries(loadedMovements),
				disputes: loadedDisputes,
				isLoading: false,
			});
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudieron cargar las propuestas.",
			});
		}
	},

	submitProposal: async (input) => {
		set({ isLoading: true, error: null });

		try {
			const proposal = await createExchangeProposal(input);
			set((state) => ({ proposals: [...state.proposals, proposal], isLoading: false }));
			return proposal;
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo enviar la propuesta.",
			});
			return null;
		}
	},

	acceptProposal: async (proposalId, ownerId) => {
		set({ isLoading: true, error: null });

		try {
			const transaction = await acceptExchangeProposal(proposalId, ownerId);
			const movements = await initializeFinancialMovements("intercambio", transaction.id);

			await Promise.all([
				useProductStore.getState().loadProducts(),
				useProductStore.getState().loadOwnedProducts(ownerId),
			]);

			set((state) => ({
				proposals: state.proposals.map((proposal) =>
					proposal.id === proposalId ||
					(proposal.status === "pendiente" &&
						(transaction.publishedProductId === proposal.requestedProductId ||
							transaction.publishedProductId === proposal.offeredProductId ||
							transaction.offeredProductId === proposal.requestedProductId ||
							transaction.offeredProductId === proposal.offeredProductId))
						? {
								...proposal,
								status: proposal.id === proposalId ? "aceptada" : "rechazada",
								updatedAt: new Date().toISOString(),
							}
						: proposal,
				),
				transactions: [...state.transactions, transaction],
				financialMovements: {
					...state.financialMovements,
					[movementKey("intercambio", transaction.id)]: movements,
				},

				productDirectory: Object.fromEntries(
					Object.entries(state.productDirectory).map(([id, product]) =>
						transaction.publishedProductId === product.id || transaction.offeredProductId === product.id
							? [id, { ...product, status: "reservado" as const }]
							: [id, product],
					),
				),
				isLoading: false,
			}));

			return transaction;
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo aceptar la propuesta.",
			});
			return null;
		}
	},

	rejectProposal: async (proposalId, ownerId) => {
		set({ isLoading: true, error: null });
		try {
			const proposal = await rejectExchangeProposal(proposalId, ownerId);
			set((state) => ({
				proposals: state.proposals.map((candidate) => (candidate.id === proposal.id ? proposal : candidate)),
				isLoading: false,
			}));
			return proposal;
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo rechazar la propuesta.",
			});
			return null;
		}
	},

	startSale: async (productId, buyerId) => {
		set({ isLoading: true, error: null });
		try {
			const transaction = await createSaleTransaction(productId, buyerId);
			const movements = await initializeFinancialMovements("venta", transaction.id);
			await Promise.all([
				useProductStore.getState().loadProducts(),
				useProductStore.getState().loadOwnedProducts(buyerId),
			]);
			set((state) => ({
				saleTransactions: [...state.saleTransactions, transaction],
				financialMovements: { ...state.financialMovements, [movementKey("venta", transaction.id)]: movements },

				proposals: state.proposals.map((proposal) =>
					proposal.status === "pendiente" &&
					(proposal.requestedProductId === productId || proposal.offeredProductId === productId)
						? { ...proposal, status: "rechazada", updatedAt: new Date().toISOString() }
						: proposal,
				),
				productDirectory: Object.fromEntries(
					Object.entries(state.productDirectory).map(([id, product]) =>
						product.id === productId ? [id, { ...product, status: "reservado" as const }] : [id, product],
					),
				),
				isLoading: false,
			}));
			return transaction;
		} catch (error) {
			set({ isLoading: false, error: error instanceof Error ? error.message : "No se pudo iniciar la compra." });
			return null;
		}
	},

	processFinancialMovements: async (type, transactionId) => {
		set({ isLoading: true, error: null });
		try {
			const userId = requireSessionUserId();
			await processAllFinancialMovements(type, transactionId);
			const [loadedTransactions, loadedSaleTransactions] = await Promise.all([
				listExchangeTransactionsForUser(userId),
				listSaleTransactionsForUser(userId),
			]);
			const movements = await listFinancialMovements(type, transactionId);
			set((state) => ({
				transactions: loadedTransactions,
				saleTransactions: loadedSaleTransactions,
				financialMovements: { ...state.financialMovements, [movementKey(type, transactionId)]: movements },

				isLoading: false,
			}));
			await useProductStore.getState().loadProducts();
			await useProductStore.getState().loadOwnedProducts(userId);
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudieron procesar los movimientos simulados.",
			});
		}
	},

	prepareOperationClosure: async (type, transactionId) => {
		set({ isLoading: true, error: null });
		try {
			const userId = requireSessionUserId();
			await prepareOperationClosure(type, transactionId);
			await get().loadProposals(userId);
			return true;
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo preparar el cierre económico.",
			});
			return false;
		}
	},

	cancelOperation: async (type, transactionId, userId) => {
		set({ isLoading: true, error: null });
		try {
			await requestOperationCancellation(type, transactionId, userId);
			await get().loadProposals(userId);
			return true;
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo solicitar la cancelación.",
			});
			return false;
		}
	},

	withdrawProposal: async (proposalId, requesterId) => {
		set({ isLoading: true, error: null });
		try {
			await withdrawExchangeProposal(proposalId, requesterId);
			await get().loadProposals(requesterId);
			return true;
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo retirar la propuesta.",
			});
			return false;
		}
	},

	processFinancialMovement: async (movementId, outcome = "confirmado") => {
		set({ isLoading: true, error: null });
		try {
			await processFinancialMovement(movementId, outcome);
			const userId = requireSessionUserId();
			await get().loadProposals(userId);
			await useProductStore.getState().loadProducts();
			await useProductStore.getState().loadOwnedProducts(userId);
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo procesar el movimiento.",
			});
		}
	},

	retryCancellationMovement: async (movementId) => {
		set({ isLoading: true, error: null });
		try {
			await retryCancellationMovement(movementId);
			await get().loadProposals(requireSessionUserId());
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo reintentar la devolución.",
			});
		}
	},

	registerDelivery: async (type, transactionId, userId) => {
		set({ isLoading: true, error: null });
		try {
			await registerOperationDelivery(type, transactionId, userId);
			await get().loadProposals(userId);
			return true;
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo registrar la entrega.",
			});
			return false;
		}
	},

	registerConformity: async (type, transactionId, userId) => {
		set({ isLoading: true, error: null });
		try {
			await registerOperationConformity(type, transactionId, userId);
			await get().loadProposals(userId);
			return true;
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo registrar la conformidad.",
			});
			return false;
		}
	},

	processConformityExpiry: async (type, transactionId) => {
		set({ isLoading: true, error: null });
		try {
			await processOperationConformityExpiry(type, transactionId);
			await get().loadProposals(requireSessionUserId());
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo evaluar el vencimiento.",
			});
		}
	},

	openDispute: async (input) => {
		set({ isLoading: true, error: null });
		try {
			await openDispute(input);
			await get().loadProposals(input.claimantId);
			return true;
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo registrar la incidencia.",
			});
			return false;
		}
	},

	loadDisputesForModerator: async (moderatorId) => {
		set({ isLoading: true, error: null });
		try {
			const loadedDisputes = await listDisputesForModerator(moderatorId);
			const loadedEvidences = await Promise.all(
				loadedDisputes.map(async (dispute) => [dispute.id, await listDisputeEvidences(dispute.id)] as const),
			);
			const loadedContexts = await Promise.all(
				loadedDisputes.map(
					async (dispute) => [dispute.id, await getDisputeOperationContext(dispute.id)] as const,
				),
			);
			set({
				disputes: loadedDisputes,
				disputeEvidences: Object.fromEntries(loadedEvidences),
				disputeOperationContexts: Object.fromEntries(
					loadedContexts.filter((entry): entry is [number, DisputeOperationContext] => entry[1] !== null),
				),
				isLoading: false,
			});
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudieron cargar las disputas.",
			});
		}
	},

	assignDispute: async (disputeId, moderatorId) => {
		set({ isLoading: true, error: null });
		try {
			await assignDisputeToModerator({ disputeId, moderatorId });
			await get().loadDisputesForModerator(moderatorId);
			return true;
		} catch (error) {
			set({ isLoading: false, error: error instanceof Error ? error.message : "No se pudo asignar la disputa." });
			return false;
		}
	},

	resolveDispute: async (input) => {
		set({ isLoading: true, error: null });
		try {
			await resolveDispute(input);
			await get().loadDisputesForModerator(input.moderatorId);
			return true;
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo resolver la disputa.",
			});
			return false;
		}
	},
}));
