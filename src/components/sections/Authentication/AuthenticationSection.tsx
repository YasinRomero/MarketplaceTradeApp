import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { Message } from "@/components/common/Message";
import { School, VerifiedUser } from "@/components/icons";
import { ButtonOutline } from "@/components/ui/Button";
import { colors, radius, spacing, typography } from "@/theme";

export interface AuthenticationSectionProps {
	onProviderPress?: () => void;
	style?: StyleProp<ViewStyle>;
}

export function AuthenticationSection({ onProviderPress, style }: AuthenticationSectionProps) {
	return (
		<View style={[styles.section, style]}>
			<View style={styles.card}>
				<View style={styles.brandIcon}>
					<School size={28} color={colors.action.primary} />
				</View>

				<View style={styles.titleBlock}>
					<Text style={styles.title}>Accede a la comunidad</Text>
				</View>

				<Text style={styles.description}>
					Continúa con tu cuenta institucional para acceder a la plataforma.
				</Text>

				<ButtonOutline
					size="xlarge"
					icon={<MicrosoftMark />}
					onPress={onProviderPress}
					style={styles.providerButton}
				>
					Continuar con Microsoft
				</ButtonOutline>

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

function MicrosoftMark() {
	const squares = [
		{ color: "#F25022", position: "topLeft" as const },
		{ color: "#7FBA00", position: "topRight" as const },
		{ color: "#00A4EF", position: "bottomLeft" as const },
		{ color: "#FFB900", position: "bottomRight" as const },
	];

	return (
		<View style={styles.microsoftMark} accessibilityLabel="Microsoft">
			{squares.map(({ color, position }) => (
				<View
					key={position}
					style={[styles.microsoftSquare, microsoftPositions[position], { backgroundColor: color }]}
				/>
			))}
		</View>
	);
}

const microsoftPositions = {
	topLeft: { top: 0, left: 0 },
	topRight: { top: 0, right: 0 },
	bottomLeft: { bottom: 0, left: 0 },
	bottomRight: { bottom: 0, right: 0 },
};

const styles = StyleSheet.create({
	section: {
		width: "100%",
		minHeight: 663,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 96,
		paddingHorizontal: spacing.lg,
		backgroundColor: colors.background.surface,
	},
	card: {
		width: "100%",
		maxWidth: 448,
		padding: 40,
		gap: spacing.md,
		alignItems: "center",
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.xl + spacing.sm,
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
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
		borderColor: "#D1D5DB",
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
	microsoftMark: {
		width: 20,
		height: 20,
		position: "relative",
	},
	microsoftSquare: {
		position: "absolute",
		width: 9,
		height: 9,
	},
});
