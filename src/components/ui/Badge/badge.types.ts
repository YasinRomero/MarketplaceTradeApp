import { ReactNode } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

/*
    Similar al componente de Button, el objetivo fue centralizar los tipos 
    que posee el componente Badge, para evitar repetir nombres de attributes
*/
interface BaseBadgeProps {
	children: string;
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
}

export interface BadgeProps extends BaseBadgeProps {
	bordered?: boolean;
}

export interface BadgeColorProps extends BaseBadgeProps {
	color?: BadgeColorName;
}

export interface BadgeIconProps extends BaseBadgeProps {
	icon: ReactNode;
}

export type BadgeBlackProps = BaseBadgeProps;
export type BadgeOutlineProps = BaseBadgeProps;
export type BadgeWhiteProps = BaseBadgeProps;

export type BadgeColorName = "yellow" | "pink" | "orange" | "red" | "green" | "cyan" | "blue" | "purple";
