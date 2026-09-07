import { ReactNode, useEffect, useRef, useState } from "react";
import {
	Modal,
	Platform,
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	useWindowDimensions,
	View,
	ViewStyle,
} from "react-native";

import { colors } from "@/theme/colors";

type InputSelectSize = "normal" | "compact";

type InputSelectVariant = "outline" | "filled" | "plain";

type IconPosition = "left" | "right" | "both" | "none";

interface InputSelectProps {
	value: string;
	options?: readonly string[];

	leftIcon?: ReactNode;
	rightIcon?: ReactNode;

	iconPosition?: IconPosition;

	size?: InputSelectSize;
	variant?: InputSelectVariant;

	onPress?: () => void;
	onChange?: (value: string) => void;

	disabled?: boolean;

	containerStyle?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
}

export function InputSelect({
	value,
	options = [],

	leftIcon,
	rightIcon,

	iconPosition = "none",

	size = "normal",
	variant = "filled",

	onPress,
	onChange,

	disabled = false,

	containerStyle,
	textStyle,
}: InputSelectProps) {
	const { width } = useWindowDimensions();
	const isMobile = width < 768;
	const [isOpen, setIsOpen] = useState(false);
	const [selectedValue, setSelectedValue] = useState(value);
	const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0, width: 0 });
	const selectRef = useRef<View>(null);
	const menuRef = useRef<View>(null);
	const flattenedContainerStyle = StyleSheet.flatten(containerStyle);
	const wrapperStyle: ViewStyle = {
		width: flattenedContainerStyle?.width,
		maxWidth: flattenedContainerStyle?.maxWidth,
		minWidth: flattenedContainerStyle?.minWidth,
		flex: flattenedContainerStyle?.flex,
		flexGrow: flattenedContainerStyle?.flexGrow,
		flexShrink: flattenedContainerStyle?.flexShrink,
		flexBasis: flattenedContainerStyle?.flexBasis,
		alignSelf: flattenedContainerStyle?.alignSelf,
	};
	const showLeftIcon = iconPosition === "left" || iconPosition === "both";

	const showRightIcon = iconPosition === "right" || iconPosition === "both";
	const hasOptions = options.length > 0;

	useEffect(() => {
		setSelectedValue(value);
	}, [value]);

	useEffect(() => {
		if (!isOpen || isMobile) return;

		selectRef.current?.measureInWindow((left, top, width, height) => {
			setMenuPosition({ left, top: top + height + 4, width });
		});
	}, [isMobile, isOpen]);

	useEffect(() => {
		if (!isOpen || isMobile || Platform.OS !== "web") return;

		const handleOutsidePress = (event: PointerEvent) => {
			const target = event.target as Node;
			const selectElement = selectRef.current as unknown as HTMLElement | null;
			const menuElement = menuRef.current as unknown as HTMLElement | null;

			if (!selectElement?.contains(target) && !menuElement?.contains(target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("pointerdown", handleOutsidePress, true);
		return () => document.removeEventListener("pointerdown", handleOutsidePress, true);
	}, [isMobile, isOpen]);

	const handleSelect = (option: string) => {
		setSelectedValue(option);
		setIsOpen(false);
		onChange?.(option);
	};

	const optionsMenu = (
		<View style={styles.menu}>
			{options.map((option) => (
				<Pressable
					key={option}
					accessibilityRole="menuitem"
					onPress={() => handleSelect(option)}
					style={({ pressed }) => [
						styles.menuItem,
						option === selectedValue && styles.selectedMenuItem,
						pressed && styles.pressedMenuItem,
					]}
				>
					<Text style={styles.menuText}>{option}</Text>
				</Pressable>
			))}
		</View>
	);

	return (
		<View style={[styles.wrapper, wrapperStyle]}>
			<Pressable
				ref={selectRef}
				onPress={() => {
					if (!hasOptions) onPress?.();
					if (hasOptions) setIsOpen((current) => !current);
				}}
				disabled={disabled}
				accessibilityRole="button"
				accessibilityState={{ disabled, expanded: isOpen }}
				style={[
					styles.base,
					sizeStyles[size],
					variantStyles[variant],
					disabled && styles.disabled,
					containerStyle,
				]}
			>
				<View style={styles.valueContainer}>
					{showLeftIcon && leftIcon && <View style={styles.icon}>{leftIcon}</View>}

					<Text numberOfLines={1} style={[styles.text, textStyle]}>
						{selectedValue}
					</Text>
				</View>

				{showRightIcon && rightIcon && <View style={styles.icon}>{rightIcon}</View>}
			</Pressable>

			{hasOptions && isMobile && (
				<Modal
					visible={isOpen}
					transparent
					animationType="fade"
					onRequestClose={() => setIsOpen(false)}
				>
					<Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
						{optionsMenu}
					</Pressable>
				</Modal>
			)}

			{hasOptions && !isMobile && (
				<Modal
					visible={isOpen}
					transparent
					animationType="none"
					onRequestClose={() => setIsOpen(false)}
				>
					<View pointerEvents="box-none" style={styles.desktopOverlay}>
						{menuPosition.width > 0 && (
							<View
								ref={menuRef}
								style={[
									styles.desktopMenu,
									{
										left: menuPosition.left,
										top: menuPosition.top,
										width: menuPosition.width,
									},
								]}
							>
								{optionsMenu}
							</View>
						)}
					</View>
				</Modal>
			)}
		</View>
	);
}

const sizeStyles = StyleSheet.create({
	normal: {
		minHeight: 44,

		paddingVertical: 10,
		paddingHorizontal: 16,
	},

	compact: {
		minHeight: 32,

		paddingVertical: 4,
		paddingHorizontal: 12,
	},
});

const variantStyles = StyleSheet.create({
	filled: {
		backgroundColor: colors.background.subtle,

		borderRadius: 8,
	},

	outline: {
		backgroundColor: "transparent",

		borderWidth: 1,
		borderColor: colors.border.default,

		borderRadius: 8,
	},

	plain: {
		backgroundColor: "transparent",

		borderRadius: 8,
	},
});

const styles = StyleSheet.create({
	wrapper: {
		width: "100%",
	},
	base: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",

		gap: 8,
	},

	valueContainer: {
		flex: 1,

		flexDirection: "row",
		alignItems: "center",

		gap: 8,
	},

	icon: {
		width: 24,
		height: 24,

		alignItems: "center",
		justifyContent: "center",
	},

	text: {
		flex: 1,

		fontFamily: "Plus Jakarta Sans",
		fontWeight: "400",

		fontSize: 12,
		lineHeight: 15,

		color: colors.text.primary,
	},

	disabled: {
		opacity: 0.5,
	},
	backdrop: {
		flex: 1,
		justifyContent: "center",
		padding: 16,
		backgroundColor: "rgba(15, 23, 42, 0.22)",
	},
	menu: {
		width: "100%",
		maxWidth: 360,
		alignSelf: "center",
		paddingVertical: 6,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: 8,
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.14,
		shadowRadius: 10,
		elevation: 5,
	},
	desktopMenu: {
		position: "absolute",
		zIndex: 1000,
	},
	desktopOverlay: {
		flex: 1,
	},
	menuItem: {
		minHeight: 44,
		justifyContent: "center",
		paddingHorizontal: 16,
	},
	selectedMenuItem: {
		backgroundColor: colors.background.subtle,
	},
	pressedMenuItem: {
		opacity: 0.7,
	},
	menuText: {
		fontFamily: "Plus Jakarta Sans",
		fontSize: 14,
		lineHeight: 18,
		color: colors.text.primary,
	},
});
