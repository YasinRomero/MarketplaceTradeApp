import { ReactNode } from "react";
import { StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import { Distance, KeyboardArrowDown, Search, SwapHoriz } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { InputIcon } from "@/components/ui/Input";
import { InputSelect } from "@/components/ui/InputSelect";
import { colors, radius, spacing, typography } from "@/theme";

export interface SearchBarGlobalProps {
	location?: string;
	exchangeType?: string;
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
	exchangeType = "Intercambio",
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
	const isMobile = width < 768;
	const arrowIcon = <KeyboardArrowDown size={24} color={colors.text.secondary} />;
	const searchIcon = <Search size={16} color={colors.action.primaryForeground} />;

	return (
		<View style={[styles.container, isMobile && styles.containerMobile, style]}>
			<InputSelect
				value={location}
				leftIcon={locationIcon}
				rightIcon={arrowIcon}
				iconPosition="both"
				disabled={disabled}
				onPress={onLocationPress}
				containerStyle={[styles.select, isMobile && styles.controlMobile]}
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
				containerStyle={[styles.input, isMobile && styles.controlMobile]}
				inputStyle={styles.inputText}
			/>

			<InputSelect
				value={exchangeType}
				leftIcon={exchangeIcon}
				rightIcon={arrowIcon}
				iconPosition="both"
				disabled={disabled}
				onPress={onExchangePress}
				containerStyle={[styles.select, isMobile && styles.controlMobile]}
				textStyle={styles.selectText}
			/>

			<Button
				size="large"
				icon={searchIcon}
				disabled={disabled}
				onPress={onSearchPress}
				style={isMobile && styles.buttonMobile}
			>
				Buscar
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		maxWidth: 896,
		height: 78,

		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: spacing.md,
		padding: spacing.lg,

		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.xl,
	},
	containerMobile: {
		height: "auto",
		alignItems: "stretch",
		flexDirection: "column",
		gap: spacing.sm,
		padding: spacing.md,
	},

	select: {
		width: 200,
		flexGrow: 0,
		flexShrink: 0,
	},
	controlMobile: {
		width: "100%",
		minHeight: 44,
		flexGrow: 0,
		flexShrink: 1,
	},
	buttonMobile: {
		width: "100%",
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
});
