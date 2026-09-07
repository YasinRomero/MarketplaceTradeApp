import { StyleSheet } from "react-native";

export type ButtonSize = "normal" | "large" | "xlarge";
export type IconPosition = "left" | "right";

export const buttonSizeStyles = StyleSheet.create({
  normal: {
    minHeight: 34,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
  },

  large: {
    minHeight: 42,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },

  xlarge: {
    minHeight: 48,
    paddingVertical: 15,
    paddingHorizontal: 24,
    gap: 6,
  },
});

export const sharedButtonStyles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },

  rounded: {
    borderRadius: 999,
  },

  label: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "400",
    textAlign: "center",
  },

  icon: {
    justifyContent: "center",
    alignItems: "center",
  },

  disabled: {
    opacity: 0.5,
  },
});
