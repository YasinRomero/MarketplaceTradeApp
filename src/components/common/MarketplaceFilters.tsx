import { ReactNode } from "react";
import {
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	useWindowDimensions,
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
	sortOptions?: readonly string[];
	sortIcon?: ReactNode;
	onSortPress?: () => void;
	onSortChange?: (value: string) => void;
	onClearFilters?: () => void;
	style?: StyleProp<ViewStyle>;
}

export function MarketplaceFilters({
	resultCount,
	resultLabel = "publicaciones disponibles",
	activeFilters = [],
	sortValue = "Relevancia",
	sortOptions = ["Relevancia", "Más recientes", "Menor precio", "Mayor precio"],
	sortIcon,
	onSortPress,
	onSortChange,
	onClearFilters,
	style,
}: MarketplaceFiltersProps) {
	const { width } = useWindowDimensions();
	const isMobile = width < 768;
	const mobileWidth = Math.max(width - spacing.lg * 2, 280);
	const arrowIcon = <KeyboardArrowDown size={24} color={colors.text.secondary} />;

	return (
		<View
			style={[
				styles.container,
				isMobile && styles.mobileContainer,
				isMobile && { width: mobileWidth, maxWidth: mobileWidth },
				style,
			]}
		>
			<View style={[styles.displayFilters, isMobile && styles.mobileDisplayFilters]}>
				<View style={styles.resultSummary}>
					<Text style={styles.resultCount}>{resultCount}</Text>
					<Text style={styles.resultLabel}>{resultLabel}</Text>
				</View>

				{activeFilters.length > 0 && (
					<View style={[styles.chips, isMobile && styles.mobileChips]}>
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

			<View style={[styles.displayActions, isMobile && styles.mobileDisplayActions]}>
				<View style={[styles.sortRow, isMobile && styles.mobileSortRow]}>
					<Text style={styles.sortLabel}>Ordenar por:</Text>
					<InputSelect
						value={sortValue}
						options={sortOptions}
						rightIcon={sortIcon ?? arrowIcon}
						iconPosition="right"
						size="compact"
						onPress={onSortPress}
						onChange={onSortChange}
						containerStyle={[styles.sortSelect, isMobile && styles.mobileSortSelect]}
						textStyle={styles.selectText}
					/>
				</View>

				<Button onPress={onClearFilters} style={isMobile && styles.mobileClearButton}>
					Limpiar filtros
				</Button>
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

	mobileContainer: {
		minHeight: 0,
		flexDirection: "column",
		alignItems: "stretch",
		gap: spacing.lg,
	},

	displayFilters: {
		width: 354,
		gap: 10,
	},

	mobileDisplayFilters: {
		width: "100%",
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

	mobileChips: {
		flexWrap: "wrap",
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

	mobileDisplayActions: {
		width: "100%",
		alignItems: "stretch",
	},

	sortRow: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},

	mobileSortRow: {
		alignItems: "center",
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

	mobileSortSelect: {
		flex: 1,
		width: undefined,
	},

	mobileClearButton: {
		width: "100%",
	},

	selectText: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		fontWeight: typography.weight.regular,
	},
});
