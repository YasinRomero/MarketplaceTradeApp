import { useEffect, useState } from "react";
import { StyleProp, StyleSheet, Text, useWindowDimensions, View, ViewStyle } from "react-native";

import { Message } from "@/components/common/Message";
import { School, VerifiedUser } from "@/components/icons";
import MicrosoftLogo from "@/components/icons/MicrosoftLogo";
import { ButtonOutline, ButtonRounded } from "@/components/ui/Button";
import { InputSelect } from "@/components/ui/InputSelect";
import { listMockUsers } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import { boxShadows, colors, radius, responsive, spacing, typography } from "@/theme";
import { useRouter } from "expo-router";

export interface AuthenticationSectionProps {
	onProviderPress?: () => void;
	style?: StyleProp<ViewStyle>;
}

export function AuthenticationSection({ onProviderPress, style }: AuthenticationSectionProps) {
	const router = useRouter();
	const { currentUser, isLoading, error, signInAsMockUser, signOut } = useAuthStore();
	const [users, setUsers] = useState<Awaited<ReturnType<typeof listMockUsers>>>([]);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(currentUser?.id ?? null);
	const { width } = useWindowDimensions();
	const isTableDown = responsive.isTabletDown(width);

	useEffect(() => {
		listMockUsers().then(setUsers);
	}, []);

	const effectiveSelectedUserId = selectedUserId;
	const selectedUser = users.find((user) => user.id === effectiveSelectedUserId);

	const handleSignIn = async () => {
		if (effectiveSelectedUserId === null) return;

		const user = await signInAsMockUser(effectiveSelectedUserId);

		if (user) {
			onProviderPress?.();
			router.replace("/marketplace");
		}
	};

	return (
		<View style={[styles.section, isTableDown && styles.mobileSection, style]}>
			<View style={[styles.card, isTableDown && styles.mobileCard]}>
				<View style={styles.brandIcon}>
					<School size={28} color={colors.action.primary} />
				</View>

				<View style={styles.titleBlock}>
					<Text style={styles.title}>Accede a la comunidad</Text>
				</View>

				<Text style={styles.description}>
					Selecciona una cuenta institucional mock para continuar. Microsoft OAuth no se conecta en esta
					etapa.
				</Text>

				<Text style={styles.fieldLabel}>Cuenta institucional simulada</Text>

				<InputSelect
					value={selectedUser ? `${selectedUser.fullName} · ${selectedUser.role}` : "Selecciona un usuario"}
					options={users.map((user) => `${user.id} · ${user.fullName} · ${user.role}`)}
					variant="outline"
					onChange={(value) => setSelectedUserId(Number(value.split(" ")[0]))}
					containerStyle={styles.userSelect}
				/>

				<ButtonOutline
					size="large"
					icon={<MicrosoftLogo />}
					disabled={isLoading || effectiveSelectedUserId === null}
					onPress={() => handleSignIn()}
					style={styles.providerButton}
				>
					Continuar con Microsoft (simulado)
				</ButtonOutline>
				{currentUser && (
					<ButtonRounded disabled={isLoading} onPress={signOut}>
						Cerrar sesión simulada
					</ButtonRounded>
				)}
				{error && <Message title="No se pudo iniciar sesión" message={error} />}

				<Message
					icon={
						<View style={styles.messageIcon}>
							<VerifiedUser size={16} color={colors.action.primary} />
						</View>
					}
					title="Acceso institucional seguro"
					message="Usa tu cuenta institucional para mantener tu identidad verificada. No compartiremos tus credenciales ni almacenaremos tu contraseña."
					style={styles.securityMessage}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 96,
		backgroundColor: colors.background.surface,
	},

	card: {
		width: "100%",
		maxWidth: 450,
		padding: 40,
		gap: spacing.md,
		alignItems: "center",
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.xl + spacing.sm,
		boxShadow: boxShadows.default,
		elevation: 1,
	},

	brandIcon: {
		width: 58,
		height: 58,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.card.red.background,
		borderWidth: 1,
		borderColor: colors.card.red.transparent,
		borderRadius: radius.xl,
	},

	titleBlock: {
		paddingTop: spacing.sm,
	},

	title: {
		fontFamily: typography.family,
		fontSize: 30,
		lineHeight: 38,
		fontWeight: typography.weight.bold,
		textAlign: "center",
		color: colors.text.primary,
	},

	description: {
		maxWidth: 307,
		paddingBottom: spacing.sm,
		fontFamily: typography.family,
		fontSize: typography.size.base,
		lineHeight: 20,
		fontWeight: typography.weight.regular,
		textAlign: "center",
		color: colors.text.secondary,
	},

	providerButton: {
		width: "100%",
	},

	fieldLabel: {
		alignSelf: "stretch",
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},

	userSelect: {
		width: "100%",
	},

	securityMessage: {
		width: "100%",
		minHeight: 125,
		padding: spacing.md,
	},

	messageIcon: {
		width: 24,
		height: 24,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.card.red.background,
		borderRadius: radius.md,
	},

	// Mobile Responsive
	mobileSection: {
		paddingHorizontal: spacing.md,
	},

	mobileCard: {
		paddingHorizontal: spacing.lg,
	},
});
