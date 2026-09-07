import { useState } from "react";
import { StyleProp, StyleSheet, Text, useWindowDimensions, View, ViewStyle } from "react-native";

import { HeaderSections } from "@/components/common/HeaderSections";
import { InputTextArea } from "@/components/common/InputTextArea";
import { InputWithLabel } from "@/components/common/InputWithLabel";
import { Message } from "@/components/common/Message";
import { SelectLabel } from "@/components/common/SelectLabel";
import { Tab } from "@/components/common/Tab";
import { Info, News, Sell, SwapCalls, SwapHoriz, Tune } from "@/components/icons";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { colors, radius, spacing, typography } from "@/theme";

type ProductMode = "sell" | "exchange" | "donate";

interface ProductAttribute {
	label: string;
	value: string;
}

export interface ProductInformationCardProps {
	style?: StyleProp<ViewStyle>;
	initialTitle?: string;
	initialCategory?: string;
	initialSubcategory?: string;
	initialMode?: ProductMode;
	initialPrice?: string;
	initialDescription?: string;
	attributes?: ProductAttribute[];
}

const categories = ["Tecnología", "Ropa", "Libros"];
const subcategories = ["Computadoras", "Accesorios", "Otros"];
const defaultAttributes: ProductAttribute[] = [
	{ label: "Marca", value: "Lenovo" },
	{ label: "Modelo", value: "ThinkPad" },
	{ label: "Estado", value: "Usado" },
	{ label: "Año", value: "2022" },
];

export function ProductInformationCard({
	style,
	initialTitle = "Laptop Lenovo ThinkPad",
	initialCategory = categories[0],
	initialSubcategory = subcategories[0],
	initialMode = "sell",
	initialPrice = "450.00",
	initialDescription = "Completa los datos esenciales de tu publicación",
	attributes = defaultAttributes,
}: ProductInformationCardProps) {
	const { width } = useWindowDimensions();
	const isMobile = width < 640;
	const [title, setTitle] = useState(initialTitle);
	const [category, setCategory] = useState(initialCategory);
	const [subcategory, setSubcategory] = useState(initialSubcategory);
	const [mode, setMode] = useState<ProductMode>(initialMode);
	const [price, setPrice] = useState(initialPrice);
	const [description, setDescription] = useState(initialDescription);

	const nextValue = (values: string[], current: string) =>
		values[(values.indexOf(current) + 1) % values.length];

	return (
		<View style={[styles.card, style]}>
			<HeaderSections
				icon={<News size={20} color={colors.text.secondary} />}
				title="Información del producto"
				description="Completa los datos principales para publicar tu producto."
			/>

			<InputWithLabel
				label="Título del producto"
				value={title}
				onChangeText={setTitle}
				placeholder="Ej. Laptop Lenovo ThinkPad"
				alert="Usa un título claro que facilite las búsquedas."
			/>

			<View style={[styles.row, isMobile && styles.mobileRow]}>
				<SelectLabel
					label="Categoría"
					value={category}
					onPress={() => setCategory(nextValue(categories, category))}
					containerStyle={styles.flexField}
				/>
				<SelectLabel
					label="Subcategoría"
					value={subcategory}
					onPress={() => setSubcategory(nextValue(subcategories, subcategory))}
					containerStyle={styles.flexField}
				/>
			</View>

			<View style={[styles.row, styles.modeRow, isMobile && styles.mobileRow]}>
				<View style={styles.flexField}>
					<Text style={styles.label}>Modalidad</Text>
					<Tab
						tabs={[
							{ id: "sell", label: "Vender", icon: <Sell size={16} color={colors.text.inverse} /> },
							{
								id: "exchange",
								label: "Intercambiar",
								icon: <SwapHoriz size={16} color={colors.text.secondary} />,
							},
							{
								id: "donate",
								label: "Donar",
								icon: <SwapCalls size={16} color={colors.text.secondary} />,
							},
						]}
						selectedId={mode}
						onChange={(value) => setMode(value as ProductMode)}
						style={styles.modeTabs}
					/>
				</View>

				<View style={styles.flexField}>
					<Label style={styles.priceLabel}>Precio / valor referencial</Label>
					<View style={styles.priceCard}>
						<View style={styles.priceInputContainer}>
							<Input
								value={price}
								onChangeText={setPrice}
								keyboardType="decimal-pad"
								style={styles.priceInput}
							/>
							<Text style={styles.currencyPrefix}>S/</Text>
							<Text style={styles.currencySuffix}>PEN</Text>
						</View>

						<Message
							icon={<Info size={16} color={colors.text.secondary} />}
							message="Sirve como precio final de venta o base de equivalencia para propuestas de intercambio."
							style={styles.priceMessage}
						/>
					</View>
				</View>
			</View>

			<InputTextArea
				label="Descripción"
				value={description}
				onChangeText={setDescription}
				placeholder="Describe el estado, uso y detalles importantes."
				inputStyle={styles.descriptionInput}
			/>

			<View style={styles.properties}>
				<HeaderSections
					size="medium"
					icon={<Tune size={12} color={colors.text.secondary} />}
					title="Características"
				/>
				<View style={styles.attributes}>
					{attributes.map((attribute) => (
						<InputWithLabel
							key={attribute.label}
							size="compact"
							label={attribute.label}
							defaultValue={attribute.value}
							containerStyle={styles.attribute}
						/>
					))}
				</View>
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
		borderRadius: radius.xl,
	},
	row: {
		width: "100%",
		flexDirection: "row",
		gap: spacing.lg,
	},
	mobileRow: {
		flexDirection: "column",
	},
	flexField: {
		flex: 1,
		minWidth: 0,
	},
	modeRow: {
		alignItems: "flex-start",
		paddingTop: spacing.xs,
	},
	label: {
		marginBottom: spacing.xs,
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.lg,
		fontWeight: typography.weight.semibold,
		color: colors.text.primary,
	},
	priceLabel: {
		marginBottom: spacing.xs,
	},
	modeTabs: {
		maxWidth: "100%",
	},
	priceCard: {
		width: "100%",
		padding: 14,
		gap: 8,
		backgroundColor: colors.background.subtle,
		borderWidth: 2,
		borderColor: colors.border.default,
		borderRadius: 12,
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	priceInputContainer: {
		width: "100%",
		height: 48,
		position: "relative",
	},
	priceInput: {
		width: "100%",
		height: 48,
		minHeight: 48,
		paddingVertical: 8,
		paddingLeft: 40,
		paddingRight: 64,
		fontSize: 24,
		lineHeight: 30,
		fontWeight: typography.weight.bold,
		backgroundColor: colors.background.surface,
		borderColor: colors.border.default,
		borderRadius: 8,
	},
	currencyPrefix: {
		position: "absolute",
		left: 12,
		top: 10,
		fontFamily: typography.family,
		fontSize: typography.size.lg,
		lineHeight: 28,
		fontWeight: typography.weight.bold,
		color: colors.text.primary,
	},
	currencySuffix: {
		position: "absolute",
		right: 12,
		top: 16,
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: 16,
		fontWeight: typography.weight.semibold,
		color: colors.text.secondary,
	},
	priceMessage: {
		padding: 0,
		minHeight: 40,
		backgroundColor: "transparent",
		borderWidth: 0,
	},
	descriptionInput: {
		height: 108,
	},
	properties: {
		width: "100%",
		gap: spacing.md,
	},
	attributes: {
		width: "100%",
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.md,
	},
	attribute: {
		flexBasis: "22%",
		flexGrow: 1,
		minWidth: 120,
	},
});
