import { HeaderSections } from "@/components/common/HeaderSections";
import { Message } from "@/components/common/Message";
import { Badge } from "@/components/ui/Badge/Badge";
import { ButtonOutline, ButtonRounded } from "@/components/ui/Button";
import { mockUsers } from "@/mocks/products";
import { ExchangeProposal, ExchangeTransaction } from "@/schemas/exchange";
import { OperationType } from "@/schemas/operation";
import { SaleTransaction } from "@/schemas/sales";
import { useAuthStore } from "@/stores/authStore";
import { useExchangeProposalStore } from "@/stores/exchangeProposalStore";
import { colors, radius, spacing, typography } from "@/theme";
import { OperationReference } from "@/types/operation";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";

export interface OperationsSectionProps {
	style?: StyleProp<ViewStyle>;
}

export function OperationsSection({ style }: OperationsSectionProps) {
	const {
		proposals,
		productDirectory,
		transactions,
		saleTransactions,
		financialMovements,
		isLoading,
		error,
		loadProposals,
		acceptProposal,
		rejectProposal,
		processFinancialMovements,
		prepareOperationClosure,
		cancelOperation,
		withdrawProposal,
		retryCancellationMovement,
		registerDelivery,
		registerConformity,
		openDispute,
	} = useExchangeProposalStore();
	const currentUser = useAuthStore((state) => state.currentUser);
	const router = useRouter();
	const sessionUserId = currentUser?.id;
	const [confirmAction, setConfirmAction] = useState<
		"accept" | "reject" | "cancel" | "withdraw" | "delivery" | "conformity" | "dispute" | null
	>(null);
	const [selectedProposal, setSelectedProposal] = useState<ExchangeProposal | null>(null);
	const [selectedOperation, setSelectedOperation] = useState<OperationReference | null>(null);
	const [feedback, setFeedback] = useState<string | null>(null);
	const [financialFeedback, setFinancialFeedback] = useState<string | null>(null);
	const [disputeReason, setDisputeReason] = useState("");
	const [disputeEvidenceUrl, setDisputeEvidenceUrl] = useState("");

	useEffect(() => {
		if (sessionUserId !== undefined) loadProposals(sessionUserId);
	}, [loadProposals, sessionUserId]);

	const sent = proposals.filter((proposal) => proposal.requesterId === sessionUserId);
	const received = proposals.filter((proposal) => proposal.requesterId !== sessionUserId);

	const openConfirmation = (proposal: ExchangeProposal, action: "accept" | "reject") => {
		setSelectedProposal(proposal);
		setConfirmAction(action);
		setFeedback(null);
	};

	const closeConfirmation = () => {
		if (isLoading) return;
		setConfirmAction(null);
		setSelectedProposal(null);
		setSelectedOperation(null);
	};

	const handleConfirmedAction = async () => {
		if (!confirmAction || !currentUser) return;
		if (confirmAction === "cancel" && selectedOperation) {
			const cancelled = await cancelOperation(selectedOperation.type, selectedOperation.id, currentUser.id);
			setFeedback(
				cancelled
					? "Cancelación solicitada. Los productos permanecerán reservados hasta resolver los movimientos."
					: null,
			);
		} else if (confirmAction === "delivery" && selectedOperation) {
			const registered = await registerDelivery(selectedOperation.type, selectedOperation.id, currentUser.id);
			if (registered)
				setFeedback("Entrega registrada correctamente. La otra persona debe registrar su propia entrega.");
		} else if (confirmAction === "conformity" && selectedOperation) {
			const registered = await registerConformity(selectedOperation.type, selectedOperation.id, currentUser.id);
			if (registered)
				setFeedback("Conformidad registrada. La operación permanece pendiente del cierre económico.");
		} else if (confirmAction === "dispute" && selectedOperation) {
			const opened = await openDispute({
				type: selectedOperation.type,
				transactionId: selectedOperation.id,
				claimantId: currentUser.id,
				reason: disputeReason,
				evidences: disputeEvidenceUrl.trim() ? [{ type: "imagen", url: disputeEvidenceUrl.trim() }] : [],
			});
			if (opened)
				setFeedback("Incidencia registrada. La operación pasó a disputa y queda pendiente de revisión.");
		} else if (confirmAction === "withdraw" && selectedProposal) {
			const withdrawn = await withdrawProposal(selectedProposal.id, currentUser.id);
			setFeedback(
				withdrawn ? "Propuesta retirada. Se conservó como historial y no se generaron devoluciones." : null,
			);
		} else if (confirmAction === "accept" && selectedProposal) {
			const transaction = await acceptProposal(selectedProposal.id, currentUser.id);
			if (transaction)
				setFeedback(
					"Propuesta aceptada. Ambos productos quedaron reservados y la operación está pendiente de respaldo.",
				);
		} else if (selectedProposal) {
			const rejected = await rejectProposal(selectedProposal.id, currentUser.id);
			if (rejected) setFeedback("Propuesta rechazada. Se conservó como historial y no se reservaron productos.");
		}
		closeConfirmation();
	};

	const openCancellation = (type: OperationType, id: number) => {
		setSelectedOperation({ type, id });
		setSelectedProposal(null);
		setConfirmAction("cancel");
		setFeedback(null);
	};

	const openWithdrawal = (proposal: ExchangeProposal) => {
		setSelectedProposal(proposal);
		setSelectedOperation(null);
		setConfirmAction("withdraw");
		setFeedback(null);
	};

	const openDelivery = (type: OperationType, id: number) => {
		setSelectedOperation({ type, id });
		setSelectedProposal(null);
		setConfirmAction("delivery");
		setFeedback(null);
	};

	const openConformity = (type: OperationType, id: number) => {
		setSelectedOperation({ type, id });
		setSelectedProposal(null);
		setConfirmAction("conformity");
		setFeedback(null);
	};

	const openIncident = (type: OperationType, id: number) => {
		setSelectedOperation({ type, id });
		setSelectedProposal(null);
		setConfirmAction("dispute");
		setDisputeReason("");
		setDisputeEvidenceUrl("");
		setFeedback(null);
	};

	const processFinancial = async (type: OperationType, transactionId: number) => {
		setFinancialFeedback("Procesando respaldos financieros simulados...");
		await processFinancialMovements(type, transactionId);
		const currentError = useExchangeProposalStore.getState().error;
		setFinancialFeedback(
			currentError
				? `Error: ${currentError}`
				: "Respaldo simulado procesado. Revisa el estado de cada movimiento.",
		);
	};

	const prepareClosure = async (type: OperationType, transactionId: number) => {
		setFinancialFeedback("Preparando el cierre económico simulado...");
		await prepareOperationClosure(type, transactionId);
		const currentError = useExchangeProposalStore.getState().error;
		setFinancialFeedback(
			currentError
				? `Error: ${currentError}`
				: "Cierre preparado. Confirma los movimientos de liberación o devolución.",
		);
	};

	return (
		<View style={[styles.section, style]}>
			<View style={styles.content}>
				<HeaderSections
					title="MisOperaciones"
					description="Consulta tus propuestas de intercambio enviadas y recibidas."
					size="2xl"
				/>

				{isLoading && (
					<Message
						title="Cargando propuestas"
						message="Estamos consultando tus solicitudes de intercambio."
					/>
				)}
				{error && !isLoading && <Message title="No se pudieron cargar las propuestas" message={error} />}
				{feedback && <Message title="Operación actualizada" message={feedback} />}
				{financialFeedback && <Message title="Procesamiento financiero simulado" message={financialFeedback} />}

				{!currentUser ? (
					<Message
						title="Inicia sesión para continuar"
						message="Tus propuestas y operaciones pertenecen a una cuenta institucional."
					/>
				) : (
					<>
						<ProposalGroup
							title="Propuestas enviadas"
							emptyMessage="Todavía no has enviado propuestas de intercambio."
							proposalIds={sent}
							productDirectory={productDirectory}
							onWithdraw={openWithdrawal}
						/>
						<ProposalGroup
							title="Propuestas recibidas"
							emptyMessage="No tienes propuestas de intercambio recibidas."
							proposalIds={received}
							productDirectory={productDirectory}
							isReceived
							onAction={openConfirmation}
							onChat={(id) => router.push(`/chat?type=propuesta&id=${id}`)}
						/>
						<TransactionGroup
							transactions={transactions}
							productDirectory={productDirectory}
							financialMovements={financialMovements}
							isLoading={isLoading}
							onProcess={(transactionId) => processFinancial("intercambio", transactionId)}
							onPrepareClosure={(transactionId) => prepareClosure("intercambio", transactionId)}
							onCancel={openCancellation}
							onRetryMovement={(movementId) => retryCancellationMovement(movementId)}
							onDelivery={openDelivery}
							onConformity={openConformity}
							onIncident={openIncident}
							onChat={(id) => router.push(`/chat?type=intercambio&id=${id}`)}
						/>
					</>
				)}
				<SaleTransactionGroup
					transactions={saleTransactions}
					productDirectory={productDirectory}
					financialMovements={financialMovements}
					isLoading={isLoading}
					onProcess={(transactionId) => processFinancial("venta", transactionId)}
					onPrepareClosure={(transactionId) => prepareClosure("venta", transactionId)}
					onCancel={openCancellation}
					onRetryMovement={(movementId) => retryCancellationMovement(movementId)}
					onDelivery={openDelivery}
					onConformity={openConformity}
					onIncident={openIncident}
					onChat={(id) => router.push(`/chat?type=venta&id=${id}`)}
				/>
			</View>
			<ConfirmActionModal
				action={confirmAction}
				visible={confirmAction !== null}
				isLoading={isLoading}
				onCancel={closeConfirmation}
				onConfirm={() => handleConfirmedAction()}
				disputeReason={disputeReason}
				disputeEvidenceUrl={disputeEvidenceUrl}
				onReasonChange={setDisputeReason}
				onEvidenceChange={setDisputeEvidenceUrl}
			/>
		</View>
	);
}

