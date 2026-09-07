import { StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import { CameraActionsCard } from "@/components/common/CameraActionsCard";
import { EvidencesCard } from "@/components/common/EvidencesCard";
import { ProductInformationCard } from "@/components/common/ProductInformationCard";
import { ProductPreviewCard } from "@/components/common/ProductPreviewCard";
import { spacing } from "@/theme";

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
	const isMobile = width < 900;

	return (
		<View style={[styles.section, isMobile && styles.mobileSection, style]}>
			<View style={[styles.layout, isMobile && styles.mobileLayout]}>
				<View style={styles.leftColumn}>
					<ProductInformationCard />

					<CameraActionsCard
						onCameraPress={onCameraPress}
						onVideoPress={onVideoPress}
						onUploadPress={onUploadPress}
					/>

					<EvidencesCard />
				</View>

				<View style={[styles.previewColumn, isMobile && styles.mobilePreviewColumn]}>
					<ProductPreviewCard onPublishPress={onPublishPress} onDraftPress={onDraftPress} />
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
	mobileSection: {
		padding: spacing.lg,
	},
	layout: {
		width: "100%",
		maxWidth: 1232,
		alignSelf: "center",
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing["2xl"],
	},
	mobileLayout: {
		flexDirection: "column",
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
	mobilePreviewColumn: {
		width: "100%",
	},
});
