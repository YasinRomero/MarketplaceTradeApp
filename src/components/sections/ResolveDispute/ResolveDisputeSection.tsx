import { HeaderSections } from "@/components/common/HeaderSections";
import { Message } from "@/components/common/Message";
import { Badge } from "@/components/ui/Badge/Badge";
import { ButtonOutline, ButtonRounded } from "@/components/ui/Button";
import { mockUsers } from "@/mocks/products";
import { Dispute, DisputeDecision } from "@/schemas/dispute";
import { isModerator } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import { useExchangeProposalStore } from "@/stores/exchangeProposalStore";
import { colors, radius, spacing, typography } from "@/theme";
import { DisputeOperationContext } from "@/types/dispute";
import { useEffect, useState } from "react";
import { StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";

export interface ResolveDisputeSectionProps {
	style?: StyleProp<ViewStyle>;
}

export function ResolveDisputeSection({ style }: ResolveDisputeSectionProps) {
	const {
		disputes,
		disputeEvidences,
		disputeOperationContexts,
		isLoading,
		error,
		loadDisputesForModerator,
		assignDispute,
		resolveDispute,
	} = useExchangeProposalStore();
	const currentUser = useAuthStore((state) => state.currentUser);
	const [feedback, setFeedback] = useState<string | null>(null);

	useEffect(() => {
		if (currentUser && isModerator(currentUser)) loadDisputesForModerator(currentUser.id);
	}, [currentUser, loadDisputesForModerator]);

	return (
		<View style={[styles.section, style]}>
			<View style={styles.content}>
				<HeaderSections
					title="Disputas Pendientes"
					description="Consulta incidencias y registra la decisión del moderador."
					size="2xl"
				/>
				{!currentUser && (
					<Message
						title="Inicia sesión para continuar"
						message="La revisión de disputas requiere una cuenta institucional."
					/>
				)}
				{currentUser && !isModerator(currentUser) && (
					<Message
						title="Acceso restringido"
						message="Solo un moderador activo puede revisar y resolver disputas."
					/>
				)}
				{currentUser && isModerator(currentUser) && isLoading && (
					<Message title="Cargando disputas" message="Estamos consultando las incidencias registradas." />
				)}
				{error && !isLoading && <Message title="No se pudieron cargar las disputas" message={error} />}
				{feedback && <Message title="Disputa actualizada" message={feedback} />}
				{currentUser && isModerator(currentUser) && !isLoading && disputes.length === 0 && (
					<Message title="Sin disputas" message="No existen incidencias registradas para revisar." />
				)}
				{currentUser &&
					isModerator(currentUser) &&
					disputes.map((dispute) => (
						<DisputeCard
							key={dispute.id}
							dispute={dispute}
							evidenceUrls={(disputeEvidences[dispute.id] ?? []).map(
								(evidence) => `${evidence.type}: ${evidence.url}`,
							)}
							operationContext={disputeOperationContexts[dispute.id]}
							isLoading={isLoading}
							onAssign={async () => {
								if (await assignDispute(dispute.id, currentUser.id))
									setFeedback("Disputa asignada al moderador y marcada en revisión.");
							}}
							onResolve={async (decision, resolution, requiresProductReturn) => {
								if (
									await resolveDispute({
										disputeId: dispute.id,
										moderatorId: currentUser.id,
										decision,
										resolution,
										requiresProductReturn,
									})
								) {
									setFeedback(
										"Decisión registrada. La operación conserva sus reservas y queda pendiente de las etapas financieras posteriores.",
									);
								}
							}}
						/>
					))}
			</View>
		</View>
	);
}

function DisputeCard({
	dispute,
	evidenceUrls,
	operationContext,
	isLoading,
	onAssign,
	onResolve,
}: {
	dispute: Dispute;
	evidenceUrls: string[];
	operationContext?: DisputeOperationContext;
	isLoading: boolean;
	onAssign: () => Promise<void>;
	onResolve: (decision: DisputeDecision, resolution: string, requiresProductReturn: boolean) => Promise<void>;
}) {
	const [decision, setDecision] = useState<DisputeDecision>("liberar_respaldo");
	const [resolution, setResolution] = useState("");
	const [requiresProductReturn, setRequiresProductReturn] = useState(false);
	const currentModeratorId = useAuthStore((state) => state.currentUser?.id);
	const claimant = mockUsers.find((user) => user.id === dispute.claimantId);
	const canResolve = dispute.status === "en_revision" && dispute.moderatorId === currentModeratorId;

	return (
		<View style={styles.card}>
			<View style={styles.cardHeader}>
				<Text style={styles.cardTitle}>
					Disputa #{dispute.id} · Operación #{dispute.transactionId}
				</Text>
				<Badge bordered>{dispute.status}</Badge>
			</View>
			<Text style={styles.detailText}>Reclamante: {claimant?.fullName ?? `Usuario #${dispute.claimantId}`}</Text>
			<Text style={styles.detailText}>Motivo: {dispute.reason}</Text>
			<Text style={styles.detailText}>
				Moderador: {dispute.moderatorId ? `Usuario #${dispute.moderatorId}` : "Sin asignar"}
			</Text>
			{operationContext && (
				<View style={styles.evidenceBox}>
					<Text style={styles.label}>Condiciones acordadas</Text>
					<Text style={styles.detailText}>
						Tipo: {operationContext.type} · Estado: {operationContext.status}
					</Text>
					<Text style={styles.detailText}>
						Participantes:{" "}
						{operationContext.participantIds
							.map((id) => mockUsers.find((user) => user.id === id)?.fullName ?? `Usuario #${id}`)
							.join(" · ")}
					</Text>
					<Text style={styles.detailText}>
						Productos: {operationContext.productIds.map((id) => `#${id}`).join(" · ")}
					</Text>
					{operationContext.price !== null && (
						<Text style={styles.detailText}>Precio acordado: S/. {operationContext.price.toFixed(2)}</Text>
					)}
					{operationContext.referenceValues.length > 0 && (
						<Text style={styles.detailText}>
							Valores referenciales:{" "}
							{operationContext.referenceValues.map((value) => `S/. ${value.toFixed(2)}`).join(" · ")}
						</Text>
					)}
					{operationContext.additionalAmount > 0 && (
						<Text style={styles.detailText}>
							Monto adicional: S/. {operationContext.additionalAmount.toFixed(2)}
						</Text>
					)}
				</View>
			)}
			<View style={styles.evidenceBox}>
				<Text style={styles.label}>Evidencias del reclamo</Text>
				{evidenceUrls.length === 0 ? (
					<Text style={styles.detailText}>No se adjuntaron evidencias.</Text>
				) : (
					evidenceUrls.map((evidence) => (
						<Text key={evidence} style={styles.detailText}>
							{evidence}
						</Text>
					))
				)}
			</View>
			<View style={styles.evidenceBox}>
				<Text style={styles.label}>Evidencias previas de la operación</Text>
				{!operationContext?.evidence?.media.length ? (
					<Text style={styles.detailText}>No hay referencia histórica disponible.</Text>
				) : (
					operationContext.evidence.media.map((media) => (
						<Text key={`${media.id}-${media.url}`} style={styles.detailText}>
							{media.type}: {media.url}
						</Text>
					))
				)}
			</View>
			{dispute.status === "abierta" && (
				<ButtonRounded disabled={isLoading} onPress={() => onAssign()}>
					Asignar a moderación
				</ButtonRounded>
			)}
			{canResolve && (
				<View style={styles.resolutionBox}>
					<Text style={styles.label}>Decisión y justificación</Text>
					<View style={styles.actionRow}>
						{(
							[
								"liberar_respaldo",
								"devolver_fondos",
								"distribuir_fondos",
								"devolver_productos",
							] as DisputeDecision[]
						).map((option) => (
							<ButtonOutline key={option} disabled={isLoading} onPress={() => setDecision(option)}>
								{option.replace("_", " ")}
							</ButtonOutline>
						))}
					</View>
					<TextInput
						value={resolution}
						onChangeText={setResolution}
						placeholder="Justificación de la decisión"
						placeholderTextColor={colors.text.muted}
						multiline
						style={styles.input}
					/>
					<ButtonOutline
						disabled={isLoading || resolution.trim().length === 0}
						onPress={() => onResolve(decision, resolution.trim(), requiresProductReturn)}
					>
						Registrar decisión
					</ButtonOutline>
					<ButtonOutline disabled={isLoading} onPress={() => setRequiresProductReturn((value) => !value)}>
						{requiresProductReturn
							? "Solicitar devolución de productos: sí"
							: "Solicitar devolución de productos: no"}
					</ButtonOutline>
				</View>
			)}
			{dispute.status === "resuelta" && (
				<Text style={styles.detailText}>
					Decisión: {dispute.decision?.replace("_", " ")} · {dispute.resolution}
				</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		width: "100%",
		paddingTop: spacing.xl,
		paddingHorizontal: spacing["2xl"],
		paddingBottom: spacing["2xl"],
	},
	content: { width: "100%", maxWidth: 1232, alignSelf: "center", gap: spacing.lg },
	card: {
		padding: spacing.lg,
		gap: spacing.sm,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.lg,
	},
	cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing.md },
	cardTitle: {
		flex: 1,
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
	label: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},
	evidenceBox: {
		gap: spacing.xs,
		padding: spacing.md,
		backgroundColor: colors.background.subtle,
		borderRadius: radius.md,
	},
	resolutionBox: { gap: spacing.sm, paddingTop: spacing.sm },
	actionRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
	input: {
		minHeight: 72,
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
