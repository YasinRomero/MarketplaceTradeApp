import { ImageSourcePropType, StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import { CardProduct } from "@/components/common/CardProduct";
import { HeaderSections } from "@/components/common/HeaderSections";
import { Message } from "@/components/common/Message";
import { Publish, Verified } from "@/components/icons";
import { ButtonOutline, ButtonRounded } from "@/components/ui/Button";
import { boxShadows, colors, radius, responsive, spacing } from "@/theme";

export interface ProductPreviewCardProps {
	image?: ImageSourcePropType;
	category?: string;
	title?: string;
	description?: string;
	price?: string;
	primaryBadge?: string;
	secondaryBadge?: string;
	onPublishPress?: () => void;
	onDraftPress?: () => void;
	style?: StyleProp<ViewStyle>;
}

export function ProductPreviewCard({
	image,
	category = "Tecnología · Computadoras",
	title = "Laptop Lenovo ThinkPad",
	description = "Laptop en buen estado, ideal para clases y trabajo diario.",
	price = "S/. 450.00",
	primaryBadge = "Venta",
	secondaryBadge = "Universidad",
	onPublishPress,
	onDraftPress,
	style,
}: ProductPreviewCardProps) {
	const { width } = useWindowDimensions();
	const isTabletDown = responsive.isTabletDown(width);

	return (
		<View style={[styles.card, isTabletDown && styles.mobileCard, style]}>
			<HeaderSections size="compact" title="Vista previa del anuncio" />

			<CardProduct
				image={image}
				primaryBadge={primaryBadge}
				secondaryBadge={secondaryBadge}
				span={category}
				title={title}
				description={description}
				price={price}
				onActionPress={onPublishPress}
			/>

			<Message
				icon={<Verified size={16} color={colors.text.secondary} />}
				message="Publicación vinculada automáticamente a tu perfil verificado. Tu sede universitaria se toma directo de tu cuenta."
			/>

			<View style={styles.actions}>
				<ButtonRounded
					icon={<Publish size={16} color={colors.action.primaryForeground} />}
					onPress={onPublishPress}
					style={styles.actionButton}
				>
					Publicar producto
				</ButtonRounded>
				<ButtonOutline onPress={onDraftPress} style={[styles.actionButton, styles.draftButton]}>
					Guardar como borrador
				</ButtonOutline>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		width: "100%",
		minHeight: 848,
		padding: spacing.xl,
		gap: spacing.lg,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.xl,
		boxShadow: boxShadows.default,
		elevation: 1,
	},

	mobileCard: {
		minHeight: 0,
	},

	actions: {
		width: "100%",
		gap: spacing.sm,
		paddingTop: spacing.sm,
	},

	actionButton: {
		width: "100%",
	},

	draftButton: {
		borderColor: colors.text.primary,
	},
});
