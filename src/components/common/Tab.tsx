import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { Button, ButtonGhost, ButtonIcon } from "@/components/ui/Button";
import { colors, radius, spacing } from "@/theme";

export type TabVariant = "normal" | "icon";

export interface TabItem {
  id: string;
  label?: string;
  icon?: ReactNode;
}

export interface TabProps {
  tabs: TabItem[];
  selectedId?: string;
  variant?: TabVariant;
  onChange?: (id: string) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Tab({
  tabs,
  selectedId,
  variant = "normal",
  onChange,
  disabled = false,
  style,
}: TabProps) {
  return (
    <View style={[styles.container, variantStyles[variant], style]}>
      {tabs.map((tab) => {
        const isSelected = tab.id === selectedId;
        const onPress = () => onChange?.(tab.id);

        if (variant === "icon") {
          return (
            <ButtonIcon
              key={tab.id}
              icon={tab.icon}
              accessibilityLabel={tab.label ?? tab.id}
              variant={isSelected ? "primary" : "ghost"}
              disabled={disabled}
              onPress={onPress}
            />
          );
        }

        return isSelected ? (
          <Button
            key={tab.id}
            icon={tab.icon}
            disabled={disabled}
            onPress={onPress}
            style={styles.normalTab}
          >
            {tab.label ?? tab.id}
          </Button>
        ) : (
          <ButtonGhost
            key={tab.id}
            icon={tab.icon}
            disabled={disabled}
            onPress={onPress}
            style={styles.normalTab}
          >
            {tab.label ?? tab.id}
          </ButtonGhost>
        );
      })}
    </View>
  );
}

const variantStyles: Record<TabVariant, ViewStyle> = {
  normal: {
    width: "100%",
    maxWidth: 326,
    height: 44,
  },
  icon: {
    height: 42,
  },
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.xs,

    backgroundColor: colors.background.subtle,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.md,
  },

  normalTab: {
    flex: 1,
  },
});
