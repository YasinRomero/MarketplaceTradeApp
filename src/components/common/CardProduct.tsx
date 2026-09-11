import { Image } from "expo-image";
import { ImageSourcePropType, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { BadgeBlack } from "@/components/ui/Badge/BadgeBlack";
import { BadgeWhite } from "@/components/ui/Badge/BadgeWhite";
import { Button } from "@/components/ui/Button";
import { colors, primitives, radius, spacing, typography } from "@/theme";

export interface CardProductProps {
	image?: ImageSourcePropType;
	primaryBadge?: string;
	secondaryBadge?: string;
	span: string;
	title: string;
	description: string;
	price: string;
	priceLabel?: string;
	actionLabel?: string;
	onActionPress?: () => void;
	style?: StyleProp<ViewStyle>;
}

export function CardProduct({
	image,
	primaryBadge,
	secondaryBadge,
	span,
	title,
	description,
	price,
	priceLabel = "PRECIO DE REFERENCIA",
	actionLabel = "Ver producto",
	onActionPress,
	style,
}: CardProductProps) {
	return (
		<View style={[styles.card, style]}>
			<View style={styles.media}>
				{image && <Image contentFit="cover" source={image} style={styles.image} />}

				{(primaryBadge || secondaryBadge) && (
					<View style={styles.badges}>
						{primaryBadge ? <BadgeBlack>{primaryBadge}</BadgeBlack> : <View />}
						{secondaryBadge ? <BadgeWhite>{secondaryBadge}</BadgeWhite> : <View />}
					</View>
				)}
			</View>

			<View style={styles.content}>
				<View style={styles.displayInfo}>
					<Text style={styles.span}>{span}</Text>
					<Text numberOfLines={2} style={styles.title}>
						{title}
					</Text>
					<Text numberOfLines={2} style={styles.description}>
						{description}
					</Text>
				</View>

				<View style={styles.actions}>
					<View style={styles.priceBlock}>
						<Text numberOfLines={1} style={styles.priceLabel}>
							{priceLabel}
						</Text>
						<Text style={styles.price}>{price}</Text>
					</View>

					<Button onPress={onActionPress}>{actionLabel}</Button>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		width: "100%",
		maxWidth: 380,
		minHeight: 485,

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

	media: {
		height: 290,
		padding: spacing.sm,
		justifyContent: "flex-start",
		position: "relative",

		backgroundColor: colors.background.subtle,
	},

	image: {
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},

	badges: {
		zIndex: 1,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	content: {
		minHeight: 193,
		padding: spacing.xl,
		justifyContent: "space-between",
	},

	displayInfo: {
		paddingBottom: spacing.lg,
		gap: 6,
	},

	span: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		fontWeight: typography.weight.regular,
		color: primitives.neutral[900],
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
		color: primitives.neutral[900],
	},

	actions: {
		minHeight: 60,
		paddingTop: spacing.lg,
		flexDirection: "row",
		flexWrap: "nowrap",
		alignItems: "flex-end",
		justifyContent: "space-between",
		gap: spacing.lg,

		borderTopWidth: 1,
		borderTopColor: colors.border.default,
	},

	priceBlock: {
		flex: 1,
		minWidth: 150,
		flexShrink: 0,
		gap: 0,
	},

	priceLabel: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		fontWeight: typography.weight.bold,
		letterSpacing: 0.5,
		color: colors.text.primary,
	},

	price: {
		fontFamily: typography.family,
		fontSize: typography.size.lg,
		lineHeight: typography.lineHeight["3xl"],
		fontWeight: typography.weight.bold,
		color: primitives.neutral[900],
	},
});
