import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { colors } from "@/theme/colors";
import { sharedBadgeStyles } from "./badge.styles";

interface BadgeOutlineProps {
  children: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function BadgeOutline({
  children,
  style,
  textStyle,
}: BadgeOutlineProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",

    paddingVertical: 4,
    paddingHorizontal: 12,

    borderWidth: 1,
    borderColor: colors.border.default,

    borderRadius: 999,
  },

  text: {
    ...sharedBadgeStyles.text,

    fontWeight: "600",
    letterSpacing: 0.28,

    color: colors.text.primary,
  },
});
