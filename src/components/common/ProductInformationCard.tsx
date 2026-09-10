import { useState } from "react";
import { StyleProp, StyleSheet, Text, useWindowDimensions, View, ViewStyle } from "react-native";

import { HeaderSections } from "@/components/common/HeaderSections";
import { InputTextArea } from "@/components/common/InputTextArea";
import { InputWithLabel } from "@/components/common/InputWithLabel";
import { Message } from "@/components/common/Message";
import { SelectLabel } from "@/components/common/SelectLabel";
import { Tab } from "@/components/common/Tab";
import { Info, News, Sell, SwapHoriz, Tune } from "@/components/icons";
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
const INVALID_SYMBOLS_MESSAGE = "Inválido, no se pueden colocar símbolos.";
const INVALID_NUMBER_MESSAGE = "Inválido, solo se pueden colocar números.";

const hasInvalidTextCharacters = (value: string) =>
	/[^\p{L}\p{N}\s+\-()[\]]/u.test(value);

const hasInvalidNumberCharacters = (value: string) => !/^\d*(\.\d*)?$/.test(value);

const sanitizePrice = (value: string) => {
	const sanitized = value.replace(/[^\d.]/g, "");
	const [integerPart = "", ...decimalParts] = sanitized.split(".");
	const decimalPart = decimalParts.join("").slice(0, 2);

	return decimalParts.length > 0
		? `${integerPart || "0"}.${decimalPart}`
		: integerPart;
};

const formatPrice = (value: string) => {
	if (!value) return value;

	const [integerPart = "0", decimalPart = ""] = value.split(".");
	return `${integerPart || "0"}.${decimalPart.padEnd(2, "0").slice(0, 2)}`;
};

const getAttributeError = (label: string, value: string) => {
	const isYear = label.toLowerCase() === "año" || label.toLowerCase() === "ano";
	const hasError = isYear
		? hasInvalidNumberCharacters(value)
		: hasInvalidTextCharacters(value);

	return hasError ? (isYear ? INVALID_NUMBER_MESSAGE : INVALID_SYMBOLS_MESSAGE) : undefined;
};

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
	const isNarrowMobile = width < 360;
	const [title, setTitle] = useState(initialTitle);
	const [category, setCategory] = useState(initialCategory);
	const [subcategory, setSubcategory] = useState(initialSubcategory);
	const [mode, setMode] = useState<ProductMode>(initialMode);
	const [price, setPrice] = useState(() => sanitizePrice(initialPrice));
	const [description, setDescription] = useState(initialDescription);
	const [attributeValues, setAttributeValues] = useState<Record<string, string>>(
		() => Object.fromEntries(attributes.map((attribute) => [attribute.label, attribute.value])),
	);
	const titleHasError = hasInvalidTextCharacters(title);

	const updateAttribute = (label: string, value: string) => {
		setAttributeValues((current) => ({ ...current, [label]: value }));
	};

	return (
		<View style={[styles.card, isMobile && styles.mobileCard, style]}>
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
				alert={titleHasError ? INVALID_SYMBOLS_MESSAGE : undefined}
				visibleAlert={titleHasError}
				alertStyle={styles.errorText}
			/>

			<View style={[styles.row, isMobile && styles.mobileRow]}>
				<SelectLabel
					label="Categoría"
					value={category}
					options={categories}
					onChange={setCategory}
					containerStyle={[styles.flexField, isMobile && styles.mobileFlexField]}
				/>
				<SelectLabel
					label="Subcategoría"
					value={subcategory}
					options={subcategories}
					onChange={setSubcategory}
					containerStyle={[styles.flexField, isMobile && styles.mobileFlexField]}
				/>
			</View>

			<View style={[styles.row, styles.modeRow, isMobile && styles.mobileRow]}>
				<View style={[styles.flexField, isMobile && styles.mobileFlexField]}>
					<Text style={styles.label}>Modalidad</Text>
					<Tab
						tabs={[
							{ id: "sell", label: "Vender", icon: <Sell size={16} color={colors.text.inverse} /> },
							{ id: "exchange", label: "Intercambiar", icon: <SwapHoriz size={16} color={colors.text.secondary} /> }
						]}
						selectedId={mode}
						onChange={(value) => setMode(value as ProductMode)}
						stacked={isMobile}
						style={[styles.modeTabs, isMobile && styles.mobileModeTabs]}
					/>
				</View>

				<View style={[styles.flexField, isMobile && styles.mobileFlexField]}>
					<Label style={styles.priceLabel}>Precio / valor referencial</Label>
					<View style={styles.priceCard}>
						<View style={styles.priceInputContainer}>
							<Input
								value={price}
								onChangeText={(value) => setPrice(sanitizePrice(value))}
								onBlur={() => setPrice(formatPrice(price))}
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
				<View style={[styles.attributes, isNarrowMobile && styles.narrowMobileAttributes]}>
					{attributes.map((attribute) => {
						const attributeValue = attributeValues[attribute.label] ?? "";
						const attributeError = getAttributeError(attribute.label, attributeValue);

						return (
							<InputWithLabel
								key={attribute.label}
								size="compact"
								label={attribute.label}
								value={attributeValue}
								onChangeText={(value) => updateAttribute(attribute.label, value)}
								alert={attributeError}
								visibleAlert={Boolean(attributeError)}
								alertStyle={styles.errorText}
								containerStyle={[
									styles.attribute,
									isNarrowMobile && styles.narrowMobileAttribute,
								]}
							/>
						);
					})}
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
	mobileCard: {
		padding: spacing.lg,
		gap: spacing.lg,
	},
	row: {
		width: "100%",
		flexDirection: "row",
		gap: spacing.lg,
	},
	mobileRow: {
		flexDirection: "column",
		gap: spacing.lg,
	},
	flexField: {
		flex: 1,
		minWidth: 0,
	},
	mobileFlexField: {
		flexGrow: 0,
		flexShrink: 1,
		flexBasis: "auto",
		width: "100%",
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
	mobileModeTabs: {
		width: "100%",
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
	errorText: {
		fontFamily: typography.family,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.lg,
		fontWeight: typography.weight.regular,
		color: colors.card.red.foreground,
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
	narrowMobileAttributes: {
		flexDirection: "column",
	},
	narrowMobileAttribute: {
		flexBasis: "auto",
		flexGrow: 0,
		width: "100%",
	},
	attribute: {
		flexBasis: "22%",
		flexGrow: 1,
		minWidth: 120,
	},
});
