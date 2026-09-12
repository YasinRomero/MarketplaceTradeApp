import { CameraActionsCard } from "@/components/common/CameraActionsCard";
import { EvidencesCard } from "@/components/common/EvidencesCard";
import { ProductInformation, ProductInformationCard } from "@/components/common/ProductInformationCard";
import { ProductPreviewCard } from "@/components/common/ProductPreviewCard";
import { responsive, spacing } from "@/theme";
import { useState } from "react";
import { StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

export interface PublishProductSectionProps {
	onCameraPress?: () => void;
	onVideoPress?: () => void;
	onUploadPress?: () => void;
	onPublishPress?: () => void;
	onDraftPress?: () => void;
	style?: StyleProp<ViewStyle>;
}

export function PublishProductSection({
	onCameraPress,
	onVideoPress,
	onUploadPress,
	onPublishPress,
	onDraftPress,
	style,
}: PublishProductSectionProps) {
	const { width } = useWindowDimensions();
	const isTabletDown = responsive.isTabletDown(width);

	const [product, setProduct] = useState<ProductInformation>({
		title: "Laptop Lenovo ThinkPad",
		category: "Tecnología",
		subcategory: "Computadoras",
		mode: "sell",
		price: "450.00",
		description: "Completa los datos esenciales de tu publicación",
	});

	const modeLabel = {
		sell: "Venta",
		exchange: "Intercambio",
		both: "Ambos",
	}[product.mode];

	const previewPrice = product.price ? `S/. ${product.price}` : "S/. 0.00";

	return (
		<View style={[styles.section, isTabletDown && styles.mobileSection, style]}>
			<View style={[styles.layout, isTabletDown && styles.mobileLayout]}>
				<View style={styles.leftColumn}>
					<ProductInformationCard onChange={setProduct} />

					<CameraActionsCard
						onCameraPress={onCameraPress}
						onVideoPress={onVideoPress}
						onUploadPress={onUploadPress}
					/>

					<EvidencesCard />
				</View>

				<View style={[styles.previewColumn, isTabletDown && styles.mobilePreviewColumn]}>
					<ProductPreviewCard
						category={`${product.category} · ${product.subcategory}`}
						title={product.title}
						description={product.description}
						price={previewPrice}
						primaryBadge={modeLabel}
						onPublishPress={onPublishPress}
						onDraftPress={onDraftPress}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		width: "100%",
		padding: spacing["2xl"],
	},

	layout: {
		width: "100%",
		maxWidth: 1232,
		alignSelf: "center",
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing["2xl"],
	},

	leftColumn: {
		flex: 1,
		minWidth: 0,
		gap: spacing["2xl"],
	},

	previewColumn: {
		width: 389,
		maxWidth: "100%",
	},

	// Mobile Responsive
	mobileSection: {
		padding: spacing.lg,
	},

	mobileLayout: {
		flexDirection: "column",
	},

	mobilePreviewColumn: {
		width: "100%",
	},
});
