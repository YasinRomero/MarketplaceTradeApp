import { ReactNode } from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { colors, radius, spacing, typography } from "@/theme";

export type HeaderSectionsSize = "2xl" | "xl" | "large" | "medium" | "compact";

export interface HeaderSectionsProps {
	title: string | number;
	description?: string;
	size?: HeaderSectionsSize;
	icon?: ReactNode;
	aside?: ReactNode;
	asideText?: string;
	style?: StyleProp<ViewStyle>;
	titleStyle?: StyleProp<TextStyle>;
	descriptionStyle?: StyleProp<TextStyle>;
	asideTextStyle?: StyleProp<TextStyle>;
}

export function HeaderSections({
	title,
	description,
	size = "large",
	icon,
	aside,
	asideText,
	style,
	titleStyle,
	descriptionStyle,
	asideTextStyle,
}: HeaderSectionsProps) {
	return (
		<View style={[styles.header, sizeStyles[size].container, style]}>
			{icon && <View style={[styles.icon, sizeStyles[size].icon]}>{icon}</View>}

			<View style={styles.content}>
				<Text style={[styles.title, sizeStyles[size].title, titleStyle]}>{title}</Text>

				{description && (
					<Text style={[styles.description, sizeStyles[size].description, descriptionStyle]}>
						{description}
					</Text>
				)}
			</View>

			{aside ?? (asideText && <Text style={[styles.asideText, asideTextStyle]}>{asideText}</Text>)}
		</View>
	);
}

const sizeStyles: Record<
	HeaderSectionsSize,
	{
		container: ViewStyle;
		icon: ViewStyle;
		title: TextStyle;
		description: TextStyle;
	}
> = {
	"2xl": {
		container: {
			alignItems: "flex-end",
			paddingBottom: spacing.lg,
		},
		icon: {
			width: 32,
			height: 32,
			borderRadius: radius.md,
		},
		title: {
			fontSize: typography.size["2xl"],
			lineHeight: typography.lineHeight["4xl"],
			letterSpacing: -0.75,
		},
		description: {
			fontSize: typography.size.sm,
			lineHeight: typography.lineHeight.lg,
		},
	},

	xl: {
		container: {
			alignItems: "flex-end",
			paddingBottom: spacing.lg,
		},
		icon: {
			width: 32,
			height: 32,
			borderRadius: radius.md,
		},
		title: {
			fontSize: typography.size["2xl"],
			lineHeight: typography.lineHeight["3xl"],
		},
		description: {
			fontSize: typography.size.xs,
			lineHeight: typography.lineHeight.lg,
		},
	},

	large: {
		container: {
			alignItems: "flex-start",
			paddingBottom: spacing.lg,
		},
		icon: {
			width: 24,
			height: 28,
			borderRadius: radius.sm,
		},
		title: {
			fontSize: typography.size.md,
			lineHeight: typography.lineHeight["2xl"],
		},
		description: {
			fontSize: typography.size.xs,
			lineHeight: typography.lineHeight.lg,
		},
	},

	medium: {
		container: {
			alignItems: "center",
			paddingBottom: spacing.lg,
		},
		icon: {
			width: 16,
			height: 20,
			borderRadius: radius.sm,
		},
		title: {
			fontSize: typography.size.sm,
			lineHeight: typography.lineHeight.lg,
		},
		description: {
			fontSize: typography.size.xs,
			lineHeight: typography.lineHeight.lg,
		},
	},

	compact: {
		container: {
			alignItems: "center",
			paddingBottom: spacing.sm,
		},
		icon: {
			width: 16,
			height: 20,
			borderRadius: radius.sm,
		},
		title: {
			fontSize: typography.size.xs,
			lineHeight: typography.lineHeight.lg,
		},
		description: {
			fontSize: typography.size.xs,
			lineHeight: typography.lineHeight.lg,
		},
	},
};

const styles = StyleSheet.create({
	header: {
		width: "100%",

		flexDirection: "row",
		gap: 10,

		borderBottomWidth: 1,
		borderBottomColor: colors.border.default,
	},

	icon: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.background.subtle,
	},

	content: {
		flexShrink: 1,
		alignItems: "flex-start",
	},

	title: {
		fontFamily: typography.family,
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},

	description: {
		fontFamily: typography.family,
		fontWeight: typography.weight.regular,
		color: colors.text.secondary,
	},

	asideText: {
		marginLeft: "auto",
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.md,
		fontWeight: typography.weight.semibold,
		color: colors.action.primary,
	},
});