function ProposalGroup({
	title,
	emptyMessage,
	proposalIds,
	productDirectory,
	onWithdraw,
	isReceived = false,
	onAction,
	onChat,
}: {
	title: string;
	emptyMessage: string;
	proposalIds: ExchangeProposal[];
	productDirectory: Record<number, ReturnType<typeof useExchangeProposalStore.getState>["productDirectory"][number]>;
	onWithdraw?: (proposal: ExchangeProposal) => void;
	isReceived?: boolean;
	onAction?: (proposal: ExchangeProposal, action: "accept" | "reject") => void;
	onChat?: (proposalId: number) => void;
}) {
	return (
		<View style={styles.group}>
			<Text style={styles.groupTitle}>{title}</Text>
			{proposalIds.length === 0 ? (
				<Message message={emptyMessage} />
			) : (
				proposalIds.map((proposal) => {
					const requestedProduct = productDirectory[proposal.requestedProductId];
					const offeredProduct = productDirectory[proposal.offeredProductId];
					return (
						<View key={proposal.id} style={styles.proposalCard}>
							<View style={styles.cardHeader}>
								<Text style={styles.proposalTitle}>
									{requestedProduct?.title ?? `Producto #${proposal.requestedProductId}`}
								</Text>
								<Badge bordered>{proposal.status}</Badge>
							</View>
							<Text style={styles.detailText}>
								{isReceived ? "Ofrece" : "Ofreces"}:{" "}
								{offeredProduct?.title ?? `Producto #${proposal.offeredProductId}`}
							</Text>
							<Text style={styles.detailText}>
								Monto adicional: S/. {proposal.additionalAmount.toFixed(2)}
							</Text>
							{isReceived && proposal.status === "pendiente" && onAction && (
								<View style={styles.actionRow}>
									<ButtonRounded onPress={() => onAction(proposal, "accept")}>Aceptar</ButtonRounded>
									<ButtonOutline onPress={() => onAction(proposal, "reject")}>Rechazar</ButtonOutline>
								</View>
							)}
							{!isReceived && proposal.status === "pendiente" && onWithdraw && (
								<View style={styles.actionRow}>
									<ButtonOutline onPress={() => onWithdraw(proposal)}>
										Retirar propuesta
									</ButtonOutline>
								</View>
							)}
							{onChat && <ButtonOutline onPress={() => onChat(proposal.id)}>Abrir chat</ButtonOutline>}
						</View>
					);
				})
			)}
		</View>
	);
}

