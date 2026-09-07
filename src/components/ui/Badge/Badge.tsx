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

interface BadgeProps {
  children: string;
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Badge({
  children,
  bordered = false,
  style,
  textStyle,
}: BadgeProps) {
  return (
    <View style={[styles.container, bordered && styles.bordered, style]}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",

    paddingVertical: 2,
    paddingHorizontal: 8,

    backgroundColor: colors.background.subtle,

    borderRadius: 999,
  },

  bordered: {
    borderWidth: 1,
    borderColor: colors.border.default,
  },

  text: {
    ...sharedBadgeStyles.text,

    fontWeight: "600",
    letterSpacing: 0.28,

    color: colors.text.primary,
  },
});
