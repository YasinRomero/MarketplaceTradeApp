import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import {
  Domain,
  KeyboardArrowDown,
  Search,
  SwapHoriz,
} from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { InputIcon } from "@/components/ui/Input";
import { InputSelect } from "@/components/ui/InputSelect";
import { colors, radius, spacing, typography } from "@/theme";

export interface MarketplaceSearchBarProps {
  searchValue?: string;
  searchPlaceholder?: string;
  institution?: string;
  exchangeType?: string;
  institutionIcon?: ReactNode;
  exchangeIcon?: ReactNode;
  onSearchChange?: (value: string) => void;
  onInstitutionPress?: () => void;
  onExchangePress?: () => void;
  onSearchPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function MarketplaceSearchBar({
  searchValue,
  searchPlaceholder = "¿Qué estás buscando?",
  institution = "Selecciona una universidad",
  exchangeType = "Tipo de intercambio",
  institutionIcon = <Domain size={24} color={colors.text.secondary} />,
  exchangeIcon = <SwapHoriz size={24} color={colors.text.secondary} />,
  onSearchChange,
  onInstitutionPress,
  onExchangePress,
  onSearchPress,
  disabled = false,
  style,
}: MarketplaceSearchBarProps) {
  const arrowIcon = (
    <KeyboardArrowDown size={24} color={colors.text.secondary} />
  );

  return (
    <View style={[styles.container, style]}>
      <InputIcon
        value={searchValue}
        placeholder={searchPlaceholder}
        onChangeText={onSearchChange}
        onSubmitEditing={onSearchPress}
        returnKeyType="search"
        editable={!disabled}
        icon={<Search size={24} color={colors.text.secondary} />}
        containerStyle={styles.searchInput}
        inputStyle={styles.searchText}
      />

      <View style={styles.divider} />

      <InputSelect
        value={institution}
        leftIcon={institutionIcon}
        rightIcon={arrowIcon}
        iconPosition="both"
        disabled={disabled}
        onPress={onInstitutionPress}
        containerStyle={styles.institutionSelect}
        textStyle={styles.selectText}
      />

      <View style={styles.divider} />

      <InputSelect
        value={exchangeType}
        leftIcon={exchangeIcon}
        rightIcon={arrowIcon}
        iconPosition="both"
        disabled={disabled}
        onPress={onExchangePress}
        containerStyle={styles.exchangeSelect}
        textStyle={styles.selectText}
      />

      <Button
        size="large"
        icon={<Search size={16} color={colors.action.primaryForeground} />}
        disabled={disabled}
        onPress={onSearchPress}
      >
        Buscar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 1232,
    height: 62,

    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.sm,

    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.xl,

    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  searchInput: {
    flex: 1,
    minWidth: 0,
    height: 24,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },

  searchText: {
    fontFamily: typography.family,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.md,
    fontWeight: typography.weight.regular,
  },

  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border.default,
  },

  institutionSelect: {
    width: 328,
    flexShrink: 0,
  },

  exchangeSelect: {
    width: 230,
    flexShrink: 0,
  },

  selectText: {
    fontFamily: typography.family,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.weight.regular,
  },
});
