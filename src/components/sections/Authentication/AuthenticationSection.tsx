import { StyleProp, StyleSheet, Text, useWindowDimensions, View, ViewStyle } from "react-native";

import { Message } from "@/components/common/Message";
import { School, VerifiedUser } from "@/components/icons";
import MicrosoftLogo from "@/components/icons/MicrosoftLogo";
import { ButtonOutline } from "@/components/ui/Button";
import { boxShadows, colors, radius, responsive, spacing, typography } from "@/theme";

export interface AuthenticationSectionProps {
	onProviderPress?: () => void;
	style?: StyleProp<ViewStyle>;
}

export function AuthenticationSection({ onProviderPress, style }: AuthenticationSectionProps) {
	const { width } = useWindowDimensions();
	const isTableDown = responsive.isTabletDown(width);

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
					Continúa con tu cuenta institucional para acceder a la plataforma.
				</Text>

				<ButtonOutline
					size="large"
					icon={<MicrosoftLogo />}
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