function TransactionGroup({
	transactions,
	productDirectory,
	financialMovements,
	isLoading,
	onProcess,
	onPrepareClosure,
	onCancel,
	onRetryMovement,
	onDelivery,
	onConformity,
	onIncident,
	onChat,
}: {
	transactions: ExchangeTransaction[];
	productDirectory: Record<number, ReturnType<typeof useExchangeProposalStore.getState>["productDirectory"][number]>;
	financialMovements: ReturnType<typeof useExchangeProposalStore.getState>["financialMovements"];
	isLoading: boolean;
	onProcess: (transactionId: number) => Promise<void>;
	onPrepareClosure: (transactionId: number) => Promise<void>;
	onCancel: (type: OperationType, transactionId: number) => void;
	onRetryMovement: (movementId: number) => Promise<void>;
	onDelivery: (type: OperationType, transactionId: number) => void;
	onConformity: (type: OperationType, transactionId: number) => void;
	onIncident: (type: OperationType, transactionId: number) => void;
	onChat: (transactionId: number) => void;
}) {
	const sessionUserId = useAuthStore((state) => state.currentUser?.id);
	return (
		<View style={styles.group}>
			<Text style={styles.groupTitle}>Operaciones de intercambio</Text>
			{transactions.length === 0 ? (
				<Message message="Todavía no tienes operaciones de intercambio aceptadas." />
			) : (
				transactions.map((transaction) => (
					<View key={transaction.id} style={styles.proposalCard}>
						<View style={styles.cardHeader}>
							<Text style={styles.proposalTitle}>
								{productDirectory[transaction.publishedProductId]?.title ??
									`Producto #${transaction.publishedProductId}`}{" "}
								+{" "}
								{productDirectory[transaction.offeredProductId]?.title ??
									`Producto #${transaction.offeredProductId}`}
							</Text>
							<Badge bordered>{transaction.status}</Badge>
						</View>
						<Text style={styles.detailText}>
							Publicador:{" "}
							{mockUsers.find((user) => user.id === transaction.publisherId)?.fullName ??
								`Usuario #${transaction.publisherId}`}
						</Text>
						<Text style={styles.detailText}>
							Solicitante:{" "}
							{mockUsers.find((user) => user.id === transaction.requesterId)?.fullName ??
								`Usuario #${transaction.requesterId}`}
						</Text>
						<Text style={styles.detailText}>Estado actual: {transaction.status}</Text>
						<DeliveryStatus
							firstLabel="Publicador"
							firstAt={transaction.publisherConfirmedAt}
							secondLabel="Solicitante"
							secondAt={transaction.requesterConfirmedAt}
							completedAt={transaction.exchangeCompletedAt}
							deadlineAt={transaction.confirmationDeadlineAt}
						/>
						<ConformityStatus
							firstLabel="Publicador"
							firstAt={transaction.publisherConformityAt}
							firstSource={transaction.publisherConformitySource}
							secondLabel="Solicitante"
							secondAt={transaction.requesterConformityAt}
							secondSource={transaction.requesterConformitySource}
						/>
						<Text style={styles.detailText}>
							Monto adicional acordado: S/. {transaction.additionalAmount.toFixed(2)}
						</Text>
						<FinancialMovementGroup
							movements={financialMovements[`intercambio:${transaction.id}`] ?? []}
							isLoading={isLoading}
							onProcess={() => onProcess(transaction.id)}
							onPrepareClosure={() => onPrepareClosure(transaction.id)}
							isCancellation={transaction.status === "cancelacion_pendiente"}
							onRetryMovement={onRetryMovement}
						/>
						{transaction.status === "activa" &&
							((transaction.publisherId === sessionUserId && !transaction.publisherConfirmedAt) ||
								(transaction.requesterId === sessionUserId && !transaction.requesterConfirmedAt)) && (
								<ButtonOutline
									disabled={isLoading}
									onPress={() => onDelivery("intercambio", transaction.id)}
								>
									Registrar mi entrega
								</ButtonOutline>
							)}
						{transaction.status === "realizada" &&
							((transaction.publisherId === sessionUserId && !transaction.publisherConformityAt) ||
								(transaction.requesterId === sessionUserId && !transaction.requesterConformityAt)) && (
								<ButtonOutline
									disabled={isLoading}
									onPress={() => onConformity("intercambio", transaction.id)}
								>
									Confirmar conformidad
								</ButtonOutline>
							)}
						{(transaction.status === "realizada" || transaction.status === "disputa") &&
							Boolean(transaction.publisherConformityAt && transaction.requesterConformityAt) && (
								<ButtonOutline disabled={isLoading} onPress={() => onPrepareClosure(transaction.id)}>
									Preparar cierre económico
								</ButtonOutline>
							)}
						{transaction.status !== "disputa" &&
							(transaction.status === "activa"
								? Boolean(transaction.publisherConfirmedAt || transaction.requesterConfirmedAt)
								: transaction.status === "realizada" &&
									transaction.confirmationDeadlineAt !== null &&
									new Date() <= new Date(transaction.confirmationDeadlineAt)) && (
								<ButtonOutline
									disabled={isLoading}
									onPress={() => onIncident("intercambio", transaction.id)}
								>
									Registrar incidencia
								</ButtonOutline>
							)}
						{(transaction.status === "pendiente_respaldo" || transaction.status === "activa") &&
							!transaction.publisherConfirmedAt &&
							!transaction.requesterConfirmedAt && (
								<ButtonOutline
									disabled={isLoading}
									onPress={() => onCancel("intercambio", transaction.id)}
								>
									Cancelar operación
								</ButtonOutline>
							)}
						<ButtonOutline onPress={() => onChat(transaction.id)}>Abrir chat</ButtonOutline>
					</View>
				))
			)}
		</View>
	);
}

