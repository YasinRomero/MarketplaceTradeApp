import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { HeaderSections } from "@/components/common/HeaderSections";
import { Message } from "@/components/common/Message";
import { DeployedCode, News } from "@/components/icons";
import { colors, radius, spacing, typography } from "@/theme";

export interface DescriptionAcademicContextCardProps {
	description?: string;
	academicContext?: string;
	contextTitle?: string;
	style?: StyleProp<ViewStyle>;
}

const defaultDescription =
	"¡Hola comunidad! Pongo a disposición mi iPad Air con chip M1 adquirido hace dos meses para el semestre académico de Ingeniería. Lo utilicé exclusivamente para lectura de papers en GoodNotes y diagramación de bases de datos. Está en estado 10/10, cero rayas o marcas de desgaste, siempre con mica de vidrio mate aplicada desde el primer minuto.";

const defaultAcademicContext =
	"Motivo de venta / permuta: Para las materias de compiladores y arquitectura de software de este nuevo ciclo necesito obligatoriamente un entorno nativo Linux/Windows con 16GB o 32GB RAM. Por eso estoy abierto tanto a venta directa como a permuta equivalente con ajuste razonable.";

export function DescriptionAcademicContextCard({
	description = defaultDescription,
	academicContext = defaultAcademicContext,
	contextTitle = "Contexto académico",
	style,
}: DescriptionAcademicContextCardProps) {
	return (
		<View style={[styles.card, style]}>
			<HeaderSections
				size="xl"
				icon={<News size={20} color={colors.text.secondary} />}
				title="Descripción y contexto académico"
			/>

			<View style={styles.content}>
				<Text style={styles.description}>{description}</Text>
				<Text style={[styles.description, styles.academicContext]}>{academicContext}</Text>

				<Message
					icon={
						<View style={styles.contextIcon}>
							<DeployedCode size={16} color={colors.card.blue.foreground} />
						</View>
					}
					title={contextTitle}
					message="Relacionar el producto con tu contexto académico ayuda a que otros estudiantes encuentren una opción útil para sus necesidades."
					style={styles.contextMessage}
					messageStyle={styles.messageText}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		width: "100%",
		padding: spacing.xl,
		gap: spacing.lg,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.lg,
	},
	content: {
		width: "100%",
		gap: spacing.lg,
	},
	description: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: 23,
		fontWeight: typography.weight.regular,
		color: colors.text.secondary,
	},
	academicContext: {
		fontWeight: typography.weight.bold,
	},
	contextMessage: {
		padding: spacing.md,
		minHeight: 85,
	},
	contextIcon: {
		width: 24,
		height: 24,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.card.blue.background,
		borderRadius: radius.md,
	},
	messageText: {
		lineHeight: typography.lineHeight.lg,
	},
});
