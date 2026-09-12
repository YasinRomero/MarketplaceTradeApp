import { SearchBarGlobal, type SearchBarGlobalProps } from "@/components/common/SearchBarGlobal";
import { colors, primitives, radius, responsive, spacing, typography } from "@/theme";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

export interface HeroSectionProps {
	searchBarProps?: Omit<SearchBarGlobalProps, "style">;
}

export function HeroSection({ searchBarProps }: HeroSectionProps) {
	const { width } = useWindowDimensions();
	const horizontalPadding = responsive.isTabletDown(width) ? spacing.xl : 128;

	return (
		<View style={[styles.hero, { paddingHorizontal: horizontalPadding }]}>
			<View style={styles.decorativeTop} />
			<View style={styles.decorativeBottom} />

			<View style={styles.content}>
				<View style={styles.decoration}>
					<View style={styles.dot} />
					<View style={styles.dot} />
					<View style={styles.dot} />
				</View>

				<Text style={styles.title}>
					Intercambia lo que quieras{"\n"}
					<Text style={styles.highlightTitle}>con quien quieras</Text>
				</Text>

				<Text style={styles.description}>
					Desde tecnología y ropa hasta hobbies y más. El punto de encuentro estudiantil para darle vuelta a
					lo que tienes sin gastar de más.
				</Text>

				<SearchBarGlobal {...searchBarProps} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	hero: {
		width: "100%",
		minHeight: 550,
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 80,
		paddingBottom: 100,
		position: "relative",
		overflow: "hidden",
		backgroundColor: colors.background.page,
		borderBottomWidth: 1,
		borderBottomColor: colors.border.default,
	},

	decorativeTop: {
		position: "absolute",
		top: -48,
		right: -48,
		width: 384,
		height: 384,
		borderRadius: radius.full,
		backgroundColor: colors.card.red.transparent,
		opacity: 0.9,
	},

	decorativeBottom: {
		position: "absolute",
		bottom: -47,
		left: -48,
		width: 384,
		height: 384,
		borderRadius: radius.full,
		backgroundColor: primitives.neutral[200],
		opacity: 0.5,
	},

	content: {
		width: "100%",
		maxWidth: 896,
		alignItems: "center",
		gap: spacing.xl,
		zIndex: 2,
	},

	decoration: {
		width: 60,
		height: 24,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: spacing.sm,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.md,
		backgroundColor: colors.card.red.transparent,
		borderWidth: 1,
		borderColor: colors.action.primary,
		borderRadius: radius.full,
	},

	dot: {
		width: 6,
		height: 6,
		borderRadius: radius.full,
		backgroundColor: colors.action.primary,
	},

	title: {
		width: "100%",
		maxWidth: 768,
		fontFamily: typography.family,
		fontSize: typography.size["4xl"],
		lineHeight: typography.lineHeight["6xl"],
		fontWeight: typography.weight.bold,
		textAlign: "center",
		color: colors.text.primary,
	},

	highlightTitle: {
		color: colors.action.primary,
	},

	description: {
		width: "100%",
		maxWidth: 760,
		paddingBottom: spacing.lg,
		fontFamily: typography.family,
		fontSize: typography.size.md,
		lineHeight: typography.lineHeight.xl,
		fontWeight: typography.weight.regular,
		textAlign: "center",
		color: colors.text.primary,
	},
});