function SaleTransactionGroup({
	transactions,
	productDirectory,
	financialMovements,
	isLoading,
	onProcess,
	onPrepareClosure,
	onCancel,
	onRetryMovement,
	onDelivery,
	onConformity,
	onIncident,
	onChat,
}: {
	transactions: SaleTransaction[];
	productDirectory: Record<number, ReturnType<typeof useExchangeProposalStore.getState>["productDirectory"][number]>;
	financialMovements: ReturnType<typeof useExchangeProposalStore.getState>["financialMovements"];
	isLoading: boolean;
	onProcess: (transactionId: number) => Promise<void>;
	onPrepareClosure: (transactionId: number) => Promise<void>;
	onCancel: (type: OperationType, transactionId: number) => void;
	onRetryMovement: (movementId: number) => Promise<void>;
	onDelivery: (type: OperationType, transactionId: number) => void;
	onConformity: (type: OperationType, transactionId: number) => void;
	onIncident: (type: OperationType, transactionId: number) => void;
	onChat: (transactionId: number) => void;
}) {
	const sessionUserId = useAuthStore((state) => state.currentUser?.id);
	return (
		<View style={styles.group}>
			<Text style={styles.groupTitle}>Compras directas</Text>
			{transactions.length === 0 ? (
				<Message message="Todavía no tienes compras directas iniciadas." />
			) : (
				transactions.map((transaction) => {
					const seller = mockUsers.find((user) => user.id === transaction.sellerId);
					const buyer = mockUsers.find((user) => user.id === transaction.buyerId);
					return (
						<View key={transaction.id} style={styles.proposalCard}>
							<View style={styles.cardHeader}>
								<Text style={styles.proposalTitle}>
									{productDirectory[transaction.soldProductId]?.title ??
										`Producto #${transaction.soldProductId}`}
								</Text>
								<Badge bordered>{transaction.status}</Badge>
							</View>
							<Text style={styles.detailText}>
								Vendedor: {seller?.fullName ?? `Usuario #${transaction.sellerId}`}
							</Text>
							<Text style={styles.detailText}>
								Comprador: {buyer?.fullName ?? `Usuario #${transaction.buyerId}`}
							</Text>
							<Text style={styles.detailText}>Precio acordado: S/. {transaction.price.toFixed(2)}</Text>
							<Text style={styles.detailText}>
								Comisión INTIDO (6%): S/. {transaction.commission.toFixed(2)}
							</Text>
							<Text style={styles.detailText}>
								Importe vendedor: S/. {transaction.sellerAmount.toFixed(2)}
							</Text>
							<DeliveryStatus
								firstLabel="Vendedor"
								firstAt={transaction.sellerConfirmedAt}
								secondLabel="Comprador"
								secondAt={transaction.buyerConfirmedAt}
								completedAt={transaction.deliveryCompletedAt}
								deadlineAt={transaction.confirmationDeadlineAt}
							/>
							<ConformityStatus
								firstLabel="Comprador"
								firstAt={transaction.buyerConformityAt}
								firstSource={transaction.buyerConformitySource}
							/>
							<FinancialMovementGroup
								movements={financialMovements[`venta:${transaction.id}`] ?? []}
								isLoading={isLoading}
								onProcess={() => onProcess(transaction.id)}
								onPrepareClosure={() => onPrepareClosure(transaction.id)}
								isCancellation={transaction.status === "cancelacion_pendiente"}
								onRetryMovement={onRetryMovement}
							/>
							{transaction.status === "activa" &&
								!(
									(transaction.sellerId === sessionUserId && transaction.sellerConfirmedAt) ||
									(transaction.buyerId === sessionUserId && transaction.buyerConfirmedAt)
								) && (
									<ButtonOutline
										disabled={isLoading}
										onPress={() => onDelivery("venta", transaction.id)}
									>
										Registrar mi entrega
									</ButtonOutline>
								)}
							{transaction.status === "realizada" &&
								transaction.buyerId === sessionUserId &&
								!transaction.buyerConformityAt && (
									<ButtonOutline
										disabled={isLoading}
										onPress={() => onConformity("venta", transaction.id)}
									>
										Confirmar conformidad
									</ButtonOutline>
								)}
							{(transaction.status === "realizada" || transaction.status === "disputa") &&
								transaction.buyerConformityAt && (
									<ButtonOutline
										disabled={isLoading}
										onPress={() => onPrepareClosure(transaction.id)}
									>
										Preparar cierre económico
									</ButtonOutline>
								)}
							{transaction.status !== "disputa" &&
								(transaction.status === "activa"
									? Boolean(transaction.sellerConfirmedAt || transaction.buyerConfirmedAt)
									: transaction.status === "realizada" &&
										transaction.confirmationDeadlineAt !== null &&
										new Date() <= new Date(transaction.confirmationDeadlineAt)) && (
									<ButtonOutline
										disabled={isLoading}
										onPress={() => onIncident("venta", transaction.id)}
									>
										Registrar incidencia
									</ButtonOutline>
								)}
							{(transaction.status === "pendiente_respaldo" || transaction.status === "activa") &&
								!transaction.sellerConfirmedAt &&
								!transaction.buyerConfirmedAt && (
									<ButtonOutline
										disabled={isLoading}
										onPress={() => onCancel("venta", transaction.id)}
									>
										Cancelar operación
									</ButtonOutline>
								)}
							<ButtonOutline onPress={() => onChat(transaction.id)}>Abrir chat</ButtonOutline>
						</View>
					);
				})
			)}
		</View>
	);
}

