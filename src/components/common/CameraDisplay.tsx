import { PhotoCamera, Videocam } from "@/components/icons";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button, ButtonIcon, ButtonOutline } from "@/components/ui/Button";
import { colors, radius, responsive, spacing, typography } from "@/theme";
import { Image } from "expo-image";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
	Animated,
	ImageSourcePropType,
	Platform,
	StyleProp,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
	ViewStyle,
} from "react-native";

export interface CameraDisplayProps {
	image?: ImageSourcePropType;
	stream?: MediaStream | null;
	cameraStatus?: CameraStatus;
	captureLabel?: string;
	cameraIcon?: ReactNode;
	videoIcon?: ReactNode;
	uploadIcon?: ReactNode;
	onCameraPress?: () => void;
	onVideoPress?: () => void;
	onStartCamera?: () => void;
	onStopCamera?: () => void;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
}

export type CameraStatus = "off" | "starting" | "on" | "recording";

export function CameraDisplay({
	image,
	stream = null,
	cameraStatus = "off",
	captureLabel = "Sin archivos",
	cameraIcon = <PhotoCamera size={24} color={colors.action.primaryForeground} />,
	videoIcon = <Videocam size={24} color={colors.action.primaryForeground} />,
	onCameraPress,
	onVideoPress,
	onStartCamera,
	onStopCamera,
	disabled = false,
	style,
}: CameraDisplayProps) {
	const { width } = useWindowDimensions();
	const isTabletUp = responsive.isTabletUp(width);
	const liveVideoRef = useRef<HTMLVideoElement | null>(null);
	const [pulseOpacity] = useState(() => new Animated.Value(1));

	useEffect(() => {
		const video = liveVideoRef.current;
		if (!video || Platform.OS !== "web") return;
		video.srcObject = stream;
		if (stream) video.play().catch(() => undefined);
		return () => {
			if (video.srcObject === stream) video.srcObject = null;
		};
	}, [stream]);

	useEffect(() => {
		if (cameraStatus !== "recording") {
			pulseOpacity.stopAnimation();
			pulseOpacity.setValue(1);
			return;
		}

		const pulse = Animated.loop(
			Animated.sequence([
				Animated.timing(pulseOpacity, { toValue: 0.3, duration: 600, useNativeDriver: true }),
				Animated.timing(pulseOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
			]),
		);

		pulse.start();

		return () => pulse.stop();
	}, [cameraStatus, pulseOpacity]);

	const canCapture = cameraStatus === "on" || cameraStatus === "recording";

	return (
		<View style={[styles.card, isTabletUp && styles.desktopCard, style]}>
			<View style={styles.media}>
				{Platform.OS === "web" && stream ? (
					<video ref={liveVideoRef} autoPlay muted playsInline style={styles.liveVideo} />
				) : (
					image && <Image contentFit="cover" source={image} style={styles.image} />
				)}

				<View style={styles.indicators}>
					<Badge style={styles.badge} textStyle={styles.badgeText}>
						Vista previa
					</Badge>
					<View style={styles.captureIndicator}>
						{cameraStatus === "recording" && (
							<Animated.View style={[styles.recordingDot, { opacity: pulseOpacity }]} />
						)}
						<Text style={styles.badgeText}>
							{cameraStatus === "recording" ? "Grabando..." : captureLabel}
						</Text>
					</View>
				</View>
			</View>

			<View style={styles.actionsBar}>
				<View style={styles.mainActions}>
					<ButtonIcon icon={cameraIcon} disabled={disabled || !canCapture} onPress={onCameraPress} />
					<ButtonIcon icon={videoIcon} disabled={disabled || !canCapture} onPress={onVideoPress} />
				</View>

				{cameraStatus === "off" && (
					<Button disabled={disabled} onPress={onStartCamera}>
						Iniciar cámara
					</Button>
				)}
				{cameraStatus === "starting" && <Button disabled>Solicitando cámara...</Button>}
				{cameraStatus !== "off" && cameraStatus !== "starting" && (
					<ButtonOutline disabled={disabled || cameraStatus === "recording"} onPress={onStopCamera}>
						Apagar cámara
					</ButtonOutline>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		width: "100%",
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.lg,
		overflow: "hidden",
	},

	media: {
		width: "100%",
		height: 375,
		minHeight: 240,
		padding: spacing.md,
		position: "relative",
		backgroundColor: colors.background.subtle,
	},

	liveVideo: {
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		width: "100%",
		height: "100%",
		objectFit: "cover",
		backgroundColor: colors.background.subtle,
	},

	image: {
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},

	indicators: {
		zIndex: 1,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	captureIndicator: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		paddingVertical: 2,
		paddingHorizontal: spacing.sm,
		backgroundColor: colors.background.subtle,
		borderRadius: radius.full,
	},

	recordingDot: {
		width: 7,
		height: 7,
		borderRadius: radius.full,
		backgroundColor: colors.action.primary,
	},

	badge: {
		paddingVertical: spacing.xs,
		paddingHorizontal: 10,
		borderRadius: radius.md,
	},

	badgeText: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		fontWeight: typography.weight.regular,
		color: colors.text.primary,
	},

	actionsBar: {
		width: "100%",
		padding: spacing.md,
		flexDirection: "row",
		justifyContent: "space-between",
	},

	mainActions: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
	},

	// Desktop Responsive
	desktopCard: {
		maxWidth: 480,
	},
});
