import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { HeaderSections } from "@/components/common/HeaderSections";
import { Domain } from "@/components/icons";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { colors, primitives, spacing, typography } from "@/theme";

export function TitlePublishSection() {
	const { width } = useWindowDimensions();
	const isMobile = width < 768;

	return (
		<View style={styles.section}>
			<Breadcrumb items={[{ label: "Inicio" }, { label: "Publicar producto" }]} />

			<View style={[styles.content, isMobile && styles.mobileContent]}>
				<HeaderSections
					size="2xl"
					title="Publicar producto"
					description="Comparte o publica directamente con estudiantes y docentes de tu comunidad universitaria."
					style={[styles.header, isMobile && styles.mobileHeader]}
					titleStyle={styles.title}
					descriptionStyle={styles.description}
				/>

				<View style={styles.locationCard}>
					<Domain size={18} color={colors.action.primary} />
					<View>
						<Text style={styles.locationLabel}>Sede asignada</Text>
						<Text style={styles.locationValue}>Sede</Text>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		width: "100%",
		paddingHorizontal: spacing["2xl"],
		paddingBottom: spacing.xl,
		gap: 6,
		backgroundColor: colors.background.surface,
		borderBottomWidth: 1,
		borderBottomColor: colors.border.default,
	},

	content: {
		width: "100%",
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "space-between",
		gap: spacing.xl,
	},

	mobileContent: {
		alignItems: "flex-start",
		flexDirection: "column",
	},

	header: {
		flex: 1,
		paddingBottom: 0,
		borderBottomWidth: 0,
	},

	mobileHeader: {
		width: "100%",
	},

	title: {
		fontSize: typography.size["2xl"],
		lineHeight: 45,
		letterSpacing: -0.75,
	},

	description: {
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.lg,
	},

	locationCard: {
		minWidth: 120,
		minHeight: 42,
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 6,
		paddingHorizontal: spacing.md,
		gap: 10,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: spacing.md,
	},

	locationLabel: {
		fontFamily: typography.family,
		fontSize: typography.size.xxs,
		lineHeight: 13,
		fontWeight: typography.weight.medium,
		color: primitives.neutral[900],
	},

	locationValue: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		fontWeight: typography.weight.bold,
		letterSpacing: 0.5,
		color: colors.text.primary,
	},
});