function FinancialMovementGroup({
	movements,
	isLoading,
	onProcess,
	onPrepareClosure: _onPrepareClosure,
	isCancellation,
	onRetryMovement,
}: {
	movements: ReturnType<typeof useExchangeProposalStore.getState>["financialMovements"][string];
	isLoading: boolean;
	onProcess: () => Promise<void>;
	onPrepareClosure: () => Promise<void>;
	isCancellation: boolean;
	onRetryMovement: (movementId: number) => Promise<void>;
}) {
	const hasPending = movements.some((movement) => movement.status === "pendiente");
	const failedCancellationMovements = movements.filter(
		(movement) =>
			isCancellation &&
			movement.status === "fallido" &&
			(movement.type === "anulacion" || movement.type === "reembolso"),
	);
	return (
		<View style={styles.movementBox}>
			<Text style={styles.movementTitle}>Respaldos financieros simulados</Text>
			{movements.length === 0 ? (
				<Text style={styles.detailText}>No hay movimientos registrados.</Text>
			) : (
				movements.map((movement) => (
					<View key={movement.id} style={styles.movementRow}>
						<Text style={styles.detailText}>
							{movement.type} · {movement.concept.replace("_", " ")} · S/. {movement.amount.toFixed(2)}
						</Text>
						<Badge bordered>{movement.status}</Badge>
					</View>
				))
			)}
			{hasPending && (
				<ButtonOutline disabled={isLoading} onPress={() => onProcess()}>
					{isCancellation ? "Procesar devolución simulada" : "Procesar respaldo simulado"}
				</ButtonOutline>
			)}
			{failedCancellationMovements.map((movement) => (
				<ButtonOutline
					key={`retry-${movement.id}`}
					disabled={isLoading}
					onPress={() => onRetryMovement(movement.id)}
				>
					Reintentar devolución simulada
				</ButtonOutline>
			))}
			<Text style={styles.simulatedCaption}>
				Proveedor simulado; ningún movimiento administra fondos reales. Las comisiones no son ingresos hasta
				completar la operación.
			</Text>
		</View>
	);
}

