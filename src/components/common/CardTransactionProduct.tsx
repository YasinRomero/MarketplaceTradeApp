import { ReactNode } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { ChangeCircle, IdCard2, Security, ShoppingBag, VerifiedUser } from "@/components/icons";
import { Badge } from "@/components/ui/Badge/Badge";
import { BadgeBlack } from "@/components/ui/Badge/BadgeBlack";
import { ButtonOutline, ButtonRounded } from "@/components/ui/Button";
import { colors, radius, spacing, typography } from "@/theme";

export interface TransactionReview {
	message: string;
	icon?: ReactNode;
}

export interface CardTransactionProductProps {
	primaryBadge: string;
	secondaryBadge: string;
	title: string;
	price: string;
	priceDescription: string;
	reviews: TransactionReview[];
	securityMessage: string;
	primaryActionLabel?: string;
	secondaryActionLabel?: string;
	onPrimaryAction?: () => void;
	onSecondaryAction?: () => void;
	style?: StyleProp<ViewStyle>;
}

export function CardTransactionProduct({
	primaryBadge,
	secondaryBadge,
	title,
	price,
	priceDescription,
	reviews,
	securityMessage,
	primaryActionLabel = "Solicitar Intercambio",
	secondaryActionLabel = "Comprar Ahora",
	onPrimaryAction,
	onSecondaryAction,
	style,
}: CardTransactionProductProps) {
	return (
		<View style={[styles.card, style]}>
			<View style={styles.badges}>
				<BadgeBlack>{primaryBadge}</BadgeBlack>
				<Badge bordered style={styles.secondaryBadge} textStyle={styles.secondaryBadgeText}>
					{secondaryBadge}
				</Badge>
			</View>

			<View style={styles.titleSection}>
				<Text style={styles.title}>{title}</Text>
			</View>

			<View style={styles.priceSection}>
				<View style={styles.priceBlock}>
					<Text style={styles.price}>{price}</Text>
					<Text style={styles.priceDescription}>{priceDescription}</Text>
				</View>
			</View>

			<View style={styles.reviewsSection}>
				<View style={styles.reviewCard}>
					{reviews.map((review, index) => (
						<ReviewRow
							key={`${review.message}-${index}`}
							icon={
								review.icon ??
								(index === 0 ? (
									<VerifiedUser size={16} color={colors.text.secondary} />
								) : (
									<IdCard2 size={16} color={colors.text.secondary} />
								))
							}
							message={review.message}
						/>
					))}
				</View>
			</View>

			<View style={styles.actions}>
				<ButtonRounded
					size="xlarge"
					icon={<ChangeCircle size={16} color={colors.action.primaryForeground} />}
					onPress={onPrimaryAction}
					style={styles.primaryButton}
				>
					{primaryActionLabel}
				</ButtonRounded>

				<ButtonOutline
					size="xlarge"
					icon={<ShoppingBag size={16} color={colors.text.secondary} />}
					onPress={onSecondaryAction}
					style={styles.secondaryButton}
				>
					{secondaryActionLabel}
				</ButtonOutline>
			</View>

			<View style={styles.securitySection}>
				<View style={styles.securityMessage}>
					<Security size={16} color={colors.text.secondary} />
					<Text style={styles.securityText}>{securityMessage}</Text>
				</View>
			</View>
		</View>
	);
}

interface ReviewRowProps {
	icon: ReactNode;
	message: string;
}

function ReviewRow({ icon, message }: ReviewRowProps) {
	return (
		<View style={styles.reviewRow}>
			{icon}
			<Text style={styles.reviewText}>{message}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		width: "100%",
		maxWidth: 390,
		minHeight: 586,

		padding: spacing.xl,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.lg,
	},

	badges: {
		width: "100%",
		minHeight: 37,
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing.sm,
		paddingBottom: spacing.md,
	},

	secondaryBadge: {
		paddingVertical: spacing.xs,
		paddingHorizontal: spacing.md,
		borderRadius: radius.full,
	},

	secondaryBadgeText: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		fontWeight: typography.weight.semibold,
		letterSpacing: 0.28,
		color: colors.text.primary,
	},

	titleSection: {
		width: "100%",
		paddingBottom: spacing.md,
	},

	title: {
		fontFamily: typography.family,
		fontSize: typography.size.lg,
		lineHeight: 25,
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},

	priceSection: {
		width: "100%",
		paddingBottom: spacing.lg,
	},

	priceBlock: {
		width: "100%",
		gap: 2,
		paddingBottom: spacing.lg,
		borderBottomWidth: 1,
		borderBottomColor: colors.border.default,
	},

	price: {
		fontFamily: typography.family,
		fontSize: typography.size["transactionMoney"],
		lineHeight: typography.lineHeight["3xl"],
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},

	priceDescription: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: 16,
		fontWeight: typography.weight.regular,
		letterSpacing: 0.12,
		color: colors.text.secondary,
	},

	reviewsSection: {
		width: "100%",
		paddingBottom: spacing.xl,
	},

	reviewCard: {
		width: "100%",
		minHeight: 124,
		padding: spacing.lg,
		gap: 10,
		backgroundColor: colors.background.subtle,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.lg,
	},

	reviewRow: {
		width: "100%",
		minHeight: 40,
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},

	reviewText: {
		flex: 1,
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.lg,
		fontWeight: typography.weight.regular,
		color: colors.text.secondary,
	},

	actions: {
		width: "100%",
		gap: spacing.md,
	},

	primaryButton: {
		width: "100%",
		height: 48,
	},

	secondaryButton: {
		width: "100%",
		height: 50,
	},

	securitySection: {
		width: "100%",
		paddingTop: spacing.lg,
		borderTopWidth: 1,
		borderTopColor: colors.border.default,
	},

	securityMessage: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},

	securityText: {
		flex: 1,
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.lg,
		fontWeight: typography.weight.regular,
		color: colors.text.secondary,
	},
});
