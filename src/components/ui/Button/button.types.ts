import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

/* 
    Propiedades que se usan de forma global en el componente
    del Button, proposito de evitar reasignar nombre de atributes 
    iguales.
*/
interface BaseButtonProps {
	style?: StyleProp<ViewStyle>;
	disabled?: boolean;
	onPress?: () => void;
}

interface BaseWithIconProps extends BaseButtonProps {
	icon?: ReactNode;
	iconPosition?: ButtonIconPosition;
}

export interface BaseTextButtonProps extends BaseWithIconProps {
	children: string;
	size?: ButtonSize;
}

export interface ButtonGhostProps extends BaseWithIconProps {
	children: string;
}

export interface ButtonIconProps extends BaseButtonProps {
	icon: ReactNode;
	size?: ButtonIconSize;
	color?: ButtonIconColor;
}

export type ButtonProps = BaseTextButtonProps;
export type ButtonOutlineProps = BaseTextButtonProps;
export type ButtonRoundedProps = BaseTextButtonProps;

export type ButtonSize = "compact" | "normal" | "large";
export type ButtonIconSize = "small" | "normal";
export type ButtonIconColor = "primary" | "ghost";
export type ButtonIconPosition = "left" | "right";
