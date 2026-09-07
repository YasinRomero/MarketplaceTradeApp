import { StyleProp, StyleSheet, Text, useWindowDimensions, View, ViewStyle } from "react-native";

import { HeaderSections } from "@/components/common/HeaderSections";
import { Tune } from "@/components/icons";
import { colors, radius, spacing, typography } from "@/theme";

export interface TechnicalSpec {
	label: string;
	value: string;
}

export interface TechnicalSpecsCardProps {
	specs?: TechnicalSpec[];
	style?: StyleProp<ViewStyle>;
}

const defaultSpecs: TechnicalSpec[] = [
	{ label: "Marca", value: "Lenovo" },
	{ label: "Modelo", value: "ThinkPad" },
	{ label: "Tamaño de pantalla", value: "14 pulgadas" },
	{ label: "Precio", value: "S/. 450.00" },
	{ label: "Año", value: "2022" },
	{ label: "Condición", value: "Usado" },
	{ label: "Sistema operativo", value: "Windows 11" },
	{ label: "Memoria RAM", value: "8 GB" },
];

export function TechnicalSpecsCard({ specs = defaultSpecs, style }: TechnicalSpecsCardProps) {
	const { width } = useWindowDimensions();
	const isMobile = width < 640;

	return (
		<View style={[styles.card, style]}>
			<HeaderSections
				size="xl"
				icon={<Tune size={20} color={colors.text.secondary} />}
				title="Especificaciones técnicas y atributos"
			/>

			<View style={[styles.grid, isMobile && styles.mobileGrid]}>
				{specs.map((spec, index) => (
					<View key={`${spec.label}-${index}`} style={[styles.item, isMobile && styles.mobileItem]}>
						<Text style={styles.label}>{spec.label}</Text>
						<Text numberOfLines={1} style={styles.value}>
							{spec.value}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		width: "100%",
		padding: spacing.xl,
		gap: spacing.xl,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.lg,
	},
	grid: {
		width: "100%",
		flexDirection: "row",
		flexWrap: "wrap",
		columnGap: spacing.xl,
	},
	mobileGrid: {
		flexDirection: "column",
	},
	item: {
		flexBasis: "45%",
		flexGrow: 1,
		flexShrink: 1,
		minHeight: 37,
		paddingVertical: spacing.sm,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: colors.border.default,
	},
	mobileItem: {
		width: "100%",
	},
	label: {
		flex: 1,
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: 16,
		fontWeight: typography.weight.regular,
		letterSpacing: 0.12,
		color: colors.text.secondary,
	},
	value: {
		flexShrink: 1,
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.lg,
		fontWeight: typography.weight.semibold,
		color: colors.text.primary,
	},
});
