import { colors, typography } from "@/theme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronForward } from "../icons";

interface BreadcrumbItem {
	label: string;
	onPress?: () => void;
}

interface BreadcrumbProps {
	items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
	return (
		<View style={styles.container}>
			{items.map((item, index) => {
				const isLast = index === items.length - 1;

				return (
					<React.Fragment key={`${item.label}-${index}`}>
						<Pressable onPress={item.onPress} disabled={isLast || !item.onPress}>
							<Text style={[styles.text, isLast && styles.activeText]}>{item.label}</Text>
						</Pressable>

						{!isLast && (
							<Text style={styles.separator}>
								<ChevronForward />
							</Text>
						)}
					</React.Fragment>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},

	text: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
		fontWeight: typography.weight.regular,
		letterSpacing: 0.12,
		color: colors.text.secondary,
	},

	activeText: {
		fontWeight: typography.weight.semibold,
		color: colors.text.primary,
	},

	separator: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		color: colors.text.secondary,
	},
});
