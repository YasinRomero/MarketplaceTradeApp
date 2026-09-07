import { Image } from "expo-image";
import { ReactNode } from "react";
import {
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { PhotoCamera, Upload, Videocam } from "@/components/icons";
import { Badge } from "@/components/ui/Badge/Badge";
import { ButtonIcon, ButtonOutline } from "@/components/ui/Button";
import { colors, radius, spacing, typography } from "@/theme";

export interface CameraDisplayProps {
  image?: ImageSourcePropType;
  badges?: string[];
  cameraIcon?: ReactNode;
  videoIcon?: ReactNode;
  uploadIcon?: ReactNode;
  onCameraPress?: () => void;
  onVideoPress?: () => void;
  onUploadPress?: () => void;
  uploadLabel?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function CameraDisplay({
  image,
  badges = [],
  cameraIcon = (
    <PhotoCamera size={24} color={colors.action.primaryForeground} />
  ),
  videoIcon = <Videocam size={24} color={colors.action.primaryForeground} />,
  uploadIcon = <Upload size={16} color={colors.action.secondaryForeground} />,
  onCameraPress,
  onVideoPress,
  onUploadPress,
  uploadLabel = "Subir imagen",
  disabled = false,
  style,
}: CameraDisplayProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.media}>
        {image && (
          <Image contentFit="cover" source={image} style={styles.image} />
        )}

        {badges.length > 0 && (
          <View style={styles.badges}>
            {badges.map((badge) => (
              <Badge
                key={badge}
                style={styles.badge}
                textStyle={styles.badgeText}
              >
                {badge}
              </Badge>
            ))}
          </View>
        )}
      </View>

      <View style={styles.actionsBar}>
        <View style={styles.mainActions}>
          <ButtonIcon
            icon={cameraIcon}
            accessibilityLabel="Tomar foto"
            size="large"
            disabled={disabled}
            onPress={onCameraPress}
          />

          <ButtonIcon
            icon={videoIcon}
            accessibilityLabel="Grabar video"
            size="large"
            disabled={disabled}
            onPress={onVideoPress}
          />
        </View>

        <ButtonOutline
          icon={uploadIcon}
          disabled={disabled}
          onPress={onUploadPress}
          style={styles.uploadButton}
        >
          {uploadLabel}
        </ButtonOutline>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 435,
    minHeight: 300,

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
    height: 72,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  mainActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  uploadButton: {
    height: 36,
  },
});
