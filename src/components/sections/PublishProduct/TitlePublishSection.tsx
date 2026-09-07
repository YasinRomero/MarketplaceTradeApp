import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { HeaderSections } from "@/components/common/HeaderSections";
import { Distance } from "@/components/icons";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { colors, primitives, spacing, typography } from "@/theme";

export function TitlePublishSection() {
	const { width } = useWindowDimensions();
	const isMobile = width < 768;

	return (
		<View style={[styles.section, isMobile && styles.mobileSection]}>
			<View style={styles.breadcrumb}>
				<Breadcrumb items={[{ label: "Inicio" }, { label: "Publicar producto" }]} />
			</View>

			<View style={[styles.content, isMobile && styles.mobileContent]}>
				<HeaderSections
					size="2xl"
					title="Publicar producto"
					description="Comparte o publica directamente con estudiantes y docentes de tu comunidad universitaria."
					style={[styles.header, isMobile && styles.mobileHeader]}
					titleStyle={[styles.title, isMobile && styles.mobileTitle]}
					descriptionStyle={styles.description}
				/>

				<View style={[styles.locationCard, isMobile && styles.mobileLocationCard]}>
					<Distance size={18} color={colors.action.primary} />
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
		paddingTop: spacing.xl,
		paddingHorizontal: spacing["2xl"],
		paddingBottom: spacing.xl,
		gap: spacing.lg,
		backgroundColor: colors.background.surface,
		borderBottomWidth: 1,
		borderBottomColor: colors.border.default,
	},

	mobileSection: {
		paddingTop: spacing.lg,
		paddingHorizontal: spacing.lg,
	},

	content: {
		width: "100%",
		maxWidth: 1232,
		alignSelf: "center",
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "space-between",
		gap: spacing.xl,
	},

	breadcrumb: {
		width: "100%",
		maxWidth: 1232,
		alignSelf: "center",
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

	mobileTitle: {
		fontSize: typography.size.authTitle,
		lineHeight: typography.lineHeight["3xl"],
		letterSpacing: -0.5,
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

	mobileLocationCard: {
		width: "100%",
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
