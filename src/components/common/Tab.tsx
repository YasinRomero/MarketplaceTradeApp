import { cloneElement, isValidElement, ReactNode } from "react";
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
	stacked?: boolean;
	onChange?: (id: string) => void;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
}

export function Tab({
	tabs,
	selectedId,
	variant = "normal",
	stacked = false,
	onChange,
	disabled = false,
	style,
}: TabProps) {
	const getIcon = (icon: ReactNode, isSelected: boolean) => {
		if (!isSelected || !isValidElement<{ color?: string }>(icon)) {
			return icon;
		}

		return cloneElement(icon, { color: colors.action.primaryForeground });
	};

	return (
		<View style={[styles.container, variantStyles[variant], stacked && styles.stacked, style]}>
			{tabs.map((tab) => {
				const isSelected = tab.id === selectedId;
				const onPress = () => onChange?.(tab.id);

				if (variant === "icon") {
					return (
						<ButtonIcon
							key={tab.id}
							icon={getIcon(tab.icon, isSelected)}
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
						icon={getIcon(tab.icon, isSelected)}
						disabled={disabled}
						onPress={onPress}
						style={[styles.normalTab, styles.flexibleTab, stacked && styles.stackedTab]}
					>
						{tab.label ?? tab.id}
					</Button>
				) : (
					<ButtonGhost
						key={tab.id}
						icon={getIcon(tab.icon, isSelected)}
						disabled={disabled}
						onPress={onPress}
						style={[styles.normalTab, stacked && styles.stackedTab]}
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
		flexShrink: 0,
	},
	flexibleTab: {
		flex: 1,
		minWidth: 0,
	},
	stacked: {
		height: "auto",
		alignSelf: "stretch",
		flexDirection: "column",
	},
	stackedTab: {
		width: "100%",
		flexGrow: 0,
		flexShrink: 0,
		flexBasis: "auto",
	},
});