function DeliveryStatus({
	firstLabel,
	firstAt,
	secondLabel,
	secondAt,
	completedAt,
	deadlineAt,
}: {
	firstLabel: string;
	firstAt: string | null;
	secondLabel: string;
	secondAt: string | null;
	completedAt: string | null;
	deadlineAt: string | null;
}) {
	const complete = Boolean(completedAt);
	return (
		<View style={styles.deliveryBox}>
			<Text style={styles.movementTitle}>
				{complete ? "Entrega completa" : firstAt || secondAt ? "Entrega parcial" : "Entrega pendiente"}
			</Text>
			<Text style={styles.detailText}>
				{firstLabel}: {firstAt ? new Date(firstAt).toLocaleString() : "Pendiente"}
			</Text>
			<Text style={styles.detailText}>
				{secondLabel}: {secondAt ? new Date(secondAt).toLocaleString() : "Pendiente"}
			</Text>
			{complete && completedAt && (
				<Text style={styles.detailText}>
					Entrega completa registrada: {new Date(completedAt).toLocaleString()}
				</Text>
			)}
			{complete && (
				<Text style={styles.simulatedCaption}>La entrega no completa financieramente la operación.</Text>
			)}
			{complete && deadlineAt && (
				<Text style={styles.detailText}>Límite de conformidad: {new Date(deadlineAt).toLocaleString()}</Text>
			)}
		</View>
	);
}

