import { Image } from "expo-image";
import { useState } from "react";
import {
	ImageSourcePropType,
	Pressable,
	ScrollView,
	StyleProp,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
	ViewStyle,
} from "react-native";

import { ZoomIn } from "@/components/icons";
import { colors, radius, responsive, spacing, typography } from "@/theme";

export interface MediaViewerCardProps {
	images: ImageSourcePropType[];
	initialIndex?: number;
	zoomLabel?: string;
	onImageChange?: (index: number) => void;
	onZoomPress?: (image: ImageSourcePropType, index: number) => void;
	style?: StyleProp<ViewStyle>;
}

export function MediaViewerCard({
	images,
	initialIndex = 0,
	zoomLabel = "Haz clic para ampliar",
	onImageChange,
	onZoomPress,
	style,
}: MediaViewerCardProps) {
	const { width } = useWindowDimensions();
	const isTabletDown = responsive.isTabletDown(width);

	const [selectedIndex, setSelectedIndex] = useState(() => getSafeIndex(initialIndex, images.length));
	const safeSelectedIndex = getSafeIndex(selectedIndex, images.length);
	const selectedImage = images[safeSelectedIndex];

	const selectImage = (index: number) => {
		setSelectedIndex(index);
		onImageChange?.(index);
	};

	return (
		<View style={[styles.card, isTabletDown && styles.mobileCard, style]}>
			<View style={[styles.content, isTabletDown && styles.mobileContent]}>
				<ScrollView
					horizontal={isTabletDown}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={[styles.thumbnailsContent, isTabletDown && styles.mobileThumbnailsContent]}
					style={[styles.thumbnails, isTabletDown && styles.mobileThumbnails]}
				>
					{images.map((image, index) => {
						const isSelected = index === selectedIndex;

						return (
							<Pressable
								key={index}
								accessibilityRole="button"
								accessibilityLabel={`Ver imagen ${index + 1}`}
								accessibilityState={{ selected: isSelected }}
								onPress={() => selectImage(index)}
								style={[
									styles.thumbnail,
									isTabletDown && styles.mobileThumbnail,
									isSelected && styles.selectedThumbnail,
								]}
							>
								<Image contentFit="cover" source={image} style={styles.thumbnailImage} />

								{isSelected && <View style={styles.selectedOverlay} />}
							</Pressable>
						);
					})}
				</ScrollView>

				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Ampliar imagen"
					disabled={!selectedImage}
					onPress={() => selectedImage && onZoomPress?.(selectedImage, selectedIndex)}
					style={[styles.stage, isTabletDown && styles.mobileStage]}
				>
					{selectedImage ? (
						<Image contentFit="contain" source={selectedImage} style={styles.mainImage} />
					) : (
						<Text style={styles.emptyText}>No hay imágenes disponibles</Text>
					)}

					{selectedImage && (
						<View style={styles.zoomPrompt}>
							<ZoomIn size={12} color={colors.text.secondary} />

							<Text style={styles.zoomText}>{zoomLabel}</Text>
						</View>
					)}
				</Pressable>
			</View>
		</View>
	);
}

function getSafeIndex(index: number, length: number) {
	if (length === 0) return 0;

	return Math.min(Math.max(index, 0), length - 1);
}

const styles = StyleSheet.create({
	card: {
		width: "100%",
		alignSelf: "stretch",
		padding: spacing.xl,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.lg,
	},

	mobileCard: {
		width: "100%",
		maxWidth: "100%",
		alignSelf: "stretch",
		padding: spacing.md,
	},

	content: {
		width: "100%",
		flexDirection: "row",
		alignItems: "stretch",
		gap: spacing.lg,
	},

	mobileContent: {
		width: "100%",
		maxWidth: "100%",
		flexDirection: "column",
		gap: spacing.md,
	},

	thumbnails: {
		width: 80,
		maxHeight: 480,
		flexGrow: 0,
		flexShrink: 0,
	},

	mobileThumbnails: {
		width: "100%",
		maxWidth: "100%",
		maxHeight: 72,
		flexGrow: 0,
		flexShrink: 0,
	},

	thumbnailsContent: {
		gap: spacing.md,
	},

	mobileThumbnailsContent: {
		flexDirection: "row",
		paddingRight: spacing.sm,
	},

	thumbnail: {
		width: 80,
		height: 80,
		position: "relative",
		alignItems: "stretch",
		justifyContent: "center",
		borderWidth: 2,
		borderColor: colors.border.default,
		borderRadius: radius.md,
		overflow: "hidden",
		opacity: 0.8,
	},

	mobileThumbnail: {
		width: 64,
		height: 64,
	},

	selectedThumbnail: {
		borderColor: colors.action.primary,
		opacity: 1,
	},

	thumbnailImage: {
		width: "100%",
		height: "100%",
	},

	selectedOverlay: {
		pointerEvents: "none",
		backgroundColor: "rgba(15, 23, 42, 0.12)",
	},

	stage: {
		flex: 1,
		minWidth: 0,
		height: 480,
		position: "relative",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.background.subtle,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.md,
		overflow: "hidden",
	},

	mobileStage: {
		width: "100%",
		maxWidth: "100%",
		flex: 0,
		height: undefined,
		minHeight: 280,
		aspectRatio: 4 / 3,
		alignSelf: "stretch",
	},

	mainImage: {
		width: "100%",
		height: "100%",
	},

	emptyText: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.md,
		color: colors.text.secondary,
	},

	zoomPrompt: {
		position: "absolute",
		right: spacing.md,
		bottom: spacing.md,
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		paddingVertical: spacing.xs,
		paddingHorizontal: 10,
		backgroundColor: "rgba(255, 255, 255, 0.85)",
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.full,
		pointerEvents: "none",
	},

	zoomText: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.md,
		color: colors.text.secondary,
	},
});
