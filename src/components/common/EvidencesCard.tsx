import { Image } from "expo-image";
import {
	ImageSourcePropType,
	StyleProp,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
	ViewStyle,
} from "react-native";

import { HeaderSections } from "@/components/common/HeaderSections";
import { Message } from "@/components/common/Message";
import { ShieldLock, Verified } from "@/components/icons";
import { colors, radius, spacing, typography } from "@/theme";

export interface EvidenceItem {
	label: string;
	image?: ImageSourcePropType;
}

export interface EvidencesCardProps {
	evidences?: EvidenceItem[];
	style?: StyleProp<ViewStyle>;
}

const defaultEvidences: EvidenceItem[] = [
	{ label: "Evidencia 1 - Frontal" },
	{ label: "Evidencia 2 - Posterior" },
	{ label: "Evidencia 3 - Pantalla activa" },
];

export function EvidencesCard({ evidences = defaultEvidences, style }: EvidencesCardProps) {
	const { width } = useWindowDimensions();
	const isMobile = width < 700;

	return (
		<View style={[styles.card, style]}>
			<HeaderSections
				icon={<Verified size={20} color={colors.text.secondary} />}
				title="Evidencias del producto"
				description="Archivos capturados en vivo con confirmación de tenencia física para respaldo institucional y garantía entre estudiantes."
			/>

			<View style={[styles.evidences, isMobile && styles.mobileEvidences]}>
				{evidences.map((evidence) => (
					<View key={evidence.label} style={styles.evidenceCard}>
						{evidence.image ? (
							<Image contentFit="cover" source={evidence.image} style={styles.image} />
						) : (
							<View style={styles.placeholder}>
								<Text style={styles.placeholderText}>{evidence.label}</Text>
							</View>
						)}
					</View>
				))}
			</View>

			<Message
				icon={<ShieldLock size={16} color={colors.text.secondary} />}
				message="Estas evidencias quedarán asociadas de forma inmutable a la entrega y contrato de compra/intercambio."
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		width: "100%",
		padding: spacing.xl,
		gap: spacing.xl,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.xl,
	},
	evidences: {
		width: "100%",
		flexDirection: "row",
		gap: spacing.lg,
	},
	mobileEvidences: {
		flexDirection: "column",
	},
	evidenceCard: {
		flex: 1,
		minHeight: 183,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.background.subtle,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.lg,
		overflow: "hidden",
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	image: {
		width: "100%",
		height: "100%",
	},
	placeholder: {
		width: "100%",
		height: 181,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.background.subtle,
	},
	placeholderText: {
		paddingHorizontal: spacing.md,
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.md,
		textAlign: "center",
		color: colors.text.secondary,
	},
});