function ConformityStatus({
	firstLabel,
	firstAt,
	firstSource,
	secondLabel,
	secondAt,
	secondSource,
}: {
	firstLabel: string;
	firstAt: string | null;
	firstSource: "explicita" | "vencimiento" | null;
	secondLabel?: string;
	secondAt?: string | null;
	secondSource?: "explicita" | "vencimiento" | null;
}) {
	const render = (
		label: string,
		at: string | null | undefined,
		source: "explicita" | "vencimiento" | null | undefined,
	) =>
		`${label}: ${at ? `${new Date(at).toLocaleString()} (${source === "vencimiento" ? "aceptada por vencimiento" : "confirmada explícitamente"})` : "Pendiente"}`;
	return (
		<View style={styles.deliveryBox}>
			<Text style={styles.movementTitle}>Conformidad</Text>
			<Text style={styles.detailText}>{render(firstLabel, firstAt, firstSource)}</Text>
			{secondLabel && <Text style={styles.detailText}>{render(secondLabel, secondAt, secondSource)}</Text>}
		</View>
	);
}

function ConfirmActionModal({
	action,
	visible,
	isLoading,
	onCancel,
	onConfirm,
	disputeReason,
	disputeEvidenceUrl,
	onReasonChange,
	onEvidenceChange,
}: {
	action: "accept" | "reject" | "cancel" | "withdraw" | "delivery" | "conformity" | "dispute" | null;
	visible: boolean;
	isLoading: boolean;
	onCancel: () => void;
	onConfirm: () => void;
	disputeReason: string;
	disputeEvidenceUrl: string;
	onReasonChange: (value: string) => void;
	onEvidenceChange: (value: string) => void;
}) {
	if (!action) return null;
	const isAccept = action === "accept";
	const isCancel = action === "cancel";
	const isWithdraw = action === "withdraw";
	const isDelivery = action === "delivery";
	const isConformity = action === "conformity";
	const isDispute = action === "dispute";
	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
			<View style={styles.modalBackdrop}>
				<View style={styles.confirmCard}>
					<Text style={styles.confirmTitle}>
						{isAccept
							? "¿Aceptar propuesta?"
							: isCancel
								? "¿Cancelar operación?"
								: isWithdraw
									? "¿Retirar propuesta?"
									: isDelivery
										? "¿Registrar entrega?"
										: isConformity
											? "¿Confirmar conformidad?"
											: isDispute
												? "¿Registrar incidencia?"
												: "¿Rechazar propuesta?"}
					</Text>
					<Text style={styles.confirmText}>
						{isAccept
							? "Se reservarán ambos productos y se crearán la operación y sus condiciones acordadas."
							: isCancel
								? "Se solicitarán anulaciones o devoluciones simuladas. Los productos permanecerán reservados hasta confirmar todos los movimientos."
								: isDelivery
									? "Solo se registrará tu confirmación, con la fecha y hora actuales. La otra persona deberá registrar la suya por separado."
									: isConformity
										? "Se registrará tu conformidad explícita. La operación no se completará financieramente en esta etapa."
										: isDispute
											? "La operación pasará a disputa y la conformidad automática quedará bloqueada hasta una resolución posterior."
											: isWithdraw
												? "La propuesta pendiente pasará a cancelada y no generará movimientos financieros."
												: "La propuesta quedará como rechazada y no se reservarán productos."}
					</Text>
					{isDispute && (
						<View style={styles.disputeForm}>
							<TextInput
								value={disputeReason}
								onChangeText={onReasonChange}
								placeholder="Motivo de la incidencia"
								placeholderTextColor={colors.text.muted}
								multiline
								style={styles.disputeInput}
							/>
							<TextInput
								value={disputeEvidenceUrl}
								onChangeText={onEvidenceChange}
								placeholder="URL de evidencia (opcional)"
								placeholderTextColor={colors.text.muted}
								autoCapitalize="none"
								style={styles.disputeInput}
							/>
						</View>
					)}
					<View style={styles.actionRow}>
						<ButtonOutline disabled={isLoading} onPress={onCancel}>
							Cancelar
						</ButtonOutline>
						<ButtonRounded
							disabled={isLoading || (isDispute && disputeReason.trim().length === 0)}
							onPress={onConfirm}
						>
							{isAccept
								? "Aceptar"
								: isCancel || isWithdraw || isDelivery || isConformity || isDispute
									? "Confirmar"
									: "Rechazar"}
						</ButtonRounded>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	section: {
		width: "100%",
		paddingTop: spacing.xl,
		paddingHorizontal: spacing["2xl"],
		paddingBottom: spacing["2xl"],
	},
	content: {
		width: "100%",
		maxWidth: 1232,
		alignSelf: "center",
		gap: spacing.lg,
	},
	group: {
		gap: spacing.md,
	},
	groupTitle: {
		fontFamily: typography.family,
		fontSize: typography.size.lg,
		lineHeight: typography.lineHeight.xl,
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},
	proposalCard: {
		padding: spacing.lg,
		gap: spacing.sm,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.lg,
	},
	cardHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
		gap: spacing.md,
	},
	proposalTitle: {
		flex: 1,
		fontFamily: typography.family,
		fontSize: typography.size.md,
		lineHeight: typography.lineHeight.xl,
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},
	detailText: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.lg,
		color: colors.text.secondary,
	},
	movementBox: {
		gap: spacing.sm,
		padding: spacing.md,
		backgroundColor: colors.background.subtle,
		borderRadius: radius.md,
	},
	deliveryBox: {
		gap: spacing.xs,
		padding: spacing.md,
		backgroundColor: colors.background.subtle,
		borderRadius: radius.md,
	},
	movementTitle: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},
	movementRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.sm,
	},
	simulatedCaption: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.md,
		color: colors.text.muted,
	},
	actionRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: spacing.md,
		flexWrap: "wrap",
		paddingTop: spacing.sm,
	},
	modalBackdrop: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: spacing.lg,
		backgroundColor: "rgba(0, 0, 0, 0.45)",
	},
	confirmCard: {
		width: "100%",
		maxWidth: 480,
		padding: spacing.xl,
		gap: spacing.lg,
		backgroundColor: colors.background.surface,
		borderRadius: radius.lg,
		borderWidth: 1,
		borderColor: colors.border.default,
	},
	confirmTitle: {
		fontFamily: typography.family,
		fontSize: typography.size.lg,
		lineHeight: typography.lineHeight.xl,
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},
	confirmText: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.lg,
		color: colors.text.secondary,
	},
	disputeForm: {
		gap: spacing.sm,
	},
	disputeInput: {
		minHeight: 44,
		padding: spacing.sm,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.md,
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		color: colors.text.primary,
		backgroundColor: colors.background.subtle,
	},
});
