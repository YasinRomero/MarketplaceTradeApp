import { Pressable, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { ChevronForward } from "@/components/icons";
import { colors, spacing, typography } from "@/theme";

export interface DetailsProductBreadcrumbItem {
	label: string;
	onPress?: () => void;
}

export interface DetailsProductBreadcrumbProps {
	items: DetailsProductBreadcrumbItem[];
	style?: StyleProp<ViewStyle>;
}

export function DetailsProductBreadcrumb({ items, style }: DetailsProductBreadcrumbProps) {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			style={[styles.container, style]}
			contentContainerStyle={styles.content}
		>
			{items.map((item, index) => {
				const isLast = index === items.length - 1;

				return (
					<View key={`${item.label}-${index}`} style={styles.item}>
						<Pressable accessibilityRole="link" disabled={isLast || !item.onPress} onPress={item.onPress}>
							<Text style={[styles.label, isLast && styles.activeLabel]}>{item.label}</Text>
						</Pressable>

						{!isLast && <ChevronForward size={10} color={colors.text.secondary} />}
					</View>
				);
			})}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: 24,
	},
	content: {
		alignItems: "center",
		gap: spacing.sm,
		paddingVertical: spacing.xs,
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	label: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: 16,
		fontWeight: typography.weight.regular,
		letterSpacing: 0.12,
		color: colors.text.secondary,
	},
	activeLabel: {
		fontWeight: typography.weight.medium,
		color: colors.text.primary,
	},
});
