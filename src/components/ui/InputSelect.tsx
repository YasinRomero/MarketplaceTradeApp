import { boxShadows, colors, radius, responsive, typography } from "@/theme";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
	Modal,
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	useWindowDimensions,
	View,
	ViewStyle,
} from "react-native";

interface InputSelectProps {
	value: string;
	options?: string[];
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	iconPosition?: "left" | "right" | "both" | "none";
	size?: "normal" | "compact";
	variant?: "outline" | "filled";
	onPress?: () => void;
	onChange?: (value: string) => void;
	disabled?: boolean;
	containerStyle?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
}

interface InputOptionsProps {
	value: string;
	options: string[];
	onPress: (option: string) => void;
}

function InputOptions({ value, options, onPress }: InputOptionsProps) {
	return options.map((option) => (
		<Pressable
			key={option}
			onPress={() => onPress(option)}
			style={({ pressed }) => [
				styles.menuItem,
				option === value && styles.selectedMenuItem,
				pressed && styles.pressedMenuItem,
			]}
		>
			<Text style={styles.menuText}>{option}</Text>
		</Pressable>
	));
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
	// Validamos si el dispositivo es movil
	const { width } = useWindowDimensions();
	const isMobile = responsive.isMobile(width);

	const selectRef = useRef<View>(null);
	const selectOptionsRef = useRef<View>(null);

	const [isOpen, setIsOpen] = useState(false);
	const [positionSelectOptions, setPositionSelectOptions] = useState({ left: 0, top: 0, width: 0 });
	const [selectedValue, setSelectedValue] = useState(value);

	const showLeftIcon = iconPosition === "left" || iconPosition === "both";
	const showRightIcon = iconPosition === "right" || iconPosition === "both";
	const hasOptions = options.length > 0;

	// Se implemento un sistema de Select Custom
	// Asimismo, permitimos que el Dropdown del InputSelect cuando se hace click fuera del mismo se cierre
	useEffect(() => {
		if (!isOpen || isMobile || !selectRef.current) return;
		selectRef.current.measureInWindow((left, top, width, height) => {
			setPositionSelectOptions({ left, top: top + height + 4, width });
		});
	}, [isMobile, isOpen]);

	useEffect(() => {
		if (!isOpen || isMobile) return;

		const handleOutsidePress = (event: PointerEvent) => {
			const target = event.target as Node;
			const selectElement = selectRef.current as HTMLElement | null;
			const selectMenuElement = selectOptionsRef.current as HTMLElement | null;
			if (!selectElement || !selectMenuElement) return;
			if (!selectElement.contains(target) && !selectMenuElement.contains(target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("pointerdown", handleOutsidePress, true);
		return () => document.removeEventListener("pointerdown", handleOutsidePress, true);
	}, [isMobile, isOpen]);

	const handleSelect = (option: string) => {
		if (onChange) onChange(option);
		setSelectedValue(option);
		setIsOpen(false);
	};

	return (
		<View ref={selectRef} style={containerStyle}>
			<Pressable
				style={[
					styles.base,
					sizeStyles[size],
					variantStyles[variant],
					disabled && styles.disabled,
					containerStyle,
				]}
				disabled={disabled}
				onPress={() => {
					if (!hasOptions && onPress) onPress();
					else setIsOpen((current) => !current);
				}}
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
				<Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
					<Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
						<View style={[styles.menu, styles.mobileMenu]}>
							<InputOptions value={selectedValue} options={options} onPress={handleSelect} />
						</View>
					</Pressable>
				</Modal>
			)}

			{hasOptions && !isMobile && isOpen && positionSelectOptions.width > 0 && (
				<Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
					<View
						ref={selectOptionsRef}
						style={[
							styles.menu,
							{
								position: "absolute",
								zIndex: 9999,
								left: positionSelectOptions.left,
								top: positionSelectOptions.top,
								minWidth: positionSelectOptions.width,
							},
						]}
					>
						<InputOptions value={selectedValue} options={options} onPress={handleSelect} />
					</View>
				</Modal>
			)}
		</View>
	);
}

const sizeStyles = StyleSheet.create({
	normal: {
		paddingVertical: 10,
		paddingHorizontal: 16,
	},

	compact: {
		paddingVertical: 4,
		paddingHorizontal: 12,
	},
});

const variantStyles = StyleSheet.create({
	filled: {
		backgroundColor: colors.background.subtle,
		borderRadius: radius.md,
	},

	outline: {
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.md,
	},
});

const styles = StyleSheet.create({
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
		fontFamily: typography.family,
		fontWeight: typography.weight.regular,
		fontSize: typography.size.xs,
		lineHeight: typography.lineHeight.sm,
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
		alignSelf: "center",
		paddingVertical: 6,
		backgroundColor: colors.background.surface,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: radius.md,
		boxShadow: boxShadows.default,
		elevation: 5,
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
		fontFamily: typography.family,
		fontSize: typography.size.sm,
		lineHeight: typography.lineHeight.md,
		color: colors.text.primary,
	},

	// Mobile Responsive
	mobileMenu: {
		width: "100%",
	},
});
