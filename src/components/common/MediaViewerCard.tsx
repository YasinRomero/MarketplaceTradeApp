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
import { colors, radius, spacing, typography } from "@/theme";

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
	const isMobile = width < 600;
	const [selectedIndex, setSelectedIndex] = useState(() => getSafeIndex(initialIndex, images.length));
	const selectedImage = images[selectedIndex];

	const selectImage = (index: number) => {
		setSelectedIndex(index);
		onImageChange?.(index);
	};

	return (
		<View style={[styles.card, style]}>
			<View style={[styles.content, isMobile && styles.mobileContent]}>
				<ScrollView
					contentContainerStyle={styles.thumbnailsContent}
					horizontal={isMobile}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					style={[styles.thumbnails, isMobile && styles.mobileThumbnails]}
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
								style={[styles.thumbnail, isSelected && styles.selectedThumbnail]}
							>
								<Image contentFit="cover" source={image} style={styles.thumbnailImage} />
								{index === selectedIndex && (
									<View style={styles.selectedOverlay} pointerEvents="none" />
								)}
							</Pressable>
						);
					})}
				</ScrollView>

				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Ampliar imagen"
					disabled={!selectedImage}
					onPress={() => selectedImage && onZoomPress?.(selectedImage, selectedIndex)}
					style={[styles.stage, isMobile && styles.mobileStage]}
				>
					{selectedImage ? (
						<Image contentFit="cover" source={selectedImage} style={styles.mainImage} />
					) : (
						<Text style={styles.emptyText}>No hay imágenes disponibles</Text>
					)}

					{selectedImage && (
						<View style={styles.zoomPrompt} pointerEvents="none">
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
		padding: spacing.xl,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.lg,
	},
	content: {
		width: "100%",
		minHeight: 460,
		position: "relative",
		flexDirection: "row",
		alignItems: "stretch",
		gap: spacing.lg,
	},
	mobileContent: {
		minHeight: 0,
		flexDirection: "column",
		alignItems: "stretch",
	},
	thumbnails: {
		width: 80,
		maxHeight: 480,
		position: "absolute",
		top: 0,
		left: 0,
		zIndex: 1,
	},
	mobileThumbnails: {
		width: "100%",
		maxHeight: 80,
		position: "relative",
		top: "auto",
		left: "auto",
	},
	thumbnailsContent: {
		gap: spacing.md,
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
	selectedThumbnail: {
		borderColor: colors.action.primary,
		opacity: 1,
	},
	thumbnailImage: {
		width: "100%",
		height: "100%",
	},
	selectedOverlay: {
		...StyleSheet.absoluteFill,
		backgroundColor: "rgba(15, 23, 42, 0.12)",
	},
	stage: {
		flex: 1,
		flexBasis: 0,
		flexGrow: 1,
		flexShrink: 1,
		minWidth: 0,
		marginLeft: 104,
		minHeight: 460,
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
		flexBasis: "auto",
		marginLeft: 0,
		minHeight: 320,
	},
	mainImage: {
		width: "100%",
		height: "100%",
		borderRadius: radius.md,
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
	},
	zoomText: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.md,
		color: colors.text.secondary,
	},
});
