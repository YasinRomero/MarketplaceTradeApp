import { HeaderSections } from "@/components/common/HeaderSections";
import { Message } from "@/components/common/Message";
import { BadgeBlack } from "@/components/ui/Badge/BadgeBlack";
import { BadgeWhite } from "@/components/ui/Badge/BadgeWhite";
import { ButtonOutline, ButtonRounded } from "@/components/ui/Button";
import { Product, ProductDraft, ProductStatus } from "@/schemas/product";
import { useAuthStore } from "@/stores/authStore";
import { useProductStore } from "@/stores/productStore";
import { colors, radius, responsive, spacing, typography } from "@/theme";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, StyleProp, StyleSheet, Text, useWindowDimensions, View, ViewStyle } from "react-native";

export interface PublicationsSectionProps {
	style?: StyleProp<ViewStyle>;
}

type OwnedPublication = Product | ProductDraft;

const categoryNames: Record<number, string> = {
	10: "Tecnología",
	11: "Libros",
	12: "Ropa",
};

const statusLabels: Record<ProductStatus, string> = {
	borrador: "Borrador",
	activo: "Activo",
	reservado: "Reservado",
	finalizado: "Finalizado",
	inactivo: "Inactivo",
};

const modeLabels = {
	venta: "Venta",
	intercambio: "Intercambio",
	ambas: "Venta e intercambio",
} as const;

function PublicationCard({
	publication,
	onEdit,
	onStatusAction,
}: {
	publication: OwnedPublication;
	onEdit: (id: number) => void;
	onStatusAction: (publication: OwnedPublication, action: "activate" | "deactivate") => void;
}) {
	const image = publication.media.find((media) => media.type === "imagen");
	const status = publication.status as ProductStatus;
	const category = publication.categoryId
		? (categoryNames[publication.categoryId] ?? "Categoría")
		: "Categoría pendiente";

	return (
		<View style={styles.card}>
			<View style={styles.media}>
				{image ? (
					<Image contentFit="cover" source={{ uri: image.url }} style={styles.image} />
				) : (
					<View style={styles.emptyMedia}>
						<Text style={styles.emptyMediaText}>Sin fotografía</Text>
					</View>
				)}
				<View style={styles.badges}>
					<BadgeBlack>{statusLabels[status]}</BadgeBlack>
					<BadgeWhite>{modeLabels[publication.mode]}</BadgeWhite>
				</View>
			</View>

			<View style={styles.content}>
				<Text style={styles.category}>{category}</Text>
				<Text numberOfLines={2} style={styles.title}>
					{publication.title.trim() || "Borrador sin título"}
				</Text>
				<Text numberOfLines={3} style={styles.description}>
					{publication.description.trim() || "Sin descripción registrada."}
				</Text>

				<View style={styles.details}>
					{publication.salePrice !== null && (
						<View style={styles.detailRow}>
							<Text style={styles.detailLabel}>Precio de venta</Text>
							<Text style={styles.detailValue}>{`S/. ${publication.salePrice.toFixed(2)}`}</Text>
						</View>
					)}
					{publication.referenceValue !== null && (
						<View style={styles.detailRow}>
							<Text style={styles.detailLabel}>Valor referencial</Text>
							<Text style={styles.detailValue}>{`S/. ${publication.referenceValue.toFixed(2)}`}</Text>
						</View>
					)}
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Evidencias</Text>
						<Text style={styles.detailValue}>{publication.media.length}</Text>
					</View>
				</View>

				{(status === "activo" || status === "borrador" || status === "inactivo") && (
					<View style={styles.actions}>
						<ButtonRounded onPress={() => onEdit(publication.id)} style={styles.actionButton}>
							Editar
						</ButtonRounded>
						{(status === "activo" || status === "inactivo") && (
							<ButtonOutline
								onPress={() =>
									onStatusAction(publication, status === "activo" ? "deactivate" : "activate")
								}
								style={styles.actionButton}
							>
								{status === "activo" ? "Desactivar" : "Activar"}
							</ButtonOutline>
						)}
					</View>
				)}
			</View>
		</View>
	);
}

