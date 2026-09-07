import { ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { Close, KeyboardArrowDown } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { InputSelect } from "@/components/ui/InputSelect";
import { colors, radius, spacing, typography } from "@/theme";

export interface MarketplaceFilterChip {
  id: string;
  label: string;
  onRemove?: () => void;
}

export interface MarketplaceFiltersProps {
  resultCount: string | number;
  resultLabel?: string;
  activeFilters?: MarketplaceFilterChip[];
  sortValue?: string;
  sortIcon?: ReactNode;
  onSortPress?: () => void;
  onClearFilters?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function MarketplaceFilters({
  resultCount,
  resultLabel = "publicaciones disponibles",
  activeFilters = [],
  sortValue = "Relevancia",
  sortIcon,
  onSortPress,
  onClearFilters,
  style,
}: MarketplaceFiltersProps) {
  const arrowIcon = (
    <KeyboardArrowDown size={24} color={colors.text.secondary} />
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.displayFilters}>
        <View style={styles.resultSummary}>
          <Text style={styles.resultCount}>{resultCount}</Text>
          <Text style={styles.resultLabel}>{resultLabel}</Text>
        </View>

        {activeFilters.length > 0 && (
          <View style={styles.chips}>
            {activeFilters.map((filter) => (
              <View key={filter.id} style={styles.chip}>
                <Text numberOfLines={1} style={styles.chipText}>
                  {filter.label}
                </Text>

                <Pressable
                  accessibilityLabel={`Quitar ${filter.label}`}
                  accessibilityRole="button"
                  onPress={filter.onRemove}
                  style={styles.removeButton}
                >
                  <Close size={12} color={colors.text.secondary} />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.displayActions}>
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Ordenar por:</Text>
          <InputSelect
            value={sortValue}
            rightIcon={sortIcon ?? arrowIcon}
            iconPosition="right"
            size="compact"
            disabled={!onSortPress}
            onPress={onSortPress}
            containerStyle={styles.sortSelect}
            textStyle={styles.selectText}
          />
        </View>

        <Button onPress={onClearFilters}>Limpiar filtros</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 1232,
    minHeight: 110,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing["2xl"],
    padding: spacing.lg,

    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.lg,
  },

  displayFilters: {
    width: 354,
    gap: 10,
  },

  resultSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  resultCount: {
    fontFamily: typography.family,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },

  resultLabel: {
    fontFamily: typography.family,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.md,
    fontWeight: typography.weight.regular,
    color: colors.text.secondary,
  },

  chips: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  chip: {
    maxWidth: 220,
    minHeight: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: 2,
    paddingLeft: spacing.sm,
    paddingRight: spacing.xs,

    backgroundColor: colors.background.subtle,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.full,
  },

  chipText: {
    fontFamily: typography.family,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.weight.regular,
    color: colors.text.primary,
  },

  removeButton: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm,
  },

  displayActions: {
    width: 266,
    alignItems: "flex-end",
    gap: 10,
  },

  sortRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  sortLabel: {
    fontFamily: typography.family,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.md,
    fontWeight: typography.weight.regular,
    color: colors.text.secondary,
  },

  sortSelect: {
    width: 172,
  },

  selectText: {
    fontFamily: typography.family,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.weight.regular,
  },
});
