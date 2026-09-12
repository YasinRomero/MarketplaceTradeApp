import { Distance, KeyboardArrowDown, Search, SwapHoriz } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { InputIcon } from "@/components/ui/Input";
import { InputSelect } from "@/components/ui/InputSelect";
import { colors, radius, responsive, spacing, typography } from "@/theme";
import { ReactNode } from "react";
import { StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

export interface SearchBarGlobalProps {
	location?: string;
	exchangeType?: string;
	locationOptions?: string[];
	exchangeTypeOptions?: string[];
	searchValue?: string;
	searchPlaceholder?: string;
	locationIcon?: ReactNode;
	exchangeIcon?: ReactNode;
	onLocationPress?: () => void;
	onExchangePress?: () => void;
	onSearchChange?: (value: string) => void;
	onSearchPress?: () => void;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
}

export function SearchBarGlobal({
	location = "Ubicación",
	exchangeType = "Modalidad",
	locationOptions = ["Todos", "Sede central", "Sede norte", "Sede sur"],
	exchangeTypeOptions = ["Ambos", "Intercambio", "Venta"],
	searchValue,
	searchPlaceholder = "¿Qué estás buscando?",
	locationIcon = <Distance size={24} color={colors.text.secondary} />,
	exchangeIcon = <SwapHoriz size={24} color={colors.text.secondary} />,
	onLocationPress,
	onExchangePress,
	onSearchChange,
	onSearchPress,
	disabled = false,
	style,
}: SearchBarGlobalProps) {
	const { width } = useWindowDimensions();
	const isTabletDown = responsive.isTabletDown(width);

	const arrowIcon = <KeyboardArrowDown size={24} color={colors.text.secondary} />;
	const searchIcon = <Search size={16} color={colors.action.primaryForeground} />;

	return (
		<View style={[styles.container, isTabletDown && styles.mobileContainer, style]}>
			<InputSelect
				value={location}
				options={locationOptions}
				leftIcon={locationIcon}
				rightIcon={arrowIcon}
				iconPosition="both"
				disabled={disabled}
				onPress={onLocationPress}
				textStyle={styles.selectText}
			/>

			<InputIcon
				value={searchValue}
				placeholder={searchPlaceholder}
				onChangeText={onSearchChange}
				onSubmitEditing={onSearchPress}
				returnKeyType="search"
				editable={!disabled}
				icon={<Search size={24} color={colors.text.secondary} />}
				containerStyle={[styles.input, isTabletDown && styles.mobileControl]}
				inputStyle={styles.inputText}
			/>

			<InputSelect
				value={exchangeType}
				options={exchangeTypeOptions}
				leftIcon={exchangeIcon}
				rightIcon={arrowIcon}
				iconPosition="both"
				disabled={disabled}
				onPress={onExchangePress}
				textStyle={styles.selectText}
			/>

			<Button
				size="large"
				icon={searchIcon}
				disabled={disabled}
				onPress={onSearchPress}
				style={isTabletDown && styles.mobileButton}
			>
				Buscar
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: spacing.md,
		padding: spacing.sm,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.xl,
	},

	select: {
		width: 200,
		flexGrow: 0,
		flexShrink: 0,
	},

	selectText: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		fontWeight: typography.weight.regular,
	},

	input: {
		flex: 1,
		minWidth: 0,
		minHeight: 44,
		paddingHorizontal: spacing.lg,
		backgroundColor: colors.background.subtle,
	},

	inputText: {
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.md,
		fontWeight: typography.weight.regular,
	},

	// Mobile Responsive
	mobileContainer: {
		height: "auto",
		alignItems: "stretch",
		flexDirection: "column",
		gap: spacing.sm,
		padding: spacing.md,
	},

	mobileControl: {
		width: "100%",
		minHeight: 44,
		flexGrow: 0,
		flexShrink: 1,
	},

	mobileButton: {
		width: "100%",
	},
});