export function PublicationsSection({ style }: PublicationsSectionProps) {
	const router = useRouter();
	const { width } = useWindowDimensions();
	const isTabletDown = responsive.isTabletDown(width);
	const currentUser = useAuthStore((state) => state.currentUser);
	const { ownedProducts, isLoading, error, loadOwnedProducts, activate, deactivate } = useProductStore();
	const [statusAction, setStatusAction] = useState<"idle" | "activated" | "deactivated">("idle");
	const [pendingAction, setPendingAction] = useState<{
		publication: OwnedPublication;
		action: "activate" | "deactivate";
	} | null>(null);
	const ownerId = currentUser?.id;

	useEffect(() => {
		if (ownerId !== undefined) loadOwnedProducts(ownerId);
	}, [loadOwnedProducts, ownerId]);

	const handleEdit = (id: number) => {
		router.push({ pathname: "/publishproduct", params: { productId: String(id) } });
	};

	const handleStatusAction = (publication: OwnedPublication, action: "activate" | "deactivate") => {
		setStatusAction("idle");
		setPendingAction({ publication, action });
	};

	const confirmStatusAction = () => {
		if (!pendingAction || ownerId === undefined) return;
		const { publication, action } = pendingAction;
		void (action === "activate" ? activate(publication.id, ownerId) : deactivate(publication.id, ownerId)).then(
			() => {
				if (!useProductStore.getState().error)
					setStatusAction(action === "activate" ? "activated" : "deactivated");
				setPendingAction(null);
			},
		);
	};

	return (
		<View style={[styles.section, isTabletDown && styles.mobileSection, style]}>
			<View style={styles.container}>
				<HeaderSections
					size="2xl"
					title="Mis publicaciones"
					description="Consulta las publicaciones y borradores pertenecientes a tu cuenta."
				/>

				{!currentUser && (
					<Message
						title="Inicia sesión para continuar"
						message="Solo puedes administrar tus propias publicaciones con una cuenta institucional."
					/>
				)}
				{currentUser && isLoading && (
					<Message title="Cargando publicaciones" message="Estamos consultando tus productos." />
				)}
				{currentUser && error && !isLoading && <Message title="No se pudieron cargar" message={error} />}
				{statusAction === "activated" && !error && (
					<Message title="Publicación activada" message="Volvió a estar disponible en el catálogo." />
				)}
				{statusAction === "deactivated" && !error && (
					<Message title="Publicación desactivada" message="Ya no aparece como disponible en el catálogo." />
				)}
				{currentUser && !isLoading && !error && ownedProducts.length === 0 && (
					<Message
						title="Aún no tienes publicaciones"
						message="Tus borradores y publicaciones activas aparecerán aquí."
					/>
				)}

				{currentUser && !isLoading && !error && ownedProducts.length > 0 && (
					<View style={styles.grid}>
						{ownedProducts.map((publication) => (
							<PublicationCard
								key={publication.id}
								publication={publication}
								onEdit={handleEdit}
								onStatusAction={handleStatusAction}
							/>
						))}
					</View>
				)}

				<Modal
					visible={Boolean(pendingAction)}
					transparent
					animationType="fade"
					onRequestClose={() => setPendingAction(null)}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalCard}>
							<Text style={styles.modalTitle}>
								{pendingAction?.action === "activate"
									? "Activar publicación"
									: "Desactivar publicación"}
							</Text>
							<Text style={styles.modalMessage}>
								{pendingAction?.action === "activate"
									? `¿Deseas volver a publicar "${pendingAction.publication.title || "esta publicación"}"? Se validarán sus evidencias.`
									: `¿Deseas retirar "${pendingAction?.publication.title || "esta publicación"}" del catálogo?`}
							</Text>
							<View style={styles.modalActions}>
								<ButtonOutline onPress={() => setPendingAction(null)} style={styles.modalButton}>
									Cancelar
								</ButtonOutline>
								<ButtonRounded onPress={confirmStatusAction} style={styles.modalButton}>
									{pendingAction?.action === "activate" ? "Activar" : "Desactivar"}
								</ButtonRounded>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		width: "100%",
		padding: spacing["2xl"],
		backgroundColor: colors.background.page,
	},
	mobileSection: {
		padding: spacing.lg,
	},
	container: {
		width: "100%",
		maxWidth: 1232,
		alignSelf: "center",
	},
	grid: {
		width: "100%",
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.xl,
	},
	card: {
		flexGrow: 1,
		flexBasis: 320,
		maxWidth: 380,
		minHeight: 420,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.xl,
		overflow: "hidden",
		boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
		elevation: 1,
	},
	media: {
		height: 210,
		padding: spacing.sm,
		position: "relative",
		backgroundColor: colors.background.subtle,
	},
	image: {
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		width: "100%",
		height: "100%",
	},
	emptyMedia: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	emptyMediaText: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		color: colors.text.secondary,
	},
	badges: {
		zIndex: 1,
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	content: {
		padding: spacing.xl,
		gap: spacing.sm,
	},
	category: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		color: colors.text.secondary,
	},
	title: {
		fontFamily: typography.family,
		fontSize: typography.size.md,
		lineHeight: typography.lineHeight["2xl"],
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},
	description: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.lg,
		color: colors.text.secondary,
	},
	details: {
		marginTop: spacing.md,
		paddingTop: spacing.md,
		gap: spacing.sm,
		borderTopWidth: 1,
		borderTopColor: colors.border.default,
	},
	detailRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: spacing.sm,
	},
	detailLabel: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		color: colors.text.secondary,
	},
	detailValue: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		fontWeight: typography.weight.semibold,
		color: colors.text.primary,
	},
	actions: {
		marginTop: spacing.md,
		gap: spacing.sm,
	},
	actionButton: {
		width: "100%",
	},
	modalOverlay: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: spacing.lg,
		backgroundColor: "rgba(0, 0, 0, 0.72)",
	},
	modalCard: {
		width: "100%",
		maxWidth: 480,
		padding: spacing.xl,
		gap: spacing.lg,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.xl,
	},
	modalTitle: {
		fontFamily: typography.family,
		fontSize: typography.size.lg,
		lineHeight: typography.lineHeight.xl,
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},
	modalMessage: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.lg,
		color: colors.text.secondary,
	},
	modalActions: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: spacing.sm,
	},
	modalButton: {
		flex: 1,
	},
});
