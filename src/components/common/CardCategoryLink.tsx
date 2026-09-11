import { ReactNode } from "react";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { AccountCircle } from "@/components/icons";
import { colors, radius, spacing, typography } from "@/theme";

export type CardCategoryTone = keyof typeof colors.card;

export interface CardCategoryLinkProps {
	title: string;
	description: string;
	badges?: string[];
	tone?: CardCategoryTone;
	icon?: ReactNode;
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
}

export function CardCategoryLink({
	title,
	description,
	badges = [],
	tone = "red",
	icon = <AccountCircle size={24} color={colors.text.inverse} />,
	onPress,
	style,
}: CardCategoryLinkProps) {
	const palette = colors.card[tone];

	return (
		<Pressable
			accessibilityRole="button"
			onPress={onPress}
			style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
		>
			<View pointerEvents="none" style={[styles.decorative, { backgroundColor: palette.transparent }]} />

			<View style={styles.content}>
				<View style={[styles.icon, { backgroundColor: palette.background }]}>{icon}</View>

				<View style={styles.titleBlock}>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.description}>{description}</Text>
				</View>

				{badges.length > 0 && (
					<View style={styles.badges}>
						{badges.map((badge, index) => (
							<View key={`${badge}-${index}`} style={styles.badge}>
								<Text style={styles.badgeText}>{badge}</Text>
							</View>
						))}
					</View>
				)}
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: {
		width: "100%",
		maxWidth: 390,
		minHeight: 263,

		paddingTop: spacing.xl,
		paddingHorizontal: spacing.xl,
		paddingBottom: 70,

		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.xl,
		overflow: "hidden",

		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},

	pressed: {
		opacity: 0.9,
	},

	content: {
		width: "100%",
		zIndex: 1,
	},

	icon: {
		width: 48,
		height: 48,

		alignItems: "center",
		justifyContent: "center",
		borderRadius: radius.lg,
	},

	titleBlock: {
		paddingTop: spacing.sm,
		gap: spacing.sm,
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
		fontWeight: typography.weight.regular,
		color: colors.text.primary,
	},

	badges: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "flex-start",
		gap: 6,
		paddingTop: spacing.sm,
	},

	badge: {
		paddingVertical: spacing.xs,
		paddingHorizontal: 10,
		backgroundColor: colors.background.subtle,
		borderRadius: radius.md,
	},

	badgeText: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		fontWeight: typography.weight.regular,
		color: colors.text.primary,
	},

	decorative: {
		position: "absolute",
		top: 1,
		right: 1,
		width: 128,
		height: 128,
		borderBottomLeftRadius: radius.full,
	},
});
